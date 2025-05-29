import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import Cookies from 'js-cookie'
import { adminSidebarData } from '@/components/layout/data/sidebar-data'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Dialog as ConfirmDialog } from '@/components/ui/dialog'

export default function Users() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const [packages, setPackages] = useState<any[]>([])
  const [form, setForm] = useState({
    name: '',
    category: '',
    fundSize: '',
    projectedReturn: '',
    riskLevel: '',
    description: '',
  })
  const [errors, setErrors] = useState({
    fundSize: '',
    projectedReturn: '',
    riskLevel: '',
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const editFormRef = useRef<HTMLFormElement>(null)
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    let valid = true
    const newErrors: typeof errors = { fundSize: '', projectedReturn: '', riskLevel: '' }
    // Only check that all fields are filled
    if (!form.fundSize.trim()) {
      newErrors.fundSize = 'Fund size is required'
      valid = false
    }
    if (!form.projectedReturn.trim()) {
      newErrors.projectedReturn = 'Projected return is required'
      valid = false
    }
    if (!form.riskLevel.trim()) {
      newErrors.riskLevel = 'Risk level is required'
      valid = false
    }
    setErrors(newErrors)
    return valid
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    setApiMessage(null)
    try {
      const response = await fetch('http://localhost:8080/api/admin/create-investment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          projectedReturn: parseFloat(form.projectedReturn.replace('%', '')),
          category: form.category,
          riskLevel: form.riskLevel,
          fundSize: form.fundSize,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        // Show success message from API or default message
        const successMessage = data.message || 'Investment package created successfully!'
        toast.success(successMessage)
        setApiMessage(successMessage)
        // Update local state
        setPackages([
          ...packages,
          { ...form, id: Date.now() },
        ])
        // Reset form
        setForm({ name: '', category: '', fundSize: '', projectedReturn: '', riskLevel: '', description: '' })
      } else {
        // Show error message from API or default message
        const errorMessage = data.message || data.responseDescription || 'Failed to create package.'
        toast.error(errorMessage)
        setApiMessage(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.'
      toast.error(errorMessage)
      setApiMessage(errorMessage)
    }
  }

  const handleEditClick = (idx: number) => {
    setEditIndex(idx)
    const pkg = packages[idx];
    setForm({
      name: pkg.name || '',
      category: pkg.category || '',
      fundSize: pkg.fundSize || '',
      projectedReturn: pkg.projectedReturn || '',
      riskLevel: pkg.riskLevel || '',
      description: pkg.description || '',
    });
    setEditDialogOpen(true);
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex === null) return;
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    setApiMessage(null);
    try {
      const investmentId = packages[editIndex].id;
      const response = await fetch(`http://localhost:8080/api/admin/update-investment/${investmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          fundSize: form.fundSize,
          projectedReturn: form.projectedReturn,
          riskLevel: form.riskLevel,
          description: form.description,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const successMessage = data.message || 'Investment updated successfully.';
        toast.success(successMessage);
        setApiMessage(successMessage);
        // Option 1: Refetch the list (recommended for consistency)
        await fetchInvestments();
        // Option 2: Update the item in state directly (uncomment if you prefer this)
        // const updated = [...packages];
        // updated[editIndex] = { ...form, id: investmentId };
        // setPackages(updated);
        setEditDialogOpen(false);
        setEditIndex(null);
      } else {
        const errorMessage = data.message || 'Failed to update investment.';
        toast.error(errorMessage);
        setApiMessage(errorMessage);
        // Keep dialog open for further editing
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      toast.error(errorMessage);
      setApiMessage(errorMessage);
    }
  };

  const handleDeleteClick = (idx: number) => {
    setDeleteIndex(idx)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteIndex === null) return
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    setApiMessage(null)
    try {
      const investmentId = packages[deleteIndex].id
      const response = await fetch(`http://localhost:8080/api/admin/delete-investment/${investmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const data = await response.json()
      if (response.ok) {
        const successMessage = data.message || 'Investment deleted successfully.'
        toast.success(successMessage)
        setApiMessage(successMessage)
        await fetchInvestments()
      } else {
        const errorMessage = data.message || 'Failed to delete investment.'
        toast.error(errorMessage)
        setApiMessage(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.'
      toast.error(errorMessage)
      setApiMessage(errorMessage)
    } finally {
      setDeleteDialogOpen(false)
      setDeleteIndex(null)
    }
  }

  const fetchInvestments = async () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    setApiMessage(null)
    try {
      const response = await fetch('http://localhost:8080/api/admin/get-investments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const data = await response.json()
      if (response.ok && data.data) {
        setPackages(data.data)
      } else {
        const errorMessage = data.message || 'Failed to fetch investments.'
        setApiMessage(errorMessage)
      }
    } catch (err) {
      setApiMessage('Network error. Please try again.')
    }
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar data={adminSidebarData} />
          <div className="ml-auto w-full max-w-full flex h-svh flex-col">
            <Header fixed>
              <Search />
              <div className='ml-auto flex items-center space-x-4'>
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </Header>
            <Main>
            {apiMessage && (
              <div className={`mb-4 p-3 rounded mx-auto max-w-2xl text-center ${
                apiMessage.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {apiMessage}
              </div>
            )}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Investment Package</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                  <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
                  <div>
                    <Input name="fundSize" value={form.fundSize} onChange={handleChange} placeholder="Fund Size" />
                  </div>
                  <div>
                    <Input name="projectedReturn" value={form.projectedReturn} onChange={handleChange} placeholder="Projected Return" />
                  </div>
                <div>
                    <select name="riskLevel" value={form.riskLevel} onChange={handleChange} className="w-full border rounded px-3 py-2">
                      <option value="">Risk Level</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="col-span-1 md:col-span-2 border rounded px-3 py-2 min-h-[40px]" />
                  <div className="col-span-1 md:col-span-2 flex justify-end">
                    <Button type="submit">Create Package</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Existing Investment Packages</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-3 py-2 text-left font-semibold">Name</th>
                        <th className="px-3 py-2 text-left font-semibold">Category</th>
                        <th className="px-3 py-2 text-left font-semibold">Fund Size</th>
                        <th className="px-3 py-2 text-left font-semibold">Projected Return</th>
                        <th className="px-3 py-2 text-left font-semibold">Risk</th>
                        <th className="px-3 py-2 text-left font-semibold">Description</th>
                        <th className="px-3 py-2 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg, idx) => (
                        <tr key={pkg.id} className="border-t">
                          <td className="px-3 py-2">{pkg.name}</td>
                          <td className="px-3 py-2">{pkg.category}</td>
                          <td className="px-3 py-2">{pkg.fundSize}</td>
                          <td className="px-3 py-2">{typeof pkg.projectedReturn === 'number' ? `+${pkg.projectedReturn}%` : pkg.projectedReturn}</td>
                          <td className="px-3 py-2">{pkg.riskLevel || pkg.risk}</td>
                          <td className="px-3 py-2">{pkg.description}</td>
                          <td className="px-3 py-2 space-x-2">
                            <button className="text-blue-600 px-2 py-1 rounded hover:bg-blue-100" onClick={() => handleEditClick(idx)}>Edit</button>
                            <button className="text-red-600 px-2 py-1 rounded hover:bg-red-100" onClick={() => handleDeleteClick(idx)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  {editDialogOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                      <form ref={editFormRef} onSubmit={handleEditSave} className="bg-white dark:bg-[#18181b] p-6 rounded shadow-lg w-full max-w-lg space-y-4">
                        <h3 className="text-lg font-semibold mb-2">Edit Investment Package</h3>
                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                        <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
                        <div>
                          <Input name="fundSize" value={form.fundSize} onChange={handleChange} placeholder="Fund Size" />
                        </div>
                        <div>
                          <Input name="projectedReturn" value={form.projectedReturn} onChange={handleChange} placeholder="Projected Return" />
                        </div>
                        <div>
                          <select name="riskLevel" value={form.riskLevel} onChange={handleChange} className="w-full border rounded px-3 py-2">
                            <option value="">Risk Level</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border rounded px-3 py-2 min-h-[80px] w-full" rows={5} />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                          <Button type="submit">Save</Button>
                        </div>
                      </form>
                    </div>
                  )}
                </Dialog>
                <ConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  {deleteDialogOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
                        <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
                        <p>Are you sure you want to delete this investment?</p>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                          <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
                        </div>
              </div>
              </div>
                  )}
                </ConfirmDialog>
              </CardContent>
            </Card>
            </Main>
          </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'users/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'All Users',
    href: 'users/all',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Roles & Permissions',
    href: 'users/roles',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Teams',
    href: 'users/teams',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Activity Log',
    href: 'users/activity',
    isActive: false,
    disabled: false,
  },
] 
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import Cookies from 'js-cookie'
import { adminSidebarData } from '@/components/layout/data/sidebar-data'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'

function mapApiUser(user: any) {
  return {
    id: user.id,
    name: user.fullName || user.username || '',
    username: user.username || '',
    fullName: user.fullName || '',
    email: user.email || '',
    regDate: user.createdAt ? user.createdAt.split('T')[0] : '',
    investments: Array.isArray(user.userActiveInvestments) ? user.userActiveInvestments.length : 0,
    enabled: user.enabled,
  }
}

function TotalUsers() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const [users, setUsers] = useState<any[]>([])
  const [nameSearch, setNameSearch] = useState('')
  const [emailSearch, setEmailSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({ username: '', fullName: '', password: '', confirmPassword: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [suspendUser, setSuspendUser] = useState<any | null>(null)
  const [suspendAction, setSuspendAction] = useState<'suspend' | 'activate' | null>(null)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [infoDialogMsg, setInfoDialogMsg] = useState('')
  const [suspendLoading, setSuspendLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      setApiMessage(null);
      try {
        const response = await fetch('http://localhost:8080/api/admin/all-users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setUsers(data.data.map(mapApiUser));
        } else {
          const errorMessage = data.message || 'Failed to fetch users.';
          setApiMessage(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        setApiMessage('Network error. Please try again.');
        toast.error('Network error. Please try again.');
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
    u.email.toLowerCase().includes(emailSearch.toLowerCase()) &&
    (filter ? u.regDate === filter : true)
  )

  const handleSuspendClick = (user: any, action: 'suspend' | 'activate') => {
    if ((action === 'suspend' && !user.enabled) || (action === 'activate' && user.enabled)) {
      setInfoDialogMsg(`User is already ${action === 'suspend' ? 'suspended' : 'active'}.`)
      setInfoDialogOpen(true)
      return
    }
    setSuspendUser(user)
    setSuspendAction(action)
    setSuspendDialogOpen(true)
  }

  const handleSuspendConfirm = async () => {
    if (!suspendUser || !suspendAction) return
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    setSuspendLoading(true)
    setApiMessage(null)
    try {
      const response = await fetch(`http://localhost:8080/api/admin/toggle-enabled/${suspendUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: suspendAction === 'activate' }),
      })
      if (response.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const data = await response.json()
      if (response.ok && data.status === 'OK') {
        const msg = suspendAction === 'suspend' ? 'User has been suspended.' : 'User is now active.'
        toast.success(data.message || msg)
        setApiMessage(data.message || msg)
        setUsers(users => users.map(u => u.id === suspendUser.id ? { ...u, enabled: suspendAction === 'activate' } : u))
      } else {
        toast.error(data.message || 'Failed to update user status.')
        setApiMessage(data.message || 'Failed to update user status.')
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
      setApiMessage('Network error. Please try again.')
    } finally {
      setSuspendLoading(false)
      setSuspendDialogOpen(false)
      setSuspendUser(null)
      setSuspendAction(null)
    }
  }

  const handleEditClick = (user: any) => {
    setEditUser(user)
    setEditForm({ username: user.username || '', fullName: user.fullName || '', password: '', confirmPassword: '' })
    setEditDialogOpen(true)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSave = async () => {
    if (!editUser) return
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    setEditLoading(true)
    setApiMessage(null)
    try {
      const response = await fetch(`http://localhost:8080/api/admin/user-update/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editForm.username,
          fullName: editForm.fullName,
          password: editForm.password,
          confirmPassword: editForm.confirmPassword,
        }),
      })
      if (response.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const data = await response.json()
      if (response.ok && data.status === 'OK') {
        toast.success(data.message || 'User updated successfully.')
        setApiMessage(data.message || 'User updated successfully.')
        setUsers(users => users.map(u => u.id === editUser.id ? { ...u, name: editForm.fullName || editForm.username, fullName: editForm.fullName, username: editForm.username } : u))
        setEditDialogOpen(false)
        setEditUser(null)
      } else {
        toast.error(data.message || 'Failed to update user.')
        setApiMessage(data.message || 'Failed to update user.')
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
      setApiMessage('Network error. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar data={adminSidebarData} />
      <div className="ml-auto w-full max-w-full flex h-svh flex-col">
        <Header fixed>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <h2 className="text-2xl font-bold mb-6">Total Registered Users</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name"
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          {apiMessage && (
            <div className="mb-4 p-3 rounded mx-auto max-w-2xl text-center bg-red-50 text-red-700">
              {apiMessage}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-left font-semibold"># Investments</th>
                  <th className="px-3 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="px-3 py-2">{user.name}</td>
                    <td className="px-3 py-2">{user.enabled ? 'Active' : 'Suspended'}</td>
                    <td className="px-3 py-2">{user.investments}</td>
                    <td className="px-3 py-2 space-x-2">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded transition-colors hover:bg-blue-700"
                        onClick={() => { setSelectedUser(user); setProfileDialogOpen(true); }}
                      >
                        View Profile
                      </button>
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded transition-colors hover:bg-green-700"
                        onClick={() => navigate(`/admin/user-history?id=${user.id}`)}
                      >
                        History
                      </button>
                      <button
                        className="bg-yellow-400 text-black px-2 py-1 rounded transition-colors hover:bg-yellow-500"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      {user.enabled ? (
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded transition-colors hover:bg-red-700"
                          onClick={() => handleSuspendClick(user, 'suspend')}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded transition-colors hover:bg-green-700"
                          onClick={() => handleSuspendClick(user, 'activate')}
                        >
                          Make Active
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
            {profileDialogOpen && selectedUser && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
                  <h3 className="text-lg font-semibold mb-2">User Profile</h3>
                  <div><b>Name:</b> {selectedUser.name}</div>
                  <div><b>Registration Date:</b> {selectedUser.regDate}</div>
                  <div><b># Investments:</b> {selectedUser.investments}</div>
                  <div><b>Status:</b> {selectedUser.enabled ? 'Active' : 'Suspended'}</div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setProfileDialogOpen(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            {editDialogOpen && editUser && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Edit User</h3>
                  <div>
                    <label className="block mb-1 font-medium">Username</label>
                    <input
                      name="username"
                      value={editForm.username}
                      onChange={handleEditFormChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Full Name</label>
                    <input
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleEditFormChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                      name="password"
                      type="password"
                      value={editForm.password}
                      onChange={handleEditFormChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={handleEditFormChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setEditDialogOpen(false)} disabled={editLoading}>Cancel</button>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleEditSave} disabled={editLoading}>
                      {editLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
          <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
            {suspendDialogOpen && suspendUser && suspendAction && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Confirm {suspendAction === 'suspend' ? 'Suspension' : 'Activation'}</h3>
                  <p>Are you sure you want to {suspendAction === 'suspend' ? 'suspend' : 'activate'} this user?</p>
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setSuspendDialogOpen(false)} disabled={suspendLoading}>Cancel</button>
                    <button className={`px-4 py-2 rounded ${suspendAction === 'suspend' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`} onClick={handleSuspendConfirm} disabled={suspendLoading}>
                      {suspendLoading ? 'Processing...' : suspendAction === 'suspend' ? 'Suspend' : 'Make Active'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
          <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
            {infoDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Info</h3>
                  <p>{infoDialogMsg}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setInfoDialogOpen(false)}>OK</button>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
        </Main>
      </div>
    </SidebarProvider>
  )
}

export default TotalUsers; 
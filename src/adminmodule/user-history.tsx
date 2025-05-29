import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import Cookies from 'js-cookie'
import { adminSidebarData } from '@/components/layout/data/sidebar-data'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useLocation } from 'react-router-dom'

function UserHistory() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const userId = parseInt(searchParams.get('id') || '')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        window.location.href = '/admin/login'
        return
      }
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`http://localhost:8080/api/admin/transactions/history/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (response.status === 401) {
          window.location.href = '/admin/login'
          return
        }
        if (response.status === 403) {
          setError('You do not have permission to view this user\'s transactions.')
          toast.error('You do not have permission to view this user\'s transactions.')
          return
        }
        if (response.status === 404) {
          setError('User not found.')
          toast.error('User not found.')
          return
        }
        if (!response.ok) {
          setError('Failed to fetch transaction history.')
          toast.error('Failed to fetch transaction history.')
          return
        }
        const data = await response.json()
        if (data.status === 'OK' && Array.isArray(data.data)) {
          setHistory(data.data)
        } else {
          const errorMessage = data.message || 'Failed to fetch transaction history.'
          setError(errorMessage)
          toast.error(errorMessage)
        }
      } catch (err) {
        setError('Network error. Please try again.')
        toast.error('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    if (!isNaN(userId)) fetchHistory()
  }, [userId])

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
          <h2 className="text-2xl font-bold mb-6">User History</h2>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-4">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-600">{error}</div>
            ) : history.length === 0 ? (
              <div className="p-4">No transactions found.</div>
            ) : (
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-3 py-2 text-left font-semibold">Type</th>
                    <th className="px-3 py-2 text-left font-semibold">Fund</th>
                    <th className="px-3 py-2 text-left font-semibold">Amount</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                    <th className="px-3 py-2 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item: any, idx: number) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-2">
                        <span className={
                          item.type === 'DEPOSIT'
                            ? 'bg-green-100 text-green-800 px-2 py-1 rounded font-semibold'
                            : item.type === 'WITHDRAWAL'
                            ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold'
                            : item.type === 'INVESTMENT'
                            ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold'
                            : ''
                        }>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-3 py-2">{item.fundName || item.fund || '-'}</td>
                      <td className="px-3 py-2">${item.amount?.toLocaleString?.() ?? item.amount}</td>
                      <td className="px-3 py-2">
                        <span className={
                          item.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 px-2 py-1 rounded font-semibold'
                            : item.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold'
                            : item.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 px-2 py-1 rounded font-semibold'
                            : ''
                        }>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Main>
      </div>
    </SidebarProvider>
  )
}

export default UserHistory; 
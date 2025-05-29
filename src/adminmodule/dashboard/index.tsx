
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import Cookies from 'js-cookie'
import { adminSidebarData } from '@/components/layout/data/sidebar-data'
import { IconUsers, IconChecklist, IconPackages, IconLayoutDashboard, IconBrowserCheck } from '@tabler/icons-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'




export default function Dashboard() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const [stats, setStats] = useState<any>(null)
  const [graph, setGraph] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        window.location.href = '/admin/login'
        return
      }
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('http://localhost:8080/api/admin/dashboard-data', {
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
        if (!response.ok) {
          setError('Failed to fetch dashboard data.')
          toast.error('Failed to fetch dashboard data.')
          setLoading(false)
          return
        }
        const data = await response.json()
        setStats(data)
        setGraph(Array.isArray(data.graphData) ? data.graphData : [])
        setShowWelcome(true)
      } catch (err) {
        setError('Network error. Please try again.')
        toast.error('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar data={adminSidebarData} />
        <div className="ml-auto w-full max-w-full peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)] peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))] sm:transition-[width] sm:duration-200 sm:ease-linear flex h-svh flex-col group-data-[scroll-locked=1]/body:h-full has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh">
          {/* ===== Top Heading ===== */}
          <Header>
            <div className='flex items-center w-full'>
              {/* Sidebar icon is handled by AppSidebar, so nothing needed here */}
              <div className='ml-auto flex items-center space-x-4'>
                <ThemeSwitch />
              </div>
            </div>
          </Header>

          {/* ===== Main ===== */}
          <Main>
            <div className='mb-2 flex items-center justify-between space-y-2'>
              <h1 className='text-2xl font-bold tracking-tight'>Admin Dashboard</h1>
            </div>
            {showWelcome && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded shadow text-center text-lg font-semibold">
                Welcome to the Admin Dashboard!
                <button className="ml-4 px-3 py-1 bg-green-600 text-white rounded" onClick={() => setShowWelcome(false)}>Dismiss</button>
              </div>
            )}
            {loading ? (
              <div className="p-4">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-600">{error}</div>
            ) : stats ? (
              <div className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Total Registered Users</CardTitle>
                      <IconUsers className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>{stats.totalUsers?.toLocaleString?.() ?? stats.totalUsers}</div>
                      <p className='text-muted-foreground text-xs'>All users in the system</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Active Investments</CardTitle>
                      <IconChecklist className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>{stats.activeInvestments?.toLocaleString?.() ?? stats.activeInvestments}</div>
                      <p className='text-muted-foreground text-xs'>Currently active</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Total Deposits</CardTitle>
                      <IconPackages className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>${stats.totalDeposits?.toLocaleString?.() ?? stats.totalDeposits}</div>
                      <p className='text-muted-foreground text-xs'>All-time deposits</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Total Withdrawals</CardTitle>
                      <IconPackages className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>${stats.totalWithdrawals?.toLocaleString?.() ?? stats.totalWithdrawals}</div>
                      <p className='text-muted-foreground text-xs'>All-time withdrawals</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Average Overall Return</CardTitle>
                      <IconLayoutDashboard className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>{stats.averageReturn}</div>
                      <p className='text-muted-foreground text-xs'>Across all investments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Web Traffic</CardTitle>
                      <IconBrowserCheck className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>{stats.webTraffic?.toLocaleString?.() ?? stats.webTraffic}</div>
                      <p className='text-muted-foreground text-xs'>Visits this month</p>
                    </CardContent>
                  </Card>
                </div>
                <div className='grid grid-cols-1 gap-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Visits This Week</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                      <div className='h-64 w-full'>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={graph} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="webTraffic" stroke="#8884d8" name="Visitors" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
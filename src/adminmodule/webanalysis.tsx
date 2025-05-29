import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useState, useEffect } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { apps } from '@/features/apps/data/apps'
import Cookies from 'js-cookie'
import { adminSidebarData } from '@/components/layout/data/sidebar-data'
import { Card, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { toast } from 'sonner'

const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

// Devices data will be fetched from API

// Countries data will be fetched from API

// Latest logins will be fetched from API

const deviceColors = ['#8884d8', '#82ca9d'];

export default function AdminAppsAnalytics() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [graph, setGraph] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [devicesData, setDevicesData] = useState<any[]>([])
  const [countriesData, setCountriesData] = useState<any[]>([])
  const [latestLogins, setLatestLogins] = useState<any[]>([])
  const [statsError, setStatsError] = useState<string | null>(null)

  const filteredApps = apps
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      appType === 'connected'
        ? app.connected
        : appType === 'notConnected'
          ? !app.connected
          : true
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    const fetchGraph = async () => {
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
          setError('Failed to fetch analytics data.')
          toast.error('Failed to fetch analytics data.')
          setLoading(false)
          return
        }
        const data = await response.json()
        setGraph(Array.isArray(data.graphData) ? data.graphData : [])
      } catch (err) {
        setError('Network error. Please try again.')
        toast.error('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchGraph()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        window.location.href = '/admin/login'
        return
      }
      setStatsError(null)
      try {
        const response = await fetch('http://localhost:8080/api/auth/login-stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (response.status === 401) {
          setStatsError('Unauthorized. Please login again.')
          window.location.href = '/admin/login'
          return
        }
        if (!response.ok) {
          setStatsError('Failed to fetch login stats.')
          toast.error('Failed to fetch login stats.')
          return
        }
        const data = await response.json()
        setDevicesData([
          { name: 'Desktop', value: data.desktopLogins || 0 },
          { name: 'Mobile', value: data.mobileLogins || 0 },
        ])
        setCountriesData(
          Object.entries(data.loginsByCountry || {}).map(([country, visitors]) => ({ country, visitors }))
        )
        setLatestLogins(
          (data.last5UniqueUserLogins || []).map((login: any) => ({
            user: login.username,
            country: login.country,
            device: login.device,
            time: login.loginTime ? new Date(login.loginTime).toLocaleString() : '',
          }))
        )
      } catch (err) {
        setStatsError('Network error. Please try again.')
        toast.error('Network error. Please try again.')
      }
    }
    fetchStats()
  }, [])

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar data={adminSidebarData} />
        <div className="ml-auto w-full max-w-full flex h-svh flex-col">
          {/* ===== Top Heading ===== */}
          <Header fixed>
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>

          {/* ===== Content ===== */}
          <Main>
            <h2 className="text-2xl font-bold mb-6">Web Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Visits This Week</h3>
                  {loading ? (
                    <div className="p-4">Loading...</div>
                  ) : error ? (
                    <div className="p-4 text-red-600">{error}</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={graph} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="webTraffic" stroke="#8884d8" name="Visitors" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Devices</h3>
                  {statsError ? (
                    <div className="p-4 text-red-600">{statsError}</div>
                  ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={devicesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {devicesData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={deviceColors[idx % deviceColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Countries of Origin</h3>
                  {statsError ? (
                    <div className="p-4 text-red-600">{statsError}</div>
                  ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={countriesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
                    </BarChart>
                  </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Latest Logins</h3>
                  {statsError ? (
                    <div className="p-4 text-red-600">{statsError}</div>
                  ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-3 py-2 text-left font-semibold">User</th>
                          <th className="px-3 py-2 text-left font-semibold">Country</th>
                          <th className="px-3 py-2 text-left font-semibold">Device</th>
                          <th className="px-3 py-2 text-left font-semibold">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestLogins.map((login, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-3 py-2">{login.user}</td>
                            <td className="px-3 py-2">{login.country}</td>
                            <td className="px-3 py-2">{login.device}</td>
                            <td className="px-3 py-2">{login.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
} 
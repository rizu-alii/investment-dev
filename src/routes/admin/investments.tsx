import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import Cookies from 'js-cookie'
import { adminSidebarData } from '@/components/layout/data/sidebar-data'
import { useState } from 'react'
import AdminInvestments from '@/features/admin/investments'

const demoInvestments = [
  { id: 1, user: 'John Doe', fund: 'Prudential FMCG Fund', amount: 10000, date: '2024-05-20', status: 'New' },
  { id: 2, user: 'Jane Smith', fund: 'Index Sensex Direct', amount: 5000, date: '2024-05-19', status: 'New' },
  { id: 3, user: 'Alice Johnson', fund: 'Growth Equity Fund', amount: 8000, date: '2024-05-18', status: 'New' },
]

function AdminInvestments() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const [investments] = useState(demoInvestments)

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
          <h2 className="text-2xl font-bold mb-6">New Investments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left font-semibold">User</th>
                  <th className="px-3 py-2 text-left font-semibold">Fund</th>
                  <th className="px-3 py-2 text-left font-semibold">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold">Date</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map(inv => (
                  <tr key={inv.id} className="border-t">
                    <td className="px-3 py-2">{inv.user}</td>
                    <td className="px-3 py-2">{inv.fund}</td>
                    <td className="px-3 py-2">${inv.amount.toLocaleString()}</td>
                    <td className="px-3 py-2">{inv.date}</td>
                    <td className="px-3 py-2 text-blue-600">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Main>
      </div>
    </SidebarProvider>
  )
}

export default AdminInvestments; 
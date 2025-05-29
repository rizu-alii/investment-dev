import { useEffect, useState } from 'react';
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
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UserDashboard() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/user/dashboard', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
          return;
        }
        const data = await response.json();
        if (response.ok && data.data) {
          setDashboard(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch dashboard data.');
        }
      } catch (err) {
        toast.error('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    const fetchTransactions = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return;
      }
      setTransactionsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/user/transactions/dashboard/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
          return;
        }
        const data = await response.json();
        if (response.ok && data.data) {
          setTransactions(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch transactions.');
        }
      } catch (err) {
        toast.error('Network error. Please try again.');
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchDashboard();
    fetchTransactions();
  }, []);

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
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
              <h1 className='text-2xl font-bold tracking-tight'>User Dashboard</h1>
            </div>
            <div className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Investment</CardTitle>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='text-muted-foreground h-4 w-4'><path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' /></svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {loading ? '...' : `$${dashboard?.totalInvestment?.toLocaleString() || 0}`}
                    </div>
                    <p className='text-muted-foreground text-xs'>Total amount invested</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Withdraw</CardTitle>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='text-muted-foreground h-4 w-4'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' /><circle cx='9' cy='7' r='4' /><path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' /></svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {loading ? '...' : `$${dashboard?.totalWithdraw?.toLocaleString() || 0}`}
                    </div>
                    <p className='text-muted-foreground text-xs'>Total amount withdrawn</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Current Profit</CardTitle>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='text-muted-foreground h-4 w-4'><rect width='20' height='14' x='2' y='5' rx='2' /><path d='M2 10h20' /></svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {loading ? '...' : `$${dashboard?.totalProfit?.toLocaleString() || 0}`}
                    </div>
                    <p className='text-muted-foreground text-xs'>Current profit from investments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Active Investments</CardTitle>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='text-muted-foreground h-4 w-4'><path d='M22 12h-4l-3 9L9 3l-3 9H2' /></svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {loading ? '...' : dashboard?.activeInvestments || 0}
                    </div>
                    <p className='text-muted-foreground text-xs'>Number of active investments</p>
                  </CardContent>
                </Card>
              </div>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-7'>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className='pl-2'>
                    {transactionsLoading ? (
                      <div>Loading...</div>
                    ) : transactions.length === 0 ? (
                      <div>No recent transactions found.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="px-3 py-2 text-left font-semibold">Date</th>
                              <th className="px-3 py-2 text-left font-semibold">Type</th>
                              <th className="px-3 py-2 text-left font-semibold">Amount</th>
                              <th className="px-3 py-2 text-left font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((tx: any) => (
                              <tr key={tx.id} className="border-t">
                                <td className="px-3 py-2">{tx.createdAt ? format(new Date(tx.createdAt), 'yyyy-MM-dd HH:mm:ss') : ''}</td>
                                <td className="px-3 py-2">
                                  <span className={
                                    tx.type === 'DEPOSIT'
                                      ? 'bg-green-100 text-green-800 px-2 py-1 rounded font-semibold'
                                      : tx.type === 'WITHDRAWAL'
                                      ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold'
                                      : ''
                                  }>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="px-3 py-2">{tx.amount}</td>
                                <td className="px-3 py-2">
                                  <span className={
                                    tx.status === 'COMPLETED'
                                      ? 'bg-green-100 text-green-800 px-2 py-1 rounded font-semibold'
                                      : tx.status === 'PENDING'
                                      ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold'
                                      : tx.status === 'REJECTED'
                                      ? 'bg-red-100 text-red-800 px-2 py-1 rounded font-semibold'
                                      : ''
                                  }>
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

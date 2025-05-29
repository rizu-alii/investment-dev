import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { adminSidebarData } from '@/components/layout/data/sidebar-data';

function AdminWithdrawals() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchWithdrawals = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('http://localhost:8080/api/admin/withdrawals/pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!response.ok) {
        setError('Failed to fetch pending withdrawals.');
        toast.error('Failed to fetch pending withdrawals.');
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setWithdrawals(data);
        setSuccess('Pending withdrawals fetched successfully.');
        toast.success('Pending withdrawals fetched successfully.');
      } else {
        setError('Unexpected response format.');
        toast.error('Unexpected response format.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (transactionId: number, approved: boolean) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    setActionLoading(transactionId);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`http://localhost:8080/api/admin/withdrawals/update-status/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      });
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'OK') {
        toast.success(data.message || 'Withdrawal status updated successfully.');
        setSuccess(data.message || 'Withdrawal status updated successfully.');
        fetchWithdrawals();
      } else {
        toast.error(data.message || 'Failed to update withdrawal status.');
        setError(data.message || 'Failed to update withdrawal status.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
      setError('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

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
          <h2 className="text-2xl font-bold mb-6">Withdrawal Requests</h2>
          {loading && <div className="p-4">Loading...</div>}
          {error && <div className="p-4 text-red-600">{error}</div>}
          {success && <div className="p-4 text-green-600">{success}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left font-semibold">User</th>
                  <th className="px-3 py-2 text-left font-semibold">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold">Date</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w.transactionId} className="border-t">
                    <td className="px-3 py-2">{w.fullName || `User #${w.userId}`}</td>
                    <td className="px-3 py-2">${w.amount?.toLocaleString?.() ?? w.amount}</td>
                    <td className="px-3 py-2">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-3 py-2">
                      <span className={
                        w.status === 'PENDING' ? 'text-yellow-600' :
                        w.status === 'COMPLETE' ? 'text-green-600' :
                        w.status === 'REJECTED' ? 'text-red-600' : ''
                      }>{w.status}</span>
                    </td>
                    <td className="px-3 py-2 space-x-2">
                      {w.status === 'PENDING' && (
                        <>
                          <button className="px-2 py-1 bg-green-100 text-green-700 rounded" onClick={() => handleAction(w.transactionId, true)} disabled={actionLoading === w.transactionId}>
                            {actionLoading === w.transactionId ? 'Processing...' : 'Accept'}
                          </button>
                          <button className="px-2 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleAction(w.transactionId, false)} disabled={actionLoading === w.transactionId}>
                            {actionLoading === w.transactionId ? 'Processing...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Main>
      </div>
    </SidebarProvider>
  );
}

export default AdminWithdrawals; 
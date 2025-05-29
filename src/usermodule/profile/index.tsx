import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { SearchProvider } from '@/context/search-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import Cookies from 'js-cookie';

export default function UserProfile() {
  const navigate = useNavigate();
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/sign-in');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
          navigate('/sign-in');
          return;
        }
        const data = await response.json();
        if (response.ok && data.username) {
          setForm(f => ({ ...f, username: data.username, fullName: data.fullName || '' }));
        } else {
          toast.error(data.message || 'Failed to fetch profile.');
        }
      } catch (err) {
        toast.error('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/sign-in');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (response.status === 401) {
        navigate('/sign-in');
        return;
      }
      const data = await response.text();
      if (response.ok) {
        toast.success(data || 'Profile updated successfully.');
        setMessage(data || 'Profile updated successfully.');
        setMessageType('success');
        setForm(f => ({ ...f, newPassword: '', confirmPassword: '' }));
      } else {
        toast.error(data || 'Failed to update profile.');
        setMessage(data || 'Failed to update profile.');
        setMessageType('error');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div className="ml-auto w-full max-w-full flex h-svh flex-col">
          <Header fixed />
          <Main>
            <div className="flex justify-center items-center min-h-[60vh]">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  {message && (
                    <div className={`mb-2 p-2 rounded text-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">Username</label>
                      <Input name="username" value={form.username} onChange={handleChange} disabled={loading} />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Full Name</label>
                      <Input name="fullName" value={form.fullName} onChange={handleChange} disabled={loading} />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">New Password</label>
                      <div className="relative">
                        <Input
                          name="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={form.newPassword}
                          onChange={handleChange}
                          disabled={loading}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(v => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Confirm Password</label>
                      <div className="relative">
                        <Input
                          name="confirmPassword"
                          type={showConfirm ? 'text' : 'password'}
                          value={form.confirmPassword}
                          onChange={handleChange}
                          disabled={loading}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirm(v => !v)}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>Update Profile</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
} 
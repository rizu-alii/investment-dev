import { HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'


type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use window.location.pathname to check current route
  const isAdminLogin = typeof window !== 'undefined' && window.location.pathname === '/admin/login'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    try {
      if (isAdminLogin) {
        // Admin login: call backend
        const response = await fetch('http://localhost:8080/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })
        if (response.status === 200) {
          const data = await response.json();
          if (data.jwtToken) {
            const rawToken = data.jwtToken.startsWith('Bearer ') ? data.jwtToken.slice(7) : data.jwtToken;
            localStorage.setItem('jwtToken', rawToken);
            window.location.href = '/admin/dashboard';
          } else {
            setError('Login failed: No token received.');
          }
        } else {
          const data = await response.json().catch(() => ({}))
          setError(data.message || 'Invalid admin credentials.')
        }
      } else {
        // User login: call backend
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })
        if (response.status === 200) {
          const data = await response.json();
          if (data.jwtToken) {
            const rawToken = data.jwtToken.startsWith('Bearer ') ? data.jwtToken.slice(7) : data.jwtToken;
            localStorage.setItem('jwtToken', rawToken);
            window.location.href = '/user/dashboard';
          } else {
            setError('Login failed: No token received.');
          }
        } else {
          const data = await response.json().catch(() => ({}))
          setError(data.message || 'Login failed.')
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn('grid gap-3', className)} {...props}>
      <div>
        <label className="block mb-1 font-medium">Username</label>
        <Input name='username' placeholder='username' required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <PasswordInput name='password' placeholder='********' required />
      </div>
      <div className='relative'>
        {/* Forgot password link removed */}
      </div>
      {error && <div className='text-red-600 text-sm'>{error}</div>}
      <Button className='mt-2' disabled={isLoading} type='submit'>
        Sign In
      </Button>
    </form>
  )
}

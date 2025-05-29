import { HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // No validation, just use uncontrolled form
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (response.status === 201) {
        setSuccess('Registration successful! You can now log in.')
      } else {
        const msg = await response.text()
        setError(msg || 'Registration failed.')
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
      {error && <div className='text-red-600 text-sm'>{error}</div>}
      {success && <div className='text-green-600 text-sm'>{success}</div>}
      <Button className='mt-2' disabled={isLoading} type='submit'>
        Create Account
      </Button>
    </form>
  )
}

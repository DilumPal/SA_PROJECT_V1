import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { userApi } from '../api'

function LoginPage() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [error, setError] = useState('')

    const mutation = useMutation({
        mutationFn: userApi.login, // Ensure this exists in your api.ts
        onSuccess: (data) => {
            // Store user info as seen in your HomePage.tsx logic
            localStorage.setItem('userId', String(data.id))
            localStorage.setItem('role', data.role)
            
            if (data.role === 'ADMIN' || data.role === 'EMPLOYEE') {
                navigate('/employee')
            } else {
                navigate('/home')
            }
        },
        onError: (err: any) => {
            setError(err.message || 'Invalid username or password')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!credentials.username || !credentials.password) {
            setError('Please fill in all fields')
            return
        }
        mutation.mutate(credentials)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Login</h1>
                
                {error && (
                    <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded text-center">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
                    <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {mutation.isPending ? 'Signing in...' : 'Login'}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default LoginPage
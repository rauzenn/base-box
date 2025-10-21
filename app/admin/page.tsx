'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in sessionStorage
        sessionStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (error) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0052FF] to-[#00D395] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Enter password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-8 border-2 border-[#0052FF]/30">
          <div className="mb-6">
            <label className="block text-white font-bold mb-3">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-black/60 text-white pl-12 pr-4 py-4 rounded-xl border-2 border-[#0052FF]/20 focus:border-[#0052FF] outline-none transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white py-4 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 transition-all"
          >
            {loading ? 'Logging in...' : 'Access Admin Panel'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Base Box Admin • Secure Access
        </p>
      </div>
    </div>
  );
}
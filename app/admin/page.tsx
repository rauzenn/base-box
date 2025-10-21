'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔑 Attempting login...');
      
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      console.log('📥 Login response:', data);

      if (data.success && data.token) {
        console.log('✅ Login successful! Token:', data.token);
        
        // Save token to localStorage
        localStorage.setItem('adminToken', data.token);
        
        // Redirect to dashboard
        console.log('🚀 Redirecting to dashboard...');
        router.push('/admin/dashboard');
        
      } else {
        console.error('❌ Login failed:', data.message);
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <Lock className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400 font-medium">Enter password to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-8 shadow-2xl">
            
            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-12 pr-4 py-4 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0052FF] transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-500/50 disabled:shadow-none transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Base Box Admin • Secure Access
        </p>
      </div>
    </div>
  );
}
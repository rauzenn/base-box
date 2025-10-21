'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Lock, Unlock, Users, RefreshCw, LogOut, Trash2, Eye } from 'lucide-react';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

interface AdminStats {
  totalCapsules: number;
  lockedCapsules: number;
  revealedCapsules: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalCapsules: 0,
    lockedCapsules: 0,
    revealedCapsules: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'locked' | 'revealed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('🔍 Dashboard mounted, checking auth...');
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      console.log('❌ No token found, redirecting to login...');
      router.push('/admin');
      return;
    }
    
    console.log('✅ Token found, fetching capsules...');
    fetchCapsules();
  }, [router]);

  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      console.log('📡 Fetching from /api/admin/capsules...');
      
      const response = await fetch('/api/admin/capsules', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success) {
        setCapsules(data.capsules || []);
        setStats(data.stats || {
          totalCapsules: 0,
          lockedCapsules: 0,
          revealedCapsules: 0,
          totalUsers: 0
        });
        console.log('✅ Data loaded successfully');
      } else {
        console.error('❌ API returned error:', data.message);
        if (response.status === 401) {
          console.log('🚪 Unauthorized, redirecting to login...');
          router.push('/admin');
        }
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (capsuleId: string) => {
    if (!confirm('Are you sure you want to delete this capsule?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/capsules/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ capsuleId })
      });

      const data = await response.json();

      if (data.success) {
        alert('Capsule deleted successfully!');
        fetchCapsules();
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting capsule:', error);
      alert('Error deleting capsule');
    }
  };

  const handleReveal = async (capsuleId: string) => {
    if (!confirm('Force reveal this capsule?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/capsules/reveal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ capsuleId })
      });

      const data = await response.json();

      if (data.success) {
        alert('Capsule revealed successfully!');
        fetchCapsules();
      } else {
        alert(`Failed to reveal: ${data.message}`);
      }
    } catch (error) {
      console.error('Error revealing capsule:', error);
      alert('Error revealing capsule');
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const filteredCapsules = capsules.filter(capsule => {
    if (filter === 'locked' && capsule.revealed) return false;
    if (filter === 'revealed' && !capsule.revealed) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        capsule.id.toLowerCase().includes(query) ||
        capsule.fid.toString().includes(query) ||
        capsule.message.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[#000814] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-gray-400">Manage all capsules</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchCapsules}
            disabled={loading}
            className="px-6 py-3 bg-[#0052FF] rounded-xl font-bold flex items-center gap-2 hover:bg-[#0052FF]/80 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-blue-500/20 rounded-2xl p-6">
          <Package className="w-8 h-8 text-blue-500 mb-3" />
          <div className="text-4xl font-black text-blue-500 mb-2">{stats.totalCapsules}</div>
          <div className="text-gray-400 font-medium">Total Capsules</div>
        </div>

        <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-yellow-500/20 rounded-2xl p-6">
          <Lock className="w-8 h-8 text-yellow-500 mb-3" />
          <div className="text-4xl font-black text-yellow-500 mb-2">{stats.lockedCapsules}</div>
          <div className="text-gray-400 font-medium">Locked</div>
        </div>

        <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/20 rounded-2xl p-6">
          <Unlock className="w-8 h-8 text-green-500 mb-3" />
          <div className="text-4xl font-black text-green-500 mb-2">{stats.revealedCapsules}</div>
          <div className="text-gray-400 font-medium">Revealed</div>
        </div>

        <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-purple-500/20 rounded-2xl p-6">
          <Users className="w-8 h-8 text-purple-500 mb-3" />
          <div className="text-4xl font-black text-purple-500 mb-2">{stats.totalUsers}</div>
          <div className="text-gray-400 font-medium">Users</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-bold ${
                filter === 'all' 
                  ? 'bg-[#0052FF] text-white' 
                  : 'bg-[#1A1F2E] text-gray-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-6 py-3 rounded-xl font-bold ${
                filter === 'locked' 
                  ? 'bg-[#0052FF] text-white' 
                  : 'bg-[#1A1F2E] text-gray-400'
              }`}
            >
              Locked
            </button>
            <button
              onClick={() => setFilter('revealed')}
              className={`px-6 py-3 rounded-xl font-bold ${
                filter === 'revealed' 
                  ? 'bg-[#0052FF] text-white' 
                  : 'bg-[#1A1F2E] text-gray-400'
              }`}
            >
              Revealed
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by FID, ID, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 py-3 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0052FF]"
          />
        </div>
      </div>

      {/* Capsules Table */}
      <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0052FF]/10">
            <tr>
              <th className="px-6 py-4 text-left font-bold">ID</th>
              <th className="px-6 py-4 text-left font-bold">FID</th>
              <th className="px-6 py-4 text-left font-bold">Message</th>
              <th className="px-6 py-4 text-left font-bold">Unlock Date</th>
              <th className="px-6 py-4 text-left font-bold">Status</th>
              <th className="px-6 py-4 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Loading capsules...
                </td>
              </tr>
            ) : filteredCapsules.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No capsules found
                </td>
              </tr>
            ) : (
              filteredCapsules.map((capsule) => (
                <tr key={capsule.id} className="border-t border-gray-800 hover:bg-[#0052FF]/5">
                  <td className="px-6 py-4 font-mono text-sm">{capsule.id}</td>
                  <td className="px-6 py-4 font-bold">{capsule.fid}</td>
                  <td className="px-6 py-4 max-w-md truncate">{capsule.message}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(capsule.unlockDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {capsule.revealed ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-sm font-bold">
                        🔓 REVEALED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-lg text-sm font-bold">
                        🔒 LOCKED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!capsule.revealed && (
                        <button
                          onClick={() => handleReveal(capsule.id)}
                          className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30"
                          title="Force Reveal"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(capsule.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
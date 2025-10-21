'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Package, Trash2, Unlock, RefreshCw, LogOut, Search } from 'lucide-react';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export default function AdminDashboard() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'locked' | 'revealed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check auth
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetchAllCapsules();
  }, []);

  const fetchAllCapsules = async () => {
    try {
      const response = await fetch('/api/admin/capsules');
      const data = await response.json();
      setCapsules(data.capsules || []);
    } catch (error) {
      console.error('Failed to fetch capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (capsuleId: string, fid: number) => {
    if (!confirm('Are you sure you want to delete this capsule?')) return;

    try {
      const response = await fetch('/api/admin/capsules/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capsuleId, fid }),
      });

      if (response.ok) {
        setCapsules(capsules.filter(c => c.id !== capsuleId));
        alert('✅ Capsule deleted!');
      } else {
        alert('❌ Delete failed');
      }
    } catch (error) {
      alert('❌ Delete error');
    }
  };

  const handleForceReveal = async (capsuleId: string) => {
    if (!confirm('Force reveal this capsule?')) return;

    try {
      const response = await fetch('/api/admin/capsules/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capsuleId }),
      });

      if (response.ok) {
        fetchAllCapsules();
        alert('✅ Capsule revealed!');
      }
    } catch (error) {
      alert('❌ Reveal failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const filteredCapsules = capsules
    .filter(c => {
      if (filter === 'locked') return !c.revealed;
      if (filter === 'revealed') return c.revealed;
      return true;
    })
    .filter(c => 
      c.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.includes(searchTerm) ||
      c.fid.toString().includes(searchTerm)
    );

  const stats = {
    total: capsules.length,
    locked: capsules.filter(c => !c.revealed).length,
    revealed: capsules.filter(c => c.revealed).length,
    users: new Set(capsules.map(c => c.fid)).size,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0052FF] to-[#00D395] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage all capsules</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAllCapsules}
              className="flex items-center gap-2 bg-[#0052FF] text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#0052FF]/30">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-6 h-6 text-[#0052FF]" />
              <span className="text-4xl font-black text-[#0052FF]">{stats.total}</span>
            </div>
            <div className="text-gray-400 font-bold">Total Capsules</div>
          </div>

          <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#FFB800]/30">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-6 h-6 text-[#FFB800]" />
              <span className="text-4xl font-black text-[#FFB800]">{stats.locked}</span>
            </div>
            <div className="text-gray-400 font-bold">Locked</div>
          </div>

          <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#00D395]/30">
            <div className="flex items-center justify-between mb-2">
              <Unlock className="w-6 h-6 text-[#00D395]" />
              <span className="text-4xl font-black text-[#00D395]">{stats.revealed}</span>
            </div>
            <div className="text-gray-400 font-bold">Revealed</div>
          </div>

          <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#9D4EDD]/30">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-[#9D4EDD]" />
              <span className="text-4xl font-black text-[#9D4EDD]">{stats.users}</span>
            </div>
            <div className="text-gray-400 font-bold">Users</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'locked', 'revealed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  filter === f
                    ? 'bg-[#0052FF] text-white'
                    : 'bg-black/50 text-gray-400 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by FID, ID, or message..."
              className="w-full bg-black/60 text-white pl-12 pr-4 py-2 rounded-xl border-2 border-[#0052FF]/20 focus:border-[#0052FF] outline-none"
            />
          </div>
        </div>

        {/* Capsules Table */}
        <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl border-2 border-[#0052FF]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40">
                <tr>
                  <th className="text-left text-gray-400 font-bold p-4">ID</th>
                  <th className="text-left text-gray-400 font-bold p-4">FID</th>
                  <th className="text-left text-gray-400 font-bold p-4">Message</th>
                  <th className="text-left text-gray-400 font-bold p-4">Unlock Date</th>
                  <th className="text-left text-gray-400 font-bold p-4">Status</th>
                  <th className="text-right text-gray-400 font-bold p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCapsules.map((capsule) => (
                  <tr key={capsule.id} className="border-t border-gray-800 hover:bg-black/20">
                    <td className="p-4 text-gray-400 font-mono text-sm">{capsule.id.slice(0, 12)}...</td>
                    <td className="p-4 text-white font-bold">{capsule.fid}</td>
                    <td className="p-4 text-gray-300 max-w-xs truncate">{capsule.message}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(capsule.unlockDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        capsule.revealed
                          ? 'bg-[#00D395]/20 text-[#00D395]'
                          : 'bg-[#0052FF]/20 text-[#0052FF]'
                      }`}>
                        {capsule.revealed ? 'REVEALED' : 'LOCKED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        {!capsule.revealed && (
                          <button
                            onClick={() => handleForceReveal(capsule.id)}
                            className="p-2 bg-[#00D395]/20 text-[#00D395] rounded-lg hover:bg-[#00D395]/30 transition-all"
                            title="Force Reveal"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(capsule.id, capsule.fid)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCapsules.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No capsules found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
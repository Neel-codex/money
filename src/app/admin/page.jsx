'use client';

import { useState, useEffect } from "react";
import { Key, Plus, Users, CheckCircle, Clock, Copy, Eye, EyeOff, Filter, Download } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('generate');
  const [formData, setFormData] = useState({
    count: 1,
    prefix: 'USDT-FLASH'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState([]);
  
  // Keys list state
  const [keys, setKeys] = useState([]);
  const [stats, setStats] = useState({ total_keys: 0, used_keys: 0, unused_keys: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showKeys, setShowKeys] = useState({});

  const fetchKeys = async () => {
    try {
      const response = await fetch(`/api/admin/generate-key?page=${currentPage}&status=${statusFilter}`);
      const data = await response.json();
      
      if (response.ok) {
        setKeys(data.keys);
        setStats(data.stats);
        setTotalPages(Math.ceil(data.total / data.limit));
      }
    } catch (error) {
      console.error('Error fetching keys:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchKeys();
    }
  }, [activeTab, currentPage, statusFilter]);

  const handleGenerateKeys = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate keys');
      }

      setSuccess(data.message);
      setGeneratedKeys(data.keys);
      // Reset form
      setFormData({ count: 1, prefix: 'USDT-FLASH' });

    } catch (error) {
      console.error('Key generation error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportKeys = () => {
    const csvContent = [
      ['Key Code', 'Status', 'Created At', 'Used By', 'Used At'],
      ...keys.map(key => [
        key.key_code,
        key.is_used ? 'Used' : 'Unused',
        new Date(key.created_at).toLocaleDateString(),
        key.telegram_contact || '-',
        key.used_at ? new Date(key.used_at).toLocaleDateString() : '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activation-keys-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleKeyVisibility = (keyId) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#00d4aa] rounded-lg flex items-center justify-center mr-3">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold">USDT Flash - Admin Panel</span>
          </div>
          <div className="text-sm text-gray-400">
            Administrator Dashboard
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#262626] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'generate' 
                ? 'bg-[#00d4aa] text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Keys
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'manage' 
                ? 'bg-[#00d4aa] text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 mr-2" />
            Manage Keys
          </button>
        </div>

        {/* Stats Cards */}
        {activeTab === 'manage' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Keys</p>
                  <p className="text-2xl font-bold">{stats.total_keys}</p>
                </div>
                <Key className="w-8 h-8 text-[#00d4aa]" />
              </div>
            </div>
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Used Keys</p>
                  <p className="text-2xl font-bold text-green-500">{stats.used_keys}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Available Keys</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.unused_keys}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Generate Keys Tab */}
        {activeTab === 'generate' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Generate Activation Keys</h1>
            
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-8">
              <form onSubmit={handleGenerateKeys} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <span className="text-red-500 text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
                    <span className="text-green-500 text-sm">{success}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Keys
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.count}
                      onChange={(e) => setFormData({...formData, count: parseInt(e.target.value)})}
                      className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:border-[#00d4aa] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Key Prefix
                    </label>
                    <input
                      type="text"
                      value={formData.prefix}
                      onChange={(e) => setFormData({...formData, prefix: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:border-[#00d4aa] focus:outline-none transition-colors"
                      placeholder="USDT-FLASH"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || formData.count < 1}
                  className="w-full bg-[#00d4aa] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#26a69a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : `Generate ${formData.count} Key${formData.count > 1 ? 's' : ''}`}
                </button>
              </form>

              {/* Generated Keys Display */}
              {generatedKeys.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#3a3a3a]">
                  <h3 className="text-lg font-bold mb-4">Generated Keys</h3>
                  <div className="space-y-2">
                    {generatedKeys.map((key, index) => (
                      <div key={index} className="flex items-center justify-between bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-3">
                        <span className="font-mono text-sm text-[#00d4aa]">{key.key_code}</span>
                        <button
                          onClick={() => copyToClipboard(key.key_code)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manage Keys Tab */}
        {activeTab === 'manage' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Manage Activation Keys</h1>
              <button
                onClick={exportKeys}
                className="flex items-center bg-[#262626] border border-[#3a3a3a] rounded-lg px-4 py-2 hover:bg-[#3a3a3a] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm text-gray-400 mr-2">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#262626] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#00d4aa] focus:outline-none"
                >
                  <option value="all">All Keys</option>
                  <option value="unused">Unused</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            {/* Keys Table */}
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3a3a3a]">
                      <th className="text-left p-4 font-medium">Key Code</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Created</th>
                      <th className="text-left p-4 font-medium">Used By</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key) => (
                      <tr key={key.id} className="border-b border-[#3a3a3a] hover:bg-[#2a2a2a] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <span className="font-mono text-sm text-[#00d4aa]">
                              {showKeys[key.id] ? key.key_code : '••••••••••••••••••••'}
                            </span>
                            <button
                              onClick={() => toggleKeyVisibility(key.id)}
                              className="ml-2 text-gray-400 hover:text-white"
                            >
                              {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            key.is_used 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {key.is_used ? 'Used' : 'Unused'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(key.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm">
                          {key.telegram_contact || '-'}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => copyToClipboard(key.key_code)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Copy key"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-[#3a3a3a]">
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-[#3a3a3a] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a4a4a] transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-[#3a3a3a] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a4a4a] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
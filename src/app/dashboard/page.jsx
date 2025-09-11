'use client';

import { useState, useEffect } from "react";
import { 
  LogOut, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  ArrowUpRight,
  Copy
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatorLoading, setGeneratorLoading] = useState(false);
  const [generatorData, setGeneratorData] = useState({
    amount: '',
    recipientAddress: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('usdtUser');
    if (!storedUser) {
      window.location.href = '/activate';
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Fetch dashboard data
    fetchDashboardData(userData.id);
  }, []);

  const fetchDashboardData = async (userId) => {
    try {
      const response = await fetch(`/api/dashboard?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }

      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateUSDT = async (e) => {
    e.preventDefault();
    setGeneratorLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/generate-usdt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(generatorData.amount),
          recipientAddress: generatorData.recipientAddress
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setSuccess(`USDT generation initiated! Transaction ID: ${data.transaction.id}`);
      setGeneratorData({ amount: '', recipientAddress: '' });
      
      // Refresh dashboard data
      setTimeout(() => {
        fetchDashboardData(user.id);
      }, 1000);

    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message);
    } finally {
      setGeneratorLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usdtUser');
    window.location.href = '/';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#00d4aa] rounded-lg flex items-center justify-center mr-3">
              <span className="text-black font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-bold">USDT Flash</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Welcome, {user?.telegram_contact}</span>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Generated</h3>
              <DollarSign className="w-5 h-5 text-[#00d4aa]" />
            </div>
            <p className="text-2xl font-bold">
              {dashboardData?.stats.totalGenerated.toLocaleString() || '0'} USDT
            </p>
          </div>

          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Pending</h3>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">
              {dashboardData?.stats.pendingTransactions || 0}
            </p>
          </div>

          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Completed</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">
              {dashboardData?.stats.completedTransactions || 0}
            </p>
          </div>

          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Transactions</h3>
              <ArrowUpRight className="w-5 h-5 text-[#00d4aa]" />
            </div>
            <p className="text-2xl font-bold">
              {dashboardData?.stats.totalTransactions || 0}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* USDT Generator */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-[#00d4aa] mr-3" />
              <h2 className="text-xl font-bold">USDT Generator</h2>
            </div>

            <form onSubmit={handleGenerateUSDT} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-500 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-500 text-sm">{success}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  value={generatorData.amount}
                  onChange={(e) => setGeneratorData({...generatorData, amount: e.target.value})}
                  placeholder="Enter amount (max: 100,000)"
                  min="1"
                  max="100000"
                  step="0.01"
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00d4aa] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={generatorData.recipientAddress}
                  onChange={(e) => setGeneratorData({...generatorData, recipientAddress: e.target.value})}
                  placeholder="0x..."
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00d4aa] focus:outline-none transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid Ethereum wallet address
                </p>
              </div>

              <button
                type="submit"
                disabled={generatorLoading || !generatorData.amount || !generatorData.recipientAddress}
                className="w-full bg-[#00d4aa] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#26a69a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatorLoading ? 'Generating...' : 'Generate USDT'}
              </button>
            </form>
          </div>

          {/* Transaction History */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
            
            <div className="space-y-4">
              {dashboardData?.transactions?.length > 0 ? (
                dashboardData.transactions.map((tx) => (
                  <div key={tx.id} className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          tx.status === 'completed' ? 'bg-green-500' :
                          tx.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="font-medium">{tx.amount} USDT</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(tx.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-2">To:</span>
                        <span className="font-mono">
                          {`${tx.recipient_address.slice(0, 6)}...${tx.recipient_address.slice(-4)}`}
                        </span>
                        <button
                          onClick={() => copyToClipboard(tx.recipient_address)}
                          className="ml-2 text-gray-500 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        tx.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No transactions yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Generate your first USDT to see it here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from "react";
import { ArrowLeft, Key, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";

export default function ActivatePage() {
  const [formData, setFormData] = useState({
    activationKey: '',
    telegramContact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Activation failed');
      }

      setSuccess(true);
      // Store user data in localStorage for dashboard access
      localStorage.setItem('usdtUser', JSON.stringify(data.user));
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Activation error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-[#00d4aa] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Activation Successful!</h2>
          <p className="text-gray-400 mb-6">
            Your account has been activated. Redirecting to dashboard...
          </p>
          <div className="w-full bg-[#3a3a3a] rounded-full h-2">
            <div className="bg-[#00d4aa] h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
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
            <a href="/" className="flex items-center mr-6 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </a>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#00d4aa] rounded-lg flex items-center justify-center mr-3">
                <span className="text-black font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold">USDT Flash</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#00d4aa] rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Activate Your Account</h1>
            <p className="text-gray-400">
              Enter your activation key and Telegram contact to get started
            </p>
          </div>

          {/* Activation Form */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-500 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Activation Key
                </label>
                <input
                  type="text"
                  name="activationKey"
                  value={formData.activationKey}
                  onChange={handleInputChange}
                  placeholder="Enter your activation key"
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00d4aa] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Telegram Contact
                </label>
                <input
                  type="text"
                  name="telegramContact"
                  value={formData.telegramContact}
                  onChange={handleInputChange}
                  placeholder="@your_telegram_username"
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00d4aa] focus:outline-none transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The Telegram username you used to purchase the key
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.activationKey || !formData.telegramContact}
                className="w-full bg-[#00d4aa] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#26a69a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Activating...' : 'Activate Account'}
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-[#3a3a3a]">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Don't have an activation key yet?
                </p>
                <a
                  href="https://t.me/devtech77"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#0088cc] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#006699] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact @devtech77
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
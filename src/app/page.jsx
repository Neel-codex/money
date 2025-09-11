import { useState } from "react";
import { ArrowRight, Shield, Zap, DollarSign, MessageCircle } from "lucide-react";

export default function HomePage() {
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
          <a
            href="/activate"
            className="bg-[#00d4aa] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#26a69a] transition-colors"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-[#00d4aa]">Generate</span> USDT
            <br />
            Instantly
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Professional USDT flash generation service. Secure, fast, and reliable.
            Get your activation key today and start generating.
          </p>

          {/* Pricing Card */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-8 max-w-md mx-auto mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Activation Key</h3>
              <div className="text-4xl font-bold text-[#00d4aa] mb-2">$50</div>
              <p className="text-gray-400 mb-6">One-time payment in USDT</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00d4aa] mr-2" />
                  <span className="text-sm">Lifetime access</span>
                </div>
                <div className="flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#00d4aa] mr-2" />
                  <span className="text-sm">Instant generation</span>
                </div>
                <div className="flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#00d4aa] mr-2" />
                  <span className="text-sm">Up to 100K USDT</span>
                </div>
              </div>

              <a
                href="https://t.me/devtech77"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0088cc] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#006699] transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Buy Key on Telegram
              </a>
            </div>
          </div>

          <a
            href="/activate"
            className="inline-flex items-center bg-[#00d4aa] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#26a69a] transition-colors"
          >
            Activate Your Key
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose USDT Flash?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00d4aa] rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Processing</h3>
              <p className="text-gray-400">
                Generate USDT instantly to any wallet address with our high-speed processing system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00d4aa] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure & Reliable</h3>
              <p className="text-gray-400">
                Built with enterprise-grade security. Your data and transactions are always protected.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00d4aa] rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">High Limits</h3>
              <p className="text-gray-400">
                Generate up to 100,000 USDT per transaction with no daily limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="w-12 h-12 bg-[#00d4aa] text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Purchase Key</h3>
              <p className="text-gray-400">
                Contact @devtech77 on Telegram to purchase your activation key for $50 USDT.
              </p>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-[#00d4aa] text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Activate Account</h3>
              <p className="text-gray-400">
                Enter your activation key and Telegram contact to unlock the dashboard.
              </p>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-[#00d4aa] text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Start Generating</h3>
              <p className="text-gray-400">
                Access your dashboard and start generating USDT to any wallet address.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-[#00d4aa] rounded-lg flex items-center justify-center mr-3">
              <span className="text-black font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-bold">USDT Flash</span>
          </div>
          <p className="text-gray-400 text-sm">
            Professional USDT generation service. Contact @devtech77 for support.
          </p>
        </div>
      </footer>
    </div>
  );
}
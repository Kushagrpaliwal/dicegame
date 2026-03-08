"use client";

import { useState } from "react";
import BottomNav from "../../components/BottomNav";

export default function DepositPage() {
  const [method, setMethod] = useState("manual");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [selectedQuick, setSelectedQuick] = useState(null);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Processing Request for ₹${amount}`);
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-white overflow-hidden font-sans">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* HEADER: Esports Style */}
      <div className="relative z-10 pt-8 pb-4 flex flex-col items-center">
        <div className="relative">
          <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 uppercase">
            Credits Refill
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
        </div>
        <p className="text-[10px] text-cyan-400 font-bold tracking-[0.3em] mt-2 uppercase">Secure Protocol Active</p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="relative z-10 h-full overflow-y-auto no-scrollbar pb-32 px-4">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* METHOD SELECTOR: Gaming Tabs */}
          <div className="flex gap-2 p-1 bg-slate-900/50 border border-white/10 rounded-sm">
            {["manual", "gateway"].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  method === m
                    ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {m === "manual" ? "Direct Transfer" : "Instant Pay"}
              </button>
            ))}
          </div>

          {/* MAIN INPUT CARD */}
          <div className="relative group">
            {/* Decorative Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500" />

            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-6 space-y-6 max-h-[65vh] overflow-y-auto">
              
              {/* AMOUNT INPUT */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Loadout Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/50 border-b-2 border-cyan-500/30 focus:border-cyan-400 py-4 px-4 text-2xl font-mono outline-none transition-all"
                    placeholder="0000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/50 font-mono">INR</span>
                </div>
              </div>

              {/* QUICK CHIPS */}
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => {
                  const sel = selectedQuick === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => { setAmount(amt); setSelectedQuick(amt); }}
                      className={`border py-2 text-xs font-bold transition-all ${
                        sel
                          ? "bg-cyan-500 text-black border-cyan-500"
                          : "bg-white/5 border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                      }`}
                    >
                      +₹{amt}
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC MANUAL SECTION */}
              {method === "manual" && (
                <div className="space-y-4 pt-4 border-t border-white/5 animate-pulse-subtle">
                  <div className="flex items-center gap-4 bg-black/40 p-4 border-l-4 border-fuchsia-500">
                    <div className="bg-white p-1 rounded-sm">
                      <img src="/qr.png" alt="QR" className="w-20 h-20" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] uppercase text-slate-400">Merchant ID</p>
                      <p className="text-sm font-mono text-fuchsia-400 break-all">gaming.pay@bank</p>
                      <button className="text-[10px] mt-1 text-cyan-400 underline uppercase font-bold">Copy ID</button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="TRANSACTION HASH / ID"
                    className="w-full bg-slate-800/50 border border-white/10 px-4 py-3 text-sm font-mono focus:border-fuchsia-500 outline-none"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              )}

              {/* ACTION BUTTON */}
              <button
                onClick={handleSubmit}
                className="group relative w-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 skew-x-12 translate-x-1 group-hover:translate-x-0 transition-transform" />
                <div className="relative bg-cyan-500 py-4 text-black font-black uppercase tracking-[0.2em] skew-x-[-12deg] group-active:scale-95 transition-all">
                  <span className="inline-block skew-x-[12deg]">Initialize Transfer</span>
                </div>
              </button>
            </div>
          </div>

          {/* WARNING BOX */}
          <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg">
            <p className="text-[10px] text-fuchsia-400 leading-relaxed font-medium uppercase">
              ⚠️ Attention: Ensure Transaction ID is correct. Mismatched hashes may result in loss of digital assets.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="fixed bottom-0 w-full z-20">
         <div className="max-w-md mx-auto bg-[#020617]/90 backdrop-blur-md border-t border-cyan-500/30 pb-6">
            <BottomNav />
         </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-subtle { animation: pulse-subtle 3s infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
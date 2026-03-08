"use client";
import Link from "next/link";
import BottomNav from "../../components/BottomNav";
import { useState, useEffect } from "react";

// Bot player data
const generateBotPlayers = () => {
  const botNames = [
    "Shadow_Pro",
    "CyberKing",
    "AlphaBot",
    "NovaPlayer",
    "PhantomGamer",
    "EliteBot",
    "VortexPro",
    "NeonMaster",
    "QuantumBot",
    "LunarEchoed",
  ];
  const avatarColors = [
    "#39ff14",
    "#ff00ff",
    "#00ffff",
    "#ffff00",
    "#ff6600",
    "#00ff99",
    "#ff0066",
    "#0099ff",
    "#ff3300",
    "#33ff00",
  ];

  // Select random avatar indices from available avatars (av-1.png to av-72.png)
  const selectedAvatars = new Set();
  while (selectedAvatars.size < botNames.length) {
    selectedAvatars.add(Math.floor(Math.random() * 72) + 1);
  }
  const avatarIndices = Array.from(selectedAvatars);

  return botNames.map((name, idx) => ({
    id: idx + 1,
    name: name,
    // Use local avatar images from public/avtar directory
    avatar: `/avtar/av-${avatarIndices[idx]}.png`,
    winRate: Math.random() * 60 + 20,
    totalGames: Math.floor(Math.random() * 500) + 100,
    totalWinnings: Math.floor(Math.random() * 75000) + 1000,
    currentBet: Math.floor(Math.random() * 1000) + 50,
    diceRoll: null,
    isRunning: false,
    color: avatarColors[idx % avatarColors.length],
    rank: idx + 1,
  }));
};

// Recalculate ranks based on totalWinnings
const assignRanks = (players) => {
  const sorted = [...players].sort((a, b) => b.totalWinnings - a.totalWinnings);
  const ranked = sorted.map((p, i) => ({ ...p, rank: i + 1 }));
  // return in original order but with updated ranks
  return players.map((p) => ({
    ...p,
    rank: ranked.find((r) => r.id === p.id).rank,
  }));
};

export default function GamePage() {
  const [botPlayers, setBotPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState("one"); // 'one' or 'two'
  const [autoRunning, setAutoRunning] = useState(true);
  const [userWallet, setUserWallet] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  // Fetch current user's wallet and email
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user-api/profile', {
          credentials: 'include', // Include cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUserWallet(data.user?.wallet || 0);
          setUserEmail(data.user?.email || "");
        } else {
          console.error('Failed to fetch user data:', res.status);
        }
      } catch (err) {
        console.error('Failed to fetch user wallet:', err);
      }
    };

    fetchUserData();
  }, []);

  // Create a simple SVG fallback (data URL) with initials and colored background
  const makeFallback = (name = "", color = "#222") => {
    const initials = (name || "B")
      .split(/[_\s-]+/)
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='${color}'/><text x='50%' y='50%' dy='.1em' font-family='Inter, Arial, sans-serif' font-size='48' fill='#000' text-anchor='middle'>${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  // Initialize bot players with ranks
  useEffect(() => {
    const initial = generateBotPlayers();
    setBotPlayers(assignRanks(initial));
  }, []);

  // Simple fallback handler for missing local avatars
  const handleAvatarError = (e, name, color) => {
    e.currentTarget.src = makeFallback(name, color);
  };

  // Auto-run games for bot players, simulate rolls and occasional wins/losses
  useEffect(() => {
    if (!autoRunning || botPlayers.length === 0) return;

    const interval = setInterval(() => {
      setBotPlayers((prevPlayers) => {
        const updated = prevPlayers.map((player) => {
          // 40% chance to act this tick
          if (Math.random() > 0.6) {
            const maxDice = selectedGame === "one" ? 6 : 12;
            const roll = Math.floor(Math.random() * maxDice) + 1;
            const bet = Math.floor(Math.random() * 1000) + 50;
            const won = Math.random() > 0.5; // 50/50 simple outcome
            const winAmount = won
              ? Math.floor(bet * (Math.random() * 4 + 1))
              : -bet;

            return {
              ...player,
              diceRoll: roll,
              isRunning: true,
              currentBet: bet,
              totalGames: player.totalGames + 1,
              totalWinnings: Math.max(0, player.totalWinnings + winAmount),
            };
          }

          return { ...player, isRunning: false, diceRoll: null };
        });

        // reassign ranks after updating winnings
        return assignRanks(updated);
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [autoRunning, selectedGame, botPlayers.length]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-['Space_Grotesk'] text-slate-100 antialiased overflow-x-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
        style={{
          backgroundImage: "url('/main-bg-img.jpg')",
        }}
      ></div>

      {/* Dark Transparent Overlay */}
      <div className="fixed inset-0 bg-black/80 z-[-1]"></div>

      {/* Optional Energy Glow (on top of overlay) */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_70%,rgba(147,51,234,0.08)_100%)] pointer-events-none z-0"></div>


      <header className="relative flex items-center justify-between border-b border-white/5 px-6 py-4 md:px-20 lg:px-40 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#39ff14] text-3xl drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">
              casino
            </span>
            <h2 className="text-2xl font-black leading-tight tracking-tighter text-white">
              DICE{" "}
              <span className="text-[#39ff14] italic drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
                RUSH
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-[#39ff14] text-xl">
              payments
            </span>
            <span className="text-sm font-bold tracking-tight">
              {userWallet.toLocaleString()} <span className="text-slate-400 font-medium">₹</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-[1400px] mx-auto w-full px-6 py-12">
        <div className="text-center mb-16 space-y-2">
          <h1 className="text-2xl md:text-5xl font-bold">
            Welcome,{" "}
            <span className="text-[#39ff14] drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
              {userEmail || "Guest"}
            </span>
          </h1>
          <p className="text-slate-500 uppercase tracking-[0.4em] text-xs font-bold">
            Choose your game • Place your bets • Win big
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            {/* Game Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card: One Dice */}
              <div
                onClick={() => setSelectedGame("one")}
                className={`group relative flex flex-col bg-slate-900/40 border rounded-[2rem] overflow-hidden hover:border-[#39ff14]/30 transition-all duration-500 cursor-pointer ${selectedGame === "one" ? "border-[#39ff14]" : "border-white/5"}`}
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center brightness-50 group-hover:scale-110 transition-transform duration-700 bg-[url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1000')]"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="relative size-32 flex items-center justify-center">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 rounded-full bg-[#39ff14]/20 blur-2xl animate-pulse"></div>
                      <img
                        src="one-dice-image.png"
                        alt="Neon Dice 1"
                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(57,255,20,0.6)] group-hover:rotate-12 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                      One Dice Game
                    </h3>
                  </div>
                </div>
                <div className="p-8 pt-0 flex flex-col gap-6 -mt-8 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                        Payout
                      </p>
                      <p className="text-[#39ff14] text-xl font-black">2x</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                        Win Chance
                      </p>
                      <p className="text-[#39ff14] text-xl font-black">16.7%</p>
                    </div>
                  </div>
                  <Link href="/game/onedicegame">
                  <button className="w-full bg-[#39ff14] text-black py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] active:scale-95 uppercase tracking-widest">
                    Join Game
                  </button>
                  </Link>
                </div>
              </div>

              {/* Card: Two Dice */}
              <div
                onClick={() => setSelectedGame("two")}
                className={`group relative flex flex-col bg-slate-900/40 border rounded-[2rem] overflow-hidden hover:border-[#ff00ff]/30 transition-all duration-500 cursor-pointer ${selectedGame === "two" ? "border-[#ff00ff]" : "border-white/5"}`}
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center brightness-[0.3] group-hover:scale-110 transition-transform duration-700 bg-[url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1000')]"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="relative h-40 w-full flex items-center justify-center">
                      {/* Atmospheric Glow */}
                      <div className="absolute w-48 h-24 bg-[#ff00ff]/10 blur-3xl rounded-full"></div>
                      <img
                        src="two-dice-image.png"
                        alt="Neon Pair of Dice"
                        className="relative z-10 h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(255,0,255,0.6)] group-hover:rotate-12 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                      Two Dice Game
                    </h3>
                  </div>
                </div>
                <div className="p-8 pt-0 flex flex-col gap-6 -mt-8 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                        Payout
                      </p>
                      <p className="text-[#ff00ff] text-xl font-black">6x</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                        Win Chance
                      </p>
                      <p className="text-[#ff00ff] text-xl font-black">22.2%</p>
                    </div>
                  </div>
                  <Link href="/game/twodicegame">
                  <button className="w-full bg-[#ff00ff] text-white py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] active:scale-95 uppercase tracking-widest">
                    Join Game
                  </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Top Players (moved below selection cards) */}
            <div className="p-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#ff00ff] text-2xl">
                  leaderboard
                </span>
                <h3 className="text-lg font-black text-white">Top Players</h3>
              </div>

              <div className="space-y-3 mb-4">
                {[...botPlayers]
                  .slice()
                  .sort((a, b) => b.totalWinnings - a.totalWinnings)
                  .slice(0, 6)
                  .map((player, idx) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:border-[#ff00ff]/30 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-br from-[#ff00ff]/60 to-[#ff66cc]/30 shadow-sm">
                            <img
                              src={player.avatar}
                              alt={player.name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) =>
                                handleAvatarError(e, player.name, player.color)
                              }
                              className="w-full h-full rounded-full object-cover bg-black"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-[#ff00ff] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">
                            {idx + 1}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {player.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          ₹{(player.totalWinnings / 1000).toFixed(1)}K •{" "}
                          {player.totalGames}G
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#00ff99]">
                          {player.winRate.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-2 pt-4 border-t border-white/10 flex justify-between text-sm text-slate-400">
                <div>
                  Active:{" "}
                  <span className="font-black text-[#39ff14]">
                    {botPlayers.filter((p) => p.isRunning).length}
                  </span>
                </div>
                <div>
                  Total:{" "}
                  <span className="font-black text-[#ff00ff]">
                    {botPlayers.length}
                  </span>
                </div>
                <div>
                  Avg Bet:{" "}
                  <span className="font-black text-[#00ffff]">
                    ₹
                    {Math.round(
                      botPlayers.reduce((s, p) => s + p.currentBet, 0) /
                        Math.max(1, botPlayers.length),
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Bot Players Live Games */}
<div className="border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-1 sm:p-8">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-4 sm:mb-8">
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="material-symbols-outlined text-[#39ff14] text-lg sm:text-2xl">
        sports_esports
      </span>
      <h2 className="text-lg sm:text-2xl font-black text-white">
        Live Games • {botPlayers.length}
      </h2>
    </div>

    <button
      onClick={() => setAutoRunning(!autoRunning)}
      className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-[10px] sm:text-sm transition-all ${
        autoRunning
          ? "bg-[#39ff14] text-black"
          : "bg-slate-700 text-white"
      }`}
    >
      {autoRunning ? "⏸" : "▶"}
    </button>
  </div>

  {/* Grid */}
  <div
    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 max-h-[600px] sm:max-h-[800px] overflow-y-auto" style={{padding: '12px'}}
  >
    {botPlayers.map((player) => (
      <div
        key={player.id}
        className={`relative bg-slate-800/40 backdrop-blur-sm border rounded-lg sm:rounded-xl p-2 sm:p-4 transition-all ${
          player.isRunning
            ? "border-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.3)]"
            : "border-white/10"
        }`}
      >
        
        {/* Rank */}
        <div className="absolute -top-2 -left-2 w-7 h-7 sm:w-10 sm:h-10 text-[10px] sm:text-sm rounded-full flex items-center justify-center font-black bg-gradient-to-br from-[#39ff14] to-[#00ff99] text-black">
          #{player.rank}
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-br from-[#39ff14]/60 to-[#00ff99]/40">
            <img
              src={player.avatar}
              alt={player.name}
              className="w-full h-full rounded-full object-cover bg-black"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] sm:text-sm font-bold text-white truncate">
              {player.name}
            </p>
            <p className="text-[9px] sm:text-xs text-slate-400">
              {player.totalGames} games
            </p>
          </div>
        </div>

        {/* Win Rate */}
        <div className="mb-2 sm:mb-3">
          <div className="flex justify-between text-[14px] sm:text-xs">
            <span className="text-slate-300">Win</span>
            <span className="text-[#39ff14] font-bold">
              {player.winRate.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-slate-700/50 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-[#39ff14] to-[#00ff99] h-1 rounded-full"
              style={{ width: `${player.winRate}%` }}
            />
          </div>
        </div>

        {/* Bet + Roll */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
          <div className="bg-black/30 rounded p-1.5 sm:p-2 text-center">
            <p className="text-[12px] text-slate-400">Bet</p>
            <p className="text-[11px] sm:text-sm font-black text-[#ff00ff]">
              {player.currentBet}
            </p>
          </div>

          <div className="bg-black/30 rounded p-1.5 sm:p-2 text-center">
            <p className="text-[12px] text-slate-400">Roll</p>
            <p className="text-[11px] sm:text-sm font-black text-[#39ff14]">
              {player.diceRoll || "—"}
            </p>
          </div>
        </div>

        {/* Winnings */}
        <div className="bg-black/40 rounded p-1.5 sm:p-2">
          <p className="text-[8px] text-slate-400">Win</p>
          <p className="text-[11px] sm:text-sm font-black text-[#00ff99]">
            ₹{player.totalWinnings.toLocaleString()}
          </p>
        </div>

        {/* Dice Animation */}
        {player.isRunning && (
          <div className="absolute top-1 right-1 text-lg animate-spin">🎲</div>
        )}
      </div>
    ))}
  </div>
</div>
          </div>
        </div>
      </main>

      {/* BOTTOM NAV */}
      <div className="w-full max-w-md pb-2">
        <BottomNav />
      </div>
    </div>
  );
}

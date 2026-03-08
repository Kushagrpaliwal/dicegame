'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/user-api/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          router.replace('/game'); // no back button
        }
      } catch (err) {
        // user not logged in → do nothing
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user-api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ important
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        router.replace('/game'); // ✅ smooth redirect
        router.refresh(); // ensures middleware sync
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Show loader while checking session
  if (checkingSession) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">

      {/* 🔥 BACKGROUND */}
      <img
        src="/desktop-bg.png"
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      />
      <img
        src="/mobile-bg.png"
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover block md:hidden"
      />

      {/* 🔥 OVERLAY */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* 🔥 LOGIN CARD */}
      <div className="relative z-10 w-[90%] max-w-md p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="logo" className="w-32" />
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-bold text-white mb-6 tracking-wide">
          Welcome Back
        </h2>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition"
            required
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 transition"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ERROR */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-full font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition transform shadow-lg disabled:opacity-50"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        {/* EXTRA LINKS */}
        <div className="flex justify-between text-xs text-gray-300 mt-4">

          <span className="hover:text-white cursor-pointer">
            Forgot Password?
          </span>

          <Link href="/register">
            <span className="hover:text-white cursor-pointer">
              Sign Up
            </span>
          </Link>

        </div>

      </div>
    </div>
  );
}
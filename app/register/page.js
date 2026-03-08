'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // local validation for confirm password
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user-api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess('Account created successfully');
        setForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        setTimeout(() => { window.location.href = "/login";}, 1500);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

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

      {/* 🔥 CARD */}
      <div className="relative z-10 w-[90%] max-w-md p-8 overflow-auto">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="logo" className="w-28" />
        </div>

        {/* TITLE */}
        <h2 className="text-center font-bold text-white mb-6 tracking-wide" style={{ fontSize: "18px" }}>
          Create a New Account
        </h2>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* NAME */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none border border-white/10 focus:border-green-400 focus:ring-2 focus:ring-green-400/40 transition"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 transition"
          />

          {/* PHONE */}
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter Phone"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/40 transition"
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
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 -translate-y-1/2 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 transition"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-4 -translate-y-1/2 text-gray-300 hover:text-white"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* feedback messages */}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transition transform shadow-lg disabled:opacity-50"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="px-3 text-gray-300 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* 🔥 GOOGLE SIGNUP BUTTON */}
        {/* <button
          onClick={() => alert('Google Signup Coming Soon')}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition shadow-md"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button> */}

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{' '}
          <Link href="/login">
            <span className="text-white hover:underline cursor-pointer">
              Login
            </span>
          </Link>
        </p>

      </div>
    </div>
  );
}
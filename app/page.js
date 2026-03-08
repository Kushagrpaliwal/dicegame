'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 4;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);

        setTimeout(() => {
          router.push('/login');
        }, 800);
      }

      setProgress(Math.floor(value));
    }, 100);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">

      {/* MOBILE BACKGROUND */}
      <img
        src="/mobile-bg.png"
        alt="mobile background"
        className="absolute inset-0 w-full h-full object-cover block md:hidden"
      />

      {/* DESKTOP BACKGROUND */}
      <img
        src="/desktop-bg.png"
        alt="desktop background"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">

        {/* LOGO */}
        <div className="mt-16 flex justify-center w-full">
          <img
            src="/logo.png"
            alt="logo"
            className="w-52 sm:w-64 md:w-72 lg:w-80"
          />
        </div>

        {/* PROGRESS */}
        <div className="w-full px-6 md:px-24 lg:px-48 mb-10">

          <div className="w-full h-5 bg-white/30 rounded-full overflow-hidden shadow-lg">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-center text-white font-bold mt-4 text-sm sm:text-base md:text-lg">
            Loading... {progress}%
          </p>


        </div>
      </div>
    </div>
  );
}
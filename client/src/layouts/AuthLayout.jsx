import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">

      {/* Animated ambient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Large primary orb */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(99,102,241,0.4) 50%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        {/* Secondary orb */}
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20 animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(99,102,241,0.4) 50%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        {/* Accent orb center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Corner decorative elements */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-indigo-500/30 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-indigo-500/30 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
};

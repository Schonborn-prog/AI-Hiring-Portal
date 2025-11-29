import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 overflow-x-hidden relative font-sans">
      {/* Background Blobs Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};
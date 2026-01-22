"use client";
import { useState } from 'react';

type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabs = [
    { id: 'leather', label: 'LEATHER' },
    { id: 'video', label: 'VIDEO' },
    { id: 'note', label: 'NOTE' },
    { id: 'sketch-mark', label: 'SKETCH MARK' }
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold tracking-tighter cursor-pointer" onClick={() => handleTabClick('leather')}>
        PROFILE PORTFOLIO
      </h1>

      <nav className="hidden md:flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm tracking-widest transition-colors duration-300 ${
              activeTab === tab.id ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <button 
        className="md:hidden p-2 z-50 relative"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
        <div className={`w-6 h-0.5 bg-black my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
        <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
      </button>

      <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col gap-8 text-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`text-2xl font-light tracking-widest transition-all duration-300 ${
                activeTab === tab.id ? 'text-black scale-110' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

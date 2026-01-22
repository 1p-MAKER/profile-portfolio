"use client";
import { useState } from 'react';
import Header from '@/components/Header';
import SketchMarkTab from '@/components/SketchMarkTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('sketch-mark');

  return (
    <main className="min-h-screen pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-8 animate-in fade-in duration-500">
        {activeTab === 'sketch-mark' && (
          <div className="space-y-8">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-3xl md:text-4xl font-light tracking-widest">SKETCH MARK</h2>
              <p className="text-xs md:text-sm text-gray-500 tracking-wider">いつか意味を持つ</p>
            </div>
            <SketchMarkTab />
          </div>
        )}

        {activeTab === 'leather' && (
          <div className="text-center py-20 text-gray-400 tracking-widest">LEATHER WORKS COMING SOON</div>
        )}
        {activeTab === 'video' && (
           <div className="text-center py-20 text-gray-400 tracking-widest">VIDEO WORKS COMING SOON</div>
        )}
        {activeTab === 'note' && (
           <div className="text-center py-20 text-gray-400 tracking-widest">NOTE ARTICLES COMING SOON</div>
        )}
      </div>
    </main>
  );
}

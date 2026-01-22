"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

type Item = {
  id: string;
  type: 'base' | 'instagram';
  title: string;
  imageUrl: string;
  link: string;
  date: string;
};

export default function SketchMarkTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sketch-mark')
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-400 font-light animate-pulse">Loading Gallery...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square bg-gray-50 overflow-hidden block"
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <span className="text-xs">No Image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-[10px] md:text-xs font-bold truncate">{item.title}</p>
            <p className="text-[9px] opacity-90 uppercase tracking-widest mt-0.5">
              {item.type === 'base' ? 'View on Shop' : 'View on IG'}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

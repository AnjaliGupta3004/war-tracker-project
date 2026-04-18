// src/components/Ticker.jsx
import React from 'react';

export default function Ticker({ news }) {
  // Pehli teen headlines fetch karein Ticker ke liye
  const tickerText = news.slice(0, 3).map(article => article.description.toUpperCase()).join(" ——— ");

  return (
    <div className="bg-red-700 text-white py-1 overflow-hidden whitespace-nowrap border-b border-red-900 shadow-inner">
      <div className="inline-block animate-pulse-slow px-4 font-black italic text-xs uppercase tracking-tighter w-full text-center">
        BREAKING INTEL: {tickerText || "Scanning for updates..."}
      </div>
    </div>
    
  );
}
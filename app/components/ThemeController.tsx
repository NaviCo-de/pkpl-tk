'use client'; // Wajib karena ini berinteraksi langsung dengan Browser (DOM)

import { useState, useEffect } from 'react';

export default function ThemeController() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    document.body.style.fontSize = `${fontSize}px`;
    
    document.body.style.transition = 'all 0.3s ease';
  }, [bgColor, textColor, fontSize]);

  return (
    <div className="p-6 border-2 border-purple-500 bg-gray-100 rounded-lg shadow-lg my-6 max-w-md">
      <h2 className="text-xl font-black text-purple-700 mb-4 flex items-center gap-2">
        👑 Yang Budak Pacil Aja
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Kamu melihat panel ini karena identitasmu dikenali sebagai member Budak Pacil.
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="font-bold text-black">Warna Latar:</label>
          <input 
            type="color" 
            value={bgColor} 
            onChange={(e) => setBgColor(e.target.value)}
            className="w-12 h-12 cursor-pointer"
          />
        </div>

        {/* Kontrol Warna Teks */}
        <div className="flex justify-between items-center">
          <label className="font-bold text-black">Warna Teks:</label>
          <input 
            type="color" 
            value={textColor} 
            onChange={(e) => setTextColor(e.target.value)}
            className="w-12 h-12 cursor-pointer"
          />
        </div>

        {/* Kontrol Ukuran Font */}
        <div className="flex flex-col">
          <label className="font-bold text-black mb-1">
            Ukuran Font Global: {fontSize}px
          </label>
          <input 
            type="range" 
            min="12" 
            max="32" 
            value={fontSize} 
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
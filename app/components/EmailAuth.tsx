'use client';

import { useState } from 'react';
import { authenticateUser } from '@/app/actions/auth';

export default function EmailAuth() {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (formData: FormData, action: 'login' | 'register') => {
    setErrorMsg('');
    setLoading(true);

    const result = await authenticateUser(action, formData);

    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      if (action === 'register') {
        alert('Pendaftaran berhasil! Silakan tekan Masuk.');
      } else {
        window.location.reload();
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 border border-gray-300 rounded max-w-sm">
      <h3 className="font-bold mb-4">Masuk dengan Email (Backend Auth)</h3>
      
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 text-sm mb-4 rounded border border-red-400">
          {errorMsg}
        </div>
      )}

      <form>
        <input
          type="email"
          name="email"
          placeholder="Alamat Email"
          required
          className="w-full border p-2 mb-3 rounded text-black"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Kata Sandi Rahasia"
          required
          className="w-full border p-2 mb-4 rounded text-black"
        />

        <div className="flex gap-2">
          <button
            formAction={(formData) => handleAction(formData, 'login')}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
          >
            Masuk
          </button>
          <button
            formAction={(formData) => handleAction(formData, 'register')}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
          >
            Daftar Baru
          </button>
        </div>
      </form>
    </div>
  );
}
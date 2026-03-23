'use client'; // Wajib karena interaksi klik terjadi di browser

import { supabase } from '@/lib/supabase';

export default function LoginButton() {
  const handleGoogleLogin = async () => {
    // Memerintahkan Satpam (Supabase) untuk memulai proses otentikasi Google
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Ke mana pengunjung diarahkan setelah sukses login
        redirectTo: `${window.location.origin}/`, 
      },
    });

    if (error) {
      console.error('Gagal login:', error.message);
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Masuk dengan Google
    </button>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p>Mengecek status tamu...</p>;

  if (!user) {
    return <p className="text-red-500 font-bold">Kamu masih di luar gedung. Silakan Login.</p>;
  }

  return (
    <div className="p-4 border border-green-500 rounded mt-4">
      <h2 className="text-green-600 font-bold mb-2">Selamat datang di dalam klub VIP!</h2>
      <p><strong>Email Google:</strong> {user.email}</p>
      <p><strong>ID Satpam:</strong> {user.id}</p>
      
      <button 
        onClick={async () => await supabase.auth.signOut()}
        className="mt-4 bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        Keluar / Logout
      </button>
    </div>
  );
}
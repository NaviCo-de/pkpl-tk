'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Email atau password salah');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
          {isRegister ? 'Daftar Akun' : 'Gerbang Masuk'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-sm mb-4 rounded border border-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded text-black"
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded text-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {isRegister ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        <div className="flex items-center text-gray-400 my-4">
          <hr className="flex-1" />
          <span className="px-3 text-xs">Atau</span>
          <hr className="flex-1" />
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Masuk dengan Google
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 underline"
          >
            {isRegister ? 'Masuk' : 'Daftar'}
          </button>
        </p>
      </div>
    </div>
  );
}
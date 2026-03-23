import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import LoginButton from './components/LoginButton';
import EmailAuth from './components/EmailAuth';
import Profile from './components/Profile';
import ThemeController from './components/ThemeController';
import BudakPacilList from './components/BudakPacilList'; 

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isBudakPacil = false;

  if (user && user.email) {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {}, 
      create: {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'Pengguna Baru',
        role: 'USER', 
        batch: 'Belum diisi', 
        major: 'Belum diisi',
        hobby: 'Belum diisi',
      },
    });

    isBudakPacil = dbUser.role === 'BUDAK_PACIL';
  }

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen">
      <h1 className="text-4xl font-black mb-10 text-center">Sistem Inti Organisasi</h1>
      
      <div className="mb-12">
        <BudakPacilList />
      </div>

      <hr className="border-t-2 border-gray-200 mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {isBudakPacil ? (
            <ThemeController />
          ) : (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
              Panel kontrol sistem terkunci. Hanya pemegang akses "BUDAK_PACIL" yang dapat melihat area ini.
            </div>
          )}
        </div>

        <div>
          {!user ? (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Gerbang Masuk</h2>
              <EmailAuth /> 
              <div className="flex items-center text-gray-400 my-6">
                <hr className="flex-1" />
                <span className="px-3 text-xs uppercase tracking-wider font-semibold">Atau akses cepat</span>
                <hr className="flex-1" />
              </div>
              <LoginButton />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Kartu Identitas Anda</h2>
              <Profile />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
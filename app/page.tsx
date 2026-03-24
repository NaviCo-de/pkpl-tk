import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { signOut } from '@/auth';
import BudakPacilList from './components/BudakPacilList';
import ThemeController from './components/ThemeController';
import EditLogViewer from './components/EditLogViewer';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  let isBudakPacil = false;

  if (user?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    isBudakPacil = dbUser?.role === 'BUDAK_PACIL';
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

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          {!user ? (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Gerbang Masuk</h2>
              <a href="/login" className="block w-full text-center bg-blue-600 text-white py-2 rounded">
                Login / Daftar
              </a>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Kartu Identitas</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nama:</strong> {user.name}</p>
              <p><strong>Role:</strong> {isBudakPacil ? 'Budak Pacil' : 'User'}</p>
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}>
                <button type="submit" className="mt-4 bg-red-600 text-white px-3 py-1 rounded text-sm">
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <EditLogViewer />
    </div>
  );
}

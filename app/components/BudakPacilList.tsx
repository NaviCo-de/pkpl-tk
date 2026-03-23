import { prisma } from '@/lib/prisma';

export default async function BudakPacilList() {
  const budakPacil = await prisma.user.findMany({
    where: {
      role: 'BUDAK_PACIL',
    },
    orderBy: {
      createdAt: 'asc', 
    },
  });

  if (budakPacil.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
        Belum ada Budak Pacil yang terdaftar di dalam sistem.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-black text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
        Daftar Budak Pacil (Fasilkom UI)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budakPacil.map((budak) => (
          <div 
            key={budak.id} 
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {(budak.name ?? '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{budak.name}</h3>
                <p className="text-sm text-gray-500">{budak.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Angkatan:</span>
                <span>{budak.batch}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Jurusan:</span>
                <span>{budak.major}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Hobi:</span>
                <span>{budak.hobby}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 text-right">
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                Budak Pacil
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';

interface EditLogEntry {
  id: string;
  userName: string;
  description: string;
  createdAt: string;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const time = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  if (isToday) return `Hari ini ${time}`;

  const date = d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${date} ${time}`;
}

function LogEntry({ log, isNew }: { log: EditLogEntry; isNew?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 py-2 px-3 rounded-lg transition-all duration-500 ${
        isNew ? 'bg-purple-50 border border-purple-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
        {log.userName.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-800">
          <span className="font-semibold text-purple-700">{log.userName}</span>{' '}
          <span>{log.description}</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">
          {formatDateTime(log.createdAt)}
        </p>
      </div>
      {isNew && (
        <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">
          BARU
        </span>
      )}
    </div>
  );
}

export default function EditLogViewer() {
  const [logs, setLogs] = useState<EditLogEntry[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [lastFetch, setLastFetch] = useState<string>('');

  const fetchLogs = useCallback(async (silent = false) => {
    try {
      const res = await fetch('/api/theme', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const incoming: EditLogEntry[] = data.logs ?? [];

      setLogs((prev) => {
        if (!silent) return incoming;
        const prevIds = new Set(prev.map((l) => l.id));
        const fresh = incoming.filter((l) => !prevIds.has(l.id));
        if (fresh.length > 0) {
          const freshIds = new Set(fresh.map((l) => l.id));
          setNewIds(freshIds);
          setTimeout(() => setNewIds(new Set()), 4000);
        }
        return incoming;
      });

      setLastFetch(new Date().toLocaleTimeString('id-ID'));
    } catch {
    }
  }, []);

  useEffect(() => {
    fetchLogs(false);
  }, []);

  useEffect(() => {
    const id = setInterval(() => fetchLogs(true), 5000);
    return () => clearInterval(id);
  }, [fetchLogs]);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800 border-b-2 border-gray-300 pb-2 flex-1">
          Log Perubahan Tema
        </h2>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">
            Realtime · diperbarui {lastFetch || '…'}
          </span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-sm text-center">
          Belum ada riwayat perubahan tema.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {logs.map((log) => (
              <LogEntry key={log.id} log={log} isNew={newIds.has(log.id)} />
            ))}
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-right">
            {logs.length} entri · polling setiap 5 detik
          </div>
        </div>
      )}
    </div>
  );
}
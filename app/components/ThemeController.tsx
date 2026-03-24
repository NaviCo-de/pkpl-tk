'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ThemeData {
  bgColor: string;
  textColor: string;
  fontSize: number;
}

interface EditLogEntry {
  id: string;
  userName: string;
  description: string;
  createdAt: string;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
  if (isToday) return 'Hari ini';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function EditLogPanel({ logs }: { logs: EditLogEntry[] }) {
  if (logs.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 text-center">
        Belum ada riwayat perubahan tema.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Riwayat Perubahan
      </h3>
      <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2 text-xs py-1.5 px-2 rounded hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-400 font-mono shrink-0 pt-0.5">
              {formatDate(log.createdAt)} {formatTime(log.createdAt)}
            </span>
            <span className="text-gray-700">
              <span className="font-semibold text-purple-700">{log.userName}</span>{' '}
              {log.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <label className="font-semibold text-gray-700 text-sm">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">{value}</span>
        <label
          className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden shadow-sm hover:scale-105 transition-transform"
          style={{ backgroundColor: value }}
          title={label}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}

export default function ThemeController() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);

  const [savedTheme, setSavedTheme] = useState<ThemeData>({
    bgColor: '#ffffff',
    textColor: '#000000',
    fontSize: 16,
  });

  const [logs, setLogs] = useState<EditLogEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyTheme = useCallback((theme: ThemeData) => {
    document.body.style.backgroundColor = theme.bgColor;
    document.body.style.color = theme.textColor;
    document.body.style.fontSize = `${theme.fontSize}px`;
    document.body.style.transition = 'all 0.3s ease';
  }, []);

  const fetchData = useCallback(
    async (silent = false) => {
      try {
        const res = await fetch('/api/theme', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const t: ThemeData = {
          bgColor: data.theme.bgColor,
          textColor: data.theme.textColor,
          fontSize: data.theme.fontSize,
        };
        setSavedTheme(t);
        setLogs(data.logs ?? []);
        if (!silent || !loaded) {
          setBgColor(t.bgColor);
          setTextColor(t.textColor);
          setFontSize(t.fontSize);
          applyTheme(t);
          setLoaded(true);
        }
      } catch {

      }
    },
    [applyTheme, loaded],
  );

  useEffect(() => {
    fetchData(false);
  }, []);

  useEffect(() => {
    pollRef.current = setInterval(() => {
      fetchData(true);
    }, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  // Apply local (unsaved) changes to preview immediately
  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.transition = 'all 0.3s ease';
  }, [bgColor, textColor, fontSize]);

  const hasChanges =
    bgColor !== savedTheme.bgColor ||
    textColor !== savedTheme.textColor ||
    fontSize !== savedTheme.fontSize;

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bgColor, textColor, fontSize }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveMsg({ type: 'err', text: data.error ?? 'Gagal menyimpan' });
      } else {
        setSaveMsg({ type: 'ok', text: 'Tema berhasil disimpan!' });
        setSavedTheme({ bgColor, textColor, fontSize });
        // Immediately refresh logs
        await fetchData(true);
      }
    } catch {
      setSaveMsg({ type: 'err', text: 'Terjadi kesalahan jaringan' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  const handleReset = () => {
    setBgColor(savedTheme.bgColor);
    setTextColor(savedTheme.textColor);
    setFontSize(savedTheme.fontSize);
  };

  return (
    <div className="p-6 border-2 border-purple-400 bg-white rounded-xl shadow-lg my-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-black text-purple-700 flex items-center gap-2">
          👑 Panel Tema — Budak Pacil
        </h2>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
          LIVE
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        Perubahan disimpan ke server dan langsung berlaku untuk semua pengguna.
      </p>

      <div className="space-y-4">
        <ColorPicker label="Warna Latar" value={bgColor} onChange={setBgColor} />
        <ColorPicker label="Warna Teks" value={textColor} onChange={setTextColor} />

        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700 text-sm">Ukuran Font Global</label>
            <span className="text-sm font-mono text-gray-500">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="32"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-300">
            <span>12px</span>
            <span>32px</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg text-sm transition-all active:scale-95"
        >
          {saving ? 'Menyimpan…' : hasChanges ? '💾 Simpan Tema' : '✓ Tersimpan'}
        </button>
        {hasChanges && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {saveMsg && (
        <div
          className={`mt-3 text-sm text-center py-2 rounded-lg font-medium ${
            saveMsg.type === 'ok'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {saveMsg.text}
        </div>
      )}

      {/* Unsaved indicator */}
      {hasChanges && !saving && (
        <p className="text-xs text-amber-600 mt-2 text-center">
          ⚠ Ada perubahan yang belum disimpan
        </p>
      )}

      {/* Edit log */}
      <EditLogPanel logs={logs} />
    </div>
  );
}
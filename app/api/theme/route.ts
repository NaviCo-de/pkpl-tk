import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
 
const THEME_ID = 'global-theme';
 
export async function GET() {
  try {
    const theme = await prisma.themeSettings.upsert({
      where: { id: THEME_ID },
      update: {},
      create: {
        id: THEME_ID,
        bgColor: '#ffffff',
        textColor: '#000000',
        fontSize: 16,
      },
    });
 
    // Get last 50 edit logs newest first
    const logs = await prisma.editLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
 
    return NextResponse.json({ theme, logs });
  } catch (error) {
    console.error('GET /api/theme error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data tema' }, { status: 500 });
  }
}
 
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
 
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!dbUser || dbUser.role !== 'BUDAK_PACIL') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
 
  const body = await request.json();
  const { bgColor, textColor, fontSize } = body as {
    bgColor?: string;
    textColor?: string;
    fontSize?: number;
  };
 
  const current = await prisma.themeSettings.upsert({
    where: { id: THEME_ID },
    update: {},
    create: {
      id: THEME_ID,
      bgColor: '#ffffff',
      textColor: '#000000',
      fontSize: 16,
    },
  });
 
  const changes: string[] = [];
  const userName = dbUser.name ?? dbUser.email;
 
  if (bgColor !== undefined && bgColor !== current.bgColor) {
    changes.push(`mengganti warna latar dari ${current.bgColor} → ${bgColor}`);
  }
  if (textColor !== undefined && textColor !== current.textColor) {
    changes.push(`mengganti warna teks dari ${current.textColor} → ${textColor}`);
  }
  if (fontSize !== undefined && fontSize !== current.fontSize) {
    changes.push(`mengganti ukuran font dari ${current.fontSize}px → ${fontSize}px`);
  }
 
  if (changes.length === 0) {
    return NextResponse.json({ message: 'Tidak ada perubahan' });
  }
 
  const updated = await prisma.themeSettings.update({
    where: { id: THEME_ID },
    data: {
      ...(bgColor !== undefined ? { bgColor } : {}),
      ...(textColor !== undefined ? { textColor } : {}),
      ...(fontSize !== undefined ? { fontSize } : {}),
    },
  });
 
  await prisma.editLog.createMany({
    data: changes.map((desc) => ({
      userId: dbUser.id,
      userName,
      description: desc,
    })),
  });
 
  return NextResponse.json({ theme: updated, changes });
}
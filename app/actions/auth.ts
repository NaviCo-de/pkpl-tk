'use server'; // Ini adalah segel mutlak bahwa kode ini HANYA berjalan di Backend

import { createClient } from '@/lib/supabase-server';
import { loginSchema } from '@/lib/zod';

export async function authenticateUser(action: 'login' | 'register', formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validationResult = loginSchema.safeParse({ email, password });
  
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const supabase = await createClient();
  let authError = null;

  if (action === 'register') {
    const { error } = await supabase.auth.signUp({ email, password });
    authError = error;
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    authError = error;
  }

  if (authError) {
    return { error: `Sistem menolak: ${authError.message}` };
  }

  return { success: true };
}
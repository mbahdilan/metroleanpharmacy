import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { BLOG_GATE_COOKIE_NAME, verifySessionToken } from '@/lib/blogGateSession';

// Create a Supabase client with the admin rights
// This bypasses RLS policies entirely.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Re-checked here in addition to middleware — defense in depth in case the matcher
// config ever changes, rather than relying on a single enforcement point.
async function requireAuth(request: Request): Promise<NextResponse | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const gateToken = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${BLOG_GATE_COOKIE_NAME}=`))
    ?.slice(BLOG_GATE_COOKIE_NAME.length + 1);

  if (!(await verifySessionToken(gateToken))) {
    return NextResponse.json({ error: 'Blog passcode required' }, { status: 401 });
  }

  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return null;
}

export async function POST(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const payload = await request.json();
    const { data, error } = await supabaseAdmin.from('blog_posts').insert([payload]).select().single();
    if (error) throw error;

    revalidatePath('/blog');
    revalidatePath('/guides');
    revalidatePath('/admin/blog');

    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

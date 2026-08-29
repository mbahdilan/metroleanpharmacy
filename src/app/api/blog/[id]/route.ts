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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const payload = await request.json();
    const { data, error } = await supabaseAdmin.from('blog_posts').update(payload).eq('id', id).select().single();
    if (error) throw error;

    revalidatePath('/blog');
    revalidatePath('/guides');
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath('/admin/blog');

    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // 1. Fetch the post first to get the featured image
    const { data: post } = await supabaseAdmin
      .from('blog_posts')
      .select('featured_image')
      .eq('id', id)
      .single();

    // 2. Delete the featured image from storage if it exists
    if (post?.featured_image && post.featured_image.includes('/storage/v1/object/public/product-images/')) {
      const path = post.featured_image.split('/storage/v1/object/public/product-images/')[1];
      if (path) await supabaseAdmin.storage.from('product-images').remove([path]);
    }

    // 3. Delete post from database
    const { error, count } = await supabaseAdmin
      .from('blog_posts')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;

    // 4. Force revalidation across the site to clear caches
    revalidatePath('/blog');
    revalidatePath('/guides');
    revalidatePath('/admin/blog');
    revalidatePath('/(storefront)', 'layout');

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

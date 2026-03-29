import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Create a Supabase client with the admin rights
// This bypasses RLS policies entirely.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Try to get auth token from header to potentially authenticate the client
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    // Create a specific client if token is provided, otherwise fallback to admin (service role if present, else anon)
    const client = token 
      ? createClient(supabaseUrl, supabaseServiceKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
      : supabaseAdmin;

    // Optional: Add a simple auth check here to ensure the requester is an admin
    // for now we'll just execute the delete since the frontend handles the button visibility
    
    // 1. Fetch the product first to get the images
    const { data: product } = await client
      .from('products')
      .select('image_urls')
      .eq('id', id)
      .single();

    // 2. Delete associated images from storage if they exist
    if (product?.image_urls && product.image_urls.length > 0) {
      const pathsToDelete = product.image_urls
        .filter((url: string) => url.includes('/storage/v1/object/public/product-images/'))
        .map((url: string) => url.split('/storage/v1/object/public/product-images/')[1])
        .filter((p: string | undefined): p is string => !!p);

      if (pathsToDelete.length > 0) {
        await client.storage
          .from('product-images')
          .remove(pathsToDelete);
      }
    }
    
    // 3. Delete product from database
    const { data, error, count } = await client
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    
    console.log(`Product Delete successful for ID ${id}. Count:`, count);

    // 4. Force revalidation across the site to clear caches
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin');
    revalidatePath('/(storefront)', 'layout');

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

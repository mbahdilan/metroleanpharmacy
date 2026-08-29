import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  compare_at_price: string | null;
  sku: string;
  volume_ml: number;
  active_ingredient: string;
  units_in_stock: number;
  is_featured: boolean;
  is_active: boolean;
  image_urls: string[];
  created_at: string;

  dosage_form: 'Solid' | 'Liquid' | 'Cream' | 'Injection' | 'Other';
  therapeutic_class: string;
  requires_prescription: boolean;
  manufacturer: string;
  storage_instructions: string | null;
  side_effects: string | null;
  min_quantity: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content_html: string;
  featured_image: string | null;
  is_published: boolean;
  is_safety_content: boolean;
  created_at: string;
  updated_at: string;
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  compare_at_price: string | null;
  sku: string;
  volume_ml: number;
  scent_family: string | null; // legacy field, unused for OTC pharmacy products
  top_notes: string; // Active ingredient
  middle_notes: string; // legacy field, unused for OTC pharmacy products
  base_notes: string; // legacy field, unused for OTC pharmacy products
  units_in_stock: number;
  is_featured: boolean;
  is_active: boolean;
  image_url: string | null;
  image_urls: string[];
  created_at: string;
  
  dosage_form: 'Solid' | 'Liquid' | 'Cream' | 'Injection' | 'Other';
  therapeutic_class: string;
  expiry_date: string;
  requires_prescription: boolean;
  manufacturer: string;
  min_quantity: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

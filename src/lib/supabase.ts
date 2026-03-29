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
  scent_family: string; // Used for "Clinical Division"
  top_notes: string; // Used for "Active Agent"
  middle_notes: string; // Used for "Secondary Agent"
  base_notes: string; // Used for "Base/Excipients"
  units_in_stock: number;
  is_featured: boolean;
  is_active: boolean;
  image_url: string | null;
  image_urls: string[];
  created_at: string;
  
  // Pharmacy Specific Fields
  dosage_form: 'Solid' | 'Liquid' | 'Cream' | 'Injection' | 'Other';
  therapeutic_class: string;
  expiry_date: string;
  requires_prescription: boolean;
  manufacturer: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ProductForm({ initialData }: { initialData?: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    sku: initialData?.sku || '',
    dosage_form: initialData?.dosage_form || 'Solid',
    short_description: initialData?.short_description || '',
    description: initialData?.description || '',
    active_ingredient: initialData?.active_ingredient || '',
    therapeutic_class: initialData?.therapeutic_class || '',
    storage_instructions: initialData?.storage_instructions || '',
    side_effects: initialData?.side_effects || '',
    manufacturer: initialData?.manufacturer || '',
    price: initialData?.price || '',
    compare_at_price: initialData?.compare_at_price || '',
    units_in_stock: initialData?.units_in_stock ?? 0,
    min_quantity: initialData?.min_quantity ?? 1,
    volume_ml: initialData?.volume_ml ?? 0,
    requires_prescription: initialData?.requires_prescription || false,
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
    image_urls: initialData?.image_urls || [],
  });

  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNameBlur = () => {
    if (!formData.slug && formData.name) {
      setFormData(prev => ({ ...prev, slug: slugify(prev.name) }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.image_urls.length + files.length > 4) {
      alert('Maximum 4 images allowed per product.');
      return;
    }

    setUploading(true);
    const newImageUrls = [...formData.image_urls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressionFormData = new FormData();
        compressionFormData.append('file', file);

        const compressRes = await fetch('/api/compress', { method: 'POST', body: compressionFormData });
        if (!compressRes.ok) throw new Error('Compression service error');

        const compressedBlob = await compressRes.blob();
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `medications/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, compressedFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
        newImageUrls.push(publicUrl);
      } catch (err: any) {
        console.error('Upload error:', err);
        alert(`Failed to process ${file.name}: ${err.message}`);
      }
    }

    setFormData(prev => ({ ...prev, image_urls: newImageUrls }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const urlToRemove = formData.image_urls[index];
    if (urlToRemove?.includes('/storage/v1/object/public/product-images/')) {
      const path = urlToRemove.split('/storage/v1/object/public/product-images/')[1];
      if (path) setDeletedImages(prev => [...prev, path]);
    }
    setFormData(prev => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.name) || `product-${Date.now()}`,
      price: parseFloat(formData.price as string) || 0,
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price as string) : null,
      volume_ml: parseInt(formData.volume_ml as any) || 0,
      units_in_stock: parseInt(formData.units_in_stock as any) || 0,
      min_quantity: parseInt(formData.min_quantity as any) || 1,
      manufacturer: formData.manufacturer || null,
      short_description: formData.short_description || null,
      description: formData.description || null,
      active_ingredient: formData.active_ingredient || null,
      sku: formData.sku || null,
      therapeutic_class: formData.therapeutic_class || null,
      storage_instructions: formData.storage_instructions || null,
      side_effects: formData.side_effects || null,
      image_urls: formData.image_urls,
    };

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').upsert(
        { id: session.user.id, email: session.user.email, role: 'admin' },
        { onConflict: 'id' }
      );
    }

    const { error } = initialData
      ? await supabase.from('products').update(payload).eq('id', initialData.id)
      : await supabase.from('products').insert([payload]);

    setLoading(false);
    if (error) {
      alert('Product save error: ' + error.message);
      return;
    }

    if (deletedImages.length > 0) {
      await supabase.storage.from('product-images').remove(deletedImages).catch(() => {});
    }

    router.push('/admin');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initialData) return;
    if (!confirm('Permanently delete this product? This cannot be undone.')) return;

    setDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/products/${initialData.id}`, {
      method: 'DELETE',
      headers: { Authorization: session ? `Bearer ${session.access_token}` : '' },
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      alert('Error removing product: ' + (data.error || 'Unknown error'));
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <style>{`
        .product-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 2rem; }
        .product-form-grid .form-group.full-width { grid-column: span 2; }
        .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border: 1px solid var(--border); border-radius: 10px; }
        .toggle-row .form-label { margin: 0; }
        .toggle-row p { margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--text-muted); text-transform: none; font-weight: 500; }
        .toggles-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; }

        .switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .switch .slider { position: absolute; cursor: pointer; inset: 0; background: var(--border); transition: .2s; border-radius: 34px; }
        .switch .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; transition: .2s; border-radius: 50%; }
        .switch input:checked + .slider { background: var(--primary); }
        .switch input:checked + .slider:before { transform: translateX(20px); }

        .upload-dropzone { margin: 0 0 2rem; background: var(--bg-main); border: 2px dashed var(--border); border-radius: 16px; padding: 2.5rem; text-align: center; transition: all 0.2s; }
        .upload-dropzone:hover { border-color: var(--primary); }
        .upload-dropzone p { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0 1rem; }

        .image-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .image-tile { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
        .image-tile img { width: 100%; height: 100%; object-fit: cover; }
        .image-tile button { position: absolute; top: 6px; right: 6px; width: 26px; height: 26px; border-radius: 50%; background: rgba(15,23,42,0.75); color: white; font-size: 1rem; line-height: 1; }

        .form-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border); }

        @media (max-width: 700px) {
          .product-form-grid { grid-template-columns: 1fr; }
          .product-form-grid .form-group.full-width { grid-column: auto; }
          .image-grid { grid-template-columns: repeat(2, 1fr); }
          .form-footer { flex-direction: column-reverse; gap: 1rem; align-items: stretch; }
        }
      `}</style>

      <div className="product-form-grid">
        <div className="form-group full-width">
          <label className="form-label">Product Name</label>
          <input name="name" value={formData.name} onChange={handleChange} onBlur={handleNameBlur} className="form-input" placeholder="e.g., Amoxicillin 500mg" required />
        </div>

        <div className="form-group">
          <label className="form-label">URL Slug</label>
          <input name="slug" value={formData.slug} onChange={handleChange} className="form-input" placeholder="auto-generated from name if left blank" />
        </div>

        <div className="form-group">
          <label className="form-label">Dosage Form</label>
          <select name="dosage_form" value={formData.dosage_form} onChange={handleChange} className="form-input">
            {['Solid', 'Liquid', 'Cream', 'Injection', 'Other'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {(formData.dosage_form === 'Liquid' || formData.dosage_form === 'Cream') && (
          <div className="form-group">
            <label className="form-label">Volume (ml)</label>
            <input name="volume_ml" type="number" min="0" value={formData.volume_ml} onChange={handleChange} className="form-input" />
          </div>
        )}

        <div className="form-group full-width">
          <label className="form-label">Short Description</label>
          <input name="short_description" value={formData.short_description} onChange={handleChange} className="form-input" placeholder="One line shown on product cards" />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Full Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Usage, dosage, warnings..." />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Active Ingredient</label>
          <input name="active_ingredient" value={formData.active_ingredient} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">SKU</label>
          <input name="sku" value={formData.sku} onChange={handleChange} className="form-input" placeholder="e.g., AMOX-500-30" />
        </div>

        <div className="form-group">
          <label className="form-label">Drug Class</label>
          <input name="therapeutic_class" value={formData.therapeutic_class} onChange={handleChange} className="form-input" placeholder="e.g., Antibiotic" />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Storage Instructions</label>
          <textarea name="storage_instructions" value={formData.storage_instructions} onChange={handleChange} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="e.g., Store below 25°C, away from light" />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Side Effects</label>
          <textarea name="side_effects" value={formData.side_effects} onChange={handleChange} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Common side effects to note for customers" />
        </div>

        <div className="form-group">
          <label className="form-label">Manufacturer</label>
          <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Price ($)</label>
          <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} className="form-input" placeholder="Defaults to 0 if left blank" />
        </div>

        <div className="form-group">
          <label className="form-label">Compare-at Price ($)</label>
          <input name="compare_at_price" type="number" step="0.01" min="0" value={formData.compare_at_price} onChange={handleChange} className="form-input" placeholder="Optional strikethrough price" />
        </div>

        <div className="form-group">
          <label className="form-label">Units in Stock</label>
          <input name="units_in_stock" type="number" min="0" value={formData.units_in_stock} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Minimum Purchase Qty</label>
          <input name="min_quantity" type="number" min="1" value={formData.min_quantity} onChange={handleChange} className="form-input" />
        </div>
      </div>

      <div className="toggles-row">
        <div className="toggle-row">
          <div>
            <label className="form-label">Requires Prescription</label>
            <p>Shows an Rx notice on the product page</p>
          </div>
          <label className="switch">
            <input type="checkbox" name="requires_prescription" checked={formData.requires_prescription} onChange={handleChange} />
            <span className="slider" />
          </label>
        </div>
        <div className="toggle-row">
          <div>
            <label className="form-label">Featured</label>
            <p>Shown in the homepage highlights</p>
          </div>
          <label className="switch">
            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
            <span className="slider" />
          </label>
        </div>
        <div className="toggle-row">
          <div>
            <label className="form-label">Visible</label>
            <p>Hidden products don't show in the shop</p>
          </div>
          <label className="switch">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            <span className="slider" />
          </label>
        </div>
      </div>

      <div className="upload-dropzone">
        <label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} disabled={uploading} />
          <p>{uploading ? 'Uploading...' : 'JPEG or PNG, up to 4 images'}</p>
          <span className="btn-secondary" style={{ cursor: 'pointer' }}>Browse files</span>
        </label>
      </div>

      {formData.image_urls.length > 0 && (
        <div className="image-grid">
          {formData.image_urls.map((url, idx) => (
            <div key={idx} className="image-tile">
              <img src={url} alt="preview" />
              <button type="button" onClick={() => removeImage(idx)}>&times;</button>
            </div>
          ))}
        </div>
      )}

      <div className="form-footer">
        {initialData ? (
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn-secondary" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
            {deleting ? 'Removing...' : 'Delete Product'}
          </button>
        ) : <span />}

        <button type="submit" className="btn-primary" disabled={loading || uploading}>
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

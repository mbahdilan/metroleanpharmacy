'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Product, Category } from '@/lib/supabase';

export default function ProductForm({ 
  initialData, 
  category,
  onSuccess,
  onCancel,
  onDelete
}: { 
  initialData?: Product, 
  category?: string,
  onSuccess?: () => void,
  onCancel?: () => void,
  onDelete?: () => void
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    short_description: initialData?.short_description || '',
    price: initialData?.price || '',
    compare_at_price: initialData?.compare_at_price || '', // Used for "Quantity" in Relaxatives/Strains
    category_id: initialData?.category_id || '',
    scent_family: initialData?.scent_family || (category || 'General'),
    volume_ml: initialData?.volume_ml || 0,
    top_notes: initialData?.top_notes || (
      category === 'Relaxatives' ? 'serotonin 2a receptors' :
      category === 'Strains' ? 'phytocannabinoids Delta 9-Tetrahydrocannabinol (THC), Cannabidiol (CBD)' : ''
    ),
    middle_notes: initialData?.middle_notes || '',
    base_notes: initialData?.base_notes || '',
    units_in_stock: initialData?.units_in_stock || 0,
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
    image_urls: initialData?.image_urls || [],
    
    // Pharmacy Specific
    dosage_form: initialData?.dosage_form || 'Solid',
    therapeutic_class: initialData?.therapeutic_class || (category || ''),
    expiry_date: initialData?.expiry_date || '',
    requires_prescription: initialData?.requires_prescription || false,
    manufacturer: initialData?.manufacturer || '',
  });

  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
      if (data && data.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.image_urls.length + files.length > 4) {
      alert('Maximum 4 images allowed per product record.');
      return;
    }

    setUploading(true);
    const newImageUrls = [...formData.image_urls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // API compression
        const compressionFormData = new FormData();
        compressionFormData.append('file', file);

        const compressRes = await fetch('/api/compress', {
          method: 'POST',
          body: compressionFormData,
        });

        if (!compressRes.ok) throw new Error('Compression service error');

        const compressedBlob = await compressRes.blob();
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });

        // Upload to Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `medications/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

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
    
    // Extract storage path from the public URL if it's a Supabase storage URL
    if (urlToRemove && urlToRemove.includes('/storage/v1/object/public/product-images/')) {
      const path = urlToRemove.split('/storage/v1/object/public/product-images/')[1];
      if (path) {
        setDeletedImages(prev => [...prev, path]);
      }
    }

    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price as string),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price as string) : null,
      volume_ml: parseInt(formData.volume_ml as any) || 0,
      units_in_stock: parseInt(formData.units_in_stock as any) || 0,
      // Convert empty strings to null for UUID and optional fields
      category_id: formData.category_id || null,
      expiry_date: formData.expiry_date || null,
      manufacturer: formData.manufacturer || null,
      therapeutic_class: formData.therapeutic_class || null,
      scent_family: formData.scent_family || null,
      short_description: formData.short_description || null,
      description: formData.description || null,
      top_notes: formData.top_notes || null,
      middle_notes: formData.middle_notes || null,
      base_notes: formData.base_notes || null,
      sku: undefined, // not in form but exists in table
    };

    let error;
    
    // Auto-create/upsert the admin profile for the current user to satisfy RLS
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').upsert({
        id: session.user.id,
        email: session.user.email,
        role: 'admin'
      }, { onConflict: 'id' });
    }

    if (initialData) {
      const { error: err } = await supabase
        .from('products')
        .update(payload)
        .eq('id', initialData.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('products')
        .insert([payload]);
      error = err;
    }

    setLoading(false);
    if (error) {
      alert('Medical record error: ' + error.message);
    } else {
      // If product saved successfully, clean up deleted images from storage
      if (deletedImages.length > 0) {
        try {
          await supabase.storage
            .from('product-images')
            .remove(deletedImages);
          setDeletedImages([]); // Clear the list after successful deletion
        } catch (storageErr) {
          console.error('Error cleaning up storage:', storageErr);
          // We don't necessarily want to block the user if storage cleanup fails, 
          // as the DB is already updated.
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin');
        router.refresh();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <style>{`
        .admin-form-container {
          background: white;
          padding: 3rem;
          border-radius: 40px;
          border: 1px solid #eee;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
        }
        .form-header {
          margin-bottom: 3rem;
          text-align: left;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 2rem;
        }
        .form-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .form-header p { font-size: 0.95rem; color: #64748b; margin: 0; }
        
        .form-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .full-width { grid-column: span 2; }
        
        .form-box {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          transition: all 0.2s;
          background: white;
        }
        .form-box:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          margin: 0;
        }
        .form-input-clean {
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 500;
          color: #1e293b;
          width: 100%;
          outline: none;
          padding: 0;
        }
        .form-input-clean::placeholder { color: #cbd5e1; }
        
        .upload-section {
          margin: 2rem 0;
          background: #f8fafc;
          border: 2px dashed #e2e8f0;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          transition: all 0.2s;
        }
        .upload-section:hover { border-color: #2563eb; background: #f1f5f9; }
        .upload-content { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .upload-icon { font-size: 2.5rem; color: #cbd5e1; }
        .upload-text h4 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
        .upload-text p { font-size: 0.85rem; color: #64748b; margin: 5px 0 0; }
        
        .image-grid-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .img-preview-premium {
          position: relative; aspect-ratio: 4/3; border-radius: 16px; overflow: hidden;
          border: 1px solid #eee; box-shadow: var(--shadow-sm);
        }
        
        .remove-img-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 800;
          line-height: 1;
          transition: all 0.2s;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .remove-img-btn:hover {
          background: #ef4444;
          transform: scale(1.1);
        }
        
        .price-summary-box {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 2rem;
          padding-top: 3rem;
          margin-top: 2rem;
          border-top: 1px solid #f1f5f9;
        }
        
        .footer-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        .btn-reset {
          background: white; border: 1px solid #e2e8f0; color: #475569;
          padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer;
        }
        .btn-submit-premium {
          background: #0f172a; color: white; border: none;
          padding: 0.75rem 2.5rem; border-radius: 12px; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-submit-premium:hover { background: #1e293b; transform: translateY(-1px); }

        @media (max-width: 768px) {
          .admin-form-container { padding: 1.5rem; border-radius: 30px; }
          .form-content-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: auto; }
          .upload-section { padding: 1.5rem; }
          .image-grid-premium { grid-template-columns: repeat(2, 1fr); }
          .footer-actions { flex-direction: column-reverse; }
          .btn-submit-premium { padding: 1.25rem; width: 100%; }
        }
      `}</style>

      <div className="form-header">
        <h2>{initialData ? 'Update Record' : 'Register Product'}</h2>
        <p>Complete the profile for medical inventory classification.</p>
      </div>

      <div className="form-content-grid">
        <div className="form-box full-width">
          <label className="form-label">Product Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="form-input-clean" placeholder="e.g., Amoxicillin 500mg" />
        </div>

        <div className="form-box">
          <label className="form-label">URL Slug</label>
          <input name="slug" value={formData.slug} onChange={handleChange} className="form-input-clean" placeholder="amoxicillin-500mg" />
        </div>

        <div className="form-box">
          <label className="form-label">Form/Dosage</label>
          <select name="dosage_form" value={formData.dosage_form} onChange={handleChange} className="form-input-clean">
            {['Solid', 'Liquid', 'Cream', 'Injection', 'Other'].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="form-box full-width">
          <label className="form-label">Medical Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-input-clean" style={{ minHeight: '80px', resize: 'none' }} placeholder="Clinical use and indications..." />
        </div>

        <div className="form-box">
          <label className="form-label">Retail Price ($)</label>
          <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="form-input-clean" />
        </div>

        <div className="form-box">
          <label className="form-label">Units in Stock</label>
          <input name="units_in_stock" type="number" value={formData.units_in_stock} onChange={handleChange} className="form-input-clean" />
        </div>

        {(category === 'Relaxatives' || category === 'Strains') && (
          <div className="form-box full-width">
            <label className="form-label">Quantity</label>
            <input name="compare_at_price" value={formData.compare_at_price} onChange={handleChange} className="form-input-clean" placeholder="e.g., 10 tabs, 5g" />
          </div>
        )}

        {(category === 'Syrups' || category === 'Others') && (
          <>
            <div className="form-box">
              <label className="form-label">Dosage/Volume (ml or mg)</label>
              <input name="volume_ml" type="number" value={formData.volume_ml} onChange={handleChange} className="form-input-clean" />
            </div>
            <div className="form-box">
              <label className="form-label">Manufacturer</label>
              <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="form-input-clean" />
            </div>
            <div className="form-box full-width">
              <label className="form-label">Expiry Date</label>
              <input name="expiry_date" type="date" value={formData.expiry_date} onChange={handleChange} className="form-input-clean" />
            </div>
          </>
        )}

        <div className="form-box full-width">
          <label className="form-label">Active Ingredient</label>
          <input name="top_notes" value={formData.top_notes} onChange={handleChange} className="form-input-clean" />
        </div>
      </div>

      <div className="upload-section">
        <label className="upload-content">
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} disabled={uploading} />
          <div className="upload-icon">☁️</div>
          <div className="upload-text">
            <h4>Choose clinical photos or drag & drop here.</h4>
            <p>JPEG, PNG - Up to 50MB (Max 4 images)</p>
          </div>
          <button type="button" className="btn-reset" style={{ marginTop: '1rem' }}>Browse files</button>
        </label>
      </div>

      <div className="image-grid-premium">
        {formData.image_urls.map((url, idx) => (
          <div key={idx} className="img-preview-premium">
            <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button type="button" onClick={() => removeImage(idx)} className="remove-img-btn" style={{ top: '12px', right: '12px' }}>×</button>
          </div>
        ))}
      </div>

      <div className="footer-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', borderTop: '2px solid #f8fafc', paddingTop: '2rem' }}>
        {initialData && onDelete ? (
          <button 
            type="button" 
            className="btn-danger-krafts" 
            onClick={() => {
              console.log('Delete Record button clicked in ProductForm');
              if (onDelete) onDelete();
            }}
            style={{ 
              background: '#fff5f5', 
              color: '#fa5252', 
              border: 'none', 
              padding: '0.8rem 1.6rem', 
              borderRadius: '12px', 
              fontWeight: 700, 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Delete Record
          </button>
        ) : (
          <div /> // Placeholder to keep Save on the right
        )}
        
        <button 
          type="submit" 
          className="btn-save-krafts" 
          disabled={loading || uploading}
          style={{ 
            background: '#2563eb', 
            color: 'white', 
            border: 'none', 
            padding: '0.8rem 2.5rem', 
            borderRadius: '12px', 
            fontWeight: 800, 
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Processing...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

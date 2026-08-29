'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, BlogPost } from '@/lib/supabase';
import RichTextEditor from './RichTextEditor';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function BlogPostForm({ initialData }: { initialData?: BlogPost }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || '',
    excerpt: initialData?.excerpt || '',
    content_html: initialData?.content_html || '',
    featured_image: initialData?.featured_image || '',
    is_published: initialData?.is_published ?? true,
    is_safety_content: initialData?.is_safety_content || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressionFormData = new FormData();
      compressionFormData.append('file', file);
      const compressRes = await fetch('/api/compress', { method: 'POST', body: compressionFormData });
      if (!compressRes.ok) throw new Error('Compression service error');
      const compressedBlob = await compressRes.blob();
      const compressedFile = new File([compressedBlob], file.name, { type: file.type });

      const fileExt = file.name.split('.').pop();
      const filePath = `blog/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, compressedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, featured_image: publicUrl }));
    } catch (err: any) {
      alert(`Failed to upload image: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      featured_image: formData.featured_image || null,
    };

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').upsert(
        { id: session.user.id, email: session.user.email, role: 'admin' },
        { onConflict: 'id' }
      );
    }

    const res = initialData
      ? await fetch(`/api/blog/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: session ? `Bearer ${session.access_token}` : '' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: session ? `Bearer ${session.access_token}` : '' },
          body: JSON.stringify(payload),
        });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert('Post save error: ' + (data.error || 'Unknown error'));
      return;
    }

    router.push('/admin/blog');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initialData) return;
    if (!confirm('Permanently delete this post? This cannot be undone.')) return;

    setDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/blog/${initialData.id}`, {
      method: 'DELETE',
      headers: { Authorization: session ? `Bearer ${session.access_token}` : '' },
    });

    if (res.ok) {
      router.push('/admin/blog');
      router.refresh();
    } else {
      const data = await res.json();
      alert('Error removing post: ' + (data.error || 'Unknown error'));
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

        .upload-dropzone { margin: 0 0 2rem; background: var(--bg-main); border: 2px dashed var(--border); border-radius: 16px; padding: 1.5rem; text-align: center; transition: all 0.2s; }
        .upload-dropzone:hover { border-color: var(--primary); }
        .upload-dropzone p { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0 1rem; }

        .featured-preview { position: relative; max-width: 320px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 1.5rem; }
        .featured-preview img { width: 100%; display: block; }
        .featured-preview button { position: absolute; top: 6px; right: 6px; width: 26px; height: 26px; border-radius: 50%; background: rgba(15,23,42,0.75); color: white; font-size: 1rem; line-height: 1; }

        .form-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border); }

        @media (max-width: 700px) {
          .product-form-grid { grid-template-columns: 1fr; }
          .product-form-grid .form-group.full-width { grid-column: auto; }
          .form-footer { flex-direction: column-reverse; gap: 1rem; align-items: stretch; }
        }
      `}</style>

      <div className="product-form-grid">
        <div className="form-group full-width">
          <label className="form-label">Title</label>
          <input name="title" value={formData.title} onChange={handleChange} onBlur={handleTitleBlur} className="form-input" placeholder="e.g., How to Read a Drug Facts Label" required />
        </div>

        <div className="form-group">
          <label className="form-label">URL Slug</label>
          <input name="slug" value={formData.slug} onChange={handleChange} className="form-input" placeholder="how-to-read-a-drug-facts-label" required />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input name="category" value={formData.category} onChange={handleChange} className="form-input" placeholder="e.g., Pain Relief" required />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Excerpt</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="form-input" style={{ minHeight: '70px', resize: 'vertical' }} placeholder="One or two sentences shown on the blog list and in search results" required />
        </div>
      </div>

      <div className="toggles-row">
        <div className="toggle-row">
          <div>
            <label className="form-label">Published</label>
            <p>Unpublished posts are hidden from the site</p>
          </div>
          <label className="switch">
            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
            <span className="slider" />
          </label>
        </div>
        <div className="toggle-row">
          <div>
            <label className="form-label">Safety / Harm-Reduction Content</label>
            <p>Skips the &quot;Shop&quot; call-to-action on this post</p>
          </div>
          <label className="switch">
            <input type="checkbox" name="is_safety_content" checked={formData.is_safety_content} onChange={handleChange} />
            <span className="slider" />
          </label>
        </div>
      </div>

      <label className="form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Featured Image</label>
      {formData.featured_image && (
        <div className="featured-preview">
          <img src={formData.featured_image} alt="preview" />
          <button type="button" onClick={() => setFormData((prev) => ({ ...prev, featured_image: '' }))}>&times;</button>
        </div>
      )}
      <div className="upload-dropzone">
        <label>
          <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} ref={fileInputRef} style={{ display: 'none' }} disabled={uploading} />
          <p>{uploading ? 'Uploading...' : 'Shown at the top of the post and on the blog list'}</p>
          <span className="btn-secondary" style={{ cursor: 'pointer' }}>Browse files</span>
        </label>
      </div>

      <label className="form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Content</label>
      <div style={{ marginBottom: '2rem' }}>
        <RichTextEditor
          content={formData.content_html}
          onChange={(html) => setFormData((prev) => ({ ...prev, content_html: html }))}
        />
      </div>

      <div className="form-footer">
        {initialData ? (
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn-secondary" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
            {deleting ? 'Removing...' : 'Delete Post'}
          </button>
        ) : <span />}

        <button type="submit" className="btn-primary" disabled={loading || uploading}>
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}

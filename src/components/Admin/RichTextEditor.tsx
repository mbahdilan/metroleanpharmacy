'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL (internal, e.g. /shop, or external)', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err: any) {
      alert(`Failed to upload image: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const btn = (active: boolean) => `rte-btn${active ? ' active' : ''}`;

  return (
    <div className="rte-wrapper">
      <style>{`
        .rte-wrapper { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .rte-toolbar { display: flex; flex-wrap: wrap; gap: 0.25rem; padding: 0.5rem; background: var(--bg-main); border-bottom: 1px solid var(--border); }
        .rte-btn { padding: 0.4rem 0.7rem; border-radius: 6px; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); background: transparent; }
        .rte-btn:hover { background: var(--bg-card-hover); }
        .rte-btn.active { background: var(--primary); color: white; }
        .rte-btn:disabled { opacity: 0.4; cursor: default; }
        .rte-content { min-height: 320px; padding: 1.25rem; font-size: 1rem; line-height: 1.7; color: var(--text-primary); }
        .rte-content:focus { outline: none; }
        .rte-content h2 { font-size: 1.4rem; margin: 1.25rem 0 0.5rem; color: var(--accent); }
        .rte-content h3 { font-size: 1.15rem; margin: 1rem 0 0.5rem; color: var(--accent); }
        .rte-content p { margin: 0 0 0.9rem; }
        .rte-content ul, .rte-content ol { margin: 0 0 0.9rem 1.25rem; }
        .rte-content li { margin-bottom: 0.4rem; }
        .rte-content a { color: var(--primary); text-decoration: underline; }
        .rte-content img { max-width: 100%; border-radius: 10px; display: block; margin: 1rem auto; }
        .rte-content blockquote { border-left: 3px solid var(--primary); margin: 0 0 0.9rem; padding-left: 1rem; color: var(--text-secondary); }
      `}</style>

      <div className="rte-toolbar">
        <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" className={btn(editor.isActive('link'))} onClick={setLink}>Link</button>
        <label className="rte-btn" style={{ cursor: uploading ? 'default' : 'pointer' }}>
          {uploading ? 'Uploading...' : 'Image'}
          <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} disabled={uploading} style={{ display: 'none' }} />
        </label>
        <button type="button" className="rte-btn" onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button type="button" className="rte-btn" onClick={() => editor.chain().focus().redo().run()}>Redo</button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

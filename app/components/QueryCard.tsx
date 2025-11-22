// app/components/QueryCard.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface QueryCardProps {
  id: number;
  title: string;
  description: string | null; // Deskripsi bisa jadi 'null'
  query_text: string;
}

export default function QueryCard({ id, title, description, query_text }: QueryCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // State untuk form edit
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || '');
  const [editQueryText, setEditQueryText] = useState(query_text.trim());
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus kueri ini?')) return;
    setIsLoading(true);
    try {
      await fetch(`/api/queries/${id}`, { method: 'DELETE' });
      router.refresh();
    } catch (error) {
      alert('Gagal menghapus kueri.');
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/queries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          query_text: editQueryText,
        }),
      });
      if (response.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert('Gagal mengupdate kueri.');
      }
    } catch (error) {
      alert('Gagal mengupdate kueri.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 w-full p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      {isEditing ? (
        // ========================
        // ===    MODE EDIT     ===
        // ========================
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Judul</label>
            <input
              type="text" value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)} required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
            <input
              type="text" value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Kueri SQL</label>
            <textarea
              value={editQueryText}
              onChange={(e) => setEditQueryText(e.target.value)} required
              rows={10}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white font-mono"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={isLoading}
              className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)}
              className="px-4 py-2 font-bold text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        // ========================
        // ===    MODE TAMPIL   ===
        // ========================
        <>
          <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
          {description && <p className="text-gray-400 mb-4">{description}</p>}

          <div className="relative bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700">
            <div className="absolute top-2 left-2 z-10 flex gap-2">
              <button onClick={() => setIsEditing(true)}
                className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
              > <FaEdit /> </button>
              <button onClick={handleDelete} disabled={isLoading}
                className="p-2 rounded-md bg-red-700 hover:bg-red-600 text-white disabled:bg-gray-500"
              > <FaTrash /> </button>
            </div>
            <CopyButton codeToCopy={query_text.trim()} />
            <SyntaxHighlighter
              language="sql" // <-- Kita hard-code SQL!
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: '20px', paddingTop: '50px' }}
              showLineNumbers
            >
              {query_text.trim()}
            </SyntaxHighlighter>
          </div>
        </>
      )}
    </div>
  );
}
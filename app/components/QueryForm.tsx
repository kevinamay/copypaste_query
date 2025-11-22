// app/components/QueryForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QueryForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [query_text, setQueryText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Mengupload...');

    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, query_text }),
      });

      if (response.ok) {
        setMessage('Upload berhasil!');
        setTitle('');
        setDescription('');
        setQueryText('');
        router.refresh(); // Otomatis refresh daftar kueri
      } else {
        const data = await response.json();
        setMessage(`Gagal: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Error: Gagal terhubung ke server.');
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 mx-auto mb-12 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-2xl font-semibold mb-4 text-white">
        Tambahkan Kueri SQL Baru
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Judul Kueri (Misal: "Select Semua User")
          </label>
          <input
            id="title" type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} required
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Deskripsi (Opsional)
          </label>
          <input
            id="description" type="text" value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="query_text" className="block text-sm font-medium text-gray-300 mb-1">
            Teks Kueri (SQL)
          </label>
          <textarea
            id="query_text" value={query_text}
            onChange={(e) => setQueryText(e.target.value)} required
            rows={8}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="SELECT * FROM users WHERE status = 'active';"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Simpan Kueri
        </button>
        {message && <p className="mt-4 text-center text-sm text-gray-400">{message}</p>}
      </form>
    </div>
  );
}
// app/page.tsx
import { sql } from "@vercel/postgres";
import QueryForm from "./components/QueryForm";
import QueryCard from "./components/QueryCard";

// Tentukan tipe data
interface SqlQuery {
  id: number;
  title: string;
  description: string | null;
  query_text: string;
}

// Selalu ambil data terbaru
export const dynamic = 'force-dynamic';

export default async function Home() {

  // Ambil semua kueri dari database
  const { rows } = await sql<SqlQuery>`
    SELECT id, title, description, query_text 
    FROM sql_queries 
    ORDER BY created_at DESC;
  `;

  const allQueries = rows;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-900">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-white">
          Bank Kueri SQL 🏦
        </h1>
        <p className="text-lg text-gray-400">
          Tempat menyimpan dan meng-copy kueri database.
        </p>
      </div>

      {/* Form Upload */}
      <QueryForm />

      <hr className="w-full max-w-4xl border-t-2 border-gray-700 my-12" />

      {/* Daftar Kueri */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Daftar Kueri Tersimpan
        </h2>

        {allQueries.map((query) => (
          <QueryCard
            key={query.id}
            id={query.id}
            title={query.title}
            description={query.description}
            query_text={query.query_text}
          />
        ))}

        {allQueries.length === 0 && (
          <p className="text-center text-gray-400">
            Belum ada kueri. Silakan tambahkan satu!
          </p>
        )}
      </div>
    </main>
  );
}

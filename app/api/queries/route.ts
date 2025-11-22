// app/api/queries/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { title, description, query_text } = await request.json();

    if (!title || !query_text) {
      return NextResponse.json(
        { error: 'Judul dan kueri tidak boleh kosong' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO sql_queries (title, description, query_text)
      VALUES (${title}, ${description}, ${query_text})
      RETURNING id;
    `;

    return NextResponse.json(
      { message: 'Kueri berhasil disimpan', id: result.rows[0].id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error di API route:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan di server' },
      { status: 500 }
    );
  }
}
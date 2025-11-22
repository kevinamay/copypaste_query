// app/api/queries/[id]/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// --- FUNGSI UNTUK MENGHAPUS (DELETE) ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await sql`DELETE FROM sql_queries WHERE id = ${Number(id)};`;
    return NextResponse.json({ message: 'Kueri dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error saat menghapus' }, 
      { status: 500 }
    );
  }
}

// --- FUNGSI UNTUK MENG-UPDATE (PUT/EDIT) ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { title, description, query_text } = await request.json();

    if (!title || !query_text) {
      return NextResponse.json(
        { error: 'Judul dan kueri tidak boleh kosong' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE sql_queries 
      SET title = ${title}, description = ${description}, query_text = ${query_text}
      WHERE id = ${Number(id)};
    `;

    return NextResponse.json(
      { message: 'Kueri berhasil diupdate' }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error saat update' }, 
      { status: 500 }
    );
  }
}
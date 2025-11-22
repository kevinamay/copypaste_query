// app/api/queries/[id]/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// --- FUNGSI UNTUK MENGHAPUS (DELETE) ---
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // 1. Params dibungkus Promise
) {
  try {
    const { id } = await context.params; // 2. Kita harus 'await' params

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ada' }, { status: 400 });
    }

    await sql`
      DELETE FROM sql_queries 
      WHERE id = ${Number(id)};
    `;

    return NextResponse.json(
      { message: 'Kueri dihapus' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saat menghapus:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan di server' },
      { status: 500 }
    );
  }
}

// --- FUNGSI UNTUK MENG-UPDATE (PUT/EDIT) ---
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // 1. Params dibungkus Promise
) {
  try {
    const { id } = await context.params; // 2. Kita harus 'await' params
    
    const { title, description, query_text } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ada' }, { status: 400 });
    }
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
    console.error('Error saat update:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan di server' },
      { status: 500 }
    );
  }
}
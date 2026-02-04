import { withAuth } from "@/app/lib/auth-middleware";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function deleteTugas(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const idTugas = parseInt(params.id);
    const mahasiswa = (request as any).mahasiswa;

    // Validasi
    const existing = await prisma.tugas.findUnique({
      where: { id_tugas: idTugas },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Tugas tidak ditemukan" },
        { status: 404 },
      );
    }

    if (existing.id_mahasiswa !== parseInt(mahasiswa.id_mahasiswa)) {
      return NextResponse.json(
        { message: "Anda tidak berhak menghapus tugas ini" },
        { status: 403 },
      );
    }

    // delete
    await prisma.tugas.delete({
      where: { id_tugas: idTugas },
    });

    return NextResponse.json({ message: "Tugas berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 },
    );
  }
}

async function updateTugas(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const idTugas = parseInt(params.id);
    const mahasiswa = (request as any).mahasiswa;
    const body = await request.json();

    // Validasi
    const existing = await prisma.tugas.findUnique({
      where: { id_tugas: idTugas },
    });

    if (
      !existing ||
      existing.id_mahasiswa !== parseInt(mahasiswa.id_mahasiswa)
    ) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const updateData: any = {};

    if (body.namaTugas) updateData.namaTugas = body.namaTugas;
    if (body.matkulTugas) updateData.matkulTugas = body.matkulTugas;
    if (body.tenggat) updateData.tenggatTugas = new Date(body.tenggat);

    // Update
    const updated = await prisma.tugas.update({
      where: { id_tugas: idTugas },
      data: updateData,
    });

    return NextResponse.json({
      message: "Tugas berhasil diperbarui",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal update", error: error.message },
      { status: 500 },
    );
  }
}

export const DELETE = withAuth(deleteTugas);
export const PATCH = withAuth(updateTugas);

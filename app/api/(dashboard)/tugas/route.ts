import { withAuth } from "@/app/lib/auth-middleware";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function getTugas(request: NextRequest, context: any) {
  try {
    const mahasiswa = (request as any).mahasiswa;
    const idMahasiswa = parseInt(mahasiswa.id_mahasiswa);
    const now = new Date();

    await prisma.tugas.updateMany({
      where: {
        id_mahasiswa: idMahasiswa,
        tenggatTugas: {
          lt: now,
        },
        id_status: {
          not: 4,
        },
      },
      data: {
        id_status: 4,
      },
    });

    const listTugas = await prisma.tugas.findMany({
      where: { id_mahasiswa: idMahasiswa },
      include: {
        statusTugas: true,
      },
      orderBy: {
        tenggatTugas: "asc",
      },
    });

    return NextResponse.json({
      message: "Berhasil memuat tugas",
      data: listTugas,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal memuat tugas", error: error.message },
      { status: 500 },
    );
  }
}

async function createTugas(request: NextRequest, context: any) {
  try {
    const mahasiswa = (request as any).mahasiswa;
    const body = await request.json();

    const { namaTugas, matkulTugas, tenggat, id_status } = body;

    // Validasi Input
    if (!namaTugas || !matkulTugas || !tenggat || !id_status) {
      return NextResponse.json(
        { message: "Semua data wajib diisi" },
        { status: 400 },
      );
    }

    const newTugas = await prisma.tugas.create({
      data: {
        id_mahasiswa: parseInt(mahasiswa.id_mahasiswa),
        namaTugas: namaTugas,
        matkulTugas: matkulTugas,
        tenggatTugas: new Date(tenggat),
        id_status: parseInt(id_status),
      },
    });

    return NextResponse.json(
      {
        message: "Tugas berhasil dicatat",
        data: newTugas,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create Tugas Error:", error);
    return NextResponse.json(
      { message: "Gagal membuat tugas", error: error.message },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getTugas);
export const POST = withAuth(createTugas);

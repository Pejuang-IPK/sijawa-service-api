import { withAuth } from "@/app/lib/auth-middleware";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function getHandler(request: Request) {
  try {
    const mahasiswa = (request as any).mahasiswa;
    const idMahasiswa = mahasiswa.id_mahasiswa;

    const jadwal = await prisma.jadwal.findMany({
      where: { id_mahasiswa: Number(idMahasiswa) },
    });

    return NextResponse.json(
      {
        message: "Berhasil memuat jadwal",
        data: jadwal,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal memuat jadwal", error: error.message },
      { status: 500 },
    );
  }
}

async function createHandler(request: NextRequest) {
  try {
    const mahasiswa = (request as any).mahasiswa;
    const idMahasiswa = parseInt(mahasiswa.id_mahasiswa);

    const body = await request.json();
    const {
      hari,
      namaMatkul,
      jam_mulai,
      jam_selesai,
      kelasMatkul,
      sks,
      dosenMatkul,
    } = body;

    if (!hari || !namaMatkul || !jam_mulai || !jam_selesai) {
      return NextResponse.json(
        { message: "Data hari, matkul, dan jam wajib diisi" },
        { status: 400 },
      );
    }

    const dateMulai = new Date(`1970-01-01T${jam_mulai}:00Z`);
    const dateSelesai = new Date(`1970-01-01T${jam_selesai}:00Z`);

    if (isNaN(dateMulai.getTime()) || isNaN(dateSelesai.getTime())) {
      return NextResponse.json(
        {
          message: "Format jam salah. Gunakan format HH:mm (contoh: 08:30)",
        },
        { status: 400 },
      );
    }

    const newJadwal = await prisma.jadwal.create({
      data: {
        id_mahasiswa: idMahasiswa,
        hari: hari,
        namaMatkul: namaMatkul,
        jam_mulai: dateMulai,
        jam_selesai: dateSelesai,
        kelasMatkul: kelasMatkul,
        sks: parseInt(sks) || 0,
        dosenMatkul: dosenMatkul,
      },
    });

    return NextResponse.json(
      {
        message: "Jadwal berhasil dibuat",
        data: newJadwal,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create Jadwal Error:", error);
    return NextResponse.json(
      { message: "Gagal membuat jadwal", error: error.message },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(createHandler);

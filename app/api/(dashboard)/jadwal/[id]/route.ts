import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { withAuth } from "@/app/lib/auth-middleware";

//parameter [id]
type Params = {
  params: { id: string };
};

async function deleteHandler(request: NextRequest, context: any) {
  try {
    const params = await context.params;

    // Validasi Params
    if (!params || !params.id) {
      return NextResponse.json(
        { message: "ID URL tidak ditemukan. Cek nama folder [id]." },
        { status: 400 },
      );
    }

    const idJadwal = parseInt(params.id);
    const mahasiswa = (request as any).mahasiswa;

    const existingJadwal = await prisma.jadwal.findUnique({
      where: { id_jadwal: idJadwal },
    });

    if (!existingJadwal) {
      return NextResponse.json(
        { message: "Jadwal tidak ditemukan" },
        { status: 404 },
      );
    }

    if (existingJadwal?.id_mahasiswa !== parseInt(mahasiswa.id_mahasiswa)) {
      return NextResponse.json(
        { message: "Anda tidak berhak menghapus jadwal ini" },
        { status: 403 },
      );
    }

    // delete
    await prisma.jadwal.delete({
      where: { id_jadwal: idJadwal },
    });

    return NextResponse.json(
      { message: "Jadwal berhasil dihapus" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal menghapus jadwal", error: error.message },
      { status: 500 },
    );
  }
}

async function patchHandler(request: NextRequest, context: any) {
  try {
    const params = await context.params;

    // Validasi Params
    if (!params || !params.id) {
      return NextResponse.json(
        { message: "ID URL tidak ditemukan. Cek nama folder [id]." },
        { status: 400 },
      );
    }

    const idJadwal = parseInt(params.id);

    const mahasiswa = (request as any).mahasiswa;
    const body = await request.json();

    const existingJadwal = await prisma.jadwal.findFirst({
      where: { id_jadwal: idJadwal },
    });

    if (!existingJadwal) {
      return NextResponse.json(
        { message: "Jadwal tidak ditemukan" },
        { status: 404 },
      );
    }

    if (existingJadwal?.id_mahasiswa !== parseInt(mahasiswa.id_mahasiswa)) {
      return NextResponse.json(
        { message: "Anda tidak berhak mengedit jadwal ini" },
        { status: 403 },
      );
    }

    let dateMulai = undefined;
    let dateSelesai = undefined;

    if (body.jam_mulai) {
      dateMulai = new Date(`1970-01-01T${body.jam_mulai}:00Z`);
      if (isNaN(dateMulai.getTime())) {
        return NextResponse.json(
          { message: "Format jam mulai salah" },
          { status: 400 },
        );
      }
    }

    if (body.jam_selesai) {
      dateSelesai = new Date(`1970-01-01T${body.jam_selesai}:00Z`);
      if (isNaN(dateSelesai.getTime())) {
        return NextResponse.json(
          { message: "Format jam selesai salah" },
          { status: 400 },
        );
      }
    }

    const updatedJadwal = await prisma.jadwal.update({
      where: { id_jadwal: idJadwal },
      data: {
        hari: body.hari, // Jika body.hari undefined, Prisma akan abaikan (jika pakai undefined)
        namaMatkul: body.namaMatkul,
        kelasMatkul: body.kelasMatkul,
        dosenMatkul: body.dosenMatkul,
        sks: body.sks ? parseInt(body.sks) : undefined,
        jam_mulai: dateMulai, // Akan update jika ada value baru
        jam_selesai: dateSelesai,
      },
    });

    return NextResponse.json(
      {
        message: "Jadwal berhasil diupdate",
        data: updatedJadwal,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal update jadwal", error: error.message },
      { status: 500 },
    );
  }
}

export const DELETE = withAuth(deleteHandler);
export const PATCH = withAuth(patchHandler);

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nama, password } = body;

    if (!email || !nama || !password) {
      return NextResponse.json(
        { message: "Semua field (email, nama, password) wajib diisi" },
        { status: 400 },
      );
    }

    const existingMahasiswa = await prisma.mahasiswa.findFirst({
      where: { email: email },
    });

    if (existingMahasiswa) {
      return NextResponse.json(
        { message: "Email sudah terdaftar, gunakan email lain." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id_mahasiswa = Math.floor(Math.random() * 1000000);

    const newMahasiswa = await prisma.mahasiswa.create({
      data: {
        id_mahasiswa,
        email,
        nama,
        password: hashedPassword,
      },
    });

    const { password: _, ...mahasiswaWithoutPassword } = newMahasiswa;

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        data: mahasiswaWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Register Error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan Password wajib diisi", ok: false },
        { status: 400 },
      );
    }

    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: { email: email },
    });

    if (!mahasiswa || !mahasiswa.password) {
      return NextResponse.json(
        { message: "Email atau Password salah", ok: false },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, mahasiswa.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Email atau Password salah", ok: false },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        id_mahasiswa: mahasiswa.id_mahasiswa,
        email: mahasiswa.email,
        nama: mahasiswa.nama,
        role: "mahasiswa",
      },
      process.env.NEXTAUTH_SECRET || "your-secret-key",
      { expiresIn: "30d" },
    );

    return NextResponse.json(
      {
        message: "Login berhasil",
        token: token,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 },
    );
  }
}

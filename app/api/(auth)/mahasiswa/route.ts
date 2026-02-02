// app/api/users/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mahasiswa = await prisma.mahasiswa.findMany(); // Ambil data
    return NextResponse.json(mahasiswa, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal ambil data", error: error.message },
      { status: 500 },
    );
  }
}

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jadwal = await prisma.jadwal.findMany(); // Ambil data
    // return NextResponse.json(jadwal, { status: 200 });
    return NextResponse.json({ message: "Disini nanti data jadwal" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal ambil data", error: error.message },
      { status: 500 },
    );
  }
}

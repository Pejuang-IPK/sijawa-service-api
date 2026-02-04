import { withAuth } from "@/app/lib/auth-middleware";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

async function getStatusTugas(request: Request, context: any) {
  try {
    // Ambil data Master Status (Masih Bisa Ditunda, Tolong Dikerjakan, dll)
    const statusList = await prisma.statusTugas.findMany();

    return NextResponse.json({
      message: "Data status berhasil dimuat",
      data: statusList,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil status" }, { status: 500 });
  }
}

export const GET = withAuth(getStatusTugas);

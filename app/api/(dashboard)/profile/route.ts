import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";

async function handler(request: NextRequest) {
  const mahasiswa = (request as any).mahasiswa;

  return NextResponse.json(
    {
      message: "Data mahasiswa",
      data: {
        id_mahasiswa: mahasiswa.id,
        email_mahasiswa: mahasiswa.email,
        nama_mahasiswa: mahasiswa.nama,
      },
    },
    { status: 200 },
  );
}

export const GET = withAuth(handler);

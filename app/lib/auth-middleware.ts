import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "secret-key",
    );
    return decoded;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { message: "Token tidak ditemukan" },
          { status: 401 },
        );
      }

      const token = authHeader.slice(7);

      const decoded = verifyJWT(token);

      if (!decoded) {
        return NextResponse.json(
          { message: "Token tidak valid atau sudah expired" },
          { status: 401 },
        );
      }

      (request as any).mahasiswa = decoded;

      return handler(request);
    } catch (error: any) {
      return NextResponse.json(
        { message: "Terjadi kesalahan autentikasi", ok: false },
        { status: 500 },
      );
    }
  };
}

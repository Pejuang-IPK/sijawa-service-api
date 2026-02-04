import { JenisTransaksi } from "@/app/generated/prisma";
import { withAuth } from "@/app/lib/auth-middleware";
import { prisma } from "@/app/lib/prisma";
import { get } from "http";
import { NextRequest, NextResponse } from "next/server";

async function getKeuangan(request: NextRequest, context: any) {
  try {
    const mahasiswa = (request as any).mahasiswa;
    const { searchParams } = new URL(request.url);

    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");
    const jenis = searchParams.get("jenis");

    let whereClause: any = {
      id_mahasiswa: parseInt(mahasiswa.id_mahasiswa),
    };

    // Filter Tanggal
    if (bulan && tahun) {
      const startDate = new Date(`${tahun}-${bulan}-01`);
      const endDate = new Date(parseInt(tahun), parseInt(bulan), 0);
      whereClause.tanggalKeuangan = { gte: startDate, lte: endDate };
    }

    // Filter Jenis
    if (jenis) {
      if (Object.values(JenisTransaksi).includes(jenis as any)) {
        whereClause.jenisTransaksi = jenis as JenisTransaksi;
      }
    }

    const dataKeuangan = await prisma.keuangan.findMany({
      where: whereClause,
      orderBy: { tanggalKeuangan: "desc" },
    });

    return NextResponse.json({
      message: "Berhasil memuat data keuangan",
      data: dataKeuangan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 },
    );
  }
}

async function createKeuangan(request: NextRequest, context: any) {
  try {
    const mahasiswa = (request as any).mahasiswa;
    const body = await request.json();

    const { tanggal, saldo, transaksi, keterangan, jenis, kategori } = body;

    // Validasi Input
    if (!tanggal || !transaksi || !jenis) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    // validasi enum
    if (!Object.values(JenisTransaksi).includes(jenis)) {
      return NextResponse.json(
        {
          message:
            "Jenis transaksi salah. Gunakan: 'Pengeluaran' atau 'Pemasukan' (Perhatikan huruf besar)",
          ok: false,
        },
        { status: 400 },
      );
    }

    // cek kondisi saldo
    const nilaiTransaksi = parseInt(transaksi);

    const dataTerakhir = await prisma.keuangan.findFirst({
      where: { id_mahasiswa: mahasiswa.id_mahasiswa },
      orderBy: { id_keuangan: "desc" },
    });

    const saldoSekarang = dataTerakhir?.saldo || 0;

    if (jenis == "Pengeluaran" && saldoSekarang < nilaiTransaksi) {
      return NextResponse.json(
        {
          message: `Saldo tidak mencukupi! Saldo Anda: Rp ${saldoSekarang}, Transaksi: Rp ${nilaiTransaksi}`,

          current_saldo: saldoSekarang,
        },
        { status: 400 },
      );
    }

    // hitung saldo
    let saldoBaru = 0;

    if (jenis === "Pemasukan") {
      saldoBaru = saldoSekarang + nilaiTransaksi;
    } else {
      saldoBaru = saldoSekarang - nilaiTransaksi;
    }

    // Convert Tanggal
    const dateObj = new Date(tanggal);

    const newKeuangan = await prisma.keuangan.create({
      data: {
        id_mahasiswa: parseInt(mahasiswa.id_mahasiswa),
        tanggalKeuangan: dateObj,
        saldo: saldoBaru,
        transaksi: nilaiTransaksi,
        keteranganTransaksi: keterangan,

        jenisTransaksi: jenis as JenisTransaksi,

        kategoriTransaksi: kategori,
      },
    });

    return NextResponse.json(
      {
        message: "Transaksi berhasil disimpan",
        data: newKeuangan,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error Create Keuangan:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan transaksi", error: error.message },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getKeuangan);
export const POST = withAuth(createKeuangan);

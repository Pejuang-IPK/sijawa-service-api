import { JenisTransaksi } from "@/app/generated/prisma";
import { prisma } from "@/app/lib/prisma";
import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";

async function getRekapKeuangan(request: NextRequest, context: any) {
  try {
    const mahasiswa = (request as any).mahasiswa;
    const idMahasiswa = parseInt(mahasiswa.id_mahasiswa);

    const { searchParams } = new URL(request.url);
    const now = new Date();

    const paramBulan = searchParams.get("bulan");
    const paramTahun = searchParams.get("tahun");

    // date now
    const targetMonth = paramBulan ? parseInt(paramBulan) - 1 : now.getMonth();
    const targetYear = paramTahun ? parseInt(paramTahun) : now.getFullYear();

    // Set Tanggal Awal & Akhir Bulan
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const whereClause = {
      id_mahasiswa: idMahasiswa,
      tanggalKeuangan: {
        gte: startDate,
        lte: endDate,
      },
    };

    // total
    const totalGrouped = await prisma.keuangan.groupBy({
      by: ["jenisTransaksi"],
      _sum: { transaksi: true },
      where: whereClause,
    });

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    totalGrouped.forEach((item) => {
      if (item.jenisTransaksi === "Pemasukan") {
        totalPemasukan = item._sum.transaksi || 0;
      } else if (item.jenisTransaksi === "Pengeluaran") {
        totalPengeluaran = item._sum.transaksi || 0;
      }
    });

    // saldo & persentase
    const saldoBulanIni = totalPemasukan - totalPengeluaran;

    let persentasePengeluaran = 0;
    let persentaseSisa = 0;

    // rumus
    if (totalPemasukan > 0) {
      persentasePengeluaran = (totalPengeluaran / totalPemasukan) * 100;

      persentaseSisa = (saldoBulanIni / totalPemasukan) * 100;
    } else {
      if (totalPengeluaran > 0) {
        persentaseSisa = -100;
        persentasePengeluaran = 100;
      }
    }

    // kategori
    const kategoriGrouped = await prisma.keuangan.groupBy({
      by: ["jenisTransaksi", "kategoriTransaksi"],
      _sum: { transaksi: true },
      where: whereClause,
      orderBy: {
        _sum: { transaksi: "desc" },
      },
    });

    const listKategoriPemasukan = kategoriGrouped
      .filter((item) => item.jenisTransaksi === "Pemasukan")
      .map((item) => ({
        kategori: item.kategoriTransaksi,
        total: item._sum.transaksi || 0,
      }));

    const listKategoriPengeluaran = kategoriGrouped
      .filter((item) => item.jenisTransaksi === "Pengeluaran")
      .map((item) => ({
        kategori: item.kategoriTransaksi,
        total: item._sum.transaksi || 0,
      }));

    const namaBulan = startDate.toLocaleString("id-ID", { month: "long" });

    return NextResponse.json({
      message: `Rekap keuangan bulan ${namaBulan} ${targetYear}`,
      periode: {
        bulan: targetMonth + 1,
        tahun: targetYear,
      },
      summary: {
        total_pemasukan: totalPemasukan,
        total_pengeluaran: totalPengeluaran,

        saldo_bulan_ini: saldoBulanIni,
        persentase_pengeluaran: parseFloat(persentasePengeluaran.toFixed(1)),
        persentase_sisa: parseFloat(persentaseSisa.toFixed(1)),
      },
      detail_kategori: {
        pemasukan: listKategoriPemasukan,
        pengeluaran: listKategoriPengeluaran,
      },
    });
  } catch (error: any) {
    console.error("Rekap Error:", error);
    return NextResponse.json(
      { message: "Gagal memuat rekap", error: error.message },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getRekapKeuangan);

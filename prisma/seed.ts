import { PrismaClient, StatusLabel } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai Seeding...");

  const statusData = [
    { id: 1, label: StatusLabel.Masih_Bisa_Ditunda },
    { id: 2, label: StatusLabel.Tolong_Dikerjakan },
    { id: 3, label: StatusLabel.Harus_Dikerjakan },
    { id: 4, label: StatusLabel.Terlewat },
  ];

  for (const item of statusData) {
    const status = await prisma.statusTugas.upsert({
      where: { id_status: item.id },
      update: {},
      create: {
        id_status: item.id,
        status: item.label,
      },
    });
    console.log(`✅ Created status: ${item.label}`);
  }

  console.log("🏁 Seeding Selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

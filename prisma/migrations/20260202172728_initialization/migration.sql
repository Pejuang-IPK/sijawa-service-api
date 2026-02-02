-- CreateTable
CREATE TABLE `Mahasiswa` (
    `id_mahasiswa` INTEGER NOT NULL,
    `nama` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `foto` VARCHAR(255) NULL,

    PRIMARY KEY (`id_mahasiswa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jadwal` (
    `id_jadwal` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mahasiswa` INTEGER NULL,
    `hari` VARCHAR(20) NULL,
    `namaMatkul` VARCHAR(255) NULL,
    `jam_mulai` TIME(0) NULL,
    `jam_selesai` TIME(0) NULL,
    `kelasMatkul` VARCHAR(255) NULL,
    `sks` INTEGER NULL,
    `dosenMatkul` VARCHAR(255) NULL,

    INDEX `id_mahasiswa`(`id_mahasiswa`),
    PRIMARY KEY (`id_jadwal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Keuangan` (
    `id_keuangan` INTEGER NOT NULL,
    `id_mahasiswa` INTEGER NULL,
    `tanggalKeuangan` DATETIME(0) NULL,
    `saldo` INTEGER NULL,
    `transaksi` INTEGER NULL,
    `keteranganTransaksi` VARCHAR(255) NULL,
    `jenisTransaksi` ENUM('Pengeluaran', 'Pemasukan') NULL,
    `kategoriTransaksi` VARCHAR(255) NULL,

    INDEX `id_mahasiswa`(`id_mahasiswa`),
    PRIMARY KEY (`id_keuangan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Langganan` (
    `id_langganan` INTEGER NOT NULL,
    `id_mahasiswa` INTEGER NOT NULL,
    `nama_langganan` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(50) NULL DEFAULT 'fa-circle',
    `harga_bulanan` INTEGER NOT NULL,

    PRIMARY KEY (`id_langganan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mood` (
    `id_mood` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mahasiswa` INTEGER NULL,
    `tanggalLogMood` DATETIME(0) NULL,
    `waktuMeTime` TIME(0) NULL,
    `levelStress` INTEGER NULL,
    `namaKegiatan` VARCHAR(255) NULL,

    INDEX `id_mahasiswa`(`id_mahasiswa`),
    PRIMARY KEY (`id_mood`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatusTugas` (
    `id_status` INTEGER NOT NULL,
    `status` ENUM('Masih Bisa Ditunda', 'Tolong Dikerjakan', 'Harus Dikerjakan', 'Terlewat') NULL,

    PRIMARY KEY (`id_status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tugas` (
    `id_tugas` INTEGER NOT NULL,
    `id_mahasiswa` INTEGER NULL,
    `id_status` INTEGER NULL,
    `namaTugas` VARCHAR(255) NULL,
    `matkulTugas` VARCHAR(255) NULL,
    `tenggatTugas` DATETIME(0) NULL,

    INDEX `id_mahasiswa`(`id_mahasiswa`),
    INDEX `id_status`(`id_status`),
    PRIMARY KEY (`id_tugas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `Mahasiswa`(`id_mahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `Mahasiswa`(`id_mahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Langganan` ADD CONSTRAINT `Langganan_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `Mahasiswa`(`id_mahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Mood` ADD CONSTRAINT `Mood_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `Mahasiswa`(`id_mahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `Mahasiswa`(`id_mahasiswa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `StatusTugas`(`id_status`) ON DELETE NO ACTION ON UPDATE NO ACTION;

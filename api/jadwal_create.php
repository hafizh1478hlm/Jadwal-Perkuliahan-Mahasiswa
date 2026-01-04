<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php'; // Pastikan pakai $pdo

$input = json_decode(file_get_contents("php://input"), true);

$tanggal     = $input["tanggal"] ?? null;
$matkul      = $input["matkul"] ?? null;
$dosen       = !empty($input["dosen"]) ? $input["dosen"] : '-';
$ruangan     = !empty($input["ruangan"]) ? $input["ruangan"] : '-';
$jam_mulai   = $input["jam_mulai"] ?? null;
$jam_selesai = !empty($input["jam_selesai"]) ? $input["jam_selesai"] : '-';
$catatan     = !empty($input["catatan"]) ? $input["catatan"] : '-';

// Validasi minimal
if (!$tanggal || !$matkul || !$jam_mulai) {
    echo json_encode(["status" => "error", "message" => "Mohon isi Mata Kuliah dan Jam Mulai!"]);
    exit;
}

try {
    // Query langsung ke kolom VARCHAR yang baru kamu buat
    $stmt = $pdo->prepare("
        INSERT INTO jadwal_kuliah (tanggal, matkul, dosen, ruangan, jam_mulai, jam_selesai, catatan)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $tanggal, 
        $matkul, 
        $dosen, 
        $ruangan, 
        $jam_mulai, 
        $jam_selesai, 
        $catatan
    ]);

    echo json_encode(["status" => "success", "message" => "Data berhasil disimpan!"]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Gagal simpan ke database: " . $e->getMessage()
    ]);
}
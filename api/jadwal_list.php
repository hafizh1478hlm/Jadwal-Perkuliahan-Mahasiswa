<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

try {
    // Kita ambil data sesuai kolom yang ada di tabel jadwal_kuliah kamu
    $stmt = $pdo->query("SELECT id, tanggal, matkul, dosen, ruangan, jam_mulai, jam_selesai, catatan FROM jadwal_kuliah ORDER BY tanggal DESC, jam_mulai ASC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);
} catch (PDOException $e) {
    echo json_encode([]);
}
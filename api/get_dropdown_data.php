<?php
header("Content-Type: application/json");
require_once __DIR__ . '/db.php'; // Pakai $pdo

$type = $_GET['type'] ?? '';
// Map tipe ke kolom di tabel jd_utama
$columns = [
    'matkul' => 'matkul',
    'dosen' => 'dosen',
    'ruangan' => 'ruangan'
];

$column = $columns[$type] ?? null;

if (!$column) {
    echo json_encode([]);
    exit;
}

try {
    // Ambil data unik dari jd_utama yang isinya bukan strip atau kosong
    $stmt = $pdo->prepare("SELECT DISTINCT $column FROM jd_utama WHERE $column != '-' AND $column != '' ORDER BY $column ASC");
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode([]);
}
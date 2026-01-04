<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../koneksi.php';

if (!isset($koneksi) && isset($conn)) $koneksi = $conn;

if (!isset($koneksi)) {
    echo json_encode([]);
    exit;
}

$kolom = "mata_kuliah";

$sql = "SELECT `$kolom` AS matkul FROM mata_kuliah ORDER BY `$kolom` ASC";
$q = mysqli_query($koneksi, $sql);

$data = [];

if ($q) {
    while ($r = mysqli_fetch_assoc($q)) {
        $data[] = $r; // hasilnya: [{"matkul":"..."}, ...]
    }
}

echo json_encode($data);

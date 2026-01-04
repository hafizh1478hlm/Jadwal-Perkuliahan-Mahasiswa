<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../koneksi.php';

if (!isset($koneksi) && isset($conn)) {
    $koneksi = $conn;
}

if (!isset($koneksi)) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT matkul FROM mata_kuliah ORDER BY matkul ASC";
$query = mysqli_query($koneksi, $sql);

$data = [];
if ($query) {
    while ($row = mysqli_fetch_assoc($query)) {
        $data[] = $row;
    }
}

echo json_encode($data);

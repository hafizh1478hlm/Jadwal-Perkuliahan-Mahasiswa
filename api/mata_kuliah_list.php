<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../koneksi.php'; // pastikan path bener

if (!isset($koneksi)) {
  echo json_encode(["error" => "Koneksi DB tidak ditemukan. Pastikan variabel di koneksi.php adalah \$koneksi"]);
  exit;
}

$q = mysqli_query($koneksi, "SELECT matkul FROM mata_kuliah ORDER BY matkul ASC"); 

$data = [];
while ($r = mysqli_fetch_assoc($q)) {
  $data[] = $r;
}

echo json_encode($data);

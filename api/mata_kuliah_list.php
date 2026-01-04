<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../koneksi.php';

$result = mysqli_query($koneksi, "SELECT matkul FROM mata_kuliah ORDER BY matkul ASC");

$data = [];
if ($result) {
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row; // <- INI bikin array
  }
}

echo json_encode($data);

<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../koneksi.php';
if (!isset($koneksi) && isset($conn)) $koneksi = $conn;
if (!isset($koneksi)) { echo json_encode([]); exit; }

$kolom = "dosen";
$q = mysqli_query($koneksi, "SELECT `$kolom` AS dosen FROM dosen ORDER BY `$kolom` ASC");

$data = [];
if ($q) while ($r = mysqli_fetch_assoc($q)) $data[] = $r;
echo json_encode($data);

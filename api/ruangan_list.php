<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../koneksi.php';

$q = mysqli_query($koneksi, "SELECT ruangan FROM ruangan ORDER BY ruangan ASC");
$data = [];
while ($r = mysqli_fetch_assoc($q)) $data[] = $r;

echo json_encode($data);

<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../koneksi.php';

$sql = "SELECT id, nama FROM dosen ORDER BY nama ASC";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row; // {id, nama}
}

echo json_encode($data);

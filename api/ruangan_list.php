<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/koneksi.php';

if (!isset($conn)) {
    http_response_code(500);
    echo json_encode(["error" => "Variabel \$conn tidak ditemukan"]);
    exit;
}

$query = "SELECT id_ruangan, nama_ruangan FROM ruangan ORDER BY nama_ruangan ASC";
$result = $conn->query($query);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "id"   => $row["id_ruangan"],
            "nama" => $row["nama_ruangan"]
        ];
    }
}

echo json_encode($data);

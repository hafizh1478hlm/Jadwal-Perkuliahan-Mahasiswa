<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/koneksi.php';

if (!isset($conn)) {
    http_response_code(500);
    echo json_encode(["error" => "Variabel \$conn tidak ditemukan. Koneksi DB belum ter-load."]);
    exit;
}

$query = "SELECT id_mk, nama_mk FROM mata_kuliah ORDER BY nama_mk ASC";
$result = $conn->query($query);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "id"   => $row["id_mk"],
            "nama" => $row["nama_mk"]
        ];
    }
}

echo json_encode($data);

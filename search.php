<?php
header('Content-Type: application/json; charset=utf-8');
include 'koneksi.php';

$keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';

if ($keyword === '') {
    echo json_encode([]);
    exit;
}

// prepared statement untuk mencegah SQL injection
$sql = "SELECT id, nama_matkul, nama_dosen, hari, jam_mulai, jam_selesai, ruangan
        FROM jadwal
        WHERE nama_matkul LIKE ? OR nama_dosen LIKE ?
        LIMIT 50";

$stmt = mysqli_prepare($conn, $sql);
$like = "%{$keyword}%";
mysqli_stmt_bind_param($stmt, "ss", $like, $like);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);

$rows = [];
while ($row = mysqli_fetch_assoc($res)) {
    $rows[] = $row;
}

echo json_encode($rows);
?>

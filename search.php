<?php
header('Content-Type: application/json; charset=utf-8');
include 'koneksi.php';

$keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';

if ($keyword === '') {
    echo json_encode([]);
    exit;
}

// prepared statement untuk mencegah SQL injection
// Tambahkan pencarian ke kolom hari atau ruangan jika perlu
$sql = "SELECT matkul, dosen, hari 
        FROM jd_utama 
        WHERE matkul LIKE ? OR dosen LIKE ? OR hari LIKE ?
        LIMIT 10"; // Limit 10 saja supaya dropdown tidak kepanjangan

$stmt = mysqli_prepare($conn, $sql);
$like = "%{$keyword}%";
// Tambahkan satu "s" lagi untuk bind_param hari
mysqli_stmt_bind_param($stmt, "sss", $like, $like, $like);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);

$rows = [];
while ($row = mysqli_fetch_assoc($res)) {
    $rows[] = $row;
}

echo json_encode($rows);
?>

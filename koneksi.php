<?php
// koneksi.php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "db_jadwal"; // nama database

$conn = new mysqli("localhost", "root", "", "db_jadwal");

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi DB gagal: " . mysqli_connect_error()]);
    exit;
}
?>

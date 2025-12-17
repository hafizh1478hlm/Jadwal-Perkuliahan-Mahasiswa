<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "db_jadwal";

$conn = new mysqli($host, $user, $password, $dbname);

// cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>

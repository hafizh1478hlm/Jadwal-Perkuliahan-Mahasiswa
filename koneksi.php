<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "db_jadwal";

$conn = new mysqli($host, $user, $pass, $dbname);

// cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>

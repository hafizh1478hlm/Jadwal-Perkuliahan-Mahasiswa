<?php

$host = "localhost";
$user = "root";
<<<<<<< HEAD
$password = "";
$dbname = "db_jadwal";
=======
$pass = "";
$dbname = "db_jadwal"; 
>>>>>>> 131aa45b715000a2d931fa8eb578941070468e4c

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Koneksi database gagal: " . $conn->connect_error);
}
?>

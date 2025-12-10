<?php
<<<<<<< HEAD

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "db_jadwal"; 

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Koneksi database gagal: " . $conn->connect_error);
}
?>
=======
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
>>>>>>> 15b0b6aeabbd3816193cb409d863308502c9b8f7

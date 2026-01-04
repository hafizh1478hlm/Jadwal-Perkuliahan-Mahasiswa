<?php
session_start();
include "koneksi.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit;
}

$id = $_SESSION['id_user'];

$password_lama = $_POST['password_lama'] ?? '';
$password_baru = $_POST['password_baru'] ?? '';
$konfirmasi    = $_POST['konfirmasi_password'] ?? '';

if ($password_baru !== $konfirmasi) {
    die("Konfirmasi sandi tidak cocok");
}

$q = mysqli_query($conn, "SELECT password FROM users WHERE id_user='$id'");
$data = mysqli_fetch_assoc($q);

if (!password_verify($password_lama, $data['password'])) {
    die("Sandi lama salah");
}

$hash = password_hash($password_baru, PASSWORD_DEFAULT);
mysqli_query($conn, "UPDATE users SET password='$hash' WHERE id_user='$id'");

// Mengarahkan user kembali ke halaman tempat dia mengirim form
header("Location: " . $_SERVER['HTTP_REFERER']);
exit;
?>

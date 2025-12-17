<?php
session_start();
include "koneksi.php";

$id = $_SESSION['id_user'];

$password_lama = $_POST['password_lama'];
$password_baru = $_POST['password_baru'];

// ambil password lama dari DB
$query = mysqli_query($conn, "SELECT password FROM users WHERE id_user='$id'");
$data = mysqli_fetch_assoc($query);

// cek password lama
if (!password_verify($password_lama, $data['password'])) {
    echo "Password lama salah";
    exit;
}

// hash password baru
$hash_baru = password_hash($password_baru, PASSWORD_DEFAULT);

// update ke DB
mysqli_query($conn, "UPDATE users SET password='$hash_baru' WHERE id_user='$id'");

echo "Password berhasil diubah";

?>
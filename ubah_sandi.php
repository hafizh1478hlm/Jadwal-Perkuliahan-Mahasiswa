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

header("Location: dashboard.php?password=success");
exit;
?>



<!DOCTYPE html>
<html>
<head>
  <title>Change Password</title>

  <style>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6); /* gelap */
  backdrop-filter: blur(3px);     /* blur halamannya */
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 24px;
  width: 360px;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0,0,0,.3);
  animation: scaleIn .2s ease;
}

@keyframes scaleIn {
  from { transform: scale(.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.close {
  float: right;
  font-size: 20px;
  cursor: pointer;
}

  </style>
</head>
<body>



<!-- Modal Overlay -->
<div class="modal" id="changePasswordModal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>Change Password</h2>

    <form method="POST" action="ubah_sandi.php">
      <input type="password" name="password_lama" placeholder="Current password" required>
      <input type="password" name="password_baru" placeholder="New password" required>
      <input type="password" name="konfirmasi_password" placeholder="Confirm new password" required>
      <button type="submit">Update</button>
    </form>
  </div>
</div>




<script>
const modal = document.getElementById("changePasswordModal");
const openBtn = document.getElementById("openChangePassword");
const closeBtn = modal.querySelector(".close");

openBtn.addEventListener("click", (e) => {
  e.preventDefault(); // penting
  modal.style.display = "flex";
  userPopup.style.display = "none";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});



</script>

</body>
</html>

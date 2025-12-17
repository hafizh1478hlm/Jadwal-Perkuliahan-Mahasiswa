<?php
session_start();
include "koneksi.php";

$error = "";

if (isset($_POST['login'])) {

    $nim = mysqli_real_escape_string($conn, $_POST['nim']);
    $password = $_POST['password'];

   //cek user di database
    $query = mysqli_query($conn, "SELECT * FROM users WHERE nim='$nim'");


    if (!$query) {
        die("Query Error: " . mysqli_error($conn));
    }

    if (mysqli_num_rows($query) === 1) {
        $data = mysqli_fetch_assoc($query);

        if (password_verify($password, $data['password'])) {

            $_SESSION['id_user'] = $data['id_user'];
            $_SESSION['nim']     = $data['nim'];
            $_SESSION['nama']    = $data['nama'];

            header("Location: dashboard.php");
            exit;
        } else {
            $error = "NIM atau password salah!";
        }

    } else {
        $error = "NIM atau password salah!";
    }
}
?>


<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masuk</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* (SEMUA CSS ANDA TETAP, TANPA DIUBAH) */
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background-image: url('tecno.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(21, 38, 68, 0.259);
        }

        .logo-top-left {
            position: absolute;
            top: 30px;
            left: 30px;
            z-index: 10;
        }

        .logo-top-left img { width: 81px; }

        .login-container {
            position: relative;
            z-index: 5;
            width: 100%;
            max-width: 480px;
            padding: 20px;
        }

        .login-card {
            background: rgba(255, 255, 255, 0.944);
            font-family: 'Times New Roman', Times, serif;
            border-radius: 25px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.353);
            padding: 30px 40px 45px 40px;
            border: none;
        }

        .logo-section { text-align: center; margin-bottom: 35px; }

        .logo-if { width: 317px; }

        .login-title {
            text-align: center;
            font-size: 36px;
            font-weight: 700;
            color: #1e3a5f;
            margin-bottom: 40px;
            letter-spacing: 3px;
        }

        .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 2px;
            font-size: 14px;
        }

        .form-control {
            border: none;
            border-radius: 8px;
            padding: 14px 18px;
            font-size: 14px;
            transition: 0.3s;
            background: #c1e0ff;
        }

        .form-control:focus {
            background: #98ccff;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
            outline: none;
        }

        .form-control::placeholder { color: rgba(46, 62, 80, 0.5); }

        .password-toggle {
            position: absolute;
            right: 15px;
            top: 42px;
            cursor: pointer;
            color: rgba(46, 62, 80, 0.5);
            transition: color 0.3s;
            font-size: 15px;
        }

        .password-toggle:hover { color: #ff9131; }

        .btn-login {
            background: #1e3a5f;
            color: #f6f6f6;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            width: 100%;
            margin-top: 25px;
        }

        .btn-login:hover {
            background: #ff9131;
            color: #f6f6f6;
        }

        .divider {
            height: 2px;
            background: linear-gradient(to right, transparent, #1e3a5f, transparent);
            margin: 25px 0;
        }

        .btn-register {
            background: #1e3a5f;
            color: white;
            border-radius: 8px;
            font-size: 15px;
            width: 100%;
            font-weight: 600;
        }

        .btn-register:hover {
            background: #ff9131;
            color: #f6f6f6;
        }
    </style>
</head>

<body>

    <!-- LOGO POLTEK -->
    <div class="logo-top-left">
        <img src="logopeltek.png" alt="Logo Polibatam">
    </div>

    <div class="login-container">
        <div class="login-card">

            <div class="logo-section">
                <img src="logo_if.png" class="logo-if">
            </div>

            <h2 class="login-title">MASUK</h2>

            <!-- ERROR MESSAGE -->
            <?php if ($error != ""): ?>
                <div class="alert alert-danger text-center py-2">
                    <?= $error ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="">

                <div class="mb-3">
                    <label class="form-label">Nomor Induk Mahasiswa</label>
                    <input type="text" class="form-control" name="nim" required placeholder="Masukkan Nomor Induk Mahasiswa">
                </div>

                <div class="mb-3 position-relative">
                    <label class="form-label">Kata Sandi</label>
                    <input type="password" class="form-control" id="kataSandi" name="password" required placeholder="Masukkan Kata Sandi">
                    <i class="fas fa-eye-slash password-toggle" id="togglePassword"></i>
                </div>

                <!-- BUTTON LOGIN -->
                <button type="submit" name="login" class="btn btn-login">Masuk</button>

            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('kataSandi');

        togglePassword.addEventListener('click', function () {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });

        window.onload = () => {
            document.querySelector('input[name="nim"]').focus();
        };
    </script>
    <script>
    // Menghilangkan pesan error setelah 3 detik
    const alertBox = document.querySelector('.alert');
    if (alertBox) {
        setTimeout(() => {
            alertBox.style.transition = "opacity 0.5s";
            alertBox.style.opacity = "0";
            setTimeout(() => alertBox.remove(), 500);
        }, 3000); 
    }
    </script>

</body>
</html>

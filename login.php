<?php
session_start();
include "koneksi.php";

$error = "";

if (isset($_POST['login'])) {
    $nim = mysqli_real_escape_string($conn, $_POST['nim']);
    $password = $_POST['password'];

    $query = mysqli_query($conn, "SELECT * FROM users WHERE nim='$nim'");

    if (mysqli_num_rows($query) === 1) {
        $data = mysqli_fetch_assoc($query);
        if (password_verify($password, $data['password'])) {
            $_SESSION['id_user'] = $data['id_user'];
            $_SESSION['nim']     = $data['nim'];
            $_SESSION['nama']    = $data['nama'];
            header("Location: kelolajadwal.php");
            exit;
        } else { $error = "NIM atau password salah!"; }
    } else { $error = "NIM atau password salah!"; }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Portal Jadwal IF</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        body {
            margin: 0;
            min-height: 100vh;
            background: url('tecno.png') center/cover no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.75);
            z-index: 1;
        }

        .login-card {
            position: relative;
            z-index: 10;
            background: #ffffff;
            width: 100%;
            max-width: 400px;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .logo-top {
            display: block;
            margin: 0 auto 20px;
            width: 180px;
        }

        .login-header h2 {
            color: #0f172a;
            font-weight: 700;
            font-size: 24px;
            text-align: center;
            margin-bottom: 8px;
        }

        .login-header p {
            color: #64748b;
            font-size: 14px;
            text-align: center;
            margin-bottom: 30px;
        }

        .form-label {
            font-size: 13px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
        }

        .input-group-custom {
            position: relative;
            margin-bottom: 20px;
        }

        .form-control {
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 14px;
            transition: 0.3s;
            background: #f8fafc;
        }

        .form-control:focus {
            background: #fff;
            border-color: #FF762F;
            box-shadow: 0 0 0 4px rgba(255, 118, 47, 0.1);
            outline: none;
        }

        /* FIX MATA DOUBLE & POSISI */
        .password-toggle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #94a3b8;
            z-index: 10;
            background: #f8fafc; /* Menutup ikon bawaan browser dibelakangnya */
            padding-left: 5px;
        }

        input::-ms-reveal,
        input::-ms-clear {
            display: none;
        }

        input::-webkit-credentials-auto-fill-button {
            visibility: hidden;
            display: none !important;
            pointer-events: none;
        }

        .btn-login {
            background: #03254C;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 14px;
            width: 100%;
            font-weight: 700;
            margin-top: 10px;
            transition: 0.3s;
        }

        .btn-login:hover {
            background: #FF762F;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(255, 118, 47, 0.3);
        }

        .alert-error {
            background: #fff1f2;
            color: #be123c;
            padding: 12px;
            border-radius: 10px;
            font-size: 13px;
            margin-bottom: 20px;
            border: 1px solid #ffe4e6;
            text-align: center;
        }

        .poltek-logo-fixed {
            position: absolute;
            top: 25px;
            left: 25px;
            width: 65px;
            z-index: 10;
        }
    </style>
</head>
<body>

    <img src="logopeltek.png" class="poltek-logo-fixed" alt="Logo Poltek">

    <div class="login-card">
        <img src="logo_if.png" class="logo-top" alt="Logo IF">
        
        <div class="login-header">
            <h2>Selamat Datang</h2>
            <p>Masukkan akun untuk melihat jadwal kamu.</p>
        </div>

        <?php if (isset($_GET['pesan']) && $_GET['pesan'] == "wajib_login"): ?>
        <div class="alert-error" style="background: #fffbeb; color: #92400e; border: 1px solid #fef3c7;">
            <i class="fas fa-lock me-2"></i> Akses ditolak. Silahkan login.
        </div>
    <?php endif; ?>

    <?php if ($error != ""): ?>
        <div class="alert-error">
            <i class="fas fa-circle-exclamation me-2"></i> <?= $error ?>
        </div>
    <?php endif; ?>

        <form method="POST" action="">
            <div class="mb-3">
                <label class="form-label">Nomor Induk Mahasiswa</label>
                <input type="text" class="form-control" name="nim" required placeholder="Contoh: 3312xxx" autocomplete="off">
            </div>

            <div class="mb-4">
                <label class="form-label">Kata Sandi</label>
                <div class="input-group-custom">
                    <input type="password" class="form-control" id="pw" name="password" required placeholder="••••••••">
                    <i class="fas fa-eye-slash password-toggle" id="togglePw"></i>
                </div>
            </div>

            <button type="submit" name="login" class="btn-login">Masuk ke Portal</button>
        </form>
    </div>

    <script>
        const toggle = document.getElementById('togglePw');
        const input = document.getElementById('pw');

        toggle.addEventListener('click', () => {
            const isPw = input.type === 'password';
            input.type = isPw ? 'text' : 'password';
            toggle.classList.toggle('fa-eye');
            toggle.classList.toggle('fa-eye-slash');
        });

        // Hilangkan alert otomatis setelah 3 detik
        const alert = document.querySelector('.alert-error');
        if(alert) {
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 500);
            }, 3000);
        }

        const wajibLoginAlert = document.querySelector('.alert-error');
if (wajibLoginAlert) {
    setTimeout(() => {
        wajibLoginAlert.style.transition = "0.5s";
        wajibLoginAlert.style.opacity = "0";
        setTimeout(() => wajibLoginAlert.remove(), 500);
    }, 3000); // Hilang setelah 4 detik
}
    </script>
</body>
</html>
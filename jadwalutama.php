<?php
ob_start(); 
session_start();
include 'koneksi.php'; // Pastikan koneksi aman

if (!isset($_SESSION['nama'])) {
    header("Location: login.php?pesan=wajib_login");
    exit();
}

// INI KUNCINYA: Menangkap kata dari search bar
$keyword = isset($_GET['search']) ? $_GET['search'] : ''; 
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadwal Utama Mata Kuliah</title>
    <link rel="stylesheet" href="styleju.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <style>
        /* CSS Tambahan untuk Highlight */
        .highlight-yellow {
            background-color: #fff3cd !important;
            /* Warna kuning soft */
            border: 2px solid #ffd65cff !important;
        }

        .highlight-yellow td {
            font-weight: 500;
        }
    </style>
</head>

<body>
    <header class="navbar">
        <div class="nav-left">
            <img src="logo_if.png" alt="Logo" class="logo" />
            <div class="nav-text">
                <h1>JADWAL PERKULIAHAN</h1>
                <p>MAHASISWA POLITEKNIK NEGERI BATAM</p>
            </div>
        </div>

        <div class="nav-right">
            <div class="search-container me-3 position-relative">
                <input type="text" id="searchInput" placeholder="Search..." class="form-control form-control-sm"
                    style="width: 180px; border-radius: 20px; padding-left: 12px;" autocomplete="off" />

                <ul id="suggestions" class="list-group position-absolute w-100"
                    style="top: 35px; display:none; z-index:1000;">
                </ul>
            </div>

            <i class="fa-solid fa-bars menu-icon ms-2"></i>
            <i class="fa-regular fa-circle-user user-icon ms-3"></i>
        </div>
    </header>

    <div class="popup-menu" id="menuPopup">
        <ul>
            <li><a href="kelolajadwal.php">Kelola Jadwal</a></li>
            <li><a href="jadwalutama.php">Jadwal Utama</a></li>
        </ul>
    </div>
    <div class="popup-user" id="userPopup">
        <ul>
            <li><a href="logout.php">Keluar</a></li>
            <li><a href="#" id="btnUbahSandi">Ubah Sandi</a></li>
        </ul>
    </div>

    <!-- POPUP UBAH SANDI -->
    <div class="modal-password" id="changePasswordModal">
        <div class="modal-password-content">
            <span class="close">&times;</span>
            <div class="change-header">
                <div class="icon-lock">
                    🔒
                </div>
                <h3>Ubah Sandi</h3>
                <p>Masukkan sandi baru Anda</p>
            </div>

            <form method="POST" action="ubah_sandi.php">
                <input type="password" name="password_lama" placeholder="Sandi lama" required>
                <input type="password" name="password_baru" placeholder="Sandi baru" required>
                <input type="password" name="konfirmasi_password" placeholder="Konfirmasi sandi" required>
                <button type="submit">Simpan</button>
                <p id="pesanUbahSandi"></p>
            </form>
        </div>
    </div>

    <div class="container">
        <h1>Jadwal Utama</h1>
        <p>Halaman ini menampilkan pusat informasi jadwal perkuliahan mahasiswa secara sistematis.</p>

        <table class="jadwal-table">
            <thead>
                <tr style="background-color: #ffeb3b;">
                    <th style="color: black;">Hari</th>
                    <th style="color: black;">Jam Mulai</th>
                    <th style="color: black;">Jam Selesai</th>
                    <th style="color: black;">Mata Kuliah</th>
                    <th style="color: black;">Ruangan</th>
                    <th style="color: black;">Dosen</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // QUERY UTAMA: Tidak pakai WHERE agar tabel tampil SEMUA
                $query = "SELECT * FROM jd_utama 
                          ORDER BY FIELD(hari, 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'), jam_mulai";
                
                $result = $conn->query($query);
                $hari_sebelumnya = "";

                if ($result && $result->num_rows > 0) {
                    while ($data = $result->fetch_assoc()) {
                        
                        // LOGIKA PENGECEKAN HIGHLIGHT
                        $isMatch = false;
                        if (!empty($keyword)) {
                            // Jika matkul atau dosen mengandung kata yang dicari
                            if (stripos($data['matkul'], $keyword) !== false || stripos($data['dosen'], $keyword) !== false) {
                                $isMatch = true;
                            }
                        }

                        // Pasang atribut khusus jika baris ini "terpilih"
                        $rowId = $isMatch ? "id='targetHighlight'" : "";
                        $rowClass = $isMatch ? "class='highlight-yellow'" : "";

                        echo "<tr $rowId $rowClass>";

                        // LOGIKA ROWSPAN (Biar hari tidak dobel-dobel)
                        if ($data['hari'] != $hari_sebelumnya) {
                            $safe_hari = $conn->real_escape_string($data['hari']);
                            // Rowspan tetap dihitung dari total data per hari di database
                            $rowspan_q = "SELECT COUNT(*) AS total FROM jd_utama WHERE hari = '$safe_hari'";
                            $rowspan_res = $conn->query($rowspan_q);
                            $rowspan = $rowspan_res->fetch_assoc()['total'];
                            
                            echo "<td rowspan='{$rowspan}' style='vertical-align:middle; font-weight:bold;'>{$data['hari']}</td>";
                            $hari_sebelumnya = $data['hari'];
                        }

                        echo "<td>{$data['jam_mulai']}</td>";
                        echo "<td>{$data['jam_selesai']}</td>";
                        echo "<td>{$data['matkul']}</td>";
                        echo "<td>{$data['ruangan']}</td>";
                        echo "<td>{$data['dosen']}</td>";
                        echo "</tr>";
                    }
                } else {
                        echo "<tr><td colspan='6' class='text-center'>Belum ada jadwal yang tersedia.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-top text-white py-4">
            <div class="footer-container">
                <p>Jadwal perkuliahan jurusan Teknik Informatika semester 1 Politeknik Negeri Batam</p>
            </div>
        </div>
        <div class="footer-bottom text-center py-2">
            <p class="mb-0">&copy; 2025 Politeknik Negeri Batam</p>
        </div>
    </footer>

    <script src="scriptju.js"></script>
</body>

</html>
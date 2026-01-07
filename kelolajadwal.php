<?php
session_start();

/**
 * Keamanan: Cek apakah session 'nama' atau 'user_id' sudah ada.
 * Jika tidak ada, artinya user belum login, maka lempar balik ke login.php.
 */
if (!isset($_SESSION['nama'])) {
    header("Location: login.php?pesan=wajib_login");
    exit();
}
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kelola Jadwal Perkuliahan</title>
    <link rel="stylesheet" href="stylekj.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
</head>

<body>
    <!-- NAVBAR -->
    <header class="navbar">
        <div class="nav-left">
            <img src="logo_if.png" alt="Logo Teknik Informatika" class="logo" />
            <div class="nav-text">
                <h1>JADWAL PERKULIAHAN</h1>
                <p>MAHASISWA POLITEKNIK NEGERI BATAM</p>
            </div>
        </div>

        <!-- SEARCH BAR -->
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

    <!-- MENU POP-UP -->
    <div class="popup-menu" id="menuPopup">
        <ul>
            <li><a href="kelolajadwal.php">Kelola Jadwal</a></li>
            <li><a href="jadwalutama.php">Jadwal Utama</a></li>
        </ul>
    </div>

    <!-- USER POP-UP -->
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


    <!-- MAIN CONTENT -->
    <div class="container">
        <h1>Kelola Jadwal</h1>
        <p>
            Klik tanggal pada kalender untuk menambahkan, mengubah, atau menghapus jadwal dan catatan sesuai
            kebutuhanmu.
        </p>

        <!-- Kalender -->
        <div class="calendar">
            <div class="calendar-header">
                <button id="prevMonth">&lt;</button>
                <span id="currentMonthYear"></span>
                <button id="nextMonth">&gt;</button>
            </div>

            <div class="calendar-grid" id="calendarGrid"></div>

            <div class="calendar-time">
                <span id="timeLabel"></span>
            </div>
        </div>


        <!-- Histori Pengelolaan -->
        <div class="student-notes">
            <h4>HISTORI PENGELOLAAN</h4>
            <div class="notes-table" id="mainNotesTable">
                <div class="notes-row header-row">
                    <div class="notes-col">TANGGAL</div>
                    <div class="notes-col">JAM</div>
                    <div class="notes-col">RUANGAN</div>
                    <div class="notes-col">MATA KULIAH</div>
                    <div class="notes-col">DOSEN</div>
                    <div class="notes-col catatan-col">CATATAN</div>
                    <div class="notes-col">AKSI</div>
                </div>
            </div>
            <div class="main-save-action">
                <button id="saveMainNotes">SIMPAN CATATAN</button>
            </div>
        </div>
    </div>

    <!-- POPUP INPUT JADWAL -->
    <div id="jadwalInputPopup" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-body-split">

                <div class="side-left">
                    <div class="modal-header-simple">
                        <h3>Kelola Jadwal</h3>
                        <p class="subtitle">Input detail perkuliahanmu disini.</p>
                    </div>

                    <div class="input-group">
                        <label>Mata Kuliah</label>
                        <input type="text" id="matkulInput" list="matkulList" placeholder="Pilih Matkul">
                        <datalist id="matkulList"></datalist>
                    </div>

                    <div class="input-group">
                        <label>Dosen</label>
                        <input type="text" id="dosenInput" list="dosenList" placeholder="Nama Dosen">
                        <datalist id="dosenList"></datalist>
                    </div>

                    <div class="input-group">
                        <label>Ruangan</label>
                        <input type="text" id="ruanganInput" list="ruanganList" placeholder="Contoh: TA 10.4">
                        <datalist id="ruanganList"></datalist>
                    </div>
                </div>

                <div class="side-right">
                    <div class="input-group">
                        <label>Waktu Perkuliahan</label>
                        <div class="waktu-row">
                            <div class="waktu-box">
                                <small>MULAI</small>
                                <input type="time" id="jamMulaiInput">
                            </div>
                            <div class="waktu-box">
                                <small>SELESAI</small>
                                <input type="time" id="jamSelesaiInput">
                            </div>
                        </div>
                        <div class="divider-text">ATAU MANUAL</div>
                        <input type="text" id="manualTimeInput" placeholder="Contoh: 07:30 - 09:00">
                    </div>

                    <div class="input-group">
                        <label>Catatan Tambahan</label>
                        <input type="text" id="catatanInput" placeholder="Kuis, Tugas, dll...">
                    </div>

                    <div class="modal-footer">
                        <button id="batalJadwal" class="btn-secondary">BATAL</button>
                        <button id="kirimJadwal" class="btn-primary">KIRIM</button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-top text-white py-4">
            <div class="footer-container">
                <p>Data yang diinput akan muncul di tabel histori</p>
            </div>
        </div>
        <div class="footer-bottom text-center py-2">
            <p class="mb-0">&copy; 2025 Politeknik Negeri Batam</p>
        </div>
    </footer>

    <script src="scriptkj.js"></script>
</body>


</html>

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
                    style="width: 180px; border-radius: 20px; padding-left: 12px;" />
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
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="kelolajadwal.html">Kelola Jadwal</a></li>
            <li><a href="jadwalutama.html">Jadwal Utama</a></li>
        </ul>
    </div>

    <!-- USER POP-UP -->
    <div class="popup-user" id="userPopup">
        <ul>
            <li><a href="index.html">Logout</a></li>
        </ul>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container">
        <h1>Kelola Jadwal</h1>
        <p>
            Pilih tanggal pada kalender untuk menambahkan, mengubah, atau menghapus jadwal dan catatan sesuai kebutuhanmu.
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
    <div class="popup-overlay" id="jadwalInputPopup">
        <div class="popup-content">
            <h3>Masukkan Jadwal Kuliah</h3>
            <select id="mataKuliahSelect">
                <option value="" disabled selected>Pilih Mata Kuliah</option>
            </select>

            <select id="dosenSelect">
                <option value="" disabled selected>Pilih Dosen</option>
            </select>

            <select id="ruanganSelect">
                <option value="" disabled selected>Pilih Ruangan</option>
            </select>

            <select id="waktuSelect">
                <option value="" disabled selected>Pilih Waktu</option>
            </select>

            <input type="text" id="catatanInput" placeholder="Catatan tambahan..." />

            <div class="button-group">
                <button id="kirimJadwal">KIRIM</button>
                <button id="batalJadwal">BATAL</button>
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

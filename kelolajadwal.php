<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kelola Jadwal Perkuliahan</title>

  <!-- BOOTSTRAP HARUS DULU -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />

  <!-- CSS KAMU PALING TERAKHIR -->
  <link rel="stylesheet" href="stylekj.css?v=999" />

  <!-- FIX POPUP JADWAL (ANTI TABRAKAN BOOTSTRAP) -->
  <style>
    .jadwal-overlay{
      position: fixed !important;
      inset: 0 !important;
      display: none !important;
      justify-content: center !important;
      align-items: center !important;
      background: rgba(0,0,0,0.75) !important;
      backdrop-filter: blur(5px) !important;
      z-index: 999999 !important;
      padding: 20px !important;
    }
    .jadwal-overlay.show{
      display: flex !important;
    }
    .jadwal-content{
      width: 100% !important;
      max-width: 850px !important;
      background: #ffffff !important;
      border-radius: 10px !important;
      overflow: hidden !important;
    }
  </style>
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

  <div class="nav-right">
    <div class="search-container me-3 position-relative">
      <input
        type="text"
        id="searchInput"
        placeholder="Search..."
        class="form-control form-control-sm"
        style="width:180px;border-radius:20px;padding-left:12px;"
        autocomplete="off"
      />
      <ul
        id="suggestions"
        class="list-group position-absolute w-100"
        style="top:35px;display:none;z-index:1000;"
      ></ul>
    </div>

    <i class="fa-solid fa-bars menu-icon ms-2"></i>
    <i class="fa-regular fa-circle-user user-icon ms-3"></i>
  </div>
</header>

<!-- MENU POPUP -->
<div class="popup-menu" id="menuPopup">
  <ul>
    <li><a href="kelolajadwal.php">Kelola Jadwal</a></li>
    <li><a href="jadwalutama.php">Jadwal Utama</a></li>
  </ul>
</div>

<!-- USER POPUP -->
<div class="popup-user" id="userPopup">
  <ul>
    <li><a href="logout.php">Keluar</a></li>
    <li><a href="#" id="btnUbahSandi">Ubah Sandi</a></li>
  </ul>
</div>

<!-- POPUP UBAH SANDI -->
<div class="modal" id="changePasswordModal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="change-header">
      <div class="icon-lock">🔒</div>
      <h3>Ubah Sandi</h3>
      <p>Masukkan sandi baru Anda</p>
    </div>

    <form method="POST" action="ubah_sandi.php">
      <input type="password" name="password_lama" placeholder="Sandi lama" required />
      <input type="password" name="password_baru" placeholder="Sandi baru" required />
      <input type="password" name="konfirmasi_password" placeholder="Konfirmasi sandi" required />
      <button type="submit">Simpan</button>
      <p id="pesanUbahSandi"></p>
    </form>
  </div>
</div>

<!-- MAIN CONTENT -->
<div class="container">
  <h1>Kelola Jadwal</h1>
  <p>Klik tanggal pada kalender untuk menambahkan, mengubah, atau menghapus jadwal.</p>

  <div class="calendar">
    <div class="calendar-header">
      <button id="prevMonth">&lt;</button>
      <span id="currentMonthYear"></span>
      <button id="nextMonth">&gt;</button>
    </div>

    <div class="calendar-grid" id="calendarGrid"></div>
  </div>

  <div class="student-notes">
    <h4>HISTORI PENGELOLAAN</h4>
    <div class="notes-table" id="mainNotesTable">
      <div class="notes-row header-row">
        <div class="notes-col">TANGGAL</div>
        <div class="notes-col">JAM</div>
        <div class="notes-col">RUANGAN</div>
        <div class="notes-col">MATA KULIAH</div>
        <div class="notes-col">DOSEN</div>
        <div class="notes-col">CATATAN</div>
        <div class="notes-col">AKSI</div>
      </div>
    </div>
  </div>
</div>

<!-- POPUP INPUT JADWAL -->
<div id="jadwalInputPopup" class="jadwal-overlay">
  <div class="jadwal-content">
    <div class="modal-body-split">

      <div class="side-left">
        <div class="modal-header-simple">
          <h3>Kelola Jadwal</h3>
          <p class="subtitle">Input detail perkuliahanmu disini.</p>
        </div>

        <div class="input-group">
          <label>Mata Kuliah</label>
          <input type="text" id="matkulInput" list="matkulList" />
          <datalist id="matkulList"></datalist>
        </div>

        <div class="input-group">
          <label>Dosen</label>
          <input type="text" id="dosenInput" list="dosenList" />
          <datalist id="dosenList"></datalist>
        </div>

        <div class="input-group">
          <label>Ruangan</label>
          <input type="text" id="ruanganInput" list="ruanganList" />
          <datalist id="ruanganList"></datalist>
        </div>
      </div>

      <div class="side-right">
        <div class="input-group">
          <label>Waktu</label>
          <div class="waktu-row">
            <div class="waktu-box">
              <small>MULAI</small>
              <input type="time" id="jamMulaiInput" />
            </div>
            <div class="waktu-box">
              <small>SELESAI</small>
              <input type="time" id="jamSelesaiInput" />
            </div>
          </div>

          <div class="divider-text">ATAU MANUAL</div>
          <input type="text" id="manualTimeInput" placeholder="07:30 - 09:00" />
        </div>

        <div class="input-group">
          <label>Catatan</label>
          <input type="text" id="catatanInput" />
        </div>

        <div class="modal-footer">
          <button id="batalJadwal" class="btn-secondary">BATAL</button>
          <button id="kirimJadwal" class="btn-primary">KIRIM</button>
        </div>
      </div>

    </div>
  </div>
</div>

<footer class="footer">
  <div class="footer-bottom text-center py-2">
    <p>&copy; 2025 Politeknik Negeri Batam</p>
  </div>
</footer>

<script src="scriptkj.js?v=999"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('jadwalInputPopup');
  const batal = document.getElementById('batalJadwal');

  document.addEventListener('click', e => {
    const day = e.target.closest('.calendar-day');
    if(day && !day.classList.contains('empty')){
      popup.classList.add('show');
    }
  });

  batal.addEventListener('click', () => popup.classList.remove('show'));
  popup.addEventListener('click', e => {
    if(e.target === popup) popup.classList.remove('show');
  });
});
</script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menu-icon');
  const userIcon = document.querySelector('.user-icon');
  const menuPopup = document.getElementById('menuPopup');
  const userPopup = document.getElementById('userPopup');

  // toggle menu
  menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    menuPopup.style.display =
      menuPopup.style.display === 'block' ? 'none' : 'block';
    userPopup.style.display = 'none';
  });

  // toggle user
  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    userPopup.style.display =
      userPopup.style.display === 'block' ? 'none' : 'block';
    menuPopup.style.display = 'none';
  });

  // klik luar -> tutup semua
  document.addEventListener('click', () => {
    menuPopup.style.display = 'none';
    userPopup.style.display = 'none';
  });
});
</script>

</body>
</html>

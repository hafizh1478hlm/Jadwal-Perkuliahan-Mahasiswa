<?php
session_start();

if (!isset($_SESSION['nama'])) {
    header("Location: index.php");
    exit;
}

include 'koneksi.php';
?>

<!DOCTYPE html>
<html lang="id">
...

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Beranda</title>
  <link rel="stylesheet" href="styledshbrd.css" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
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
          style="width: 180px; border-radius: 20px; padding-left: 12px;" autocomplete="off"/>
        <ul id="suggestions" class="list-group position-absolute w-100" style="top: 35px; display:none; z-index:1000;">
        </ul>
      </div>


      <i class="fa-solid fa-bars menu-icon ms-2"></i>
      <i class="fa-regular fa-circle-user user-icon ms-3"></i>
    </div>
  </header>

  <!-- MENU POP-UP -->
  <div class="popup-menu" id="menuPopup">
    <ul>
      <li><a href="dashboard.php">Beranda</a></li>
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
<div class="modal" id="changePasswordModal">
  <div class="modal-content">
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



  <!-- HERO SECTION -->
  <section class="hero">
    <div class="hero-content">
      <h2>Halo, <?= htmlspecialchars($_SESSION['nama']) ?>!</h2>
      <p>Kelola jadwal kuliahmu dengan mudah dan efisien di sini.</p>
      <a href="jadwalutama.php" class="btn-hero">Lihat Jadwal</a>
    </div>
  </section>

  <!-- INTRO SECTION -->
  <section class="intro-section">
    <div class="container text-center">
      <h2>Selamat Datang di Website Jadwal Perkuliahan Mahasiswa Teknik Informatika</h2>
      <p>
        Website ini dirancang untuk membantu mahasiswa Program Studi Teknik Informatika Politeknik Negeri Batam 
        dalam mengakses dan mengelola jadwal perkuliahan secara efektif. 
        Tersedia fitur kalender interaktif yang memungkinkan pengguna menambahkan jadwal atau catatan perkuliahan 
        tambahan pada tanggal tertentu, termasuk informasi mata kuliah, dosen, ruangan, dan waktu, serta menghapus 
        data tambahan yang telah disimpan sesuai kebutuhan.
      </p>
    </div>
  </section>

  <!-- CEK TIM KAMI -->
  <section class="team-section">
    <h2>Dikembangkan oleh:</h2>
    <div class="team-container">
      <div class="team-card">
        <img src="pas zara.jpg" alt="Anggota 1">
        <h3>Azzahara Faiza Rayya</h3>
        <p>3312501079</p>
      </div>
      <div class="team-card">
        <img src="pas apis.jpg" alt="Anggota 2">
        <h3>Hafizh Abdul Halim</h3>
        <p>3312501080</p>
      </div>
      <div class="team-card">
        <img src="pas tifa.jpg" alt="Anggota 3">
        <h3>Latifah Intan Rosary</h3>
        <p>3312501081</p>
      </div>
      <div class="team-card">
        <img src="pas kris.jpg" alt="Anggota 4">
        <h3>Cristh Valdo Aritonang</h3>
        <p>3312501082</p>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container py-5 text-white">
      <div class="row gy-4">

        <!-- Kiri -->
        <div class="col-md-4">
          <img src="logo_poltek.png" alt="Logo Polibatam" class="img-fluid mb-3" style="width:220px;">
          <p>Jl. Ahmad Yani Batam Kota, Kota Batam, Kepulauan Riau, Indonesia</p>
          <p><i class="fa fa-phone me-2"></i> +62-778-469858 Ext.1017</p>
          <p><i class="fa fa-envelope me-2"></i> info@polibatam</p>
        </div>

        <!-- Tengah -->
        <div class="col-md-5">
          <p>
            Politeknik Negeri Batam (Polibatam) merupakan satu-satunya Perguruan Tinggi Negeri (PTN)
            Vokasi di kawasan perdagangan dan pelabuhan bebas Batam, Bintan, dan Karimun Provinsi Kepulauan Riau.
            Selain terletak di kawasan pusat pertumbuhan ekonomi nasional, Polibatam juga berada di wilayah terdepan
            dan terluar Negara Kesatuan Republik Indonesia yang berbatasan langsung dengan perairan internasional.
          </p>

          <div class="d-flex gap-3 mt-3">
            <a href="https://www.polibatam.ac.id/" target="_blank" class="social-icon"><i class="fas fa-globe"></i></a>
            <a href="https://www.instagram.com/polibatamofficial/" target="_blank" class="social-icon"><i
                class="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/@PolibatamTV" target="_blank" class="social-icon"><i class="fab fa-youtube"></i></a>
            <a href="https://www.facebook.com/polibatamofficial?locale=id_ID" target="_blank" class="social-icon"><i
                class="fab fa-facebook"></i></a>
            <a href="https://www.tiktok.com/@polibatamtv" target="_blank" class="social-icon"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>

        <!-- Kanan -->
        <div class="col-md-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0578062716795!2d104.04588167472417!3d1.1187204988705555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98921856ddfab%3A0xf9d9fc65ca00c9d!2sPoliteknik%20Negeri%20Batam!5e0!3m2!1sid!2sid!4v1760974510578!5m2!1sid!2sid"
            width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy">
          </iframe>
        </div>
      </div>
    </div>

    <div class="footer-bottom text-center py-2">
      <p class="mb-0">&copy; 2025 Politeknik Negeri Batam</p>
    </div>
  </footer>

  <script src="scriptds.js"></script>

</body>
</html>

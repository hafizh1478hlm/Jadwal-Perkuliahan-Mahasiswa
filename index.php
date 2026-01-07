<?php
/**
 * Project: Portal Jadwal Kuliah IF Polibatam
 * Standard: PSR-12 & Clean Code Principles
 */

session_start();
include 'koneksi.php';

// Inisialisasi variabel login dengan spasi operator yang rapi
$is_logged_in = isset($_SESSION['nama']);
$nama_display = $is_logged_in ? $_SESSION['nama'] : "Mahasiswa";
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beranda - Jadwal Kuliah</title>

    <link rel="stylesheet" href="styleindex.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
</head>

<body>
    <header class="navbar">
        <div class="nav-left">
            <img src="logo_if.png" alt="Logo IF" class="logo" />
            <div class="nav-text">
                <h1>JADWAL PERKULIAHAN</h1>
                <p>MAHASISWA POLITEKNIK NEGERI BATAM</p>
            </div>
        </div>

        <div class="nav-right">
            <div class="menu-icon" id="hamburger">
                <i class="fas fa-bars"></i>
            </div>
            
            <nav class="nav-links" id="navLinks">
                <a href="#hero">Beranda</a>
                <a href="#tentang">Tentang</a>
                <a href="#tim">Profil Tim</a>
                <a href="#footer">Informasi</a>
            </nav>
        </div>
    </header>

    <section class="hero" id="hero">
        <div class="hero-content">
            <h2>Selamat Datang!</h2>
            <p>Akses informasi jadwal perkuliahan Pribadi Teknik Informatika Polibatam-mu dalam satu pintu.</p>
            <a href="login.php" class="btn-hero">Masuk</a>
        </div>
    </section>

    <section class="intro-section" id="tentang">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <h2 class="section-title">Tentang Portal Jadwal IF</h2>
                    
                    <p class="lead-text">
                        Platform digital ini dirancang khusus untuk memfasilitasi kebutuhan akademik pribadi Mahasiswa
                        Teknik Informatika Politeknik Negeri Batam. Website ini hadir sebagai solusi manajemen 
                        perkuliahan mandiri yang membantu mahasiswa mengorganisir jadwal yang padat secara lebih 
                        efektif dan terstruktur.
                    </p>

                    <div class="features-grid">
                        <div class="feature-item">
                            <i class="fas fa-calendar-check"></i>
                            <h4>Akses Real-Time</h4>
                            <p>Memungkinkan mahasiswa melihat jadwal kuliah terbaru, lokasi ruangan, dan informasi dosen pengampu secara instan.</p>
                        </div>

                        <div class="feature-item">
                            <i class="fas fa-edit"></i>
                            <h4>Personalisasi Jadwal</h4>
                            <p>Fitur interaktif untuk menambahkan catatan pribadi atau agenda tambahan pada tanggal tertentu sesuai kebutuhan akademik masing-masing.</p>
                        </div>

                        <div class="feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <h4>Keamanan Data</h4>
                            <p>Sistem login terintegrasi memastikan data jadwal dan catatan pribadi hanya dapat dikelola oleh pemilik akun yang sah.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="team-section" id="tim">
        <div class="container">
            <h2>Dikembangkan oleh:</h2>
            <p>
                Proyek "Jadwal Perkuliahan Mahasiswa (Pribadi)" ini dikembangkan oleh kelompok 6 dari kelas IF-Pagi-1C 
                sebagai solusi inovatif untuk manajemen waktu akademik mahasiswa Teknik Informatika.
            </p>
            
            <div class="team-container">
                <div class="team-card">
                    <img src="pas zara.jpg" alt="Azzahara">
                    <h3>Azzahara Faiza Rayya</h3>
                    <p>3312501079</p>
                    <div class="role-overlay">
                        <span class="role-anggota">Anggota Kelompok</span>
                    </div>
                </div>

                <div class="team-card">
                    <img src="pas apis.jpg" alt="Hafizh">
                    <h3>Hafizh Abdul Halim</h3>
                    <p>3312501080</p>
                    <div class="role-overlay">
                        <span class="role-anggota">Anggota Kelompok</span>
                    </div>
                </div>

                <div class="team-card">
                    <img src="pas tifa.jpg" alt="Latifah">
                    <h3>Latifah Intan Rosary</h3>
                    <p>3312501081</p>
                    <div class="role-overlay">
                        <span class="role-ketua">Ketua Kelompok</span>
                    </div>
                </div>

                <div class="team-card">
                    <img src="pas kris.jpg" alt="Cristh">
                    <h3>Cristh Valdo Aritonang</h3>
                    <p>3312501082</p>
                    <div class="role-overlay">
                        <span class="role-anggota">Anggota Kelompok</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer" id="footer">
        <div class="container py-5 text-white">
            <div class="row gy-4">
                <div class="col-md-4">
                    <img src="logo_poltek.png" alt="Logo Polibatam" class="img-fluid mb-3" style="width:220px;">
                    <p>Jl. Ahmad Yani Batam Kota, Kota Batam, Kepulauan Riau, Indonesia</p>
                    <p><i class="fa fa-phone me-2"></i> +62-778-469858 Ext.1017</p>
                    <p><i class="fa fa-envelope me-2"></i> info@polibatam</p>
                </div>

                <div class="col-md-5">
                    <p>
                        Politeknik Negeri Batam (Polibatam) merupakan satu-satunya Perguruan Tinggi Negeri (PTN)
                        Vokasi di kawasan perdagangan dan pelabuhan bebas Batam, Bintan, dan Karimun Provinsi Kepulauan Riau. 
                        Polibatam berada di wilayah terdepan dan terluar Negara Kesatuan Republik Indonesia yang berbatasan 
                        langsung dengan perairan internasional.
                    </p>

                    <div class="d-flex gap-3 mt-3">
                        <a href="https://www.polibatam.ac.id/" target="_blank" class="social-icon"><i class="fas fa-globe"></i></a>
                        <a href="https://www.instagram.com/polibatamofficial/" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.youtube.com/@PolibatamTV" target="_blank" class="social-icon"><i class="fab fa-youtube"></i></a>
                        <a href="https://www.facebook.com/polibatamofficial?locale=id_ID" target="_blank" class="social-icon"><i class="fab fa-facebook"></i></a>
                        <a href="https://www.tiktok.com/@polibatamtv" target="_blank" class="social-icon"><i class="fab fa-tiktok"></i></a>
                    </div>
                </div>

                <div class="col-md-3">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15956.231086402766!2d104.045863!3d1.118746!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98921856ddfab%3A0xf9d9fc65ca00c9d!2sPoliteknik%20Negeri%20Batam!5e0!3m2!1sid!2sid!4v1767807371867!5m2!1sid!2sid"
                        width="100%" 
                        height="200" 
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        </div>

        <div class="footer-bottom text-center py-2">
            <p class="mb-0">© 2025 Politeknik Negeri Batam</p>
        </div>
    </footer>

    <script src="scriptindex.js"></script>
</body>

</html>

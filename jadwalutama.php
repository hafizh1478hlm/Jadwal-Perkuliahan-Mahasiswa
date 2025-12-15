<?php 

include 'koneksi.php'; 

$keyword = isset($_GET['search']) ? $_GET['search'] : '';
$where_clause = "";

if (!empty($keyword)) {
    $safe_keyword = $conn->real_escape_string($keyword); 
    
    $where_clause = " WHERE 
        mk.nama_mk LIKE '%$safe_keyword%' OR 
        d.nama_dosen LIKE '%$safe_keyword%' OR 
        jk.ruang LIKE '%$safe_keyword%'";
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadwal Utama Mata Kuliah</title>
    <link rel="stylesheet" href="styleju.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
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
            
            <form method="GET" action="jadwalutama.php" class="d-flex align-items-center"> 
                <div class="search-container me-3 position-relative">
                    <input type="text" 
                        id="searchInput" 
                        name="search" 
                        placeholder="Search..." 
                        class="form-control form-control-sm"
                        style="width: 180px; border-radius: 20px; padding-left: 12px;" />
                    <ul id="suggestions" class="list-group position-absolute w-100"
                        style="top: 35px; display:none; z-index:1000;">
                    </ul>
                </div>
                <button type="submit" style="display:none;"></button>
            </form>
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
            <li><a href="index.php">Keluar</a></li>
        </ul>
    </div>

    <div class="container">
        <h1>Jadwal Utama</h1>
        <p>Halaman ini menampilkan jadwal perkuliahan utama mahasiswa.
            Setiap perubahan yang dilakukan pada halaman "Kelola Jadwal" akan otomatis diperbarui ditabel ini.
        </p>
        <table class="jadwal-table">
            <thead>
                <tr>
                    <th style="color: black;">Hari</th>
                    <th style="color: black;">Jam</th>
                    <th style="color: black;">Ruang</th>
                    <th style="color: black;">Mata Kuliah</th>
                    <th style="color: black;">Dosen</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    $query = "SELECT 
                                jk.hari, 
                                jk.waktu_mulai, 
                                jk.waktu_selesai, 
                                jk.ruang, 
                                mk.nama_mk, 
                                d.nama_dosen
                            FROM 
                                jadwal_kuliah jk
                            JOIN
                                mata_kuliah mk ON jk.id_mk = mk.id_mk
                            JOIN
                                dosen d ON jk.id_dosen = d.id_dosen
                            $where_clause 
                            ORDER BY 
                                FIELD(jk.hari, 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'), 
                                jk.waktu_mulai";
                            
                $result = $conn->query($query);
                
                $hari_sebelumnya = "";
                
                if ($result && $result->num_rows > 0) {
                    while($data = $result->fetch_assoc()) {
                        echo "<tr>";
                        
                        // --- LOGIKA ROWSPAN ---
                        if ($data['hari'] != $hari_sebelumnya) {
                            // 2. Perbarui Query Rowspan ($rowspan_query)
                            // Query count juga harus menyisipkan filter $where_clause dan JOIN
                            $rowspan_query = "SELECT COUNT(*) AS total FROM jadwal_kuliah jk
                                            JOIN mata_kuliah mk ON jk.id_mk = mk.id_mk
                                            JOIN dosen d ON jk.id_dosen = d.id_dosen
                                            WHERE jk.hari = '{$data['hari']}' $where_clause";
                                            
                            $rowspan_result = $conn->query($rowspan_query);
                            $rowspan_data = $rowspan_result->fetch_assoc();
                            $rowspan = $rowspan_data['total'];
                            
                            if ($rowspan > 0) {
                                echo "<td rowspan='{$rowspan}'>{$data['hari']}</td>";
                                $hari_sebelumnya = $data['hari'];
                            }
                        }
                        // ----------------------------------------------------------

                        // Mencetak kolom lainnya
                        echo "<td>" . substr($data['waktu_mulai'], 0, 5) . " - " . substr($data['waktu_selesai'], 0, 5) . "</td>";
                        echo "<td>{$data['ruang']}</td>";
                        echo "<td>{$data['nama_mk']}</td>";
                        echo "<td>{$data['nama_dosen']}</td>";
                        
                        echo "</tr>";
                    }
                } else {
                    // Tampilkan pesan yang lebih informatif
                    echo "<tr><td colspan='5'>Tidak ada data jadwal yang ditemukan";
                    if (!empty($keyword)) echo " untuk kata kunci '{$keyword}'";
                    echo ".</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
    <!-- Footer -->
    <footer class="footer">
        <div class="footer-top text-white py-4">
            <div class="footer-container">
                <p>Jadwal default jurusan Teknik Informatika semester 1 Politeknik Negeri Batam </p>
            </div>
        </div>
        <div class="footer-bottom text-center py-2">
            <p class="mb-0">&copy; 2025 Politeknik Negeri Batam</p>
        </div>
    </footer>

    <script src="scriptju.js"></script>
</body>

</html>

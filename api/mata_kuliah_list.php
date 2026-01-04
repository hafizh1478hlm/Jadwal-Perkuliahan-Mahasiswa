<?php
include 'db.php';

$q = mysqli_query($conn, "SELECT DISTINCT matkul FROM jd_utama ORDER BY matkul");

$data = [];
while ($r = mysqli_fetch_assoc($q)) {
  $data[] = [
    "id" => $r["matkul"],      
    "nama" => $r["matkul"]     
  ];
}

echo json_encode($data);

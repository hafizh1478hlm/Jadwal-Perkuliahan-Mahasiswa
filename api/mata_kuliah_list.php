<?php
include 'db.php';

$q = mysqli_query($conn, "SELECT DISTINCT matkul FROM jd_utama ORDER BY matkul");

$out = [];
while ($r = mysqli_fetch_assoc($q)) {
  $out[] = [
    "id" => $r["matkul"],
    "nama" => $r["matkul"]
  ];
}

header('Content-Type: application/json');
echo json_encode($out);

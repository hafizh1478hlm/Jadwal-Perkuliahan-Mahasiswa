<?php
include 'db.php';

$q = mysqli_query($conn, "SELECT DISTINCT dosen FROM jd_utama ORDER BY dosen");

$out = [];
while ($r = mysqli_fetch_assoc($q)) {
  $out[] = [
    "id" => $r["dosen"],
    "nama" => $r["dosen"]
  ];
}

header('Content-Type: application/json');
echo json_encode($out);

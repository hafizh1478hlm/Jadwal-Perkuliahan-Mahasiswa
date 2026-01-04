<?php
include 'db.php';

$q = mysqli_query($conn, "SELECT DISTINCT dosen FROM jd_utama ORDER BY dosen");

$data = [];
while ($r = mysqli_fetch_assoc($q)) {
  $data[] = [
    "id" => $r["dosen"],
    "nama" => $r["dosen"]
  ];
}

echo json_encode($data);

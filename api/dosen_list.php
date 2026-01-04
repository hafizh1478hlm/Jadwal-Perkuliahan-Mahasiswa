<?php
include 'db.php';

$query = mysqli_query($conn,
  "SELECT DISTINCT dosen FROM jd_utama ORDER BY dosen"
);

$data = [];
while ($row = mysqli_fetch_assoc($query)) {
  $data[] = $row;
}

echo json_encode($data);

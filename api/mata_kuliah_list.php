<?php
include 'db.php';

$query = mysqli_query($conn,
  "SELECT DISTINCT mata_kuliah FROM jd_utana ORDER BY matkul"
);

$data = [];
while ($row = mysqli_fetch_assoc($query)) {
  $data[] = $row;
}

echo json_encode($data);

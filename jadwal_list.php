<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

$rows = $pdo->query("
  SELECT jk.id, jk.tanggal, jk.catatan,
         mk.nama AS matkul,
         d.nama  AS dosen,
         r.nama  AS ruangan,
         TIME_FORMAT(ws.mulai, '%H:%i') AS mulai,
         TIME_FORMAT(ws.selesai, '%H:%i') AS selesai
  FROM jadwal_kuliah jk
  JOIN mata_kuliah mk ON mk.id = jk.mata_kuliah_id
  JOIN dosen d        ON d.id  = jk.dosen_id
  JOIN ruangan r      ON r.id  = jk.ruangan_id
  JOIN waktu_slot ws  ON ws.id = jk.waktu_slot_id
  ORDER BY jk.tanggal DESC, ws.mulai ASC, jk.id DESC
")->fetchAll();

echo json_encode($rows);

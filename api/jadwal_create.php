<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$tanggal = $input["tanggal"] ?? null; // YYYY-MM-DD
$mkId    = intval($input["mata_kuliah_id"] ?? 0);
$dosenId = intval($input["dosen_id"] ?? 0);
$ruangId = intval($input["ruangan_id"] ?? 0);
$waktuId = intval($input["waktu_slot_id"] ?? 0);
$catatan = $input["catatan"] ?? null;

if (!$tanggal || $mkId<=0 || $dosenId<=0 || $ruangId<=0 || $waktuId<=0) {
  http_response_code(400);
  echo json_encode(["message" => "Field belum lengkap"]);
  exit;
}

try {
  $stmt = $pdo->prepare("
    INSERT INTO jadwal_kuliah (tanggal, mata_kuliah_id, dosen_id, ruangan_id, waktu_slot_id, catatan)
    VALUES (?, ?, ?, ?, ?, ?)
  ");
  $stmt->execute([$tanggal, $mkId, $dosenId, $ruangId, $waktuId, $catatan]);

  $id = $pdo->lastInsertId();

  // balikin row lengkap utk langsung render
  $row = $pdo->prepare("
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
    WHERE jk.id = ?
  ");
  $row->execute([$id]);

  echo json_encode(["ok" => true, "data" => $row->fetch()]);
} catch (PDOException $e) {
  http_response_code(409);
  echo json_encode(["message" => "Bentrok jadwal (tanggal+slot+ruangan) atau error lain", "detail" => $e->getMessage()]);
}

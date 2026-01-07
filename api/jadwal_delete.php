<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;
if ($id <= 0) {
  http_response_code(400);
  echo json_encode(["message" => "id wajib"]);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM jadwal_kuliah WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(["status" => "success", "message" => "Data berhasil dihapus"]);

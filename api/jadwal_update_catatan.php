<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$id = intval($input["id"] ?? 0);
$catatan = $input["catatan"] ?? "";

if ($id <= 0) {
  http_response_code(400);
  echo json_encode(["message" => "id wajib"]);
  exit;
}

$stmt = $pdo->prepare("UPDATE jadwal_kuliah SET catatan = ? WHERE id = ?");
$stmt->execute([$catatan, $id]);

echo json_encode(["ok" => true]);

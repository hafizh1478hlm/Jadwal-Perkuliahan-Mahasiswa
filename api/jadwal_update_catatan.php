<?php
// jadwal_update_catatan.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents("php://input"), true);
$id = intval($input["id"] ?? 0);
$catatan = $input["catatan"] ?? "";

if ($id <= 0) {
    echo json_encode(["ok" => false, "message" => "ID tidak valid"]);
    exit;
}

// Gunakan try-catch untuk keamanan
try {
    $stmt = $pdo->prepare("UPDATE jadwal_kuliah SET catatan = ? WHERE id = ?");
    $stmt->execute([$catatan, $id]);
    echo json_encode(["ok" => true]);
} catch (Exception $e) {
    echo json_encode(["ok" => false, "message" => $e->getMessage()]);
}
<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
$rows = $pdo->query("
  SELECT id,
         TIME_FORMAT(mulai, '%H:%i') AS mulai,
         TIME_FORMAT(selesai, '%H:%i') AS selesai
  FROM waktu_slot
  ORDER BY mulai
")->fetchAll();
echo json_encode($rows);

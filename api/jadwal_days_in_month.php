<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$year  = isset($_GET["year"]) ? (int)$_GET["year"] : (int)date("Y");
$month = isset($_GET["month"]) ? (int)$_GET["month"] : (int)date("m");

$stmt = $pdo->prepare("
  SELECT DISTINCT DAY(tanggal) AS day
  FROM jadwal_kuliah
  WHERE YEAR(tanggal) = :y AND MONTH(tanggal) = :m
  ORDER BY day ASC
");
$stmt->execute([":y" => $year, ":m" => $month]);

$days = array_map(fn($r) => (int)$r["day"], $stmt->fetchAll());
echo json_encode($days);

<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../koneksi.php';
echo json_encode($pdo->query("SELECT id, nama FROM mata_kuliah ORDER BY nama")->fetchAll());

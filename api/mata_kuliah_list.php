<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
echo json_encode($pdo->query("SELECT id, nama FROM mata_kuliah ORDER BY nama")->fetchAll());

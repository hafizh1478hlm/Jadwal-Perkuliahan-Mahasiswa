<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";
echo json_encode($pdo->query("SELECT id, nama FROM dosen ORDER BY nama")->fetchAll());

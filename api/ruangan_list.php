<?php
header("Content-Type: application/json");
require __DIR__ . "/db.php";
echo json_encode($pdo->query("SELECT id, nama FROM ruangan ORDER BY nama")->fetchAll());

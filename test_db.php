<?php
$conn = new mysqli("localhost", "root", "", "db_jadwal");

if ($conn->connect_errno) {
    echo "FAILED: " . $conn->connect_error;
} else {
    echo "SUCCESS: Connected to database!";
}

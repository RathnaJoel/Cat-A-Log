<?php
// Copy this file to db.php and fill in your own credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');        // Your XAMPP MySQL password
define('DB_NAME', 'catalogue_db');
define('DB_PORT', 3306);

function getDB(): mysqli {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    if ($conn->connect_error) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $conn->connect_error]);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
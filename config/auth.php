<?php
// ============================================================
//  config/auth.php — Session auth guard for protected APIs
//  Include at the top of any API that requires admin login.
//  Must be included BEFORE any output (headers sent by db.php
//  are fine — this file only sets session and checks it).
// ============================================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in.',
        'auth'    => false,
    ]);
    exit;
}

<?php
// ============================================================
//  api/check_session.php — Return whether admin is logged in
//  Method: GET
//  Called on manage.html load to gate the UI
// ============================================================

header('Content-Type: application/json');

session_start();

if (!empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    echo json_encode([
        'success'     => true,
        'logged_in'   => true,
        'email'       => $_SESSION['admin_email'] ?? '',
    ]);
} else {
    echo json_encode(['success' => true, 'logged_in' => false]);
}

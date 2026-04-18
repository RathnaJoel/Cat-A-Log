<?php
// ============================================================
//  api/login.php — Validate admin credentials & start session
//  Method: POST
//  Body (JSON): { email, password }
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

session_start();

require_once __DIR__ . '/../config/db.php';

$input    = json_decode(file_get_contents('php://input'), true);
$email    = trim($input['email']    ?? '');
$password = trim($input['password'] ?? '');

// Basic presence check
if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

$db   = getDB();
$stmt = $db->prepare("SELECT id, email, password FROM admin_users WHERE email = ? LIMIT 1");
$stmt->bind_param('s', $email);
$stmt->execute();
$row  = $stmt->get_result()->fetch_assoc();
$stmt->close();
$db->close();

// Verify password against bcrypt hash
if ($row && password_verify($password, $row['password'])) {
    // Regenerate session ID to prevent fixation
    session_regenerate_id(true);
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_email']     = $row['email'];
    $_SESSION['admin_id']        = $row['id'];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful.',
        'email'   => $row['email'],
    ]);
} else {
    // Uniform error — don't reveal whether email exists
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
}

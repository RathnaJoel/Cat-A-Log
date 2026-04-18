<?php
// ============================================================
//  api/delete_item.php — Delete an item by category + id
//  Method: POST
//  Body (JSON): { category, id }
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Auth guard ──────────────────────────────────────────────
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/db.php';

$input    = json_decode(file_get_contents('php://input'), true);
$allowed  = ['characters', 'places', 'monuments'];
$category = strtolower(trim($input['category'] ?? ''));
$id       = (int)($input['id'] ?? 0);

if (!in_array($category, $allowed, true) || $id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$db   = getDB();
$stmt = $db->prepare("DELETE FROM `$category` WHERE id = ?");
$stmt->bind_param('i', $id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    $stmt->close(); $db->close();
    echo json_encode(['success' => true, 'message' => 'Entry deleted.']);
} else {
    $stmt->close(); $db->close();
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Entry not found or already deleted.']);
}

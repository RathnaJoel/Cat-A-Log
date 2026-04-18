<?php
// ============================================================
//  api/get_detail.php — Fetch a single item's full details
//  Usage: api/get_detail.php?category=characters&id=1
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/db.php';

$allowed  = ['characters', 'places', 'monuments'];
$category = strtolower(trim($_GET['category'] ?? ''));
$id       = (int)($_GET['id'] ?? 0);

if (!in_array($category, $allowed, true) || $id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$db = getDB();

// All columns for the detail view
$sql  = "SELECT * FROM `$category` WHERE id = ? LIMIT 1";
$stmt = $db->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$item = $stmt->get_result()->fetch_assoc();
$stmt->close();
$db->close();

if (!$item) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Item not found.']);
    exit;
}

echo json_encode(['success' => true, 'category' => $category, 'item' => $item]);

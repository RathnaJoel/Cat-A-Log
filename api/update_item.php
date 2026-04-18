<?php
// ============================================================
//  api/update_item.php — Update an existing item
//  Method: POST
//  Body (JSON): { category, id, name, image, description, ...extras }
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

$input = json_decode(file_get_contents('php://input'), true);

$schema = [
    'characters' => ['age', 'abilities'],
    'places'     => ['location', 'climate'],
    'monuments'  => ['location', 'historical_significance'],
];

$category = strtolower(trim($input['category'] ?? ''));
$id       = (int)($input['id'] ?? 0);

if (!array_key_exists($category, $schema) || $id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$name        = trim($input['name']        ?? '');
$image       = trim($input['image']       ?? '');
$description = trim($input['description'] ?? '');

if ($name === '' || $description === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and description are required.']);
    exit;
}

$extraFields = $schema[$category];
$setClauses  = 'name = ?, image = ?, description = ?, ' .
               implode(', ', array_map(fn($f) => "$f = ?", $extraFields));
$extraValues = array_map(fn($f) => trim($input[$f] ?? ''), $extraFields);

$sql    = "UPDATE `$category` SET $setClauses WHERE id = ?";
$types  = str_repeat('s', 3 + count($extraFields)) . 'i';
$params = array_merge([$name, $image, $description], $extraValues, [$id]);

$db   = getDB();
$stmt = $db->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute() && $stmt->affected_rows >= 0) {
    $stmt->close(); $db->close();
    echo json_encode(['success' => true, 'message' => 'Entry updated successfully!']);
} else {
    $err = $stmt->error;
    $stmt->close(); $db->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB error: ' . $err]);
}

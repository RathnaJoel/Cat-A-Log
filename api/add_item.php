<?php
// ============================================================
//  api/add_item.php — Insert a new item into a category table
//  Method: POST
//  Body (JSON): { category, name, image, description, ...extras }
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Auth guard: must be logged in as admin ──────────────────
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/db.php';

// Decode JSON body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON body.']);
    exit;
}

// Whitelist of allowed categories and their extra fields
$schema = [
    'characters' => ['age', 'abilities'],
    'places'     => ['location', 'climate'],
    'monuments'  => ['location', 'historical_significance'],
];

$category = strtolower(trim($input['category'] ?? ''));

if (!array_key_exists($category, $schema)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid category.']);
    exit;
}

// Required base fields
$name        = trim($input['name']        ?? '');
$image       = trim($input['image']       ?? 'assets/images/placeholder.jpg');
$description = trim($input['description'] ?? '');

if ($name === '' || $description === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and description are required.']);
    exit;
}

// Build dynamic query for extra fields
$extraFields  = $schema[$category];
$extraCols    = implode(', ', $extraFields);
$extraMarkers = implode(', ', array_fill(0, count($extraFields), '?'));
$extraValues  = array_map(fn($f) => trim($input[$f] ?? ''), $extraFields);

$sql   = "INSERT INTO `$category` (name, image, description, $extraCols)
          VALUES (?, ?, ?, $extraMarkers)";

$db    = getDB();
$stmt  = $db->prepare($sql);

// Build types string: 3 base strings + one 's' per extra field
$types  = str_repeat('s', 3 + count($extraFields));
$params = array_merge([$name, $image, $description], $extraValues);

$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    $newId = $db->insert_id;
    $stmt->close();
    $db->close();
    echo json_encode([
        'success'  => true,
        'message'  => ucfirst($category) . ' entry added successfully!',
        'id'       => $newId,
        'category' => $category,
    ]);
} else {
    $err = $stmt->error;
    $stmt->close();
    $db->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB error: ' . $err]);
}

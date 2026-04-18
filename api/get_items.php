<?php
// ============================================================
//  api/get_items.php — Fetch all items for a category
//  Returns JSON array of items.
//  Usage: api/get_items.php?category=characters&search=aria
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/db.php';

// --- Allowed categories (whitelist — never trust user input for table names) ---
$allowed = ['characters', 'places', 'monuments'];

$category = strtolower(trim($_GET['category'] ?? ''));
$search   = trim($_GET['search'] ?? '');
$page     = max(1, (int)($_GET['page'] ?? 1));
$limit    = 6;                          // items per page
$offset   = ($page - 1) * $limit;

if (!in_array($category, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid category.']);
    exit;
}

$db = getDB();

// Build SELECT based on category (each table has different extra columns)
$extraCols = match($category) {
    'characters' => ', age, abilities',
    'places'     => ', location, climate',
    'monuments'  => ', location, historical_significance',
    default      => ''
};

// Prepare search condition
$whereSql = '';
$params   = [];
$types    = '';

if ($search !== '') {
    $whereSql = 'WHERE name LIKE ? OR description LIKE ?';
    $like     = '%' . $search . '%';
    $params   = [$like, $like];
    $types    = 'ss';
}

// Total count for pagination
$countSql  = "SELECT COUNT(*) AS total FROM `$category` $whereSql";
$countStmt = $db->prepare($countSql);
if ($types) $countStmt->bind_param($types, ...$params);
$countStmt->execute();
$total = $countStmt->get_result()->fetch_assoc()['total'];
$countStmt->close();

// Fetch page of items
$sql  = "SELECT id, name, image, description $extraCols
         FROM `$category`
         $whereSql
         ORDER BY id ASC
         LIMIT ? OFFSET ?";

$stmt = $db->prepare($sql);

// Append limit/offset to bind params
$params[] = $limit;
$params[] = $offset;
$types   .= 'ii';

$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}
$stmt->close();
$db->close();

echo json_encode([
    'success'      => true,
    'category'     => $category,
    'items'        => $items,
    'total'        => (int)$total,
    'page'         => $page,
    'limit'        => $limit,
    'total_pages'  => (int)ceil($total / $limit)
]);

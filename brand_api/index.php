<?php
// CORS เฉพาะไฟล์นี้พอ
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

header('Content-Type: application/json; charset=utf-8');

// ดึง config (DB)
require_once __DIR__ . '/config.php';

// ----------- Helpers -----------
if (!function_exists('json_body')) {
  function json_body() {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
  }
}

function respond($data, $code = 200) {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}
function not_found() { respond(['error' => 'Not found'], 404); }
function bad_request($msg = 'Bad request') { respond(['error' => $msg], 400); }

// Parse route: /brands, /brands/1, /projects, /project-images, /collections
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
$rel  = '/' . ltrim(substr($path, strlen($base)), '/');
$segments = array_values(array_filter(explode('/', $rel))); // e.g. ['brands', '1']
$entity = $segments[0] ?? '';
$id = isset($segments[1]) ? (int)$segments[1] : null;
$method = $_SERVER['REQUEST_METHOD'];

// Map table/columns
$entities = [
  'brands' => [
    'table' => 'Brand',
    'columns' => ['brandname','type','image'],
    'required_post' => ['brandname'],
  ],
  'projects' => [
    'table' => 'Project',
    'columns' => ['project_name','data_update'],
    'required_post' => ['project_name'],
  ],
  'project-images' => [
    'table' => 'ProjectImage',
    'columns' => ['project_id','image_url'],
    'required_post' => ['project_id','image_url'],
  ],
  'collections' => [
    'table' => 'ProductCollection',
    'columns' => ['brand_id','project_id','main_type','type','detail','image','collection_link','status_discontinued'],
    'required_post' => ['brand_id','project_id'],
  ],
];

if (!isset($entities[$entity])) {
  if ($rel === '/' || $entity === '') {
    respond([
      'endpoints' => [
        'GET /brands', 'POST /brands', 'GET /brands/{id}', 'PUT /brands/{id}', 'DELETE /brands/{id}',
        'GET /projects', 'POST /projects', 'GET /projects/{id}', 'PUT /projects/{id}', 'DELETE /projects/{id}',
        'GET /project-images', 'POST /project-images', 'GET /project-images/{id}', 'PUT /project-images/{id}', 'DELETE /project-images/{id}',
        'GET /collections', 'POST /collections', 'GET /collections/{id}', 'PUT /collections/{id}', 'DELETE /collections/{id}',
      ],
      'filtering' => [
        'GET /collections?brand_id=..&project_id=..&main_type=..&type=..&discontinued=0|1',
        'GET /project-images?project_id=..',
      ],
    ]);
  }
  not_found();
}

$cfg = $entities[$entity];
$table = $cfg['table'];

// ---------- Handlers ----------
try {
  switch ($method) {
    case 'GET':
      if ($id) {
        $pk = match($entity) {
          'brands' => 'brand_id',
          'projects' => 'project_id',
          'project-images' => 'image_id',
          'collections' => 'collection_id',
        };
        $stmt = $pdo->prepare("SELECT * FROM $table WHERE $pk = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $row ? respond($row) : not_found();
      } else {
        $where = [];
        $params = [];

        if ($entity === 'collections') {
          if (isset($_GET['brand_id'])) { $where[] = 'brand_id = ?'; $params[] = (int)$_GET['brand_id']; }
          if (isset($_GET['project_id'])) { $where[] = 'project_id = ?'; $params[] = (int)$_GET['project_id']; }
          if (isset($_GET['main_type'])) { $where[] = 'main_type = ?'; $params[] = $_GET['main_type']; }
          if (isset($_GET['type'])) { $where[] = 'type = ?'; $params[] = $_GET['type']; }
          if (isset($_GET['discontinued'])) { $where[] = 'status_discontinued = ?'; $params[] = (int)$_GET['discontinued']; }
        }

        if ($entity === 'project-images' && isset($_GET['project_id'])) {
          $where[] = 'project_id = ?'; $params[] = (int)$_GET['project_id'];
        }

        $sql = "SELECT * FROM $table";
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY 1 DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        respond($stmt->fetchAll());
      }
      break;

    case 'POST':
      $data = json_body();
      foreach (($cfg['required_post'] ?? []) as $req) {
        if (!isset($data[$req]) || $data[$req] === '') bad_request("Missing field: $req");
      }
      $fields = [];
      $place = [];
      $values = [];
      foreach ($cfg['columns'] as $col) {
        if (array_key_exists($col, $data)) {
          $fields[] = $col;
          $place[] = '?';
          $values[] = $data[$col];
        }
      }
      if (!$fields) bad_request('No valid fields supplied');
      $sql = "INSERT INTO $table (" . implode(',', $fields) . ") VALUES (" . implode(',', $place) . ")";
      $stmt = $pdo->prepare($sql);
      $stmt->execute($values);
      $newId = (int)$pdo->lastInsertId();
      respond(['id' => $newId, 'message' => 'Created'], 201);
      break;

    case 'PUT':
      if (!$id) bad_request('ID required');
      $data = json_body();
      $sets = [];
      $values = [];
      foreach ($cfg['columns'] as $col) {
        if (array_key_exists($col, $data)) {
          $sets[] = "$col = ?";
          $values[] = $data[$col];
        }
      }
      if (!$sets) bad_request('No fields to update');
      $pk = match($entity) {
        'brands' => 'brand_id',
        'projects' => 'project_id',
        'project-images' => 'image_id',
        'collections' => 'collection_id',
      };
      $values[] = $id;
      $sql = "UPDATE $table SET " . implode(', ', $sets) . " WHERE $pk = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute($values);
      respond(['message' => 'Updated']);
      break;

    case 'DELETE':
      if (!$id) bad_request('ID required');
      $pk = match($entity) {
        'brands' => 'brand_id',
        'projects' => 'project_id',
        'project-images' => 'image_id',
        'collections' => 'collection_id',
      };
      $stmt = $pdo->prepare("DELETE FROM $table WHERE $pk = ?");
      $stmt->execute([$id]);
      respond(['message' => 'Deleted']);
      break;

    default:
      respond(['error' => 'Method not allowed'], 405);
  }
} catch (PDOException $e) {
  respond(['error' => 'DB error', 'detail' => $e->getMessage()], 500);
}

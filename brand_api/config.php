<?php
// ❌ ห้าม require ตัวเอง และไม่ต้องใส่ header CORS ตรงนี้

// ตั้งค่า DB
$DB_HOST = '127.0.0.1';
$DB_PORT = '3307';   // พอร์ต MySQL ใน XAMPP ของคุณ
$DB_NAME = 'brand_project_db';
$DB_USER = 'root';
$DB_PASS = ''; // ค่าเริ่มต้น XAMPP

$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    $options
  );
} catch (PDOException $e) {
  http_response_code(500);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode([
    'error' => 'DB connection failed',
    'detail' => $e->getMessage()
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

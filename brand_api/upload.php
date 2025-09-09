<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$targetDir = __DIR__ . "/uploads/"; // โฟลเดอร์เก็บรูป
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if (!isset($_FILES['file'])) {
    echo json_encode(["error" => "No file uploaded"]);
    exit;
}

$fileName = time() . "_" . basename($_FILES["file"]["name"]);
$targetFile = $targetDir . $fileName;

if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
    $url = "http://localhost/brand_api/uploads/" . $fileName;
    echo json_encode([
        "message" => "Upload successful",
        "url" => $url
    ]);
} else {
    echo json_encode(["error" => "Upload failed"]);
}

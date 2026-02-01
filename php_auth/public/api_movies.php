<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../includes/config.php';
require_once '../includes/Database.php';

try {
    $database = new Database();
    $db = $database->connect();

    // Auto-create table if not exists
    $db->exec("CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        poster_url TEXT,
        category VARCHAR(100),
        release_year INT,
        duration VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            $stmt = $db->query("SELECT * FROM movies ORDER BY id DESC");
            $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'movies' => $movies]);
            break;

        case 'POST':
            if (empty($input['title'])) {
                echo json_encode(['success' => false, 'message' => 'Title is required']);
                exit;
            }
            $sql = "INSERT INTO movies (title, description, poster_url, category, release_year, duration) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                $input['title'],
                $input['description'] ?? '',
                $input['poster_url'] ?? '',
                $input['category'] ?? '',
                $input['release_year'] ?? date('Y'),
                $input['duration'] ?? ''
            ]);
            echo json_encode(['success' => true, 'message' => 'Content saved successfully']);
            break;

        case 'PUT':
            if (empty($input['id'])) {
                echo json_encode(['success' => false, 'message' => 'ID is required for update']);
                exit;
            }
            $sql = "UPDATE movies SET title=?, description=?, poster_url=?, category=?, release_year=?, duration=? WHERE id=?";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                $input['title'],
                $input['description'],
                $input['poster_url'],
                $input['category'],
                $input['release_year'],
                $input['duration'],
                $input['id']
            ]);
            echo json_encode(['success' => true, 'message' => 'Content updated successfully']);
            break;

        case 'DELETE':
            if (empty($input['id'])) {
                echo json_encode(['success' => false, 'message' => 'ID is required for deletion']);
                exit;
            }
            $sql = "DELETE FROM movies WHERE id=?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$input['id']]);
            echo json_encode(['success' => true, 'message' => 'Content deleted successfully']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
}
?>
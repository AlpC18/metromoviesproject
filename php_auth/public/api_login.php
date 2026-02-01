<?php


header('Content-Type: application/json');
require_once '../includes/config.php';
require_once '../includes/Database.php';
require_once '../includes/User.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}


$input = json_decode(file_get_contents('php://input'), true);


$email = $input['email'] ?? $_POST['email'] ?? '';
$password = $input['password'] ?? $_POST['password'] ?? '';


if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

// ==========================================
// HARDCODED ADMIN CHECK
// ==========================================
if ($email === 'admin@gmail.com' && $password === 'admin1234') {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['user_id'] = 999999;
    $_SESSION['username'] = 'System Admin';
    $_SESSION['email'] = $email;
    $_SESSION['role'] = 'admin';
    $_SESSION['logged_in'] = true;

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Admin Login successful',
        'user' => [
            'username' => 'System Admin',
            'email' => $email,
            'role' => 'admin'
        ],
        'redirect' => '../AdminPanel/index.html'
    ]);
    exit;
}
// ==========================================

try {

    $database = new Database();
    $db = $database->connect();
    $user = new User($db);


    $result = $user->login($email, $password);

    if ($result['success']) {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }


        $_SESSION['user_id'] = $result['user']['id'];
        $_SESSION['username'] = $result['user']['username'];
        $_SESSION['email'] = $result['user']['email'];
        $_SESSION['subscription_type'] = $result['user']['subscription_type'];
        $_SESSION['logged_in'] = true;


        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => $result['user'],
            'redirect' => '../../Interface MainPage/index.html'
        ]);
    } else {

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $result['message'] ?? 'Invalid credentials'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error. Please try again later.'
    ]);
    error_log("Login API Error: " . $e->getMessage());
}
?>
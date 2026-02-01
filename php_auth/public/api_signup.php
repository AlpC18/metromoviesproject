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


$username = $input['username'] ?? $_POST['username'] ?? '';
$email = $input['email'] ?? $_POST['email'] ?? '';
$password = $input['password'] ?? $_POST['password'] ?? '';
$confirm_password = $input['confirm_password'] ?? $_POST['confirm_password'] ?? '';
$full_name = $input['full_name'] ?? $_POST['full_name'] ?? '';


if (empty($username) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}


if (strlen($password) < PASSWORD_MIN_LENGTH) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters']);
    exit;
}


if ($password !== $confirm_password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit;
}

try {
    
    $database = new Database();
    $db = $database->connect();
    $user = new User($db);

    
    if ($user->emailExists($email)) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }

    
    $data = [
        'username' => $username,
        'email' => $email,
        'password' => $password,
        'full_name' => $full_name
    ];

    
    if ($user->register($data)) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful! You can now login.',
            'redirect' => '../../LoginForm/metromovies-loginform.html'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed. Please try again.'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error. Please try again later.'
    ]);
    error_log("Signup API Error: " . $e->getMessage());
}
?>
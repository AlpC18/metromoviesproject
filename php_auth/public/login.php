<?php

session_start();


require_once '../includes/Database.php';
require_once '../includes/User.php';


$database = new Database();
$db = $database->connect();
$user = new User($db);

$message = '';
$messageType = '';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $message = 'Please enter email and password.';
        $messageType = 'error';
    } else {
        if ($user->login($email, $password)) {
            
            $_SESSION['user_id'] = $user->id;
            $_SESSION['username'] = $user->username;
            $_SESSION['role'] = $user->role;

            
            
            
            header("Location: ../../WhosWatching/profile.html");
            exit;
        } else {
            
            header("Location: ../../LoginForm/metromovies-loginform.html?error=invalid_credentials");
            exit;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - MovieStream</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0d0d0d;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .auth-container {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 8px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }

        .auth-header h1 {
            color: #e50914;
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            color: #aaa;
        }

        .form-group input {
            width: 100%;
            padding: 0.8rem;
            background: #333;
            border: 1px solid #333;
            color: #fff;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form-group input:focus {
            outline: none;
            border-color: #e50914;
        }

        .btn-submit {
            width: 100%;
            padding: 0.8rem;
            background: #e50914;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-submit:hover {
            background: #b2070f;
        }

        .auth-footer {
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #777;
        }

        .auth-footer a {
            color: #fff;
            text-decoration: none;
        }

        .auth-footer a:hover {
            text-decoration: underline;
        }

        .alert {
            padding: 0.8rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.9rem;
        }

        .alert.error {
            background: #e50914;
            color: white;
        }

        .alert.success {
            background: #46d369;
            color: white;
        }
    </style>
</head>

<body>
    <div class="auth-container">
        <div class="auth-header">
            <h1>MovieStream</h1>
        </div>

        <?php if ($message): ?>
            <div class="alert <?php echo $messageType; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn-submit">Sign In</button>
        </form>

        <div class="auth-footer">
            <p>New to MovieStream? <a href="signup.php">Sign up now</a></p>
        </div>
    </div>
</body>

</html>
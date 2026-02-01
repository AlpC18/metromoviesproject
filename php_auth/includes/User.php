<?php
class User
{
    private $conn;
    private $table = 'users';

    
    public $id;
    public $username;
    public $email;
    public $password;
    public $role;

    
    public function __construct($db)
    {
        $this->conn = $db;
    }

    
    public function register($data)
    {
        
        $query = "INSERT INTO " . $this->table . " 
                  (username, email, password, full_name) 
                  VALUES (:username, :email, :password, :full_name)";

        
        $stmt = $this->conn->prepare($query);

        
        $this->username = htmlspecialchars(strip_tags($data['username']));
        $this->email = htmlspecialchars(strip_tags($data['email']));
        $this->password = htmlspecialchars(strip_tags($data['password']));
        $full_name = isset($data['full_name']) ? htmlspecialchars(strip_tags($data['full_name'])) : '';

        
        $password_hashed = password_hash($this->password, PASSWORD_BCRYPT);

        
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $password_hashed);
        $stmt->bindParam(':full_name', $full_name);

        
        try {
            if ($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
        } catch (PDOException $e) {
            error_log("User Registration Error: " . $e->getMessage());
            return false;
        }

        return false;
    }

    
    public function login($email, $password)
    {
        $query = "SELECT id, username, email, password, subscription_type, profile_image
                  FROM " . $this->table . " 
                  WHERE email = :email AND account_status = 'active' LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $hashed_password = $row['password'];

            
            if (password_verify($password, $hashed_password)) {
                
                $this->id = $row['id'];
                $this->username = $row['username'];

                
                $this->updateLastLogin($this->id);

                return [
                    'success' => true,
                    'user' => [
                        'id' => $row['id'],
                        'username' => $row['username'],
                        'email' => $row['email'],
                        'subscription_type' => $row['subscription_type'],
                        'profile_image' => $row['profile_image']
                    ]
                ];
            }
        }

        return ['success' => false, 'message' => 'Invalid email or password'];
    }

    
    private function updateLastLogin($userId)
    {
        $query = "UPDATE " . $this->table . " SET last_login = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        return $stmt->execute();
    }

    
    public function emailExists($email)
    {
        $query = "SELECT id FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }
}
?>
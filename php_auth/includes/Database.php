<?php


require_once 'config.php';

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $charset;
    private $conn;

    public function __construct()
    {
        $this->host = DB_HOST;
        $this->db_name = DB_NAME;
        $this->username = DB_USER;
        $this->password = DB_PASS;
        $this->charset = DB_CHARSET;
    }

    public function connect()
    {
        $this->conn = null;

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_PERSISTENT => false
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);

        } catch (PDOException $e) {
            
            error_log("Database Connection Error: " . $e->getMessage());
            throw new Exception("Database connection failed. Please try again later.");
        }

        return $this->conn;
    }

    public function getConnection()
    {
        return $this->connect();
    }
}
?>
const mysql = require('mysql2');

// Fetching the MySQL connection details from environment variables
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST, // Render's MySQL host URL (provided by Render)
    user: process.env.MYSQL_USER, // Your MySQL username (provided by Render)
    password: process.env.MYSQL_PASSWORD, // Your MySQL password (provided by Render)
    database: process.env.MYSQL_DATABASE, // Your database name (provided by Render)
    port: process.env.MYSQL_PORT || 3306, // Default MySQL port, 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

module.exports = connection;

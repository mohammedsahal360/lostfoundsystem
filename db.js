// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // Use 'localhost' as your host
    user: 'root', // Replace with your MySQL username
    password: 'Sahal@2005', // Replace with your MySQL password
    database: 'lostfoundsystem', // Your database name
    port: 3306, // Default MySQL port
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

module.exports = connection;

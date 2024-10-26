const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('./db'); // Import the MySQL connection

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Serve static files (your React app)
app.use(express.static(path.join(__dirname, 'public')));

// Get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get all items (to display in dropdown)
app.get('/api/items', (req, res) => {
    db.query('SELECT item_name, brand FROM Items WHERE status = "found"', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Return all items and brands
    });
});

// Get random items for verification
app.get('/api/random-items', (req, res) => {
    const query = 'SELECT item_name FROM Items WHERE status = "found" ORDER BY RAND() LIMIT 4'; // Adjust based on your needs
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// POST endpoint for verifying ownership
app.post('/api/verify', (req, res) => {
    const { itemName } = req.body;
    const query = 'SELECT * FROM Items WHERE item_name = ? AND status = "found"';
    
    db.query(query, [itemName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ verified: results.length > 0 }); // Returns true if item exists
    });
});

// POST endpoint for adding a new item
app.post('/api/items', (req, res) => {
    const { name, colour, brand, size, material, status, others, returned } = req.body;
    if (!name || !colour || !brand || !size || !material || !status || !others) {
        console.log("Missing fields:", { name, colour, size, material, status, others });
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const query = 'INSERT INTO Items (item_name, color, brand, size, material, status, other_specifications, returned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, colour, brand, size, material, status, others, returned], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to add item to the database.' });
        }
        res.status(201).json({ message: 'Item added successfully!' });
    });
});

app.get('/api/item', (req, res) => {
    db.query('SELECT item_name, brand FROM Items WHERE status = "found"', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Return all found items with their brands
    });
});

// Fetch brand based on selected item
app.get('/api/brands', (req, res) => {
    const itemName = req.query.item_name; // Get item name from query parameter
    if (!itemName) {
        return res.status(400).json({ error: 'Item name is required' });
    }
    
    db.query('SELECT brand FROM Items WHERE item_name = ?', [itemName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        res.json({ brand: results[0].brand }); // Return the brand of the item
    });
});

app.get('/api/item/:itemName', (req, res) => {
    const itemName = req.params.itemName; // Get item name from URL parameter

    db.query('SELECT * FROM Items WHERE item_name = ?', [itemName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(results[0]); // Return the first item found
    });
});

app.get('/api/materials', (req, res) => {
    db.query('SELECT DISTINCT material FROM Items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Return distinct materials
    });
});

// Get random brands
app.get('/api/random-brands', (req, res) => {
    db.query('SELECT DISTINCT brand FROM Items ORDER BY RAND() LIMIT 3', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results.map(item => item.brand)); // Return an array of brands
    });
});

// Get random materials
app.get('/api/random-materials', (req, res) => {
    db.query('SELECT DISTINCT material FROM Items ORDER BY RAND() LIMIT 3', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results.map(item => item.material)); // Return an array of materials
    });
});

// POST endpoint for verifying ownership
app.post('/api/verify', (req, res) => {
    const { itemName, brand, material } = req.body; // Get item name, brand, and material from the request body
    const query = 'SELECT * FROM Items WHERE item_name = ? AND brand = ? AND material = ? AND status = "found"';
    
    db.query(query, [itemName, brand, material], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ verified: results.length > 0 }); // Returns true only if item, brand, and material match
    });
});

// Add this after your other endpoints in server.js
app.post('/api/login', (req, res) => {
    const { user_id, password } = req.body;
    const query = 'SELECT * FROM Users WHERE user_id = ? AND password = ?';

    db.query(query, [user_id, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});



// Serve the React app for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Adjust if your index.html is in a different location
});

// Start the server
const PORT = process.env.PORT || 3000; // Node.js server on port 3002
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

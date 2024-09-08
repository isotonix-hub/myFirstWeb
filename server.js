const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')))

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public' , 'login.html'))
})

// Create a MySQL connection
const connectMySql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '!@MCGi0702',
    database: 'sqlconnection'
});

connectMySql.connect(err => {
    if (err) {
        console.error("Can't connect to the database:", err);
        return;
    }
    console.log("Connected!");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM adminacount WHERE username = ?';

    connectMySql.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        try {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                res.status(200).json({ message: "Login success" });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Handle form submission
app.post('/form', (req, res) => {
    const { name, middlename, surname, age, birthdate, contactnumber, address, email, gender } = req.body;

    if (name[0] !== name[0].toUpperCase()) {
        return res.status(400).json({ message: "Name: first letter should be capitalized" });
    }

    if (middlename[0] !== middlename[0].toUpperCase()) {
        return res.status(400).json({ message: "Middlename: first letter should be capitalized" });
    }

    if (surname[0] !== surname[0].toUpperCase()) {
        return res.status(400).json({ message: "Surname: first letter should be capitalized" });
    }

    if (address[0] !== address[0].toUpperCase()) {
        return res.status(400).json({ message: "Address: first letter should be capitalized" });
    }

    if (contactnumber.length !== 11) {
        return res.status(400).json({ message: "Contact number: length should be 11" });
    }

    if (isNaN(age) || age <= 15) {
        return res.status(400).json({ message: "Age is not valid" });
    }

    const birthDate = new Date(birthdate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
    }

    if (age != calculatedAge) {
        return res.status(400).json({ message: "Invalid age and birth date" });
    }

    if (gender !== "Male" && gender !== "Female" || gender[0] !== gender[0].toUpperCase()) {
        return res.status(400).json({ message: "Gender must be 'Male' or 'Female' with first letter capitalized" });
    }

    const values = [name, middlename, surname, age, birthdate, contactnumber, address, email, gender];
    const query = 'INSERT INTO drrtinformation (name, middlename, surname, age, birthdate, contactnumber, address, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    connectMySql.execute(query, values, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.status(200).json({ message: "Submit successfully" });
    });
});

// Get data from MySQL
app.get('/data', (req, res) => {
    const query = 'SELECT * FROM drrtinformation';

    connectMySql.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// Delete data
app.post('/delete', (req, res) => {
    const { id } = req.body;

    console.log("Received ID for deletion:", id); // Add this line to log the ID

    const query = 'DELETE FROM drrtinformation WHERE id = ?';

    connectMySql.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        console.log('Delete results:', results); // Add this line to log results
        res.json({ message: 'Delete successfully' });
    });
});

app.post('/update', (req, res) => {
    const { id, name, middlename, surname, age, birthdate, contactnumber, address, email, gender } = req.body;

    // Validate incoming data
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }

    // Prepare the update query and values
    const query = `
        UPDATE drrtinformation
        SET name = ?, middlename = ?, surname = ?, age = ?, birthdate = ?, contactnumber = ?, address = ?, email = ?, gender = ?
        WHERE id = ?
    `;
    const values = [name, middlename, surname, age, birthdate, contactnumber, address, email, gender, id];

    connectMySql.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.status(200).json({ message: 'Update successfully' });
    });
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

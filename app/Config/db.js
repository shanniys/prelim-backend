const mysql = require('mysql2');

const db = mysql.createConnection({
	host: 'sql6.freemysqlhosting.net',
	user: 'sql6686886',
	password: 'jUbeYCEuZ5',
	database: 'sql6686886',
});


db.connect((err) => {

        if (err) {
            console.error('Error connecting to MySQL:', err)
        } else {
            console.log('Connected to MySQL');
        }
});

module.exports = db;
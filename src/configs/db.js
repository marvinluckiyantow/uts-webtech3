require('dotenv').config()
const mysql = require('mysql');

//create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((err) => {
    if(err) console.log(err)
    console.log('Database connected');
});

module.exports = connection;
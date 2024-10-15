const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobRoutes');


const app = express();
const PORT=3000;

app.use(bodyParser.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'pass@word1', 
  database: 'job_portal'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
  });

app.use('/jobs', jobRoutes(db));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


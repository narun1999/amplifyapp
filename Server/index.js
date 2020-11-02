const mysql = require('mysql')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
var cors = require('cors');
const { Redirect } = require('react-router-dom');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'accounts'
});

const app = express()
app.use(cors())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/auth', (req, res) => {

    const username = req.body.username
    const password = req.body.password
    console.log(username, password)
    var sql = "SELECT * FROM accounts WHERE username = ? AND password = ?";
    var inserts = [username,password];
    sql = mysql.format(sql, inserts);
    console.log(sql)
    if (username && password) {
        connection.query(sql, (error, results, fields) => {
            console.log(results)
            if (error) {
                throw error;
            }
            else if(results.length === 1){
                res.send({status: 1}) //'loggined'
            }
            else{
                res.send({status: 2}) //'Incorrect Username and/or Password'
            }
            res.end()
        })
    }
    else {
        res.send({status: 3}) //'Please enter Username ande Password!'
        res.end();
    }

})


const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const mysql = require ('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const passport = require('passport');

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'compsecproj'
});


app.get("/", cors(), async (req, res) =>{
    res.send("This is working")
})

app.post('/verify-token', passport.authenticate('jwt', { session: false }), (req, res) => {
    // User is authenticated, send back user information
    res.json({ user: req.user });
  });

// The sign up part secured
app.post('/signup', async (req, res)=> {
    const { username, email, password, profilePic} = req.body;
    const sql = 'SELECT id FROM accounts WHERE email = ?';

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // why its againt sql injection
    const formattedQuery = mysql.format(sql, [email,hashedPassword]);
    // Log the SQL query with values
    console.log('Executing SQL:', formattedQuery);

    if (!username || !email || !password || !profilePic) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query(sql, [email], (error, results) => {
        if (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal server error.' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        const newUser = {
            _username: username,
            _email: email,
            _password: hashedPassword,
            _profilePic: profilePic,
        };

        db.query('INSERT INTO accounts(username,email,password,profilePic) VALUES(?,?,?,?)', [newUser._username, newUser._email, newUser._password, newUser._profilePic], (error) => {
            if (error) {
              console.error('Error:', error);
              return res.status(500).json({ error: 'Internal server error.' });
            }
      
            // Send a response
            const userData = {
                username,
                email,
                hashedPassword,
                profilePic
            };
            res.json({ message: 'User signed up successfully!' , data:userData});
        });
    });
});

// The login part secured
app.post('/login', async (req,res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM accounts WHERE email = ?';
    

    // why its againt sql injection
    const formattedQuery = mysql.format(sql, [email]);
    // Log the SQL query with values
    console.log('Executing SQL:', formattedQuery);

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query(sql, [email], async (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: req.body.email });
        }

        if(results.length == 0){
            console.error(error)
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        var id = results[0].id;
        var username = results[0].username;
        var email = results[0].email;
        var _password = results[0].password;
        var profilePic = results[0].profilePic;
        var usertype = results[0].usertype;

        //now to compare the passwords

        const passwordMatch = await bcrypt.compare(password, _password);

        if (passwordMatch) {
            const userData = {
                id,
                username,
                email,
                password,
                profilePic,
                usertype
            };
            const token = jwt.sign({ userId: id, username: username, email: email, profilePic: profilePic, usertype: usertype }, 'niggas', { expiresIn: '1m' });
            res.json({ message: 'User logged in successfully!', data:userData ,token:token });
        }else{
            return res.status(401).json({ error: 'Incorrect Password.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Listening at http://localhosty:${port}`)
})
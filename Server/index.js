const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const mysql = require ('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
let userType = ''

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

// The sign up part secured
app.post('/signup', async (req, res)=> {
    const { username, email, password, profilePic} = req.body;
    if (!username || !email || !password || !profilePic) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = 'SELECT id FROM accounts WHERE email = ?';

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // why its againt sql injection
    const formattedQuery = mysql.format(sql, [email,hashedPassword]);
    // Log the SQL query with values
    console.log('Executing SQL:', formattedQuery);

   
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
            _profilePic: JSON.stringify(profilePic),
        };
        console.error(`${newUser._username} ${newUser._email} ${newUser._password} ${newUser._profilePic}`)
        db.query('INSERT INTO accounts(username,email,password,profilePic) VALUES(?,?,?,?)', [newUser._username, newUser._email, newUser._password, newUser._profilePic], (error) => {
        // for manager db.query('INSERT INTO accounts(username,email,password,profilePic,usertype) VALUES(?,?,?,?,?)', [newUser._username, newUser._email, newUser._password, newUser._profilePic,"1"], (error) => {    
       if (error) {
              console.error('Error:', error);
              return res.status(500).json({ error: 'Internal server errorr.' });
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

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = 'SELECT * FROM accounts WHERE email = ?';
    

    // why its againt sql injection
    const formattedQuery = mysql.format(sql, [email]);
    // Log the SQL query with values
    console.log('Executing SQL:', formattedQuery);

   

    db.query(sql, [email], async (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: req.body.email });
        }

        if(results.length === 0){
            console.error(error)
            return res.status(402).json({ error: 'Invalid credentials.' });
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
            if(usertype===null){
                res.json({ message: 'User logged in successfully!', data:userData });
                userType = 'user'
            }
            else{
                res.json({ message: 'Manager logged in successfully!', data:userData });
                userType = 'admin'
            }
        }else{
            return res.status(401).json({ error: 'Incorrect Password.' });
        }
    });
});

// The login part unsecure
app.post('/loginUnsafe', async (req,res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM accounts WHERE email = '${email}'`;
    

    // Log the SQL query with values
    console.log('Executing SQL:', sql);

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query(sql, async (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: req.body.email });
        }

        if(results.length === 0){
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
            res.json({ message: 'User logged in successfully!', data:userData });
        }else{
            return res.status(401).json({ error: 'Incorrect Password.' });
        }
    });
});
app.get('/allusersinfo', async (req, res) => {
    if(userType=='user'){
        res.status(500).json({access: 'Access Denied'})
    }
    else{
            const sql = `SELECT * FROM accounts where usertype is null`;
        
            db.query(sql, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                // Send the results as JSON
                res.json(results);
            }
            });
    }
  });
  app.post('/deleteuser', async (req, res) => {
    const userId = req.body.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required in the request body.' });
  }

  const sql = `DELETE FROM accounts WHERE id = ?`;

  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('Error executing delete query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any rows were affected (indicating a successful deletion)
    if (results.affectedRows > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
    
  });


  app.get('/userinfo/:i', async(req, res) => {
    const userId =  req.params.i;
    console.error(userId)
    if (!userId) {
      return res.json({ success: false });
    }
  
    const sql = 'SELECT * FROM accounts WHERE id = ?';
  
    // Execute the SQL query
    db.query(sql, [userId], (error, results) => {
      if (error) {
        console.error('Error executing SQL query:', error);
        return res.json({ success: false });
      }
  
      if (results.length === 0) {
        console.error('error!')
        return res.json({ success: false });
      }
  
      const userData = results[0];
      userData.success=true
      res.json(userData);
    });
  });

app.listen(port, () => {
    console.log(`Listening at http://localhosty:${port}`)
})
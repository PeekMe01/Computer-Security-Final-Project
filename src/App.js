import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/login/Login'
import Register from './components/register/Register';



function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [user, setUser] = useState({id: null,username: '', email: '', password: '', profilePic: null, usertype: null})
  const [currentScreen, setCurrentScreen] = useState('home');
  //email' or 1=1; drop database compsecproj;

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      // Send the token to the server for verification
      // You can use a function to handle this, such as `getUserInfoFromToken`
      getUserInfoFromToken(token);
    }
  }, []);

  const getUserInfoFromToken = async (token) => {
    try {
      // Make a request to the server to verify the token
      const response = await fetch('http://localhost:4000/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      console.log(response)
      if (response.ok) {
        setUser(await response.json());
        console.log(response.user)
        // Set user info in your component state or global state management
        // This would depend on how you manage state in your application
      } else {
        // Handle error, e.g., token is invalid or expired
        console.error('Token verification failed');
      }
    } catch (error) {
      console.error('Error verifying token:', error.message);
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    const userInfo = { email, password };
    // send the username and password to the server
    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        userInfo
      );
      setUser({
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
        profilePic: userInfo.profilePic,
        usertype: userInfo.usertype,
      })
      alert(response.data.message)
      // Store the token in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id', response.data.data.id);
      console.log(response.data.token)
      setCurrentScreen('home')
      console.log(user.usertype)
    }catch(error){
      alert(error.response.data.error);
    }
  }

  const handleRegister = async e => {
    e.preventDefault();
    const userInfo = { username, email, password, profilePic };
    // send the username and password to the server
    try {
      const response = await axios.post(
        "http://localhost:4000/signup",
        userInfo
      );
      console.log(response);
      setUser({
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
        profilePic: userInfo.profilePic,
        usertype: userInfo.usertype,
      })
      alert(response.data.message)
      setCurrentScreen('home')
      console.log(user.usertype)
    }catch(error){
      alert(error.response.data.error);
    }
  }

  if(currentScreen == 'home'){
    return (
      <div className="App">
        {user.email != '' ? (
        <>
          <p>Welcome back! {user.usertype=='admin'? <p>You are admin!</p>: <p>You are user {user.username}!</p>}</p>
        </>
      ) : (
        <>
        <p>Please log in.</p>
        <button onClick={()=>setCurrentScreen('login')}>Go to Login</button>
        <button onClick={()=>setCurrentScreen('register')}>Go to Register</button>
        </>
      )}
      </div>
    );
  }else{
    if(currentScreen == 'login'){
      return (
        <div className="App">
          {user.usertype}
        <Login handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} setCurrentScreen={setCurrentScreen}></Login>
      </div>
      )
    }else{
      if(currentScreen == 'register'){
        return (
          <div className="App">
            {user.usertype}
          <Register handleRegister={handleRegister} username={username} setUsername={setUsername} email={email} setEmail={setEmail} password={password} setPassword={setPassword} profilePic={profilePic} setProfilePic={setProfilePic} setCurrentScreen={setCurrentScreen}></Register>
        </div>
        )
      }
    }
  }
  
}

export default App;

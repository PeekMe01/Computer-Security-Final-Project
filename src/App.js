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
  const [user, setUser] = useState({id: null,username: '', email: '', password: '', profilePic: '', usertype: ''})
  const [currentScreen, setCurrentScreen] = useState('home');
  const [safeLogin, setSafeLogin]  = useState(true);
  //email' or 1=1; drop database compsecproj;

  useEffect(() => {
    var myItem = localStorage.getItem('userInfo');

    if (myItem !== null) {
      // The item exists, so you can proceed to remove it
      setUser(JSON.parse(localStorage.getItem('userInfo')));
  
      console.log(user)
    } else {
      // The item doesn't exist or has already been removed
      console.log('Item not found in localStorage.');
    }
  }, []);



  const handleLogin = async e => {
    e.preventDefault();
    const userInfo = { email, password };
    // send the username and password to the server
    try {
    const response = await axios.post(
      "http://localhost:4000/login",
       userInfo
    );
    console.log('the id is :' + response.data.data.id)
      setUser({
        id: response.data.data.id,
        username: response.data.data.username,
        email: response.data.data.email,
        password: response.data.data.password,
        profilePic: response.data.data.profilePic,
        usertype: response.data.data.usertype,
    })

    console.log(user)

    var serializedObject = JSON.stringify({
      id: response.data.data.id,
      username: response.data.data.username,
      email: response.data.data.email,
      password: response.data.data.password,
      profilePic: response.data.data.profilePic,
      usertype: response.data.data.usertype,
    });
    // Store the user in local storage
    localStorage.setItem('userInfo', serializedObject);

    setCurrentScreen('home')
    }catch(error){
      alert(error.response.data.error);
    }
  }
  
  const handleLoginUnsafe = async e => {
    e.preventDefault();
    const userInfo = { email, password };
    // send the username and password to the server
    try {
    const response = await axios.post(
      "http://localhost:4000/loginUnsafe",
       userInfo
    );
    console.log('the id is :' + response.data.data.id)
      setUser({
        id: response.data.data.id,
        username: response.data.data.username,
        email: response.data.data.email,
        password: response.data.data.password,
        profilePic: response.data.data.profilePic,
        usertype: response.data.data.usertype,
    })

    console.log(user)

    var serializedObject = JSON.stringify({
      id: response.data.data.id,
      username: response.data.data.username,
      email: response.data.data.email,
      password: response.data.data.password,
      profilePic: response.data.data.profilePic,
      usertype: response.data.data.usertype,
    });
    // Store the user in local storage
    localStorage.setItem('userInfo', serializedObject);

    setCurrentScreen('home')
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
        id: response.data.data.id,
        username: response.data.data.username,
        email: response.data.data.email,
        password: response.data.data.password,
        profilePic: response.data.data.profilePic,
        usertype: response.data.data.usertype,
      })
      alert(response.data.message)
      setCurrentScreen('home')
      console.log(user.usertype)
    }catch(error){
      alert(error.response.data.error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser({
      id: null,
      username: '',
      email: '',
      password: '',
      profilePic: '',
      usertype: '',
    });
  }

  if(currentScreen == 'home'){
    return (
      <div className="App">
        {user.email != '' ? (
        <>
          <p>Welcome back! {user.usertype=='admin'? <p>You are admin!</p>: <p>You are user {user.username}!</p>}</p>
          <button onClick={()=>handleLogout()}>Logout</button>
        </>
      ) : (
        <div style={{ gap: 10, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <p>Please log in.</p>
        <div style={{ gap: 10, display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
          <button onClick={()=>{
              setCurrentScreen('login');
              setSafeLogin(true);
            }}>Go to Login (safe)</button>
          <button onClick={()=>{
              setCurrentScreen('login');
              setSafeLogin(false);
            }}>Go to Login (unsafe)</button>
          <button onClick={()=>setCurrentScreen('register')}>Go to Register</button>
        </div>
        </div>
      )}
      </div>
    );
  }else{
    if(currentScreen == 'login'){
      return (
        <div className="App">
          {safeLogin==true?<Login handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} setCurrentScreen={setCurrentScreen}></Login>:<Login handleLogin={handleLoginUnsafe} email={email} setEmail={setEmail} password={password} setPassword={setPassword} setCurrentScreen={setCurrentScreen}></Login>}
        </div>
      )
    }else{
      if(currentScreen == 'register'){
        return (
          <div className="App">
          <Register handleRegister={handleRegister} username={username} setUsername={setUsername} email={email} setEmail={setEmail} password={password} setPassword={setPassword} profilePic={profilePic} setProfilePic={setProfilePic} setCurrentScreen={setCurrentScreen}></Register>
        </div>
        )
      }
    }
  }
  
}

export default App;

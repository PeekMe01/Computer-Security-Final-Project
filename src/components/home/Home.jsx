import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './homestyle.module.css';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [user,setUser] = useState(null);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
    .then( res => {
      //console.log(res.data)
      if(res.data.valid){
        if(res.data.userType==='user'){
          //console.log(res.data.valid);
          //console.log("profile pic:" + res.data.profilePic)
          setUser({username: res.data.username,userType: res.data.userType, profilePic: res.data.profilePic})
        }else{
          //console.log(res.data.valid);
          setUser({username: res.data.username,userType: res.data.userType})
        }
          
      }else{
        user==null?console.log('user is already null'):window.location.reload();
      }
    }, [user])
    .catch(err => console.log(err))
  }, [user])

  const logout = () => {

    axios.get('http://localhost:4000/logout')
    .then( res => {
      console.log(res)
    })
    .catch(err => console.log(err))
    setUser(null);
    window.location.href = '/';
    return false;
}
 
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Welcome to Home Page:</h1>
      {(!user)&& <>
      <div className={styles.container}>
        <div>
          <input type="button" onClick={() => navigate('/login')} value="Login" />
        </div>
        <div>
          <input type="button" onClick={() => navigate('/register')} value="Register" />
        </div>
      </div>
      <div style={{textAlign:'center'}}>
          <p>PLEASE LOGIN</p>
      </div>
      </>}
      {(user)&&
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h3>WELCOME BACK!</h3>
        {/* {console.log(user)} */}
        <p>username: {user.username}</p>
        <p>user type: {user.userType}</p>
        {/* {user.profilePic ? (
          <img
            src={`data:image/png;base64,${user.profilePic}`}
            alt="Profile"
            style={{ maxWidth: '200px' }}
          />
        ) : (
          <img
            src="path-to-default-image.jpg"
            alt="Default Profile"
            style={{ maxWidth: '200px' }}
          />
        )} */}
        <button onClick={()=>logout()}>Logout</button>
      </div>
      }  
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './homestyle.module.css';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('')

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
    .then( res => {
      //console.log(res)
      if(res.data.valid){
        if(res.data.userType=='user'){
          setName(res.data.username)
        }else{
          navigate('/manager')
        }
          
      }else{
        setName('PLEASE LOGIN')
      }
    })
    .catch(err => console.log(err))
  })
 
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Welcome to Home Page:</h1>
      <div className={styles.container}>
        <div>
          <input type="button" onClick={() => navigate('/login')} value="Login" />
        </div>
        <div>
          <input type="button" onClick={() => navigate('/register')} value="Register" />
        </div>
        <div>
          {name}
        </div>
      </div>
    </div>
  );
};

export default Home;

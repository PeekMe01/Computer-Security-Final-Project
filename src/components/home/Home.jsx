import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './homestyle.module.css';

const Home = () => {
  const navigate = useNavigate();
 
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
      </div>
    </div>
  );
};

export default Home;

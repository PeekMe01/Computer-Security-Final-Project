import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginForm.module.css';
import axios from 'axios'
import { useEffect } from 'react';

const Login=()=> {

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
    .then( res => {
      //console.log(res)
      if(res.data.valid){
        navigate('/');
      }else{
        navigate('/login')
      }
    })
    .catch(err => console.log(err))
  })

  const submit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });
      if(response.data.data.usertype !== null){
        navigate('/manager'); 
      }
      else{

        navigate('/');
    }
    } catch (error) {
      // alert('Error: ' + error.response.data.error);
    }
  };
  return (
    <form onSubmit={submit} className={styles.form}>
    <h1 className={styles.heading}>Login to your account</h1>

    <div className={styles.formDiv}>
      <label htmlFor='email'>Email</label>
      <input type='email' placeholder='Email' name='email' className={styles.input} required />
    </div>

    <div className={styles.formDiv}>
      <label htmlFor='password'>Password</label>
      <input type='password' placeholder='Password' name='password' className={styles.input} required />
    </div>

    <div className={styles.formDiv}>
      <button onClick={() => navigate('/')} className={styles.goBackBtn}>
        Go Back
      </button>
      <input type='submit' value='Submit' className={styles.submitBtn} />
    </div>
  </form>
  
  )
}
export default Login

import React ,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styles from './register.module.css'
const Register=()=> {
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [picture,setPicture]=useState('');
  const navigate = useNavigate();
  const readFileAsBlob = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
  };
  const submit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const profilePicFile = e.target.file.files[0];
    const profilePic = await readFileAsBlob(profilePicFile);
    try {
      const response = await axios.post('http://localhost:4000/signup', {
        username,
        email,
        password,
        profilePic,
      });
      console.log('Signup successful:', response.data);
      navigate('/');
    } catch (error) {
      
      alert('Signup failed: ', error.response.data.error);
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
    <h1 className={styles.heading}>Register an account!</h1>

    <div className={styles.formDiv}>
      <label htmlFor='username'>Username</label>
      <input type='text' placeholder='Username' name='username' value={username} onChange={(e)=>{setUsername(e.value)}} required/>
    </div>

    <div className={styles.formDiv}>
      <label htmlFor='email'>Email</label>
      <input type='email' placeholder='Email' name='email' value={email} onChange={(e)=>{setEmail(e.value)}} required />
    </div>

    <div className={styles.formDiv}>
      <label htmlFor='password'>Password</label>
      <input type='password' placeholder='Password' name='password' value={password} onChange={(e)=>{setPassword(e.value)}}  required/>
    </div>

    <div className={styles.formDiv}>
      <label htmlFor='profilepic'>Upload a profile pic</label>
      <input type='file' placeholder='Profile Pic' name='file' className={styles.fileInput} value={picture} onChange={(e)=>{setPicture(e.value)}} required />
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
export default Register
import React ,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styles from './register.module.css'
const Register=()=> {
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [picture,setPicture]=useState('');
  const[trueimg,settrueimg]=useState('');
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
    let username;
    let email;
    let password;
    let profilePicFile;
    try{
      username = e.target.username.value;
      email = e.target.email.value;
      password = e.target.password.value;
      profilePicFile = e.target.file.files[0];
    }catch(error){
      alert('Kifek')
    }
    
    console.log(profilePicFile)
    if(profilePicFile.name.slice(profilePicFile.name.length -3,profilePicFile.name.length)==='jpg'
    || profilePicFile.name.slice(profilePicFile.name.length -3,profilePicFile.name.length)==='png'){
      settrueimg('');
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
          const err = error.response.data.error
          alert('Signup failed: ' + err);
        }
    }
    else{
      settrueimg('File type error!only jpg or png');
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
      <p style={{color:'red'}}>{trueimg}</p>
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
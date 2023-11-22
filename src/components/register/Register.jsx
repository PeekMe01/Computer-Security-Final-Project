import React from 'react'
import './register.css'

export default function Register({handleRegister,username,setUsername,email,setEmail,password,setPassword,profilePic,setProfilePic,setCurrentScreen}) {
  return (
    <div>
      <form className='registerForm'>
        <div>
          <h1>Register an account!</h1>
          
        </div>
        <div className='formDiv'>
          <label for='username'>Username</label>
          <input onChange={(e)=>setUsername(e.target.value)} id='username' type='text' placeholder='Username'></input>
        </div>

        <div className='formDiv'>
          <label for='email'>Email</label>
          <input onChange={(e)=>setEmail(e.target.value)} id='email' type='text' placeholder='Email'></input>
        </div>

        <div className='formDiv'>
          <label for='password'>Password</label>
          <input onChange={(e)=>setPassword(e.target.value)} id='password' type='password' placeholder='Password'></input>
        </div>

        <div className='formDiv'>
          <label for='profilepic'>Upload a profile pic</label>
          <input onChange={(e)=>setProfilePic(e.target.value)} id='profilepic' type='file' placeholder='Profile Pic'></input>
        </div>

        <div className='formDiv'>
          <button onClick={()=>setCurrentScreen('home')}>Go Back</button>
          <button onClick={(e)=>{
            e.preventDefault();
            handleRegister(e);
          }}>Sign up</button>
        </div>

      </form>
    </div>
  )
}

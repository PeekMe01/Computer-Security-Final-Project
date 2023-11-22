import React from 'react'
import './login.css'

export default function login({handleLogin,email,setEmail,password,setPassword,setCurrentScreen}) {
  return (
    <div>
      <form className='loginForm'>
        <div>
          <h1>Login to your account</h1>
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
          <button onClick={()=>setCurrentScreen('home')}>Go Back</button>
          <button onClick={(e)=>{
            e.preventDefault();
            handleLogin(e);
          }}>Login</button>
        </div>
      </form>
    </div>
  )
}

import React from 'react'
import '../style.scss'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {auth} from '../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {

  const [err,setErr] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      signInWithEmailAndPassword(auth,email,password);
      navigate("/");
    }catch(err){
      setErr(err);
      console.log(err);
    }
  }

  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">My-Chat-App</span>
        <span className='title'>Login</span>
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder='Email-ID'/>
            <input type="password" placeholder='Password'/>
            <button>Sign In</button>
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login

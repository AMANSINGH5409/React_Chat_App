import React from 'react'
import '../style.scss'
import addAvatar from '../img/addAvatar.png'
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore'
import {auth,storage,db} from '../Firebase'
import { useState } from 'react'
import { useNavigate ,Link } from 'react-router-dom';

const Register = () => {

  const [err,setErr] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `profilePhoto/${displayName}`);

      uploadBytesResumable(storageRef, file).then(
        // (error) => {
        //   setErr(true);
        //   console.log(error);
        // }, 
        () =>{
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(storageRef).then( async (downloadURL) => {
            await updateProfile(res.user,{
              displayName,
              photoURL:downloadURL
            });
            await setDoc(doc(db,"users",res.user.uid),{
              uid:res.user.uid,
              displayName,
              email,
              photoURL:downloadURL
            });

            await setDoc(doc(db,"userChats",res.user.uid),{});
            navigate("/");
          });
        }
      );
    }catch(err){
      setErr(err);
      console.log(err);
    }
  }

  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">My-Chat-App</span>
        <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Display Name'/>
            <input type="email" placeholder='Email-ID'/>
            <input type="password" placeholder='Password'/>
            <input style={{display:"none"}} type="file" id='file'/>
            <label htmlFor="file">
                <img src={addAvatar}/>
                <span>Add an Avatar</span>
            </label>
            <button>Sign Up</button>
            {err && <span>Something went wrong !!</span>}
        </form>
        <p>You do have an account? <Link to="/login">Register</Link></p>
      </div>
    </div>
  )
}

export default Register

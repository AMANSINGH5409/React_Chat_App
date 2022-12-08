import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { db } from '../Firebase'
import {AuthContext} from '../context/AuthContext';


const Search = () => {
  const [username,setUsername] = useState("");
  const [user,setUser] = useState(null);
  const [err,setErr] = useState(false);
  const {currentUser} = useContext(AuthContext);

  const handleSearch = async ()=>{
    const q = query(collection(db,"users"),where("displayName","==",username));

    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc)=>{
        setUser(doc.data());
      });
    }catch(error){
      setErr(true);
    }
  }

  const handleKey = e=>{
    e.code === "Enter" && handleSearch(); 
  }

  const handleSelect = async ()=>{
    //Check whether the group(chats in firestore) exist or not

    //Create User Chats
    const combinedID = currentUser.uid > user.uid ? currentUser.uid+user.uid : user.uid+currentUser.uid;
    try{
      const res = getDoc(doc(db,"chats",combinedID));

      if((await res).exists){
        //Create a chats collection
        await setDoc(doc(db,"chats",combinedID),{});

        //create user chats
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [combinedID+".userInfo"]:{
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL
          },
          [combinedID+".date"]:serverTimestamp(),
        });

        await updateDoc(doc(db,"userChats",user.uid),{
          [combinedID+".userInfo"]:{
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL
          },
          [combinedID+".date"]:serverTimestamp(),
        });
      }else{
        console.log("res does not exist !");
      }
    }catch(error){
      console.log(error);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder='find a user' onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)} value={username}/>
      </div>
      {err && <span>User not found !</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL}/>
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search

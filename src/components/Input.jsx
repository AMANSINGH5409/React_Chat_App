import { async } from '@firebase/util'
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { db, storage } from '../Firebase'
import Attach from '../img/attach.png'
import Img from '../img/img.png'
import {v4 as uuid} from "uuid"
import { ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage'

const Input = () => {

  const [text,setText] = useState("");
  const [img,setImg] = useState("");

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async ()=>{
    if(img){
      const storageRef = ref(storage,uuid());

      await uploadBytesResumable(storageRef,img).then(
        // (error) => {
        //   setErr(true);
        //   console.log(error);
        // }, 
        () =>{
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(storageRef).then( async (downloadURL) => {
            await updateDoc(doc(db,"chats",data.chatId),{
              messages: arrayUnion({
                id:uuid(),
                text,
                senderId:currentUser.uid,
                date:Timestamp.now(),
                img:downloadURL,
              }),
            });
          });
        }
      );
    }else{
      await updateDoc(doc(db,"chats",data.chatId),{
        messages: arrayUnion({
          id:uuid(),
          text,
          senderId:currentUser.uid,
          date:Timestamp.now(),
        })
      })
    }

    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp()
    })

    await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp()
    })

    setText("");
    setImg(null);
  }

  return (
    <div className='input'>
      <input type="text" placeholder='Type Something...' onChange={e=>setText(e.target.value)} value={text}/>
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input

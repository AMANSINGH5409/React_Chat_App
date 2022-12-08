import React from 'react'
import Cam from '../img/cam.png'
import Add from '../img/add.png'
import More from '../img/more.png'
import Messages from './Messages'
import Input from './Input'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
  const {data} = useContext(ChatContext);
  return (
    <div className="chats">
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <img src={Cam}/>
          <img src={Add}/>
          <img src={More}/>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chats

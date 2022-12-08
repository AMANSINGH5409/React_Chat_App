import React from 'react'
import Chat from './Chat'
import Navbar from './Navbar'
import Search from './Search'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar/>
      <Search/>
      <Chat/>
    </div>
  )
}

export default Sidebar
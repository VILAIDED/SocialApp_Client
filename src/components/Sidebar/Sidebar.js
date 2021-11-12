import React from 'react'
import "./sidebar.css"
import { useContext } from 'react';
import { SocketContext } from '../../context/roomContext';
const Sidebar = () =>{
    const {user} = useContext(SocketContext)
    return(
        <div className="sidebar" >
        <img className="profileImg" src={user?.avatar} />
        <div>{user?.realname}</div>
        <div>@{user?.username}</div>
    </div>
    )
}
export default Sidebar;
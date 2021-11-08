import React from 'react'
import "./sidebar.css"
const Sidebar = ({user}) =>{
    return(
        <div className="sidebar" >
        <img className="profileImg" src={user?.avatar} />
        <div>{user?.realname}</div>
        <div>@{user?.username}</div>
    </div>
    )
}
export default Sidebar;
import React,{useContext} from 'react'
import { SocketContext } from '../../context/roomContext'
import './usercard.css'
import { Button } from '@mui/material'
const UserCard = ({user})=>{
    const {providerPermisstion} = useContext(SocketContext)
    function handleClick(){
        return providerPermisstion(user.id,"speaker")
    }
    return(
        <div className="userCard">
           <div>    <img className="userImg" key={user?._id} src={user?.avatar} /></div>
              <div> <audio /></div> 
            <div className="username">
                {(user.role == "user" ? <Button onClick={()=>handleClick()}>set Speaker</Button> : <div></div>)}
                {user.username}
            </div>
        </div>
    )
}

export default UserCard;
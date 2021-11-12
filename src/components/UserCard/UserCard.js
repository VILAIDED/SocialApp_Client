import React,{useContext, useRef,useEffect} from 'react'
import { SocketContext } from '../../context/roomContext'
import './usercard.css'
import { Button } from '@mui/material'
const Audio = (peer)=>{
    const ref = useRef();
    useEffect(()=>{
        peer.peer.on("stream",stream =>{
            ref.current.srcObject = stream;
        })
    },[])
    return (
        <audio ref={ref} autoPlay />
    )
}
const UserCard = ({user})=>{
    const {providerPermisstion} = useContext(SocketContext)
    function handleClick(){
        return providerPermisstion(user.id,"speaker")
    }
    return(
        <div className="userCard">
           <div>    <img className="userImg" key={user?.user._id} src={user?.user.avatar} /></div>
              <div> {(user.peer) ? <Audio peer={user?.peer}/> : <div></div> } </div>
            <div className="username">
                {(user.user.role == "user" ? <Button onClick={()=>handleClick()}>set Speaker</Button> : <div></div>)}
                {user.user.username}
            </div>
        </div>
    )
}

export default UserCard;
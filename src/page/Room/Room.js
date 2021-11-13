import React,{useContext,useState,useEffect} from 'react'
import {SocketContext} from "../../context/roomContext"
import {UserData} from '../../DataTest/userData'
import UserCard from '../../components/UserCard/UserCard'
import { useNavigate ,useParams} from 'react-router'
import 'material-icons/iconfont/material-icons.css';
import './room.css'
import { Button } from '@mui/material'
const Room = ()=>{
    const {roomId} = useParams()
    const navigate = useNavigate()
    const {socketRef,users,userOut,speakers,listener,peersRef} = useContext(SocketContext)
    return(
        <div className="main-page">
            <div className="headbar">
            <Button onClick={()=>{
                if(socketRef.current)  socketRef.current.disconnect();
               
                userOut();
                
                navigate(-1)}}>Back</Button>
            <div className="button-container" >
            <div className="button-box">
            <span class="material-icons" >volume_up</span>
            </div>
            <div className="button-box" onClick={()=>console.log("heoo")}>
            <span class="material-icons" >mic</span>
            </div>
            <Button>Leave room</Button>
            </div >
           </div>
           <div className="room-container">
               <div>
               <div>Speaker</div>
               <div className="user-container">
                   {speakers?.map((speaker)=>(
                   <UserCard key={speaker.user.id} user={speaker} role="speaker" />
                   ))}
               </div>
               </div>
               <div>
               <div>listener</div>
               <div className="user-container">
                   {listener.map((speaker)=>(
                   <UserCard key={speaker.user.id} user={speaker} role="user" />
                   ))}
               </div>
           </div>
           </div>
            </div>
    )
}
export default Room;
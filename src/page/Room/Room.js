import React,{useContext,useState,useEffect} from 'react'
import {SocketContext} from "../../context/roomContext"
import {UserData} from '../../DataTest/userData'
import UserCard from '../../components/UserCard/UserCard'
import {RoomService} from '../../service/room.service'
import { useNavigate ,useParams} from 'react-router'
import 'material-icons/iconfont/material-icons.css';
import './room.css'
import { Button } from '@mui/material'
const Room = ()=>{
    const {roomId} = useParams()
    const navigate = useNavigate()
    const {socketRef,roomCur,userOut,speakersRef,speakers,listener,user,muted,joinRoom} = useContext(SocketContext)
    useEffect(()=>{
        if(!user) return
        const getRoom = async ()=>{
            roomCur.current = await RoomService.getRoomById(roomId)
        }       
        getRoom().then(()=>{
            console.log("meow meow")
            joinRoom()
        })
        console.log("user",speakers)
        
    },[user])
    // useEffect(()=>{
        
    // },[speakersRef.current])
    return(
        <div className="main-page">
            <div className="headbar">
            <Button onClick={()=>{
                if(socketRef.current)  socketRef.current.emit("user out");
                userOut();
                navigate(-1)}}>Back</Button>
            <div className="button-container" >
            <div className="button-box">
            <span className="material-icons" >volume_up</span>
            </div>
            <div className="button-box" onClick={()=>muted()}>
            <span className="material-icons" >mic</span>
            </div>
            <Button>Leave room</Button>
            </div >
           </div>
           <div className="room-container">
               <div>
               <div>Speaker</div>
               <div className="user-container">
                   {speakers.map((speaker) => (
                       <UserCard key={speaker.user.id} user={speaker}  peer={speaker?.peer} role="speaker" />
                   ))}
               </div>
               </div>
               <div>
               <div>listener</div>
               <div className="user-container">
                   {listener.map((speaker)=>(
                   <UserCard key={speaker.user.id} peer={speaker?.peer} user={speaker} role="user" />
                   ))}
               </div>
           </div>
           </div>
            </div>
    )
}
export default Room;
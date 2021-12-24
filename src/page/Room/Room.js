import React,{useContext,useState,useEffect} from 'react'
import {SocketContext} from "../../context/roomContext"
import UserCard from '../../components/UserCard/UserCard'
import {RoomService} from '../../service/room.service'
import { useNavigate ,useParams} from 'react-router'
import 'material-icons/iconfont/material-icons.css';
import './room.css'
import { Button } from '@mui/material'
const Room = ()=>{
   
    const {roomId} = useParams()
    const [isAdmin,setIsAdmin] = useState(false);
    const [role,setRole] = useState("user");
    const navigate = useNavigate()
    const {socketRef,roomCur,userOut,speakers,listener,user,muted,joinRoom,micStatus} = useContext(SocketContext)
    function onBackButtonEvent(){
        if(socketRef.current)  socketRef.current.emit("user out");
        userOut();
    }
    window.onpopstate = onBackButtonEvent;
    useEffect(()=>{
      
        if(!user) return
        const getRoom = async ()=>{
            roomCur.current = await RoomService.getRoomById(roomId)
            console.log("id",roomCur.current)
            if(roomCur.current.ownerId._id == user._id){
                setIsAdmin(true);
                setRole("speaker")
            }
            if(roomCur.current.speakers.find(u=> u._id == user._id)){
                setRole("speaker")
            }
        }       
        getRoom().then(()=>{
            console.log("meow meow")
            joinRoom()
        })
        console.log("user",speakers)
        
    },[user])
    return(
        <div className="main-page">
            <div className="headbar">
            <Button style={{color : "#f8f8ff",backgroundColor : "#CD1818"}} onClick={()=>{
                if(socketRef.current)  socketRef.current.emit("user out");
                userOut();
                navigate(-1)}}>Leave room</Button>
     

             <span className='span-topic'>{roomCur.current?.topic}</span>
            <div className="button-container" >
            
            <div className="button-box" onClick={()=>muted()}>
            {role == "speaker" ? <span className="material-icons" >{micStatus ? "mic" : "mic_off"}</span> : <span></span>}
            
            </div>
            
            </div >
           </div>
           <span className='span-r'>room id : </span><span className='span-t'>{roomCur.current?._id}</span>
           <div className="room-container">
               <div>
             
               {/* <div>Speaker</div> */}
               <div className="user-container">
                   {speakers.map((speaker) => (
                       <UserCard key={speaker.user.id} user={speaker.user}  peer={speaker?.peer} role="speaker" />
                   ))}
               </div>
               </div>
               <div>
               <div></div>
               <span className="span-t">Listener</span>
               {listener.length > 0 ? 
               
               <div>
                   
               <div className="user-container">
                   {listener.map((speaker)=>(
                   <UserCard key={speaker.user.id} peer={speaker?.peer} user={speaker.user} isAdmin={isAdmin} role="user" />
                   ))}
               </div>
               </div> :<div></div>}
               
           </div>
           </div>
            </div>
    )
}
export default Room;
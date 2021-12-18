import React, { useEffect ,useState} from "react";
import {useNavigate} from 'react-router-dom'
import { useContext } from "react";
import { RoomService } from "../../service/room.service";
import { SocketContext } from "../../context/roomContext";
import './RoomCard.css'

const RoomCard = ({room}) =>{
    const history = useNavigate();
    const {connectSocket,roomCur} = useContext(SocketContext)
    useEffect(()=>{
      
       
    },[])
    return(
        <div className="cardItem" 
        onClick={()=>{
            history(`/room/${room?._id}`)
            roomCur.current = room; 
        }}
        >
            <div className="avatar" >
                <span className="names">admin</span>
                <img alt={room?.topic} src={process.env.REACT_APP_public + room?.ownerId.avatar}></img>
                <span className="names">{room?.ownerId.username}</span>
            </div>
            <div className="Infomation">
                <div>
                  <div className="topic">
                    {room?.topic}
                  </div>
                  <span className="description-text">
                   {room?.description}
                  </span>
                </div>
                <div className="speakers">
               <span className="speaker-t">speaker</span>
               <span>: {(room?.speakers.slice(0,2).map((s,i)=>(
                  `${s?.username}`  + (i == 1 || room?.speakers.length == 1 ? '' : ', ')
               )))} {(room?.speakers.length > 2) ? '...' : ''}</span>
            </div>
            </div>

            
        </div>
    )
}
export default RoomCard;
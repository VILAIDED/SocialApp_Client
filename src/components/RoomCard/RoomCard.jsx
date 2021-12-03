import React from "react";
import {useNavigate} from 'react-router-dom'
import { useContext } from "react";
import { SocketContext } from "../../context/roomContext";
import './RoomCard.css'
const RoomCard = ({room}) =>{
    const history = useNavigate();
    const {connectSocket,roomCur} = useContext(SocketContext)
    return(
        <div className="cardItem" 
        onClick={()=>{
            history(`/room/${room._id}`)
            roomCur.current = room; 
        }}
        >
            <div className="avatar" >
                <span className="names">admin</span>
                <img alt={room.topic} src={process.env.REACT_APP_public + room.ownerId.avatar}></img>
                <span className="names">{room.ownerId.username}</span>
            </div>
            <div className="Infomation">
                <div>
                  <div className="topic">
                    {room.topic}
                  </div>
                  <div className="description-text">
                   {room.description}
                  </div>
                </div>
                <div className="speakers">
               <span className="speaker-t">speaker</span> : Ning,Cap...
            </div>
            </div>

            
        </div>
    )
}
export default RoomCard;
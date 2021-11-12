import React from "react";
import {useNavigate} from 'react-router-dom'
import { useContext } from "react";
import { SocketContext } from "../../context/roomContext";
import './RoomCard.css'
const RoomCard = ({room}) =>{
    const history = useNavigate();
    const {connectSocket,roomId} = useContext(SocketContext)
    return(
        <div className="cardItem" 
        onClick={()=>{
            history(`/room/${room._id}`)
            roomId.current = room._id;
            connectSocket()
            
        }}
        >
            <div className="avatar" >
                <span className="names">admin</span>
                <img alt={room.topic} src={room.ownerId.avatar}></img>
                <span className="names">{room.ownerId.username}</span>
            </div>
            <div className="Infomation">
                <h3 className="topic">
                    {room.topic}
                </h3>
                <div>
                    {room.description}
                </div>
                <div className="speakers">
                {room.speakers.map((speaker)=>{
                    <span>{speaker.username}</span>
                })}
            </div>
            </div>

            
        </div>
    )
}
export default RoomCard;
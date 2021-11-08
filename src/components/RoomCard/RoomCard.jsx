import React from "react";
import {useNavigate} from 'react-router-dom'
import './RoomCard.css'
const RoomCard = ({room}) =>{
    const history = useNavigate();
    return(
        <div className="cardItem" 
        onClick={()=>{
            history(`/room?id=${room._id}`,{state : "meow"})
        }}
        >
            <div className="avatar" >
                <span className="names">admin</span>
                <img src={room.ownerId.avatar}></img>
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
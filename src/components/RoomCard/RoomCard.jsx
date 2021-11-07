import React from "react";
import {useHistory} from 'react-router-dom'

const RoomCard = ({room}) =>{
    const history = useHistory();
    return(
        <div 
        onClick={()=>{
            history.push(`/room/${room.id}`)
        }}
        ></div>
    )
}
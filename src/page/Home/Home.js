import React, {useContext,useState,useEffect} from 'react'
import { UserService } from '../../service/user.service'
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import RoomCard from '../../components/RoomCard/RoomCard'
import { RoomService } from '../../service/room.service'

import  {SocketContext} from '../../context/roomContext'
import { useNavigate } from 'react-router'
import "./Home.css"

export default function  Home(){
    const {setRoomId,roomCur} = useContext(SocketContext) 
    const navigate = useNavigate();
    const {allRoom} = useContext(SocketContext)
    const [rooms,setRooms] = useState()
    const [state,setState] = useState(true)
   // const [user,setUser] = useState()
    const [open,setOpen] = useState(false);
    const [topic,setTopic] = useState('');
    const [type,setType] = useState('')
    const handleOpen = ()=>{
        setOpen(true)
    }
    const handleClose = ()=>{
        setOpen(false);
    }
    const handleCreateRoom = async ()=>{
        const Created = await RoomService.createRoom(topic,type)
        roomCur.current = Created._id
        navigate(`/room/${Created._id}`);
    }
    // useEffect(()=>{
    //     const getUser = async ()=>{
    //         const user = await UserService.getUser()
    //         const roomData = await RoomService.getAllRoom();
    //         setRooms(roomData.room);
    //        // setUser(user)
    //     }
    //     getUser()
    // },[])
    return(
        <div className="main-page">
        {/* <div className="main-page"> */}
            
        <div className="headbar">
            <span>Room</span>
            <div className="button-container" >
                <Button onClick={handleOpen} >Create room</Button>
            </div>
        </div>
        <div className="card">
            {
                allRoom?.map((room)=>(
                    <RoomCard key={room._id} room={room} />
                   
                ))
            }
        {/* </div> */}
        </div>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create room</DialogTitle>
            <DialogContent>
                <div>
                <TextField autoFocus
                onChange={(e)=> setTopic(e.target.value)}
                id="topic"
                labal = "Topic"
                type="text"
                placeholder="Topic"
                />
                </div>
                <div>
                <TextField autoFocus
                onChange={(e)=> setType(e.target.value)}
                id="type"
                labal = "type"
                type="text"
                placeholder="Type room"
                />
                </div>
                <div>
                    <Button onClick={handleCreateRoom}>Let's go</Button>
                </div>
            </DialogContent>
        </Dialog>
        </div>
    )
}

import React, {useContext,useState,useEffect} from 'react'
import { UserService } from '../service/user.service'
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import RoomCard from '../components/RoomCard/RoomCard'
import { RoomService } from '../service/room.service'
import Sidebar from "../components/Sidebar/Sidebar"
import  {SocketContext} from '../context/roomContext'

import "./Home.css"
export default function  Home(){
    const {user,allRoom} = useContext(SocketContext)
    const [rooms,setRooms] = useState()
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
    }
    useEffect(()=>{
        const getUser = async ()=>{
            const user = await UserService.getUser()
            const roomData = await RoomService.getAllRoom();
            setRooms(roomData.room);
           // setUser(user)
        }
        getUser()
    },[])
    return(
        <div className="container">
        <Sidebar user={user}/>
        <div className="main-page">
        <div className="headbar">
            <span>Room</span>
            <div className="button-container" >
                <button onClick={handleOpen} >Create room</button>
            </div>
        </div>
        <div className="card">
            {
                allRoom?.map((room)=>(
                  <div>
                    <RoomCard key={room.id} room={room} />
                   
                </div>
                ))
            }
        </div>
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

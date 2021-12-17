import React, {useContext,useState,useEffect} from 'react'
import { UserService } from '../../service/user.service'
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import CreateRoomDialog from '../../components/CreateRoomDialog/CreateRoomDialog'
import RoomCard from '../../components/RoomCard/RoomCard'
import { RoomService } from '../../service/room.service'
import  {SocketContext} from '../../context/roomContext'
import ProfileDialog from '../../components/ProfileDialog/ProfileDialog'
import { useNavigate } from 'react-router'
import './main.css'
export default function  Main(){
    const {setRoomId,roomCur,user,getUser} = useContext(SocketContext) 
    const [openPDialog,setOpenPDialog] = useState(false);
    const [openCDialog,setOpenCDialog] = useState(false);
    const [User,setUser]= useState()
    const {allRoom} = useContext(SocketContext)
    const [rooms,setRooms] = useState()
    const [state,setState] = useState(true)
   // const [user,setUser] = useState()
    const [open,setOpen] = useState(false);
    const [topic,setTopic] = useState('');
    const [type,setType] = useState('')
    const handleOpen = ()=>{
        setOpenCDialog(true);
    }
    const handleClose = ()=>{
        setOpen(false);
    }
    
    useEffect(()=>{
        const getUser = async ()=>{
            const user = await UserService.getUser()
            // const roomData = await RoomService.getAllRoom();
            // setRooms(roomData.room);
            setUser(user)
        }
        getUser()
    },[])
    return(
        <div className="main-page">
        {/* <div className="main-page"> */}
            
        <div className="headbar">
            <span className="span-t">Git House</span>
            
              <div className="icon-profile" onClick={()=> setOpenPDialog(true)}>
                <img  src={process.env.REACT_APP_public + user?.avatar} ></img>
            
            </div>
        </div>
        <div className="headbar-1">
        <span className="span-t">Room</span>
        <div>
        <Button onClick={handleOpen} style={{backgroundColor : "#519259",color : "#181D31"}} >Create room</Button>
        </div>
        </div>
        <div className="room-main">
            <span className="span-r">rooms available</span>
        <div className="card">
            {
                allRoom?.map((room)=>(
                    <RoomCard key={room} roomId={room} />
                   
                ))
            }
        {/* </div> */}
        </div>
        </div>
        <ProfileDialog open={openPDialog} user={User} setOpen={setOpenPDialog} getUser={getUser} />
        <CreateRoomDialog open={openCDialog} setOpen={setOpenCDialog} />
        </div>
    )
}

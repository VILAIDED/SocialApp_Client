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
    const history = useNavigate();
    const {setRoomId,roomCur,user,getUser} = useContext(SocketContext) 
    const [openPDialog,setOpenPDialog] = useState(false);
    const [openCDialog,setOpenCDialog] = useState(false);
    const [User,setUser]= useState()
    const {allRoom} = useContext(SocketContext)
    const [rooms,setRooms] = useState([])
    const [suggest,setSuggest] = useState([]);
   // const [user,setUser] = useState()
    const [open,setOpen] = useState(false);
    const handleOpen = ()=>{
        setOpenCDialog(true);
    }
    const handleClose = ()=>{
        setOpen(false);
    }
    function getSuggest(val){
        const all = rooms;
        const sug = all.filter(a => a._id.includes(val) || a.topic.toUpperCase().includes(val.toUpperCase()));
        setSuggest(sug);
        console.log(sug);
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
    useEffect(()=>{
        const getRoom = async ()=>{
            console.log("al",allRoom)
            const data = await RoomService.getRoomsById(allRoom);
            setRooms(data);
            console.log("rooms",data);
        }
        getRoom();
    },[allRoom])
    return(
        <div className="main-page">
        {/* <div className="main-page"> */}
            
        <div className="headbar">
            <span className="span-t">ThanhDed_House</span>
              <div className="icon-profile" onClick={()=> setOpenPDialog(true)}>
                <img  src={process.env.REACT_APP_public + user?.avatar} ></img>
            
            </div>
        </div>
        <div className="headbar-1">
        <span className="span-t">Room</span>
        <div> 
        <TextField 
             onChange={(e)=>{getSuggest(e.target.value)}}
             onBlur={()=>{
                 setTimeout(()=>{
                     setSuggest([])
                 },100)
             }}
             style={{width : '400px'}}
             id="description"
             autoComplete="off"
             fullWidth
             type="text"
             placeholder='search room'
             size='small'
             /> 
        <div  className="suggest-room">{(suggest?.map((s,i)=>(
              <div className="suggest-roomItem" onClick={()=>{
                history(`/room/${s?._id}`)
                roomCur.current = s; 
              }}> 
               <div>{s?.topic}</div>
                <span className='s-description'>{s?.description}</span>
                <div className='bottom-span'>
                    <span className='s-id'>
                    {s._id}   </span>
                    <div className='create-by'>
                    created by  
                    <span className='s-owner'>{s?.ownerId.username}</span> </div>
                </div></div>
            
        )))}
        </div>
        </div>
        
        <div>
        <Button onClick={handleOpen} style={{backgroundColor : "#519259",color : "#181D31"}} >Create room</Button>
        </div>
        </div>
        <div className="room-main">
            <span className="span-r">rooms available</span>
        <div className="card">
            {
                rooms?.map((room)=>(
                    <RoomCard key={room._id} room={room} />
                   
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

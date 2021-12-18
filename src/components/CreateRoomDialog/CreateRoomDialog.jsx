import React, { useEffect, useState } from "react";
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import Box from '@mui/material/Box';
import { useNavigate } from "react-router";
import { UserService } from "../../service/user.service";
import './createRoom.css'
import { RoomService } from "../../service/room.service";
const CreateRoomDialog = ({open,setOpen}) =>{
    const navigate = useNavigate();
    const [topic,setTopic] = useState("");
    const [speaker,setSpeaker] = useState([])
    const [allUser,setAllUser] = useState();
    const [suggest,setSuggest] = useState([])
    const [description,setDescription] = useState("")
    const handleCreateRoom = async ()=>{
        const idSpeakers = speaker.map(a=> a._id)
        const Created = await RoomService.createRoom(topic,description,idSpeakers)
        navigate(`/room/${Created._id}`);
    }
    const handleClose = ()=>{
        setOpen(false);
        setSuggest([])
        setSpeaker([])
    }
    function getSuggest(val){
      const all = allUser;
      const sug = all.filter(a => a.username.includes(val));
      setSuggest(sug);
    }
    function addSpeaker(s){
      const check = speaker.find(u=> u._id == s._id)
      if(check){

      }else{
        setSpeaker(u=>[...u,s])
      }
     
     
    }
    useEffect(()=>{
      const getAllUser = async()=>{
        const data = await UserService.getAllUser();
        setAllUser(data);
      }
      getAllUser();
    },[])

return(
    <Dialog PaperProps={{ sx: { width: "50%", height: "50%" ,borderRadius : 5,backgroundColor : "#f8f8ff"} }}
     open={open} onClose={handleClose} >
           <DialogTitle>Create your rooom</DialogTitle>
           <Box
           noValidate
           component="form"
           sx={{
             display: 'flex',
             flexDirection: 'column',
             m: 'auto',
             width: '60%',

           }}>
           <TextField 
             onChange={(e)=> setTopic(e.target.value)}
             id="topic"
             fullWidth
             type="text"
             autoComplete="off"
             label = "Topic"
             variant="outlined"
             required
             />
             <div>
                 <p></p>
              <TextField 
             onChange={(e)=> setDescription(e.target.value)}
            
             id="description"
             autoComplete="off"
             fullWidth
             type="text"
             label = "Description"
             variant="outlined"
            
             /> 
             </div>
             <div className="sp-title">
               <span>Speaker : </span>
               <span>{speaker.length}</span>
               </div>
             <div className="speaker-add">
               {speaker?.map((s,i)=>(
                 <div key={i} className="added" onClick={()=> setSpeaker(u=> u.filter(p=> p._id !== s._id))}>
                   <span className="sp-text">{s.username}</span>
                   <div className="x-icon">x</div>
                 </div>
               ))}
             </div>
             <div>
                 <p></p>
              <TextField 
             onChange={(e)=> getSuggest(e.target.value)}
             onBlur={()=> {
               setTimeout(()=>{
                setSuggest([])
               },200);
               }}
             autoComplete="off"
             id="description"
             fullWidth
             type="text"
             label = "User"
             variant="outlined"
            
             /> 
             </div>

             <div className="suggest-container">
               {suggest?.map((s,i)=>(
                <div className="suggest-item" onClick={()=> addSpeaker(s)}>
                  <img className="suggest-img" key={s?._id} src={process.env.REACT_APP_public +s?.avatar}  />
                  <div className='suggest-text'>
                   <div>{s?.username}</div>
                   <div>@{s?.realname}</div></div>
                              </div>
               ))}
            </div>

             <div className="btn-create">
                <Button variant="contained" style={{ borderRadius: 30 }} 
                className="btn" onClick={handleCreateRoom} >Let's go</Button>
             </div>
           </Box>
    </Dialog>
         )
         }

export default CreateRoomDialog;
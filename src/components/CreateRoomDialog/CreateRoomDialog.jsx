import React, { useState } from "react";
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import Box from '@mui/material/Box';
import { useNavigate } from "react-router";
import './createRoom.css'
import { RoomService } from "../../service/room.service";
const CreateRoomDialog = ({open,setOpen}) =>{
    const navigate = useNavigate();
    const [topic,setTopic] = useState("");
    const [description,setDescription] = useState("")
    const handleCreateRoom = async ()=>{
        const Created = await RoomService.createRoom(topic,description)
        navigate(`/room/${Created._id}`);
    }
    const handleClose = ()=>{
        setOpen(false);
    }

return(
    <Dialog PaperProps={{ sx: { width: "30%", height: "40%" ,borderRadius : 5,backgroundColor : "#f8f8ff"} }}
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
             label = "Topic"
             variant="outlined"
             required
             />
             <div>
                 <p></p>
              <TextField 
             onChange={(e)=> setDescription(e.target.value)}
             id="description"
             fullWidth
             type="text"
             label = "Description"
             variant="outlined"
             required
             /> 
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
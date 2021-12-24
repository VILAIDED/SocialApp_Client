import React,{useEffect, useState,useRef} from 'react'
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import './profileDialog.css'
import Box from '@mui/material/Box';
import useToken from '../../useToken';
import { UserService } from "../../service/user.service";

const CustomTextField = ({id,type,setValue,value,label})=>{
    return(
        <div>
        <p></p>
        <TextField 
             onChange={(e)=> setValue(e.target.value)}
             id={id}
             value={value}
             fullWidth
             type={type}
             label = {label}
             variant="outlined"
             required
             />
             </div>
    )
}
const ProfileDialog = ({user,open,setOpen,getUser})=>{
    const { logout } = useToken()
    const [username,setUsername] = useState(user?.username)
    const [realname,setRealname] = useState(user?.realname)
    const [imgP,setImgP] = useState("");
    const [file,setFile] = useState(null);
    const inputFile =useRef(null);
    useEffect(()=>{
        
        setUsername(user?.username)
        setRealname(user?.realname);
        setImgP(process.env.REACT_APP_public + user?.avatar);
    },[user])
    // useEffect(()=>{
    //     getUser()
    // },[])
    const handleClose = ()=>{
        setImgP(process.env.REACT_APP_public + user?.avatar);
        setOpen(false);
    }
    const handleLogout = ()=>{
        logout();
        window.location.reload();
    }
    const handleChoseImage = (event)=>{
        setImgP(URL.createObjectURL(event.target.files[0]))
        setFile(event.target.files[0]);
    }
    const handleSave = async ()=>{
        var check = false;
        if(file != null){
            await UserService.UploadProfile(file);
            check = true
        }
        if(username !== user?.username || realname !== user?.realname){
            await UserService.profileUpdate(username,realname)
            check = true;
        }
        if(check){
            getUser();
        }
        setOpen(false);
    }
    return(
        <Dialog PaperProps={{ sx: { width: "40%", height: "80%" ,borderRadius : 5} }}
         open={open} onClose={handleClose} >
            <DialogTitle>
                <div className="profile-header">
                    <span>Profile</span>
                    <Button variant="contained" style={{ borderRadius: 10 ,backgroundColor :"black" }} 
             className="btn-save"  onClick={handleSave}>Save</Button>
                </div>
            </DialogTitle>
            <DialogContent>
            <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '60%',

            }}>
            <div className="img-profile">
                <img src={imgP} onClick={()=> inputFile.current.click()} />
            </div>
            <input type="file" ref={inputFile} hidden onChange={handleChoseImage}/>
             <CustomTextField  id="username" type="text" setValue={setUsername} value={username} label="User name" />
             <CustomTextField  id="realname" type="text" setValue={setRealname} value={realname} label="Real name"/>
             <div className="btn-logout">
             <Button variant="contained" onClick={handleLogout} style={{ minWidth: '200px',borderRadius: 30 ,backgroundColor :"#CD1818",color : "#f8f8ff" }}>Logout</Button>
             </div>
             </Box>
            
             </DialogContent>
        </Dialog>
    )
}

export default ProfileDialog;
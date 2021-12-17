import React,{useState} from "react";
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import "./loginDialog.css"
import { margin } from "@mui/system";
import Box from '@mui/material/Box';
import { UserService } from "../../service/user.service";
const CustomTextField = ({placeholder,id,type,onChange})=>{
    
    return(
        <div>
        <p></p>
        <TextField 
             onChange={(e)=> onChange(e.target.value)}
             id={id}
             fullWidth
             type={type}
             variant="outlined"
             required
             placeholder={placeholder}
             />
             </div>
    )
}
const LoginDialog = ({open,setOpen,setToken})=>{
    const [username,setUsername]= useState("");
    const [password,setPassword] = useState("");
    const handleClose = ()=>{
        setOpen(false);
    }
    const handleLogin = async ()=>{
        console.log("username",username);
        console.log("password",password);
        const token = await UserService.Login(username,password);
        if(token){
            setToken(token);
            window.location.reload();
        }
    }
    return (
        <Dialog PaperProps={{ sx: { width: "40%", height: "50%" ,borderRadius : 5} }}
         open={open} onClose={handleClose} >
            <DialogTitle>Login to Githouse</DialogTitle>
            <DialogContent>
            <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '60%',

            }}
          >
            {/* <div className="login-dialog"> */}
             <CustomTextField onChange={setUsername} id="username" type="text" placeholder="username"/>
             <CustomTextField onChange={setPassword} id="password" type="password" placeholder="password"/>
             <div className="btn-login">
             <Button variant="contained" style={{ borderRadius: 30 }} 
             className="btn" onClick={handleLogin} >Login</Button>
             </div>
             <div className="or-text">or</div>
             <div className="no-account">
                 <span className="or-text">
Don't have an account? </span>
                 <span className="sign-up" onClick={handleClose}>sign up</span>
             </div>
             {/* </div> */}
             </Box>
            
             </DialogContent>
        </Dialog>
    )
}

export default LoginDialog;

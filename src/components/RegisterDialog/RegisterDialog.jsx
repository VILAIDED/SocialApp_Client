import React,{useState} from "react";
import {Dialog,DialogActions,DialogContent,DialogTitle, TextField,Button} from '@mui/material'
import "./registerDialog.css"
import { margin } from "@mui/system";
import Box from '@mui/material/Box';
import { UserService } from "../../service/user.service";
const CustomTextField = ({placeholder,id,type,onChange})=>{
    
    return(
        <div>
        <p></p>
        <TextField 
             onChange={onChange(id)}
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
const RegisterDialog = ({open,setOpen,setToken})=>{
    const [values,setValues] = useState({
        username : "",
        realname : "",
        password : "",
        confirmPW : "",
        showPW : false,
        showCPW : false
    });
    const handleChange = (prop)=> (event)=>{
        setValues({...values, [prop] : event.target.value});
    }
    const handleClose = ()=>{
        setOpen(false);
    }
    const handleRegister = async ()=>{
        if(values.password == values.confirmPW){
           const status =  await UserService.Register(values);
           if(status == 200){
            const token = await UserService.Login(values.username,values.password);
            setToken(token);
           }
        }
       
    }
    return (
        <Dialog PaperProps={{ sx: { width: "40%", height: "60%" ,borderRadius : 5} }}
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
             <CustomTextField onChange={handleChange} id="username" type="text" placeholder="username"/>
             <CustomTextField onChange={handleChange} id="realname" type="text" placeholder="realname"/>
             <CustomTextField onChange={handleChange} id="password" type="password" placeholder="password"/>
             <CustomTextField onChange={handleChange} id="confirmPW" type="password" placeholder="confirm password"/>
             <div className="btn-login">
             <Button variant="contained" style={{ borderRadius: 30 }} 
             className="btn" onClick={handleRegister} >Register</Button>
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

export default RegisterDialog;

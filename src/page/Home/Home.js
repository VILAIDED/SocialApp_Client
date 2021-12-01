import { Button } from "@mui/material";
import React,{useState} from "react";
import './home.css'
import LoginDiaLog from "../../components/LoginDialog/LoginDialog";
import RegisterDialog from "../../components/RegisterDialog/RegisterDialog"
const Home = ({setToken})=>{
    const [openLDialog,setOpenLDialog] = useState(false)
    const [openSDialog,setOpenSDialog] = useState(false);
    return(
        <div className="home-container">
            <div className="home-cover">
                <img className="home-logo" src={process.env.PUBLIC_URL + "/logo-vertical.jpg"} alt="logo-home" />
            </div>
            <div className="home-content">  
                <h1>Happening now</h1>
                <h3>Join with us Today</h3>
                <div className="btn-user">
                  <div className="btn-item">
                    <div className="span-text">
                       <span>You are new in GitHouse</span>
                    </div>
                       <Button variant="contained" onClick={()=>setOpenSDialog(true)} style={{ borderRadius: 30 }} className="btn">Sign up</Button>
                    </div>
                    <div className="or-text">or</div>
                    <div className="btn-item">
                        <div className="span-text">
                           <span>Already have an account?</span>
                        </div>
                           <Button onClick={()=> setOpenLDialog(true)} variant="outlined" style={{ borderRadius: 30 }} className="btn">Sign in</Button>
                    </div>
                </div>
               
            </div>
            <LoginDiaLog open={openLDialog} setOpen={setOpenLDialog} setToken={setToken}/>
            <RegisterDialog open={openSDialog} setOpen={setOpenSDialog} setToken={setToken} />
        </div>
    )
}
export default Home;
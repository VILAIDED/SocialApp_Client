import React,{useContext, useRef,useEffect, useState} from 'react'
import { SocketContext } from '../../context/roomContext'
import { UserService } from '../../service/user.service'
import './usercard.css'
import { Button } from '@mui/material'
import 'material-icons/iconfont/material-icons.css';
const Audio = ({peer,setBorderT,setMuted})=>{
    const analyser = useRef(null)
    const dataArray = useRef(null);
    const ref = useRef()
    useEffect(()=>{
        if(peer){
        peer.on("stream",stream=>{
           ref.current.srcObject = stream
           const audioContext = new AudioContext();
           const soure = audioContext.createMediaStreamSource(stream)
           analyser.current = audioContext.createAnalyser();
           analyser.current.fftSize = 2048;
           var bufferLength = analyser.current.frequencyBinCount;
           dataArray.current = new Uint8Array(bufferLength);
           analyser.current.getByteTimeDomainData(dataArray.current);
           soure.connect(analyser.current)
           analyser.current.getByteTimeDomainData(dataArray.current);
           peer.on('data',data=>{
            const check = new TextDecoder().decode(data)
            if(check == "on"){
                setMuted(false)
            }else{
                setMuted(true)
            }
           })
       })
    //    peer.on('data',data=>{
    //        const check = new TextDecoder().decode(data)
    //        console.log("c",check)
    //        if(check == 'true') setMuted(false)
    //        else 
           
    //    })
       peer.on("track",(track,stream)=>{
        track.addEventListener("mute",()=>{
           console.log("hey")
        })
        console.log("track",track)
          
       })
       const item = setInterval(() => {
        if(analyser.current){
            analyser.current.getByteTimeDomainData(dataArray.current);
            const sum = dataArray.current.reduce((a, b) => a + b)
            //console.log(sum/1024)
            if((sum/1024) < 127.95){
               setBorderT(true)
            }else{
                setBorderT(false)
            }
        }
      }, 1500);
      return ()=> clearInterval(item)
        }
    },[])
    return (
        <div>
            <audio ref={ref} autoPlay />
        </div>
       
    )
}
const UserCard = ({user,peer,role,isAdmin})=>{
    const [borderT,setBorderT] = useState(false);
    const [muted,setMuted] = useState(false);
    const {providerPermisstion} = useContext(SocketContext)
    const [User,setUser] = useState();
    async function handleClick(){
        return await providerPermisstion(user.id,"speaker")
    }
    useEffect(()=>{
        const getUser = async ()=>{
            const data = await UserService.getUserById(user.id);
            setUser(data);
        }
       
        getUser();
        console.log(User)
    },[])
  
    return(
        <div className="userCard" >
            <div className="img-container">
            <div className="popup-container">
                <div className="popup-info">
                   <img className="popup-img" key={user?._id} src={process.env.REACT_APP_public +user?.avatar}  />
                   <div className='text-info'>
                       <div>{User?.username}</div>
                       <div>@{User?.realname}</div></div>
                </div>
                <div className="btn-speaker">
                {(isAdmin) ?
                <Button style={{color : "#181D31",backgroundColor : "#E6DDC4"}} 
            onClick={(role == "user" && isAdmin) ? handleClick: ()=>{} }>{(role == "user") ? "Set as Speaker" : "Speaker"}</Button> : <div></div>}
                </div>
                
                
            </div>
            <img className="userImg" key={user?._id} src={process.env.REACT_APP_public +user?.avatar} style={{boxShadow : borderT ? "0 0 2px 8px #464646ba" : ""}} />
            
            </div>
             
              <div className="audio"> {(peer) ? <Audio peer={peer} setMuted={setMuted} setBorderT={setBorderT}/> : <div></div>}  </div>
            <div className="username">
               <span className='span-t'>{user?.username}</span> 
               {(user?.username == "You" || role == "user" ? <div></div> : <div className="mic-icon"><span className="material-icons" >{muted ? "mic_off" : "mic"}</span></div> ) }
            </div>
        </div>
    )
}

export default UserCard;
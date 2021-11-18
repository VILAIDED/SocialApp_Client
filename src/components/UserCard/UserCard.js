import React,{useContext, useRef,useEffect, useState} from 'react'
import { SocketContext } from '../../context/roomContext'
import './usercard.css'
import { Button } from '@mui/material'
const Audio = ({peer,setBorderT})=>{
    const analyser = useRef(null)
    const dataArray = useRef(null);
    const ref = useRef()
    useEffect(()=>{
        console.log("test so")
        if(peer){
        peer.on("stream",stream=>{ 
             
            console.log("has stream",stream)

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
    function handleClick1(){
        console.log("meow",peer)
        if(peer){
        peer.on("stream",(stream)=>{  
            console.log("has stream")
        })
    }
    }
    return (
        <div>
            <audio ref={ref} autoPlay />
        </div>
       
    )
}
const UserCard = ({user,peer,role})=>{
    const [borderT,setBorderT] = useState(false);
    const {providerPermisstion} = useContext(SocketContext)
    async function handleClick(){
        return await providerPermisstion(user.user.id,"speaker")
    }
  
    return(
        <div className="userCard" >
           <div>    <img className="userImg" key={user?.user._id} src={user?.user.avatar} style={{border : borderT ? "10px solid #20bd5f" : ''}} /></div>
              <div className="audio"> {(user.peer) ? <Audio peer={peer} setBorderT={setBorderT}/> : <div></div>}  </div>
            <div className="username">
                {(role == "user") ? <Button onClick={()=>handleClick()}>set Speaker</Button> : <div></div>}
                
                {user.user.username}
            </div>
        </div>
    )
}

export default UserCard;
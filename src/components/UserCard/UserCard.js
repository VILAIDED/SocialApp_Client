import React,{useContext, useRef,useEffect} from 'react'
import { SocketContext } from '../../context/roomContext'
import './usercard.css'
import { Button } from '@mui/material'
const Audio = (peer)=>{
    const analyser = useRef(null)
    const dataArray = useRef(null);
    const ref = useRef()
        // useEffect(()=>{
        //     const audioContext = new AudioContext();
        //     let newAnalyser
        // })
    
    useEffect(()=>{
        peer.peer.on("stream",stream=>{
           ref.current.srcObject = stream   
           const audioContext = new AudioContext();
           const soure = audioContext.createMediaStreamSource(stream)
           analyser.current = audioContext.createAnalyser();
           analyser.current.fftSize = 2048;
           var bufferLength = analyser.current.frequencyBinCount;
           dataArray.current = new Uint8Array(bufferLength);
           analyser.current.getByteTimeDomainData(dataArray.current);
           console.log("first",dataArray.current)
           soure.connect(analyser.current)
           analyser.current.getByteTimeDomainData(dataArray.current);
           console.log("second",dataArray.current)
         
           
       })
       setInterval(() => {
        if(analyser.current){
            analyser.current.getByteTimeDomainData(dataArray.current);
            const sum = dataArray.current.reduce((a, b) => a + b)
            console.log(sum/1024)
            if((sum/1024) < 127.95){
                console.log("speech")
            }else{
                console.log("slient")
            }
        }
      }, 3000);
    },[])
   
    useEffect(()=>{
        setTimeout(() => {
            
          }, 100)
    },[])
    return (
        <audio ref={ref} autoPlay />
    )
}
const UserCard = ({user,role})=>{
    const {providerPermisstion} = useContext(SocketContext)
    function handleClick(){
        return providerPermisstion(user.user.id,"speaker")
    }
    return(
        <div className="userCard">
           <div>    <img className="userImg" key={user?.user._id} src={user?.user.avatar} /></div>
              <div> {(user.peer) ? <Audio peer={user?.peer}/> : <div></div> } </div>
            <div className="username">
                {(role == "user" ? <Button onClick={()=>handleClick()}>set Speaker</Button> : <div></div>)}
                {user.user.username}
            </div>
        </div>
    )
}

export default UserCard;
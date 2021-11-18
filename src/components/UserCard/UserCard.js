import React,{useContext, useRef,useEffect} from 'react'
import { SocketContext } from '../../context/roomContext'
import './usercard.css'
import { Button } from '@mui/material'
const Audio = ({peer})=>{
    const analyser = useRef(null)
    const dataArray = useRef(null);
    const ref = useRef()
        // useEffect(()=>{
        //     const audioContext = new AudioContext();
        //     let newAnalyser
        // })
    
    useEffect(()=>{
        console.log("test so")
        if(peer){
    //    console.log(peer._remoteTracks[0].stream)
        peer.on("stream",stream=>{ 
             
            console.log("has stream",stream)
        //    const stream = peer._remoteStreams[0]
          
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
    //    setInterval(() => {
    //     if(analyser.current){
    //         analyser.current.getByteTimeDomainData(dataArray.current);
    //         const sum = dataArray.current.reduce((a, b) => a + b)
    //         //console.log(sum/1024)
    //         if((sum/1024) < 127.95){
    //             console.log("speech")
    //         }else{
    //             console.log("slient")
    //         }
    //     }
    //   }, 3000);
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
    useEffect(()=>{
        setTimeout(() => {
            
          }, 100)
    },[])
    return (
        <div>
            <Button onClick={()=>handleClick1()}>set Speaker</Button>
            <audio ref={ref} autoPlay />
        </div>
       
    )
}
const UserCard = ({user,peer})=>{
    const {providerPermisstion} = useContext(SocketContext)
    useEffect(()=>{
        console.log("peer",peer);
        if(peer){
            peer.on("stream",stream=>{
                console.log("peer connected")
            })
        }
    },[])
    
    function handleClick(){
        return providerPermisstion(user.user.id,"speaker")
    }
  
    return(
        <div className="userCard">
           <div>    <img className="userImg" key={user?.user._id} src={user?.user.avatar} /></div>
              <div className="audio"> {(user.peer) ? <Audio peer={peer}/> : <div></div>}  </div>
            <div className="username">
                {/* {(role == "user" ? <Button onClick={()=>handleClick()}>set Speaker</Button> : <div></div>)} */}
                
                {user.user.username}
            </div>
        </div>
    )
}

export default UserCard;
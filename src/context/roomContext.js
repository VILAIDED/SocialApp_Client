import React, {createContext,useState,useRef,useEffect} from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import { UserService } from '../service/user.service';
import { RoomService } from '../service/room.service';

const SocketContext  = createContext();

const ContextProvider = ({children}) =>{
    const [stream,setStream] = useState();
    const [users,setUsers] = useState([])
    const [micStatus,setMicStatus] = useState()
    const [speakers,setSpeakers] = useState([])
    const [listener,setListener] = useState([])
    const [user,setUser] = useState()
    const socketRef = useRef()
    const peersRef = useRef([])
    const roomCur = useRef()
    const speakerRef = useRef([])
    const listenerRef = useRef([])
    const [allRoom,setAllRoom] = useState([])
    
    
    const getUser = async ()=>{
        const user = await UserService.getUser()
        setUser(user)
    }

     useEffect(()=>{

        getUser()
        socketRef.current = io.connect("https://pbl4t.herokuapp.com/")
        socketRef.current.on("connect",()=>{
            socketRef.current.emit("get room")
            socketRef.current.on('get room',data=>{
                setAllRoom(data);
                console.log(data);
            })
        })
        return ()=> socketRef.current.disconnect()
     },[])
    useEffect(()=>{
            if(socketRef.current == null || !user) return
            
            socketRef.current.on("role change",(data)=>{  
                RoomService.getRoomById(roomCur.current._id).then(room=>{
                    roomCur.current = room
                })
                
            })
            socketRef.current.on("role changee",(data)=>{ 
                window.location.reload();
            });
            socketRef.current.on("all users",data =>{
                const users = data.users
                const peers = []
                const Speakers = [];
                const Listener = []
                users.forEach(User => {
                    var peer;
                    if(User.id != user._id){
                    const peerNew = createPeer(User.socketId,socketRef.current.id,stream)
                    peer = peerNew
                    }else{
                        User.username = "You"
                    }
                    const peerObj = {
                        peer,
                        user : User
                    }
                    peersRef.current.push(peerObj);
                    peers.push(peerObj)
                    if(roomCur.current.speakers.find(s=> s._id == User.id) 
                     || roomCur.current.ownerId._id == User.id){
                        Speakers.push(peerObj)
                    }else{
                        Listener.push(peerObj)
                    }
                });
                setSpeakers(Speakers)
                setListener(Listener)
                setUsers(peersRef.current)
             
            })
            socketRef.current.on('user joined', payload=>{
                console.log("im join",payload);
                const peer = addPeer(payload.signal,payload.caller.socketId)
                const peerObj = {
                    user : payload.caller,
                    peer : peer
                }
                
                peersRef.current.push(peerObj)
                const newUserPeer = peersRef.current
                if(roomCur.current.speakers.find(s=> s._id == payload.caller.id) 
                || roomCur.current.ownerId._id == payload.caller.id){
                setSpeakers(s=>[...s,peerObj])
                }else{
                setListener(l=>[...l,peerObj])
                }
                setUsers([...newUserPeer])
            })
            socketRef.current.on('receiving returned signal', payload => {
                const item = peersRef.current.find(p=> p.user.socketId === payload.id);
                item.peer.signal(payload.signal)
            })
            socketRef.current.on('user out',data=>{
                const outUser = peersRef.current.find(p => p.user.socketId == data.id);
                
                if(outUser){
                    outUser.peer.destroy();
                }
                const newPeer = peersRef.current.filter(p=>p.user.socketId != data.id);
                peersRef.current = newPeer;
                const newUserPeer = peersRef.current
                setUsers([...newUserPeer])
                    
                let clone = [...speakers]
                    setSpeakers(speakers=> speakers.filter(s=> s.user.socketId !== data.id))
                    console.log("clone",clone)
                    setListener(listener => listener.filter(s=> s.user.socketId !== data.id))
                
            })
        
        
    },[stream])
    function userOut(){
        console.log("stream",stream)
        if(stream.getTracks){
        stream.getTracks().forEach(function(track) {
            track.stop();
          });
        }
        socketRef.current.removeAllListeners();
        peersRef.current = []
    
        setUsers([])
        setSpeakers([])
        speakerRef.current = []
        setListener([])
        listenerRef.current = []

    }
    function joinRoom(){
        console.log("hello im join")
        navigator.mediaDevices.getUserMedia({audio : true}).then(stream=>{
            setStream(stream)
            setMicStatus(true);
            socketRef.current.emit('join room',{roomId : roomCur.current._id,user : {
                username : user?.username,
                avatar : user?.avatar,
                userId : user?._id}
            });

            if(!roomCur.current.speakers.find(s=> s._id == user._id) && !(roomCur.current.ownerId._id == user._id)){
                const track = stream.getAudioTracks()[0];
                track.enabled = false
                console.log("auto mute")
            }
        })
    
        
    }
    function createPeer(userToSignal, callerId,streamm){
        console.log("stream create",stream)
        const peer = new Peer({
            config : { iceServers:[{ urls: "stun:stun.l.google.com:19302",urls : "stun:stun.nextcloud.com:443"},{urls : "stun:relay.webwormhole.io"}]},
            initiator : true,
            trickle : false,
            stream
        })
        peer.on('signal',signal=>{
            socketRef.current.emit('sending signal', {userToSignal,callerId : callerId,
            roomId : roomCur.current._id,signal})
        })
        return peer;
    }

    function addPeer(incommingSignal,callerId){
        const peer = new Peer({
            config : { iceServers:[{   urls: "stun:stun.l.google.com:19302",urls : "stun:stun.nextcloud.com:443"},{urls : "stun:relay.webwormhole.io"}]},
            initiator : false,
            trickle : false,
            stream
        })
       
        peer.on("signal",signal=>{
            socketRef.current.emit("returning signal", {signal,callerId})
            
        })
        peer.on('connect',()=>{
            const status = stream.getAudioTracks()[0].enabled ? "on" : "off";
            console.log("status",status)
            peer.send(status)
        })

        peer.signal(incommingSignal)
        
        return peer
    }
    function muted(){
        console.log(stream)
        const track = stream.getAudioTracks()[0];
        track.enabled = !track.enabled
        const dP = peersRef.current;
        setMicStatus(track.enabled);
        const status = track.enabled ? "on" : "off";
        console.log("oe",dP)
        dP.forEach(p =>{
            if(p.peer){
            p.peer.send(status);
            
            }
        })
       
    }
    async function  providerPermisstion(id,role){
        await RoomService.setSpeakers(roomCur.current._id,id)
        return  socketRef.current.emit("change role", { roomId: roomCur.current._id, role: role, userId: id })
    }

    return(
        <SocketContext.Provider value={{
            muted,
            stream,
            peersRef,
            users,
            user,
            allRoom,
            roomCur,
            socketRef,
            speakers,
            listener,
            getUser,
            providerPermisstion,
            userOut,
            micStatus,
            // setRoomId,
            joinRoom
        }} >
            {children}
        </SocketContext.Provider>
    )
 }

 export {ContextProvider,SocketContext}
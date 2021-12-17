import React, {createContext,useState,useRef,useEffect} from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import { UserService } from '../service/user.service';
import { RoomService } from '../service/room.service';

const SocketContext  = createContext();

const ContextProvider = ({children}) =>{
    const [stream,setStream] = useState();
    const [peers,setPeers] = useState([])
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
    const getAllRoom = async ()=>{
        const roomData = await RoomService.getAllRoom();
        setAllRoom(roomData.room);
        
    }
     useEffect(()=>{
        
        getAllRoom()
        getUser()
        socketRef.current = io.connect("http://localhost:9000")
        return ()=> socketRef.current.disconnect()
     },[])
    //  useEffect(()=>{
    //    loadUser()
    // },[users])
    // useEffect(()=>{
    //     setSpeakers(speakerRef.current)
    // },[speakerRef.current])
    useEffect(()=>{
            if(socketRef.current == null || !user) return
            socketRef.current.on("role change",(data)=>{  
                RoomService.getRoomById(roomCur.current._id).then(room=>{
                    roomCur.current = room
                    // console.log(roomCur.current)
                    // if(data.role == "speaker"){
                    //     // const userChange = peersRef.current.
                    //     const test = peersRef.current
                    //     const userChange = test.find(l=> l.user.id == data.id)
                    //     setListener(listener=> listener.filter(l => l.user.id != data.id));
                    //     setSpeakers(speakers=> [...speakers,userChange])
                    // }
                })
                
            })
            socketRef.current.on("role changee",(data)=>{ 
                window.location.reload();
            });
            // socketRef.current.on("get room",allRoom=>{
            //     setAllRoom(allRoom);
            // })
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
                setPeers(peers)
            })
            // socketRef.current.on("role changed",role=>{
            //     setRole(role)
            // })
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
               // speakerRef.current.push(peerObj)
                }else{
                setListener(l=>[...l,peerObj])
                   // listenerRef.current.push(peerObj)
                }
                // setListener(listenerRef.current)
                // setSpeakers(speakerRef.current)
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
                    
                let clone = [...speakers]//speakerRef.current = speakerRef.current.filter(s=> s.user.socketId !== data.id)
                    setSpeakers(speakers=> speakers.filter(s=> s.user.socketId !== data.id))
                    console.log("clone",clone)
                    //listenerRef.current = listenerRef.current.filter(s=> s.user.socketId !== data.id)
                    setListener(listener => listener.filter(s=> s.user.socketId !== data.id))
                
                // const newUsers = user
                // setUsers(newUsers);
                // setPeers(peers);
            })
        
        
    },[stream])
    function userOut(){
        console.log("stream",stream)
        stream.getTracks().forEach(function(track) {
            track.stop();
          });
        socketRef.current.removeAllListeners();
        peersRef.current = []
        setPeers([])
        setUsers([])
        setSpeakers([])
        speakerRef.current = []
        setListener([])
        listenerRef.current = []

    }
    function joinRoom(){
        navigator.mediaDevices.getUserMedia({audio : true}).then(stream=>{
            setStream(stream)
            setMicStatus(true);
            socketRef.current.emit('join room',{roomId : roomCur.current._id,user : {
                username : user?.username,
                avatar : user?.avatar,
                userId : user?._id}
            });
        })
    
        
    }
    function createPeer(userToSignal, callerId,streamm){
        console.log("stream create",stream)
        const peer = new Peer({
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
    //  function loadUser() {
    //     console.log("user",peersRef.current)
    //     const speaker = []
    //     const listen = []
    //     const usersPeer = peersRef.current
    //     // users.map((u)=>{
    //     //         listen.push(u);
    //     // })
    //     // const meow = speaker;
    //     usersPeer.map((u=>{
    //         if(roomCur.current.speakers.find(s=> s._id == u.user.id) 
    //         || roomCur.current.ownerId._id == u.user.id){
    //             speaker.push(u);
    //         }else{
    //             listen.push(u);
    //         }
    //     }))   
    //     usersPeer.map(u=>{
    //         if(u.peer){
    //             u.peer.on("stream",stream=>{
    //                 console.log("test stream")
    //             })
    //         }
    //     })
    //     speakerRef.current = speaker
    //     listenerRef.current = listen
    //     setSpeakers(speaker)
    //     setListener(listen)
    // }
    async function  providerPermisstion(id,role){
        await RoomService.setSpeakers(roomCur.current._id,id)
        return  socketRef.current.emit("change role", { roomId: roomCur.current._id, role: role, userId: id })
    }

    return(
        <SocketContext.Provider value={{
            muted,
            stream,
            peers,
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
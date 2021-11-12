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
    const [speakers,setSpeakers] = useState([])
    const [listener,setListener] = useState([])
    const [user,setUser] = useState()
    const socketRef = useRef()
    const [role,setRole] = useState("user")
    const peersRef = useRef([])
    const roomId = useRef()
    const [allRoom,setAllRoom] = useState([])
    

     useEffect(()=>{
        const getUser = async ()=>{
            const user = await UserService.getUser()
            const roomData = await RoomService.getAllRoom();
            setAllRoom(roomData.room);
            setUser(user)
        }
        getUser()
        console.log("load user")
     },[])
     useEffect(()=>{
         const user = users;
         const speakers = user.filter(u=> u.role != "user");
         const listener = user.filter(u=> u.role == "user");
         setSpeakers(speakers)
         setListener(listener)
     },[users])
    useEffect(()=>{
        
            console.log("meow")
            if(socketRef.current == null) return
            console.log(socketRef.current)
            socketRef.current.on("set role",role=>{
                setRole(role)
            })
            socketRef.current.on("get room",allRoom=>{
                setAllRoom(allRoom);
            })
            socketRef.current.on("all users",data =>{
                console.log("all user",data)
                const users = data.users
                const peers = []
                users.forEach(User => {
                    if(User.id != user._id){
                    const peer = createPeer(User.socketId,socketRef.current.id,stream)
                    const peerObj = {
                        peerId : User.socketId,
                        peer
                    }
                    peersRef.current.push(peerObj);
                    peers.push(peerObj)
                }
                });
                setUsers(users)
                setPeers(peers)
            })
            // socketRef.current.on("role changed",role=>{
            //     setRole(role)
            // })
            socketRef.current.on('user joined', payload=>{
                console.log("user joined");
                const peer = addPeer(payload.signal,payload.caller.socketId,stream)
                const peerObj = {
                    peerId : payload.caller.socketId,
                    peer : peer
                }
                peersRef.current.push(peerObj)
                setUsers(users=>[...users,payload.caller])
                setPeers(users=>[...users,peerObj])
            })
            socketRef.current.on('receiving returned signal', payload => {
                const item = peersRef.current.find(p=> p.peerId === payload.id);
                item.peer.signal(payload.signal)
            })
            socketRef.current.on('user out',user=>{
                // const userOut = peersRef.current.find(p => p.peerId === user.id);
                // if(userOut){
                //     userOut.peer.destroy();
                // }
                // const peers = peersRef.current.filter(p=>p.peerId !== user.id);
                // peersRef.current = peers;
                const newUsers = user
                console.log(newUsers)
                setUsers(newUsers);
                setPeers(peers);
            })

        
    },[socketRef.current])
    function userOut(){
        peersRef.current = []
        setPeers([])

    }
    function connectSocket(){
        socketRef.current = io.connect("http://localhost:9000")
        navigator.mediaDevices.getUserMedia({audio : true}).then(stream=>{
            setStream(stream)
            socketRef.current.emit('join room',{roomId : roomId.current,user : {
                username : user?.username,
                avatar : user?.avatar,
                userId : user?._id}
            });
        })
    }
    function createPeer(userToSignal, callerId,stream){
        const peer = new Peer({
            initiator : true,
            trickle : false,
            stream
        })
        peer.on('signal',signal=>{
            socketRef.current.emit('sending signal', {userToSignal,callerId : callerId,
            roomId : roomId.current,signal})
        })
        return peer;
    }

    function addPeer(incommingSignal,callerID,stream){
        const peer = new Peer({
            initiator : false,
            trickle : false,
            stream
        })
        peer.on("signal",signal=>{
            socketRef.current.emit("returning signal", {signal,callerID})
        })

        peer.signal(incommingSignal)
        return peer;
    }
    function muted(){
        stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled)
    }
    function providerPermisstion(id,role){
        return  socketRef.current.emit("change role", { roomId: roomId.current, role: role, userId: id })
    }

    return(
        <SocketContext.Provider value={{
            muted,
            stream,
            peers,
            peersRef,
            users,
            user,
            role,
            allRoom,
            roomId,
            socketRef,
            speakers,
            listener,
            providerPermisstion,
            userOut,
            // setRoomId,
            connectSocket
        }} >
            {children}
        </SocketContext.Provider>
    )
 }

 export {ContextProvider,SocketContext}
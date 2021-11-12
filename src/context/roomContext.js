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
            if(socketRef.current == null) return
            console.log(socketRef.current)
            socketRef.current.on("set role",role=>{
                setRole(role)
            })
            socketRef.current.on("get room",allRoom=>{
                setAllRoom(allRoom);
            })
            socketRef.current.on("all users",data =>{
                const users = data.users
                const peers = []
                users.forEach(User => {
                    var peer;
                    console.log(User)
                    if(User.id != user._id){
                    const peerNew = createPeer(User.socketId,socketRef.current.id,stream)
                    peer = peerNew
                    }
                    const peerObj = {
                        peer,
                        user : User
                    }
                    peersRef.current.push(peerObj);
                    peers.push(peerObj)
                    
                });
                console.log("peer",peersRef.current)
                setUsers(peersRef.current)
                setPeers(peers)
            })
            // socketRef.current.on("role changed",role=>{
            //     setRole(role)
            // })
            socketRef.current.on('user joined', payload=>{
                
                const peer = addPeer(payload.signal,payload.caller.socketId,stream)
                const peerObj = {
                    user : payload.caller,
                    peer : peer
                }
                peersRef.current.push(peerObj)
                const newUserPeer = peersRef.current
                console.log("user joined");
                setUsers([...newUserPeer])
            })
            socketRef.current.on('receiving returned signal', payload => {
                const item = peersRef.current.find(p=> p.user.socketId === payload.id);
                item.peer.signal(payload.signal)
            })
            socketRef.current.on('user out',data=>{
                console.log("out",data);
                const outUser = peersRef.current.find(p => p.user.socketId == data.id);
                console.log(outUser);
                if(outUser){
                    outUser.peer.destroy();
                }
                const newPeer = peersRef.current.filter(p=>p.user.socketId != data.id);
                peersRef.current = newPeer;
                console.log("after delete", peersRef.current)
                const newUserPeer = peersRef.current
                setUsers([...newUserPeer])
                // const newUsers = user
                // setUsers(newUsers);
                // setPeers(peers);
            })

        
    },[socketRef.current])

    useEffect(()=>{
        const userPeer = users;
        const speaker = userPeer.filter(u=> u.user.role != "user");
        const listene = userPeer.filter(u=> u.user.role == "user");
        setSpeakers(speaker)
        setListener(listene)
    },[users])
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
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
    const roomCur = useRef()
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
            socketRef.current.on("role change",async (role)=>{  
                console.log('role')
                roomCur.current = await RoomService.getRoomById(roomCur.current._id)
                setUsers(peersRef.current)
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
        loadUser()
    },[users,roomCur])
    function userOut(){
        peersRef.current = []
        setPeers([])

    }
    function connectSocket(){
        socketRef.current = io.connect("http://localhost:9000")
        navigator.mediaDevices.getUserMedia({audio : true}).then(stream=>{
            setStream(stream)
            socketRef.current.emit('join room',{roomId : roomCur.current._id,user : {
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
            roomId : roomCur.current._id,signal})
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
    function loadUser(){
        const speaker = []
        const listen = []
        const userPeer = users;
        userPeer.forEach((u=>{
            if(roomCur.current.speakers.find(s=> s._id == u.user.id) 
            || roomCur.current.ownerId._id == u.user.id){
                speaker.push(u);
            }else{
                listen.push(u);
            }
        }))

        setSpeakers(speaker)
        setListener(listen)
    }
    async function  providerPermisstion(id,role){
        await RoomService.setSpeakers(roomCur.current._id,id);
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
            role,
            allRoom,
            roomCur,
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
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
    const [user,setUser] = useState()
    const socketRef = useRef()
    const [role,setRole] = useState("user")
    const peersRef = useRef()
    const roomID = "12"
    const [allRoom,setAllRoom] = useState([])

    useEffect(()=>{
        const getUser = async ()=>{
            const user = await UserService.getUser()
            const roomData = await RoomService.getAllRoom();
            setAllRoom(roomData.room);
            setUser(user)
        }
        getUser()
        socketRef.current = io.connect("http://localhost:9090")
        navigator.mediaDevices.getUserMedia({audio : true}).then(stream=>{
            setStream(stream)
            socketRef.current.emit('join room',roomID);
            socketRef.current.on("set role",role=>{
                setRole(role)
            })
            socketRef.current.on("get room",allRoom=>{
                setAllRoom(allRoom);
            })
            socketRef.current.on("all users",user =>{
                const users = user
                const peer = []
                user.users.forEach(userId => {
                    const peer = createPeer(userId,socketRef.current.id,stream)
                    const peerObj = {
                        peerId : userId,
                        peer
                    }
                    peersRef.current.push(peerObj);
                    peers.push(peerObj)
                });
                setUsers(users)
                setPeers(peers)
            })
            // socketRef.current.on("role changed",role=>{
            //     setRole(role)
            // })
            socketRef.current.on('user joined', payload=>{
                const peer = addPeer(payload.signal,payload.callerID,stream)
                const peerObj = {
                    peerId : payload.callerID,
                    peer : peer
                }
                peersRef.current.push(peerObj)
                setPeers(users=>[...users,peerObj])
            })
            socketRef.current.on('receiving returned signal', payload => {
                const item = peersRef.current.find(p=> p.peerId === payload.id);
                item.peer.signal(payload.signal)
            })
            socketRef.current.on('user out',user=>{
                const userOut = peersRef.current.find(p => p.peerId === user.id);
                if(userOut){
                    userOut.peer.destroy();
                }
                const peers = peersRef.current.filter(p=>p.peerId !== user.id);
                peersRef.current = peers;
                setPeers(peers);
            })

        })
    },[])

    function createPeer(userToSignal, callerID,stream){
        const peer = new Peer({
            initiator : true,
            trickle : false,
            stream
        })
        peer.on('signal',signal=>{
            socketRef.current.emit('sending signal', {userToSignal,callerID,signal})
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
        return  socketRef.current.emit("change role", { roomId: roomID, role: role, userId: id })
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
            roomID
        }} >
            {children}
        </SocketContext.Provider>
    )
 }

 export {ContextProvider,SocketContext}
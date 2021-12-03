import axios from 'axios'


const tokenHeader = {headers : {
    'auth-token' : JSON.parse(localStorage.getItem('token'))
}}
const createRoom = async (topic,description)=>{
    console.log(tokenHeader)
    return await axios.post('/room/create',{
        topic : topic,
        roomType : "Open",
        description : description
       
    }, tokenHeader).then(res=>{
        return res.data;
    })
}
const setSpeakers = async (roomId,userId)=>{
    console.log("setSpeaker",roomId,userId)
    return await axios.put(`/room/speaker/${roomId}`,{
        userId : userId
    })
}
const getAllRoom = async ()=>{
    return await axios.get('/room').then(res=>{
        return res.data
    })
}
const getRoomById = async (id)=>{
    return await axios.get(`/room/roombyid/${id}`)
    .then(res=>{
        return res.data.room
    })
}
const getRoomByType = async (type)=>{
    return await axios.get(`/room/roombytype/${type}`)
    .then(res=>{
        return res
    })
}
export const RoomService = {
    createRoom,
    getRoomByType,
    getAllRoom,
    setSpeakers,
    getRoomById
}
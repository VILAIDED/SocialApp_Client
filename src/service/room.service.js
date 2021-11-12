import axios from 'axios'


const tokenHeader = {headers : {
    'auth-token' : JSON.parse(localStorage.getItem('token'))
}}
const createRoom = async (topic,type)=>{
    console.log(tokenHeader)
    return await axios.post('/room/create',{
        topic : topic,
        roomType : type,
       
    }, tokenHeader).then(res=>{
        return res.data;
    })
}
const getAllRoom = async ()=>{
    return await axios.get('/room').then(res=>{
        return res.data
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
    getAllRoom
}
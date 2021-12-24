import axios from 'axios'

const url = "https://pbl4t.herokuapp.com/api";
const tokenHeader = {headers : {
    'auth-token' : JSON.parse(localStorage.getItem('token'))
}}
const createRoom = async (topic,description,idSpeaker)=>{
    const jId = JSON.stringify(idSpeaker)
    console.log("speaker", jId);
    console.log(tokenHeader)
    return await axios.post(url + '/room/create',{
        topic : topic,
        speakers : idSpeaker,
        roomType : "Open",
        description : description
       
    }, tokenHeader).then(res=>{
        return res.data;
    })
}
const setSpeakers = async (roomId,userId)=>{
    console.log("setSpeaker",roomId,userId)
    return await axios.put(url + `/room/speaker/${roomId}`,{
        userId : userId
    })
}
const getAllRoom = async ()=>{
    return await axios.get(url + '/room').then(res=>{
        return res.data
    })
}
const getRoomById = async (id)=>{
    return await axios.get(url +`/room/roombyid/${id}`)
    .then(res=>{
        return res.data.room
    })
}
const getRoomByType = async (type)=>{
    return await axios.get(url +`/room/roombytype/${type}`)
    .then(res=>{
        return res
    })
}
const getRoomsById = async (ids)=>{
    console.log("idAxios",ids)
    return await axios.post(url +'/room/room',
    {id : ids}).then((res)=>{
        return res.data
    })
}
export const RoomService = {
    createRoom,
    getRoomByType,
    getAllRoom,
    setSpeakers,
    getRoomById,
    getRoomsById
}
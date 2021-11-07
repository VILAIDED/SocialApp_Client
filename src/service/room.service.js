import axios from 'axios'

export default RoomService = {
    createRoom,
    getRoomByType
}

const createRoom = async (topic,type)=>{
    return await axios.post('/room/create',{
        topic : topic,
        type : type
    }).then(res=>{
        return res;
    })

}

const getRoomByType = async (type)=>{
    return await axios.get(`/room/roombytype/${type}`)
    .then(res=>{
        return res
    })
}
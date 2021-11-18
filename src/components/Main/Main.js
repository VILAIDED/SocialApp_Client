import React, {useContext} from 'react'
import { UserService } from '../../service/user.service'
import  {SocketContext} from '../../context/roomContext'
export default function  Main(){
    const {allRoom} = useContext(SocketContext)
    return(
        <div>
            <h1>Hello world</h1>
            <button onClick={UserService.Logout}>
            </button>
        
        </div>
    )
}

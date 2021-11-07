import React, {useContext} from 'react'
import { UserService } from '../../service/user.service'
import  {SocketContext} from '../../context/roomContext'
export default function  Home(){
    const {allRoom} = useContext(SocketContext)
    return(
        <div>
            <h1>Hello world</h1>
            <button onClick={UserService.Logout}>
                Logout
            </button>
        
        </div>
    )
}

import React from 'react'
import { UserService } from '../../service/user.service'

export default function  Main(){
    return(
        <div>
            <h1>Hello world</h1>
            <button onClick={UserService.Logout}>
                Logout
            </button>
        
        </div>
    )
}

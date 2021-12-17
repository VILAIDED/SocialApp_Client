import React,{useState} from 'react'
import PropTypes from 'prop-types';
import './Login.css'
import { UserService } from '../../service/user.service';


export default function Login({setToken}){
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();

    const handleSubmit = async e=>{
        console.log("hello world")
        e.preventDefault();
        const token = await UserService.Login(username,password);
        if(token){
            setToken(token);
            window.location.reload();
        }
        
    }
    return(
        <div className="login-wrapper">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                <p>Username</p>
                <input type="text" placeholder="Username" onChange={e=> setUsername(e.target.value)}></input>
                </label>
                <label>
                <p>Password</p>
                <input type="password" onChange={e=>setPassword(e.target.value)}></input>
                </label>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}
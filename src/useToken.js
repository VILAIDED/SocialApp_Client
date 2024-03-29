import { useState } from "react";

export default function useToken(){
    const getToken = ()=>{
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        return token;
    }
    const logout = ()=>{
        setToken("");
        localStorage.removeItem("token")
    }
    const [token,setToken] = useState(getToken())

    const saveToken = userToken =>{
        localStorage.setItem("token",JSON.stringify(userToken));
        setToken(userToken);
    }
    
    return{
        logout,
        setToken : saveToken,
        token
    }
}
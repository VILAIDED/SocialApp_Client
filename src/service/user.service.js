import axios from 'axios'

export const UserService = {
    Login,
    Logout,
    getUser
}
 async function Login(username,password){
    return await axios.post('/auth/login',{
        username : username,
        password : password
    }).then(res => {
        console.log(res)
        return res.data
    })
}
function Logout(){
    localStorage.removeItem("token");
}
 async function getUser(){
     const token = localStorage.getItem("token")
     return await axios.get('/auth/logined',{
         headers : {
             "auth-token" : JSON.parse(token)
         }
     }).then(res=>{
         return res.data
     })
 }
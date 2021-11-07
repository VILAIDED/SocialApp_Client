import axios from 'axios'

export const UserService = {
    Login,
    Logout
}
 async function Login(username,password){
    return await axios.post('/auth/login',{
        username : username,
        password : password
    }).then(res => {
        return res
    })
}
function Logout(){
    localStorage.removeItem("token");
}
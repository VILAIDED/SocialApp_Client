import axios from 'axios'
const url = "https://pbl4t.herokuapp.com/api";
export const UserService = {
    Login,
    Logout,
    getUser,
    getUserById,
    Register,
    UploadProfile,
    profileUpdate,
    getAllUser
}
const token = localStorage.getItem("token")
 async function UploadProfile(file){
    const formData = new FormData();
    formData.append("profile",file)
    return await axios.put(url+'/auth/uploadprofile',formData,{
        headers : {
            "auth-token" : JSON.parse(token)
        }
    }).then(res=>{
        return res.data
    })
 }
 async function getUserById(id){
     return await axios.get(url+`/auth/user/${id}`).then(res =>{
         return res.data;
     })
 }
 async function Login(username,password){
    return await axios.post(url+'/auth/login',{
        username : username,
        password : password
    }).then(res => {
        console.log(res)
        return res.data
    })
}
 async function Register(data){
     return await axios.post(url+'/auth/register',{
         username : data.username,
         password : data.password,
         realname : data.realname
     }).then(res=> {
         return res.status
     })
 }
async function getAllUser(){
    return await axios.get(url+"/auth/user").then(res=>{
        return res.data;
    })
}
function Logout(){
    localStorage.removeItem("token");
}
 async function profileUpdate(username,realname){
    return await axios.put(url+'/auth/editprofile',{username : username,realname : realname},{
        headers : {
            "auth-token" : JSON.parse(token)
        }
    }).then(res=>{
        return res.data
    })
 }
 async function getUser(){
     return await axios.get(url+'/auth/logined',{
         headers : {
             "auth-token" : JSON.parse(token)
         }
     }).then(res=>{
         return res.data
     })
 }
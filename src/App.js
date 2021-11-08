import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import {useState} from 'react'
import Main from './components/Main/Main';
import Home from './page/Home';
import Login from './components/Login/Login'
import Room from './components/Room/Room'
import useToken from './useToken';
import Profile from './components/Profile/Profile';
function App() {
  const {token,setToken} = useToken()
  if(!token){
    return <Login setToken={setToken} />
  }
  return (
     <div className="wrapper">
       <BrowserRouter>
       <Routes>
         <Route exact path="/" element={<Home/>} children={<Home/>}>
           <Home />
         </Route>
         <Route exact path="/room:id" element={<Room/>} >
           <Home />
         </Route>
         <Route path="/profile" element={Profile}>
           <Profile />
         </Route>
         </Routes>
         </BrowserRouter>
    </div>
  );
}

export default App;

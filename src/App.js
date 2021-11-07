import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import {useState} from 'react'
import Main from './components/Main/Main';
import Login from './components/Login/Login'
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
         <Route exact path="/" element={<Main/>}>
           <Main />
         </Route>
         <Route path="/profile" component={Profile}>
           <Profile />
         </Route>
         </Routes>
         </BrowserRouter>
    </div>
  );
}

export default App;

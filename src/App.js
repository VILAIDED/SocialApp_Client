import './App.css';
import {ContextProvider} from './context/roomContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './page/Home/Home';
import Login from './components/Login/Login'
import Room from './page/Room/Room'

import useToken from './useToken';
import Profile from './components/Profile/Profile';
import Sidebar from './components/Sidebar/Sidebar';
function App() {
  const { token, setToken } = useToken()
 
  if (!token) {
    return <Login setToken={setToken} />
  }
  return (
    <ContextProvider>
    <div className="wrapper">
      <Sidebar /> 
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}>
            <Home />
          </Route>
          <Route exact path="/room/:roomId" element={<Room />} >
            <Home />
          </Route>
          <Route path="/profile" element={Profile}>
            <Profile />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
    </ContextProvider>
  );
}

export default App;

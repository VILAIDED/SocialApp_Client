import './App.css';
import {ContextProvider} from './context/roomContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './page/Home/Home';
import Main from './page/Main/Main'
import Room from './page/Room/Room'

import useToken from './useToken';
import Profile from './components/Profile/Profile';
import Sidebar from './components/Sidebar/Sidebar';
function App() {
  const { token, setToken } = useToken()
 
  if (!token) {
    return <Home setToken={setToken} />
  }
  return (
    <ContextProvider>
    <div className="wrapper">
      <Sidebar /> 
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Main />}>
          </Route>
          <Route exact path="/room/:roomId" element={<Room />} >
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

import { useContext, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import { Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Notification from './pages/Notifications.jsx'
import PostView from './pages/post.jsx'
import CreateCommunity from './pages/creategroup.jsx'
import CreatePost from './pages/createpost.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/register.jsx'
import Profile from './pages/Profile.jsx'
import Group from './pages/group.jsx'
import { AuthContext } from './context/UserContext.jsx'
import ProtectedRoutes from './components/secureRoutes/ProtectedRoutes.jsx'
import PublicRoutes from './components/secureRoutes/PublicRoutes.jsx'

function App() {
  const [count, setCount] = useState(0)

  const [communityWindow, setCommWindow] = useState(false);
  const [search,updateSearch] = useState("");

  const { user, updateUser } = useContext(AuthContext);
  console.log(user);

  return (
    <>
      <Navbar search={search} updateSearch={updateSearch} setCommWindow={setCommWindow} />
      <Routes>
        <Route path='/' element={<Home search={search} />} />
        <Route path='/notification' element={
          <ProtectedRoutes>
            <Notification />
          </ProtectedRoutes>
        } />
        <Route path='/post/:postId' element={<PostView />} />
        <Route path='/createpost/:groupId' element={
          <ProtectedRoutes>
            <CreatePost />
          </ProtectedRoutes>
        } />
        <Route path='/login' element={
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        } />
        <Route path='/signin' element={
          <PublicRoutes>
            <Signup />
          </PublicRoutes>
        } />
        <Route path='/profile/:userId' element={<Profile />} />
        <Route path='/group/:groupId' element={<Group />} />
      </Routes>
      {communityWindow && <CreateCommunity setCommWindow={setCommWindow} />}

    </>
  )
}

export default App

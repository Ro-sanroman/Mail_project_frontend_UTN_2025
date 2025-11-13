import React from "react"
import { Routes, Route } from "react-router"
import LoginScreen from "./Screens/LoginScreen/LoginScreen.jsx"
import RegisterScreen from "./Screens/RegisterScreen/RegisterScreen.jsx"
import HomeScreen from "./Screens/HomeScreen/HomeScreen.jsx"
import AuthMiddleware from "./middleware/authMiddleware.jsx"

function App() {
 

   return (
   <div>
    <Routes>
      <Route path="/" element={<LoginScreen/>}/>
      <Route path='/login' element={<LoginScreen/>}/>
      <Route path='/register' element={<RegisterScreen/>}/>
      <Route element={<AuthMiddleware/>} >
        <Route path='/home' element={<HomeScreen/>}/>
        <Route path='/workspace/:workspace_id' element={<WorkspaceScreen/>}/>
        <Route path='/workspace/:workspace_id/:channel_id' element={<WorkspaceScreen/>}/>
      </Route>
    </Routes>
   </div>
  )
}

export default App

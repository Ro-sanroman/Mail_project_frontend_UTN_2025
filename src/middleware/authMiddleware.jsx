import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

const AuthMiddleware = () => {
    const {isLogged} = useContext(AuthContext)
    console.log(isLogged)
    if(isLogged){
        return <Outlet/>
    }
    else{
        return <Navigate to={'/login'}/>
    }
}

export default AuthMiddleware
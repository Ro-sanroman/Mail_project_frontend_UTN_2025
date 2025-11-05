import React from 'react'

import { Navigate, Outlet } from 'react-router'
const AuthMiddleware = () => {
    const auth_token = localStorage.getItem('auth_token')
    if(auth_token){
        return <Outlet/>
    }
    else{
        return <Navigate to={'/login'}/>
    }
}
export default AuthMiddleware
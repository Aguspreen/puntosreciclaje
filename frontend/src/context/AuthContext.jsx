import React, { createContext, useState, useEffect } from 'react'
import api from '../api'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if(t && u) setUser(JSON.parse(u))
  },[])

  const logout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const login = async (correo, contraseña)=>{
    const res = await api.post('/usuarios/login', { correo, contraseña })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>
}

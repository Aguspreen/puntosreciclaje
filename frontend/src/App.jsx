import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import MapPage from './pages/Map'

export default function App(){
  return (
    <div>
      <nav style={{padding:10}}>
        <Link to="/">Mapa</Link> | <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MapPage/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
  )
}

import React, { useContext } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Button, Box } from '@mui/material'
import Login from './pages/Login'
import Register from './pages/Register'
import MapPage from './pages/Map'
import AddPunto from './pages/AddPunto'
import AdminPanel from './pages/AdminPanel'
import SuggestionsPage from './pages/Suggestions'
import ReportsPage from './pages/Reports'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './context/AuthContext'

export default function App(){
  const { user, logout } = useContext(AuthContext)
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{display:'flex', justifyContent:'space-between'}}>
          <Link to="/" style={{color:'white',textDecoration:'none',fontSize:18,fontWeight:'bold'}}>🌍 SIG Reciclaje</Link>
          <Box style={{display:'flex',gap:10}}>
            <Button color="inherit" component={Link} to="/">Mapa</Button>
            <Button color="inherit" component={Link} to="/sugerencias">Sugerencias</Button>
            <Button color="inherit" component={Link} to="/reportes">Reportes</Button>
            {user?.role === 'admin' && (
              <>
                <Button color="inherit" component={Link} to="/admin">Admin</Button>
                <Button color="inherit" component={Link} to="/add-punto">+ Punto</Button>
              </>
            )}
            {user ? (
              <>
                <Button color="inherit" disabled>{user.nombre}</Button>
                <Button color="inherit" onClick={handleLogout}>Salir</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Registrarse</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<MapPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/sugerencias" element={<SuggestionsPage/>} />
        <Route path="/reportes" element={<ReportsPage/>} />
        <Route path="/add-punto" element={<ProtectedRoute adminOnly><AddPunto/></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

import React, { useState, useContext } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material'
import { AuthContext } from '../context/AuthContext'

export default function Login(){
  const [correo,setCorreo]=useState('')
  const [contraseña,setContraseña]=useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()
  const { login } = useContext(AuthContext)

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    try{
      await login(correo, contraseña)
      nav('/')
    }catch(err){
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  return (
    <Container maxWidth="xs" style={{marginTop:40, marginBottom:40}}>
      <Typography variant="h5">Iniciar Sesión</Typography>
      {error && <Alert severity="error" style={{marginTop:12}}>{error}</Alert>}
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12,marginTop:12}}>
        <TextField label="Correo" value={correo} onChange={e=>setCorreo(e.target.value)} fullWidth />
        <TextField label="Contraseña" type="password" value={contraseña} onChange={e=>setContraseña(e.target.value)} fullWidth />
        <Button type="submit" variant="contained">Entrar</Button>
      </form>
      <Box style={{marginTop:12}}>
        <Typography variant="body2">¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></Typography>
      </Box>
    </Container>
  )
}

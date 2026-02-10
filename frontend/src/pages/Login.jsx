import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Container, Typography } from '@mui/material'

export default function Login(){
  const [correo,setCorreo]=useState('')
  const [contraseña,setContraseña]=useState('')
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await axios.post('/usuarios/login', { correo, contraseña })
      localStorage.setItem('token', res.data.token)
      nav('/')
    }catch(err){
      alert('Error al iniciar sesión')
    }
  }

  return (
    <Container maxWidth="xs" style={{marginTop:40}}>
      <Typography variant="h5">Iniciar Sesión</Typography>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12,marginTop:12}}>
        <TextField label="Correo" value={correo} onChange={e=>setCorreo(e.target.value)} />
        <TextField label="Contraseña" type="password" value={contraseña} onChange={e=>setContraseña(e.target.value)} />
        <Button type="submit" variant="contained">Entrar</Button>
      </form>
    </Container>
  )
}

import React, { useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material'

export default function Register(){
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!nombre || !correo || !contraseña) {
      setError('Todos los campos son requeridos')
      return
    }
    try {
      await api.post('/usuarios/register', { nombre, correo, contraseña })
      setSuccess(true)
      setTimeout(() => nav('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    }
  }

  return (
    <Container maxWidth="xs" style={{ marginTop: 40, marginBottom: 40 }}>
      <Typography variant="h5">Crear Cuenta</Typography>
      {error && <Alert severity="error" style={{ marginTop: 12 }}>{error}</Alert>}
      {success && <Alert severity="success" style={{ marginTop: 12 }}>¡Cuenta creada! Redirigiendo...</Alert>}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} fullWidth />
        <TextField label="Correo" type="email" value={correo} onChange={e => setCorreo(e.target.value)} fullWidth />
        <TextField label="Contraseña" type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} fullWidth />
        <Button type="submit" variant="contained">Registrarse</Button>
      </form>
      <Box style={{ marginTop: 12 }}>
        <Typography variant="body2">¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></Typography>
      </Box>
    </Container>
  )
}

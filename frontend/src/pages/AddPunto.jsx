import React, { useState, useContext } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Container, Typography, Alert, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { AuthContext } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AddPuntoPage(){
  const { user } = useContext(AuthContext)
  const nav = useNavigate()
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [latitud, setLatitud] = useState('')
  const [longitud, setLongitud] = useState('')
  const [tipoResiduo, setTipoResiduo] = useState('PET')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!user || user.role !== 'admin') {
    return <div style={{padding:20}}><Typography>No autorizado. Solo admins pueden crear puntos.</Typography></div>
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!nombre || !latitud || !longitud || !tipoResiduo) {
      setError('Campos requeridos: nombre, latitud, longitud, tipo de residuo')
      return
    }
    try {
      await api.post('/puntos', {
        nombre,
        direccion,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        tipo_residuo: tipoResiduo,
        estado: 'activo'
      })
      setSuccess(true)
      setNombre('')
      setDireccion('')
      setLatitud('')
      setLongitud('')
      setTipoResiduo('PET')
      setTimeout(() => nav('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear punto')
    }
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: 40, marginBottom: 40 }}>
      <Typography variant="h5">Crear Punto de Reciclaje</Typography>
      {error && <Alert severity="error" style={{ marginTop: 12 }}>{error}</Alert>}
      {success && <Alert severity="success" style={{ marginTop: 12 }}>¡Punto creado! Redirigiendo...</Alert>}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} fullWidth required />
        <TextField label="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} fullWidth />
        <TextField label="Latitud" type="number" inputProps={{ step: 'any' }} value={latitud} onChange={e => setLatitud(e.target.value)} fullWidth required />
        <TextField label="Longitud" type="number" inputProps={{ step: 'any' }} value={longitud} onChange={e => setLongitud(e.target.value)} fullWidth required />
        <FormControl fullWidth>
          <InputLabel>Tipo de Residuo</InputLabel>
          <Select value={tipoResiduo} label="Tipo de Residuo" onChange={e => setTipoResiduo(e.target.value)}>
            <MenuItem value="PET">PET / Plástico</MenuItem>
            <MenuItem value="Cartón">Cartón</MenuItem>
            <MenuItem value="Vidrio">Vidrio</MenuItem>
            <MenuItem value="Metal">Metal</MenuItem>
            <MenuItem value="Electrónico">Electrónico</MenuItem>
            <MenuItem value="Llantas">Llantas</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained">Crear Punto</Button>
      </form>
    </Container>
  )
}

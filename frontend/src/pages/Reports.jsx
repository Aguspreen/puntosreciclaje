import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import { Container, Typography, TextField, Button, Box, Alert, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { AuthContext } from '../context/AuthContext'

export default function ReportsPage(){
  const { user } = useContext(AuthContext)
  const [reportes, setReportes] = useState([])
  const [puntos, setPuntos] = useState([])
  const [idPunto, setIdPunto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchReportes()
    fetchPuntos()
  }, [])

  const fetchReportes = async () => {
    try {
      const res = await api.get('/reportes')
      setReportes(res.data)
    } catch (err) {
      console.error('Error fetching reportes:', err)
    }
  }

  const fetchPuntos = async () => {
    try {
      const res = await api.get('/puntos')
      setPuntos(res.data)
    } catch (err) {
      console.error('Error fetching puntos:', err)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!user) {
      setError('Debes iniciar sesión para reportar')
      return
    }
    if (!idPunto || !descripcion) {
      setError('Selecciona un punto y describe el problema')
      return
    }
    try {
      await api.post('/reportes', { id_punto: parseInt(idPunto), descripcion })
      setSuccess(true)
      setIdPunto('')
      setDescripcion('')
      setTimeout(() => fetchReportes(), 500)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear reporte')
    }
  }

  const updateStatus = async (id, estado) => {
    if (user?.role !== 'admin') return
    try {
      await api.put(`/reportes/${id}`, { estado })
      fetchReportes()
    } catch (err) {
      console.error('Error updating report:', err)
    }
  }

  return (
    <Container maxWidth="md" style={{ marginTop: 40, marginBottom: 40 }}>
      <Typography variant="h5">Reportes Comunitarios</Typography>
      
      {user && (
        <Box style={{ marginTop: 20, marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <Typography variant="h6">Reportar Problema</Typography>
          {error && <Alert severity="error" style={{ marginTop: 12 }}>{error}</Alert>}
          {success && <Alert severity="success" style={{ marginTop: 12 }}>¡Reporte creado!</Alert>}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Punto de Reciclaje</InputLabel>
              <Select value={idPunto} label="Punto de Reciclaje" onChange={e => setIdPunto(e.target.value)}>
                <MenuItem value="">Seleccionar...</MenuItem>
                {puntos.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Descripción del Problema" value={descripcion} onChange={e => setDescripcion(e.target.value)} fullWidth multiline rows={3} placeholder="Describe el problema..." />
            <Button type="submit" variant="contained">Enviar Reporte</Button>
          </form>
        </Box>
      )}

      <Typography variant="h6" style={{ marginTop: 20 }}>Reportes ({reportes.length})</Typography>
      {reportes.length === 0 ? (
        <Typography variant="body2" style={{ marginTop: 12 }}>No hay reportes</Typography>
      ) : (
        reportes.map(r => (
          <Card key={r.id} style={{ marginTop: 12 }}>
            <CardContent>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <Typography variant="subtitle1">Punto ID: {r.id_punto}</Typography>
                  <Typography variant="body2">{r.descripcion}</Typography>
                  <Typography variant="caption" style={{ marginTop: 8, display: 'block' }}>Por: Usuario {r.usuario} | {new Date(r.fecha).toLocaleDateString()}</Typography>
                </div>
                {user?.role === 'admin' && (
                  <Box>
                    <Select value={r.estado} onChange={e => updateStatus(r.id, e.target.value)} size="small">
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="resuelto">Resuelto</MenuItem>
                    </Select>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  )
}

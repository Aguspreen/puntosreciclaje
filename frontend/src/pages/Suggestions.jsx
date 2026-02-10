import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import { Container, Typography, TextField, Button, Box, Alert, Card, CardContent } from '@mui/material'
import { AuthContext } from '../context/AuthContext'

export default function SuggestionsPage(){
  const { user } = useContext(AuthContext)
  const [sugerencias, setSugerencias] = useState([])
  const [material, setMaterial] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchSugerencias()
  }, [])

  const fetchSugerencias = async () => {
    try {
      const res = await api.get('/sugerencias')
      setSugerencias(res.data)
    } catch (err) {
      console.error('Error fetching sugerencias:', err)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!user) {
      setError('Debes iniciar sesión para sugerir')
      return
    }
    if (!material || !descripcion) {
      setError('Completar todos los campos')
      return
    }
    try {
      await api.post('/sugerencias', { material, descripcion })
      setSuccess(true)
      setMaterial('')
      setDescripcion('')
      setTimeout(() => fetchSugerencias(), 500)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear sugerencia')
    }
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: 40, marginBottom: 40 }}>
      <Typography variant="h5">Sugerencias de Reutilización</Typography>
      
      {user && (
        <Box style={{ marginTop: 20, marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <Typography variant="h6">Proponer Idea</Typography>
          {error && <Alert severity="error" style={{ marginTop: 12 }}>{error}</Alert>}
          {success && <Alert severity="success" style={{ marginTop: 12 }}>¡Sugerencia creada!</Alert>}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <TextField label="Material/Producto" value={material} onChange={e => setMaterial(e.target.value)} fullWidth placeholder="Ej: Botellas PET" />
            <TextField label="Idea de Reutilización" value={descripcion} onChange={e => setDescripcion(e.target.value)} fullWidth multiline rows={3} placeholder="Describe tu idea..." />
            <Button type="submit" variant="contained">Enviar Sugerencia</Button>
          </form>
        </Box>
      )}

      <Typography variant="h6" style={{ marginTop: 20 }}>Ideas de la Comunidad</Typography>
      {sugerencias.length === 0 ? (
        <Typography variant="body2" style={{ marginTop: 12 }}>No hay sugerencias aún. ¡Sé el primero!</Typography>
      ) : (
        sugerencias.map(s => (
          <Card key={s.id} style={{ marginTop: 12 }}>
            <CardContent>
              <Typography variant="h6">{s.material}</Typography>
              <Typography variant="body2">{s.descripcion}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  )
}

import React, { useState, useEffect } from 'react'
import api from '../api'
import { Container, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Button, Alert, Box } from '@mui/material'

export default function AdminPanel(){
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(()=>{
    fetchUsers()
  },[])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/usuarios')
      setUsers(res.data)
    } catch (err) {
      setError('Error al cargar usuarios')
    }
  }

  const updateRole = async (userId, newRole) => {
    try {
      await api.patch(`/usuarios/${userId}/role`, { rol: newRole })
      setSuccess('Rol actualizado')
      setTimeout(() => setSuccess(''), 2000)
      fetchUsers()
    } catch (err) {
      setError('Error al actualizar rol')
    }
  }

  const filtered = users.filter(u => !q || u.nombre?.toLowerCase().includes(q.toLowerCase()) || u.correo?.toLowerCase().includes(q.toLowerCase()))

  return (
    <Container style={{marginTop:40, marginBottom:40}}>
      <Typography variant="h5">Panel de Administración</Typography>
      {error && <Alert severity="error" style={{marginTop:12}}>{error}</Alert>}
      {success && <Alert severity="success" style={{marginTop:12}}>{success}</Alert>}
      <Box style={{marginTop:20}}>
        <TextField label="Buscar usuarios (nombre/correo)" value={q} onChange={e=>setQ(e.target.value)} fullWidth style={{marginBottom:12}} />
        <Typography variant="body2" style={{marginBottom:12}}>Total: {filtered.length} usuarios</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow><TableCell>Id</TableCell><TableCell>Nombre</TableCell><TableCell>Correo</TableCell><TableCell>Rol Actual</TableCell><TableCell>Cambiar Rol</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {filtered.map(u=> (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>{u.correo}</TableCell>
              <TableCell><strong>{u.rol}</strong></TableCell>
              <TableCell>
                <Select value={u.rol} onChange={e => updateRole(u.id, e.target.value)} size="small">
                  <MenuItem value="ciudadano">Ciudadano</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

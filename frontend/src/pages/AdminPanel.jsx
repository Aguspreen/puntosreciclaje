import React, { useState, useEffect } from 'react'
import api from '../api'
import { Container, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

export default function AdminPanel(){
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')

  useEffect(()=>{
    // simple fetch — you should implement backend admin endpoint to list users
    api.get('/usuarios').then(r=>setUsers(r.data)).catch(()=>{})
  },[])

  const filtered = users.filter(u => !q || u.nombre?.toLowerCase().includes(q.toLowerCase()) || u.correo?.toLowerCase().includes(q.toLowerCase()))

  return (
    <Container>
      <Typography variant="h5">Panel de Administración</Typography>
      <TextField label="Buscar usuarios" value={q} onChange={e=>setQ(e.target.value)} style={{marginTop:12}} />
      <Table>
        <TableHead>
          <TableRow><TableCell>Id</TableCell><TableCell>Nombre</TableCell><TableCell>Correo</TableCell><TableCell>Rol</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {filtered.map(u=> (
            <TableRow key={u.id}><TableCell>{u.id}</TableCell><TableCell>{u.nombre}</TableCell><TableCell>{u.correo}</TableCell><TableCell>{u.rol}</TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

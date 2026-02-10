import React, { useEffect, useState, useContext } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api'
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Container } from '@mui/material'
import { AuthContext } from '../context/AuthContext'

const TIPO_ICONS = {
  'PET': '🔵',
  'Cartón': '📦',
  'Vidrio': '🟢',
  'Metal': '🟡',
  'Electrónico': '⚙️',
  'Llantas': '⚫'
}

export default function MapPage(){
  const [puntos,setPuntos]=useState([])
  const [filtro, setFiltro] = useState('Todos')
  const { user } = useContext(AuthContext)

  useEffect(()=>{
    api.get('/puntos').then(r=>setPuntos(r.data)).catch(()=>{})
  },[])

  const puntosFiltrados = filtro === 'Todos' ? puntos : puntos.filter(p => p.tipo_residuo === filtro)
  const tiposUnicos = ['Todos', ...new Set(puntos.map(p => p.tipo_residuo))]

  return (
    <Container maxWidth="lg" style={{marginTop:20, marginBottom:20}}>
      <Box style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <Typography variant="h5">Mapa de Puntos de Reciclaje</Typography>
        <FormControl style={{width:150}}>
          <InputLabel>Filtrar por tipo</InputLabel>
          <Select value={filtro} label="Filtrar por tipo" onChange={e=>setFiltro(e.target.value)}>
            {tiposUnicos.map(t=>(
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="body2" style={{marginBottom:12}}>Mostrando {puntosFiltrados.length} puntos ({filtro})</Typography>
      <div style={{height:'70vh', borderRadius:8, overflow:'hidden'}}>
        <MapContainer center={[20.0,-99.0]} zoom={6} style={{height:'100%'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {puntosFiltrados.map(p=> (
            <Marker key={p.id} position={[p.latitud, p.longitud]}>
              <Popup>
                <strong>{TIPO_ICONS[p.tipo_residuo] || '📍'} {p.nombre}</strong><br/>
                Tipo: {p.tipo_residuo}<br/>
                {p.direccion && <>{p.direccion}<br/></>}
                Estado: {p.estado}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Container>
  )
}

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

export default function MapPage(){
  const [puntos,setPuntos]=useState([])
  useEffect(()=>{
    axios.get('/puntos').then(r=>setPuntos(r.data)).catch(()=>{})
  },[])

  return (
    <div style={{height:'90vh'}}>
      <MapContainer center={[20.0,-99.0]} zoom={6} style={{height:'100%'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {puntos.map(p=> (
          <Marker key={p.id} position={[p.latitud, p.longitud]}>
            <Popup>
              <strong>{p.nombre}</strong><br/>{p.tipo_residuo}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Auth from './Auth.jsx'
import { supabase } from './supabase.js'
import './storage.js'

function Root() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user?.id) {
        window._currentUserId = session.user.id
      }
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user?.id) {
        window._currentUserId = session.user.id
      } else {
        window._currentUserId = null
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Cargando
  if (session === undefined) {
    return (
      <div style={{ minHeight:"100vh", background:"#040a0f", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(135deg,#00e87a,#00c96a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 16px", animation:"pulse 1.5s ease-in-out infinite" }}>⚽</div>
          <div style={{ color:"#eef2f6", fontWeight:700, fontSize:18, marginBottom:6 }}>FichaScout</div>
          <div style={{ color:"#4a6070", fontSize:13 }}>Cargando...</div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.95)}}`}</style>
      </div>
    )
  }

  // No autenticado → mostrar Login
  if (!session) {
    return <Auth />
  }

  // Autenticado → mostrar App
  return <App session={session} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

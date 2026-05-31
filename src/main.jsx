import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Auth from './Auth.jsx'
import Landing from './Landing.jsx'
import { supabase } from './supabase.js'
import './storage.js'

function Root() {
  const [session,     setSession]     = useState(undefined)
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user?.id) {
        window._currentUserId = session.user.id
        setShowLanding(false)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user?.id) {
        window._currentUserId = session.user.id
        setShowLanding(false)
      } else {
        window._currentUserId = null
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Cargando
  if (session === undefined) return (
    <div style={{minHeight:"100vh",background:"#040a0f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#00e87a,#00c96a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px",animation:"pulse 1.5s infinite"}}>⚽</div>
        <div style={{color:"#eef2f6",fontWeight:700,fontSize:17}}>FichaScout</div>
        <div style={{color:"#4a6070",fontSize:13,marginTop:4}}>Cargando...</div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.95)}}`}</style>
    </div>
  )

  // Logueado → App
  if (session) return <App session={session} />

  // No logueado + viendo landing → Landing
  if (showLanding) return <Landing onLogin={() => setShowLanding(false)} />

  // No logueado + clickeó "Iniciar sesión" → Auth
  return <Auth />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Root /></React.StrictMode>
)

import { useState } from "react";
import { supabase } from "./supabase.js";

const I = { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#eef2f6", fontSize:14, width:"100%", outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border .2s" };
const BG = { border:"none", borderRadius:10, padding:"13px", color:"#000", fontWeight:700, cursor:"pointer", fontSize:14, background:"linear-gradient(135deg,#00e87a,#00c96a)", fontFamily:"inherit", width:"100%", transition:"all .2s" };

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("scout");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const ROLES = [
    { id:"scout",   icon:"🔍", label:"Ojeador",          desc:"Scouting de talentos" },
    { id:"tecnico", icon:"📋", label:"Técnico",           desc:"Gestión de plantilla" },
    { id:"club",    icon:"🏟️", label:"Director de Club",  desc:"Visión global" },
  ];

  async function handleLogin(e) {
    e.preventDefault();
    setLoad(true); setError(""); setSuccess("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message);
    setLoad(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (!nombre.trim()) { setError("Por favor ingrese su nombre"); return; }
    setLoad(true); setError(""); setSuccess("");
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nombre, rol } }
    });
    if (error) setError(error.message);
    else setSuccess("¡Cuenta creada! Revise su email para confirmar y luego inicie sesión.");
    setLoad(false);
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (!email) { setError("Ingrese su email"); return; }
    setLoad(true); setError(""); setSuccess("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://fichascout.com/reset"
    });
    if (error) setError(error.message);
    else setSuccess("¡Email enviado! Revise su bandeja de entrada para recuperar su contraseña.");
    setLoad(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#040a0f", display:"flex", fontFamily:"system-ui,sans-serif", color:"#eef2f6", position:"relative", overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box}
        input::placeholder{color:#4a6070}
        input:focus{border-color:rgba(0,232,122,0.5)!important;background:rgba(255,255,255,0.08)!important}
        select option{background:#07111a}
        .tab-btn{flex:1;padding:10px;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;transition:all .2s}
        .btn-hover:hover{background:#1af080!important;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,232,122,0.3)}
        .link-btn{background:none;border:none;color:#00e87a;cursor:pointer;font-family:inherit;font-size:13px;text-decoration:underline;padding:0}
        .link-btn:hover{color:#1af080}
        .input-wrap{position:relative}
        .toggle-pass{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:#4a6070;cursor:pointer;font-size:16px;padding:0}
      `}</style>

      {/* Fondo decorativo */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:600, height:600, background:"radial-gradient(circle, rgba(0,232,122,0.06) 0%, transparent 70%)", borderRadius:"50%" }}/>
        <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:500, height:500, background:"radial-gradient(circle, rgba(0,184,255,0.04) 0%, transparent 70%)", borderRadius:"50%" }}/>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.3 }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(8)].map((_,i) => <line key={i} x1={i*14} y1="0" x2={i*14} y2="100" stroke="rgba(0,232,122,0.05)" strokeWidth=".5"/>)}
          {[...Array(8)].map((_,i) => <line key={i} x1="0" y1={i*14} x2="100" y2={i*14} stroke="rgba(0,232,122,0.05)" strokeWidth=".5"/>)}
        </svg>
      </div>

      {/* Panel izquierdo — solo desktop */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 5%", position:"relative" }}>
        <div style={{ maxWidth:480, margin:"0 auto" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"#07111a", border:"2px solid rgba(0,232,122,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 0 30px rgba(0,232,122,0.15)", position:"relative" }}>
              ⚽
              <div style={{ position:"absolute", bottom:-4, right:-4, width:16, height:16, background:"#00e87a", borderRadius:"50%", border:"2px solid #040a0f", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8 }}>✓</div>
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:24, letterSpacing:"-0.5px", color:"#eef2f6" }}>Ficha<span style={{ color:"#00e87a" }}>Scout</span></div>
              <div style={{ fontSize:12, color:"#4a6070", letterSpacing:1 }}>PLATAFORMA DE SCOUTING</div>
            </div>
          </div>

          <div style={{ fontWeight:800, fontSize:38, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:16, color:"#eef2f6" }}>
            Descubre el<br/>talento <span style={{ background:"linear-gradient(135deg,#00e87a,#00d4ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>invisible</span>
          </div>
          <div style={{ color:"#4a6070", fontSize:16, lineHeight:1.7, marginBottom:48 }}>
            La primera plataforma de scouting profesional para el fútbol amateur latinoamericano.
          </div>

          {/* Features */}
          {[
            { icon:"⚖️", title:"Compara con profesionales reales", desc:"4.000+ jugadores de 30 ligas sudamericanas" },
            { icon:"🤖", title:"Informes con Inteligencia Artificial", desc:"Análisis completo generado automáticamente" },
            { icon:"⚔️", title:"Análisis táctico del rival", desc:"Preparación pre-partido con IA" },
            { icon:"📋", title:"Pipeline de fichajes", desc:"Gestión completa del proceso de contratación" },
          ].map(f => (
            <div key={f.icon} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"rgba(0,232,122,0.08)", border:"1px solid rgba(0,232,122,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight:600, color:"#eef2f6", fontSize:13 }}>{f.title}</div>
                <div style={{ color:"#4a6070", fontSize:12 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{ width:"100%", maxWidth:460, background:"#07111a", borderLeft:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 40px", minHeight:"100vh" }}>
        <div style={{ width:"100%" }}>

          {forgotMode ? (
            /* ── RECUPERAR CONTRASEÑA ── */
            <div>
              <div style={{ fontWeight:800, fontSize:22, color:"#eef2f6", marginBottom:6 }}>Recuperar contraseña</div>
              <div style={{ color:"#4a6070", fontSize:13, marginBottom:28 }}>Le enviaremos un link a su email</div>
              <form onSubmit={handleForgot}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ color:"#4a6070", fontSize:12, fontWeight:600, marginBottom:6, letterSpacing:.5 }}>EMAIL</div>
                  <input style={I} type="email" placeholder="su@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                </div>
                {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"10px 14px", color:"#fca5a5", fontSize:13, marginBottom:14 }}>⚠ {error}</div>}
                {success && <div style={{ background:"rgba(0,232,122,0.08)", border:"1px solid rgba(0,232,122,0.25)", borderRadius:8, padding:"10px 14px", color:"#6ee7b7", fontSize:13, marginBottom:14 }}>✅ {success}</div>}
                <button type="submit" disabled={load} className="btn-hover" style={{ ...BG, opacity:load?0.6:1, cursor:load?"not-allowed":"pointer", marginBottom:14 }}>{load ? "⏳ Enviando..." : "📧 Enviar link de recuperación"}</button>
                <div style={{ textAlign:"center" }}><button className="link-btn" onClick={()=>{setForgotMode(false);setError("");setSuccess("");}}>← Volver al inicio de sesión</button></div>
              </form>
            </div>
          ) : (
            /* ── LOGIN / REGISTER ── */
            <div>
              <div style={{ fontWeight:800, fontSize:22, color:"#eef2f6", marginBottom:6 }}>
                {tab==="login" ? "Bienvenido de vuelta" : "Crear cuenta gratis"}
              </div>
              <div style={{ color:"#4a6070", fontSize:13, marginBottom:28 }}>
                {tab==="login" ? "Ingrese a su cuenta de FichaScout" : "Empiece a descubrir talentos hoy"}
              </div>

              {/* Tabs */}
              <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", borderRadius:10, padding:4, marginBottom:24 }}>
                {["login","register"].map(t => (
                  <button key={t} className="tab-btn" onClick={()=>{setTab(t);setError("");setSuccess("");}} style={{ background:tab===t?"rgba(0,232,122,0.12)":"transparent", color:tab===t?"#00e87a":"#4a6070", border:`1px solid ${tab===t?"rgba(0,232,122,0.3)":"transparent"}` }}>
                    {t==="login" ? "Iniciar sesión" : "Crear cuenta"}
                  </button>
                ))}
              </div>

              {tab==="login" ? (
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ color:"#4a6070", fontSize:12, fontWeight:600, marginBottom:6, letterSpacing:.5 }}>EMAIL</div>
                    <input style={I} type="email" placeholder="su@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <div style={{ color:"#4a6070", fontSize:12, fontWeight:600, letterSpacing:.5 }}>CONTRASEÑA</div>
                      <button type="button" className="link-btn" onClick={()=>{setForgotMode(true);setError("");setSuccess("");}}>¿Olvidó su contraseña?</button>
                    </div>
                    <div className="input-wrap">
                      <input style={I} type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
                      <button type="button" className="toggle-pass" onClick={()=>setShowPass(s=>!s)}>{showPass?"🙈":"👁️"}</button>
                    </div>
                  </div>
                  {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"10px 14px", color:"#fca5a5", fontSize:13, marginBottom:14 }}>⚠ {error}</div>}
                  <button type="submit" disabled={load} className="btn-hover" style={{ ...BG, opacity:load?0.6:1, cursor:load?"not-allowed":"pointer" }}>{load ? "⏳ Ingresando..." : "Ingresar a FichaScout →"}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ color:"#4a6070", fontSize:12, fontWeight:600, marginBottom:6, letterSpacing:.5 }}>NOMBRE COMPLETO</div>
                    <input style={I} type="text" placeholder="Su nombre" value={nombre} onChange={e=>setNombre(e.target.value)} required/>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ color:"#4a6070", fontSize:12, fontWeight:600, marginBottom:6, letterSpacing:.5 }}>EMAIL</div>
                    <input style={I} type="email" placeholder="su@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ color:"#4a6070", fontSize:12, fontWeight:600, marginBottom:6, letterSpacing:.5 }}>CONTRASEÑA</div>
                    <div className="input-wrap">
                      <input style={I} type={showPass?"text":"password"} placeholder="Mínimo 6 caracteres" value={password} onChange={e=>setPassword(e.target.value)} required/>
                      <button type="button" className="toggle-pass" onClick={()=>setShowPass(s=>!s)}>{showPass?"🙈":"👁️"}</button>
                    </div>
                  </div>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ color:"#4a6070", fontSize:12, fontWeight:600, marginBottom:8, letterSpacing:.5 }}>ROL</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                      {ROLES.map(r => (
                        <button key={r.id} type="button" onClick={()=>setRol(r.id)} style={{ border:`2px solid ${rol===r.id?"rgba(0,232,122,0.5)":"rgba(255,255,255,0.08)"}`, borderRadius:10, padding:"10px 6px", background:rol===r.id?"rgba(0,232,122,0.1)":"transparent", cursor:"pointer", textAlign:"center", fontFamily:"inherit", transition:"all .2s" }}>
                          <div style={{ fontSize:18, marginBottom:3 }}>{r.icon}</div>
                          <div style={{ fontSize:11, fontWeight:600, color:rol===r.id?"#00e87a":"#94a3b8" }}>{r.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"10px 14px", color:"#fca5a5", fontSize:13, marginBottom:14 }}>⚠ {error}</div>}
                  {success && <div style={{ background:"rgba(0,232,122,0.08)", border:"1px solid rgba(0,232,122,0.25)", borderRadius:8, padding:"10px 14px", color:"#6ee7b7", fontSize:13, marginBottom:14 }}>✅ {success}</div>}
                  <button type="submit" disabled={load} className="btn-hover" style={{ ...BG, opacity:load?0.6:1, cursor:load?"not-allowed":"pointer" }}>{load ? "⏳ Creando cuenta..." : "Crear cuenta gratis →"}</button>
                  <div style={{ textAlign:"center", marginTop:14, fontSize:12, color:"#334155" }}>
                    Al registrarse acepta nuestros términos de uso y privacidad
                  </div>
                </form>
              )}

              <div style={{ marginTop:24, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.06)", textAlign:"center" }}>
                <div style={{ fontSize:12, color:"#334155" }}>
                  {tab==="login" ? "¿No tiene cuenta? " : "¿Ya tiene cuenta? "}
                  <button className="link-btn" onClick={()=>{setTab(tab==="login"?"register":"login");setError("");setSuccess("");}}>
                    {tab==="login" ? "Crear cuenta gratis" : "Iniciar sesión"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop:32, textAlign:"center", fontSize:11, color:"#1e2d3a" }}>
            🔒 Seguridad garantizada por Supabase · Datos protegidos
          </div>
        </div>
      </div>
    </div>
  );
}

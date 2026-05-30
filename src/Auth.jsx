import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const IconRadar = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 3l0 4"/><path d="M3 12l4 0"/></svg>);
const IconVideo = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553 -2.369a1 1 0 0 1 1.447 .894v6.95a1 1 0 0 1 -1.447 .894l-4.553 -2.369v-4z"/><rect x="3" y="6" width="12" height="12" rx="2"/></svg>);
const IconKanban = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/><path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/></svg>);
const IconTactics = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>);
const IconChart = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M20 9l-5 5l-4 -4l-3 3"/></svg>);
const IconShield = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/><path d="M9 12l2 2l4 -4"/></svg>);
const IconEye = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/></svg>);
const IconEyeOff = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"/><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c3.6 0 6.6 2 9 6c-.853 1.422 -1.8 2.614 -2.83 3.575m-2.122 1.568c-1.24 .61 -2.608 .857 -4.048 .857c-3.6 0 -6.6 -2 -9 -6c.893 -1.488 1.891 -2.717 2.983 -3.668"/></svg>);
const IconLock = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M8 11v-4a4 4 0 0 1 8 0v4"/></svg>);
const IconMail = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6l9 -6"/></svg>);

const FEATS = [
  { icon:<IconRadar/>, color:"#00e87a",
    titulo:"Comparación con profesionales reales",
    desc:"Compare cualquier jugador amateur contra 4.000+ profesionales de las 30 ligas sudamericanas en radar chart de 7 dimensiones: ofensivo, defensivo, técnico, físico, consistencia, presión y progresión.",
    stats:[{v:"4.000+",l:"Jugadores pro"},{v:"30",l:"Ligas SA"},{v:"7",l:"Dimensiones"}],
    svg:(<svg viewBox="0 0 220 170" style={{width:"100%",maxWidth:260,display:"block",margin:"0 auto"}}>
      {[60,40,20].map(r=><circle key={r} cx="110" cy="85" r={r} fill="none" stroke="rgba(0,232,122,0.1)" strokeWidth="1"/>)}
      {[[110,25],[153,55],[153,115],[110,145],[67,115],[67,55]].map((p,i)=><line key={i} x1="110" y1="85" x2={p[0]} y2={p[1]} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
      <polygon points="110,37 146,58 146,112 110,133 74,112 74,58" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.45)" strokeWidth="1"/>
      <polygon points="110,47 138,64 138,106 110,122 82,106 82,64" fill="rgba(0,232,122,0.18)" stroke="#00e87a" strokeWidth="1.5"/>
      {[["Ofensivo",110,18],["Técnico",162,50],["Físico",162,122],["Defensivo",110,152],["Consistencia",54,122],["Presión",54,50]].map(([t,x,y],i)=><text key={i} x={x} y={y} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8.5">{t}</text>)}
      <circle cx="96" cy="93" r="14" fill="rgba(0,232,122,0.08)" stroke="rgba(0,232,122,0.3)" strokeWidth="1"/>
      <text x="96" y="91" textAnchor="middle" fill="#00e87a" fontSize="9" fontWeight="bold">7.8</text>
      <text x="96" y="102" textAnchor="middle" fill="rgba(0,232,122,0.6)" fontSize="6.5">Amateur</text>
      <circle cx="124" cy="93" r="14" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.3)" strokeWidth="1"/>
      <text x="124" y="91" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">8.9</text>
      <text x="124" y="102" textAnchor="middle" fill="rgba(59,130,246,0.6)" fontSize="6.5">Pro</text>
    </svg>)
  },
  { icon:<IconVideo/>, color:"#3b82f6",
    titulo:"Scouting en video con registro en tiempo real",
    desc:"Analice partidos desde YouTube. Registre eventos por posición con un clic mientras ve el video. La IA genera el informe completo con nota ajustada según la dificultad del partido.",
    stats:[{v:"6",l:"Tipos partido"},{v:"×2.5",l:"Factor final"},{v:"IA",l:"Informe auto"}],
    svg:(<svg viewBox="0 0 220 140" style={{width:"100%",maxWidth:260,display:"block",margin:"0 auto"}}>
      <rect x="12" y="10" width="118" height="78" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <rect x="16" y="14" width="110" height="66" rx="4" fill="#0d1f2d"/>
      <circle cx="71" cy="47" r="14" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.5)" strokeWidth="1"/>
      <polygon points="67,41 67,53 79,47" fill="#3b82f6"/>
      <text x="71" y="90" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6.5">youtube.com/partido</text>
      <rect x="138" y="10" width="70" height="120" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <text x="173" y="23" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontWeight="bold">EVENTOS EN VIVO</text>
      {[["Pase completado","#00e87a",34],["Disparo al arco","#f59e0b",50],["Intercepción","#3b82f6",66],["Falta cometida","#ef4444",82],["Recuperación","#8b5cf6",98]].map(([l,c,y],i)=>(
        <g key={i}><rect x="141" y={y-9} width="64" height="14" rx="3" fill={c+"14"} stroke={c+"38"} strokeWidth="0.5"/><text x="147" y={y} fill={c} fontSize="6.5">{l}</text><rect x="196" y={y-5} width="8" height="8" rx="2" fill={c+"28"}/><text x="200" y={y} textAnchor="middle" fill={c} fontSize="6" fontWeight="bold">{i+1}</text></g>
      ))}
      <rect x="141" y="110" width="64" height="16" rx="4" fill="rgba(0,232,122,0.12)" stroke="rgba(0,232,122,0.35)" strokeWidth="1"/>
      <text x="173" y="119" textAnchor="middle" fill="#00e87a" fontSize="6.5" fontWeight="bold">NOTA AJUSTADA: 8.4/10</text>
      <rect x="12" y="96" width="118" height="10" rx="3" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.05)"/>
      <text x="71" y="103" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5.5">▶  04:23 ──────────────── 88:00</text>
    </svg>)
  },
  { icon:<IconKanban/>, color:"#8b5cf6",
    titulo:"Pipeline de fichajes estilo Kanban",
    desc:"Gestione el proceso completo de contratación en vista kanban: En Radar, Observando, Destacado, Negociando y Fichado. Múltiples scouts colaborando en el mismo club en tiempo real.",
    stats:[{v:"5",l:"Etapas"},{v:"∞",l:"Jugadores"},{v:"Multi",l:"Usuarios"}],
    svg:(<svg viewBox="0 0 220 130" style={{width:"100%",maxWidth:260,display:"block",margin:"0 auto"}}>
      {[["Radar","#64748b",8],["Observando","#3b82f6",52],["Destacado","#f59e0b",98],["Fichado","#00e87a",154]].map(([t,c,x])=>(
        <g key={x}><rect x={x} y="8" width="40" height="114" rx="5" fill={c+"07"} stroke={c+"20"} strokeWidth="1"/><text x={x+20} y="20" textAnchor="middle" fill={c} fontSize="6.5" fontWeight="bold">{t}</text></g>
      ))}
      {[[8,"M. Rodríguez","Extremo","#64748b",28],[8,"F. González","Arquero","#64748b",54],[52,"C. Morales","Delantero","#3b82f6",28],[52,"P. Silva","Lateral","#3b82f6",54],[98,"A. Torres","Volante","#f59e0b",28],[154,"J. Méndez","Defensor","#00e87a",28]].map(([x,n,p,c,y])=>(
        <g key={n}><rect x={x+2} y={y} width="36" height="22" rx="3" fill={c+"14"} stroke={c+"38"} strokeWidth="0.5"/><text x={x+6} y={y+10} fill={c} fontSize="6" fontWeight="600">{n.split(" ")[0]+" "+n.split(" ")[1][0]+"."}</text><text x={x+6} y={y+19} fill={c+"88"} fontSize="5">{p}</text></g>
      ))}
      <rect x="136" y="8" width="16" height="114" rx="5" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.18)" strokeWidth="1"/>
      <text x="144" y="20" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontWeight="bold">Negoc.</text>
      <rect x="138" y="26" width="12" height="22" rx="3" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth="0.5"/>
      <text x="144" y="36" textAnchor="middle" fill="#ef4444" fontSize="5">R. Var</text>
      <text x="144" y="44" textAnchor="middle" fill="rgba(239,68,68,0.55)" fontSize="4.5">MCD</text>
    </svg>)
  },
  { icon:<IconTactics/>, color:"#f59e0b",
    titulo:"Análisis táctico del rival con IA",
    desc:"Seleccione cualquier rival de los 255 clubes reales sudamericanos. La IA detecta debilidades, recomienda el once ideal y genera la estrategia completa para ganar el partido.",
    stats:[{v:"255",l:"Clubes reales"},{v:"9",l:"Formaciones"},{v:"10",l:"Países"}],
    svg:(<svg viewBox="0 0 220 140" style={{width:"100%",maxWidth:260,display:"block",margin:"0 auto"}}>
      <rect x="10" y="8" width="85" height="124" rx="5" fill="#0d2b1e"/>
      {[0,1,2,3,4,5,6].map(i=><rect key={i} x="10" y={8+i*18} width="85" height="9" fill={i%2?"#0f3224":"#0d2b1e"} opacity="0.7"/>)}
      <rect x="11" y="9" width="83" height="122" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <line x1="11" y1="70" x2="94" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="52" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      {[[52,124,""],[28,100,"LD"],[43,100,"DC"],[61,100,"DC"],[76,100,"LI"],[28,70,"MC"],[52,70,"MC"],[76,70,"MC"],[37,44,"DEL"],[67,44,"DEL"]].map(([x,y,r],i)=>(
        <g key={i}><circle cx={x} cy={y} r="5" fill={i===0?"#f59e0b":"#00e87a"} stroke="rgba(0,0,0,0.4)" strokeWidth="0.7"/><text x={x} y={y+8} textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="2.8" fontWeight="bold">{r}</text></g>
      ))}
      <text x="52" y="8" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="4">4-3-3</text>
      <rect x="104" y="8" width="106" height="124" rx="5" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
      <text x="157" y="22" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontWeight="bold">ANÁLISIS IA DEL RIVAL</text>
      {["⚠ Lateral derecho débil","✓ Explotar bandas laterales","⚡ Presión alta efectiva","→ Mediapunta libre central","✓ Probabilidad victoria: 68%"].map((t,i)=>(
        <g key={i}><rect x="107" y={30+i*19} width="100" height="14" rx="3" fill={i===4?"rgba(0,232,122,0.1)":"rgba(245,158,11,0.07)"} stroke={i===4?"rgba(0,232,122,0.25)":"rgba(245,158,11,0.15)"} strokeWidth="0.5"/><text x="112" y={41+i*19} fill={i===4?"#00e87a":"rgba(245,158,11,0.85)"} fontSize="5.5">{t}</text></g>
      ))}
    </svg>)
  },
  { icon:<IconChart/>, color:"#ec4899",
    titulo:"Evolución y progresión de cada jugador",
    desc:"Seguimiento completo del historial a lo largo de la temporada. Gráficos de tendencia, alertas automáticas de mejora o declive, y proyección con IA sobre el potencial del jugador.",
    stats:[{v:"∞",l:"Historial"},{v:"7",l:"Dimensiones"},{v:"IA",l:"Proyección"}],
    svg:(<svg viewBox="0 0 220 130" style={{width:"100%",maxWidth:260,display:"block",margin:"0 auto"}}>
      <rect x="10" y="8" width="200" height="112" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      <text x="110" y="22" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7" fontWeight="bold">EVOLUCIÓN — M. Rodríguez · Extremo</text>
      {[0,2,4,6,8,10].map(v=><g key={v}><line x1="28" y1={96-v*7} x2="205" y2={96-v*7} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/><text x="23" y={100-v*7} textAnchor="end" fill="rgba(255,255,255,0.18)" fontSize="5">{v}</text></g>)}
      <defs><linearGradient id="pg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.3"/><stop offset="100%" stopColor="#ec4899" stopOpacity="0"/></linearGradient></defs>
      <polygon points="32,90 58,82 84,70 110,66 136,58 162,50 188,42 188,96 32,96" fill="url(#pg)"/>
      <polyline points="32,90 58,82 84,70 110,66 136,58 162,50 188,42" fill="none" stroke="#ec4899" strokeWidth="2"/>
      {[[32,90],[58,82],[84,70],[110,66],[136,58],[162,50],[188,42]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill="#ec4899" stroke="#040a0f" strokeWidth="1.2"/>)}
      {["Ago","Sep","Oct","Nov","Dic","Ene","Feb"].map((m,i)=><text key={i} x={32+i*26} y="113" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5.5">{m}</text>)}
      <rect x="128" y="28" width="72" height="20" rx="4" fill="rgba(0,232,122,0.08)" stroke="rgba(0,232,122,0.2)" strokeWidth="0.5"/>
      <text x="164" y="38" textAnchor="middle" fill="#00e87a" fontSize="7" fontWeight="bold">📈 MEJORANDO</text>
      <text x="164" y="46" textAnchor="middle" fill="rgba(0,232,122,0.5)" fontSize="5.5">+1.8 pts últimos 3 partidos</text>
    </svg>)
  }
];

const IS = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 40px 12px 42px", color:"#eef2f6", fontSize:14, width:"100%", outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border .2s, background .2s" };

export default function Auth() {
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [showP, setShowP]     = useState(false);
  const [load, setLoad]       = useState(false);
  const [err, setErr]         = useState("");
  const [forgot, setForgot]   = useState(false);
  const [ok, setOk]           = useState("");
  const [fi, setFi]           = useState(0);
  const [out, setOut]         = useState(false);
  const timer                 = useRef(null);

  useEffect(() => {
    timer.current = setInterval(next, 5500);
    return () => clearInterval(timer.current);
  }, [fi]);

  function go(idx) { clearInterval(timer.current); setOut(true); setTimeout(()=>{ setFi(idx); setOut(false); },290); }
  function next() { go((fi+1)%FEATS.length); }
  function prev() { go((fi-1+FEATS.length)%FEATS.length); }

  async function login(e) {
    e.preventDefault(); setLoad(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password:pass });
    if (error) setErr("Email o contraseña incorrectos. Si no tiene cuenta solicite acceso al administrador.");
    setLoad(false);
  }

  async function recover(e) {
    e.preventDefault(); if(!email){setErr("Ingrese su email");return;}
    setLoad(true); setErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo:"https://fichascout.com" });
    if (error) setErr(error.message); else setOk("Revise su correo para recuperar su contraseña.");
    setLoad(false);
  }

  const f = FEATS[fi];

  return (
    <div style={{minHeight:"100vh",height:"100vh",background:"#040a0f",display:"flex",fontFamily:"system-ui,-apple-system,sans-serif",color:"#eef2f6",overflow:"hidden",position:"fixed",inset:0}}>
      <style>{`
        *{box-sizing:border-box}
        html,body{height:100%;overflow:hidden}
        input::placeholder{color:#1a2e3d}
        input:focus{border-color:rgba(0,232,122,0.5)!important;background:rgba(255,255,255,0.07)!important}
        .fin{animation:fin .35s cubic-bezier(.16,1,.3,1) both}
        .fout{animation:fout .28s ease both}
        @keyframes fin{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fout{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-18px)}}
        .btn-go{border:none;borderRadius:10px;padding:13px;color:#000;font-weight:700;cursor:pointer;font-size:14px;background:linear-gradient(135deg,#00e87a,#00c96a);font-family:inherit;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s}
        .btn-go:hover:not(:disabled){background:#1af080!important;transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,232,122,.28)}
        .btn-go:active{transform:translateY(0)}
        .arr{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.35);transition:all .2s}
        .arr:hover{background:rgba(255,255,255,0.1);color:#fff}
        .dot{border:none;padding:0;cursor:pointer;transition:all .3s;border-radius:4px}
        .dot:hover{transform:scale(1.4)}
        .lnk{background:none;border:none;color:#00e87a;cursor:pointer;font-family:inherit;font-size:13px;padding:0;text-decoration:underline}
        .lnk:hover{color:#1af080}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){.lp{display:none!important}.rp{width:100%!important;max-width:100%!important;border-left:none!important}}
      `}</style>

      {/* ══ PANEL IZQUIERDO — ocupa toda la altura ══ */}
      <div className="lp" style={{flex:1,position:"relative",display:"flex",flexDirection:"column",overflow:"hidden",height:"100vh"}}>
        {/* Fondo */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#040a0f 0%,#06121e 55%,#040d18 100%)"}}/>
        <div style={{position:"absolute",top:"15%",left:"20%",width:"60%",height:"55%",background:`radial-gradient(ellipse,${f.color}08 0%,transparent 70%)`,transition:"background 1.2s",pointerEvents:"none",borderRadius:"50%"}}/>
        <div style={{position:"absolute",bottom:"10%",right:"5%",width:"30%",height:"30%",background:"radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)",pointerEvents:"none",borderRadius:"50%"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 100 100" preserveAspectRatio="none">
          {[10,20,30,40,50,60,70,80,90].map(v=><g key={v}><line x1={v} y1="0" x2={v} y2="100" stroke="rgba(0,232,122,0.025)" strokeWidth="0.2"/><line x1="0" y1={v} x2="100" y2={v} stroke="rgba(0,232,122,0.025)" strokeWidth="0.2"/></g>)}
        </svg>

        {/* Contenido — flex column que ocupa 100% height */}
        <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",padding:"36px 52px"}}>

          {/* ── LOGO (fijo arriba) ── */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:36,flexShrink:0}}>
            <div style={{width:42,height:42,borderRadius:11,background:"#07111a",border:`1.5px solid ${f.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 0 20px ${f.color}18`,transition:"border-color .8s,box-shadow .8s",flexShrink:0}}>⚽</div>
            <div>
              <div style={{fontWeight:800,fontSize:18,letterSpacing:"-0.3px"}}>Ficha<span style={{color:"#00e87a"}}>Scout</span></div>
              <div style={{fontSize:9,color:"#1a2e3d",letterSpacing:"1.8px"}}>PLATAFORMA DE SCOUTING</div>
            </div>
          </div>

          {/* ── FEATURE SHOWCASE (flex:1 — toma todo el espacio del medio) ── */}
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",minHeight:0}}>
            <div className={out?"fout":"fin"} key={fi} style={{display:"flex",flexDirection:"column"}}>

              {/* Icono */}
              <div style={{width:52,height:52,borderRadius:14,background:`${f.color}10`,border:`1.5px solid ${f.color}28`,display:"flex",alignItems:"center",justifyContent:"center",color:f.color,marginBottom:18,flexShrink:0}}>
                {f.icon}
              </div>

              {/* Título */}
              <div style={{fontWeight:800,fontSize:24,letterSpacing:"-0.6px",lineHeight:1.2,marginBottom:12,color:"#eef2f6"}}>{f.titulo}</div>

              {/* Descripción */}
              <div style={{color:"#3a5060",fontSize:14,lineHeight:1.7,marginBottom:20}}>{f.desc}</div>

              {/* Stats */}
              <div style={{display:"flex",gap:20,marginBottom:22,flexShrink:0}}>
                {f.stats.map((s,i)=>(
                  <div key={i} style={{borderLeft:`2px solid ${f.color}35`,paddingLeft:12}}>
                    <div style={{fontWeight:800,fontSize:17,color:f.color}}>{s.v}</div>
                    <div style={{fontSize:10,color:"#1a2e3d",marginTop:1}}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Preview SVG */}
              <div style={{background:"rgba(255,255,255,0.025)",border:`1px solid ${f.color}12`,borderRadius:14,padding:"18px 14px",flexShrink:0}}>
                {f.svg}
              </div>
            </div>

            {/* Dots navigation */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:22,flexShrink:0}}>
              <button className="arr" onClick={prev}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
              <div style={{flex:1,display:"flex",gap:6,justifyContent:"center"}}>
                {FEATS.map((_,i)=>(
                  <button key={i} className="dot" onClick={()=>go(i)} style={{width:i===fi?22:6,height:6,background:i===fi?f.color:"rgba(255,255,255,0.1)"}}/>
                ))}
              </div>
              <button className="arr" onClick={next}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
          </div>

          {/* ── STATS BOTTOM (fijo abajo) ── */}
          <div style={{display:"flex",gap:24,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.05)",marginTop:24,flexShrink:0}}>
            {[["4.000+","Jugadores pro"],["255","Clubes SA"],["10","Países"],["IA","Análisis"]].map(([v,l])=>(
              <div key={l}>
                <div style={{fontWeight:700,fontSize:15,color:"#eef2f6"}}>{v}</div>
                <div style={{fontSize:10,color:"#1a2e3d"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ PANEL DERECHO — SOLO LOGIN ══ */}
      <div className="rp" style={{width:420,maxWidth:"100%",background:"#06101a",borderLeft:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 42px",height:"100vh",overflowY:"auto"}}>
        <div style={{width:"100%"}}>
          {!forgot ? (
            <>
              <div style={{marginBottom:28}}>
                <div style={{fontWeight:800,fontSize:24,letterSpacing:"-0.5px",color:"#eef2f6",marginBottom:5}}>Acceder a la plataforma</div>
                <div style={{color:"#1a2e3d",fontSize:14}}>Ingrese con sus credenciales de FichaScout</div>
              </div>

              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.14)",borderRadius:10,marginBottom:22}}>
                <div style={{color:"#f59e0b",flexShrink:0,display:"flex"}}><IconShield/></div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#f59e0b"}}>Acceso restringido</div>
                  <div style={{fontSize:11,color:"#5a4010"}}>Las cuentas son creadas exclusivamente por el administrador</div>
                </div>
              </div>

              <form onSubmit={login}>
                <div style={{marginBottom:13}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1a2e3d",letterSpacing:"0.8px",marginBottom:6}}>CORREO ELECTRÓNICO</div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1a2e3d",display:"flex",pointerEvents:"none"}}><IconMail/></div>
                    <input style={IS} type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a2e3d",letterSpacing:"0.8px"}}>CONTRASEÑA</div>
                    <button type="button" className="lnk" style={{fontSize:12}} onClick={()=>{setForgot(true);setErr("");}}>¿Olvidó su contraseña?</button>
                  </div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1a2e3d",display:"flex",pointerEvents:"none"}}><IconLock/></div>
                    <input style={{...IS,paddingRight:44}} type={showP?"text":"password"} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} required/>
                    <button type="button" onClick={()=>setShowP(s=>!s)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#1a2e3d",display:"flex",padding:0}}>{showP?<IconEyeOff/>:<IconEye/>}</button>
                  </div>
                </div>

                {err && <div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.16)",borderRadius:10,padding:"11px 14px",marginBottom:16,fontSize:13,color:"#fca5a5",lineHeight:1.5}}>⚠ {err}</div>}

                <button type="submit" disabled={load} className="btn-go" style={{background:"linear-gradient(135deg,#00e87a,#00c96a)",borderRadius:10,opacity:load?0.7:1,cursor:load?"not-allowed":"pointer"}}>
                  {load ? (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Verificando...</>) : (<>Ingresar a FichaScout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M13 18l6-6"/><path d="M13 6l6 6"/></svg></>)}
                </button>
              </form>

              <div style={{margin:"22px 0",display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:"0.5px",background:"rgba(255,255,255,0.05)"}}/>
                <div style={{fontSize:11,color:"#0d1e28"}}>¿Sin acceso?</div>
                <div style={{flex:1,height:"0.5px",background:"rgba(255,255,255,0.05)"}}/>
              </div>

              <div style={{padding:"14px 16px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:13,color:"#1a2e3d",lineHeight:1.7}}>Las cuentas son gestionadas por el administrador.<br/><span style={{color:"#0d1e28"}}>Contacte a su club para solicitar acceso.</span></div>
              </div>
            </>
          ) : (
            <>
              <button onClick={()=>{setForgot(false);setErr("");setOk("");}} style={{background:"none",border:"none",color:"#1a2e3d",cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,marginBottom:24,padding:0}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Volver al inicio de sesión
              </button>
              <div style={{marginBottom:26}}>
                <div style={{fontWeight:800,fontSize:23,color:"#eef2f6",marginBottom:5}}>Recuperar contraseña</div>
                <div style={{color:"#1a2e3d",fontSize:14}}>Le enviaremos un enlace a su correo electrónico</div>
              </div>
              <form onSubmit={recover}>
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1a2e3d",letterSpacing:"0.8px",marginBottom:6}}>CORREO ELECTRÓNICO</div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1a2e3d",display:"flex",pointerEvents:"none"}}><IconMail/></div>
                    <input style={IS} type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                </div>
                {err && <div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.16)",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,color:"#fca5a5"}}>⚠ {err}</div>}
                {ok  && <div style={{background:"rgba(0,232,122,0.07)",border:"1px solid rgba(0,232,122,0.18)",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,color:"#6ee7b7"}}>✅ {ok}</div>}
                <button type="submit" disabled={load} className="btn-go" style={{background:"linear-gradient(135deg,#00e87a,#00c96a)",borderRadius:10,opacity:load?0.7:1,cursor:load?"not-allowed":"pointer"}}>
                  {load?"⏳ Enviando...":"Enviar enlace de recuperación"}
                </button>
              </form>
            </>
          )}

          <div style={{marginTop:22,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <div style={{color:"#0d1e28",display:"flex"}}><IconLock/></div>
            <div style={{fontSize:11,color:"#0d1e28"}}>Cifrado SSL · Seguridad Supabase</div>
          </div>
        </div>
      </div>
    </div>
  );
}

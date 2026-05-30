import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const IconRadar = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 3l0 4"/><path d="M12 17l0 4"/><path d="M3 12l4 0"/><path d="M17 12l4 0"/></svg>);
const IconVideo = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553 -2.369a1 1 0 0 1 1.447 .894v6.95a1 1 0 0 1 -1.447 .894l-4.553 -2.369v-4z"/><rect x="3" y="6" width="12" height="12" rx="2"/></svg>);
const IconKanban = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/><path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/></svg>);
const IconTactics = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>);
const IconChart = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M20 9l-5 5l-4 -4l-3 3"/></svg>);
const IconShield = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/><path d="M9 12l2 2l4 -4"/></svg>);
const IconEye = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/></svg>);
const IconEyeOff = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"/><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c3.6 0 6.6 2 9 6c-.853 1.422 -1.8 2.614 -2.83 3.575m-2.122 1.568c-1.24 .61 -2.608 .857 -4.048 .857c-3.6 0 -6.6 -2 -9 -6c.893 -1.488 1.891 -2.717 2.983 -3.668"/></svg>);
const IconLock = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M8 11v-4a4 4 0 0 1 8 0v4"/></svg>);
const IconMail = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6l9 -6"/></svg>);

const FEATURES = [
  { icon:<IconRadar/>, color:"#00e87a", titulo:"Comparación con profesionales reales",
    desc:"Compare cualquier jugador amateur contra 4.000+ profesionales de las 30 ligas sudamericanas. Radar chart en 7 dimensiones: ofensivo, defensivo, técnico, físico, consistencia, presión y progresión.",
    stats:[{v:"4.000+",l:"Jugadores pro"},{v:"30",l:"Ligas SA"},{v:"7",l:"Dimensiones"}],
    preview:(<svg viewBox="0 0 200 160" style={{width:"100%",maxWidth:240,display:"block",margin:"0 auto"}}><circle cx="100" cy="80" r="60" fill="none" stroke="rgba(0,232,122,0.1)" strokeWidth="1"/><circle cx="100" cy="80" r="40" fill="none" stroke="rgba(0,232,122,0.1)" strokeWidth="1"/><circle cx="100" cy="80" r="20" fill="none" stroke="rgba(0,232,122,0.1)" strokeWidth="1"/>{[[100,20],[143,50],[143,110],[100,140],[57,110],[57,50]].map((p,i)=><line key={i} x1="100" y1="80" x2={p[0]} y2={p[1]} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}<polygon points="100,34 136,56 136,104 100,126 64,104 64,56" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.5)" strokeWidth="1"/><polygon points="100,44 128,62 128,98 100,116 72,98 72,62" fill="rgba(0,232,122,0.2)" stroke="#00e87a" strokeWidth="1.5"/>{[["Ofensivo",100,16],["Técnico",152,46],["Físico",152,118],["Defensivo",100,148],["Consistencia",44,118],["Presión",44,46]].map(([t,x,y],i)=><text key={i} x={x} y={y} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">{t}</text>)}<text x="80" y="84" textAnchor="middle" fill="#00e87a" fontSize="9" fontWeight="bold">7.8</text><text x="120" y="84" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">8.9</text><text x="80" y="96" textAnchor="middle" fill="rgba(0,232,122,0.6)" fontSize="7">Amateur</text><text x="120" y="96" textAnchor="middle" fill="rgba(59,130,246,0.6)" fontSize="7">Pro</text></svg>)
  },
  { icon:<IconVideo/>, color:"#3b82f6", titulo:"Scouting en video con registro en tiempo real",
    desc:"Analice partidos desde YouTube. Registre eventos por posición mientras ve el video. La IA genera informe completo con nota ajustada según la dificultad del partido (amistoso ×0.65 a final ×2.5).",
    stats:[{v:"6",l:"Tipos partido"},{v:"×2.5",l:"Factor final"},{v:"IA",l:"Informe auto"}],
    preview:(<svg viewBox="0 0 200 130" style={{width:"100%",maxWidth:240,display:"block",margin:"0 auto"}}><rect x="10" y="10" width="110" height="72" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/><rect x="14" y="14" width="102" height="60" rx="4" fill="#0d1f2d"/><circle cx="65" cy="44" r="12" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.5)" strokeWidth="1"/><polygon points="61,38 61,50 73,44" fill="#3b82f6"/><text x="65" y="82" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="6">youtube.com</text><rect x="128" y="10" width="62" height="110" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/><text x="159" y="23" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontWeight="bold">EVENTOS</text>{[["Pase OK","#00e87a",32],["Disparo","#f59e0b",46],["Intercepción","#3b82f6",60],["Falta","#ef4444",74],["Recuperación","#8b5cf6",88]].map(([l,c,y],i)=><g key={i}><rect x="131" y={y-8} width="56" height="12" rx="3" fill={c+"15"} stroke={c+"40"} strokeWidth="0.5"/><text x="137" y={y} fill={c} fontSize="6">{l}</text><rect x="178" y={y-5} width="9" height="9" rx="2" fill={c+"30"}/><text x="182.5" y={y} textAnchor="middle" fill={c} fontSize="6" fontWeight="bold">{i+1}</text></g>)}<rect x="131" y="100" width="56" height="16" rx="4" fill="rgba(0,232,122,0.12)" stroke="rgba(0,232,122,0.35)" strokeWidth="1"/><text x="159" y="109" textAnchor="middle" fill="#00e87a" fontSize="6" fontWeight="bold">NOTA AJUSTADA</text><text x="159" y="118" textAnchor="middle" fill="#00e87a" fontSize="8" fontWeight="bold">8.4/10</text></svg>)
  },
  { icon:<IconKanban/>, color:"#8b5cf6", titulo:"Pipeline de fichajes estilo Kanban",
    desc:"Gestione el proceso completo de contratación con vista kanban: En Radar → Observando → Destacado → Negociando → Fichado. Múltiples scouts colaborando en el mismo club en tiempo real.",
    stats:[{v:"5",l:"Etapas"},{v:"∞",l:"Jugadores"},{v:"Multi",l:"Usuarios"}],
    preview:(<svg viewBox="0 0 200 120" style={{width:"100%",maxWidth:240,display:"block",margin:"0 auto"}}>{[["Radar","#64748b",8],["Observ.","#3b82f6",48],["Destacado","#f59e0b",88],["Fichado","#00e87a",140]].map(([t,c,x])=><g key={x}><rect x={x} y="8" width="36" height="104" rx="5" fill={c+"08"} stroke={c+"22"} strokeWidth="1"/><text x={x+18} y="20" textAnchor="middle" fill={c} fontSize="6" fontWeight="bold">{t}</text></g>)}{[[8,"M. Rod","Extremo","#64748b",28],[8,"F. Gon","Arquero","#64748b",52],[48,"C. Mor","Del.","#3b82f6",28],[48,"P. Sil","Lateral","#3b82f6",52],[88,"A. Tor","Volante","#f59e0b",28],[140,"J. Mén","Defensor","#00e87a",28]].map(([x,n,p,c,y])=><g key={n}><rect x={x+2} y={y} width="32" height="20" rx="3" fill={c+"15"} stroke={c+"40"} strokeWidth="0.5"/><text x={x+6} y={y+9} fill={c} fontSize="5.5" fontWeight="600">{n}</text><text x={x+6} y={y+17} fill={c+"99"} fontSize="4.5">{p}</text></g>)}<rect x="118" y="8" width="20" height="104" rx="5" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.2)" strokeWidth="1"/><text x="128" y="20" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontWeight="bold">Negoc.</text><rect x="120" y="26" width="16" height="20" rx="3" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.3)" strokeWidth="0.5"/><text x="128" y="35" textAnchor="middle" fill="#ef4444" fontSize="5">R. Var</text><text x="128" y="43" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="4">MCD</text></svg>)
  },
  { icon:<IconTactics/>, color:"#f59e0b", titulo:"Análisis táctico del rival con inteligencia artificial",
    desc:"Seleccione cualquier rival de los 255 clubes reales sudamericanos. La IA analiza formaciones, detecta debilidades, recomienda el once ideal y genera estrategia completa para ganar el partido.",
    stats:[{v:"255",l:"Clubes reales"},{v:"9",l:"Formaciones"},{v:"10",l:"Países"}],
    preview:(<svg viewBox="0 0 200 130" style={{width:"100%",maxWidth:240,display:"block",margin:"0 auto"}}><rect x="8" y="8" width="80" height="114" rx="4" fill="#0d2b1e"/>{[0,1,2,3,4,5].map(i=><rect key={i} x="8" y={8+i*19} width="80" height="9.5" fill={i%2?"#0f3224":"#0d2b1e"} opacity="0.7"/>)}<rect x="9" y="9" width="78" height="112" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/><line x1="9" y1="65" x2="87" y2="65" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/><circle cx="48" cy="65" r="9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>{[[48,118,""],[25,96,"LD"],[40,96,"DC"],[56,96,"DC"],[71,96,"LI"],[25,68,"MC"],[48,68,"MC"],[71,68,"MC"],[35,40,"DEL"],[61,40,"DEL"]].map(([x,y,r],i)=><g key={i}><circle cx={x} cy={y} r="4.5" fill={i===0?"#f59e0b":"#00e87a"} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/><text x={x} y={y+7} textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="2.5" fontWeight="bold">{r}</text></g>)}<rect x="96" y="8" width="96" height="114" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/><text x="144" y="22" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="6.5" fontWeight="bold">ANÁLISIS IA DEL RIVAL</text>{["⚠ Lateral derecho débil","✓ Explotar bandas laterales","⚡ Presión alta efectiva","→ Usar mediapunta libre","✓ Probabilidad victoria: 68%"].map((t,i)=><g key={i}><rect x="99" y={30+i*18} width="90" height="13" rx="3" fill={i===4?"rgba(0,232,122,0.1)":"rgba(245,158,11,0.07)"} stroke={i===4?"rgba(0,232,122,0.3)":"rgba(245,158,11,0.15)"} strokeWidth="0.5"/><text x="104" y={40+i*18} fill={i===4?"#00e87a":"rgba(245,158,11,0.9)"} fontSize="5.5">{t}</text></g>)}</svg>)
  },
  { icon:<IconChart/>, color:"#ec4899", titulo:"Evolución y progresión del jugador",
    desc:"Seguimiento completo de cada jugador a lo largo de la temporada. Gráficos de tendencia, alertas automáticas de mejora o declive, y proyección con IA sobre su potencial de llegar al profesionalismo.",
    stats:[{v:"∞",l:"Historial"},{v:"7",l:"Dimensiones"},{v:"IA",l:"Proyección"}],
    preview:(<svg viewBox="0 0 200 120" style={{width:"100%",maxWidth:240,display:"block",margin:"0 auto"}}><rect x="10" y="8" width="180" height="104" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/><text x="100" y="22" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontWeight="bold">EVOLUCIÓN — M. Rodríguez</text>{[0,2,4,6,8,10].map(v=><g key={v}><line x1="28" y1={95-v*7} x2="185" y2={95-v*7} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/><text x="24" y={99-v*7} textAnchor="end" fill="rgba(255,255,255,0.18)" fontSize="5">{v}</text></g>)}<polyline points="32,82 55,75 78,68 101,61 124,55 147,48 170,40" fill="none" stroke="#ec4899" strokeWidth="2"/>{[[32,82],[55,75],[78,68],[101,61],[124,55],[147,48],[170,40]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill="#ec4899" stroke="#040a0f" strokeWidth="1"/>)}{["Ago","Sep","Oct","Nov","Dic","Ene","Feb"].map((m,i)=><text key={i} x={32+i*23} y="106" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5">{m}</text>)}<rect x="125" y="26" width="58" height="18" rx="3" fill="rgba(0,232,122,0.08)" stroke="rgba(0,232,122,0.2)" strokeWidth="0.5"/><text x="154" y="35" textAnchor="middle" fill="#00e87a" fontSize="6.5" fontWeight="bold">📈 MEJORANDO</text><text x="154" y="43" textAnchor="middle" fill="rgba(0,232,122,0.5)" fontSize="5">+1.8 últimos 3 partidos</text></svg>)
  }
];

const IS = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 40px 12px 42px", color:"#eef2f6", fontSize:14, width:"100%", outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border .2s, background .2s" };

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [success, setSuccess] = useState("");
  const [feat, setFeat] = useState(0);
  const [anim, setAnim] = useState("in");
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => changeFeat((feat+1)%FEATURES.length), 5500);
    return () => clearInterval(timerRef.current);
  }, [feat]);

  function changeFeat(idx) {
    clearInterval(timerRef.current);
    setAnim("out");
    setTimeout(() => { setFeat(idx); setAnim("in"); }, 300);
  }

  async function handleLogin(e) {
    e.preventDefault(); setLoad(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Email o contraseña incorrectos. Contacte al administrador si no tiene cuenta.");
    setLoad(false);
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (!email) { setError("Ingrese su email"); return; }
    setLoad(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo:"https://fichascout.com" });
    if (error) setError(error.message);
    else setSuccess("Revise su correo para recuperar su contraseña.");
    setLoad(false);
  }

  const f = FEATURES[feat];

  return (
    <div style={{minHeight:"100vh",background:"#040a0f",display:"flex",fontFamily:"system-ui,-apple-system,sans-serif",color:"#eef2f6",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box}
        input::placeholder{color:#1e3040}
        input:focus{border-color:rgba(0,232,122,0.5)!important;background:rgba(255,255,255,0.07)!important}
        .fanin{animation:fanin .35s cubic-bezier(.16,1,.3,1) forwards}
        .fanout{animation:fanout .28s ease forwards}
        @keyframes fanin{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fanout{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-16px)}}
        .btn-primary{transition:all .2s}
        .btn-primary:hover{background:#1af080!important;transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,232,122,.3)!important}
        .btn-primary:active{transform:translateY(0)}
        .dot-btn{border:none;padding:0;cursor:pointer;transition:all .3s}
        .dot-btn:hover{transform:scale(1.4)}
        .arr-btn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.35);transition:all .2s}
        .arr-btn:hover{background:rgba(255,255,255,0.1);color:#fff}
        .lnk{background:none;border:none;color:#00e87a;cursor:pointer;font-family:inherit;font-size:13px;padding:0;text-decoration:underline}
        .lnk:hover{color:#1af080}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){.left-panel{display:none!important}.right-panel{width:100%!important;max-width:100%!important;border-left:none!important}}
      `}</style>

      {/* ─ PANEL IZQUIERDO ─ */}
      <div className="left-panel" style={{flex:1,position:"relative",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#040a0f 0%,#06121e 60%,#040a0f 100%)"}}/>
        <div style={{position:"absolute",top:"5%",left:"15%",width:500,height:500,background:`radial-gradient(circle,${f.color}07 0%,transparent 65%)`,borderRadius:"50%",transition:"background 1.2s",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:350,height:350,background:"radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.5,pointerEvents:"none"}} viewBox="0 0 100 100" preserveAspectRatio="none">
          {[10,20,30,40,50,60,70,80,90].map(v=><g key={v}><line x1={v} y1="0" x2={v} y2="100" stroke="rgba(0,232,122,0.025)" strokeWidth="0.2"/><line x1="0" y1={v} x2="100" y2={v} stroke="rgba(0,232,122,0.025)" strokeWidth="0.2"/></g>)}
        </svg>

        <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",padding:"40px 52px"}}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"auto",paddingBottom:32}}>
            <div style={{width:42,height:42,borderRadius:11,background:"#07111a",border:`1.5px solid ${f.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 0 20px ${f.color}18`,transition:"border-color .8s,box-shadow .8s"}}>⚽</div>
            <div>
              <div style={{fontWeight:800,fontSize:19,letterSpacing:"-0.3px"}}>Ficha<span style={{color:"#00e87a"}}>Scout</span></div>
              <div style={{fontSize:9,color:"#1e3040",letterSpacing:"1.8px",marginTop:1}}>PLATAFORMA DE SCOUTING</div>
            </div>
          </div>

          {/* Feature showcase */}
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:500}}>
            <div className={`f${anim==="in"?"anin":"anout"}`} key={feat} style={{marginBottom:28}}>
              <div style={{width:54,height:54,borderRadius:15,background:`${f.color}10`,border:`1.5px solid ${f.color}28`,display:"flex",alignItems:"center",justifyContent:"center",color:f.color,marginBottom:18}}>
                {f.icon}
              </div>
              <div style={{fontWeight:800,fontSize:26,letterSpacing:"-0.7px",lineHeight:1.15,marginBottom:12,color:"#eef2f6"}}>{f.titulo}</div>
              <div style={{color:"#3a5060",fontSize:15,lineHeight:1.7,marginBottom:22}}>{f.desc}</div>
              <div style={{display:"flex",gap:20,marginBottom:24}}>
                {f.stats.map((s,i)=>(
                  <div key={i} style={{borderLeft:`2px solid ${f.color}35`,paddingLeft:12}}>
                    <div style={{fontWeight:800,fontSize:18,color:f.color}}>{s.v}</div>
                    <div style={{fontSize:10,color:"#2a3f50",marginTop:1}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,0.025)",border:`1px solid ${f.color}12`,borderRadius:14,padding:"18px 14px"}}>
                {f.preview}
              </div>
            </div>

            {/* Navigation dots */}
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button className="arr-btn" onClick={()=>changeFeat((feat-1+FEATURES.length)%FEATURES.length)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div style={{display:"flex",gap:6,flex:1,justifyContent:"center"}}>
                {FEATURES.map((_,i)=>(
                  <button key={i} className="dot-btn" onClick={()=>changeFeat(i)} style={{width:i===feat?22:6,height:6,borderRadius:3,background:i===feat?f.color:"rgba(255,255,255,0.1)"}}/>
                ))}
              </div>
              <button className="arr-btn" onClick={()=>changeFeat((feat+1)%FEATURES.length)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Bottom stats */}
          <div style={{display:"flex",gap:24,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
            {[["4.000+","Jugadores pro"],["255","Clubes SA"],["10","Países"],["IA","Análisis"]].map(([v,l])=>(
              <div key={l}>
                <div style={{fontWeight:700,fontSize:15,color:"#eef2f6"}}>{v}</div>
                <div style={{fontSize:10,color:"#1e3040"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─ PANEL DERECHO — SOLO LOGIN ─ */}
      <div className="right-panel" style={{width:420,maxWidth:"100%",background:"#06101a",borderLeft:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 42px",minHeight:"100vh"}}>
        <div style={{width:"100%"}}>
          {!forgot ? (
            <>
              <div style={{marginBottom:28}}>
                <div style={{fontWeight:800,fontSize:25,letterSpacing:"-0.5px",color:"#eef2f6",marginBottom:5}}>Acceder a la plataforma</div>
                <div style={{color:"#1e3040",fontSize:14}}>Ingrese con sus credenciales de FichaScout</div>
              </div>

              {/* Acceso restringido */}
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:10,marginBottom:22}}>
                <div style={{color:"#f59e0b",flexShrink:0,display:"flex"}}><IconShield/></div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#f59e0b"}}>Acceso restringido</div>
                  <div style={{fontSize:11,color:"#6b4f10"}}>Las cuentas son creadas exclusivamente por el administrador</div>
                </div>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{marginBottom:13}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1e3040",letterSpacing:"0.8px",marginBottom:6}}>CORREO ELECTRÓNICO</div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1e3040",display:"flex",pointerEvents:"none"}}><IconMail/></div>
                    <input style={IS} type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1e3040",letterSpacing:"0.8px"}}>CONTRASEÑA</div>
                    <button type="button" className="lnk" style={{fontSize:12}} onClick={()=>{setForgot(true);setError("");}}>¿Olvidó su contraseña?</button>
                  </div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1e3040",display:"flex",pointerEvents:"none"}}><IconLock/></div>
                    <input style={{...IS,paddingRight:44}} type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
                    <button type="button" onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#1e3040",display:"flex",padding:0}}>{showPass?<IconEyeOff/>:<IconEye/>}</button>
                  </div>
                </div>
                {error&&<div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:10,padding:"11px 14px",marginBottom:16,fontSize:13,color:"#fca5a5",lineHeight:1.5}}>⚠ {error}</div>}
                <button type="submit" disabled={load} className="btn-primary" style={{width:"100%",border:"none",borderRadius:10,padding:"13px",color:"#000",fontWeight:700,cursor:load?"not-allowed":"pointer",fontSize:14,background:"linear-gradient(135deg,#00e87a,#00c96a)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10,opacity:load?0.7:1}}>
                  {load?(<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Verificando...</>):(<>Ingresar a FichaScout <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M13 18l6-6"/><path d="M13 6l6 6"/></svg></>)}
                </button>
              </form>

              <div style={{margin:"22px 0",display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:"0.5px",background:"rgba(255,255,255,0.06)"}}/>
                <div style={{fontSize:11,color:"#0e1e28"}}>¿No tiene acceso?</div>
                <div style={{flex:1,height:"0.5px",background:"rgba(255,255,255,0.06)"}}/>
              </div>

              <div style={{padding:"14px 16px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:13,color:"#1e3040",lineHeight:1.65}}>
                  Las cuentas son gestionadas por el administrador.<br/>
                  <span style={{color:"#0e1e28"}}>Contacte a su club para solicitar acceso.</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={()=>{setForgot(false);setError("");setSuccess("");}} style={{background:"none",border:"none",color:"#1e3040",cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,marginBottom:24,padding:0}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Volver al inicio de sesión
              </button>
              <div style={{marginBottom:26}}>
                <div style={{fontWeight:800,fontSize:23,color:"#eef2f6",marginBottom:5}}>Recuperar contraseña</div>
                <div style={{color:"#1e3040",fontSize:14}}>Le enviaremos un enlace a su correo electrónico</div>
              </div>
              <form onSubmit={handleForgot}>
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1e3040",letterSpacing:"0.8px",marginBottom:6}}>CORREO ELECTRÓNICO</div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1e3040",display:"flex",pointerEvents:"none"}}><IconMail/></div>
                    <input style={IS} type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                </div>
                {error&&<div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,color:"#fca5a5"}}>⚠ {error}</div>}
                {success&&<div style={{background:"rgba(0,232,122,0.07)",border:"1px solid rgba(0,232,122,0.2)",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,color:"#6ee7b7"}}>✅ {success}</div>}
                <button type="submit" disabled={load} className="btn-primary" style={{width:"100%",border:"none",borderRadius:10,padding:"13px",color:"#000",fontWeight:700,cursor:load?"not-allowed":"pointer",fontSize:14,background:"linear-gradient(135deg,#00e87a,#00c96a)",fontFamily:"inherit",opacity:load?0.7:1}}>
                  {load?"⏳ Enviando...":"Enviar enlace de recuperación"}
                </button>
              </form>
            </>
          )}
          <div style={{marginTop:24,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <div style={{color:"#0e1e28",display:"flex"}}><IconLock/></div>
            <div style={{fontSize:11,color:"#0e1e28"}}>Cifrado SSL · Seguridad Supabase</div>
          </div>
        </div>
      </div>
    </div>
  );
}

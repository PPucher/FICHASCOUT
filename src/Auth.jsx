import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

// ─── ICONOS SVG ───────────────────────────────────────────────────────────────
const IcoRadar = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 3l0 4"/><path d="M3 12l4 0"/></svg>);
const IcoVideo = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553 -2.369a1 1 0 0 1 1.447 .894v6.95a1 1 0 0 1 -1.447 .894l-4.553 -2.369v-4z"/><rect x="3" y="6" width="12" height="12" rx="2"/></svg>);
const IcoKanban = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/><path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/></svg>);
const IcoTactics = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>);
const IcoChart = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M20 9l-5 5l-4 -4l-3 3"/></svg>);
const IcoShield = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/><path d="M9 12l2 2l4 -4"/></svg>);
const IcoEye = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/></svg>);
const IcoEyeOff = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"/><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c3.6 0 6.6 2 9 6c-.853 1.422 -1.8 2.614 -2.83 3.575m-2.122 1.568c-1.24 .61 -2.608 .857 -4.048 .857c-3.6 0 -6.6 -2 -9 -6c.893 -1.488 1.891 -2.717 2.983 -3.668"/></svg>);
const IcoLock = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M8 11v-4a4 4 0 0 1 8 0v4"/></svg>);
const IcoMail = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6l9 -6"/></svg>);
const IcoArrow = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M13 18l6-6"/><path d="M13 6l6 6"/></svg>);

// ─── FEATURES para el carrusel del login ─────────────────────────────────────
const FEATS = [
  { icon:<IcoRadar/>, color:"#00e87a", titulo:"Comparación con profesionales reales",
    desc:"Compare hasta 4 jugadores del mismo puesto de cualquier liga del mundo. Radar chart en 7 dimensiones: ofensivo, defensivo, técnico, físico, consistencia, presión y progresión.",
    stats:[{v:"10K+",l:"Jugadores"},{v:"80+",l:"Ligas"},{v:"7",l:"Dimensiones"}] },
  { icon:<IcoVideo/>, color:"#3b82f6", titulo:"Scouting en video con registro en tiempo real",
    desc:"Analice partidos desde YouTube. Registre eventos por posición mientras ve el video. La IA genera informe completo con nota ajustada según dificultad del partido.",
    stats:[{v:"6",l:"Tipos"},{v:"×2.5",l:"Factor final"},{v:"IA",l:"Informe"}] },
  { icon:<IcoKanban/>, color:"#8b5cf6", titulo:"Pipeline de fichajes estilo Kanban",
    desc:"Gestione el proceso completo: En Radar → Observando → Destacado → Negociando → Fichado. Múltiples scouts colaborando en tiempo real.",
    stats:[{v:"5",l:"Etapas"},{v:"∞",l:"Jugadores"},{v:"Multi",l:"Usuarios"}] },
  { icon:<IcoTactics/>, color:"#f59e0b", titulo:"Análisis táctico del rival con IA",
    desc:"255 clubes reales sudamericanos. La IA detecta debilidades del rival, recomienda el once ideal y genera estrategia completa para ganar el partido.",
    stats:[{v:"255",l:"Clubes"},{v:"9",l:"Formaciones"},{v:"10",l:"Países"}] },
  { icon:<IcoChart/>, color:"#ec4899", titulo:"Evolución y progresión del jugador",
    desc:"Seguimiento completo a lo largo de la temporada. Alertas automáticas de mejora o declive, y proyección con IA sobre potencial del jugador.",
    stats:[{v:"∞",l:"Historial"},{v:"7",l:"Dimensiones"},{v:"IA",l:"Proyección"}] },
];

// ─── INPUT STYLES ─────────────────────────────────────────────────────────────
const IS = {
  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
  borderRadius:10, padding:"12px 40px 12px 42px", color:"#eef2f6", fontSize:14,
  width:"100%", outline:"none", boxSizing:"border-box", fontFamily:"inherit",
  transition:"border .2s, background .2s"
};

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onLogin }) {
  const features = [
    { n:"01", icon:"⚖️", c:"#00e87a", t:"Comparador Scout Mundial", d:"Compara hasta 4 jugadores del mismo puesto de cualquier liga del mundo. Radar chart en 7 dimensiones y PDF profesional." },
    { n:"02", icon:"🎬", c:"#3b82f6", t:"Scouting en Video", d:"Analice partidos de YouTube en tiempo real. Nota ajustada por dificultad — amistoso ×0.65, final ×2.5." },
    { n:"03", icon:"⚔️", c:"#f59e0b", t:"Análisis Táctico IA", d:"255 clubes reales. La IA detecta debilidades del rival y genera estrategia completa para ganar." },
    { n:"04", icon:"📋", c:"#8b5cf6", t:"Pipeline Kanban", d:"5 etapas de gestión: Radar → Observando → Destacado → Negociando → Fichado." },
    { n:"05", icon:"📄", c:"#ec4899", t:"Informes PDF", d:"PDF con foto, radar chart, historial y análisis IA listo para enviar a cualquier club." },
    { n:"06", icon:"📊", c:"#10b981", t:"Benchmarks por Liga", d:"Compare con promedios reales de 80+ competiciones. Datos de temporada 2024.", big:true },
  ];
  const clubs = ["Colo Colo","River Plate","Flamengo","Atlético Nacional","Peñarol","Alianza Lima","Barcelona SC","Bolívar","Olimpia","MLS","Liga MX","U. de Chile","Boca Juniors","Palmeiras","+ 240 clubes"];
  const plans = [
    { name:"Ojeador", price:"0", period:"Para siempre", feats:["1 liga · 2 equipos","Scouting básico","5 informes IA/mes"], no:["PDF export","Comparador Mundial"] },
    { name:"Club / Técnico", price:"19", period:"USD / mes", best:true, feats:["Ligas ilimitadas","10.000+ jugadores","Comparador Mundial PRO","PDF profesional","Análisis rival IA","Pipeline fichajes"] },
    { name:"Director Club", price:"49", period:"USD / mes", feats:["Todo del plan Club","10 usuarios","Multi-equipo","Rankings internos","Soporte prioritario"] },
  ];

  const G = "#00e87a";

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:"#040a0f",color:"#eef2f6",overflowX:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .lnd-btn-p{background:linear-gradient(135deg,#00e87a,#00c96a);color:#000;border:none;border-radius:10px;padding:15px 34px;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;transition:all .22s}
        .lnd-btn-p:hover{background:linear-gradient(135deg,#1af080,#00e070);transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,232,122,.25)}
        .lnd-btn-o{background:transparent;color:#eef2f6;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:14px 30px;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;transition:all .22s}
        .lnd-btn-o:hover{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.04)}
        .lnd-fc{background:#06101a;border:1px solid rgba(255,255,255,0.07);border-radius:17px;padding:26px;position:relative;overflow:hidden;transition:all .25s;cursor:default}
        .lnd-fc:hover{border-color:rgba(0,232,122,0.2);transform:translateY(-3px)}
        .lnd-hstat{flex:1;padding:16px 18px;border-right:1px solid rgba(255,255,255,0.07);text-align:center}
        .lnd-hstat:last-child{border-right:none}
        .lnd-hstat:hover{background:rgba(0,232,122,0.04)}
        .lnd-step:hover .lnd-step-c{border-color:rgba(0,232,122,0.35);box-shadow:0 0 18px rgba(0,232,122,0.08)}
        .lnd-cbadge{padding:10px 18px;font-weight:700;font-size:12px;color:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.06);border-radius:8px;margin:4px;display:inline-block;cursor:default;transition:all .2s}
        .lnd-cbadge:hover{color:#00e87a;border-color:rgba(0,232,122,0.22)}
        .lnd-pcard{background:#040a0f;border:1px solid rgba(255,255,255,0.07);border-radius:19px;padding:28px;transition:transform .2s}
        .lnd-pcard:hover{transform:translateY(-4px)}
        .lnd-pcard.best{background:linear-gradient(160deg,#071e14,#040a0f);border-color:rgba(0,232,122,0.28);box-shadow:0 0 0 1px rgba(0,232,122,0.07),0 20px 52px rgba(0,232,122,0.07)}
        .nav-lnk{color:#4a6070;text-decoration:none;font-size:14px;font-weight:500;transition:color .2s}
        .nav-lnk:hover{color:#eef2f6}
        @media(max-width:860px){.lnd-bento,.lnd-pgrid{grid-template-columns:1fr!important}.lnd-steps{grid-template-columns:1fr 1fr!important}.lnd-footer-g{grid-template-columns:1fr 1fr!important}.nav-links-d{display:none!important}.lnd-comp-g{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:68,padding:"0 6%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(4,10,15,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚽</div>
          <div style={{fontWeight:800,fontSize:17}}>Ficha<span style={{color:G}}>Scout</span></div>
        </div>
        <div className="nav-links-d" style={{display:"flex",gap:26}}>
          {["funciones","comparador","precios"].map(s=><a key={s} href={`#lnd-${s}`} className="nav-lnk">{s.charAt(0).toUpperCase()+s.slice(1)}</a>)}
        </div>
        <button className="lnd-btn-p" onClick={onLogin} style={{padding:"8px 18px",fontSize:13}}>Iniciar sesión →</button>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",position:"relative",display:"flex",flexDirection:"column",justifyContent:"flex-end",paddingBottom:80,paddingTop:68,overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:1100,height:520,background:"radial-gradient(ellipse at 50% 0%,rgba(0,232,122,0.11) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,232,122,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 100% 80% at 50% 100%,black 0%,transparent 100%)"}}/>
        <svg style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"min(1000px,110%)",opacity:.07,pointerEvents:"none"}} viewBox="0 0 900 420" fill="none">
          <rect x="2" y="2" width="896" height="416" stroke="white" strokeWidth="2"/>
          <line x1="450" y1="2" x2="450" y2="418" stroke="white" strokeWidth="1.5"/>
          <circle cx="450" cy="210" r="80" stroke="white" strokeWidth="1.5"/>
          <rect x="2" y="135" width="120" height="150" stroke="white" strokeWidth="1.5"/>
          <rect x="778" y="135" width="120" height="150" stroke="white" strokeWidth="1.5"/>
          <rect x="2" y="165" width="50" height="90" stroke="white" strokeWidth="1.5"/>
          <rect x="848" y="165" width="50" height="90" stroke="white" strokeWidth="1.5"/>
          <circle cx="450" cy="210" r="4" fill="white"/>
          <path d="M 122 135 Q 200 210 122 285" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M 778 135 Q 700 210 778 285" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"45%",background:"linear-gradient(to bottom,transparent,#040a0f)"}}/>
        <div style={{position:"relative",zIndex:1,padding:"0 6%",maxWidth:1260,margin:"0 auto",width:"100%"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,232,122,0.08)",border:"1px solid rgba(0,232,122,0.18)",borderRadius:100,padding:"5px 16px",fontSize:12,fontWeight:600,color:G,letterSpacing:.5,marginBottom:24}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:G,display:"block",animation:"blink 2s infinite"}}/>
            La plataforma de scouting más avanzada de Latinoamérica
          </div>
          <h1 style={{fontSize:"clamp(68px,11vw,148px)",lineHeight:.93,letterSpacing:2,color:"#fff",marginBottom:24,fontWeight:900,fontFamily:"'Arial Black','Impact',system-ui,sans-serif"}}>
            DESCUBRE<br/><span style={{color:G}}>EL TALENTO</span><br/><span style={{WebkitTextStroke:"2px rgba(255,255,255,0.2)",color:"transparent"}}>INVISIBLE</span>
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:"#4a6070",maxWidth:540,lineHeight:1.7,marginBottom:36,fontWeight:300}}>
            Analiza jugadores amateur, compáralos con profesionales de las mejores ligas del mundo y genera informes de scouting con Inteligencia Artificial.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:52}}>
            <button className="lnd-btn-p" onClick={onLogin} style={{padding:"15px 34px",fontSize:15}}>Comenzar gratis →</button>
            <button className="lnd-btn-o" onClick={()=>document.getElementById("lnd-funciones")?.scrollIntoView({behavior:"smooth"})}>Ver funciones ↓</button>
          </div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,overflow:"hidden",maxWidth:660}}>
            {[["10K+","Jugadores pro"],["80+","Ligas activas"],["10","Países SA"],["IA","Análisis scout"]].map(([v,l],i)=>(
              <div key={i} className="lnd-hstat">
                <div style={{fontSize:32,fontWeight:900,color:G,lineHeight:1,marginBottom:3,fontFamily:"'Arial Black',system-ui"}}>{v}</div>
                <div style={{fontSize:10,color:"#4a6070",letterSpacing:.5,textTransform:"uppercase"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{background:"rgba(0,232,122,0.06)",borderTop:"1px solid rgba(0,232,122,0.1)",borderBottom:"1px solid rgba(0,232,122,0.1)",padding:"12px 0",overflow:"hidden",whiteSpace:"nowrap"}}>
        <div style={{display:"inline-flex",gap:52,animation:"mq 35s linear infinite"}}>
          {["Chile 1ª División","Liga Profesional Argentina","Brasileirão Serie A","Premier League","La Liga España","Copa Libertadores","Serie A Italia","Bundesliga","MLS","Liga MX","Ligue 1","Saudi Pro League",
            "Chile 1ª División","Liga Profesional Argentina","Brasileirão Serie A","Premier League","La Liga España","Copa Libertadores","Serie A Italia","Bundesliga","MLS","Liga MX","Ligue 1","Saudi Pro League"
          ].map((l,i)=>(
            <div key={i} style={{fontWeight:700,fontSize:12,color:G,letterSpacing:2,textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:10}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:G,display:"block"}}/>{l}
            </div>
          ))}
        </div>
      </div>

      {/* FUNCIONES */}
      <section id="lnd-funciones" style={{padding:"90px 6%"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:G,fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}><span style={{width:22,height:2,background:G,display:"block"}}/>Funcionalidades</div>
          <h2 style={{fontSize:"clamp(40px,5.5vw,70px)",lineHeight:1,letterSpacing:2,color:"#fff",marginBottom:14,fontWeight:900,fontFamily:"'Arial Black','Impact',system-ui"}}>TODO LO QUE UN<br/><span style={{color:G}}>SCOUT NECESITA</span></h2>
          <p style={{fontSize:17,color:"#4a6070",maxWidth:520,lineHeight:1.7,marginBottom:44,fontWeight:300}}>Desde la anotación en cancha hasta el informe para el director técnico.</p>
          <div className="lnd-bento" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            {features.map((f,i)=>(
              <div key={i} className="lnd-fc" style={{gridColumn:f.big?"span 2":"span 1"}}>
                <div style={{position:"absolute",top:16,right:18,fontSize:48,fontWeight:900,color:"rgba(255,255,255,0.04)",lineHeight:1,fontFamily:"'Arial Black',system-ui"}}>{f.n}</div>
                <div style={{width:48,height:48,borderRadius:13,background:`${f.c}12`,color:f.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14}}>{f.icon}</div>
                <div style={{fontWeight:800,fontSize:16,marginBottom:7,color:"#eef2f6"}}>{f.t}</div>
                <div style={{fontSize:13,color:"#4a6070",lineHeight:1.65}}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section style={{padding:"90px 6%",background:"#06101a"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:G,fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}><span style={{width:22,height:2,background:G,display:"block"}}/>Proceso</div>
          <h2 style={{fontSize:"clamp(40px,5.5vw,70px)",lineHeight:1,letterSpacing:2,color:"#fff",marginBottom:44,fontWeight:900,fontFamily:"'Arial Black','Impact',system-ui"}}>DEL PARTIDO AL<br/><span style={{color:G}}>INFORME PROFESIONAL</span></h2>
          <div className="lnd-steps" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,position:"relative"}}>
            <div style={{position:"absolute",top:32,left:"12.5%",right:"12.5%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,232,122,0.2) 25%,rgba(0,232,122,0.2) 75%,transparent)"}}/>
            {[["1","Crea tu liga","Registra equipos y plantilla."],["2","Analiza en vivo","Registra eventos en tiempo real."],["3","Compara con pros","10.000+ jugadores de 80 ligas."],["4","Genera el PDF","Informe con foto, radar e IA."]].map(([n,t,d])=>(
              <div key={n} className="lnd-step" style={{padding:"0 22px",textAlign:"center",cursor:"default"}}>
                <div className="lnd-step-c" style={{width:64,height:64,borderRadius:16,background:"#040a0f",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",transition:"all .3s"}}>
                  <span style={{fontSize:26,fontWeight:900,color:G,fontFamily:"'Arial Black',system-ui"}}>{n}</span>
                </div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:7,color:"#eef2f6"}}>{t}</div>
                <div style={{fontSize:13,color:"#4a6070",lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARADOR DEMO */}
      <section id="lnd-comparador" style={{padding:"90px 6%"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:G,fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}><span style={{width:22,height:2,background:G,display:"block"}}/>Comparador Mundial</div>
          <h2 style={{fontSize:"clamp(40px,5.5vw,70px)",lineHeight:1,letterSpacing:2,color:"#fff",marginBottom:14,fontWeight:900,fontFamily:"'Arial Black','Impact',system-ui"}}>CUALQUIER LIGA.<br/><span style={{color:G}}>UN SOLO ANÁLISIS.</span></h2>
          <p style={{fontSize:16,color:"#4a6070",maxWidth:520,lineHeight:1.7,marginBottom:40,fontWeight:300}}>Compare jugadores de la Primera División chilena con figuras de la Premier League o la Copa Libertadores.</p>
          <div style={{background:"#06101a",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,overflow:"hidden",boxShadow:"0 40px 80px rgba(0,0,0,.5)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              {["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              <span style={{fontSize:12,color:"#4a6070",marginLeft:8}}>fichascout.com / comparador</span>
            </div>
            <div className="lnd-comp-g" style={{padding:24,display:"grid",gridTemplateColumns:"1fr 1px 1fr",gap:22}}>
              {[{c:G,label:"JUGADOR 1 — LOCAL",name:"M. Rodríguez",club:"Colo Colo · Primera División · 24a",stats:[["Goles",7,47],["Asistencias",4,33],["Rating",7.8,78],["Pases clave",28,47],["Regates",42,53]]},
                {c:"#3b82f6",label:"JUGADOR 2 — PRO INTERNACIONAL",name:"L. García",club:"Atlético Nacional · Copa Libertadores · 27a",stats:[["Goles",12,80],["Asistencias",7,58],["Rating",8.9,89],["Pases clave",43,72],["Regates",61,76]]}
              ].map((p,pi)=>(
                <div key={pi} style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontSize:11,fontWeight:700,color:p.c,letterSpacing:1,marginBottom:4}}>{p.label}</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:46,height:46,borderRadius:13,background:`${p.c}15`,border:`2px solid ${p.c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🎯</div>
                    <div><div style={{fontWeight:800,fontSize:14,color:"#eef2f6"}}>{p.name}</div><div style={{fontSize:11,color:"#4a6070",marginTop:1}}>{p.club}</div></div>
                  </div>
                  {p.stats.map(([l,v,pct])=>(
                    <div key={l} style={{display:"grid",gridTemplateColumns:"86px 1fr 34px",gap:8,alignItems:"center"}}>
                      <div style={{fontSize:11,color:"#4a6070"}}>{l}</div>
                      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{width:`${pct}%`,height:"100%",background:p.c,borderRadius:2}}/></div>
                      <div style={{fontSize:12,fontWeight:700,color:p.c,textAlign:"right"}}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{background:"rgba(255,255,255,0.06)"}}/>
            </div>
            <div style={{padding:"13px 22px",background:"rgba(139,92,246,0.05)",borderTop:"1px solid rgba(139,92,246,0.12)",display:"flex",alignItems:"center",gap:12}}>
              <span style={{background:"rgba(139,92,246,0.18)",color:"#8b5cf6",padding:"3px 9px",borderRadius:5,fontSize:11,fontWeight:700}}>🤖 IA Scout</span>
              <span style={{fontSize:13,color:"#64748b"}}>M. Rodríguez tiene el 87% del rendimiento de L. García. Brecha: pases clave y rating bajo presión.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CLUBES */}
      <div style={{background:"#040a0f",textAlign:"center",padding:"48px 6%"}}>
        <div style={{fontSize:11,color:"#4a6070",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:26}}>Datos reales de estas ligas y más de 70 competencias activas</div>
        <div style={{maxWidth:840,margin:"0 auto"}}>
          {clubs.map(c=><span key={c} className="lnd-cbadge">{c}</span>)}
        </div>
      </div>

      {/* PRECIOS */}
      <section id="lnd-precios" style={{padding:"90px 6%",background:"linear-gradient(180deg,#06101a 0%,#040a0f 100%)"}}>
        <div style={{maxWidth:980,margin:"0 auto",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:G,fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14,justifyContent:"center"}}><span style={{width:22,height:2,background:G,display:"block"}}/>Precios</div>
          <h2 style={{fontSize:"clamp(40px,5.5vw,70px)",lineHeight:1,letterSpacing:2,color:"#fff",marginBottom:14,fontWeight:900,fontFamily:"'Arial Black','Impact',system-ui"}}>PLANES PARA<br/><span style={{color:G}}>CADA NECESIDAD</span></h2>
          <p style={{fontSize:16,color:"#4a6070",marginBottom:44,fontWeight:300}}>Sin tarjeta de crédito. Comienza gratis hoy.</p>
          <div className="lnd-pgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,textAlign:"left"}}>
            {plans.map((p,i)=>(
              <div key={i} className={`lnd-pcard${p.best?" best":""}`}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:p.best?G:"#4a6070",display:"block",marginBottom:12}}>{p.name}</span>
                  {p.best&&<span style={{background:"rgba(0,232,122,0.12)",color:G,fontSize:10,padding:"2px 9px",borderRadius:100,fontWeight:700}}>Popular</span>}
                </div>
                <div style={{fontSize:50,fontWeight:900,lineHeight:1,color:p.best?G:"#fff",marginBottom:4,fontFamily:"'Arial Black',system-ui"}}><sup style={{fontSize:22,verticalAlign:"top",marginTop:10}}>$</sup>{p.price}</div>
                <div style={{fontSize:13,color:"#4a6070",marginBottom:20}}>{p.period}</div>
                <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:9,marginBottom:24}}>
                  {p.feats.map(f=><li key={f} style={{fontSize:13,color:"#4a6070",display:"flex",alignItems:"center",gap:9}}><span style={{color:G,fontWeight:700,flexShrink:0}}>✓</span>{f}</li>)}
                  {(p.no||[]).map(f=><li key={f} style={{fontSize:13,color:"#4a6070",opacity:.3,display:"flex",alignItems:"center",gap:9}}><span style={{fontWeight:700,flexShrink:0}}>—</span>{f}</li>)}
                </ul>
                <button onClick={p.best?onLogin:undefined} style={{width:"100%",padding:12,borderRadius:10,border:p.best?"none":"1px solid rgba(255,255,255,0.1)",fontWeight:700,fontSize:14,cursor:"pointer",background:p.best?`linear-gradient(135deg,${G},#00c96a)`:"transparent",color:p.best?"#000":"#eef2f6",fontFamily:"inherit",transition:"all .2s"}}>
                  {p.best?"Comenzar ahora →":p.name==="Director Club"?"Contactar ventas":"Comenzar gratis"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"110px 6%",background:"#040a0f",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:-60,left:"50%",transform:"translateX(-50%)",width:800,height:400,background:"radial-gradient(ellipse at center,rgba(0,232,122,0.09) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <h2 style={{fontSize:"clamp(50px,9vw,100px)",lineHeight:1,letterSpacing:3,marginBottom:18,fontWeight:900,fontFamily:"'Arial Black','Impact',system-ui"}}>
            EL TALENTO<br/><span style={{color:G}}>MERECE</span> SER<br/>DESCUBIERTO
          </h2>
          <p style={{fontSize:17,color:"#4a6070",marginBottom:40,fontWeight:300}}>FichaScout — La primera plataforma de scouting profesional para el fútbol amateur latinoamericano.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="lnd-btn-p" onClick={onLogin} style={{padding:"15px 40px",fontSize:15}}>Crear cuenta gratis →</button>
            <button className="lnd-btn-o" onClick={onLogin} style={{padding:"14px 32px",fontSize:14}}>Iniciar sesión</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#030810",borderTop:"1px solid rgba(255,255,255,0.07)",padding:"44px 6%"}}>
        <div className="lnd-footer-g" style={{maxWidth:1160,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:36}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:13}}>
              <div style={{width:32,height:32,borderRadius:9,background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>⚽</div>
              <div style={{fontWeight:800,fontSize:16}}>Ficha<span style={{color:G}}>Scout</span></div>
            </div>
            <p style={{fontSize:13,color:"#4a6070",lineHeight:1.7,maxWidth:230}}>La plataforma de scouting para descubrir el talento invisible del fútbol latinoamericano.</p>
          </div>
          {[["Plataforma",["Funciones","Comparador","Precios","API"]],["Recursos",["Documentación","Blog","Soporte","Changelog"]],["Legal",["Privacidad","Términos","Cookies","Contacto"]]].map(([h,links])=>(
            <div key={h}>
              <h4 style={{fontWeight:700,fontSize:12,color:"#eef2f6",letterSpacing:.5,marginBottom:14,textTransform:"uppercase"}}>{h}</h4>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:9}}>
                {links.map(l=><li key={l}><a href="#" style={{color:"#4a6070",textDecoration:"none",fontSize:13,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=G} onMouseLeave={e=>e.target.style.color="#4a6070"}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{maxWidth:1160,margin:"34px auto 0",paddingTop:22,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,fontSize:12,color:"#4a6070"}}>
          <span>© 2025 FichaScout. Todos los derechos reservados.</span>
          <span>Hecho con ❤️ para el fútbol latinoamericano</span>
          <span>fichascout.com</span>
        </div>
      </footer>
    </div>
  );
}

// ─── PANTALLA DE LOGIN ────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [showP, setShowP]   = useState(false);
  const [load, setLoad]     = useState(false);
  const [err, setErr]       = useState("");
  const [forgot, setForgot] = useState(false);
  const [ok, setOk]         = useState("");
  const [fi, setFi]         = useState(0);
  const [out, setOut]       = useState(false);
  const timer               = useRef(null);

  useEffect(()=>{
    timer.current = setInterval(next, 5500);
    return ()=>clearInterval(timer.current);
  },[fi]);

  function go(idx){ clearInterval(timer.current); setOut(true); setTimeout(()=>{ setFi(idx); setOut(false); },290); }
  function next(){ go((fi+1)%FEATS.length); }
  function prev(){ go((fi-1+FEATS.length)%FEATS.length); }

  async function login(e){
    e.preventDefault(); setLoad(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password:pass });
    if (error) setErr("Email o contraseña incorrectos. Contacte al administrador.");
    setLoad(false);
  }

  async function recover(e){
    e.preventDefault(); if(!email){setErr("Ingrese su email");return;}
    setLoad(true); setErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(email,{ redirectTo:"https://fichascout.com" });
    if (error) setErr(error.message); else setOk("Revise su correo para recuperar su contraseña.");
    setLoad(false);
  }

  const f = FEATS[fi];

  return (
    <div style={{minHeight:"100vh",height:"100vh",background:"#040a0f",display:"flex",fontFamily:"system-ui,-apple-system,sans-serif",color:"#eef2f6",overflow:"hidden",position:"fixed",inset:0}}>
      <style>{`
        *{box-sizing:border-box}
        input::placeholder{color:#1a2e3d}
        input:focus{border-color:rgba(0,232,122,0.5)!important;background:rgba(255,255,255,0.07)!important}
        .fin{animation:fin .35s cubic-bezier(.16,1,.3,1) both}
        .fout{animation:fout .28s ease both}
        @keyframes fin{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fout{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-18px)}}
        .btn-go{border:none;border-radius:10px;padding:13px;color:#000;font-weight:700;cursor:pointer;font-size:14px;background:linear-gradient(135deg,#00e87a,#00c96a);font-family:inherit;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s}
        .btn-go:hover:not(:disabled){background:linear-gradient(135deg,#1af080,#00e070)!important;transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,232,122,.28)}
        .arr{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.35);transition:all .2s}
        .arr:hover{background:rgba(255,255,255,0.1);color:#fff}
        .dot{border:none;padding:0;cursor:pointer;transition:all .3s;border-radius:4px}
        .dot:hover{transform:scale(1.4)}
        .lnk{background:none;border:none;color:#00e87a;cursor:pointer;font-family:inherit;font-size:13px;padding:0;text-decoration:underline}
        .lnk:hover{color:#1af080}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){.lp-panel{display:none!important}.rp-panel{width:100%!important;max-width:100%!important;border-left:none!important}}
      `}</style>

      {/* PANEL IZQUIERDO */}
      <div className="lp-panel" style={{flex:1,position:"relative",display:"flex",flexDirection:"column",overflow:"hidden",height:"100vh"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#040a0f 0%,#06121e 55%,#040d18 100%)"}}/>
        <div style={{position:"absolute",top:"15%",left:"20%",width:"60%",height:"55%",background:`radial-gradient(ellipse,${f.color}08 0%,transparent 70%)`,transition:"background 1.2s",pointerEvents:"none",borderRadius:"50%"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 100 100" preserveAspectRatio="none">
          {[10,20,30,40,50,60,70,80,90].map(v=><g key={v}><line x1={v} y1="0" x2={v} y2="100" stroke="rgba(0,232,122,0.025)" strokeWidth="0.2"/><line x1="0" y1={v} x2="100" y2={v} stroke="rgba(0,232,122,0.025)" strokeWidth="0.2"/></g>)}
        </svg>
        <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",padding:"36px 48px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:36,flexShrink:0}}>
            <div style={{width:40,height:40,borderRadius:11,background:"#07111a",border:`1.5px solid ${f.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,transition:"border-color .8s",flexShrink:0}}>⚽</div>
            <div>
              <div style={{fontWeight:800,fontSize:17,letterSpacing:"-0.3px"}}>Ficha<span style={{color:"#00e87a"}}>Scout</span></div>
              <div style={{fontSize:9,color:"#1a2e3d",letterSpacing:"1.8px"}}>PLATAFORMA DE SCOUTING</div>
            </div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",minHeight:0}}>
            <div className={out?"fout":"fin"} key={fi}>
              <div style={{width:50,height:50,borderRadius:14,background:`${f.color}10`,border:`1.5px solid ${f.color}28`,display:"flex",alignItems:"center",justifyContent:"center",color:f.color,marginBottom:18}}>{f.icon}</div>
              <div style={{fontWeight:800,fontSize:24,letterSpacing:"-0.6px",lineHeight:1.2,marginBottom:12,color:"#eef2f6"}}>{f.titulo}</div>
              <div style={{color:"#3a5060",fontSize:14,lineHeight:1.7,marginBottom:20}}>{f.desc}</div>
              <div style={{display:"flex",gap:20,marginBottom:22}}>
                {f.stats.map((s,i)=><div key={i} style={{borderLeft:`2px solid ${f.color}35`,paddingLeft:12}}><div style={{fontWeight:800,fontSize:17,color:f.color}}>{s.v}</div><div style={{fontSize:10,color:"#1a2e3d",marginTop:1}}>{s.l}</div></div>)}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8,flexShrink:0}}>
              <button className="arr" onClick={prev}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
              <div style={{flex:1,display:"flex",gap:6,justifyContent:"center"}}>
                {FEATS.map((_,i)=><button key={i} className="dot" onClick={()=>go(i)} style={{width:i===fi?22:6,height:6,background:i===fi?f.color:"rgba(255,255,255,0.1)"}}/>)}
              </div>
              <button className="arr" onClick={next}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
          </div>
          <div style={{display:"flex",gap:24,paddingTop:18,borderTop:"1px solid rgba(255,255,255,0.05)",marginTop:22,flexShrink:0}}>
            {[["10K+","Jugadores"],["80+","Ligas"],["10","Países"],["IA","Análisis"]].map(([v,l])=>(
              <div key={l}><div style={{fontWeight:700,fontSize:15,color:"#eef2f6"}}>{v}</div><div style={{fontSize:10,color:"#1a2e3d"}}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL LOGIN */}
      <div className="rp-panel" style={{width:420,maxWidth:"100%",background:"#06101a",borderLeft:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 40px",height:"100vh",overflowY:"auto"}}>
        <div style={{width:"100%"}}>
          {!forgot ? (
            <>
              <div style={{marginBottom:26}}>
                <div style={{fontWeight:800,fontSize:23,letterSpacing:"-0.5px",color:"#eef2f6",marginBottom:5}}>Acceder a la plataforma</div>
                <div style={{color:"#1a2e3d",fontSize:14}}>Ingrese con sus credenciales de FichaScout</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.14)",borderRadius:10,marginBottom:20}}>
                <div style={{color:"#f59e0b",flexShrink:0,display:"flex"}}><IcoShield/></div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#f59e0b"}}>Acceso restringido</div>
                  <div style={{fontSize:11,color:"#5a4010"}}>Las cuentas son creadas exclusivamente por el administrador</div>
                </div>
              </div>
              <form onSubmit={login}>
                <div style={{marginBottom:13}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1a2e3d",letterSpacing:"0.8px",marginBottom:6}}>CORREO ELECTRÓNICO</div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1a2e3d",display:"flex",pointerEvents:"none"}}><IcoMail/></div>
                    <input style={IS} type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a2e3d",letterSpacing:"0.8px"}}>CONTRASEÑA</div>
                    <button type="button" className="lnk" style={{fontSize:12}} onClick={()=>{setForgot(true);setErr("");}}>¿Olvidó su contraseña?</button>
                  </div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1a2e3d",display:"flex",pointerEvents:"none"}}><IcoLock/></div>
                    <input style={{...IS,paddingRight:44}} type={showP?"text":"password"} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} required/>
                    <button type="button" onClick={()=>setShowP(s=>!s)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#1a2e3d",display:"flex",padding:0}}>{showP?<IcoEyeOff/>:<IcoEye/>}</button>
                  </div>
                </div>
                {err&&<div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.16)",borderRadius:10,padding:"11px 14px",marginBottom:16,fontSize:13,color:"#fca5a5",lineHeight:1.5}}>⚠ {err}</div>}
                <button type="submit" disabled={load} className="btn-go">
                  {load?(<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Verificando...</>):(<>Ingresar a FichaScout <IcoArrow/></>)}
                </button>
              </form>
              <div style={{margin:"20px 0",display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:"0.5px",background:"rgba(255,255,255,0.05)"}}/>
                <div style={{fontSize:11,color:"#0d1e28"}}>¿Sin acceso?</div>
                <div style={{flex:1,height:"0.5px",background:"rgba(255,255,255,0.05)"}}/>
              </div>
              <div style={{padding:"13px 15px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,textAlign:"center"}}>
                <div style={{fontSize:13,color:"#1a2e3d",lineHeight:1.7}}>Las cuentas son gestionadas por el administrador.<br/><span style={{color:"#0d1e28"}}>Contacte a su club para solicitar acceso.</span></div>
              </div>
            </>
          ) : (
            <>
              <button onClick={()=>{setForgot(false);setErr("");setOk("");}} style={{background:"none",border:"none",color:"#1a2e3d",cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,marginBottom:22,padding:0}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Volver al inicio de sesión
              </button>
              <div style={{marginBottom:24}}>
                <div style={{fontWeight:800,fontSize:22,color:"#eef2f6",marginBottom:5}}>Recuperar contraseña</div>
                <div style={{color:"#1a2e3d",fontSize:14}}>Le enviaremos un enlace a su correo</div>
              </div>
              <form onSubmit={recover}>
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1a2e3d",letterSpacing:"0.8px",marginBottom:6}}>CORREO ELECTRÓNICO</div>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#1a2e3d",display:"flex",pointerEvents:"none"}}><IcoMail/></div>
                    <input style={IS} type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  </div>
                </div>
                {err&&<div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.16)",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,color:"#fca5a5"}}>⚠ {err}</div>}
                {ok&&<div style={{background:"rgba(0,232,122,0.07)",border:"1px solid rgba(0,232,122,0.18)",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,color:"#6ee7b7"}}>✅ {ok}</div>}
                <button type="submit" disabled={load} className="btn-go">{load?"⏳ Enviando...":"Enviar enlace de recuperación"}</button>
              </form>
            </>
          )}
          <div style={{marginTop:20,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <div style={{color:"#0d1e28",display:"flex"}}><IcoLock/></div>
            <div style={{fontSize:11,color:"#0d1e28"}}>Cifrado SSL · Seguridad Supabase</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
// Maneja el flujo: Landing → Login → (App se carga desde main.jsx)
export default function Auth() {
  const [showLogin, setShowLogin] = useState(false);

  if (!showLogin) {
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  return <LoginScreen />;
}

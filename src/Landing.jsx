// FichaScout — Landing Page integrada en React
export default function Landing({ onLogin }) {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    .fs-hero h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(64px,11vw,140px);line-height:.93;letter-spacing:2px;color:#fff;margin-bottom:24px}
    .fs-hero h1 .acc{color:#00e87a}
    .fs-hero h1 .out{-webkit-text-stroke:2px rgba(255,255,255,0.18);color:transparent}
    .fs-sec-h{font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,5.5vw,72px);line-height:1;letter-spacing:2px;color:#fff;margin-bottom:14px}
    .fs-sec-h .a{color:#00e87a}
    .mq{animation:mq 35s linear infinite}
    @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .fc{background:#06101a;border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:28px;transition:all .25s;position:relative;overflow:hidden}
    .fc:hover{border-color:rgba(0,232,122,0.2);transform:translateY(-3px)}
    .fc.big{grid-column:span 2}
    .step-c{width:68px;height:68px;border-radius:16px;background:#040a0f;border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;transition:all .3s}
    .step-c:hover{border-color:rgba(0,232,122,0.35);box-shadow:0 0 20px rgba(0,232,122,0.08)}
    .pcard{background:#040a0f;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:30px;transition:transform .2s}
    .pcard:hover{transform:translateY(-4px)}
    .pcard.feat{background:linear-gradient(160deg,#071e14,#040a0f);border-color:rgba(0,232,122,0.28);box-shadow:0 0 0 1px rgba(0,232,122,0.07),0 20px 56px rgba(0,232,122,0.07)}
    .cbadge{padding:10px 18px;font-family:'Syne',sans-serif;font-weight:700;font-size:12px;color:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.06);border-radius:8px;margin:4px;transition:all .2s;cursor:default;display:inline-block}
    .cbadge:hover{color:#00e87a;border-color:rgba(0,232,122,0.22)}
    .btn-p{background:#00e87a;color:#000;padding:15px 34px;border-radius:10px;border:none;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;transition:all .22s;display:inline-flex;align-items:center;gap:8px}
    .btn-p:hover{background:#1af080;transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,232,122,.25)}
    .btn-o{background:transparent;color:#eef2f6;padding:14px 30px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);font-family:'Syne',sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .22s;display:inline-flex;align-items:center;gap:8px}
    .btn-o:hover{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.04)}
    .hstat:hover{background:rgba(0,232,122,0.04)}
    .nav-lnk:hover{color:#eef2f6!important}
    @media(max-width:900px){.fs-hero h1{font-size:clamp(52px,13vw,80px)}.bento-g,.pgrid{grid-template-columns:1fr!important}.fc.big{grid-column:span 1!important}.steps-g{grid-template-columns:1fr 1fr!important}.footer-g{grid-template-columns:1fr 1fr!important}.nav-links{display:none!important}.comp-grid{grid-template-columns:1fr!important}}
  `;

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#040a0f",color:"#eef2f6",overflowX:"hidden"}}>
      <style>{styles}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:70,padding:"0 6%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(4,10,15,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:9,background:"#00e87a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚽</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18}}>Ficha<span style={{color:"#00e87a"}}>Scout</span></div>
        </div>
        <div className="nav-links" style={{display:"flex",gap:28,listStyle:"none"}}>
          {["Funciones","Comparador","Precios"].map(l=><a key={l} href={`#${l.toLowerCase()}`} className="nav-lnk" style={{color:"#4a6070",textDecoration:"none",fontSize:14,fontWeight:500,transition:"color .2s"}}>{l}</a>)}
        </div>
        <button onClick={onLogin} className="btn-p" style={{padding:"8px 20px",fontSize:13}}>Iniciar sesión →</button>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="fs-hero" style={{minHeight:"100vh",position:"relative",display:"flex",flexDirection:"column",justifyContent:"flex-end",paddingBottom:80,overflow:"hidden",paddingTop:70}}>
        {/* Glow background */}
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:1100,height:550,background:"radial-gradient(ellipse at 50% 0%,rgba(0,232,122,0.11) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,232,122,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 100% 80% at 50% 100%,black 0%,transparent 100%)"}}/>
        {/* SVG campo fútbol */}
        <svg style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"min(1000px,110%)",opacity:.08,pointerEvents:"none"}} viewBox="0 0 900 420" fill="none">
          <rect x="2" y="2" width="896" height="416" stroke="white" strokeWidth="2"/>
          <line x1="450" y1="2" x2="450" y2="418" stroke="white" strokeWidth="1.5"/>
          <circle cx="450" cy="210" r="80" stroke="white" strokeWidth="1.5"/>
          <rect x="2" y="135" width="120" height="150" stroke="white" strokeWidth="1.5"/>
          <rect x="778" y="135" width="120" height="150" stroke="white" strokeWidth="1.5"/>
          <rect x="2" y="165" width="50" height="90" stroke="white" strokeWidth="1.5"/>
          <rect x="848" y="165" width="50" height="90" stroke="white" strokeWidth="1.5"/>
          <circle cx="450" cy="210" r="4" fill="white"/>
          <circle cx="100" cy="210" r="4" fill="white"/>
          <circle cx="800" cy="210" r="4" fill="white"/>
          <path d="M 122 135 Q 200 210 122 285" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M 778 135 Q 700 210 778 285" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"45%",background:"linear-gradient(to bottom,transparent,#040a0f)"}}/>

        <div style={{position:"relative",zIndex:1,padding:"0 6%",maxWidth:1280,margin:"0 auto",width:"100%"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,232,122,0.08)",border:"1px solid rgba(0,232,122,0.18)",borderRadius:100,padding:"6px 18px",fontSize:12,fontWeight:600,color:"#00e87a",letterSpacing:.5,marginBottom:26}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#00e87a",display:"block",animation:"pulse 2s infinite"}}/>
            La plataforma de scouting más avanzada de Latinoamérica
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
          </div>
          <h1>DESCUBRE<br/><span className="acc">EL TALENTO</span><br/><span className="out">INVISIBLE</span></h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:"#4a6070",maxWidth:550,lineHeight:1.7,marginBottom:38,fontWeight:300}}>Analiza jugadores amateur, compáralos con profesionales de las mejores ligas del mundo y genera informes de scouting con Inteligencia Artificial.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:56}}>
            <button onClick={onLogin} className="btn-p" style={{padding:"15px 34px",fontSize:15}}>Comenzar gratis →</button>
            <a href="#funciones" className="btn-o">Ver funciones ↓</a>
          </div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,overflow:"hidden",maxWidth:680}}>
            {[["10K+","Jugadores pro"],["80+","Ligas activas"],["10","Países SA"],["IA","Análisis scout"]].map(([v,l])=>(
              <div key={l} className="hstat" style={{flex:1,padding:"16px 18px",borderRight:"1px solid rgba(255,255,255,0.07)",textAlign:"center",cursor:"default",transition:"background .2s"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:34,color:"#00e87a",lineHeight:1,marginBottom:3}}>{v}</div>
                <div style={{fontSize:10,color:"#4a6070",letterSpacing:.5,textTransform:"uppercase"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────────── */}
      <div style={{background:"rgba(0,232,122,0.06)",borderTop:"1px solid rgba(0,232,122,0.1)",borderBottom:"1px solid rgba(0,232,122,0.1)",padding:"13px 0",overflow:"hidden",whiteSpace:"nowrap"}}>
        <div className="mq" style={{display:"inline-flex",gap:56}}>
          {["Chile Primera División","Liga Profesional Argentina","Brasileirão Série A","Premier League","La Liga España","Copa Libertadores","Serie A Italia","Bundesliga Alemania","MLS Estados Unidos","Liga MX México","Ligue 1 Francia","Saudi Pro League",
            "Chile Primera División","Liga Profesional Argentina","Brasileirão Série A","Premier League","La Liga España","Copa Libertadores","Serie A Italia","Bundesliga Alemania","MLS Estados Unidos","Liga MX México","Ligue 1 Francia","Saudi Pro League"].map((l,i)=>(
            <div key={i} style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#00e87a",letterSpacing:2,textTransform:"uppercase",display:"flex",alignItems:"center",gap:10}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#00e87a",display:"block"}}/>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* ── FUNCIONES ───────────────────────────────────────────────────────── */}
      <section id="funciones" style={{padding:"100px 6%"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:"#00e87a",fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16}}>
            <span style={{width:24,height:2,background:"#00e87a",display:"block"}}/>Funcionalidades
          </div>
          <h2 className="fs-sec-h">TODO LO QUE UN<br/><span className="a">SCOUT NECESITA</span></h2>
          <p style={{fontSize:17,color:"#4a6070",maxWidth:540,lineHeight:1.7,marginBottom:48,fontWeight:300}}>Desde la anotación en cancha hasta el informe que envías al director técnico.</p>
          <div className="bento-g" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <div className="fc big" style={{gridColumn:"span 2"}}>
              <div style={{position:"absolute",top:18,right:20,fontFamily:"'Bebas Neue',sans-serif",fontSize:50,color:"rgba(255,255,255,0.04)"}}>01</div>
              <div style={{width:50,height:50,borderRadius:13,background:"rgba(0,232,122,0.1)",color:"#00e87a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:16}}>⚖️</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,marginBottom:7,color:"#eef2f6"}}>Comparador Scout Mundial</div>
              <div style={{fontSize:13,color:"#4a6070",lineHeight:1.65,marginBottom:18}}>Compara hasta 4 jugadores del mismo puesto de cualquier liga del mundo con radar chart en 7 dimensiones y PDF profesional listo para enviar a cualquier club.</div>
              <div style={{display:"flex",gap:12,alignItems:"center",justifyContent:"center",background:"rgba(0,18,10,0.5)",borderRadius:10,padding:14}}>
                {[["#00e87a","Chile 1ª","7.8"],["#3b82f6","Libertadores","8.9"],["#f59e0b","Premier Lg","8.1"]].map(([c,l,v],i)=>(
                  <div key={i} style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:40,height:40,borderRadius:"50%",background:`${c}18`,border:`2px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎯</div>
                    <div style={{fontSize:11,color:c,fontWeight:700}}>{v}</div>
                    <div style={{fontSize:9,color:"#4a6070"}}>{l}</div>
                    {i<2&&<div/>}
                  </div>
                ))}
              </div>
            </div>
            {[["02","🎬","#3b82f6","Scouting en Video","Cargue el partido de YouTube y registre eventos en tiempo real. Nota ajustada por dificultad — amistoso ×0.65, final ×2.5."],
              ["03","⚔️","#f59e0b","Análisis Táctico IA","255 clubes reales sudamericanos. La IA detecta debilidades del rival y genera estrategia completa."],
              ["04","📋","#8b5cf6","Pipeline Kanban","5 etapas de gestión: Radar → Observando → Destacado → Negociando → Fichado."],
              ["05","📄","#ec4899","Informes PDF","PDF con foto del jugador, radar chart, historial y análisis IA listo para enviar."],
              ["06","📊","#10b981","Benchmarks por Liga","Compare con promedios reales de 80+ competiciones. Datos actualizados temporada 2024.","big"]
            ].map(([n,ic,c,t,d,big])=>(
              <div key={n} className={`fc${big?" big":""}`} style={big?{gridColumn:"span 2"}:{}}>
                <div style={{position:"absolute",top:18,right:20,fontFamily:"'Bebas Neue',sans-serif",fontSize:50,color:"rgba(255,255,255,0.04)"}}>{n}</div>
                <div style={{width:50,height:50,borderRadius:13,background:`${c}10`,color:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:16}}>{ic}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,marginBottom:7,color:"#eef2f6"}}>{t}</div>
                <div style={{fontSize:13,color:"#4a6070",lineHeight:1.65}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────────────────────────────── */}
      <section style={{padding:"100px 6%",background:"#06101a"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:"#00e87a",fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16}}>
            <span style={{width:24,height:2,background:"#00e87a",display:"block"}}/>Proceso
          </div>
          <h2 className="fs-sec-h">DEL PARTIDO AL<br/><span className="a">INFORME PROFESIONAL</span></h2>
          <div className="steps-g" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,marginTop:48,position:"relative"}}>
            <div style={{position:"absolute",top:34,left:"12.5%",right:"12.5%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,232,122,0.22) 25%,rgba(0,232,122,0.22) 75%,transparent)"}}/>
            {[["1","Crea tu liga","Registra equipos, posiciones y toda la plantilla con un par de clics."],
              ["2","Analiza en vivo","Ve el video del partido y registra eventos en tiempo real por posición."],
              ["3","Compara con pros","El sistema compara con 10.000+ jugadores de 80 ligas del mundo."],
              ["4","Genera el informe","PDF profesional con foto, radar, estadísticas y análisis IA en segundos."]
            ].map(([n,t,d])=>(
              <div key={n} style={{padding:"0 24px",textAlign:"center"}}>
                <div className="step-c"><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#00e87a"}}>{n}</span></div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:8,color:"#eef2f6"}}>{t}</div>
                <div style={{fontSize:13,color:"#4a6070",lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARADOR DEMO ─────────────────────────────────────────────────── */}
      <section id="Comparador" style={{padding:"100px 6%"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:"#00e87a",fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16}}>
            <span style={{width:24,height:2,background:"#00e87a",display:"block"}}/>Comparador Mundial
          </div>
          <h2 className="fs-sec-h">CUALQUIER LIGA.<br/><span className="a">UN SOLO ANÁLISIS.</span></h2>
          <p style={{fontSize:16,color:"#4a6070",maxWidth:540,lineHeight:1.7,marginBottom:40,fontWeight:300}}>Compare jugadores de la Primera División chilena con figuras de la Premier League o la Copa Libertadores.</p>

          <div style={{background:"#06101a",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,overflow:"hidden",boxShadow:"0 40px 80px rgba(0,0,0,.5)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"13px 20px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              {["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              <span style={{fontSize:12,color:"#4a6070",marginLeft:8}}>fichascout.com / comparador</span>
            </div>
            <div className="comp-grid" style={{padding:24,display:"grid",gridTemplateColumns:"1fr 1px 1fr",gap:20}}>
              {[{c:"#00e87a",label:"JUGADOR 1 — LOCAL",name:"M. Rodríguez",club:"Colo Colo · Primera División Chile · 24a",stats:[["Goles",7,47],["Asistencias",4,33],["Rating",7.8,78],["Pases clave",28,47],["Regates",42,53]]},
                {c:"#3b82f6",label:"JUGADOR 2 — PRO INTERNACIONAL",name:"L. García",club:"Atlético Nacional · Copa Libertadores · 27a",stats:[["Goles",12,80],["Asistencias",7,58],["Rating",8.9,89],["Pases clave",43,72],["Regates",61,76]]}
              ].map((p,pi)=>(
                <div key={pi} style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontSize:11,fontWeight:700,color:p.c,letterSpacing:1,marginBottom:4}}>{p.label}</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:48,height:48,borderRadius:13,background:`${p.c}15`,border:`2px solid ${p.c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🎯</div>
                    <div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:"#eef2f6"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#4a6070",marginTop:1}}>{p.club}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
                    {p.stats.map(([l,v,pct])=>(
                      <div key={l} style={{display:"grid",gridTemplateColumns:"90px 1fr 36px",gap:8,alignItems:"center"}}>
                        <div style={{fontSize:11,color:"#4a6070"}}>{l}</div>
                        <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{width:`${pct}%`,height:"100%",background:p.c,borderRadius:2}}/></div>
                        <div style={{fontSize:12,fontWeight:700,color:p.c,textAlign:"right"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {pi===0&&<div/>}
                </div>
              ))}
              <div style={{background:"rgba(255,255,255,0.06)"}}/>
            </div>
            <div style={{padding:"14px 24px",background:"rgba(139,92,246,0.05)",borderTop:"1px solid rgba(139,92,246,0.12)",display:"flex",alignItems:"center",gap:12}}>
              <span style={{background:"rgba(139,92,246,0.18)",color:"#8b5cf6",padding:"3px 9px",borderRadius:5,fontSize:11,fontWeight:700}}>🤖 IA Scout</span>
              <span style={{fontSize:13,color:"#64748b"}}>M. Rodríguez tiene el 87% del rendimiento de L. García. Brecha principal: pases clave y rating bajo presión. Potencial de mejora alto.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLUBES ──────────────────────────────────────────────────────────── */}
      <div style={{background:"#040a0f",textAlign:"center",padding:"50px 6%"}}>
        <div style={{fontSize:11,color:"#4a6070",fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginBottom:28}}>Datos reales de estas ligas y más de 70 competencias activas</div>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          {["Colo Colo","River Plate","Flamengo","Atlético Nacional","Peñarol","Alianza Lima","Barcelona SC","Bolívar","Olimpia","MLS","Liga MX","U. de Chile","Boca Juniors","Palmeiras","Junior FC","Nacional Uruguay","+ 240 clubes más"].map(c=>(
            <span key={c} className="cbadge">{c}</span>
          ))}
        </div>
      </div>

      {/* ── PRECIOS ─────────────────────────────────────────────────────────── */}
      <section id="Precios" style={{padding:"100px 6%",background:"linear-gradient(180deg,#06101a 0%,#040a0f 100%)"}}>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:"#00e87a",fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16,justifyContent:"center"}}>
            <span style={{width:24,height:2,background:"#00e87a",display:"block"}}/>Precios
          </div>
          <h2 className="fs-sec-h">PLANES PARA<br/><span className="a">CADA NECESIDAD</span></h2>
          <p style={{fontSize:16,color:"#4a6070",marginBottom:48,fontWeight:300}}>Sin tarjeta de crédito. Comienza gratis hoy.</p>
          <div className="pgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,textAlign:"left"}}>
            {[
              {badge:"Ojeador Independiente",price:"0",period:"USD · Para siempre",feats:["1 liga · hasta 2 equipos","Scouting básico","5 informes IA por mes"],no:["Exportar PDF","Comparador Mundial","Análisis del rival"],btn:"Comenzar gratis",cl:"ou"},
              {badge:"Club / Técnico",price:"19",period:"USD / mes",best:true,feats:["Ligas y equipos ilimitados","10.000+ jugadores pro","Comparador Mundial PRO","Informes IA ilimitados","PDF profesional","Análisis del rival IA","Pipeline de fichajes"],btn:"Comenzar ahora →",cl:"pr"},
              {badge:"Director de Club",price:"49",period:"USD / mes",feats:["Todo lo del plan Club","Hasta 10 usuarios","Roles y permisos","Gestión multi-equipo","Rankings internos","Soporte prioritario"],btn:"Contactar ventas",cl:"ou"},
            ].map((p,i)=>(
              <div key={i} className={`pcard${p.best?" feat":""}`}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:p.best?"#00e87a":"#4a6070",display:"block",marginBottom:12}}>{p.badge}</span>
                  {p.best&&<span style={{background:"rgba(0,232,122,0.12)",color:"#00e87a",fontSize:10,padding:"2px 9px",borderRadius:100,fontWeight:700}}>Popular</span>}
                </div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,lineHeight:1,color:p.best?"#00e87a":"#fff",marginBottom:4}}><sup style={{fontSize:24,verticalAlign:"top",marginTop:12,color:p.best?"#00e87a":"#fff"}}>$</sup>{p.price}</div>
                <div style={{fontSize:13,color:"#4a6070",marginBottom:22}}>{p.period}</div>
                <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10,marginBottom:26}}>
                  {p.feats.map(f=><li key={f} style={{fontSize:13,color:"#4a6070",display:"flex",alignItems:"center",gap:9}}><span style={{color:"#00e87a",fontWeight:700,flexShrink:0}}>✓</span>{f}</li>)}
                  {(p.no||[]).map(f=><li key={f} style={{fontSize:13,color:"#4a6070",opacity:.32,display:"flex",alignItems:"center",gap:9}}><span style={{fontWeight:700,flexShrink:0}}>—</span>{f}</li>)}
                </ul>
                <button onClick={p.cl==="pr"?onLogin:undefined} className="btn-p" style={p.cl==="ou"?{background:"transparent",color:"#eef2f6",border:"1px solid rgba(255,255,255,0.1)",width:"100%",padding:12,fontSize:13,justifyContent:"center",borderRadius:10}:{width:"100%",padding:12,fontSize:13,justifyContent:"center",borderRadius:10}}>{p.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{padding:"110px 6%",background:"#040a0f",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:-60,left:"50%",transform:"translateX(-50%)",width:800,height:400,background:"radial-gradient(ellipse at center,rgba(0,232,122,0.09) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(50px,9vw,100px)",lineHeight:1,letterSpacing:3,marginBottom:18}}>
            EL TALENTO<br/><span style={{color:"#00e87a"}}>MERECE</span> SER<br/>DESCUBIERTO
          </h2>
          <p style={{fontSize:17,color:"#4a6070",marginBottom:42,fontWeight:300}}>FichaScout — La primera plataforma de scouting profesional<br/>para el fútbol amateur latinoamericano.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={onLogin} className="btn-p" style={{padding:"16px 42px",fontSize:15}}>Crear cuenta gratis →</button>
            <button onClick={onLogin} className="btn-o" style={{padding:"15px 34px",fontSize:14}}>Iniciar sesión</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{background:"#030810",borderTop:"1px solid rgba(255,255,255,0.07)",padding:"44px 6%"}}>
        <div className="footer-g" style={{maxWidth:1180,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:36}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:9,background:"#00e87a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚽</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17}}>Ficha<span style={{color:"#00e87a"}}>Scout</span></div>
            </div>
            <p style={{fontSize:13,color:"#4a6070",lineHeight:1.7,maxWidth:240}}>La plataforma de scouting para descubrir el talento invisible del fútbol amateur latinoamericano.</p>
          </div>
          {[["Plataforma",["Funciones","Comparador","Precios","API"]],["Recursos",["Documentación","Blog","Soporte","Changelog"]],["Legal",["Privacidad","Términos","Cookies","Contacto"]]].map(([h,links])=>(
            <div key={h}>
              <h4 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#eef2f6",letterSpacing:.5,marginBottom:14,textTransform:"uppercase"}}>{h}</h4>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:9}}>
                {links.map(l=><li key={l}><a href="#" style={{color:"#4a6070",textDecoration:"none",fontSize:13,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#00e87a"} onMouseLeave={e=>e.target.style.color="#4a6070"}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{maxWidth:1180,margin:"36px auto 0",paddingTop:22,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,fontSize:12,color:"#4a6070"}}>
          <span>© 2025 FichaScout. Todos los derechos reservados.</span>
          <span>Hecho con ❤️ para el fútbol latinoamericano</span>
          <span>fichascout.com</span>
        </div>
      </footer>
    </div>
  )
}

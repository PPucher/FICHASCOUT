import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const Card = ({children,style={}}) => <div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",padding:20,...style}}>{children}</div>;
const Lbl = ({children}) => <div style={{color:"#4a6070",fontSize:11,marginBottom:6,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{children}</div>;
const Bdg = ({color="#64748b",children}) => <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
const BB  = {border:"none",borderRadius:10,padding:"9px 18px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",fontFamily:"inherit"};
const BG  = {border:"none",borderRadius:10,padding:"9px 18px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:13,background:"linear-gradient(135deg,#00e87a,#00c96a)",fontFamily:"inherit"};
const posColor = p => p==="Arquero"?"#f59e0b":p==="Defensor"?"#3b82f6":p==="Volante"?"#10b981":"#ef4444";
const posIcon  = p => p==="Arquero"?"GK":p==="Defensor"?"DEF":p==="Volante"?"MID":"FWD";

function RadarChart({ datos, etiquetas, color = "#8b5cf6", size = 200 }) {
  const n = etiquetas.length;
  const cx = size/2, cy = size/2, r = size*0.38;
  const angulo = i => (i*2*Math.PI)/n - Math.PI/2;
  const polygonPoints = datos.map((v,i) => {const a=angulo(i);const radio=(v/100)*r;return [cx+radio*Math.cos(a),cy+radio*Math.sin(a)];});
  const gridLevels = [20,40,60,80,100];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map(lvl=>{const pts=etiquetas.map((_,i)=>{const a=angulo(i);const radio=(lvl/100)*r;return `${cx+radio*Math.cos(a)},${cy+radio*Math.sin(a)}`;}).join(' ');return <polygon key={lvl} points={pts} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>;})}
      {etiquetas.map((_,i)=>{const a=angulo(i);return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>;})}
      <polygon points={polygonPoints.map(p=>p.join(',')).join(' ')} fill={color+"33"} stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      {polygonPoints.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill={color} stroke="#0f172a" strokeWidth="1.5"/>)}
      {etiquetas.map((lbl,i)=>{const a=angulo(i);const lx=cx+(r+18)*Math.cos(a);const ly=cy+(r+18)*Math.sin(a);return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">{lbl}</text>;})}
    </svg>
  );
}

function calcPercentil(valor, arr) {
  if(!arr||arr.length===0||valor===null||valor===undefined) return null;
  const validos = arr.filter(v=>v!==null&&v!==undefined&&v>0);
  if(validos.length===0) return null;
  const menores = validos.filter(v=>v<=valor).length;
  return Math.round((menores/validos.length)*100);
}

function getDatosRadar(j) {
  const s=j.s||{};
  if(j.pos==="Arquero") return {etiquetas:["Atajadas","Regularidad","Duelos","Rating","Minutos","Distrib."],valores:[Math.min(100,(s.ata||0)*15),Math.min(100,(s.min/2700)*100),Math.min(100,((s.due||0)/80)*100),s.rat?Math.round(((s.rat-5)/4)*100):0,Math.min(100,(s.min/2700)*100),Math.min(100,((s.pas||0)/500)*100)]};
  if(j.pos==="Defensor") return {etiquetas:["Duelos","Tackles","Intercepc.","Pases","Regates","Rating"],valores:[Math.min(100,((s.due||0)/200)*100),Math.min(100,((s.tac||0)/80)*100),Math.min(100,((s.int||0)/50)*100),Math.min(100,((s.pas||0)/2000)*100),Math.min(100,((s.reg||0)/30)*100),s.rat?Math.round(((s.rat-5)/4)*100):0]};
  if(j.pos==="Volante") return {etiquetas:["Pases","Pases Clave","Duelos","Regates","Recuperac.","Rating"],valores:[Math.min(100,((s.pas||0)/2000)*100),Math.min(100,((s.pc||0)/60)*100),Math.min(100,((s.due||0)/180)*100),Math.min(100,((s.reg||0)/50)*100),Math.min(100,((s.tac||0)/70)*100),s.rat?Math.round(((s.rat-5)/4)*100):0]};
  return {etiquetas:["Goles","Asistencias","Disparos","Pases Clave","Regates","Rating"],valores:[Math.min(100,((s.g||0)/25)*100),Math.min(100,((s.a||0)/15)*100),Math.min(100,((s.dis||0)/80)*100),Math.min(100,((s.pc||0)/50)*100),Math.min(100,((s.reg||0)/80)*100),s.rat?Math.round(((s.rat-5)/4)*100):0]};
}

function StatBar({label,valor,max,percentil}){
  const pct=Math.min(100,max>0?(valor/max)*100:0);
  const c=pct>=75?"#00e87a":pct>=50?"#3b82f6":pct>=25?"#f59e0b":"#ef4444";
  return(<div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3,alignItems:"center"}}><span style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{label}</span><div style={{display:"flex",gap:8,alignItems:"center"}}>{percentil!==null&&percentil!==undefined&&<span style={{fontSize:10,color:percentil>=75?"#00e87a":percentil>=50?"#3b82f6":"#f59e0b",fontWeight:700}}>P{percentil}</span>}<span style={{fontSize:13,fontWeight:800,color:"#eef2f6"}}>{valor}</span></div></div><div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${c}88,${c})`,borderRadius:4,transition:"width 0.6s ease"}}/></div></div>);
}

function buildPrompt(jugador, percentiles) {
  const s=jugador.s||{};
  const pctStr=percentiles?Object.entries(percentiles).filter(([,v])=>v!==null).map(([k,v])=>`${k}: percentil ${v}`).join(', '):'';
  return `Eres un scout profesional de futbol sudamericano. Genera un informe completo del siguiente jugador buscando informacion en internet primero.

JUGADOR: ${jugador.n} | ${jugador.pos} | ${jugador.e} anos | ${jugador.pais}
EQUIPO: ${jugador.eq} | Liga: ${jugador.l}
STATS: Partidos:${s.am||0} Min:${s.min||0} Goles:${s.g||0} Asist:${s.a||0} Rating:${s.rat?.toFixed(2)||'N/D'}
AVANZADO: Pases:${s.pas||0} Pases clave:${s.pc||0} Disparos:${s.dis||0} Tackles:${s.tac||0} Int:${s.int||0} Duelos:${s.due||0} Regates:${s.reg||0}
PERCENTILES vs posicion: ${pctStr||'calculando...'}

INSTRUCCIONES: 
1. Usa web_search para buscar "${jugador.n} ${jugador.eq} futbolista estadisticas"
2. Busca tambien "${jugador.n} football player profile"
3. Con esa informacion + las stats, responde SOLO con este XML:

<informe>
<perfil_general>3-4 oraciones sobre quien es, trayectoria y contexto en la liga</perfil_general>
<estilo_de_juego>4-5 oraciones describiendo como juega, movimientos, rol en el equipo</estilo_de_juego>
<fortalezas>
- [TECNICA] descripcion con dato
- [FISICA] descripcion
- [TACTICA] descripcion
- [MENTAL] descripcion
</fortalezas>
<debilidades>
- [area 1] descripcion con dato estadistico
- [area 2] descripcion
- [area 3] descripcion
</debilidades>
<analisis_estadistico>3-4 oraciones interpretando numeros y percentiles en contexto</analisis_estadistico>
<proyeccion>3 oraciones sobre potencial, mercado posible y valor estimado</proyeccion>
<recomendacion_scout>VEREDICTO: [FICHAR AHORA / SEGUIR OBSERVANDO / NO RECOMENDADO]
Justificacion en 2 oraciones concretas.</recomendacion_scout>
</informe>`;
}

function parseInforme(text){
  const ex=tag=>{const m=text.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));return m?m[1].trim():null;};
  return {perfil:ex('perfil_general'),estilo:ex('estilo_de_juego'),fortalezas:ex('fortalezas'),debilidades:ex('debilidades'),analisis:ex('analisis_estadistico'),proyeccion:ex('proyeccion'),recomendacion:ex('recomendacion_scout')};
}

function exportarPDF(jugador, informe) {
  const color=posColor(jugador.pos);
  const s=jugador.s||{};
  const vC=informe.recomendacion?.includes('FICHAR')?"#00e87a":informe.recomendacion?.includes('SEGUIR')?"#f59e0b":"#ef4444";
  const html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe Scout - ${jugador.n}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1e293b;font-size:13px;line-height:1.6}.header{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:28px 32px;display:flex;align-items:center;gap:20px}.name{font-size:22px;font-weight:800;margin-bottom:4px}.sub{color:#94a3b8;font-size:13px}.content{padding:24px 32px}.sec{margin-bottom:20px}.sec-t{font-size:12px;font-weight:800;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #f1f5f9}.sec-p{color:#334155;line-height:1.75;font-size:13px}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}.grid3{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:18px}.chip{background:#f8fafc;border-radius:8px;padding:10px;text-align:center;border:1px solid #e2e8f0}.chip-v{font-size:18px;font-weight:800;color:#1e293b}.chip-l{font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;margin-top:2px}.fort{padding:7px 12px;background:#f0fdf4;border-left:3px solid #00e87a;border-radius:4px;margin-bottom:5px;font-size:12px;color:#166534}.deb{padding:7px 12px;background:#fff7ed;border-left:3px solid #f59e0b;border-radius:4px;margin-bottom:5px;font-size:12px;color:#92400e}.verd{padding:14px;border-radius:10px;font-weight:800;font-size:14px;text-align:center;margin-bottom:10px}.footer{background:#f8fafc;padding:14px 32px;text-align:center;color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0}@media print{body{-webkit-print-color-adjust:exact}}</style></head><body>
  <div class="header"><div><div class="name">${jugador.n}</div><div class="sub">${jugador.pos} · ${jugador.eq} · ${jugador.l} · ${jugador.pais} · ${jugador.e} anos</div></div><div style="margin-left:auto;text-align:right"><div style="font-size:11px;color:#64748b">FichaScout Informe Pro</div><div style="font-size:11px;color:#64748b">${new Date().toLocaleDateString('es-CL')}</div></div></div>
  <div class="content">
    <div class="grid3">${[[s.am||0,'Partidos'],[s.min||0,'Minutos'],[s.g||0,'Goles'],[s.a||0,'Asist.'],[s.rat?.toFixed(2)||'—','Rating'],[s.dis||0,'Disparos']].map(([v,l])=>`<div class="chip"><div class="chip-v">${v}</div><div class="chip-l">${l}</div></div>`).join('')}</div>
    <div class="grid2">
      <div>
        ${informe.perfil?`<div class="sec"><div class="sec-t">Perfil General</div><div class="sec-p">${informe.perfil}</div></div>`:''}
        ${informe.estilo?`<div class="sec"><div class="sec-t">Estilo de Juego</div><div class="sec-p">${informe.estilo}</div></div>`:''}
        ${informe.analisis?`<div class="sec"><div class="sec-t">Analisis Estadistico</div><div class="sec-p">${informe.analisis}</div></div>`:''}
        ${informe.proyeccion?`<div class="sec"><div class="sec-t">Proyeccion de Carrera</div><div class="sec-p">${informe.proyeccion}</div></div>`:''}
      </div>
      <div>
        ${informe.fortalezas?`<div class="sec"><div class="sec-t">Fortalezas</div>${informe.fortalezas.split('\n').filter(l=>l.trim()).map(l=>`<div class="fort">${l.replace(/^[-•]\s*/,'')}</div>`).join('')}</div>`:''}
        ${informe.debilidades?`<div class="sec"><div class="sec-t">Areas de Mejora</div>${informe.debilidades.split('\n').filter(l=>l.trim()).map(l=>`<div class="deb">${l.replace(/^[-•]\s*/,'')}</div>`).join('')}</div>`:''}
        ${informe.recomendacion?`<div class="sec"><div class="sec-t">Recomendacion del Scout</div><div class="verd" style="background:${vC}22;color:${vC};border:2px solid ${vC}44">${informe.recomendacion.split('\n')[0]}</div><div class="sec-p">${informe.recomendacion.split('\n').slice(1).join(' ').trim()}</div></div>`:''}
      </div>
    </div>
  </div>
  <div class="footer">FichaScout(tm) con IA Claude + Web Search · ${new Date().getFullYear()}</div>
  </body></html>`;
  const win=window.open('','_blank');
  win.document.write(html);win.document.close();
  setTimeout(()=>win.print(),800);
}

export default function InformePro({ jugador: jugadorProp, todos, onClose }) {
  const [jugadorActivo, setJugadorActivo] = useState(jugadorProp||null);
  const [query, setQuery]         = useState(jugadorProp?.n||"");
  const [showSugg, setShowSugg]   = useState(false);
  const [jugadores2, setJugadores2] = useState(Array.isArray(todos)&&todos.length>0?todos:[]);
  const [fase, setFase]       = useState("idle");
  const [informe, setInforme] = useState(null);
  const [progreso, setProgreso] = useState("");
  const [error, setError]     = useState(null);
    const llamandoRef = useRef(false); // Guard anti-doble-clic
  
  // Auto-load JSON if todos is empty
  useEffect(()=>{
    if(Array.isArray(todos)&&todos.length>0){setJugadores2(todos);return;}
    fetch('/fichascout_pro_data.json').then(r=>r.json()).then(d=>{setJugadores2(d?.jugadores||[]);}).catch(()=>{});
  },[todos]);

  // Sugerencias autocomplete
  const sugerencias = query.length>=2 ? jugadores2.filter(j=>j.n&&j.n.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>(b.s?.min||0)-(a.s?.min||0)).slice(0,8) : [];
  
  // Guard: if no jugador selected, show search
  const jugador = jugadorActivo;

  // Percentiles calculados con useMemo para no bloquear render
  const percentiles = useMemo(() => {
    if(!jugador||!jugadores2||!jugadores2.length) return {};
    const mp = jugadores2.filter(j=>j.pos===jugador.pos&&j.s).slice(0,2000);
    if(!mp.length) return {};
    const get = f => mp.map(j=>j.s?.[f]).filter(v=>v!=null&&v!==0);
    const s = jugador.s||{};
    return {
      'Goles/90': calcPercentil(s.g&&s.min?(s.g/s.min)*90:0, mp.map(j=>j.s?.min?(j.s.g||0)/j.s.min*90:0)),
      'Pases': calcPercentil(s.pas, get('pas')),
      'Duelos': calcPercentil(s.due, get('due')),
      'Regates': calcPercentil(s.reg, get('reg')),
      'Tackles': calcPercentil(s.tac, get('tac')),
      'Rating': calcPercentil(s.rat, get('rat')),
    };
  }, [jugador?.id, jugadores2.length])

  const radarData = jugador ? getDatosRadar(jugador) : {etiquetas:[],valores:[]};

  const generarInforme = async () => {
    if(llamandoRef.current){console.warn("InformePro: llamada ya en curso, ignorando doble clic");return;}
        llamandoRef.current = true;
    setFase("loading");setProgreso("Buscando informacion del jugador en internet...");setError(null);
    try {
      const response = await fetch("/api/claude", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",max_tokens:1800,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:buildPrompt(jugador,percentiles)}]
        })
      });
      if(!response.ok){const err=await response.json();throw new Error(err.error?.message||`HTTP ${response.status}`);}
      setProgreso("Redactando informe profesional...");
      const data = await response.json();
      const textBlocks = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");
      if(!textBlocks) throw new Error("Claude no devolvio texto");
      const parsed = parseInforme(textBlocks);
      if(!parsed.perfil&&!parsed.estilo) parsed.perfil = textBlocks.substring(0,500);
      setInforme(parsed);setFase("done");
    } catch(e) { setError(e.message);setFase("error"); } finally { llamandoRef.current = false; }
  };

  const s = jugador?.s||{};

  // If no jugador selected, show search interface
  if(!jugador) return (
    <div style={{fontFamily:"'Inter',sans-serif",color:"#eef2f6"}}>
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
          <div style={{background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",borderRadius:14,padding:"11px 15px",fontSize:24,boxShadow:"0 4px 20px rgba(139,92,246,0.3)"}}>📋</div>
          <div><h2 style={{margin:0,fontSize:24,fontWeight:900,letterSpacing:-0.8}}>Informe Pro IA</h2><p style={{margin:0,fontSize:13,color:"#64748b"}}>Analisis profundo con Claude + busqueda web en tiempo real</p></div>
        </div>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",padding:20,marginBottom:20}}>
        <div style={{fontSize:11,color:"#4a6070",marginBottom:6,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>Busca el jugador a analizar</div>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span>
          <input style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 13px 9px 36px",color:"#eef2f6",fontSize:14,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"}} placeholder="Nombre del jugador..." value={query} onChange={e=>{setQuery(e.target.value);setShowSugg(true);}} onFocus={()=>setShowSugg(true)} onBlur={()=>setTimeout(()=>setShowSugg(false),180)}/>
          {showSugg&&sugerencias.length>0&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#0f1923",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,overflow:"hidden",zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
            {sugerencias.map(j=><div key={j.id} onMouseDown={()=>{setJugadorActivo(j);setQuery(j.n);setShowSugg(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(139,92,246,0.1)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <img src={j.foto} onError={e=>e.target.style.display='none'} style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13}}>{j.n}</div><div style={{fontSize:11,color:"#64748b"}}>{j.pos} · {j.eq} · {j.pais}</div></div>
              <div style={{fontSize:11,color:"#64748b"}}>{j.e}a</div>
            </div>)}
          </div>}
          {jugadores2.length===0&&<div style={{marginTop:8,fontSize:12,color:"#ef4444"}}>Cargando base de datos...</div>}
        </div>
      </div>
      <div style={{background:"rgba(139,92,246,0.05)",border:"1px solid rgba(139,92,246,0.15)",borderRadius:16,padding:40,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>🤖</div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>Informe Scout con IA + Web Search</div>
        <div style={{fontSize:13,color:"#64748b",lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>Busca un jugador arriba. Claude buscara informacion en internet, analizara sus estadisticas en contexto de los 43.400 jugadores y generara un informe profesional completo con radar chart y PDF exportable.</div>
      </div>
    </div>
  );

  return(
    <div style={{fontFamily:"'Inter',sans-serif",color:"#eef2f6"}}>
      {/* Header */}
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:14,alignItems:"center",flex:1}}>
          <img src={jugador.foto} alt={jugador.n} onError={e=>{e.target.style.display='none'}} style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",border:`3px solid ${posColor(jugador.pos)}44`,flexShrink:0}}/>
          <div>
            <h2 style={{margin:0,fontSize:20,fontWeight:900}}>{jugador.n}</h2>
            <div style={{fontSize:13,color:"#94a3b8",marginBottom:6}}>{jugador.eq} · {jugador.l} · {jugador.pais}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Bdg color={posColor(jugador.pos)}>{jugador.pos}</Bdg><Bdg color="#64748b">{jugador.e} anos</Bdg>{jugador.alt&&<Bdg color="#64748b">{jugador.alt}</Bdg>}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{setJugadorActivo(null);setQuery("");setFase("idle");setInforme(null);}} style={{...BB,padding:"8px 14px",fontSize:12,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)"}}>🔍 Cambiar jugador</button>
          {onClose&&<button onClick={onClose} style={{...BB,padding:"8px 14px",fontSize:12}}>← Volver</button>}
        </div>
      </div>

      {/* Stats + Radar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,marginBottom:20}}>
        <Card>
          <Lbl>Estadisticas de temporada</Lbl>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:8,marginBottom:16}}>
            {[{k:"Partidos",v:s.am||0},{k:"Minutos",v:s.min||0},{k:"Goles",v:s.g||0},{k:"Asist.",v:s.a||0},{k:"Rating",v:s.rat?.toFixed(2)||"—"},{k:"Disparos",v:s.dis||0}].map(st=><div key={st.k} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:8,textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:16,fontWeight:800}}>{st.v}</div><div style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase"}}>{st.k}</div></div>)}
          </div>
          <Lbl>Metricas detalladas</Lbl>
          <StatBar label="Pases totales" valor={s.pas||0} max={2500} percentil={percentiles['Pases']}/>
          <StatBar label="Duelos" valor={s.due||0} max={250} percentil={percentiles['Duelos']}/>
          <StatBar label="Regates" valor={s.reg||0} max={80} percentil={percentiles['Regates']}/>
          <StatBar label="Tackles" valor={s.tac||0} max={80} percentil={percentiles['Tackles']}/>
          <StatBar label="Pases clave" valor={s.pc||0} max={60}/>
          {s.int>0&&<StatBar label="Intercepciones" valor={s.int} max={60}/>}
        </Card>
        <Card style={{display:"flex",flexDirection:"column",alignItems:"center",padding:16,minWidth:230}}>
          <Lbl>Perfil de juego</Lbl>
          <RadarChart datos={radarData.valores} etiquetas={radarData.etiquetas} color={posColor(jugador.pos)} size={200}/>
          <div style={{marginTop:8,fontSize:11,color:"#64748b",textAlign:"center"}}>Normalizado vs elite mundial</div>
        </Card>
      </div>

      {/* Percentiles */}
      {Object.keys(percentiles).length>0&&<Card style={{marginBottom:20}}>
        <Lbl>Percentiles vs {jugador.pos}es (43.400 jugadores)</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
          {Object.entries(percentiles).filter(([,v])=>v!==null).map(([k,v])=>{const c=v>=75?"#00e87a":v>=50?"#3b82f6":v>=25?"#f59e0b":"#ef4444";const l=v>=75?"Top 25%":v>=50?"Sobre media":v>=25?"Bajo media":"Bottom 25%";return(<div key={k} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,border:`1px solid ${c}33`,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:c}}>P{v}</div><div style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:2}}>{k}</div><div style={{fontSize:10,color:c,marginTop:2}}>{l}</div></div>);})}
        </div>
      </Card>}

      {/* CTA generar */}
      {fase==="idle"&&<Card style={{textAlign:"center",padding:32,background:"rgba(139,92,246,0.05)",borderColor:"rgba(139,92,246,0.2)"}}>
        <div style={{fontSize:36,marginBottom:12}}>🤖</div>
        <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>Informe Scout con IA + Busqueda Web</div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:20,lineHeight:1.7}}>Claude buscara informacion actualizada en internet sobre <strong style={{color:"#eef2f6"}}>{jugador.n}</strong>, analizara sus estadisticas en contexto y generara un informe profesional completo.</div>
        <button onClick={generarInforme} style={{background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",border:"none",borderRadius:12,padding:"13px 32px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit",boxShadow:"0 4px 20px rgba(139,92,246,0.35)"}}>Generar Informe IA</button>
      </Card>}

      {fase==="loading"&&<Card style={{textAlign:"center",padding:40,background:"rgba(139,92,246,0.05)",borderColor:"rgba(139,92,246,0.2)"}}>
        <div style={{fontSize:36,marginBottom:12}}>⚡</div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>Analizando jugador...</div>
        <div style={{fontSize:13,color:"#8b5cf6"}}>{progreso}</div>
        <div style={{marginTop:16,height:4,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:"60%",background:"linear-gradient(90deg,#8b5cf688,#8b5cf6)",borderRadius:4}}/></div>
      </Card>}

      {fase==="error"&&<Card style={{background:"rgba(239,68,68,0.06)",borderColor:"rgba(239,68,68,0.2)",marginBottom:16}}>
        <div style={{color:"#ef4444",fontWeight:700,marginBottom:6}}>Error al generar informe</div>
        <div style={{fontSize:12,color:"#94a3b8",marginBottom:12}}>{error}</div>
        <button onClick={generarInforme} style={{...BB,fontSize:12}}>Reintentar</button>
      </Card>}

      {fase==="done"&&informe&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{fontWeight:800,fontSize:16}}>Informe Scout Completo</div><div style={{fontSize:12,color:"#64748b"}}>IA Claude + busqueda web en tiempo real</div></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={generarInforme} style={{...BB,padding:"8px 14px",fontSize:12}}>Regenerar</button>
            <button onClick={()=>exportarPDF(jugador,informe)} style={{...BG,padding:"8px 14px",fontSize:12}}>Exportar PDF</button>
          </div>
        </div>
        {informe.recomendacion&&(()=>{const eF=informe.recomendacion.includes('FICHAR'),eS=informe.recomendacion.includes('SEGUIR'),c=eF?"#00e87a":eS?"#f59e0b":"#ef4444",ic=eF?"?":"?";return(<Card style={{marginBottom:16,background:`${c}0a`,borderColor:`${c}33`,textAlign:"center",padding:16}}><div style={{fontSize:28,marginBottom:6}}>{ic}</div><div style={{fontSize:16,fontWeight:900,color:c}}>{informe.recomendacion.split('\n')[0]}</div>{informe.recomendacion.split('\n').slice(1).join(' ').trim()&&<div style={{fontSize:13,color:"#94a3b8",marginTop:6}}>{informe.recomendacion.split('\n').slice(1).join(' ').trim()}</div>}</Card>);})()}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {informe.perfil&&<Card><Lbl>Perfil General</Lbl><p style={{fontSize:13,color:"#94a3b8",lineHeight:1.75}}>{informe.perfil}</p></Card>}
          {informe.estilo&&<Card><Lbl>Estilo de Juego</Lbl><p style={{fontSize:13,color:"#94a3b8",lineHeight:1.75}}>{informe.estilo}</p></Card>}
          {informe.fortalezas&&<Card style={{background:"rgba(0,232,122,0.04)",borderColor:"rgba(0,232,122,0.15)"}}><Lbl>Fortalezas</Lbl>{informe.fortalezas.split('\n').filter(l=>l.trim()).map((l,i)=><div key={i} style={{padding:"6px 10px",background:"rgba(0,232,122,0.08)",borderLeft:"3px solid #00e87a",borderRadius:"4px",marginBottom:6,fontSize:12,color:"#d1fae5"}}>{l.replace(/^[-•]\s*/,'')}</div>)}</Card>}
          {informe.debilidades&&<Card style={{background:"rgba(245,158,11,0.04)",borderColor:"rgba(245,158,11,0.15)"}}><Lbl>Areas de Mejora</Lbl>{informe.debilidades.split('\n').filter(l=>l.trim()).map((l,i)=><div key={i} style={{padding:"6px 10px",background:"rgba(245,158,11,0.08)",borderLeft:"3px solid #f59e0b",borderRadius:"4px",marginBottom:6,fontSize:12,color:"#fef3c7"}}>{l.replace(/^[-•]\s*/,'')}</div>)}</Card>}
        </div>
        {informe.analisis&&<Card style={{marginTop:14}}><Lbl>Analisis Estadistico en Contexto</Lbl><p style={{fontSize:13,color:"#94a3b8",lineHeight:1.75}}>{informe.analisis}</p></Card>}
        {informe.proyeccion&&<Card style={{marginTop:14,background:"rgba(99,102,241,0.05)",borderColor:"rgba(99,102,241,0.2)"}}><Lbl>Proyeccion de Carrera</Lbl><p style={{fontSize:13,color:"#c4b5fd",lineHeight:1.75}}>{informe.proyeccion}</p></Card>}
      </div>}
    </div>
  );
}

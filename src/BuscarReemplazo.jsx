import { useState, useEffect, useMemo } from "react";
import InformePro from "./InformePro.jsx";

const I={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 13px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const BB={border:"none",borderRadius:10,padding:"9px 18px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",fontFamily:"inherit"};
const Card=({children,style={}})=><div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",padding:20,...style}}>{children}</div>;
const Lbl=({children})=><div style={{color:"#4a6070",fontSize:11,marginBottom:6,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{children}</div>;
const Bdg=({color="#64748b",children,size="sm"})=><span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:size==="lg"?"4px 12px":"2px 8px",fontSize:size==="lg"?13:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
const LIGA_INFO={39:{n:"Premier League",t:1},2:{n:"Champions League",t:1},140:{n:"La Liga",t:1},135:{n:"Serie A",t:1},78:{n:"Bundesliga",t:1},61:{n:"Ligue 1",t:1},88:{n:"Eredivisie",t:2},94:{n:"Primeira Liga",t:2},262:{n:"Liga MX",t:2},253:{n:"MLS",t:2},128:{n:"Liga Profesional AR",t:3},71:{n:"Serie A BR",t:3},239:{n:"Primera A CO",t:3},268:{n:"Primera Div UY",t:3},13:{n:"Copa Libertadores",t:2},11:{n:"Copa Sudamericana",t:3},265:{n:"Primera Division CL",t:4},266:{n:"Primera B CL",t:4},267:{n:"Copa Chile",t:4},131:{n:"Primera B Metro AR",t:4},72:{n:"Serie B BR",t:4},75:{n:"Serie C BR",t:4},241:{n:"Liga Nacional CO",t:4},283:{n:"Liga 1 PE",t:4},240:{n:"LigaPro EC",t:4},209:{n:"Division Profesional BO",t:4},282:{n:"Division Honor PY",t:4},292:{n:"Liga FUTVE",t:4}};
const posIcon=p=>p==="Arquero"?"🧤":p==="Defensor"?"🛡️":p==="Volante"?"🧱":"🎯";
const posColor=p=>p==="Arquero"?"#f59e0b":p==="Defensor"?"#3b82f6":p==="Volante"?"#10b981":"#ef4444";
const tierLabel=t=>t===1?"Elite":t===2?"Internacional":t===3?"Sudamerica":"Local";
const tierColor=t=>t===1?"#f59e0b":t===2?"#3b82f6":t===3?"#10b981":"#64748b";

function calcSimilitud(obj,cand){
  if(obj.pos!==cand.pos)return -1;
  const diffE=Math.abs((obj.e||25)-(cand.e||25));
  if(diffE>7)return -1;
  const sE=Math.max(0,1-diffE/8);
  const minO=obj.s?.min||1,minC=cand.s?.min||1;
  const p90O=(((obj.s?.g||0)+(obj.s?.a||0))/minO)*90;
  const p90C=(((cand.s?.g||0)+(cand.s?.a||0))/minC)*90;
  const diffP=p90O>0?Math.abs(p90O-p90C)/p90O:Math.abs(p90C);
  const sP=Math.max(0,1-diffP*1.8);
  const rO=Math.min(1,minO/2500),rC=Math.min(1,minC/2500);
  const sR=1-Math.abs(rO-rC);
  const tO=LIGA_INFO[obj.l_id]?.t||3,tC=LIGA_INFO[cand.l_id]?.t||3;
  const dT=tC-tO;
  const sT=dT<=0?1.0:dT===1?0.9:dT===2?0.75:0.60;
  return Math.round(Math.min(99,(sE*0.25+sP*0.30+sR*0.20+sT*0.15+0.10)*100));
}
function Foto({foto,n,pos,size=44}){const[err,setErr]=useState(false);const bg=posColor(pos);if(!foto||err)return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${bg}33,${bg}11)`,border:`2px solid ${bg}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,flexShrink:0}}>{posIcon(pos)}</div>;return <img src={foto} alt={n} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`2px solid ${bg}44`,flexShrink:0}}/>;}
function CompatBar({valor}){const c=valor>=85?"#00e87a":valor>=70?"#3b82f6":valor>=55?"#f59e0b":"#ef4444";const l=valor>=85?"Excelente":valor>=70?"Muy bueno":valor>=55?"Bueno":"Moderado";return(<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:"#64748b",fontWeight:600,textTransform:"uppercase"}}>Compatibilidad</span><span style={{fontSize:12,fontWeight:800,color:c}}>{valor}%</span></div><div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${valor}%`,background:`linear-gradient(90deg,${c}88,${c})`,borderRadius:4,transition:"width 0.8s ease"}}/></div><div style={{fontSize:10,color:c,marginTop:2,fontWeight:600}}>{l}</div></div>);}
function StatChip({label,val,color="#94a3b8"}){return <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:15,fontWeight:800,color}}>{val??"-"}</div><div style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:1}}>{label}</div></div>;}

export default function BuscarReemplazo({datos}){
  const [jugadores, setJugadores] = useState(Array.isArray(datos)&&datos.length>0?datos:[]);
  useEffect(()=>{
    if(Array.isArray(datos)&&datos.length>0){setJugadores(datos);return;}
    // Self-load if parent hasn't loaded yet
    fetch('/fichascout_pro_data.json').then(r=>r.json()).then(d=>{setJugadores(d?.jugadores||[]);}).catch(()=>{});
  },[datos]);
  const[query,setQuery]=useState("");
  const[objetivo,setObjetivo]=useState(null);
  const[resultados,setResultados]=useState([]);
  const[buscando,setBuscando]=useState(false);
  const[detalle,setDetalle]=useState(null);
  const[showSugg,setShowSugg]=useState(false);
  const[filtroRegion,setFiltroRegion]=useState("todas");
  const[filtroEdad,setFiltroEdad]=useState(5);
  const[informeJugador,setInformeJugador]=useState(null);

  const sugerencias=useMemo(()=>{
    if(!query||query.length<2||!jugadores.length)return[];
    const q=query.toLowerCase().trim();
    return jugadores.filter(j=>j.n&&j.n.toLowerCase().includes(q)).sort((a,b)=>(b.s?.min||0)-(a.s?.min||0)).slice(0,8);
  },[query,jugadores]);

  const seleccionar=j=>{setObjetivo(j);setQuery(j.n);setShowSugg(false);setResultados([]);setDetalle(null);};

  const buscar=()=>{
    if(!objetivo||!jugadores.length)return;
    setBuscando(true);setDetalle(null);
    setTimeout(()=>{
      const candidatos=[];
      for(const j of jugadores){
        if(j.id===objetivo.id)continue;
        if(Math.abs((j.e||25)-(objetivo.e||25))>filtroEdad+1)continue;
        const tier=LIGA_INFO[j.l_id]?.t||3;
        if(filtroRegion==="sa"&&tier<3)continue;
        if(filtroRegion==="europa"&&tier>2)continue;
        const compat=calcSimilitud(objetivo,j);
        if(compat<40)continue;
        candidatos.push({...j,_compat:compat});
      }
      candidatos.sort((a,b)=>b._compat-a._compat);
      const top=[],seen=new Set(),resto2=[];
      for(const c of candidatos){if(top.length>=20)break;if(!seen.has(c.pais)||top.length<6){top.push(c);seen.add(c.pais);}else resto2.push(c);}
      for(const c of resto2){if(top.length>=20)break;top.push(c);}
      setResultados(top);setBuscando(false);
    },150);
  };

  const top3=resultados.slice(0,3);
  const resto=resultados.slice(3);

  if(informeJugador) return <InformePro jugador={informeJugador} todos={jugadores} onClose={()=>setInformeJugador(null)}/>;

  return(
    <div style={{fontFamily:"'Inter',sans-serif",color:"#eef2f6"}}>
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
          <div style={{background:"linear-gradient(135deg,#ef4444,#dc2626)",borderRadius:14,padding:"11px 15px",fontSize:24,boxShadow:"0 4px 20px rgba(239,68,68,0.3)"}}>🔄</div>
          <div><h2 style={{margin:0,fontSize:24,fontWeight:900,letterSpacing:-0.8}}>Buscar Reemplazo</h2><p style={{margin:0,fontSize:13,color:"#64748b"}}>Sustituto ideal entre {jugadores.length.toLocaleString()} jugadores profesionales</p></div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["🎯 Compatibilidad multi-dimensional","⚡ Misma posicion garantizada","🌎 Paises diversificados"].map((t,i)=><div key={i} style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:8,padding:"4px 12px",fontSize:12,color:"#94a3b8"}}>{t}</div>)}</div>
      </div>

      {!detalle&&<Card style={{marginBottom:14}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,#ef4444,#dc2626)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>1</div>
          <span style={{fontWeight:700,fontSize:14}}>Selecciona el jugador a reemplazar</span>
        </div>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span>
          <input style={{...I,paddingLeft:36,fontSize:14}} placeholder="Escribe el nombre del jugador..." value={query} onChange={e=>{setQuery(e.target.value);setShowSugg(true);if(!e.target.value){setObjetivo(null);setResultados([]);}}} onFocus={()=>setShowSugg(true)} onBlur={()=>setTimeout(()=>setShowSugg(false),180)}/>
          {showSugg&&sugerencias.length>0&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#0f1923",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,overflow:"hidden",zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
            {sugerencias.map(j=><div key={j.id} onMouseDown={()=>seleccionar(j)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.1)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Foto foto={j.foto} n={j.n} pos={j.pos} size={36}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13}}>{j.n}</div><div style={{fontSize:11,color:"#64748b"}}>{j.pos} · {j.eq} · {j.pais}</div></div>
              <div style={{display:"flex",gap:5,flexShrink:0}}><Bdg color={posColor(j.pos)}>{j.e}a</Bdg><Bdg color={tierColor(LIGA_INFO[j.l_id]?.t||3)}>{tierLabel(LIGA_INFO[j.l_id]?.t||3)}</Bdg></div>
            </div>)}
          </div>}
          {showSugg&&query.length>=2&&sugerencias.length===0&&jugadores.length>0&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#0f1923",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:14,zIndex:200,fontSize:12,color:"#64748b"}}>No encontrado: "{query}" - prueba con apellido</div>}
          {jugadores.length===0&&<div style={{marginTop:8,fontSize:12,color:"#ef4444",textAlign:"center"}}>⏳ Cargando base de datos...</div>}
        </div>
        {objetivo&&<div style={{marginTop:14,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"14px 16px",display:"flex",gap:14,alignItems:"center"}}>
          <Foto foto={objetivo.foto} n={objetivo.n} pos={objetivo.pos} size={56}/>
          <div style={{flex:1}}><div style={{fontWeight:900,fontSize:17,marginBottom:3}}>{objetivo.n}</div><div style={{fontSize:13,color:"#94a3b8",marginBottom:8}}>{objetivo.eq} · {objetivo.l} · {objetivo.pais}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Bdg color={posColor(objetivo.pos)} size="lg">{posIcon(objetivo.pos)} {objetivo.pos}</Bdg><Bdg color="#64748b" size="lg">{objetivo.e} anos</Bdg><Bdg color={tierColor(LIGA_INFO[objetivo.l_id]?.t||3)} size="lg">{tierLabel(LIGA_INFO[objetivo.l_id]?.t||3)}</Bdg>{(objetivo.s?.g||0)>0&&<Bdg color="#ef4444" size="lg">⚽ {objetivo.s.g}</Bdg>}{(objetivo.s?.a||0)>0&&<Bdg color="#3b82f6" size="lg">🎯 {objetivo.s.a}</Bdg>}</div>
          </div>
          <button onClick={()=>{setObjetivo(null);setQuery("");setResultados([]);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 10px",color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>x</button>
        </div>}
      </Card>}

      {objetivo&&!detalle&&<Card style={{marginBottom:14}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>2</div>
          <span style={{fontWeight:700,fontSize:14}}>Ajusta los filtros</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><Lbl>Region</Lbl><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["todas","Todas"],["sa","Sudamerica"],["europa","Europa"]].map(([v,l])=><button key={v} onClick={()=>setFiltroRegion(v)} style={{background:filtroRegion===v?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.04)",border:filtroRegion===v?"1px solid #ef4444":"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 12px",color:filtroRegion===v?"#f87171":"#94a3b8",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{l}</button>)}</div></div>
          <div><Lbl>Rango edad +-{filtroEdad}a ({Math.max(16,objetivo.e-filtroEdad)}-{objetivo.e+filtroEdad})</Lbl><input type="range" min={1} max={10} value={filtroEdad} onChange={e=>setFiltroEdad(+e.target.value)} style={{width:"100%",accentColor:"#ef4444",cursor:"pointer"}}/></div>
        </div>
        <button onClick={buscar} style={{background:"linear-gradient(135deg,#ef4444,#dc2626)",border:"none",borderRadius:12,padding:"13px 32px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit",boxShadow:"0 4px 20px rgba(239,68,68,0.35)",width:"100%",opacity:buscando?0.7:1}} disabled={buscando}>
          {buscando?`Analizando ${jugadores.length.toLocaleString()} jugadores...`:`Buscar Reemplazos para ${objetivo.n}`}
        </button>
      </Card>}

      {resultados.length>0&&!detalle&&<div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div><div style={{fontWeight:800,fontSize:16}}>Top {resultados.length} reemplazos para <span style={{color:"#ef4444"}}>{objetivo?.n}</span></div><div style={{fontSize:12,color:"#64748b",marginTop:2}}>Misma posicion · Por compatibilidad · Paises diversificados</div></div>
          <button onClick={()=>setResultados([])} style={{...BB,padding:"6px 12px",fontSize:11}}>Limpiar</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginBottom:12}}>
          {top3.map((j,i)=>{
            const tier=LIGA_INFO[j.l_id]?.t||3;
            const esJoya=j._compat>=78&&tier>=3;
            const bc=i===0?"rgba(0,232,122,0.3)":i===1?"rgba(59,130,246,0.25)":"rgba(245,158,11,0.2)";
            return(<div key={j.id} onClick={()=>setDetalle(j)} style={{position:"relative",cursor:"pointer",borderRadius:16,background:"rgba(255,255,255,0.02)",border:`1px solid ${bc}`,padding:"18px 20px",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.transform="none";}}>
              <div style={{position:"absolute",top:14,right:16,width:28,height:28,borderRadius:"50%",background:i===0?"linear-gradient(135deg,#f59e0b,#d97706)":i===1?"linear-gradient(135deg,#94a3b8,#64748b)":"linear-gradient(135deg,#cd7c3f,#92400e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#000"}}>{i+1}</div>
              {esJoya&&<div style={{position:"absolute",top:14,left:18,background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:700,color:"#f59e0b"}}>Joya Oculta</div>}
              <div style={{paddingTop:esJoya?18:0}}>
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                  <Foto foto={j.foto} n={j.n} pos={j.pos} size={50}/>
                  <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.n}</div><div style={{fontSize:11,color:"#64748b",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.eq} · {j.l}</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Bdg color={posColor(j.pos)}>{posIcon(j.pos)} {j.pos}</Bdg><Bdg color="#64748b">{j.e}a</Bdg><Bdg color={tierColor(tier)}>{j.pais}</Bdg></div></div>
                </div>
                <div style={{marginBottom:12}}><CompatBar valor={j._compat}/></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}><StatChip label="Goles" val={j.s?.g||0} color="#ef4444"/><StatChip label="Asist." val={j.s?.a||0} color="#3b82f6"/><StatChip label="Min" val={j.s?.min>0?Math.round(j.s.min/60)+"h":0} color="#10b981"/><StatChip label="Rating" val={j.s?.rat?.toFixed(1)||"-"} color="#f59e0b"/></div>
                <div style={{marginTop:10,paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.05)",fontSize:11,color:"#64748b",display:"flex",gap:10,flexWrap:"wrap"}}>{(()=>{const dE=(j.e||25)-(objetivo?.e||25),dG=(j.s?.g||0)-(objetivo?.s?.g||0),dA=(j.s?.a||0)-(objetivo?.s?.a||0);return(<><span>Edad: <strong style={{color:Math.abs(dE)<=2?"#00e87a":"#f59e0b"}}>{dE>=0?"+":""}{dE}a</strong></span><span>Goles: <strong style={{color:dG>=0?"#00e87a":"#ef4444"}}>{dG>=0?"+":""}{dG}</strong></span><span>Asist: <strong style={{color:dA>=0?"#00e87a":"#ef4444"}}>{dA>=0?"+":""}{dA}</strong></span></>);})()}</div>
              </div>
            </div>);
          })}
        </div>
        {resto.length>0&&<Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:13}}>Otros {resto.length} candidatos</span></div>
          {resto.map((j,idx)=><div key={j.id} onClick={()=>setDetalle(j)} style={{padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"grid",gridTemplateColumns:"32px 38px 2fr 60px 60px 80px 20px",gap:8,alignItems:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:11,fontWeight:800,color:"#64748b",textAlign:"center"}}>#{idx+4}</div>
            <Foto foto={j.foto} n={j.n} pos={j.pos} size={30}/>
            <div><div style={{fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.n}</div><div style={{fontSize:10,color:"#64748b"}}>{j.pais} · {LIGA_INFO[j.l_id]?.n||j.l}</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:12,fontWeight:800}}>{j.e}a</div></div>
            <div><Bdg color={posColor(j.pos)}>{posIcon(j.pos)}</Bdg></div>
            <div>{(()=>{const c=j._compat;const col=c>=80?"#00e87a":c>=65?"#3b82f6":c>=50?"#f59e0b":"#ef4444";return <Bdg color={col}>{c}%</Bdg>;})()}</div>
            <button onClick={e=>{e.stopPropagation();setInformeJugador(j);}} style={{background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.3)",borderRadius:6,padding:"3px 8px",color:"#c4b5fd",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit",marginRight:4}}>IA</button>
            <div style={{color:"#64748b",fontSize:13}}>›</div>
          </div>)}
        </Card>}
      </div>}

      {detalle&&<div>
        <button onClick={()=>setDetalle(null)} style={{...BB,marginBottom:18}}>Volver</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <Card style={{border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.04)"}}><div style={{fontSize:10,color:"#ef4444",fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:10}}>Original</div><div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}><Foto foto={objetivo?.foto} n={objetivo?.n} pos={objetivo?.pos} size={50}/><div><div style={{fontWeight:900,fontSize:15}}>{objetivo?.n}</div><div style={{fontSize:11,color:"#94a3b8"}}>{objetivo?.eq} · {objetivo?.pais}</div></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}><StatChip label="Edad" val={objetivo?.e+"a"}/><StatChip label="Goles" val={objetivo?.s?.g||0} color="#ef4444"/><StatChip label="Asist." val={objetivo?.s?.a||0} color="#3b82f6"/><StatChip label="Min" val={objetivo?.s?.min||0} color="#10b981"/><StatChip label="Rating" val={objetivo?.s?.rat?.toFixed(1)||"-"} color="#f59e0b"/><StatChip label="Pais" val={objetivo?.pais||"-"}/></div></Card>
          <Card style={{border:"1px solid rgba(0,232,122,0.2)",background:"rgba(0,232,122,0.04)"}}><div style={{fontSize:10,color:"#00e87a",fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:10}}>Reemplazo</div><div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}><Foto foto={detalle.foto} n={detalle.n} pos={detalle.pos} size={50}/><div><div style={{fontWeight:900,fontSize:15}}>{detalle.n}</div><div style={{fontSize:11,color:"#94a3b8"}}>{detalle.eq} · {detalle.pais}</div></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}><StatChip label="Edad" val={detalle.e+"a"}/><StatChip label="Goles" val={detalle.s?.g||0} color="#ef4444"/><StatChip label="Asist." val={detalle.s?.a||0} color="#3b82f6"/><StatChip label="Min" val={detalle.s?.min||0} color="#10b981"/><StatChip label="Rating" val={detalle.s?.rat?.toFixed(1)||"-"} color="#f59e0b"/><StatChip label="Pais" val={detalle.pais||"-"}/></div></Card>
        </div>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div style={{fontWeight:800,fontSize:16}}>Analisis de Compatibilidad</div><div style={{textAlign:"center",background:"rgba(0,232,122,0.08)",border:"1px solid rgba(0,232,122,0.2)",borderRadius:12,padding:"10px 18px"}}><div style={{fontSize:38,fontWeight:900,color:"#00e87a",lineHeight:1}}>{detalle._compat}%</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>COMPAT.</div></div></div>
          {[{l:"Posicion",vA:objetivo?.pos,vB:detalle.pos,ok:objetivo?.pos===detalle.pos},{l:"Edad",vA:objetivo?.e+"a",vB:detalle.e+"a",ok:Math.abs((objetivo?.e||0)-(detalle.e||0))<=3},{l:"Goles",vA:objetivo?.s?.g||0,vB:detalle.s?.g||0,ok:Math.abs((objetivo?.s?.g||0)-(detalle.s?.g||0))<=3},{l:"Asistencias",vA:objetivo?.s?.a||0,vB:detalle.s?.a||0,ok:Math.abs((objetivo?.s?.a||0)-(detalle.s?.a||0))<=3},{l:"Minutos",vA:objetivo?.s?.min||0,vB:detalle.s?.min||0,ok:Math.abs((objetivo?.s?.min||0)-(detalle.s?.min||0))<=600},{l:"Liga",vA:tierLabel(LIGA_INFO[objetivo?.l_id]?.t||3),vB:tierLabel(LIGA_INFO[detalle.l_id]?.t||3),ok:(LIGA_INFO[objetivo?.l_id]?.t||3)===(LIGA_INFO[detalle.l_id]?.t||3)}].map((row,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr",gap:8,alignItems:"center",marginBottom:9,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700}}>{row.vA}</div><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase"}}>{row.l}</div></div><div style={{textAlign:"center",fontSize:14}}>{row.ok?"✅":"⚡"}</div><div><div style={{fontSize:13,fontWeight:700,color:row.ok?"#00e87a":"#f59e0b"}}>{row.vB}</div><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase"}}>{row.l}</div></div></div>)}
        </Card>
      </div>}

      {!objetivo&&<Card style={{textAlign:"center",padding:50}}>
        <div style={{fontSize:52,marginBottom:14}}>🔄</div>
        <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>¿Quien necesita reemplazo?</div>
        <div style={{fontSize:13,color:"#64748b",maxWidth:380,margin:"0 auto",lineHeight:1.7}}>Busca cualquier jugador de los <strong style={{color:"#eef2f6"}}>{jugadores.length.toLocaleString()} profesionales</strong>.</div>
        {jugadores.length===0&&<div style={{marginTop:10,fontSize:12,color:"#ef4444"}}>⏳ Cargando datos...</div>}
      </Card>}
      {objetivo&&resultados.length===0&&!buscando&&<Card style={{textAlign:"center",padding:36}}><div style={{fontSize:36,marginBottom:8}}>🎯</div><div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Listo para buscar</div><div style={{fontSize:12,color:"#64748b"}}>Ajusta los filtros y presiona el boton rojo</div></Card>}
    </div>
  );
}

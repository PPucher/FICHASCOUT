import { useState, useMemo, useRef } from "react";

const I={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 13px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const BB={border:"none",borderRadius:10,padding:"10px 22px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",fontFamily:"inherit"};
const Card=({children,style={}})=><div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",padding:20,...style}}>{children}</div>;
const Lbl=({children})=><div style={{color:"#4a6070",fontSize:11,marginBottom:6,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{children}</div>;
const Bdg=({color="#64748b",children,size="sm"})=><span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:size==="lg"?"4px 12px":"2px 8px",fontSize:size==="lg"?13:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;

const LIGA_TIER={2:1,3:1,39:1,140:1,135:1,78:1,61:1,88:2,94:2,179:2,203:2,262:2,253:2,307:2,128:3,71:3,239:3,268:3,13:3,11:3,265:4,266:4,267:4,131:4,72:4,75:4};
const tierLabel=t=>t===1?"🌍 Élite":t===2?"🌐 Internacional":t===3?"🌎 Sudamérica":"🏘️ Local";
const tierColor=t=>t===1?"#f59e0b":t===2?"#3b82f6":t===3?"#10b981":"#64748b";
const POS_CAT={"Arquero":"GK","Portero":"GK","Defensor Central":"DEF","Defensa Central":"DEF","Defensa":"DEF","Lateral":"DEF","Lateral Derecho":"DEF","Lateral Izquierdo":"DEF","Volante de Contención":"MID","Volante Defensivo":"MID","Mediocampista Defensivo":"MID","Volante Ofensivo":"MID","Mediocampista":"MID","Centrocampista":"MID","Extremo":"FWD","Extremo Derecho":"FWD","Extremo Izquierdo":"FWD","Delantero Centro":"FWD","Delantero":"FWD","Atacante":"FWD"};
const posIcon=pos=>{const cat=POS_CAT[pos]||"";if(cat==="GK")return"🧤";if(cat==="DEF")return"🛡️";if(cat==="MID")return pos?.includes("Ofens")||pos?.includes("Volante Of")?"🎨":"🧱";return pos?.includes("Extr")?"⚡":"🎯";};
const posColor=pos=>{const cat=POS_CAT[pos]||"";if(cat==="GK")return"#f59e0b";if(cat==="DEF")return"#3b82f6";if(cat==="MID")return"#10b981";return"#ef4444";};

function scoutScore(j){const s=j?.s||{};const min=s.min||0;const g=s.g||0;const a=s.a||0;const rat=s.rat||0;if(min<90)return null;const prod=min>0?((g+a)/min)*90:0;const reg=Math.min(1,min/2500);const edad=j.e||25;const pico=26;const edadScore=edad<=pico?1-(edad-16)/(pico-16)*0.2:Math.max(0.4,0.9-(edad-pico)*0.03);const nv=j.nv||3;const ligaMult=nv===1?1.0:nv===2?0.85:0.70;const raw=(rat*0.35+prod*10*0.25+reg*10*0.20+edadScore*10*0.20)*ligaMult;return Math.min(99,Math.max(1,Math.round(raw)));}

function calcSimilitud(objetivo,candidato){const catObj=POS_CAT[objetivo.pos]||objetivo.pos;const catCand=POS_CAT[candidato.pos]||candidato.pos;if(catObj!==catCand)return -1;const mismaPos=objetivo.pos===candidato.pos;const scorePos=mismaPos?1.0:0.75;const diffEdad=Math.abs((objetivo.e||25)-(candidato.e||25));if(diffEdad>8)return -1;const scoreEdad=Math.max(0,1-diffEdad/10);const so=objetivo.s||{};const sc=candidato.s||{};const minO=so.min||1;const minC=sc.min||1;const g90O=((so.g||0)/minO)*90;const g90C=((sc.g||0)/minC)*90;const a90O=((so.a||0)/minO)*90;const a90C=((sc.a||0)/minC)*90;const prod90O=g90O+a90O;const prod90C=g90C+a90C;const diffProd=prod90O>0?Math.abs(prod90O-prod90C)/prod90O:Math.abs(prod90C);const scoreProd=Math.max(0,1-diffProd*2);const reg90O=Math.min(1,minO/2500);const reg90C=Math.min(1,minC/2500);const scoreReg=1-Math.abs(reg90O-reg90C);const tierO=LIGA_TIER[objetivo.l_id]||3;const tierC=LIGA_TIER[candidato.l_id]||3;const diffTier=tierC-tierO;const scoreTier=diffTier<=0?1.0:diffTier===1?0.92:diffTier===2?0.80:0.65;const final=(scorePos*0.30+scoreEdad*0.20+scoreProd*0.25+scoreReg*0.15+scoreTier*0.10);return Math.round(final*100);}

function PlayerPhoto({foto,n,pos,size=52}){const[err,setErr]=useState(false);const bg=posColor(pos);if(!foto||err)return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${bg}33,${bg}11)`,border:`2px solid ${bg}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,flexShrink:0}}>{posIcon(pos)}</div>;return <img src={foto} alt={n} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`2px solid ${bg}44`,flexShrink:0,background:"rgba(255,255,255,0.05)"}}/>;}

function CompatBar({valor}){const color=valor>=85?"#00e87a":valor>=70?"#3b82f6":valor>=55?"#f59e0b":"#ef4444";const label=valor>=85?"Excelente":valor>=70?"Muy bueno":valor>=55?"Bueno":"Moderado";return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:11,color:"#64748b",fontWeight:600}}>COMPATIBILIDAD</span><span style={{fontSize:13,fontWeight:800,color}}>{valor}%</span></div><div style={{height:6,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${valor}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:4,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/></div><div style={{fontSize:10,color,marginTop:3,fontWeight:600}}>{label}</div></div>);}

function StatChip({label,val,color="#94a3b8"}){return <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"6px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:15,fontWeight:800,color}}>{val??"-"}</div><div style={{fontSize:9,color:"#64748b",fontWeight:600,letterSpacing:.4,textTransform:"uppercase",marginTop:1}}>{label}</div></div>;}

function ReemplazCard({j,rank,compat,onClick,objetivo}){const[hov,setHov]=useState(false);const s=j.s||{};const ss=scoutScore(j);const tier=LIGA_TIER[j.l_id]||3;const esJoya=compat>=80&&tier>=3;return(<div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{position:"relative",cursor:"pointer",borderRadius:16,background:hov?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.02)",border:rank===1?"1px solid rgba(0,232,122,0.3)":rank===2?"1px solid rgba(59,130,246,0.25)":rank===3?"1px solid rgba(245,158,11,0.2)":"1px solid rgba(255,255,255,0.06)",padding:"18px 20px",transition:"all 0.2s",transform:hov?"translateY(-2px)":"none",boxShadow:hov?"0 8px 32px rgba(0,0,0,0.3)":"none"}}><div style={{position:"absolute",top:14,right:16,width:28,height:28,borderRadius:"50%",background:rank===1?"linear-gradient(135deg,#f59e0b,#d97706)":rank===2?"linear-gradient(135deg,#94a3b8,#64748b)":rank===3?"linear-gradient(135deg,#cd7c3f,#92400e)":"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:rank<=3?"#000":"#64748b"}}>{rank}</div>{esJoya&&<div style={{position:"absolute",top:14,left:18,background:"linear-gradient(135deg,#f59e0b22,#ef444422)",border:"1px solid #f59e0b44",borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:700,color:"#f59e0b"}}>🔥 Joya Oculta</div>}<div style={{paddingTop:esJoya?18:0}}><div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}><PlayerPhoto foto={j.foto} n={j.n} pos={j.pos} size={52}/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:15,color:"#eef2f6",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.n}</div><div style={{fontSize:12,color:"#64748b",marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.eq} · {j.l}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><Bdg color={posColor(j.pos)}>{posIcon(j.pos)} {j.pos}</Bdg><Bdg color="#64748b">{j.e}a</Bdg><Bdg color={tierColor(tier)}>{tierLabel(tier)}</Bdg></div></div></div><div style={{marginBottom:14}}><CompatBar valor={compat}/></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}><StatChip label="Goles" val={s.g||0} color="#ef4444"/><StatChip label="Asist." val={s.a||0} color="#3b82f6"/><StatChip label="Min" val={s.min>0?Math.round(s.min/60)+"h":0} color="#10b981"/><StatChip label="Scout" val={ss||"-"} color={ss>=80?"#00e87a":ss>=60?"#3b82f6":"#f59e0b"}/></div>{objetivo&&<div style={{marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.05)",fontSize:11,color:"#64748b",display:"flex",gap:12,flexWrap:"wrap"}}>{(()=>{const diffE=(j.e||25)-(objetivo.e||25);const diffG=(j.s?.g||0)-(objetivo.s?.g||0);const diffA=(j.s?.a||0)-(objetivo.s?.a||0);return(<><span>Edad: <strong style={{color:Math.abs(diffE)<=2?"#00e87a":"#f59e0b"}}>{j.e}a {diffE>0?`+${diffE}`:diffE===0?"=":diffE}</strong></span><span>Goles: <strong style={{color:diffG>=0?"#00e87a":"#ef4444"}}>{j.s?.g||0} ({diffG>=0?"+":""}{diffG})</strong></span><span>Asist.: <strong style={{color:diffA>=0?"#00e87a":"#ef4444"}}>{j.s?.a||0} ({diffA>=0?"+":""}{diffA})</strong></span></>);})()}</div>}</div></div>);}

export default function BuscarReemplazo({datos}){
  const[query,setQuery]=useState("");
  const[objetivo,setObjetivo]=useState(null);
  const[resultados,setResultados]=useState([]);
  const[buscando,setBuscando]=useState(false);
  const[detalle,setDetalle]=useState(null);
  const[showSugg,setShowSugg]=useState(false);
  const[filtroLiga,setFiltroLiga]=useState("todas");
  const[filtroEdad,setFiltroEdad]=useState(5);

  const jugadores=useMemo(()=>{if(!datos)return[];if(Array.isArray(datos))return datos;return datos.jugadores||[];},[datos]);

  const sugerencias=useMemo(()=>{if(!query||query.length<2||!jugadores.length)return[];const q=query.toLowerCase();return jugadores.filter(j=>j.n&&j.n.toLowerCase().includes(q)&&(j.s?.min||0)>200).slice(0,8);},[query,jugadores]);

  const seleccionarObjetivo=j=>{setObjetivo(j);setQuery(j.n);setShowSugg(false);setResultados([]);setDetalle(null);};

  const buscarReemplazos=()=>{if(!objetivo||!jugadores.length)return;setBuscando(true);setDetalle(null);setTimeout(()=>{const candidatos=[];for(const j of jugadores){if(j.id===objetivo.id)continue;if(Math.abs((j.e||25)-(objetivo.e||25))>filtroEdad+1)continue;const tier=LIGA_TIER[j.l_id]||3;if(filtroLiga==="sa"&&tier<3)continue;if(filtroLiga==="europa"&&tier>2)continue;const compat=calcSimilitud(objetivo,j);if(compat<45)continue;candidatos.push({...j,_compat:compat});}candidatos.sort((a,b)=>b._compat-a._compat);setResultados(candidatos.slice(0,20));setBuscando(false);},300);};

  const top3=resultados.slice(0,3);
  const resto=resultados.slice(3);

  return(
    <div style={{fontFamily:"'Inter',sans-serif",color:"#eef2f6",minHeight:"100vh"}}>
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
          <div style={{background:"linear-gradient(135deg,#ef4444,#dc2626)",borderRadius:14,padding:"11px 15px",fontSize:24,boxShadow:"0 4px 20px rgba(239,68,68,0.3)"}}>🔄</div>
          <div><h2 style={{margin:0,fontSize:24,fontWeight:900,letterSpacing:-0.8}}>Buscar Reemplazo</h2><p style={{margin:0,fontSize:13,color:"#64748b"}}>Encuentra el sustituto ideal entre 43.400 jugadores profesionales</p></div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{icon:"🎯",text:"Compatibilidad multi-dimensional"},{icon:"⚡",text:"Análisis instantáneo"},{icon:"🌎",text:"10 países sudamericanos"}].map((t,i)=><div key={i} style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:8,padding:"5px 12px",fontSize:12,color:"#94a3b8"}}>{t.icon} {t.text}</div>)}
        </div>
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:14}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,#ef4444,#dc2626)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>1</div>
          <span style={{fontWeight:700,fontSize:14}}>Selecciona el jugador a reemplazar</span>
        </div>
        <div style={{position:"relative"}}>
          <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔍</span><input style={{...I,paddingLeft:38,fontSize:14}} placeholder="Buscar jugador por nombre..." value={query} onChange={e=>{setQuery(e.target.value);setShowSugg(true);if(!e.target.value){setObjetivo(null);setResultados([]);}}} onFocus={()=>setShowSugg(true)} onBlur={()=>setTimeout(()=>setShowSugg(false),200)}/></div>
          {showSugg&&sugerencias.length>0&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#0f1923",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,overflow:"hidden",zIndex:100,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
            {sugerencias.map(j=><div key={j.id} onMouseDown={()=>seleccionarObjetivo(j)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <PlayerPhoto foto={j.foto} n={j.n} pos={j.pos} size={36}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.n}</div><div style={{fontSize:11,color:"#64748b"}}>{j.pos} · {j.eq} · {j.l}</div></div>
              <div style={{display:"flex",gap:5,flexShrink:0}}><Bdg color={posColor(j.pos)}>{j.e}a</Bdg><Bdg color={tierColor(LIGA_TIER[j.l_id]||3)}>{j.pais}</Bdg></div>
            </div>)}
          </div>}
        </div>
        {objetivo&&<div style={{marginTop:16,background:"linear-gradient(135deg,rgba(239,68,68,0.08),rgba(220,38,38,0.04))",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"14px 16px"}}>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <PlayerPhoto foto={objetivo.foto} n={objetivo.n} pos={objetivo.pos} size={60}/>
            <div style={{flex:1}}><div style={{fontWeight:900,fontSize:17,marginBottom:3}}>{objetivo.n}</div><div style={{fontSize:13,color:"#94a3b8",marginBottom:8}}>{objetivo.eq} · {objetivo.l} · {objetivo.pais}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Bdg color={posColor(objetivo.pos)} size="lg">{posIcon(objetivo.pos)} {objetivo.pos}</Bdg><Bdg color="#64748b" size="lg">{objetivo.e} años</Bdg><Bdg color={tierColor(LIGA_TIER[objetivo.l_id]||3)} size="lg">{tierLabel(LIGA_TIER[objetivo.l_id]||3)}</Bdg>{(objetivo.s?.g||0)>0&&<Bdg color="#ef4444" size="lg">⚽ {objetivo.s.g} goles</Bdg>}{(objetivo.s?.a||0)>0&&<Bdg color="#3b82f6" size="lg">🎯 {objetivo.s.a} asist.</Bdg>}</div></div>
            <button onClick={()=>{setObjetivo(null);setQuery("");setResultados([]);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 10px",color:"#64748b",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✕</button>
          </div>
        </div>}
      </Card>

      {objetivo&&<Card style={{marginBottom:16}}>
        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:14}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>2</div>
          <span style={{fontWeight:700,fontSize:14}}>Ajusta los filtros</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div><Lbl>Región</Lbl><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["todas","🌍 Todas"],["sa","🌎 Sudamérica"],["europa","🌐 Europa"]].map(([v,l])=><button key={v} onClick={()=>setFiltroLiga(v)} style={{background:filtroLiga===v?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.04)",border:filtroLiga===v?"1px solid #ef4444":"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 12px",color:filtroLiga===v?"#f87171":"#94a3b8",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{l}</button>)}</div></div>
          <div><Lbl>Rango edad (±{filtroEdad}a vs {objetivo.e}a)</Lbl><input type="range" min={1} max={10} value={filtroEdad} onChange={e=>setFiltroEdad(+e.target.value)} style={{width:"100%",accentColor:"#ef4444",cursor:"pointer"}}/><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b",marginTop:2}}><span>{Math.max(16,objetivo.e-filtroEdad)}a</span><span>{objetivo.e+filtroEdad}a</span></div></div>
        </div>
        <button onClick={buscarReemplazos} style={{marginTop:16,background:"linear-gradient(135deg,#ef4444,#dc2626)",border:"none",borderRadius:12,padding:"13px 32px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit",boxShadow:"0 4px 20px rgba(239,68,68,0.35)",width:"100%",letterSpacing:0.3,opacity:buscando?0.7:1}} disabled={buscando}>
          {buscando?"⏳ Analizando 43.400 jugadores...":`🔄 Buscar Reemplazos para ${objetivo.n.split(" ")[1]||objetivo.n.split(" ")[0]}`}
        </button>
      </Card>}

      {resultados.length>0&&!detalle&&<div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div><h3 style={{margin:0,fontSize:16,fontWeight:800}}>🏆 Top {resultados.length} reemplazos para <span style={{color:"#ef4444"}}>{objetivo?.n}</span></h3><p style={{margin:"2px 0 0",fontSize:12,color:"#64748b"}}>Ordenados por compatibilidad · Misma posición garantizada</p></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:16}}>
          {top3.map((j,i)=><ReemplazCard key={j.id} j={j} rank={i+1} compat={j._compat} objetivo={objetivo} onClick={()=>setDetalle(j)}/>)}
        </div>
        {resto.length>0&&<Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:13}}>📋 Otros {resto.length} candidatos</span><span style={{fontSize:11,color:"#64748b"}}>Clic para ver detalle</span></div>
          {resto.map((j,idx)=><div key={j.id} onClick={()=>setDetalle(j)} style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"grid",gridTemplateColumns:"36px 2fr 1fr 1fr 1fr auto",gap:10,alignItems:"center",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:12,fontWeight:800,color:"#64748b",textAlign:"center"}}>#{idx+4}</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><PlayerPhoto foto={j.foto} n={j.n} pos={j.pos} size={32}/><div><div style={{fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.n}</div><div style={{fontSize:10,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.eq} · {j.l}</div></div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:800}}>{j.e}a</div><div style={{fontSize:9,color:"#64748b"}}>EDAD</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:800,color:"#ef4444"}}>{j.s?.g||0}</div><div style={{fontSize:9,color:"#64748b"}}>GOL</div></div>
            <div style={{textAlign:"center"}}>{(()=>{const c=j._compat;const col=c>=85?"#00e87a":c>=70?"#3b82f6":c>=55?"#f59e0b":"#ef4444";return <Bdg color={col}>{c}%</Bdg>;})()}</div>
            <div style={{color:"#64748b",fontSize:16}}>›</div>
          </div>)}
        </Card>}
      </div>}

      {detalle&&<div>
        <button onClick={()=>setDetalle(null)} style={{...BB,marginBottom:20,padding:"9px 18px",fontSize:13}}>← Volver a resultados</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card style={{border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.04)"}}><div style={{fontSize:11,color:"#ef4444",fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:12}}>🎯 Jugador Original</div><div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}><PlayerPhoto foto={objetivo?.foto} n={objetivo?.n} pos={objetivo?.pos} size={56}/><div><div style={{fontWeight:900,fontSize:16}}>{objetivo?.n}</div><div style={{fontSize:12,color:"#94a3b8"}}>{objetivo?.eq} · {objetivo?.l}</div></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}><StatChip label="Edad" val={objetivo?.e+"a"} color="#eef2f6"/><StatChip label="Goles" val={objetivo?.s?.g||0} color="#ef4444"/><StatChip label="Asist." val={objetivo?.s?.a||0} color="#3b82f6"/><StatChip label="Minutos" val={objetivo?.s?.min||0} color="#10b981"/><StatChip label="Rating" val={objetivo?.s?.rat?.toFixed(1)||"-"} color="#f59e0b"/><StatChip label="Scout" val={scoutScore(objetivo)||"-"} color="#00e87a"/></div></Card>
          <Card style={{border:"1px solid rgba(0,232,122,0.2)",background:"rgba(0,232,122,0.04)"}}><div style={{fontSize:11,color:"#00e87a",fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:12}}>✅ Reemplazo Sugerido</div><div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}><PlayerPhoto foto={detalle.foto} n={detalle.n} pos={detalle.pos} size={56}/><div><div style={{fontWeight:900,fontSize:16}}>{detalle.n}</div><div style={{fontSize:12,color:"#94a3b8"}}>{detalle.eq} · {detalle.l}</div></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}><StatChip label="Edad" val={detalle.e+"a"} color="#eef2f6"/><StatChip label="Goles" val={detalle.s?.g||0} color="#ef4444"/><StatChip label="Asist." val={detalle.s?.a||0} color="#3b82f6"/><StatChip label="Minutos" val={detalle.s?.min||0} color="#10b981"/><StatChip label="Rating" val={detalle.s?.rat?.toFixed(1)||"-"} color="#f59e0b"/><StatChip label="Scout" val={scoutScore(detalle)||"-"} color="#00e87a"/></div></Card>
        </div>
        <Card style={{marginTop:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><div style={{fontWeight:800,fontSize:16,marginBottom:2}}>Análisis de Compatibilidad</div><div style={{fontSize:12,color:"#64748b"}}>{detalle._compat}% de similitud total</div></div><div style={{textAlign:"center",background:"rgba(0,232,122,0.08)",border:"1px solid rgba(0,232,122,0.2)",borderRadius:12,padding:"10px 20px"}}><div style={{fontSize:36,fontWeight:900,color:"#00e87a",lineHeight:1}}>{detalle._compat}%</div><div style={{fontSize:11,color:"#64748b",marginTop:2}}>COMPAT.</div></div></div>
          {[{label:"Posición",valA:objetivo?.pos,valB:detalle.pos,match:objetivo?.pos===detalle.pos},{label:"Categoría",valA:POS_CAT[objetivo?.pos]||"-",valB:POS_CAT[detalle.pos]||"-",match:POS_CAT[objetivo?.pos]===POS_CAT[detalle.pos]},{label:"Edad",valA:objetivo?.e+"a",valB:detalle.e+"a",match:Math.abs((objetivo?.e||0)-(detalle.e||0))<=3},{label:"Goles",valA:objetivo?.s?.g||0,valB:detalle.s?.g||0,match:Math.abs((objetivo?.s?.g||0)-(detalle.s?.g||0))<=3},{label:"Asistencias",valA:objetivo?.s?.a||0,valB:detalle.s?.a||0,match:Math.abs((objetivo?.s?.a||0)-(detalle.s?.a||0))<=3},{label:"Minutos",valA:objetivo?.s?.min||0,valB:detalle.s?.min||0,match:Math.abs((objetivo?.s?.min||0)-(detalle.s?.min||0))<=500},{label:"Nivel liga",valA:tierLabel(LIGA_TIER[objetivo?.l_id]||3),valB:tierLabel(LIGA_TIER[detalle.l_id]||3),match:(LIGA_TIER[objetivo?.l_id]||3)===(LIGA_TIER[detalle.l_id]||3)}].map((row,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 40px 1fr",gap:8,alignItems:"center",marginBottom:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:"#eef2f6"}}>{row.valA}</div><div style={{fontSize:10,color:"#64748b"}}>{row.label}</div></div><div style={{textAlign:"center",fontSize:16}}>{row.match?"✅":"⚡"}</div><div><div style={{fontSize:13,fontWeight:700,color:row.match?"#00e87a":"#f59e0b"}}>{row.valB}</div><div style={{fontSize:10,color:"#64748b"}}>{row.label}</div></div></div>)}
        </Card>
      </div>}

      {!objetivo&&<Card style={{textAlign:"center",padding:52}}><div style={{fontSize:52,marginBottom:14}}>🔄</div><div style={{fontSize:18,fontWeight:800,marginBottom:6}}>¿Quién necesita reemplazo?</div><div style={{fontSize:13,color:"#64748b",maxWidth:400,margin:"0 auto",lineHeight:1.7}}>Busca cualquier jugador de los <strong style={{color:"#eef2f6"}}>43.400 profesionales</strong>. FichaScout encontrará sus mejores sustitutos con compatibilidad multi-dimensional.</div></Card>}

      {objetivo&&resultados.length===0&&!buscando&&<Card style={{textAlign:"center",padding:40}}><div style={{fontSize:40,marginBottom:10}}>🎯</div><div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Listo para buscar</div><div style={{fontSize:12,color:"#64748b"}}>Ajusta los filtros y presiona el botón rojo</div></Card>}
    </div>
  );
}

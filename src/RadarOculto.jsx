import { useState, useEffect } from "react";
import InformePro from "./InformePro.jsx";

const I  = {background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 13px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const BP = {border:"none",borderRadius:12,padding:"12px 32px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:14,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(139,92,246,0.35)",width:"100%",letterSpacing:0.3};
const BB = {border:"none",borderRadius:10,padding:"9px 18px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",fontFamily:"inherit"};
const Card = ({children,style={}}) => <div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",padding:20,...style}}>{children}</div>;
const Lbl = ({children}) => <div style={{color:"#4a6070",fontSize:11,marginBottom:6,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{children}</div>;
const Bdg = ({color="#64748b",children,size="sm"}) => <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:size==="lg"?"4px 12px":"2px 8px",fontSize:size==="lg"?13:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;

const LIGA_VM = {39:{n:"Premier League",vm:22.5,t:1},2:{n:"Champions League",vm:28,t:1},140:{n:"La Liga",vm:18,t:1},135:{n:"Serie A",vm:14,t:1},78:{n:"Bundesliga",vm:16,t:1},61:{n:"Ligue 1",vm:11,t:1},88:{n:"Eredivisie",vm:5.5,t:2},94:{n:"Primeira Liga",vm:4.8,t:2},262:{n:"Liga MX",vm:2.8,t:2},128:{n:"Liga Profesional AR",vm:1.5,t:3},71:{n:"Serie A BR",vm:2.2,t:3},239:{n:"Primera A CO",vm:0.6,t:3},268:{n:"Primera Div UY",vm:0.5,t:3},282:{n:"Division Honor PY",vm:0.4,t:3},292:{n:"Liga FUTVE",vm:0.3,t:3},265:{n:"Primera Division CL",vm:0.377,t:4},266:{n:"Primera B CL",vm:0.12,t:4},267:{n:"Copa Chile",vm:0.15,t:4},131:{n:"Primera B Metro AR",vm:0.2,t:4},72:{n:"Serie B BR",vm:0.7,t:4},75:{n:"Serie C BR",vm:0.3,t:4},241:{n:"Liga Nacional CO",vm:0.3,t:4},283:{n:"Liga 1 PE",vm:0.35,t:4},240:{n:"LigaPro EC",vm:0.4,t:4},209:{n:"Division Profesional BO",vm:0.25,t:4},13:{n:"Copa Libertadores",vm:3.5,t:2},11:{n:"Copa Sudamericana",vm:1.8,t:3}};

const PAISES=[{code:"cl",label:"🇨🇱 Chile",ligas:[265,266,267]},{code:"ar",label:"🇦🇷 Argentina",ligas:[128,131]},{code:"br",label:"🇧🇷 Brasil",ligas:[71,72,75]},{code:"co",label:"🇨🇴 Colombia",ligas:[239,241]},{code:"uy",label:"🇺🇾 Uruguay",ligas:[268]},{code:"pe",label:"🇵🇪 Peru",ligas:[283]},{code:"ec",label:"🇪🇨 Ecuador",ligas:[240]},{code:"bo",label:"🇧🇴 Bolivia",ligas:[209]},{code:"py",label:"🇵🇾 Paraguay",ligas:[282]},{code:"ve",label:"🇻🇪 Venezuela",ligas:[292]}];
const POSICIONES_JSON=["Todas","Arquero","Defensor","Volante","Delantero"];
const posIcon=p=>p==="Arquero"?"🧤":p==="Defensor"?"🛡️":p==="Volante"?"🧱":"🎯";
const posColor=p=>p==="Arquero"?"#f59e0b":p==="Defensor"?"#3b82f6":p==="Volante"?"#10b981":"#ef4444";

function calcPotencial(j,li){const edad=j.e||25,pos=j.pos||"",min=j.s?.min||0,g=j.s?.g||0,a=j.s?.a||0,rat=j.s?.rat||0,pico=pos==="Arquero"?29:pos==="Defensor"?27:26;let me;if(edad<=pico)me=1-(edad-16)/(pico-16)*0.3;else if(edad<=pico+4)me=0.85-(edad-pico)*0.04;else me=Math.max(0.3,0.65-(edad-pico-4)*0.05);me=Math.min(1,Math.max(0.1,me));const apps=j.s?.am||0,reg=Math.min(1,min/2000)*(apps>0&&min/apps>=60?1:0.75),g90=min>0?((g+a)/min)*90:0,pmx=pos==="Arquero"?0.3:pos==="Defensor"?0.5:1.5,prod=Math.min(1,g90/pmx),ratingBonus=rat>0?Math.min(1,(rat-6)/4):0.5,tier=li?.t||4,bs=edad<=23&&tier>=3?1.15:1.0,raw=(me*0.35+reg*0.25+prod*0.20+ratingBonus*0.20)*bs;return Math.round(Math.min(100,raw*100));}
function calcSubvaloracion(j,potencial,li){if(!li)return 0;const edad=j.e||25,vm=li.vm,tier=li.t,vis=Math.min(1,vm/10),gap=1-vis,bj=edad<=21?1.25:edad<=23?1.1:1.0,s=(potencial/100)*gap*bj*(tier>=4?1.3:tier>=3?1.1:0.8);return Math.round(Math.min(100,s*100));}
function Barra({valor,color="#8b5cf6"}){return <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden",marginTop:4}}><div style={{height:"100%",width:`${valor}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:4,transition:"width 0.7s ease"}}/></div>;}
function Estrellas({valor}){const n=Math.round(valor/20);return <span style={{fontSize:13,letterSpacing:1}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?"#f59e0b":"rgba(255,255,255,0.15)"}}>★</span>)}</span>;}
function Foto({foto,n,pos,size=44}){const[err,setErr]=useState(false);const bg=posColor(pos);if(!foto||err)return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${bg}33,${bg}11)`,border:`2px solid ${bg}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,flexShrink:0}}>{posIcon(pos)}</div>;return <img src={foto} alt={n} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`2px solid ${bg}44`,flexShrink:0}}/>;}

export default function RadarOculto({datos}){
  const[filtros,setFiltros]=useState({edadMax:23,posicion:"Todas",paises:[],minMinutos:500,soloSub:true});
  const[resultado,setResultado]=useState([]);
  const[buscando,setBuscando]=useState(false);
  const[detalle,setDetalle]=useState(null);
  const[orden,setOrden]=useState("sub");
  const[informeJugador,setInformeJugador]=useState(null);

  const [jugadores, setJugadores] = useState(Array.isArray(datos)&&datos.length>0?datos:[]);
  useEffect(()=>{
    if(Array.isArray(datos)&&datos.length>0){setJugadores(datos);return;}
    fetch('/fichascout_pro_data.json').then(r=>r.json()).then(d=>{setJugadores(d?.jugadores||[]);}).catch(()=>{});
  },[datos]);

  const buscar=()=>{
    if(!jugadores.length){return;}
    setBuscando(true);setDetalle(null);
    setTimeout(()=>{
      const paisesActivos=filtros.paises.length===0?PAISES:PAISES.filter(p=>filtros.paises.includes(p.code));
      const ligasOk=new Set(paisesActivos.flatMap(p=>p.ligas));
      const res=[];
      for(const j of jugadores){
        const edad=j.e||0;
        if(!edad||edad>filtros.edadMax)continue;
        if((j.s?.min||0)<filtros.minMinutos)continue;
        if(!ligasOk.has(j.l_id))continue;
        if(filtros.posicion!=="Todas"&&j.pos!==filtros.posicion)continue;
        const li=LIGA_VM[j.l_id];
        const pot=calcPotencial(j,li);
        const sub=calcSubvaloracion(j,pot,li);
        if(filtros.soloSub&&sub<45)continue;
        if(pot<35)continue;
        res.push({...j,_pot:pot,_sub:sub,_li:li});
      }
      if(orden==="pot")res.sort((a,b)=>b._pot-a._pot);
      else if(orden==="edad")res.sort((a,b)=>(a.e||99)-(b.e||99));
      else res.sort((a,b)=>b._sub-a._sub);
      setResultado(res.slice(0,50));
      setBuscando(false);
    },100);
  };

  const cS=v=>v>=80?"#ef4444":v>=65?"#f59e0b":v>=50?"#3b82f6":"#64748b";
  const lS=v=>v>=80?"🔥 Joya Oculta":v>=65?"⭐ Alta Proyeccion":v>=50?"📡 En el Radar":"—";
  const cP=v=>v>=80?"#00e87a":v>=65?"#3b82f6":v>=50?"#f59e0b":"#64748b";

  if(informeJugador) return <InformePro jugador={informeJugador} todos={jugadores} onClose={()=>setInformeJugador(null)}/>;

  return(
    <div style={{fontFamily:"'Inter',sans-serif",color:"#eef2f6"}}>
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <div style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)",borderRadius:12,padding:"10px 14px",fontSize:22,boxShadow:"0 4px 20px rgba(139,92,246,0.3)"}}>📡</div>
          <div><h2 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:-0.5}}>Radar Oculto</h2><p style={{margin:0,fontSize:13,color:"#64748b"}}>Talentos subvalorados en Sudamerica</p></div>
        </div>
        <div style={{background:"rgba(139,92,246,0.06)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#94a3b8",display:"flex",gap:16,flexWrap:"wrap"}}>
          <span>🧠 <strong style={{color:"#c4b5fd"}}>Indice de Potencial:</strong> edad + rendimiento + nivel de liga</span>
          <span>🔥 <strong style={{color:"#c4b5fd"}}>Subvaloracion:</strong> gap entre talento real y visibilidad de mercado</span>
        </div>
      </div>

      {!detalle&&<Card style={{marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:16}}>
          <div><Lbl>EDAD MAXIMA</Lbl><select style={{...I,cursor:"pointer"}} value={filtros.edadMax} onChange={e=>setFiltros(f=>({...f,edadMax:+e.target.value}))}>{[18,19,20,21,22,23,24,25,26,27,28].map(e=><option key={e} value={e}>{e} años</option>)}</select></div>
          <div><Lbl>POSICION</Lbl><select style={{...I,cursor:"pointer"}} value={filtros.posicion} onChange={e=>setFiltros(f=>({...f,posicion:e.target.value}))}>{POSICIONES_JSON.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div><Lbl>MINIMO MINUTOS</Lbl><select style={{...I,cursor:"pointer"}} value={filtros.minMinutos} onChange={e=>setFiltros(f=>({...f,minMinutos:+e.target.value}))}>{[200,500,800,1000,1500,2000].map(m=><option key={m} value={m}>{m} min</option>)}</select></div>
          <div><Lbl>ORDENAR POR</Lbl><select style={{...I,cursor:"pointer"}} value={orden} onChange={e=>setOrden(e.target.value)}><option value="sub">🔥 Mayor Subvaloracion</option><option value="pot">🧠 Mayor Potencial</option><option value="edad">📅 Mas Jovenes</option></select></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div onClick={()=>setFiltros(f=>({...f,soloSub:!f.soloSub}))} style={{width:40,height:22,borderRadius:11,cursor:"pointer",background:filtros.soloSub?"#8b5cf6":"rgba(255,255,255,0.1)",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
            <div style={{position:"absolute",top:3,left:filtros.soloSub?21:3,width:16,height:16,borderRadius:8,background:"#fff",transition:"left 0.2s"}}/>
          </div>
          <span style={{fontSize:13,color:"#94a3b8"}}>Solo alto indice de subvaloracion (≥ 45)</span>
        </div>
        <div style={{marginBottom:16}}>
          <Lbl>PAISES</Lbl>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {PAISES.map(p=><button key={p.code} onClick={()=>setFiltros(f=>({...f,paises:f.paises.includes(p.code)?f.paises.filter(x=>x!==p.code):[...f.paises,p.code]}))} style={{background:filtros.paises.includes(p.code)?"rgba(139,92,246,0.25)":"rgba(255,255,255,0.05)",border:filtros.paises.includes(p.code)?"1px solid #8b5cf6":"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 12px",color:filtros.paises.includes(p.code)?"#c4b5fd":"#94a3b8",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{p.label}</button>)}
          </div>
        </div>
        <button onClick={buscar} style={{...BP,opacity:buscando?0.7:1}} disabled={buscando}>{buscando?"⏳ Escaneando 43.400 jugadores...":"🔍 Activar Radar"}</button>
      </Card>}

      {resultado.length>0&&!detalle&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:16}}>
          {[{l:"Detectados",v:resultado.length,i:"📡",c:"#8b5cf6"},{l:"Joyas Ocultas",v:resultado.filter(j=>j._sub>=80).length,i:"🔥",c:"#ef4444"},{l:"Alta Proyeccion",v:resultado.filter(j=>j._sub>=65).length,i:"⭐",c:"#f59e0b"},{l:"Edad Prom.",v:(resultado.reduce((a,j)=>a+(j.e||0),0)/resultado.length).toFixed(1)+"a",i:"📅",c:"#00e87a"}].map((s,i)=><Card key={i} style={{textAlign:"center",padding:14}}><div style={{fontSize:20,marginBottom:3}}>{s.i}</div><div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:"#64748b",fontWeight:700,letterSpacing:.4,textTransform:"uppercase"}}>{s.l}</div></Card>)}
        </div>
        <div style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:14,fontWeight:700}}>🏆 Top {resultado.length} talentos</div>
          <button onClick={()=>setResultado([])} style={{...BB,padding:"6px 12px",fontSize:11}}>✕ Limpiar</button>
        </div>
        <Card style={{padding:0,overflow:"hidden"}}>
          {resultado.map((j,idx)=>(
            <div key={j.id||idx} onClick={()=>setDetalle(j)} style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"grid",gridTemplateColumns:"28px 38px 2fr 60px 70px 110px 20px",gap:10,alignItems:"center",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(139,92,246,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{fontSize:11,fontWeight:800,textAlign:"center",color:idx<3?["#f59e0b","#94a3b8","#cd7c3f"][idx]:"#64748b"}}>#{idx+1}</div>
              <Foto foto={j.foto} n={j.n} pos={j.pos} size={34}/>
              <div><div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.n}</div><div style={{fontSize:11,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.eq} · {j.pais}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:800}}>{j.e}a</div><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase"}}>Edad</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:800,color:cP(j._pot)}}>{j._pot}</div><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase"}}>Potencial</div></div>
              <Bdg color={cS(j._sub)}>{lS(j._sub)}</Bdg>
              <button onClick={e=>{e.stopPropagation();setInformeJugador(j);}} style={{background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.3)",borderRadius:6,padding:"3px 8px",color:"#c4b5fd",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit",marginRight:4}}>IA</button>
        <div style={{color:"#64748b",fontSize:13}}>›</div>
            </div>
          ))}
        </Card>
      </div>}

      {detalle&&<div>
        <button onClick={()=>setDetalle(null)} style={{...BB,marginBottom:16}}>← Volver al Radar</button>
        <Card>
          <div style={{display:"flex",gap:16,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
            <Foto foto={detalle.foto} n={detalle.n} pos={detalle.pos} size={66}/>
            <div style={{flex:1}}><h3 style={{margin:"0 0 4px",fontSize:19,fontWeight:900}}>{detalle.n}</h3><div style={{fontSize:13,color:"#94a3b8",marginBottom:8}}>{detalle.eq} · {detalle._li?.n||detalle.l} · {detalle.pais}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Bdg color={posColor(detalle.pos)} size="lg">{posIcon(detalle.pos)} {detalle.pos}</Bdg><Bdg color="#64748b" size="lg">{detalle.e} años</Bdg><Bdg color={cS(detalle._sub)} size="lg">{lS(detalle._sub)}</Bdg></div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
            <Card style={{textAlign:"center",background:"rgba(0,232,122,0.05)",borderColor:"rgba(0,232,122,0.15)"}}><div style={{fontSize:10,color:"#64748b",fontWeight:700,letterSpacing:.8,marginBottom:4,textTransform:"uppercase"}}>Indice de Potencial</div><div style={{fontSize:46,fontWeight:900,color:cP(detalle._pot),lineHeight:1}}>{detalle._pot}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>/ 100</div><Barra valor={detalle._pot} color={cP(detalle._pot)}/><div style={{marginTop:8}}><Estrellas valor={detalle._pot}/></div></Card>
            <Card style={{textAlign:"center",background:"rgba(139,92,246,0.05)",borderColor:"rgba(139,92,246,0.15)"}}><div style={{fontSize:10,color:"#64748b",fontWeight:700,letterSpacing:.8,marginBottom:4,textTransform:"uppercase"}}>Indice de Subvaloracion</div><div style={{fontSize:46,fontWeight:900,color:cS(detalle._sub),lineHeight:1}}>{detalle._sub}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>/ 100</div><Barra valor={detalle._sub} color={cS(detalle._sub)}/><div style={{marginTop:8,fontSize:12,color:cS(detalle._sub),fontWeight:700}}>{lS(detalle._sub)}</div></Card>
          </div>
          <Lbl>Estadisticas de temporada</Lbl>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:16}}>
            {[{k:"Partidos",v:detalle.s?.am||0},{k:"Minutos",v:detalle.s?.min||0},{k:"Goles",v:detalle.s?.g||0},{k:"Asist.",v:detalle.s?.a||0},{k:"Rating",v:detalle.s?.rat?.toFixed(1)||"—"},{k:"Min/ptdo",v:detalle.s?.am>0?Math.round((detalle.s?.min||0)/detalle.s.am):"—"}].map(s=><div key={s.k} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",padding:8,textAlign:"center"}}><div style={{fontSize:15,fontWeight:800}}>{s.v}</div><div style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase"}}>{s.k}</div></div>)}
          </div>
          <Card style={{background:"rgba(139,92,246,0.06)",borderColor:"rgba(139,92,246,0.2)"}}>
            <Lbl>Por que esta subvalorado</Lbl>
            <div style={{fontSize:13,color:"#c4b5fd",lineHeight:1.8}}>
              {detalle._li?.t>=3&&<div>📍 <strong>Liga de baja visibilidad:</strong> {detalle._li.n} promedia €{detalle._li.vm?.toFixed(2)}M por jugador.</div>}
              {(detalle.e||99)<=22&&<div>📅 <strong>Juventud extrema:</strong> Con {detalle.e} años aun esta en plena curva de desarrollo.</div>}
              {(detalle.s?.min||0)>=1000&&<div>⏱️ <strong>Titular indiscutible:</strong> {detalle.s.min} minutos en la temporada.</div>}
              {detalle._pot>=70&&<div>🧠 <strong>Alto potencial:</strong> Indice {detalle._pot}/100.</div>}
            </div>
          </Card>
        </Card>
      </div>}

      {resultado.length===0&&!buscando&&!detalle&&<Card style={{textAlign:"center",padding:46}}>
        <div style={{fontSize:46,marginBottom:12}}>📡</div>
        <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>Radar listo para activarse</div>
        <div style={{fontSize:13,color:"#64748b"}}>Configura los filtros y presiona "Activar Radar"</div>
        <div style={{marginTop:6,fontSize:12,color:"#4a6070"}}>Datos: {jugadores.length} jugadores cargados</div>
      </Card>}
    </div>
  );
}

import { useState } from "react";
const I={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 13px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const BB={border:"none",borderRadius:10,padding:"10px 22px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",fontFamily:"inherit"};
const BP={border:"none",borderRadius:10,padding:"10px 22px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit"};
const Card=({children,style={}})=><div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",padding:20,...style}}>{children}</div>;
const Lbl=({children})=><div style={{color:"#4a6070",fontSize:12,marginBottom:5,fontWeight:600,letterSpacing:.4}}>{children}</div>;
const Bdg=({color,children})=><span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
const LIGA_VM={39:{nombre:"Premier League",vm_avg:22.5,tier:1},2:{nombre:"Champions League",vm_avg:28.0,tier:1},3:{nombre:"Europa League",vm_avg:12.0,tier:1},140:{nombre:"La Liga",vm_avg:18.0,tier:1},135:{nombre:"Serie A",vm_avg:14.0,tier:1},78:{nombre:"Bundesliga",vm_avg:16.0,tier:1},61:{nombre:"Ligue 1",vm_avg:11.0,tier:1},88:{nombre:"Eredivisie",vm_avg:5.5,tier:2},94:{nombre:"Primeira Liga",vm_avg:4.8,tier:2},179:{nombre:"Premiership",vm_avg:3.8,tier:2},203:{nombre:"Süper Lig",vm_avg:3.2,tier:2},113:{nombre:"Allsvenskan",vm_avg:1.8,tier:2},103:{nombre:"Eliteserien",vm_avg:1.6,tier:2},106:{nombre:"Ekstraklasa",vm_avg:1.4,tier:2},128:{nombre:"Liga Profesional AR",vm_avg:1.5,tier:3},71:{nombre:"Série A BR",vm_avg:2.2,tier:3},239:{nombre:"Primera A CO",vm_avg:0.6,tier:3},268:{nombre:"Primera Div UY",vm_avg:0.5,tier:3},282:{nombre:"División Honor PY",vm_avg:0.4,tier:3},292:{nombre:"Liga FUTVE",vm_avg:0.3,tier:3},265:{nombre:"Primera División CL",vm_avg:0.377,tier:4},266:{nombre:"Primera B CL",vm_avg:0.12,tier:4},267:{nombre:"Copa Chile",vm_avg:0.15,tier:4},262:{nombre:"Liga MX",vm_avg:2.8,tier:2},253:{nombre:"MLS",vm_avg:2.1,tier:2},98:{nombre:"J1 League",vm_avg:1.3,tier:3},307:{nombre:"Pro League SA",vm_avg:8.5,tier:2},72:{nombre:"Série B BR",vm_avg:0.7,tier:4},75:{nombre:"Série C BR",vm_avg:0.3,tier:4},131:{nombre:"Primera B Metro AR",vm_avg:0.2,tier:4},241:{nombre:"Liga Nacional CO",vm_avg:0.3,tier:4},13:{nombre:"Copa Libertadores",vm_avg:3.5,tier:2},11:{nombre:"Copa Sudamericana",vm_avg:1.8,tier:3}};
const POS_MAP={G:"Arquero",GK:"Arquero",D:"Defensor Central",CB:"Defensor Central",LB:"Lateral",RB:"Lateral",M:"Volante de Contención",CM:"Volante de Contención",DM:"Volante de Contención",AM:"Volante Ofensivo",MF:"Volante Ofensivo",F:"Delantero Centro",FW:"Delantero Centro",W:"Extremo",LW:"Extremo",RW:"Extremo",A:"Delantero Centro",ST:"Delantero Centro"};
function calcPotencial(j,li){const edad=j.age||25,pos=(j.position||"").toUpperCase(),mins=j.minutes_played||0,apps=j.appearances||0,goles=(j.goals||0)+(j.assists||0),pico=pos.startsWith("G")?29:pos.startsWith("D")?27:26;let me;if(edad<=pico)me=1-(edad-16)/(pico-16)*0.3;else if(edad<=pico+4)me=0.85-(edad-pico)*0.04;else me=Math.max(0.3,0.65-(edad-pico-4)*0.05);me=Math.min(1,Math.max(0.1,me));const mpj=apps>0?mins/apps:0,reg=Math.min(1,mins/2000)*(mpj>=60?1:0.7),g90=mins>0?(goles/mins)*90:0,esGK=pos.startsWith("G"),esDEF=pos.startsWith("D")||pos==="CB"||pos==="LB"||pos==="RB",pm=esGK?0.3:esDEF?0.5:1.5,prod=Math.min(1,g90/pm),tier=li?li.tier:4,bsv=edad<=23&&tier>=3?1.15:1.0;return Math.round(Math.min(100,(me*0.45+reg*0.30+prod*0.25)*bsv*100));}
function calcSubvaloracion(j,pot,li){if(!li)return 0;const edad=j.age||25,tier=li.tier,vm=li.vm_avg,vis=Math.min(1,vm/10),gap=1-vis,bj=edad<=21?1.2:edad<=23?1.1:1.0,score=(pot/100)*gap*bj*(tier>=4?1.3:tier>=3?1.1:0.8);return Math.round(Math.min(100,score*100));}
function getComparables(j,pot){const pos=(j.position||"").toUpperCase(),edad=j.age||25,comp={FW:[{n:"Darwin Núñez",e:24},{n:"Lautaro Martínez",e:26},{n:"Julián Álvarez",e:24}],LW:[{n:"Darío Osorio",e:21},{n:"Exequiel Zeballos",e:23}],RW:[{n:"Darío Osorio",e:21},{n:"Facundo Buonanotte",e:20}],W:[{n:"Darío Osorio",e:21},{n:"Exequiel Zeballos",e:23}],MF:[{n:"Alexis Mac Allister",e:25},{n:"Thiago Almada",e:23}],CM:[{n:"Alexis Mac Allister",e:25},{n:"Lucas Torreira",e:28}],DM:[{n:"Manuel Ugarte",e:23},{n:"Lucas Torreira",e:28}],AM:[{n:"Thiago Almada",e:23},{n:"Alexis Mac Allister",e:25}],D:[{n:"Cristian Romero",e:26},{n:"Gustavo Gomez",e:31}],CB:[{n:"Cristian Romero",e:26},{n:"Gustavo Gomez",e:31}],LB:[{n:"Marcos Acuña",e:32},{n:"Nico Tagliafico",e:31}],RB:[{n:"Gonzalo Montiel",e:26},{n:"Nahuel Molina",e:26}],G:[{n:"Emiliano Martínez",e:31},{n:"Brayan Cortés",e:30}],GK:[{n:"Emiliano Martínez",e:31},{n:"Brayan Cortés",e:30}]};const pk=Object.keys(comp).find(k=>pos.startsWith(k))||"MF",pool=comp[pk]||comp["MF"],cerca=pool.filter(c=>Math.abs(c.e-edad)<=4),f=cerca.length>=2?cerca:pool;return f.slice(0,pot>=75?3:2).map(c=>c.n);}
function Estrellas({valor}){const l=Math.round(valor/20);return <span style={{fontSize:14,letterSpacing:1}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=l?"#f59e0b":"rgba(255,255,255,0.15)"}}>★</span>)}</span>;}
function Barra({valor,color="#00e87a",label=""}){return(<div style={{marginBottom:6}}>{label&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#94a3b8",marginBottom:2}}><span>{label}</span><span style={{color}}>{valor}</span></div>}<div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${valor}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:4,transition:"width 0.6s ease"}}/></div></div>);}
export default function RadarOculto({datos}){
  const[filtros,setFiltros]=useState({edadMax:23,posicion:"Todas",paises:[],minMinutos:500,soloSubvalorados:true});
  const[resultado,setResultado]=useState([]);
  const[buscando,setBuscando]=useState(false);
  const[detalle,setDetalle]=useState(null);
  const[orden,setOrden]=useState("subvaloracion");
  const[pagina,setPagina]=useState(0);
  const POR_PAG=20;
  const PAISES=[{code:"cl",label:"🇨🇱 Chile",ligas:[265,266,267]},{code:"ar",label:"🇦🇷 Argentina",ligas:[128,131]},{code:"br",label:"🇧🇷 Brasil",ligas:[71,72,75]},{code:"co",label:"🇨🇴 Colombia",ligas:[239,241]},{code:"uy",label:"🇺🇾 Uruguay",ligas:[268]},{code:"pe",label:"🇵🇪 Perú",ligas:[283]},{code:"ec",label:"🇪🇨 Ecuador",ligas:[240,514]},{code:"bo",label:"🇧🇴 Bolivia",ligas:[209]},{code:"py",label:"🇵🇾 Paraguay",ligas:[282]},{code:"ve",label:"🇻🇪 Venezuela",ligas:[292]}];
  const POSICIONES=["Todas","Arquero","Defensor Central","Lateral","Volante de Contención","Volante Ofensivo","Extremo","Delantero Centro"];
  const togglePais=code=>setFiltros(f=>({...f,paises:f.paises.includes(code)?f.paises.filter(p=>p!==code):[...f.paises,code]}));
  const buscar=()=>{
    if(!datos||datos.length===0)return;
    setBuscando(true);setPagina(0);
    const pa=filtros.paises.length===0?PAISES:PAISES.filter(p=>filtros.paises.includes(p.code));
    const lp=new Set(pa.flatMap(p=>p.ligas));
    const res=[];
    for(const j of datos){
      const edad=j.age||0;
      if(edad===0||edad>filtros.edadMax)continue;
      if((j.minutes_played||0)<filtros.minMinutos)continue;
      const lid=j.l_id||j.league_id;
      if(!lp.has(lid))continue;
      if(filtros.posicion!=="Todas"){const pn=POS_MAP[(j.position||"").toUpperCase()]||"";if(pn!==filtros.posicion)continue;}
      const li=LIGA_VM[lid];
      const pot=calcPotencial(j,li);
      const sub=calcSubvaloracion(j,pot,li);
      if(filtros.soloSubvalorados&&sub<50)continue;
      if(pot<40)continue;
      res.push({...j,_potencial:pot,_subvaloracion:sub,_ligaInfo:li,_comparables:getComparables(j,pot)});
    }
    res.sort((a,b)=>orden==="potencial"?b._potencial-a._potencial:orden==="edad"?(a.age||99)-(b.age||99):b._subvaloracion-a._subvaloracion);
    setResultado(res);setBuscando(false);
  };
  const pag=resultado.slice(pagina*POR_PAG,(pagina+1)*POR_PAG);
  const tp=Math.ceil(resultado.length/POR_PAG);
  const cS=v=>v>=80?"#ef4444":v>=65?"#f59e0b":v>=50?"#3b82f6":"#64748b";
  const lS=v=>v>=80?"🔥 Joya Oculta":v>=65?"⭐ Alta Proyección":v>=50?"📡 En el Radar":"—";
  const cP=v=>v>=80?"#00e87a":v>=65?"#3b82f6":v>=50?"#f59e0b":"#64748b";
  const pi=pos=>{const p=(pos||"").toUpperCase();if(p.startsWith("G"))return"🧤";if(p.startsWith("D")||p==="CB"||p==="LB"||p==="RB")return"🛡️";if(p==="DM"||p==="CM"||p==="M")return"🧱";if(p==="AM"||p==="MF")return"🎨";if(p==="LW"||p==="RW"||p==="W")return"⚡";return"🎯";};
  return(
    <div style={{fontFamily:"'Inter',sans-serif",color:"#eef2f6",minHeight:"100vh"}}>
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)",borderRadius:12,padding:"10px 14px",fontSize:22}}>📡</div>
          <div><h2 style={{margin:0,fontSize:22,fontWeight:800,letterSpacing:-0.5}}>Radar Oculto</h2><p style={{margin:0,fontSize:13,color:"#64748b"}}>Talentos subvalorados que nadie está mirando en Sudamérica</p></div>
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(139,92,246,0.08),rgba(99,102,241,0.05))",border:"1px solid rgba(139,92,246,0.2)",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#94a3b8",display:"flex",gap:16,flexWrap:"wrap"}}>
          <span>🧠 <strong style={{color:"#eef2f6"}}>Índice de Potencial:</strong> proyección basada en edad, rendimiento y liga</span>
          <span>🔥 <strong style={{color:"#eef2f6"}}>Subvaloración:</strong> brecha entre talento real y visibilidad en el mercado</span>
        </div>
      </div>
      <Card style={{marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:16}}>
          <div><Lbl>EDAD MÁXIMA</Lbl><select style={{...I,cursor:"pointer"}} value={filtros.edadMax} onChange={e=>setFiltros(f=>({...f,edadMax:+e.target.value}))}>{[18,19,20,21,22,23,24,25,26].map(e=><option key={e} value={e}>{e} años</option>)}</select></div>
          <div><Lbl>POSICIÓN</Lbl><select style={{...I,cursor:"pointer"}} value={filtros.posicion} onChange={e=>setFiltros(f=>({...f,posicion:e.target.value}))}>{POSICIONES.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div><Lbl>MÍNIMO MINUTOS</Lbl><select style={{...I,cursor:"pointer"}} value={filtros.minMinutos} onChange={e=>setFiltros(f=>({...f,minMinutos:+e.target.value}))}>{[300,500,800,1000,1500,2000].map(m=><option key={m} value={m}>{m} min</option>)}</select></div>
          <div><Lbl>ORDENAR POR</Lbl><select style={{...I,cursor:"pointer"}} value={orden} onChange={e=>setOrden(e.target.value)}><option value="subvaloracion">🔥 Mayor Subvaloración</option><option value="potencial">🧠 Mayor Potencial</option><option value="edad">📅 Más Jóvenes</option></select></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div onClick={()=>setFiltros(f=>({...f,soloSubvalorados:!f.soloSubvalorados}))} style={{width:40,height:22,borderRadius:11,cursor:"pointer",transition:"background 0.2s",background:filtros.soloSubvalorados?"#8b5cf6":"rgba(255,255,255,0.1)",position:"relative",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:filtros.soloSubvalorados?21:3,width:16,height:16,borderRadius:8,background:"#fff",transition:"left 0.2s"}}/>
          </div>
          <span style={{fontSize:13,color:"#94a3b8"}}>Solo jugadores con alto índice de subvaloración (≥ 50)</span>
        </div>
        <div><Lbl>PAÍSES</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{PAISES.map(p=><button key={p.code} onClick={()=>togglePais(p.code)} style={{background:filtros.paises.includes(p.code)?"rgba(139,92,246,0.25)":"rgba(255,255,255,0.05)",border:filtros.paises.includes(p.code)?"1px solid #8b5cf6":"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 12px",color:filtros.paises.includes(p.code)?"#c4b5fd":"#94a3b8",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{p.label}</button>)}</div></div>
        <div style={{marginTop:16,display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={buscar} style={{...BP,padding:"11px 28px",fontSize:14}}>{buscando?"Buscando...":"🔍 Activar Radar"}</button>
          {resultado.length>0&&<span style={{fontSize:13,color:"#64748b"}}>{resultado.length} talentos detectados</span>}
        </div>
      </Card>
      {resultado.length>0&&!detalle&&(<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:20}}>
          {[{label:"Talentos detectados",val:resultado.length,icon:"📡",color:"#8b5cf6"},{label:"Joyas ocultas (≥80)",val:resultado.filter(j=>j._subvaloracion>=80).length,icon:"🔥",color:"#ef4444"},{label:"Alta proyección",val:resultado.filter(j=>j._subvaloracion>=65).length,icon:"⭐",color:"#f59e0b"},{label:"Edad promedio",val:(resultado.reduce((a,j)=>(a+(j.age||0)),0)/resultado.length).toFixed(1)+"y",icon:"📅",color:"#00e87a"}].map((s,i)=><Card key={i} style={{textAlign:"center",padding:14}}><div style={{fontSize:22,marginBottom:4}}>{s.icon}</div><div style={{fontSize:22,fontWeight:800,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:"#64748b",fontWeight:600}}>{s.label}</div></Card>)}
        </div>
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700,fontSize:14}}>📋 TOP {Math.min(resultado.length,POR_PAG*(pagina+1))} de {resultado.length} talentos</span>
            <span style={{fontSize:12,color:"#64748b"}}>Por {orden}</span>
          </div>
          {pag.map((j,idx)=>(
            <div key={j.player_id||idx} onClick={()=>setDetalle(j)} style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"grid",gridTemplateColumns:"32px 2fr 1fr 1fr 1fr 1fr auto",gap:12,alignItems:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{fontSize:11,fontWeight:800,color:pagina*POR_PAG+idx<3?["#f59e0b","#94a3b8","#cd7c3f"][pagina*POR_PAG+idx]:"#64748b",textAlign:"center"}}>#{pagina*POR_PAG+idx+1}</div>
              <div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{pi(j.position)} {j.name||j.player_name||"—"}</div><div style={{fontSize:11,color:"#64748b"}}>{j.team_name||"—"} · {j._ligaInfo?.nombre||`Liga ${j.l_id}`}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:800}}>{j.age||"—"}</div><div style={{fontSize:10,color:"#64748b"}}>años</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:cP(j._potencial)}}>{j._potencial}</div><div style={{fontSize:10,color:"#64748b"}}>potencial</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:cS(j._subvaloracion)}}>{j._subvaloracion}</div><div style={{fontSize:10,color:"#64748b"}}>subvalorac.</div></div>
              <div><Bdg color={cS(j._subvaloracion)}>{lS(j._subvaloracion)}</Bdg></div>
              <div style={{color:"#64748b",fontSize:16}}>›</div>
            </div>
          ))}
        </Card>
        {tp>1&&<div style={{display:"flex",justifyContent:"center",gap:8,marginTop:16}}><button onClick={()=>setPagina(p=>Math.max(0,p-1))} disabled={pagina===0} style={{...BB,padding:"6px 16px",opacity:pagina===0?0.4:1}}>‹</button><span style={{padding:"6px 14px",fontSize:13,color:"#64748b"}}>{pagina+1}/{tp}</span><button onClick={()=>setPagina(p=>Math.min(tp-1,p+1))} disabled={pagina===tp-1} style={{...BB,padding:"6px 16px",opacity:pagina===tp-1?0.4:1}}>›</button></div>}
      </>)}
      {detalle&&(
        <div>
          <button onClick={()=>setDetalle(null)} style={{...BB,marginBottom:16,padding:"8px 16px",fontSize:12}}>← Volver al Radar</button>
          <Card>
            <div style={{display:"flex",gap:20,marginBottom:24,flexWrap:"wrap"}}>
              <div style={{width:72,height:72,borderRadius:16,flexShrink:0,background:`linear-gradient(135deg,${cP(detalle._potencial)}33,${cP(detalle._potencial)}11)`,border:`2px solid ${cP(detalle._potencial)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{pi(detalle.position)}</div>
              <div style={{flex:1}}>
                <h3 style={{margin:"0 0 4px",fontSize:20,fontWeight:800}}>{detalle.name||detalle.player_name}</h3>
                <div style={{fontSize:13,color:"#94a3b8",marginBottom:8}}>{detalle.team_name} · {detalle._ligaInfo?.nombre||`Liga ${detalle.l_id}`} · {detalle.nationality||"—"}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Bdg color={cS(detalle._subvaloracion)}>{lS(detalle._subvaloracion)}</Bdg><Bdg color="#94a3b8">{detalle.position||"—"}</Bdg><Bdg color="#64748b">{detalle.age} años</Bdg></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
              <Card style={{textAlign:"center",background:"rgba(0,232,122,0.05)",borderColor:"rgba(0,232,122,0.15)"}}><div style={{fontSize:11,color:"#64748b",fontWeight:600,letterSpacing:.4,marginBottom:4}}>ÍNDICE DE POTENCIAL</div><div style={{fontSize:48,fontWeight:900,color:cP(detalle._potencial),lineHeight:1}}>{detalle._potencial}</div><div style={{fontSize:11,color:"#64748b",marginTop:2}}>/ 100</div><div style={{marginTop:8}}><Barra valor={detalle._potencial} color={cP(detalle._potencial)}/></div><div style={{marginTop:6}}><Estrellas valor={detalle._potencial}/></div></Card>
              <Card style={{textAlign:"center",background:"rgba(139,92,246,0.05)",borderColor:"rgba(139,92,246,0.15)"}}><div style={{fontSize:11,color:"#64748b",fontWeight:600,letterSpacing:.4,marginBottom:4}}>ÍNDICE DE SUBVALORACIÓN</div><div style={{fontSize:48,fontWeight:900,color:cS(detalle._subvaloracion),lineHeight:1}}>{detalle._subvaloracion}</div><div style={{fontSize:11,color:"#64748b",marginTop:2}}>/ 100</div><div style={{marginTop:8}}><Barra valor={detalle._subvaloracion} color={cS(detalle._subvaloracion)}/></div><div style={{marginTop:6,fontSize:12,color:cS(detalle._subvaloracion),fontWeight:700}}>{lS(detalle._subvaloracion)}</div></Card>
            </div>
            <div style={{marginBottom:24}}><Lbl>ESTADÍSTICAS</Lbl><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:10}}>{[{k:"Partidos",v:detalle.appearances||0},{k:"Minutos",v:detalle.minutes_played||0},{k:"Goles",v:detalle.goals||0},{k:"Asistencias",v:detalle.assists||0},{k:"Min/partido",v:detalle.appearances>0?Math.round((detalle.minutes_played||0)/detalle.appearances):"—"}].map(s=><div key={s.k} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",padding:"10px 8px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800}}>{s.v}</div><div style={{fontSize:10,color:"#64748b",fontWeight:600}}>{s.k}</div></div>)}</div></div>
            {detalle._comparables?.length>0&&<div style={{marginBottom:16}}><Lbl>COMPARABLES</Lbl><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{detalle._comparables.map(c=><div key={c} style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#c4b5fd",fontWeight:600}}>🔵 {c}</div>)}</div></div>}
            <Card style={{background:"rgba(139,92,246,0.06)",borderColor:"rgba(139,92,246,0.2)"}}>
              <Lbl>¿POR QUÉ ESTÁ SUBVALORADO?</Lbl>
              <div style={{fontSize:13,color:"#c4b5fd",lineHeight:1.7}}>
                {detalle._ligaInfo?.tier>=3&&<div style={{marginBottom:4}}>📍 <strong>Liga de baja visibilidad:</strong> {detalle._ligaInfo.nombre} promedio €{detalle._ligaInfo.vm_avg.toFixed(1)}M vs €22M Premier League.</div>}
                {(detalle.age||99)<=22&&<div style={{marginBottom:4}}>📅 <strong>Juventud extrema:</strong> Con {detalle.age} años aún está en su fase de mayor desarrollo.</div>}
                {(detalle.minutes_played||0)>=1000&&<div style={{marginBottom:4}}>⏱️ <strong>Alta regularidad:</strong> {detalle.minutes_played} minutos — titular indiscutible.</div>}
                {detalle._potencial>=70&&<div>🧠 <strong>Potencial real:</strong> Índice {detalle._potencial}/100 — percentil superior en Sudamérica.</div>}
              </div>
            </Card>
          </Card>
        </div>
      )}
      {resultado.length===0&&!buscando&&(
        <Card style={{textAlign:"center",padding:40}}>
          <div style={{fontSize:48,marginBottom:12}}>📡</div>
          <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Radar listo para activarse</div>
          <div style={{fontSize:13,color:"#64748b"}}>Configura los filtros y presiona "Activar Radar" para detectar talentos subvalorados</div>
        </Card>
      )}
    </div>
  );
}

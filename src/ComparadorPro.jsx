import { useState, useCallback } from "react";

// ─── PALETA Y ESTILOS ────────────────────────────────────────────────────────
const C = {
  green:"#00e87a", dark:"#040a0f", dark2:"#07111a", dark3:"#0c1c28",
  muted:"#3a5060", text:"#eef2f6", border:"rgba(255,255,255,0.07)",
};
const SLOT_COLORS = ["#00e87a","#3b82f6","#f59e0b","#ec4899"];

// ─── CONFIGURACIÓN POR POSICIÓN ──────────────────────────────────────────────
const POS_CFG = {
  "Arquero":{icon:"🧤",color:"#f59e0b",stats:[
    {k:"partidos",l:"Partidos jugados",u:"",max:38},{k:"minutos",l:"Minutos totales",u:"'",max:3420},
    {k:"rating",l:"Rating promedio",u:"",max:10,dec:true},{k:"atajadas",l:"Atajadas",u:"",max:120},
    {k:"goles",l:"Goles recibidos",u:"",max:50,neg:true},{k:"pases_total",l:"Pases totales",u:"",max:1000},
    {k:"amarillas",l:"Tarjetas amarillas",u:"",max:10,neg:true},
  ]},
  "Defensor Central":{icon:"🛡️",color:"#3b82f6",stats:[
    {k:"partidos",l:"Partidos jugados",u:"",max:38},{k:"minutos",l:"Minutos totales",u:"'",max:3420},
    {k:"rating",l:"Rating promedio",u:"",max:10,dec:true},{k:"tackles",l:"Tackles exitosos",u:"",max:80},
    {k:"intercepciones",l:"Intercepciones",u:"",max:80},{k:"duelos_ganados",l:"Duelos ganados",u:"",max:200},
    {k:"pases_total",l:"Pases totales",u:"",max:1500},{k:"goles",l:"Goles marcados",u:"",max:10},
    {k:"amarillas",l:"Tarjetas amarillas",u:"",max:10,neg:true},
  ]},
  "Lateral":{icon:"↔️",color:"#8b5cf6",stats:[
    {k:"partidos",l:"Partidos jugados",u:"",max:38},{k:"minutos",l:"Minutos totales",u:"'",max:3420},
    {k:"rating",l:"Rating promedio",u:"",max:10,dec:true},{k:"pases_total",l:"Pases totales",u:"",max:1500},
    {k:"pases_clave",l:"Pases clave",u:"",max:60},{k:"tackles",l:"Tackles",u:"",max:80},
    {k:"intercepciones",l:"Intercepciones",u:"",max:60},{k:"goles",l:"Goles",u:"",max:10},
    {k:"asistencias",l:"Asistencias",u:"",max:15},
  ]},
  "Volante de Contención":{icon:"🧱",color:"#10b981",stats:[
    {k:"partidos",l:"Partidos jugados",u:"",max:38},{k:"minutos",l:"Minutos totales",u:"'",max:3420},
    {k:"rating",l:"Rating promedio",u:"",max:10,dec:true},{k:"tackles",l:"Tackles exitosos",u:"",max:100},
    {k:"intercepciones",l:"Intercepciones",u:"",max:80},{k:"pases_total",l:"Pases totales",u:"",max:2000},
    {k:"pases_clave",l:"Pases clave",u:"",max:60},{k:"duelos_ganados",l:"Duelos ganados",u:"",max:200},
    {k:"goles",l:"Goles",u:"",max:10},{k:"asistencias",l:"Asistencias",u:"",max:15},
  ]},
  "Volante Ofensivo":{icon:"🎨",color:"#f97316",stats:[
    {k:"partidos",l:"Partidos jugados",u:"",max:38},{k:"minutos",l:"Minutos totales",u:"'",max:3420},
    {k:"rating",l:"Rating promedio",u:"",max:10,dec:true},{k:"goles",l:"Goles marcados",u:"",max:30},
    {k:"asistencias",l:"Asistencias",u:"",max:25},{k:"pases_clave",l:"Pases clave",u:"",max:100},
    {k:"pases_total",l:"Pases totales",u:"",max:1500},{k:"regates_exito",l:"Regates exitosos",u:"",max:80},
    {k:"disparos_arco",l:"Disparos al arco",u:"",max:60},
  ]},
  "Extremo":{icon:"⚡",color:"#ec4899",stats:[
    {k:"partidos",l:"Partidos jugados",u:"",max:38},{k:"minutos",l:"Minutos totales",u:"'",max:3420},
    {k:"rating",l:"Rating promedio",u:"",max:10,dec:true},{k:"goles",l:"Goles marcados",u:"",max:30},
    {k:"asistencias",l:"Asistencias",u:"",max:25},{k:"regates_exito",l:"Regates exitosos",u:"",max:100},
    {k:"disparos_arco",l:"Disparos al arco",u:"",max:60},{k:"pases_clave",l:"Pases clave",u:"",max:80},
  ]},
  "Delantero Centro":{icon:"🎯",color:"#ef4444",stats:[
    {k:"partidos",l:"Partidos jugados",u:"",max:38},{k:"minutos",l:"Minutos totales",u:"'",max:3420},
    {k:"rating",l:"Rating promedio",u:"",max:10,dec:true},{k:"goles",l:"Goles marcados",u:"",max:40},
    {k:"asistencias",l:"Asistencias",u:"",max:20},{k:"disparos_total",l:"Disparos totales",u:"",max:120},
    {k:"disparos_arco",l:"Disparos al arco",u:"",max:70},{k:"duelos_ganados",l:"Duelos aéreos ganados",u:"",max:100},
    {k:"regates_exito",l:"Regates exitosos",u:"",max:50},
  ]},
};

const POSICIONES = Object.keys(POS_CFG);

// ─── NIVEL BADGE ─────────────────────────────────────────────────────────────
const NIVEL_INFO = {
  1:{label:"1ª División",color:"#00e87a"},
  2:{label:"2ª División",color:"#3b82f6"},
  3:{label:"Copa/Regional",color:"#f59e0b"},
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function norm(j){
  return {
    id:           j.id,
    nombre:       j.n    || j.nombre    || "—",
    edad:         j.e    || j.edad      || null,
    foto:         j.foto || "",
    posicion:     j.pos  || j.posicion  || "",
    equipo:       j.eq   || j.equipo    || "—",
    liga:         j.l    || j.liga      || j.liga_nombre || "—",
    region:       j.pa   || j.region    || "—",
    nivel:        j.nv   || j.nivel     || 1,
    pais:         j.pa   || j.pais      || "",
    stats:{
      partidos:       j.pts || j.stats?.partidos       || null,
      minutos:        j.min || j.stats?.minutos        || null,
      rating:         j.rating|| j.stats?.rating       || null,
      goles:          j.g   || j.stats?.goles          || null,
      asistencias:    j.a   || j.stats?.asistencias    || null,
      disparos_total: j.stats?.disparos_total          || null,
      disparos_arco:  j.stats?.disparos_arco           || null,
      pases_total:    j.stats?.pases_total             || null,
      pases_clave:    j.stats?.pases_clave             || null,
      regates_exito:  j.stats?.regates_exito           || null,
      tackles:        j.stats?.tackles                 || null,
      intercepciones: j.stats?.intercepciones          || null,
      duelos_ganados: j.stats?.duelos_ganados          || null,
      atajadas:       j.stats?.atajadas                || null,
      amarillas:      j.stats?.amarillas               || null,
    }
  };
}

// ─── PDF GENERATOR ────────────────────────────────────────────────────────────
function exportPDF(jugadores, posicion){
  if(!jugadores.length) return;
  const cfg   = POS_CFG[posicion] || POS_CFG["Delantero Centro"];
  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const cols  = SLOT_COLORS.slice(0, jugadores.length);

  const pctBar = (v,max,color,neg=false) => {
    const n   = parseFloat(v)||0;
    const pct = Math.min((n/max)*100,100);
    const c   = neg ? "#ef4444" : color;
    return `<div style="display:flex;align-items:center;gap:8px">
      <div style="flex:1;height:5px;background:#e2e8f0;border-radius:3px">
        <div style="width:${pct}%;height:100%;background:${c};border-radius:3px"></div>
      </div>
      <span style="font-size:12px;font-weight:700;color:${c};min-width:35px;text-align:right">${n||"—"}</span>
    </div>`;
  };

  const playerCard = (j,i) => {
    const nv = NIVEL_INFO[j.nivel]||NIVEL_INFO[1];
    return `<div style="background:#f8fafc;border:2px solid ${cols[i]}33;border-radius:12px;padding:18px;text-align:center;flex:1">
      <div style="width:70px;height:70px;border-radius:50%;overflow:hidden;margin:0 auto 10px;border:2px solid ${cols[i]}">
        ${j.foto?`<img src="${j.foto}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=\\'width:70px;height:70px;background:${cols[i]}20;display:flex;align-items:center;justify-content:center;font-size:30px\\'>${cfg.icon}</div>'">`:`<div style="width:100%;height:100%;background:${cols[i]}20;display:flex;align-items:center;justify-content:center;font-size:30px">${cfg.icon}</div>`}
      </div>
      <div style="background:${cols[i]};color:#000;border-radius:20px;padding:2px 10px;font-size:10px;font-weight:700;display:inline-block;margin-bottom:8px">${i+1}</div>
      <div style="font-weight:800;font-size:16px;color:#0f172a;margin-bottom:4px">${j.nombre}</div>
      <div style="font-size:12px;color:#374151;margin-bottom:3px;font-weight:500">${j.equipo}</div>
      <div style="font-size:11px;color:#64748b;margin-bottom:8px">${j.liga}</div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
        ${j.edad?`<span style="background:#f1f5f9;color:#374151;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:600">${j.edad} años</span>`:""}
        <span style="background:${nv.color}18;color:${nv.color};border-radius:4px;padding:2px 8px;font-size:11px;font-weight:600">${nv.label}</span>
        ${j.pais?`<span style="background:#f1f5f9;color:#374151;border-radius:4px;padding:2px 8px;font-size:11px">${j.pais}</span>`:""}
      </div>
      ${j.stats?.rating?`<div style="margin-top:10px;font-size:24px;font-weight:800;color:${cols[i]}">★ ${j.stats.rating}</div><div style="font-size:10px;color:#94a3b8">Rating promedio</div>`:""}
    </div>`;
  };

  const statsRows = cfg.stats.map(st => {
    const vals = jugadores.map(j=>j.stats?.[st.k]);
    const nums = vals.map(v=>parseFloat(v)||0);
    const max  = Math.max(...nums);
    return `<tr>
      <td style="padding:10px 14px;font-size:12px;color:#374151;font-weight:500;border-bottom:1px solid #f1f5f9;white-space:nowrap">${st.l}</td>
      ${jugadores.map((j,i)=>{
        const v=j.stats?.[st.k]; const n=parseFloat(v)||0;
        const isBest=n===max&&max>0&&!st.neg;
        return `<td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;min-width:140px">
          ${pctBar(v||0, st.max||100, isBest?cols[i]:"#cbd5e1", st.neg)}
          ${isBest?`<div style="font-size:9px;color:${cols[i]};font-weight:700;margin-top:2px">▲ MEJOR</div>`:""}
        </td>`;
      }).join("")}
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>FichaScout — Comparación ${posicion}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#fff;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:14px}
  @page{size:A4 landscape;margin:12mm}
</style>
</head>
<body>

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#040a0f 0%,#07111a 100%);padding:18px 28px;display:flex;justify-content:space-between;align-items:center;border-radius:10px;margin-bottom:18px">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:42px;height:42px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:22px">⚽</div>
      <div>
        <div style="font-weight:800;font-size:20px;color:#fff">Ficha<span style="color:#00e87a">Scout</span></div>
        <div style="font-size:9px;color:#3a5060;letter-spacing:2px">PLATAFORMA DE SCOUTING PROFESIONAL</div>
      </div>
    </div>
    <div style="text-align:right">
      <div style="color:#fff;font-weight:800;font-size:16px">INFORME COMPARATIVO</div>
      <div style="color:#3a5060;font-size:11px;margin-top:2px">${cfg.icon} ${posicion} · ${jugadores.length} jugadores · ${fecha}</div>
    </div>
  </div>

  <!-- CARDS JUGADORES -->
  <div style="display:flex;gap:12px;margin-bottom:18px">
    ${jugadores.map((j,i)=>playerCard(j,i)).join("")}
  </div>

  <!-- TABLA ESTADÍSTICAS -->
  <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:18px">
    <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);padding:10px 14px;border-bottom:2px solid #e2e8f0">
      <div style="font-size:12px;font-weight:700;color:#374151;letter-spacing:0.5px">ESTADÍSTICAS COMPARATIVAS · Temporada 2024</div>
      <div style="font-size:10px;color:#94a3b8;margin-top:2px">Las barras muestran el rendimiento relativo · ▲ MEJOR = líder en esa categoría</div>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#f8fafc">
          <th style="padding:8px 14px;font-size:10px;color:#94a3b8;text-align:left;font-weight:600;border-bottom:1px solid #e2e8f0">ESTADÍSTICA</th>
          ${jugadores.map((j,i)=>`<th style="padding:8px 14px;font-size:12px;font-weight:700;color:${cols[i]};text-align:left;border-bottom:2px solid ${cols[i]};min-width:140px">${j.nombre.split(" ")[0].toUpperCase()} ${j.nombre.split(" ")[1]?.[0]||""}.</th>`).join("")}
        </tr>
      </thead>
      <tbody>${statsRows}</tbody>
    </table>
  </div>

  <!-- RESUMEN POR JUGADOR -->
  <div style="display:grid;grid-template-columns:repeat(${jugadores.length},1fr);gap:10px;margin-bottom:16px">
    ${jugadores.map((j,i)=>`
      <div style="border-left:3px solid ${cols[i]};padding:10px 12px;background:#f8fafc;border-radius:0 8px 8px 0">
        <div style="font-weight:700;color:${cols[i]};font-size:11px;margin-bottom:6px;text-transform:uppercase">${j.nombre}</div>
        <div style="font-size:11px;color:#374151;line-height:1.9">
          <span style="color:#94a3b8">Goles + Asistencias:</span> ${(j.stats?.goles||0)+(j.stats?.asistencias||0)} (${j.stats?.goles||0}G + ${j.stats?.asistencias||0}A)<br/>
          <span style="color:#94a3b8">Minutos jugados:</span> ${j.stats?.minutos||"—"}'<br/>
          <span style="color:#94a3b8">Liga:</span> ${j.liga}<br/>
          <span style="color:#94a3b8">Edad:</span> ${j.edad||"—"} años
        </div>
      </div>
    `).join("")}
  </div>

  <!-- FOOTER -->
  <div style="background:#040a0f;border-radius:8px;padding:12px 20px;display:flex;justify-content:space-between;align-items:center">
    <span style="color:#00e87a;font-weight:800;font-size:13px">FichaScout</span>
    <span style="color:#3a5060;font-size:10px">Análisis generado por Inteligencia Artificial · fichascout.com</span>
    <span style="background:#fef3c7;color:#92400e;padding:4px 10px;border-radius:5px;font-size:10px;font-weight:700">🔒 CONFIDENCIAL</span>
  </div>

</body></html>`;

  const v=window.open("","_blank","width=1200,height=800");
  v.document.write(html); v.document.close(); v.focus();
  setTimeout(()=>v.print(),900);
}

// ─── RADAR SVG ────────────────────────────────────────────────────────────────
function RadarSVG({jugadores, posicion}){
  const cfg  = POS_CFG[posicion]?.stats?.slice(0,6)||[];
  if(!cfg.length||!jugadores.length) return null;
  const n=cfg.length, cx=130, cy=130, r=90;
  const maxMap = Object.fromEntries(cfg.map(s=>[s.k, s.max||100]));

  const pts = (j) => cfg.map((st,i)=>{
    const angle=(i/n)*2*Math.PI-Math.PI/2;
    const v=Math.min((parseFloat(j.stats?.[st.k])||0)/maxMap[st.k],1);
    return [cx+r*v*Math.cos(angle), cy+r*v*Math.sin(angle)];
  });

  const gridCircles=[0.25,0.5,0.75,1].map(sc=>{
    const gpts=cfg.map((_,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;return `${cx+r*sc*Math.cos(a)},${cy+r*sc*Math.sin(a)}`;});
    return <polygon key={sc} points={gpts.join(" ")} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>;
  });

  const axisLines=cfg.map((_,i)=>{
    const a=(i/n)*2*Math.PI-Math.PI/2;
    return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>;
  });

  const labels=cfg.map((st,i)=>{
    const a=(i/n)*2*Math.PI-Math.PI/2;
    const lx=cx+(r+22)*Math.cos(a), ly=cy+(r+22)*Math.sin(a);
    return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill="rgba(255,255,255,0.35)" fontFamily="system-ui">{st.l.split(" ")[0]}</text>;
  });

  const polys=jugadores.map((j,ji)=>{
    const pols=pts(j).map(p=>p.join(",")).join(" ");
    return <polygon key={ji} points={pols} fill={SLOT_COLORS[ji]+"25"} stroke={SLOT_COLORS[ji]} strokeWidth="1.5" strokeOpacity="0.8"/>;
  });

  return(
    <svg viewBox="0 0 260 260" style={{width:"100%",maxWidth:220,display:"block",margin:"0 auto"}}>
      {gridCircles}{axisLines}{labels}{polys}
    </svg>
  );
}

// ─── PLAYER CARD ──────────────────────────────────────────────────────────────
function PlayerCard({j, idx, onRemove}){
  const color = SLOT_COLORS[idx];
  const nv    = NIVEL_INFO[j.nivel]||NIVEL_INFO[1];
  return(
    <div style={{background:`${color}08`,border:`1px solid ${color}30`,borderRadius:14,padding:14,position:"relative",flexShrink:0}}>
      <button onClick={onRemove} style={{position:"absolute",top:8,right:8,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,color:"#ef4444",cursor:"pointer",fontSize:11,padding:"2px 6px",fontFamily:"inherit",lineHeight:1}}>✕</button>

      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        {/* Número */}
        <div style={{width:22,height:22,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#000"}}>{idx+1}</div>

        {/* Foto */}
        {j.foto?(
          <img src={j.foto} alt={j.nombre} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:`2px solid ${color}`}} onError={e=>e.target.style.display="none"}/>
        ):(
          <div style={{width:52,height:52,borderRadius:"50%",background:`${color}15`,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{POS_CFG[j.posicion]?.icon||"⚽"}</div>
        )}

        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:800,color:"#eef2f6",fontSize:13,lineHeight:1.2}}>{j.nombre}</div>
          <div style={{color:"#4a6070",fontSize:11,marginTop:2}}>{j.equipo}</div>
          <div style={{color:"#4a6070",fontSize:10}}>{j.liga}</div>
        </div>

        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center"}}>
          {j.edad&&<span style={{background:`${color}15`,color,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:600}}>{j.edad}a</span>}
          <span style={{background:`${nv.color}15`,color:nv.color,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:600}}>{nv.label}</span>
        </div>

        {j.stats?.rating&&<div style={{fontWeight:800,color,fontSize:18,letterSpacing:"-0.5px"}}>★ {j.stats.rating}</div>}
      </div>
    </div>
  );
}

// ─── STAT ROW ─────────────────────────────────────────────────────────────────
function StatRow({stat, jugadores}){
  const vals = jugadores.map(j=>parseFloat(j.stats?.[stat.k])||0);
  const max  = Math.max(...vals);
  return(
    <div style={{display:"grid",gridTemplateColumns:`140px repeat(${jugadores.length},1fr)`,gap:8,alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
      <div style={{fontSize:12,color:"#4a6070",fontWeight:500}}>{stat.l}</div>
      {jugadores.map((j,i)=>{
        const v  = parseFloat(j.stats?.[stat.k])||0;
        const pct= stat.max ? Math.min((v/stat.max)*100,100) : max>0?Math.min((v/max)*100,100):0;
        const best=v===max&&max>0&&!stat.neg;
        const c   = best ? SLOT_COLORS[i] : "rgba(255,255,255,0.15)";
        return(
          <div key={i}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
              <div style={{flex:1,height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:2,transition:"width .4s"}}/>
              </div>
              <span style={{fontSize:12,fontWeight:best?800:500,color:best?SLOT_COLORS[i]:"#64748b",minWidth:28,textAlign:"right"}}>{j.stats?.[stat.k]??'—'}</span>
            </div>
            {best&&<div style={{fontSize:9,color:SLOT_COLORS[i],fontWeight:700}}>▲ MEJOR</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────────────────
export default function ComparadorPro({ realPlayers=[] }){
  const [posicion,    setPosicion]    = useState("Delantero Centro");
  const [busqueda,    setBusqueda]    = useState("");
  const [filtRegion,  setFiltRegion]  = useState("");
  const [filtEdadMin, setFiltEdadMin] = useState("");
  const [filtEdadMax, setFiltEdadMax] = useState("");
  const [selec,       setSelec]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [iaText,      setIaText]      = useState("");
  const [vistaTab,    setVistaTab]    = useState("estadisticas");

  const cfg      = POS_CFG[posicion] || POS_CFG["Delantero Centro"];
  const regiones = [...new Set(realPlayers.map(p=>p.pa||p.region).filter(Boolean))].sort();

  const filtrados = realPlayers.filter(p=>{
    if((p.pos||p.posicion)!==posicion) return false;
    if(filtRegion&&(p.pa||p.region)!==filtRegion) return false;
    if(filtEdadMin&&(p.e||p.edad||0)<+filtEdadMin) return false;
    if(filtEdadMax&&(p.e||p.edad||0)>+filtEdadMax) return false;
    if(busqueda){
      const q=busqueda.toLowerCase();
      if(!(p.n||p.nombre||"").toLowerCase().includes(q)&&
         !(p.eq||p.equipo||"").toLowerCase().includes(q)&&
         !(p.l||p.liga||p.liga_nombre||"").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const toggleJ = useCallback(j=>{
    const n=norm(j);
    if(selec.find(s=>s.id===n.id)){setSelec(p=>p.filter(s=>s.id!==n.id));return;}
    if(selec.length>=4) return;
    setSelec(p=>[...p,n]);
  },[selec]);

  async function analizarIA(){
    if(selec.length<2) return;
    setLoading(true); setIaText("");
    try{
      const r=await fetch("/api/claude", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1300,messages:[{role:"user",content:
          `Eres scout profesional de élite. Compara estos ${selec.length} ${posicion}es para decisión de fichaje.\n\n`+
          selec.map((j,i)=>`JUGADOR ${i+1}: ${j.nombre} | ${j.equipo} | ${j.liga} | ${j.pais||"—"} | ${j.edad||"—"}a\nPartidos:${j.stats.partidos||"—"} Min:${j.stats.minutos||"—"}' Rating:${j.stats.rating||"—"}\nGoles:${j.stats.goles||0} Asist:${j.stats.asistencias||0} Pases:${j.stats.pases_total||"—"} Tackles:${j.stats.tackles||"—"} Regates:${j.stats.regates_exito||"—"}\nNivel:${j.nivel===1?"1ª División":j.nivel===2?"2ª División":"Copa/Regional"}`).join("\n\n")+
          `\n\n1. RESUMEN EJECUTIVO\n2. QUIÉN DESTACA Y POR QUÉ (con datos)\n3. PERFIL INDIVIDUAL DE CADA JUGADOR\n4. PARA QUÉ TIPO DE EQUIPO ES CADA UNO\n5. RECOMENDACIÓN FINAL DE FICHAJE`
        }]})
      });
      const d=await r.json();
      setIaText(d.content?.[0]?.text||"Error.");
    }catch{setIaText("Error de conexión.");}
    setLoading(false);
  }

  const isSelected = j=>!!selec.find(s=>s.id===j.id);
  const getIdx     = j=>selec.findIndex(s=>s.id===j.id);

  return(
    <div style={{fontFamily:"system-ui,sans-serif"}}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{background:"linear-gradient(135deg,rgba(0,232,122,0.08),rgba(59,130,246,0.06))",border:"1px solid rgba(0,232,122,0.15)",borderRadius:16,padding:"20px 24px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:800,color:"#eef2f6",fontSize:20,letterSpacing:"-0.5px",marginBottom:4}}>
            ⚖️ Comparador Scout Mundial
          </div>
          <div style={{color:"#4a6070",fontSize:13}}>
            Compare hasta <strong style={{color:"#00e87a"}}>4 jugadores</strong> profesionales del mismo puesto de <strong style={{color:"#00e87a"}}>cualquier liga del mundo</strong> · Análisis IA + PDF profesional
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[["🌎","~10.000+","Jugadores"],["🏆","80+","Ligas"],["🤖","IA","Análisis"],["📄","PDF","Export"]].map(([i,v,l])=>(
            <div key={l} style={{textAlign:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"8px 14px"}}>
              <div style={{fontSize:16,marginBottom:2}}>{i}</div>
              <div style={{fontWeight:800,color:"#eef2f6",fontSize:14}}>{v}</div>
              <div style={{color:"#4a6070",fontSize:10}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTROS ────────────────────────────────────────────────────────── */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px 18px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:600,color:"#4a6070",letterSpacing:.5,marginBottom:12}}>FILTROS DE BÚSQUEDA</div>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 2fr 1.5fr 100px 100px",gap:10}}>
          <div>
            <div style={{fontSize:11,color:"#4a6070",marginBottom:5,fontWeight:600,letterSpacing:.4}}>POSICIÓN</div>
            <select style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"9px 12px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",fontFamily:"inherit"}} value={posicion} onChange={e=>{setPosicion(e.target.value);setSelec([]);}}>
              {POSICIONES.map(p=><option key={p} value={p}>{POS_CFG[p].icon} {p}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"#4a6070",marginBottom:5,fontWeight:600,letterSpacing:.4}}>BUSCAR JUGADOR</div>
            <input style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"9px 12px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",fontFamily:"inherit"}} placeholder="🔍  Nombre, equipo o liga..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#4a6070",marginBottom:5,fontWeight:600,letterSpacing:.4}}>REGIÓN</div>
            <select style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"9px 12px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",fontFamily:"inherit"}} value={filtRegion} onChange={e=>setFiltRegion(e.target.value)}>
              <option value="">Todas las regiones</option>
              {regiones.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"#4a6070",marginBottom:5,fontWeight:600,letterSpacing:.4}}>EDAD MÍN</div>
            <input style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"9px 12px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",fontFamily:"inherit"}} type="number" placeholder="16" value={filtEdadMin} onChange={e=>setFiltEdadMin(e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#4a6070",marginBottom:5,fontWeight:600,letterSpacing:.4}}>EDAD MÁX</div>
            <input style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"9px 12px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",fontFamily:"inherit"}} type="number" placeholder="40" value={filtEdadMax} onChange={e=>setFiltEdadMax(e.target.value)}/>
          </div>
        </div>
        <div style={{marginTop:10,fontSize:12,color:"#4a6070"}}>
          <span style={{color:"#00e87a",fontWeight:700}}>{filtrados.length}</span> jugadores encontrados · Seleccione hasta <span style={{color:"#00e87a",fontWeight:700}}>4</span> para comparar
        </div>
      </div>

      {/* ── LAYOUT PRINCIPAL ───────────────────────────────────────────────── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:16}}>

        {/* LISTA */}
        <div>
          <div style={{fontSize:11,fontWeight:600,color:"#4a6070",letterSpacing:.5,marginBottom:10}}>JUGADORES DISPONIBLES</div>
          {!realPlayers.length&&(
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,border:"1px solid rgba(255,255,255,0.07)",padding:32,textAlign:"center",color:"#4a6070"}}>
              <div style={{fontSize:36,marginBottom:10}}>📊</div>
              <div style={{fontWeight:600,marginBottom:6}}>Base de datos vacía</div>
              <div style={{fontSize:12}}>Ejecute el script de extracción API para cargar los jugadores profesionales</div>
            </div>
          )}
          {realPlayers.length>0&&filtrados.length===0&&(
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,border:"1px solid rgba(255,255,255,0.07)",padding:32,textAlign:"center",color:"#4a6070"}}>
              <div style={{fontSize:32,marginBottom:8}}>🔍</div>
              Sin resultados. Cambie los filtros.
            </div>
          )}
          <div style={{maxHeight:580,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,paddingRight:2}}>
            {filtrados.slice(0,100).map(j=>{
              const n=norm(j); const sel=isSelected(j); const idx=getIdx(j);
              const color=idx>=0?SLOT_COLORS[idx]:cfg.color;
              return(
                <div key={j.id} onClick={()=>toggleJ(j)} style={{background:sel?`${color}10`:"rgba(255,255,255,0.025)",borderRadius:10,border:`1px solid ${sel?color+"44":"rgba(255,255,255,0.06)"}`,padding:"9px 13px",cursor:!sel&&selec.length>=4?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .15s",opacity:!sel&&selec.length>=4?0.4:1}}
                  onMouseEnter={e=>{if(!sel&&selec.length<4)e.currentTarget.style.background=`rgba(255,255,255,0.055)`;}}
                  onMouseLeave={e=>{if(!sel)e.currentTarget.style.background="rgba(255,255,255,0.025)";}}>
                  {n.foto?(
                    <img src={n.foto} alt={n.nombre} style={{width:32,height:32,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`1px solid ${color}33`}} onError={e=>e.target.style.display="none"}/>
                  ):(
                    <div style={{width:32,height:32,borderRadius:"50%",background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{cfg.icon}</div>
                  )}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,color:sel?color:"#eef2f6",fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n.nombre}</div>
                    <div style={{color:"#4a6070",fontSize:10,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n.equipo} · {n.liga}</div>
                  </div>
                  <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
                    {n.edad&&<span style={{fontSize:10,color:"#4a6070"}}>{n.edad}a</span>}
                    {n.stats.rating&&<span style={{background:`${color}18`,color,borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:700}}>★{n.stats.rating}</span>}
                    {n.stats.goles>0&&<span style={{color:"#4a6070",fontSize:10}}>{n.stats.goles}⚽</span>}
                    {sel&&<div style={{width:20,height:20,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#000",flexShrink:0}}>{idx+1}</div>}
                  </div>
                </div>
              );
            })}
            {filtrados.length>100&&<div style={{textAlign:"center",color:"#4a6070",fontSize:11,padding:8}}>Mostrando 100 de {filtrados.length} — refine los filtros para ver más</div>}
          </div>
        </div>

        {/* PANEL COMPARACIÓN */}
        <div>
          <div style={{fontSize:11,fontWeight:600,color:"#4a6070",letterSpacing:.5,marginBottom:10}}>COMPARACIÓN ({selec.length}/4)</div>

          {selec.length===0&&(
            <div style={{background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(255,255,255,0.1)",borderRadius:14,padding:"48px 24px",textAlign:"center",color:"#4a6070"}}>
              <div style={{fontSize:44,marginBottom:12,opacity:.5}}>⚖️</div>
              <div style={{fontWeight:600,fontSize:15,marginBottom:6,color:"#64748b"}}>Seleccione jugadores para comparar</div>
              <div style={{fontSize:12}}>Haga clic en cualquier jugador de la lista izquierda para agregarlo aquí</div>
              <div style={{marginTop:16,display:"flex",gap:8,justifyContent:"center"}}>
                {[1,2,3,4].map(i=><div key={i} style={{width:44,height:44,borderRadius:"50%",border:"2px dashed rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"rgba(255,255,255,0.15)",fontWeight:700}}>{i}</div>)}
              </div>
            </div>
          )}

          {selec.length>0&&(
            <div>
              {/* Cards seleccionados */}
              <div style={{display:"grid",gridTemplateColumns:`repeat(${selec.length},1fr)`,gap:8,marginBottom:14}}>
                {selec.map((j,i)=><PlayerCard key={j.id} j={j} idx={i} onRemove={()=>setSelec(p=>p.filter(s=>s.id!==j.id))}/>)}
              </div>

              {/* Tabs */}
              <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:4,marginBottom:14}}>
                {["estadisticas","radar","análisis IA"].map(t=>(
                  <button key={t} onClick={()=>setVistaTab(t)} style={{flex:1,background:vistaTab===t?"rgba(0,232,122,0.12)":"transparent",border:`1px solid ${vistaTab===t?"rgba(0,232,122,0.3)":"transparent"}`,borderRadius:8,padding:"7px 0",color:vistaTab===t?"#00e87a":"#4a6070",cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"inherit",textTransform:"capitalize"}}>{t}</button>
                ))}
              </div>

              {/* ESTADÍSTICAS */}
              {vistaTab==="estadisticas"&&(
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px 16px"}}>
                  <div style={{display:"grid",gridTemplateColumns:`140px repeat(${selec.length},1fr)`,gap:8,marginBottom:10,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                    <div style={{fontSize:10,color:"#4a6070",fontWeight:600,letterSpacing:.5}}>ESTADÍSTICA</div>
                    {selec.map((j,i)=><div key={i} style={{fontSize:11,fontWeight:700,color:SLOT_COLORS[i]}}>{j.nombre.split(" ")[0]}</div>)}
                  </div>
                  {cfg.stats.map(st=><StatRow key={st.k} stat={st} jugadores={selec}/>)}
                </div>
              )}

              {/* RADAR */}
              {vistaTab==="radar"&&(
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px 16px"}}>
                  <div style={{color:"#eef2f6",fontWeight:600,fontSize:13,marginBottom:14}}>🕸️ Radar Comparativo — {posicion}</div>
                  <RadarSVG jugadores={selec} posicion={posicion}/>
                  <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
                    {selec.map((j,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:10,height:10,borderRadius:2,background:SLOT_COLORS[i]}}/>
                        <span style={{fontSize:11,color:"#94a3b8"}}>{j.nombre.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ANÁLISIS IA */}
              {vistaTab==="análisis IA"&&(
                <div>
                  {!iaText?(
                    <button onClick={analizarIA} disabled={loading||selec.length<2} style={{width:"100%",border:"none",borderRadius:12,padding:"14px",color:"#fff",fontWeight:700,cursor:loading||selec.length<2?"not-allowed":"pointer",fontSize:14,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",opacity:selec.length<2?0.4:1,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                      {loading?<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando jugadores...</>:"🤖 Generar Análisis Scout IA Completo"}
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </button>
                  ):(
                    <div style={{background:"rgba(139,92,246,0.06)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:14,padding:18}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <span style={{color:"#eef2f6",fontWeight:700,fontSize:14}}>🤖 Análisis Scout IA</span>
                        <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:5,padding:"2px 9px",fontSize:11,fontWeight:700}}>FichaScout PRO</span>
                      </div>
                      <div style={{color:"#94a3b8",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{iaText}</div>
                      <button onClick={()=>setIaText("")} style={{marginTop:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 16px",color:"#4a6070",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>↻ Regenerar</button>
                    </div>
                  )}
                </div>
              )}

              {/* BOTÓN PDF */}
              <button onClick={()=>exportPDF(selec,posicion)} style={{width:"100%",border:"none",borderRadius:12,padding:"13px",color:"#000",fontWeight:800,cursor:"pointer",fontSize:14,background:"linear-gradient(135deg,#00e87a,#00c96a)",fontFamily:"inherit",marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10,letterSpacing:"0.3px"}}>
                📄 Exportar Informe Comparativo PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

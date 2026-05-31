import { useState, useRef } from "react";

// ─── CONFIGURACIÓN POR POSICIÓN ──────────────────────────────────────────────
const CONFIG_POS = {
  "Arquero": {
    icon:"🧤", color:"#f59e0b",
    stats:[
      {k:"partidos",    l:"Partidos",      fmt:"num"},
      {k:"minutos",     l:"Minutos",       fmt:"num"},
      {k:"rating",      l:"Rating",        fmt:"dec"},
      {k:"atajadas",    l:"Atajadas",      fmt:"num"},
      {k:"goles",       l:"Goles recibidos",fmt:"num",neg:true},
      {k:"pases_total", l:"Pases",         fmt:"num"},
      {k:"amarillas",   l:"Amarillas",     fmt:"num",neg:true},
    ],
    radar:["rating","atajadas","pases_total","partidos","minutos"],
  },
  "Defensor Central": {
    icon:"🛡️", color:"#3b82f6",
    stats:[
      {k:"partidos",        l:"Partidos",     fmt:"num"},
      {k:"minutos",         l:"Minutos",      fmt:"num"},
      {k:"rating",          l:"Rating",       fmt:"dec"},
      {k:"intercepciones",  l:"Intercepciones",fmt:"num"},
      {k:"tackles",         l:"Tackles",      fmt:"num"},
      {k:"duelos_ganados",  l:"Duelos ganados",fmt:"num"},
      {k:"pases_total",     l:"Pases totales", fmt:"num"},
      {k:"goles",           l:"Goles",         fmt:"num"},
      {k:"amarillas",       l:"Amarillas",     fmt:"num",neg:true},
    ],
    radar:["rating","intercepciones","tackles","duelos_ganados","pases_total"],
  },
  "Lateral": {
    icon:"↔️", color:"#8b5cf6",
    stats:[
      {k:"partidos",       l:"Partidos",     fmt:"num"},
      {k:"minutos",        l:"Minutos",      fmt:"num"},
      {k:"rating",         l:"Rating",       fmt:"dec"},
      {k:"pases_total",    l:"Pases totales",fmt:"num"},
      {k:"pases_clave",    l:"Pases clave",  fmt:"num"},
      {k:"tackles",        l:"Tackles",      fmt:"num"},
      {k:"intercepciones", l:"Intercepciones",fmt:"num"},
      {k:"goles",          l:"Goles",        fmt:"num"},
      {k:"asistencias",    l:"Asistencias",  fmt:"num"},
    ],
    radar:["rating","pases_total","tackles","pases_clave","asistencias"],
  },
  "Volante de Contención": {
    icon:"🧱", color:"#10b981",
    stats:[
      {k:"partidos",       l:"Partidos",      fmt:"num"},
      {k:"minutos",        l:"Minutos",       fmt:"num"},
      {k:"rating",         l:"Rating",        fmt:"dec"},
      {k:"tackles",        l:"Tackles",       fmt:"num"},
      {k:"intercepciones", l:"Intercepciones",fmt:"num"},
      {k:"pases_total",    l:"Pases totales", fmt:"num"},
      {k:"pases_clave",    l:"Pases clave",   fmt:"num"},
      {k:"duelos_ganados", l:"Duelos ganados",fmt:"num"},
      {k:"goles",          l:"Goles",         fmt:"num"},
      {k:"asistencias",    l:"Asistencias",   fmt:"num"},
    ],
    radar:["rating","tackles","intercepciones","pases_total","duelos_ganados"],
  },
  "Volante Ofensivo": {
    icon:"🎨", color:"#f97316",
    stats:[
      {k:"partidos",          l:"Partidos",      fmt:"num"},
      {k:"minutos",           l:"Minutos",       fmt:"num"},
      {k:"rating",            l:"Rating",        fmt:"dec"},
      {k:"goles",             l:"Goles",         fmt:"num"},
      {k:"asistencias",       l:"Asistencias",   fmt:"num"},
      {k:"pases_clave",       l:"Pases clave",   fmt:"num"},
      {k:"pases_total",       l:"Pases totales", fmt:"num"},
      {k:"regates_exito",     l:"Regates exitosos",fmt:"num"},
      {k:"disparos_arco",     l:"Disparos arco", fmt:"num"},
    ],
    radar:["rating","goles","asistencias","pases_clave","regates_exito"],
  },
  "Extremo": {
    icon:"⚡", color:"#ec4899",
    stats:[
      {k:"partidos",       l:"Partidos",        fmt:"num"},
      {k:"minutos",        l:"Minutos",         fmt:"num"},
      {k:"rating",         l:"Rating",          fmt:"dec"},
      {k:"goles",          l:"Goles",           fmt:"num"},
      {k:"asistencias",    l:"Asistencias",     fmt:"num"},
      {k:"regates_exito",  l:"Regates exitosos",fmt:"num"},
      {k:"disparos_arco",  l:"Disparos arco",   fmt:"num"},
      {k:"pases_clave",    l:"Pases clave",     fmt:"num"},
    ],
    radar:["rating","goles","asistencias","regates_exito","disparos_arco"],
  },
  "Delantero Centro": {
    icon:"🎯", color:"#ef4444",
    stats:[
      {k:"partidos",        l:"Partidos",        fmt:"num"},
      {k:"minutos",         l:"Minutos",         fmt:"num"},
      {k:"rating",          l:"Rating",          fmt:"dec"},
      {k:"goles",           l:"Goles",           fmt:"num"},
      {k:"asistencias",     l:"Asistencias",     fmt:"num"},
      {k:"disparos_total",  l:"Disparos totales",fmt:"num"},
      {k:"disparos_arco",   l:"Disparos arco",   fmt:"num"},
      {k:"duelos_ganados",  l:"Duelos aéreos",   fmt:"num"},
      {k:"regates_exito",   l:"Regates exitosos",fmt:"num"},
    ],
    radar:["rating","goles","asistencias","disparos_arco","duelos_ganados"],
  },
};

const POSICIONES = Object.keys(CONFIG_POS);
const COLORS = ["#00e87a","#3b82f6","#f59e0b","#ec4899"];
const REGION_LABELS = {
  "🇨🇱 Chile":"Chile","🇦🇷 Argentina":"Argentina","🇧🇷 Brasil":"Brasil",
  "🇨🇴 Colombia":"Colombia","🇺🇾 Uruguay":"Uruguay","🇵🇪 Perú":"Perú",
  "🇪🇨 Ecuador":"Ecuador","🇧🇴 Bolivia":"Bolivia","🇵🇾 Paraguay":"Paraguay",
  "🇻🇪 Venezuela":"Venezuela","🌎 Copa Libertadores":"Libertadores",
  "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra":"Inglaterra","🇪🇸 España":"España","🇩🇪 Alemania":"Alemania",
  "🇮🇹 Italia":"Italia","🇫🇷 Francia":"Francia","🇵🇹 Portugal":"Portugal",
  "🇳🇱 Países Bajos":"Holanda","🇹🇷 Turquía":"Turquía",
  "🇺🇸 USA":"USA","🇲🇽 México":"México","🏆 Champions League":"Champions",
  "🇸🇦 Arabia Saudita":"Arabia","🇯🇵 Japón":"Japón",
};

const S = {
  input:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"8px 12px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
  card:{background:"rgba(255,255,255,0.03)",borderRadius:14,border:"1px solid rgba(255,255,255,0.07)",padding:16},
};

// Generar PDF de comparación
function generarPDFComparacion(jugadores, posicion) {
  const config = CONFIG_POS[posicion] || CONFIG_POS["Delantero Centro"];
  const fecha  = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const cols   = COLORS.slice(0, jugadores.length);

  const statsHTML = config.stats.map(st => {
    const vals = jugadores.map(j => j.stats?.[st.k] ?? "—");
    const nums = vals.map(v => parseFloat(v)||0);
    const max  = Math.max(...nums);
    return `<tr>
      <td style="padding:8px 12px;font-size:12px;color:#374151;font-weight:500;border-bottom:1px solid #f3f4f6;width:140px">${st.l}</td>
      ${jugadores.map((j,i)=>{
        const v = j.stats?.[st.k];
        const n = parseFloat(v)||0;
        const isMax = n===max && max>0 && !st.neg;
        return `<td style="padding:8px 12px;font-size:13px;font-weight:${isMax?"800":"600"};color:${isMax?cols[i]:"#374151"};border-bottom:1px solid #f3f4f6;text-align:center">${v??'—'}${isMax?" ★":""}</td>`;
      }).join("")}
    </tr>`;
  }).join("");

  const playersHTML = jugadores.map((j,i) => `
    <div style="flex:1;background:#f8fafc;border:2px solid ${cols[i]}40;border-radius:12px;padding:16px;text-align:center">
      ${j.foto ? `<img src="${j.foto}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:2px solid ${cols[i]};margin-bottom:8px" onerror="this.style.display='none'"/>` : `<div style="width:70px;height:70px;border-radius:50%;background:${cols[i]}20;border:2px solid ${cols[i]};display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:8px">${config.icon}</div>`}
      <div style="font-weight:800;font-size:15px;color:#0f172a;margin-bottom:3px">${j.nombre||"—"}</div>
      <div style="font-size:12px;color:#64748b;margin-bottom:4px">${j.equipo||"—"}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:8px">${j.liga||j.liga_nombre||"—"}</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        ${j.edad ? `<span style="background:${cols[i]}15;color:${cols[i]};border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600">${j.edad} años</span>` : ""}
        ${j.pais ? `<span style="background:rgba(0,0,0,0.06);color:#374151;border-radius:4px;padding:2px 7px;font-size:11px">${j.pais}</span>` : ""}
        ${j.stats?.rating ? `<span style="background:${cols[i]}20;color:${cols[i]};border-radius:4px;padding:2px 8px;font-size:12px;font-weight:800">★ ${j.stats.rating}</span>` : ""}
      </div>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>FichaScout — Comparación ${posicion}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;background:#fff;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4 landscape;margin:15mm}
  @media print{body{margin:0}}
</style>
</head>
<body>
  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#040a0f,#07111a);color:#fff;padding:20px 30px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-radius:8px">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px">⚽</div>
      <div>
        <div style="font-weight:800;font-size:18px">Ficha<span style="color:#00e87a">Scout</span></div>
        <div style="font-size:9px;color:#4a6070;letter-spacing:1.5px">PLATAFORMA DE SCOUTING PROFESIONAL</div>
      </div>
    </div>
    <div style="text-align:right;font-size:11px;color:#94a3b8">
      <strong style="color:#fff;font-size:14px">COMPARACIÓN SCOUT — ${posicion.toUpperCase()}</strong><br/>
      ${config.icon} · ${jugadores.length} jugadores analizados · ${fecha}
    </div>
  </div>

  <!-- JUGADORES -->
  <div style="display:flex;gap:14px;margin-bottom:20px">
    ${playersHTML}
  </div>

  <!-- TABLA DE ESTADÍSTICAS -->
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px">
    <div style="background:#f1f5f9;padding:10px 14px;font-size:12px;font-weight:700;color:#374151;letter-spacing:0.5px;text-transform:uppercase">
      Estadísticas Comparativas · Temporada 2024 · ★ = Mejor en categoría
    </div>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="padding:8px 12px;font-size:11px;color:#6b7280;text-align:left;background:#f8fafc;border-bottom:2px solid #e2e8f0">Estadística</th>
          ${jugadores.map((j,i)=>`<th style="padding:8px 12px;font-size:12px;font-weight:700;color:${cols[i]};text-align:center;background:#f8fafc;border-bottom:2px solid ${cols[i]}44">${j.nombre?.split(" ")[0]||"Jugador "+(i+1)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>${statsHTML}</tbody>
    </table>
  </div>

  <!-- ANÁLISIS POR JUGADOR -->
  <div style="display:grid;grid-template-columns:repeat(${jugadores.length},1fr);gap:12px;margin-bottom:20px">
    ${jugadores.map((j,i)=>{
      const goles = j.stats?.goles||0;
      const asis  = j.stats?.asistencias||0;
      const rating= parseFloat(j.stats?.rating)||0;
      const min   = j.stats?.minutos||0;
      return `<div style="background:#f8fafc;border:1px solid ${cols[i]}30;border-radius:10px;padding:14px">
        <div style="font-weight:700;color:${cols[i]};font-size:12px;margin-bottom:8px;border-bottom:1px solid ${cols[i]}20;padding-bottom:6px">${j.nombre||"—"}</div>
        <div style="font-size:11px;color:#374151;line-height:2">
          <span style="color:#6b7280">Contribución ofensiva:</span> ${goles+asis} (${goles}G + ${asis}A)<br/>
          <span style="color:#6b7280">Rating promedio:</span> ${rating>0?rating:"Sin datos"}<br/>
          <span style="color:#6b7280">Minutos de juego:</span> ${min}'<br/>
          <span style="color:#6b7280">Liga:</span> ${j.liga||j.liga_nombre||"—"}<br/>
          <span style="color:#6b7280">Nivel:</span> ${j.nivel===1?"Primera División":j.nivel===2?"Segunda División":j.nivel===3?"Copa/Regional":"—"}
        </div>
      </div>`;
    }).join("")}
  </div>

  <!-- FOOTER -->
  <div style="background:#040a0f;color:#4a6070;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;font-size:10px;border-radius:6px">
    <span style="color:#00e87a;font-weight:700">FichaScout</span>
    <span>Comparación generada automáticamente · fichascout.com</span>
    <span style="background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:4px;font-weight:600">🔒 DOCUMENTO CONFIDENCIAL</span>
  </div>
</body>
</html>`;

  const v = window.open("","_blank","width=1100,height=750");
  v.document.write(html);
  v.document.close();
  v.focus();
  setTimeout(()=>v.print(), 800);
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ComparadorPro({ realPlayers = [] }) {
  const [posicion,    setPosicion]    = useState("Delantero Centro");
  const [busqueda,    setBusqueda]    = useState("");
  const [filtRegion,  setFiltRegion]  = useState("");
  const [filtEdadMin, setFiltEdadMin] = useState("");
  const [filtEdadMax, setFiltEdadMax] = useState("");
  const [seleccionados, setSelec]     = useState([]);  // max 4
  const [loading,     setLoading]     = useState(false);
  const [iaAnalysis,  setIaAnalysis]  = useState("");

  const config = CONFIG_POS[posicion] || CONFIG_POS["Delantero Centro"];

  // ── Filtrar jugadores ──────────────────────────────────────────────────────
  const filtrados = realPlayers.filter(p => {
    if (p.pos !== posicion && p.posicion !== posicion) return false;
    if (filtRegion && p.pa !== filtRegion && p.region !== filtRegion) return false;
    if (filtEdadMin && (p.e||p.edad||0) < +filtEdadMin) return false;
    if (filtEdadMax && (p.e||p.edad||0) > +filtEdadMax) return false;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      const n = (p.n||p.nombre||"").toLowerCase();
      const e = (p.eq||p.equipo||"").toLowerCase();
      const l = (p.l||p.liga||p.liga_nombre||"").toLowerCase();
      if (!n.includes(q) && !e.includes(q) && !l.includes(q)) return false;
    }
    return true;
  });

  const regiones = [...new Set(realPlayers.map(p=>p.pa||p.region).filter(Boolean))].sort();

  function toggleJugador(j) {
    const norm = normalizar(j);
    const yaEsta = seleccionados.find(s=>s.id===norm.id);
    if (yaEsta) {
      setSelec(prev=>prev.filter(s=>s.id!==norm.id));
    } else if (seleccionados.length < 4) {
      setSelec(prev=>[...prev,norm]);
    }
  }

  function normalizar(j) {
    return {
      id:          j.id,
      nombre:      j.n    || j.nombre    || "—",
      edad:        j.e    || j.edad,
      foto:        j.foto || j.photo     || "",
      posicion:    j.pos  || j.posicion  || posicion,
      equipo:      j.eq   || j.equipo    || "—",
      liga:        j.l    || j.liga      || j.liga_nombre || "—",
      liga_nombre: j.l    || j.liga_nombre || "—",
      region:      j.pa   || j.region    || "—",
      nivel:       j.nv   || j.nivel     || 1,
      pais:        j.pa   || j.pais      || "",
      stats: {
        partidos:       j.pts || j.stats?.partidos,
        minutos:        j.min || j.stats?.minutos,
        rating:         j.stats?.rating,
        goles:          j.g   || j.stats?.goles,
        asistencias:    j.a   || j.stats?.asistencias,
        disparos_total: j.stats?.disparos_total,
        disparos_arco:  j.stats?.disparos_arco,
        pases_total:    j.stats?.pases_total,
        pases_clave:    j.stats?.pases_clave,
        regates_exito:  j.stats?.regates_exito,
        tackles:        j.stats?.tackles,
        intercepciones: j.stats?.intercepciones,
        duelos_ganados: j.stats?.duelos_ganados,
        atajadas:       j.stats?.atajadas,
        amarillas:      j.stats?.amarillas,
      }
    };
  }

  async function analizarConIA() {
    if (seleccionados.length < 2) return;
    setLoading(true); setIaAnalysis("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1200,
          messages:[{role:"user",content:`Eres un scout profesional de élite. Compara estos ${seleccionados.length} ${posicion}es para ayudar a un DT a tomar una decisión de fichaje:

${seleccionados.map((j,i)=>`JUGADOR ${i+1}: ${j.nombre}
  Equipo: ${j.equipo} | Liga: ${j.liga} | Edad: ${j.edad||"—"} | País: ${j.pais||"—"}
  Partidos: ${j.stats.partidos||"—"} | Minutos: ${j.stats.minutos||"—"}' | Rating: ${j.stats.rating||"—"}
  Goles: ${j.stats.goles||0} | Asistencias: ${j.stats.asistencias||0}
  Pases totales: ${j.stats.pases_total||"—"} | Pases clave: ${j.stats.pases_clave||"—"}
  Tackles: ${j.stats.tackles||"—"} | Regates: ${j.stats.regates_exito||"—"}
  Nivel liga: ${j.nivel===1?"Primera División":j.nivel===2?"Segunda División":j.nivel===3?"Copa/Regional":"—"}`).join("\n\n")}

Genera análisis scout profesional en 4 secciones:
1. RESUMEN EJECUTIVO (quién destaca y por qué)
2. COMPARATIVA ESTADÍSTICA (quién gana en cada dimensión con datos)
3. PERFIL DE CADA JUGADOR (fortalezas y debilidades individuales)
4. RECOMENDACIÓN FINAL (para qué tipo de equipo es mejor cada uno y cuál fichar)`
        }]})
      });
      const d = await r.json();
      setIaAnalysis(d.content?.[0]?.text || "Error al generar análisis.");
    } catch { setIaAnalysis("Error de conexión con IA."); }
    setLoading(false);
  }

  const isSelected = (j) => seleccionados.find(s=>s.id===j.id);

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:22}}>
        <div style={{fontWeight:800,color:"#eef2f6",fontSize:20,letterSpacing:"-0.5px",marginBottom:4}}>
          ⚖️ Comparador Scout Mundial
        </div>
        <div style={{color:"#4a6070",fontSize:13}}>
          Compare hasta 4 jugadores profesionales del mismo puesto de cualquier liga del mundo · Genera PDF para enviar a su club
        </div>
      </div>

      {/* Filtros */}
      <div style={{...S.card,marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 80px 80px",gap:10,alignItems:"end"}}>
          <div>
            <div style={{color:"#4a6070",fontSize:11,fontWeight:600,marginBottom:5,letterSpacing:.5}}>POSICIÓN</div>
            <select style={S.input} value={posicion} onChange={e=>{setPosicion(e.target.value);setSelec([]);setBusqueda("");}}>
              {POSICIONES.map(p=><option key={p} value={p}>{CONFIG_POS[p].icon} {p}</option>)}
            </select>
          </div>
          <div>
            <div style={{color:"#4a6070",fontSize:11,fontWeight:600,marginBottom:5,letterSpacing:.5}}>BUSCAR</div>
            <input style={S.input} placeholder="Nombre, equipo o liga..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}/>
          </div>
          <div>
            <div style={{color:"#4a6070",fontSize:11,fontWeight:600,marginBottom:5,letterSpacing:.5}}>REGIÓN / LIGA</div>
            <select style={S.input} value={filtRegion} onChange={e=>setFiltRegion(e.target.value)}>
              <option value="">Todas las regiones</option>
              {regiones.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <div style={{color:"#4a6070",fontSize:11,fontWeight:600,marginBottom:5,letterSpacing:.5}}>EDAD MÍN</div>
              <input style={S.input} type="number" placeholder="16" value={filtEdadMin} onChange={e=>setFiltEdadMin(e.target.value)} min="15" max="45"/>
            </div>
            <div>
              <div style={{color:"#4a6070",fontSize:11,fontWeight:600,marginBottom:5,letterSpacing:.5}}>EDAD MÁX</div>
              <input style={S.input} type="number" placeholder="40" value={filtEdadMax} onChange={e=>setFiltEdadMax(e.target.value)} min="15" max="45"/>
            </div>
          </div>
          <div style={{gridColumn:"span 2",display:"flex",gap:8}}>
            <div style={{background:"rgba(0,232,122,0.08)",border:"1px solid rgba(0,232,122,0.2)",borderRadius:9,padding:"8px 12px",fontSize:12,color:"#00e87a",fontWeight:600,textAlign:"center",flex:1}}>
              {filtrados.length} jugadores
            </div>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:16}}>

        {/* Lista de jugadores */}
        <div>
          <div style={{color:"#4a6070",fontSize:11,fontWeight:600,marginBottom:10,letterSpacing:.5}}>
            SELECCIONE HASTA 4 JUGADORES PARA COMPARAR
          </div>
          {filtrados.length===0 && (
            <div style={{...S.card,textAlign:"center",padding:32,color:"#4a6070"}}>
              <div style={{fontSize:32,marginBottom:8}}>🔍</div>
              {realPlayers.length===0
                ? "Cargue primero los datos de la API en el módulo de Benchmarks"
                : "Sin resultados para los filtros seleccionados"}
            </div>
          )}
          <div style={{maxHeight:520,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
            {filtrados.slice(0,80).map(j=>{
              const norm   = normalizar(j);
              const sel    = isSelected(j);
              const selIdx = seleccionados.findIndex(s=>s.id===j.id);
              const selColor = selIdx>=0 ? COLORS[selIdx] : null;
              return (
                <div key={j.id} onClick={()=>toggleJugador(j)}
                  style={{background:sel?`${selColor}12`:"rgba(255,255,255,0.03)",borderRadius:10,border:`1px solid ${sel?selColor+"44":"rgba(255,255,255,0.07)"}`,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}
                  onMouseEnter={e=>{if(!sel)e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
                  onMouseLeave={e=>{if(!sel)e.currentTarget.style.background="rgba(255,255,255,0.03)";}}>

                  {/* Foto o ícono */}
                  {norm.foto ? (
                    <img src={norm.foto} alt={norm.nombre} style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`1px solid ${config.color}33`}} onError={e=>e.target.style.display="none"}/>
                  ) : (
                    <div style={{width:36,height:36,borderRadius:"50%",background:`${config.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{config.icon}</div>
                  )}

                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,color:sel?selColor:"#eef2f6",fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{norm.nombre}</div>
                    <div style={{color:"#4a6070",fontSize:11,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{norm.equipo} · {norm.liga}</div>
                  </div>

                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    {norm.edad && <span style={{fontSize:11,color:"#4a6070"}}>{norm.edad}a</span>}
                    {norm.stats.rating && <span style={{background:config.color+"20",color:config.color,borderRadius:5,padding:"2px 7px",fontSize:11,fontWeight:700}}>★{norm.stats.rating}</span>}
                    {norm.stats.goles>0 && <span style={{color:"#4a6070",fontSize:11}}>{norm.stats.goles}⚽</span>}
                    {sel && <div style={{width:22,height:22,borderRadius:"50%",background:selColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#000"}}>{selIdx+1}</div>}
                  </div>
                </div>
              );
            })}
            {filtrados.length>80 && <div style={{textAlign:"center",color:"#4a6070",fontSize:12,padding:8}}>Mostrando 80 de {filtrados.length} — refine los filtros</div>}
          </div>
        </div>

        {/* Panel de comparación */}
        <div>
          <div style={{color:"#4a6070",fontSize:11,fontWeight:600,marginBottom:10,letterSpacing:.5}}>
            COMPARACIÓN ({seleccionados.length}/4 seleccionados)
          </div>

          {seleccionados.length===0 && (
            <div style={{...S.card,textAlign:"center",padding:40,color:"#4a6070"}}>
              <div style={{fontSize:40,marginBottom:10}}>⚖️</div>
              Seleccione jugadores de la lista para comenzar la comparación
            </div>
          )}

          {seleccionados.length>0 && (
            <div>
              {/* Cards de seleccionados */}
              <div style={{display:"grid",gridTemplateColumns:`repeat(${seleccionados.length},1fr)`,gap:8,marginBottom:14}}>
                {seleccionados.map((j,i)=>(
                  <div key={j.id} style={{background:`${COLORS[i]}10`,border:`1px solid ${COLORS[i]}33`,borderRadius:12,padding:12,textAlign:"center",position:"relative"}}>
                    <button onClick={()=>setSelec(prev=>prev.filter(s=>s.id!==j.id))} style={{position:"absolute",top:6,right:6,background:"none",border:"none",color:"#ef444455",cursor:"pointer",fontSize:14,padding:0}}>✕</button>
                    {j.foto ? (
                      <img src={j.foto} alt={j.nombre} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:`2px solid ${COLORS[i]}`,marginBottom:6}} onError={e=>e.target.style.display="none"}/>
                    ) : (
                      <div style={{width:44,height:44,borderRadius:"50%",background:`${COLORS[i]}20`,border:`2px solid ${COLORS[i]}`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:6}}>{config.icon}</div>
                    )}
                    <div style={{fontWeight:700,color:"#eef2f6",fontSize:12,lineHeight:1.3}}>{j.nombre}</div>
                    <div style={{color:"#4a6070",fontSize:10,marginTop:2}}>{j.equipo}</div>
                    <div style={{color:COLORS[i],fontSize:10,marginTop:1}}>{j.liga}</div>
                    {j.edad && <div style={{fontSize:10,color:"#4a6070",marginTop:2}}>{j.edad} años</div>}
                  </div>
                ))}
              </div>

              {/* Tabla de estadísticas */}
              <div style={{...S.card,marginBottom:14,overflow:"hidden",padding:0}}>
                <div style={{background:"rgba(255,255,255,0.05)",padding:"8px 14px",fontSize:11,fontWeight:600,color:"#4a6070",letterSpacing:.5,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                  ESTADÍSTICAS COMPARATIVAS · ★ = Mejor
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr>
                        <th style={{padding:"7px 12px",fontSize:11,color:"#4a6070",textAlign:"left",fontWeight:600}}>Estadística</th>
                        {seleccionados.map((j,i)=>(
                          <th key={i} style={{padding:"7px 12px",fontSize:11,color:COLORS[i],textAlign:"center",fontWeight:700}}>{j.nombre.split(" ")[0]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {config.stats.map(st=>{
                        const vals = seleccionados.map(j=>j.stats?.[st.k]);
                        const nums = vals.map(v=>parseFloat(v)||0);
                        const max  = Math.max(...nums);
                        return (
                          <tr key={st.k} style={{borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                            <td style={{padding:"7px 12px",fontSize:12,color:"#94a3b8"}}>{st.l}</td>
                            {vals.map((v,i)=>{
                              const n   = parseFloat(v)||0;
                              const best= n===max&&max>0&&!st.neg;
                              return <td key={i} style={{padding:"7px 12px",fontSize:13,fontWeight:best?800:500,color:best?COLORS[i]:"#64748b",textAlign:"center"}}>{v??'—'}{best?" ★":""}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                <button onClick={analizarConIA} disabled={loading||seleccionados.length<2} style={{flex:1,border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:700,cursor:loading||seleccionados.length<2?"not-allowed":"pointer",fontSize:13,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",opacity:seleccionados.length<2?0.4:1}}>
                  {loading?"⏳ Analizando...":"🤖 Análisis Scout IA"}
                </button>
                <button onClick={()=>generarPDFComparacion(seleccionados,posicion)} style={{flex:1,border:"none",borderRadius:10,padding:"11px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:13,background:"linear-gradient(135deg,#00e87a,#00c96a)",fontFamily:"inherit"}}>
                  📄 Exportar PDF
                </button>
              </div>

              {/* Análisis IA */}
              {iaAnalysis && (
                <div style={{...S.card,borderColor:"rgba(139,92,246,0.25)",background:"rgba(139,92,246,0.05)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <span style={{color:"#eef2f6",fontWeight:600,fontSize:13}}>🤖 Análisis Scout IA</span>
                    <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:700}}>FichaScout PRO</span>
                  </div>
                  <div style={{color:"#94a3b8",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{iaAnalysis}</div>
                  <button onClick={()=>setIaAnalysis("")} style={{marginTop:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 14px",color:"#4a6070",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>↻ Regenerar</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

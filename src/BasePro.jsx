import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const G = "#00e87a";
const SLOTS = ["#00e87a","#3b82f6","#f59e0b","#ec4899"];

const POS_ICON  = {"Arquero":"🧤","Defensor":"🛡️","Volante":"🎨","Delantero":"🎯"};
const POS_COLOR = {"Arquero":"#f59e0b","Defensor":"#3b82f6","Volante":"#10b981","Delantero":"#ef4444"};

const STATS_DEF = [
  {k:"rat",l:"Rating",      max:10,  dec:true},
  {k:"g",  l:"Goles",       max:40},
  {k:"a",  l:"Asistencias", max:25},
  {k:"pts",l:"Partidos",    max:38},
  {k:"min",l:"Minutos",     max:3400},
  {k:"pas",l:"Pases totales",max:2000},
  {k:"pc", l:"Pases clave", max:100},
  {k:"dis",l:"Disparos arco",max:80},
  {k:"reg",l:"Regates",     max:80},
  {k:"tac",l:"Tackles",     max:100},
  {k:"int",l:"Intercepciones",max:80},
  {k:"due",l:"Duelos ganados",max:200},
  {k:"ata",l:"Atajadas",    max:120},
  {k:"am", l:"Amarillas",   max:12, neg:true},
];

// Stats relevantes por posición
const STATS_POS = {
  "Arquero":   ["rat","pts","min","ata","pas","am"],
  "Defensor":  ["rat","pts","min","tac","int","due","pas","g","am"],
  "Volante":   ["rat","pts","min","g","a","pas","pc","tac","int","due"],
  "Delantero": ["rat","pts","min","g","a","dis","reg","due","pas"],
};

const API_HEADERS = {
  "Content-Type":"application/json",
  "anthropic-dangerous-direct-browser-access":"true"
};

const IN = {background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:9,padding:"8px 12px",color:"#eef2f6",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};

// ─── PROMPT IA SCOUT ─────────────────────────────────────────────────────────
function promptIndividual(j) {
  const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);
  const statsStr = statsKeys.map(k=>{
    const def = STATS_DEF.find(s=>s.k===k);
    const v = j.s?.[k];
    if(v==null) return null;
    return `${def?.l||k}: ${v}${def?.dec?"":""}`
  }).filter(Boolean).join(" | ");

  return `Eres un Chief Scout de alto nivel con 20 años de experiencia en fútbol profesional sudamericano y europeo. Analiza este jugador de forma crítica y profesional:

━━━ DATOS DEL JUGADOR ━━━
Nombre: ${j.n}
Posición: ${j.pos}
Edad: ${j.e||"—"} años | País: ${j.pais||"—"} | Altura: ${j.alt||"—"} | Peso: ${j.pes||"—"}
Club: ${j.eq} | Liga: ${j.l} | Región: ${j.reg}
Nivel competitivo: ${j.nv===1?"1ª División (máximo nivel)":j.nv===2?"2ª División":j.nv===3?"Copa/Regional":"—"}

━━━ ESTADÍSTICAS TEMPORADA 2024 ━━━
${statsStr || "Sin estadísticas disponibles"}

Genera un informe scout profesional estructurado así:

🔍 PERFIL DE JUEGO
(Describe su estilo, rol dentro del equipo y características técnicas principales)

📈 FORTALEZAS DESTACADAS
(Mínimo 3 puntos fuertes respaldados con los datos estadísticos específicos)

⚠️ ÁREAS A DESARROLLAR
(Puntos débiles honestos con datos)

🏆 NIVEL COMPETITIVO Y PROYECCIÓN
(¿A qué nivel puede llegar? ¿Está en la etapa ideal de su carrera? ¿Tiene margen de mejora?)

🎯 PERFIL DE EQUIPO IDEAL
(Describe el sistema táctico y tipo de club que maximizaría sus virtudes)

⭐ VALORACIÓN FINAL: [X/10]
(Justificación breve y recomendación de fichaje: PRIORITARIO / RECOMENDADO / SEGUIMIENTO / NO RECOMENDADO)`;
}

function promptComparacion(jugadores) {
  const ficha = (j) => {
    const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);
    return `${j.n} (${j.pos}, ${j.e||"—"}a, ${j.pais||"—"})
  Club: ${j.eq} | ${j.l} | Nivel ${j.nv}
  ${statsKeys.map(k=>{const def=STATS_DEF.find(s=>s.k===k);const v=j.s?.[k];return v!=null?`${def?.l||k}:${v}`:null}).filter(Boolean).join(" | ")}`;
  };

  return `Eres un Director Técnico con experiencia en fichajes internacionales. Analiza estos ${jugadores.length} jugadores para una decisión de fichaje:

${jugadores.map((j,i)=>`OPCIÓN ${i+1}: ${ficha(j)}`).join("\n\n")}

Genera el análisis comparativo profesional:

📊 RESUMEN EJECUTIVO
(En 3 líneas: quién destaca y cuál es la decisión recomendada)

⚖️ COMPARATIVA ESTADÍSTICA DETALLADA
(Para cada estadística clave: quién lidera, cuánto lo diferencia del resto, qué significa tácticamente)

👤 PERFIL INDIVIDUAL
${jugadores.map((_,i)=>`Opción ${i+1}: fortalezas únicas y limitaciones principales`).join("\n")}

🔄 COMPATIBILIDAD TÁCTICA
(Para qué sistema de juego es ideal cada uno: 4-3-3, 4-4-2, presión alta, bloque bajo, etc.)

💰 RELACIÓN VALOR/RENDIMIENTO
(Considerando liga de origen y nivel competitivo, ¿cuál ofrece mejor valor de mercado?)

🏆 RECOMENDACIÓN FINAL DE FICHAJE
(Ranking de preferencia con justificación clara: 1º, 2º, 3º...)
¿Para qué tipo de club es cada uno? ¿Cuál ficharías si solo pudieras elegir uno?`;
}

// ─── PDF INDIVIDUAL ───────────────────────────────────────────────────────────
function exportPDFIndividual(j, iaText) {
  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const c = POS_COLOR[j.pos] || G;
  const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);

  const barRow = (k) => {
    const def = STATS_DEF.find(s=>s.k===k);
    if(!def||j.s?.[k]==null) return "";
    const v = parseFloat(j.s[k])||0;
    const pct = Math.min((v/(def.max||100))*100,100);
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">
      <span style="font-size:11px;color:#374151;min-width:120px">${def.l}</span>
      <div style="flex:1;height:5px;background:#e2e8f0;border-radius:3px">
        <div style="width:${pct}%;height:100%;background:${c};border-radius:3px"></div>
      </div>
      <span style="font-size:12px;font-weight:700;color:${c};min-width:32px;text-align:right">${j.s[k]}</span>
    </div>`;
  };

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>FichaScout — ${j.n}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#fff;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:13px}
  @page{size:A4;margin:14mm}
</style></head>
<body>

<!-- HEADER -->
<div style="background:linear-gradient(135deg,#040a0f,#071520);padding:20px 28px;display:flex;justify-content:space-between;align-items:center;border-radius:10px;margin-bottom:18px">
  <div style="display:flex;align-items:center;gap:12px">
    <div style="width:44px;height:44px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px">⚽</div>
    <div>
      <div style="font-weight:800;font-size:21px;color:#fff">Ficha<span style="color:#00e87a">Scout</span></div>
      <div style="font-size:9px;color:#3a5060;letter-spacing:2px">PLATAFORMA DE SCOUTING PROFESIONAL</div>
    </div>
  </div>
  <div style="text-align:right">
    <div style="color:#fff;font-weight:800;font-size:14px">FICHA DE SCOUTING PROFESIONAL</div>
    <div style="color:#3a5060;font-size:10px;margin-top:2px">${fecha} · fichascout.com</div>
  </div>
</div>

<!-- JUGADOR -->
<div style="display:flex;gap:20px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${c};border-radius:12px;padding:18px 20px;margin-bottom:18px">
  <div style="width:88px;height:88px;border-radius:50%;overflow:hidden;border:3px solid ${c}55;flex-shrink:0">
    <img src="${j.foto}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:36px>${POS_ICON[j.pos]||"⚽"}</div>'"/>
  </div>
  <div style="flex:1">
    <div style="display:inline-block;background:${c}15;color:${c};border:1px solid ${c}44;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;margin-bottom:6px">${POS_ICON[j.pos]||""} ${j.pos}</div>
    <div style="font-weight:800;font-size:24px;color:#0f172a;margin-bottom:4px;line-height:1">${j.n}</div>
    <div style="font-size:13px;color:#64748b;margin-bottom:10px">${j.eq} · ${j.l} · ${j.reg}${j.nv===1?" · 1ª División":j.nv===2?" · 2ª División":""}</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${[["Edad",j.e?`${j.e} años`:"—"],["País",j.pais||"—"],["Altura",j.alt||"—"],["Peso",j.pes||"—"]].map(([l,v])=>`
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:7px 12px;text-align:center;min-width:68px">
        <div style="font-size:14px;font-weight:800;color:#0f172a">${v}</div>
        <div style="font-size:9px;color:#94a3b8;margin-top:1px">${l}</div>
      </div>`).join("")}
      ${j.s?.rat?`<div style="background:${c}10;border:1px solid ${c}44;border-radius:8px;padding:7px 12px;text-align:center">
        <div style="font-size:18px;font-weight:800;color:${parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#dc2626"}">★ ${j.s.rat}</div>
        <div style="font-size:9px;color:#94a3b8;margin-top:1px">Rating</div>
      </div>`:""}
    </div>
  </div>
  <div style="text-align:center;padding:12px;background:${c}08;border-radius:10px;border:1px solid ${c}20">
    <img src="${j.eq_logo||""}" style="width:44px;height:44px;object-fit:contain;margin-bottom:6px" onerror="this.style.display='none'"/>
    <div style="font-weight:700;font-size:12px;color:#0f172a">${j.eq}</div>
    <div style="font-size:10px;color:#64748b">Nivel ${j.nv}</div>
  </div>
</div>

<!-- ESTADÍSTICAS + IA -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
  <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
    <div style="background:#f1f5f9;padding:9px 14px;font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px;border-bottom:1px solid #e2e8f0">ESTADÍSTICAS DE TEMPORADA</div>
    <div style="padding:14px">${statsKeys.map(k=>barRow(k)).join("")}</div>
  </div>
  <div>
    <div style="background:${c}08;border:1px solid ${c}25;border-radius:10px;padding:14px;margin-bottom:12px">
      <div style="font-size:10px;font-weight:700;color:${c};letter-spacing:.5px;margin-bottom:10px">CONTRIBUCIÓN TOTAL</div>
      <div style="display:flex;gap:14px;justify-content:space-around">
        ${[["⚽",j.s?.g??0,"Goles"],["🅰️",j.s?.a??0,"Asist."],["⏱️",j.s?.pts??0,"Partidos"],["🕐",(j.s?.min||0)+"'","Minutos"]].map(([ic,v,l])=>`
        <div style="text-align:center">
          <div style="font-size:11px;margin-bottom:2px">${ic}</div>
          <div style="font-size:19px;font-weight:800;color:#0f172a">${v}</div>
          <div style="font-size:9px;color:#94a3b8">${l}</div>
        </div>`).join("")}
      </div>
    </div>
    ${j.s?.tac!=null?`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px">
      <div style="font-size:10px;font-weight:700;color:#374151;letter-spacing:.5px;margin-bottom:8px">DATOS DEFENSIVOS</div>
      ${[["Tackles",j.s?.tac],["Intercepciones",j.s?.int],["Duelos ganados",j.s?.due]].map(([l,v])=>v!=null?`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f1f5f9;font-size:12px"><span style="color:#374151">${l}</span><span style="font-weight:700;color:${c}">${v}</span></div>`:"").join("")}
    </div>`:""} 
  </div>
</div>

${iaText?`
<!-- ANÁLISIS IA -->
<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px;margin-bottom:16px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
    <div style="font-size:11px;font-weight:700;color:#166534;letter-spacing:.5px">ANÁLISIS SCOUT CON INTELIGENCIA ARTIFICIAL</div>
    <span style="background:#00a85515;color:#00a855;border-radius:5px;padding:2px 9px;font-size:10px;font-weight:700">🤖 FichaScout PRO</span>
  </div>
  <div style="font-size:11.5px;color:#166534;line-height:1.8;white-space:pre-wrap">${iaText.substring(0,2000)}${iaText.length>2000?"...":""}</div>
</div>`:""}

<!-- FOOTER -->
<div style="background:#040a0f;border-radius:8px;padding:12px 20px;display:flex;justify-content:space-between;align-items:center">
  <div style="display:flex;align-items:center;gap:8px">
    <div style="width:20px;height:20px;background:#00e87a;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px">⚽</div>
    <span style="color:#00e87a;font-weight:800;font-size:13px">FichaScout</span>
    <span style="color:#3a5060;font-size:10px">· fichascout.com</span>
  </div>
  <span style="color:#3a5060;font-size:10px">Informe generado con Inteligencia Artificial</span>
  <span style="background:#fef3c7;color:#92400e;padding:3px 9px;border-radius:4px;font-size:10px;font-weight:700">🔒 CONFIDENCIAL</span>
</div>

</body></html>`;

  const v=window.open("","_blank","width=900,height=700");
  v.document.write(html); v.document.close(); v.focus();
  setTimeout(()=>v.print(),900);
}

// ─── PDF COMPARACIÓN ──────────────────────────────────────────────────────────
function exportPDFComparacion(jugadores, iaText) {
  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const cols = SLOTS.slice(0,jugadores.length);

  const statsRelevantes = jugadores.length>0
    ? (STATS_POS[jugadores[0].pos] || STATS_DEF.map(s=>s.k)).filter(k=>jugadores.some(j=>j.s?.[k]!=null))
    : STATS_DEF.filter(st=>jugadores.some(j=>j.s?.[st.k]!=null)).map(s=>s.k);

  const playerCard = (j,i) => `
    <div style="background:#f8fafc;border:2px solid ${cols[i]}33;border-radius:12px;padding:16px;text-align:center">
      <div style="width:68px;height:68px;border-radius:50%;overflow:hidden;margin:0 auto 9px;border:2px solid ${cols[i]}">
        <img src="${j.foto}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=padding:10px;font-size:28px>${POS_ICON[j.pos]||"⚽"}</div>'"/>
      </div>
      <div style="font-weight:800;font-size:14px;color:#0f172a;margin-bottom:2px">${j.n}</div>
      <div style="font-size:11px;color:#64748b;margin-bottom:2px">${j.eq}</div>
      <div style="font-size:10px;color:#94a3b8;margin-bottom:8px">${j.l}</div>
      <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap">
        ${j.e?`<span style="background:#f1f5f9;color:#374151;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:600">${j.e}a</span>`:""}
        <span style="background:${cols[i]}15;color:${cols[i]};border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700">${POS_ICON[j.pos]||""} ${j.pos}</span>
      </div>
      ${j.s?.rat?`<div style="font-size:20px;font-weight:800;color:${parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#dc2626"};margin-top:7px">★ ${j.s.rat}</div>`:""}
    </div>`;

  const statRow = (k) => {
    const def = STATS_DEF.find(s=>s.k===k);
    if(!def) return "";
    const vals = jugadores.map(j=>parseFloat(j.s?.[k])||0);
    const max = Math.max(...vals);
    return `<tr>
      <td style="padding:7px 12px;font-size:11px;color:#374151;font-weight:500;border-bottom:1px solid #f1f5f9;white-space:nowrap">${def.l}</td>
      ${jugadores.map((j,i)=>{
        const v=j.s?.[k]; const n=parseFloat(v)||0;
        const pct=def.max?Math.min((n/def.max)*100,100):(max>0?Math.min((n/max)*100,100):0);
        const best=n===max&&max>0&&!def.neg;
        return `<td style="padding:7px 12px;border-bottom:1px solid #f1f5f9;min-width:120px">
          <div style="display:flex;align-items:center;gap:7px">
            <div style="flex:1;height:4px;background:#e2e8f0;border-radius:2px">
              <div style="width:${pct}%;height:100%;background:${best?cols[i]:"#cbd5e1"};border-radius:2px"></div>
            </div>
            <span style="font-size:12px;font-weight:${best?800:500};color:${best?cols[i]:"#374151"};min-width:28px;text-align:right">${v??'—'}</span>
          </div>
          ${best?`<div style="font-size:9px;color:${cols[i]};font-weight:700;margin-top:1px">▲ MEJOR</div>`:""}
        </td>`;
      }).join("")}
    </tr>`;
  };

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/>
<title>FichaScout — Comparación</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4 landscape;margin:11mm}</style>
</head><body>
<div style="background:linear-gradient(135deg,#040a0f,#071520);padding:16px 24px;display:flex;justify-content:space-between;align-items:center;border-radius:10px;margin-bottom:14px">
  <div style="display:flex;align-items:center;gap:10px">
    <div style="width:38px;height:38px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:19px">⚽</div>
    <div><div style="font-weight:800;font-size:18px;color:#fff">Ficha<span style="color:#00e87a">Scout</span></div><div style="font-size:8px;color:#3a5060;letter-spacing:2px">PLATAFORMA DE SCOUTING PROFESIONAL</div></div>
  </div>
  <div style="text-align:right"><div style="color:#fff;font-weight:800;font-size:14px">INFORME COMPARATIVO DE JUGADORES</div><div style="color:#3a5060;font-size:10px;margin-top:1px">${jugadores.length} jugadores · ${fecha} · fichascout.com</div></div>
</div>

<div style="display:grid;grid-template-columns:repeat(${jugadores.length},1fr);gap:10px;margin-bottom:14px">
  ${jugadores.map((j,i)=>playerCard(j,i)).join("")}
</div>

<div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:14px">
  <div style="background:#f8fafc;padding:8px 14px;border-bottom:2px solid #e2e8f0;font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px">ESTADÍSTICAS COMPARATIVAS · ▲ MEJOR = Líder en la categoría</div>
  <table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:#f8fafc">
      <th style="padding:7px 12px;font-size:10px;color:#94a3b8;text-align:left;border-bottom:1px solid #e2e8f0;font-weight:600">ESTADÍSTICA</th>
      ${jugadores.map((j,i)=>`<th style="padding:7px 12px;font-size:12px;font-weight:700;color:${cols[i]};text-align:left;border-bottom:2px solid ${cols[i]};min-width:120px">${j.n.split(" ")[0].toUpperCase()}</th>`).join("")}
    </tr></thead>
    <tbody>${statsRelevantes.map(k=>statRow(k)).join("")}</tbody>
  </table>
</div>

${iaText?`<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px;margin-bottom:12px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
    <div style="font-size:11px;font-weight:700;color:#166534;letter-spacing:.5px">ANÁLISIS DE COMPARACIÓN — FichaScout IA</div>
    <span style="background:#00a85515;color:#00a855;border-radius:5px;padding:2px 8px;font-size:10px;font-weight:700">🤖 Scout IA</span>
  </div>
  <div style="font-size:11px;color:#166534;line-height:1.75;white-space:pre-wrap">${iaText.substring(0,2500)}${iaText.length>2500?"...":""}</div>
</div>`:""}

<div style="background:#040a0f;border-radius:8px;padding:11px 18px;display:flex;justify-content:space-between;align-items:center">
  <div style="display:flex;align-items:center;gap:7px"><div style="width:18px;height:18px;background:#00e87a;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px">⚽</div><span style="color:#00e87a;font-weight:800;font-size:12px">FichaScout</span></div>
  <span style="color:#3a5060;font-size:10px">Análisis generado con Inteligencia Artificial · fichascout.com</span>
  <span style="background:#fef3c7;color:#92400e;padding:3px 9px;border-radius:4px;font-size:10px;font-weight:700">🔒 CONFIDENCIAL</span>
</div>
</body></html>`;

  const v=window.open("","_blank","width=1200,height=800");
  v.document.write(html); v.document.close(); v.focus();
  setTimeout(()=>v.print(),900);
}

// ─── MODAL JUGADOR ────────────────────────────────────────────────────────────
function ModalJugador({j, onClose, onToggleCompar, enCompar}) {
  const [iaText, setIaText] = useState("");
  const [loadIA, setLoadIA] = useState(false);
  const c = POS_COLOR[j.pos] || G;

  async function generarIA() {
    setLoadIA(true); setIaText("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers: API_HEADERS,
        body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:1200, messages:[{role:"user",content:promptIndividual(j)}]})
      });
      const d = await r.json();
      setIaText(d.content?.[0]?.text || "Error al generar el análisis.");
    } catch(e) {
      setIaText("Error de conexión con el servidor de IA.");
    }
    setLoadIA(false);
  }

  const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#07111a",borderRadius:18,border:"1px solid rgba(255,255,255,0.09)",width:"100%",maxWidth:740,maxHeight:"92vh",overflowY:"auto"}}>

        {/* Header */}
        <div style={{background:`${c}0a`,padding:"18px 22px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:14,alignItems:"center",position:"sticky",top:0,backdropFilter:"blur(20px)",zIndex:1,borderRadius:"18px 18px 0 0"}}>
          <div style={{width:60,height:60,borderRadius:50,overflow:"hidden",border:`2px solid ${c}44`,flexShrink:0}}>
            <img src={j.foto} alt={j.n} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.parentElement.innerHTML=`<div style="width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:26px">${POS_ICON[j.pos]||"⚽"}</div>`;}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"inline-block",background:`${c}15`,color:c,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,marginBottom:4}}>{POS_ICON[j.pos]} {j.pos}</div>
            <div style={{fontWeight:800,fontSize:19,color:"#eef2f6",lineHeight:1.2}}>{j.n}</div>
            <div style={{color:"#4a6070",fontSize:12,marginTop:2}}>{j.eq} · {j.l}{j.e?` · ${j.e} años`:""} · {j.pais||""}</div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>onToggleCompar(j)} style={{background:enCompar?`${c}20`:"rgba(255,255,255,0.06)",border:`1px solid ${enCompar?c+"44":"rgba(255,255,255,0.1)"}`,borderRadius:9,padding:"7px 13px",color:enCompar?c:"#eef2f6",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
              {enCompar?"✓ En comparación":"⚖️ Comparar"}
            </button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#4a6070",cursor:"pointer",fontSize:22,padding:0}}>✕</button>
          </div>
        </div>

        <div style={{padding:"16px 22px"}}>
          {/* Stats grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
            {[
              j.s?.rat!=null&&["★",j.s.rat,"Rating",parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#ef4444"],
              j.s?.g!=null&&["⚽",j.s.g,"Goles",c],
              j.s?.a!=null&&["🅰️",j.s.a,"Asistencias",c],
              j.s?.pts!=null&&["📅",j.s.pts,"Partidos","#64748b"],
              j.s?.min!=null&&["⏱️",j.s.min+"'","Minutos","#64748b"],
              j.s?.pas!=null&&["📊",j.s.pas,"Pases","#64748b"],
              j.s?.tac!=null&&["🛡️",j.s.tac,"Tackles","#64748b"],
              j.s?.ata!=null&&["🧤",j.s.ata,"Atajadas","#64748b"],
            ].filter(Boolean).slice(0,8).map(([ico,v,l,col])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"9px 11px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:12,marginBottom:2}}>{ico}</div>
                <div style={{fontWeight:800,fontSize:16,color:col}}>{v}</div>
                <div style={{fontSize:10,color:"#4a6070",marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Barras */}
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{color:"#4a6070",fontSize:11,fontWeight:600,letterSpacing:.5,marginBottom:9}}>ESTADÍSTICAS DE TEMPORADA</div>
            {statsKeys.filter(k=>j.s?.[k]!=null).map(k=>{
              const def = STATS_DEF.find(s=>s.k===k);
              if(!def) return null;
              const v = parseFloat(j.s[k])||0;
              const pct = Math.min((v/(def.max||100))*100,100);
              return(
                <div key={k} style={{display:"grid",gridTemplateColumns:"110px 1fr 40px",gap:8,alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:12,color:"#64748b"}}>{def.l}</div>
                  <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                    <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:c,textAlign:"right"}}>{j.s[k]}</div>
                </div>
              );
            })}
          </div>

          {/* IA */}
          {!iaText?(
            <button onClick={generarIA} disabled={loadIA} style={{width:"100%",border:"none",borderRadius:11,padding:"12px",color:"#fff",fontWeight:700,cursor:loadIA?"wait":"pointer",fontSize:14,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loadIA?<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando como scout profesional...</>:"🤖 Análisis Scout IA Profesional"}
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </button>
          ):(
            <div style={{background:"rgba(139,92,246,0.07)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>🤖 Análisis Scout IA Profesional</span>
                <div style={{display:"flex",gap:8}}>
                  <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700}}>FichaScout PRO</span>
                  <button onClick={()=>setIaText("")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"3px 10px",color:"#4a6070",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↻</button>
                </div>
              </div>
              <div style={{color:"#c4b5fd",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{iaText}</div>
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>exportPDFIndividual(j,iaText)} style={{border:"none",borderRadius:10,padding:"11px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:13,background:`linear-gradient(135deg,${G},#00c96a)`,fontFamily:"inherit"}}>📄 PDF Individual</button>
            <button onClick={()=>onToggleCompar(j)} style={{border:`1px solid ${enCompar?"rgba(0,232,122,.4)":"rgba(255,255,255,.1)"}`,borderRadius:10,padding:"11px",color:enCompar?G:"#eef2f6",fontWeight:700,cursor:"pointer",fontSize:13,background:enCompar?"rgba(0,232,122,.1)":"transparent",fontFamily:"inherit"}}>
              ⚖️ {enCompar?"Quitar comparación":"Agregar a comparación"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────────────────
export default function BasePro() {
  const [db,        setDb]        = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  const [region,    setRegion]    = useState("");
  const [ligaId,    setLigaId]    = useState("");
  const [equipo,    setEquipo]    = useState("");
  const [posicion,  setPosicion]  = useState("");
  const [busqueda,  setBusqueda]  = useState("");
  const [edadMin,   setEdadMin]   = useState("");
  const [edadMax,   setEdadMax]   = useState("");
  const [soloStats, setSoloStats] = useState(true);
  const [ordenar,   setOrdenar]   = useState("rat");
  const [pagina,    setPagina]    = useState(0);

  const [modal,     setModal]     = useState(null);
  const [comparar,  setComparar]  = useState([]);
  const [panelComp, setPanelComp] = useState(false);
  const [iaComp,    setIaComp]    = useState("");
  const [loadIa,    setLoadIa]    = useState(false);

  const PER = 40;

  useEffect(()=>{
    fetch("/fichascout_pro_data.json")
      .then(r=>{ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(d=>{ setDb(d); setLoading(false); })
      .catch(e=>{ setError("No se pudo cargar. Verifica que fichascout_pro_data.json esté en la carpeta public/."); setLoading(false); });
  },[]);

  const regiones = useMemo(()=>{
    if(!db) return [];
    return [...new Set(Object.values(db.ligas).map(l=>l.region).filter(Boolean))].sort();
  },[db]);

  const ligasDisp = useMemo(()=>{
    if(!db) return [];
    return Object.values(db.ligas).filter(l=>!region||l.region===region).sort((a,b)=>a.nombre.localeCompare(b.nombre));
  },[db,region]);

  const equiposDisp = useMemo(()=>{
    if(!db||!ligaId) return [];
    const lid = parseInt(ligaId);
    return [...new Map(Object.values(db.equipos).filter(e=>e.liga_id===lid).map(e=>[e.nombre,e])).values()].sort((a,b)=>a.nombre.localeCompare(b.nombre));
  },[db,ligaId]);

  const filtrados = useMemo(()=>{
    if(!db) return [];
    let list = db.jugadores;
    if(soloStats) list = list.filter(j=>j.s?.rat||j.s?.pts||j.s?.g!=null);
    if(region)    list = list.filter(j=>j.reg===region);
    if(ligaId)    list = list.filter(j=>j.l_id===parseInt(ligaId));
    if(equipo)    list = list.filter(j=>j.eq===equipo);
    if(posicion)  list = list.filter(j=>j.pos===posicion);
    if(edadMin)   list = list.filter(j=>j.e>=(+edadMin));
    if(edadMax)   list = list.filter(j=>j.e<=(+edadMax));
    if(busqueda){
      const q = busqueda.toLowerCase();
      list = list.filter(j=>(j.n||"").toLowerCase().includes(q)||(j.eq||"").toLowerCase().includes(q));
    }
    return [...list].sort((a,b)=>{
      if(ordenar==="rat")    return (parseFloat(b.s?.rat)||0)-(parseFloat(a.s?.rat)||0);
      if(ordenar==="g")      return (b.s?.g||0)-(a.s?.g||0);
      if(ordenar==="min")    return (b.s?.min||0)-(a.s?.min||0);
      if(ordenar==="nombre") return (a.n||"").localeCompare(b.n||"");
      return 0;
    });
  },[db,region,ligaId,equipo,posicion,edadMin,edadMax,busqueda,soloStats,ordenar]);

  const pageData  = useMemo(()=>filtrados.slice(pagina*PER,(pagina+1)*PER),[filtrados,pagina]);
  const totalPags = Math.ceil(filtrados.length/PER);

  const toggle = useCallback((j)=>{
    setComparar(prev=>{
      const ya=prev.find(p=>p.id===j.id);
      if(ya) return prev.filter(p=>p.id!==j.id);
      if(prev.length>=4) return prev;
      return [...prev,j];
    });
  },[]);

  async function analizarComparacion(){
    if(comparar.length<2) return;
    setLoadIa(true); setIaComp("");
    try{
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers: API_HEADERS,
        body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:1400, messages:[{role:"user",content:promptComparacion(comparar)}]})
      });
      const d = await r.json();
      setIaComp(d.content?.[0]?.text||"Error.");
    }catch(e){
      setIaComp("Error de conexión. Verifique su conexión a internet.");
    }
    setLoadIa(false);
  }

  if(loading) return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80,gap:14,color:"#4a6070"}}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00e87a" strokeWidth="2" style={{animation:"spin 1.2s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontWeight:600,color:"#64748b"}}>Cargando 43.400 jugadores profesionales...</div>
    </div>
  );

  if(error) return <div style={{padding:28,background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,margin:20,color:"#fca5a5",fontSize:13}}><b>⚠ Error:</b> {error}</div>;

  const enComp = (j)=>!!comparar.find(p=>p.id===j.id);
  const compIdx= (j)=>comparar.findIndex(p=>p.id===j.id);

  return(
    <div style={{fontFamily:"system-ui,sans-serif"}}>
      {modal&&<ModalJugador j={modal} onClose={()=>setModal(null)} onToggleCompar={toggle} enCompar={enComp(modal)}/>}

      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,rgba(0,232,122,0.08),rgba(59,130,246,0.05))",border:"1px solid rgba(0,232,122,0.15)",borderRadius:14,padding:"14px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:800,color:"#eef2f6",fontSize:18,marginBottom:2}}>🌍 Base de Jugadores Profesionales</div>
          <div style={{color:"#4a6070",fontSize:13}}>
            <span style={{color:G,fontWeight:700}}>{db?.meta?.total?.toLocaleString()}</span> jugadores únicos ·
            <span style={{color:G,fontWeight:700}}> {db?.meta?.ligas}</span> ligas ·
            <span style={{color:G,fontWeight:700}}> {db?.meta?.equipos?.toLocaleString()}</span> equipos ·
            <span style={{color:G,fontWeight:700}}> {filtrados.length.toLocaleString()}</span> resultados
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {comparar.length>0&&(
            <button onClick={()=>setPanelComp(p=>!p)} style={{background:panelComp?"rgba(0,232,122,0.15)":"rgba(255,255,255,0.07)",border:`1px solid ${panelComp?"rgba(0,232,122,0.3)":"rgba(255,255,255,0.1)"}`,borderRadius:9,padding:"8px 16px",color:panelComp?G:"#eef2f6",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
              ⚖️ Comparando ({comparar.length}/4)
            </button>
          )}
        </div>
      </div>

      {/* FILTROS */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"13px 16px",marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:9,marginBottom:9}}>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>REGIÓN</div>
            <select style={IN} value={region} onChange={e=>{setRegion(e.target.value);setLigaId("");setEquipo("");setPagina(0);}}>
              <option value="">Todas las regiones</option>
              {regiones.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>LIGA</div>
            <select style={IN} value={ligaId} onChange={e=>{setLigaId(e.target.value);setEquipo("");setPagina(0);}}>
              <option value="">Todas las ligas</option>
              {ligasDisp.map(l=><option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>EQUIPO</div>
            <select style={IN} value={equipo} onChange={e=>{setEquipo(e.target.value);setPagina(0);}}>
              <option value="">Todos los equipos</option>
              {equiposDisp.map(e=><option key={e.id} value={e.nombre}>{e.nombre}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>POSICIÓN</div>
            <select style={IN} value={posicion} onChange={e=>{setPosicion(e.target.value);setPagina(0);}}>
              <option value="">Todas las posiciones</option>
              {["Arquero","Defensor","Volante","Delantero"].map(p=><option key={p} value={p}>{POS_ICON[p]} {p}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 70px 70px 160px auto",gap:9,alignItems:"end"}}>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>BUSCAR</div>
            <input style={IN} placeholder="🔍  Nombre o equipo..." value={busqueda} onChange={e=>{setBusqueda(e.target.value);setPagina(0);}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>EDAD MÍN</div>
            <input style={IN} type="number" placeholder="16" value={edadMin} onChange={e=>{setEdadMin(e.target.value);setPagina(0);}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>EDAD MÁX</div>
            <input style={IN} type="number" placeholder="40" value={edadMax} onChange={e=>{setEdadMax(e.target.value);setPagina(0);}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>ORDENAR POR</div>
            <select style={IN} value={ordenar} onChange={e=>setOrdenar(e.target.value)}>
              <option value="rat">★ Rating</option>
              <option value="g">⚽ Goles</option>
              <option value="min">⏱ Minutos</option>
              <option value="nombre">🔤 Nombre A-Z</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",paddingBottom:1}}>
            <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,color:"#64748b",whiteSpace:"nowrap"}}>
              <input type="checkbox" checked={soloStats} onChange={e=>{setSoloStats(e.target.checked);setPagina(0);}} style={{accentColor:G}}/>
              Con stats
            </label>
            <button onClick={()=>{setRegion("");setLigaId("");setEquipo("");setPosicion("");setBusqueda("");setEdadMin("");setEdadMax("");setPagina(0);}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"7px 12px",color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"}}>✕ Limpiar</button>
          </div>
        </div>
      </div>

      {/* PANEL COMPARACIÓN */}
      {panelComp&&comparar.length>0&&(
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:16,marginBottom:14}}>
          <div style={{color:"#4a6070",fontSize:11,fontWeight:600,letterSpacing:.5,marginBottom:12}}>PANEL DE COMPARACIÓN · {comparar.length}/4 JUGADORES</div>

          {/* Tarjetas */}
          <div style={{display:"grid",gridTemplateColumns:`repeat(${comparar.length},1fr)`,gap:10,marginBottom:14}}>
            {comparar.map((j,i)=>(
              <div key={j.id} style={{background:`${SLOTS[i]}10`,border:`1px solid ${SLOTS[i]}33`,borderRadius:12,padding:12,textAlign:"center",position:"relative"}}>
                <button onClick={()=>toggle(j)} style={{position:"absolute",top:6,right:6,background:"rgba(239,68,68,0.1)",border:"none",borderRadius:5,color:"#ef4444",cursor:"pointer",fontSize:10,padding:"1px 5px",fontFamily:"inherit"}}>✕</button>
                <img src={j.foto} alt={j.n} style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",border:`2px solid ${SLOTS[i]}`,marginBottom:6}} onError={e=>e.target.style.display="none"}/>
                <div style={{fontWeight:700,color:"#eef2f6",fontSize:12,lineHeight:1.2}}>{j.n}</div>
                <div style={{color:"#4a6070",fontSize:10,marginTop:1}}>{j.eq}</div>
                <div style={{color:SLOTS[i],fontSize:10}}>{j.l}</div>
                {j.s?.rat&&<div style={{fontWeight:800,color:SLOTS[i],fontSize:15,marginTop:3}}>★{j.s.rat}</div>}
              </div>
            ))}
          </div>

          {/* Tabla stats */}
          {(()=>{
            const statsKeys = comparar.length>0
              ? (STATS_POS[comparar[0].pos]||STATS_DEF.map(s=>s.k)).filter(k=>comparar.some(j=>j.s?.[k]!=null))
              : [];
            return(
              <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,overflow:"hidden",marginBottom:12}}>
                <div style={{display:"grid",gridTemplateColumns:`120px repeat(${comparar.length},1fr)`,gap:8,padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:10,fontWeight:700,color:"#4a6070",letterSpacing:.5}}>
                  <div>ESTADÍSTICA</div>
                  {comparar.map((j,i)=><div key={i} style={{color:SLOTS[i]}}>{j.n.split(" ")[0]}</div>)}
                </div>
                {statsKeys.map(k=>{
                  const def=STATS_DEF.find(s=>s.k===k);
                  const vals=comparar.map(j=>parseFloat(j.s?.[k])||0);
                  const max=Math.max(...vals);
                  return(
                    <div key={k} style={{display:"grid",gridTemplateColumns:`120px repeat(${comparar.length},1fr)`,gap:8,padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                      <div style={{fontSize:11,color:"#4a6070"}}>{def?.l||k}</div>
                      {comparar.map((j,i)=>{
                        const v=parseFloat(j.s?.[k])||0;
                        const best=v===max&&max>0&&!def?.neg;
                        const pct=def?.max?Math.min((v/def.max)*100,100):(max>0?Math.min((v/max)*100,100):0);
                        return(
                          <div key={i}>
                            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:1}}>
                              <div style={{flex:1,height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                                <div style={{width:`${pct}%`,height:"100%",background:best?SLOTS[i]:"rgba(255,255,255,0.15)",borderRadius:2}}/>
                              </div>
                              <span style={{fontSize:11,fontWeight:best?800:400,color:best?SLOTS[i]:"#64748b",minWidth:22,textAlign:"right"}}>{j.s?.[k]??'—'}</span>
                            </div>
                            {best&&<div style={{fontSize:9,color:SLOTS[i],fontWeight:700}}>▲ MEJOR</div>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div style={{display:"flex",gap:10,marginBottom:iaComp?12:0}}>
            <button onClick={analizarComparacion} disabled={loadIa||comparar.length<2} style={{flex:1,border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:700,cursor:loadIa||comparar.length<2?"not-allowed":"pointer",fontSize:13,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",opacity:comparar.length<2?0.4:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loadIa?<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando como Director Técnico...</>:"🤖 Análisis IA de Comparación"}
            </button>
            <button onClick={()=>exportPDFComparacion(comparar,iaComp)} style={{flex:1,border:"none",borderRadius:10,padding:"11px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:13,background:`linear-gradient(135deg,${G},#00c96a)`,fontFamily:"inherit"}}>
              📄 Exportar PDF Comparación
            </button>
          </div>

          {iaComp&&(
            <div style={{background:"rgba(139,92,246,0.07)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:12,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>🤖 Análisis Comparativo Scout IA</span>
                <div style={{display:"flex",gap:8}}>
                  <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700}}>FichaScout PRO</span>
                  <button onClick={()=>setIaComp("")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"3px 10px",color:"#4a6070",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↻</button>
                </div>
              </div>
              <div style={{color:"#c4b5fd",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{iaComp}</div>
            </div>
          )}
        </div>
      )}

      {/* GRID */}
      {filtrados.length===0?(
        <div style={{textAlign:"center",padding:48,color:"#4a6070"}}>
          <div style={{fontSize:34,marginBottom:10}}>🔍</div>
          <div style={{fontWeight:600,marginBottom:6}}>Sin resultados</div>
          <div style={{fontSize:13}}>Cambie los filtros para ver jugadores</div>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:9,marginBottom:14}}>
          {pageData.map(j=>{
            const c=POS_COLOR[j.pos]||G;
            const ec=enComp(j);
            const ci=compIdx(j);
            return(
              <div key={j.id} onClick={()=>setModal(j)} style={{background:ec?`${SLOTS[ci]}10`:"rgba(255,255,255,0.03)",border:`1px solid ${ec?SLOTS[ci]+"44":"rgba(255,255,255,0.07)"}`,borderRadius:12,padding:13,cursor:"pointer",transition:"all .15s",position:"relative"}}
                onMouseEnter={e=>{if(!ec)e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{if(!ec)e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.transform="translateY(0)";}}>

                {ec&&<div style={{position:"absolute",top:6,right:6,width:19,height:19,borderRadius:"50%",background:SLOTS[ci],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#000"}}>{ci+1}</div>}

                <div style={{width:52,height:52,borderRadius:"50%",overflow:"hidden",margin:"0 auto 9px",border:`2px solid ${c}33`}}>
                  <img src={j.foto} alt={j.n} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.parentElement.innerHTML=`<div style="width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:20px">${POS_ICON[j.pos]||"⚽"}</div>`;}}/>
                </div>

                <div style={{fontWeight:700,color:"#eef2f6",fontSize:12,marginBottom:2,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{j.n}</div>
                <div style={{color:"#4a6070",fontSize:10,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:1}}>{j.eq}</div>
                <div style={{color:"#3a5060",fontSize:10,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:7}}>{j.l}</div>

                <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{background:`${c}15`,color:c,borderRadius:5,padding:"1px 7px",fontSize:9.5,fontWeight:700}}>{POS_ICON[j.pos]} {j.pos}</span>
                  {j.e&&<span style={{color:"#4a6070",fontSize:9.5}}>{j.e}a</span>}
                </div>

                {j.s?.rat&&<div style={{textAlign:"center",fontWeight:800,color:parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#ef4444",fontSize:15,marginBottom:3}}>★ {j.s.rat}</div>}

                <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:7}}>
                  {j.s?.g!=null&&<span style={{fontSize:10,color:"#64748b"}}>{j.s.g}⚽</span>}
                  {j.s?.a!=null&&<span style={{fontSize:10,color:"#64748b"}}>{j.s.a}🅰️</span>}
                  {j.s?.pts!=null&&<span style={{fontSize:10,color:"#64748b"}}>{j.s.pts}P</span>}
                </div>

                <button onClick={e=>{e.stopPropagation();toggle(j);}} disabled={comparar.length>=4&&!ec} style={{width:"100%",border:`1px solid ${ec?SLOTS[ci]+"44":"rgba(255,255,255,0.07)"}`,borderRadius:7,padding:"5px",color:ec?SLOTS[ci]:"#4a6070",background:"transparent",cursor:comparar.length>=4&&!ec?"not-allowed":"pointer",fontSize:10.5,fontFamily:"inherit",fontWeight:600,opacity:comparar.length>=4&&!ec?0.3:1}}>
                  {ec?"✓ En comparación":"⚖️ Comparar"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINACIÓN */}
      {totalPags>1&&(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,padding:"10px 0"}}>
          <button onClick={()=>setPagina(p=>Math.max(0,p-1))} disabled={pagina===0} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 14px",color:pagina===0?"#1a2e3d":"#eef2f6",cursor:pagina===0?"not-allowed":"pointer",fontFamily:"inherit",fontSize:12}}>← Anterior</button>
          <span style={{color:"#4a6070",fontSize:12}}>{pagina+1} / {totalPags} · {filtrados.length.toLocaleString()} jugadores</span>
          <button onClick={()=>setPagina(p=>Math.min(totalPags-1,p+1))} disabled={pagina>=totalPags-1} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 14px",color:pagina>=totalPags-1?"#1a2e3d":"#eef2f6",cursor:pagina>=totalPags-1?"not-allowed":"pointer",fontFamily:"inherit",fontSize:12}}>Siguiente →</button>
        </div>
      )}
    </div>
  );
}

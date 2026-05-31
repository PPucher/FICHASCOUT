import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const G = "#00e87a";
const D = "#040a0f";
const D2 = "#06101a";
const SLOTS = ["#00e87a","#3b82f6","#f59e0b","#ec4899"];

const POS_ICON = {
  "Arquero":"🧤","Defensor":"🛡️","Volante":"🎨","Delantero":"🎯",
  "Goalkeeper":"🧤","Defender":"🛡️","Midfielder":"🎨","Attacker":"🎯",
};
const POS_COLOR = {
  "Arquero":"#f59e0b","Defensor":"#3b82f6","Volante":"#10b981","Delantero":"#ef4444",
  "Goalkeeper":"#f59e0b","Defender":"#3b82f6","Midfielder":"#10b981","Attacker":"#ef4444",
};

const STATS_LABELS = [
  {k:"rat",l:"Rating",max:10,dec:true},
  {k:"g",  l:"Goles",max:40},
  {k:"a",  l:"Asistencias",max:25},
  {k:"pts",l:"Partidos",max:38},
  {k:"min",l:"Minutos",max:3400},
  {k:"pas",l:"Pases totales",max:2000},
  {k:"pc", l:"Pases clave",max:100},
  {k:"dis",l:"Disparos arco",max:80},
  {k:"reg",l:"Regates",max:80},
  {k:"tac",l:"Tackles",max:100},
  {k:"int",l:"Intercepciones",max:80},
  {k:"due",l:"Duelos ganados",max:200},
  {k:"ata",l:"Atajadas",max:120},
  {k:"am", l:"Amarillas",max:12,neg:true},
];

const S = (extra={}) => ({
  background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",
  borderRadius:9,padding:"8px 12px",color:"#eef2f6",fontSize:13,
  width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit", ...extra
});

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────
function exportPDF(jugadores) {
  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});

  const playerCard = (j,i) => {
    const c = SLOTS[i] || G;
    const rat = j.s?.rat;
    const ratColor = rat>=8?"#00a855":rat>=6.5?"#d97706":"#dc2626";
    return `
    <div style="background:#f8fafc;border:2px solid ${c}33;border-radius:12px;padding:18px;text-align:center">
      <div style="width:72px;height:72px;border-radius:50%;overflow:hidden;margin:0 auto 10px;border:2px solid ${c}">
        <img src="${j.foto}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=padding:12px;font-size:28px>${POS_ICON[j.pos]||"⚽"}</div>'"/>
      </div>
      <div style="font-weight:800;font-size:15px;color:#0f172a;margin-bottom:3px">${j.n}</div>
      <div style="font-size:11px;color:#64748b;margin-bottom:2px">${j.eq}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:8px">${j.l} · ${j.reg}</div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px">
        ${j.e?`<span style="background:#f1f5f9;color:#374151;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600">${j.e} años</span>`:""}
        <span style="background:${c}15;color:${c};border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700">${POS_ICON[j.pos]||""} ${j.pos}</span>
        ${j.pais?`<span style="background:#f1f5f9;color:#64748b;border-radius:4px;padding:2px 7px;font-size:10px">${j.pais}</span>`:""}
      </div>
      ${rat?`<div style="font-size:24px;font-weight:800;color:${ratColor};margin-top:4px">★ ${rat}</div><div style="font-size:9px;color:#94a3b8">Rating</div>`:""}
    </div>`;
  };

  const statRow = (st, jugadores) => {
    const vals = jugadores.map(j=>parseFloat(j.s?.[st.k])||0);
    const max = Math.max(...vals);
    return `<tr>
      <td style="padding:8px 12px;font-size:12px;color:#374151;font-weight:500;border-bottom:1px solid #f1f5f9;white-space:nowrap">${st.l}</td>
      ${jugadores.map((j,i)=>{
        const v = j.s?.[st.k];
        const n = parseFloat(v)||0;
        const pct = st.max?Math.min((n/st.max)*100,100):(max>0?Math.min((n/max)*100,100):0);
        const best = n===max&&max>0&&!st.neg;
        const c = best?SLOTS[i]:"#cbd5e1";
        return `<td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;min-width:130px">
          <div style="display:flex;align-items:center;gap:7px">
            <div style="flex:1;height:4px;background:#e2e8f0;border-radius:2px">
              <div style="width:${pct}%;height:100%;background:${c};border-radius:2px"></div>
            </div>
            <span style="font-size:12px;font-weight:${best?800:500};color:${best?SLOTS[i]:"#374151"};min-width:28px;text-align:right">${v??'—'}</span>
          </div>
          ${best?`<div style="font-size:9px;color:${SLOTS[i]};font-weight:700;margin-top:1px">▲ MEJOR</div>`:""}
        </td>`;
      }).join("")}
    </tr>`;
  };

  const html = `<!DOCTYPE html><html lang="es">
<head><meta charset="UTF-8"/>
<title>FichaScout — Informe Comparativo</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4 landscape;margin:12mm}
</style>
</head>
<body>
  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#040a0f,#07111a);padding:18px 26px;display:flex;justify-content:space-between;align-items:center;border-radius:10px;margin-bottom:16px">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:42px;height:42px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:22px">⚽</div>
      <div>
        <div style="font-weight:800;font-size:20px;color:#fff">Ficha<span style="color:#00e87a">Scout</span></div>
        <div style="font-size:9px;color:#3a5060;letter-spacing:2px">PLATAFORMA DE SCOUTING PROFESIONAL</div>
      </div>
    </div>
    <div style="text-align:right">
      <div style="color:#fff;font-weight:800;font-size:15px">INFORME COMPARATIVO DE JUGADORES</div>
      <div style="color:#3a5060;font-size:11px;margin-top:2px">${jugadores.length} jugadores · ${fecha} · fichascout.com</div>
    </div>
  </div>

  <!-- CARDS -->
  <div style="display:grid;grid-template-columns:repeat(${jugadores.length},1fr);gap:12px;margin-bottom:16px">
    ${jugadores.map((j,i)=>playerCard(j,i)).join("")}
  </div>

  <!-- TABLA ESTADÍSTICAS -->
  <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:14px">
    <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);padding:9px 14px;border-bottom:2px solid #e2e8f0">
      <div style="font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px">ESTADÍSTICAS COMPARATIVAS · Temporada 2024 · ▲ MEJOR = líder en categoría</div>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#f8fafc">
          <th style="padding:8px 12px;font-size:10px;color:#94a3b8;text-align:left;border-bottom:1px solid #e2e8f0;font-weight:600">ESTADÍSTICA</th>
          ${jugadores.map((j,i)=>`<th style="padding:8px 12px;font-size:12px;font-weight:700;color:${SLOTS[i]};text-align:left;border-bottom:2px solid ${SLOTS[i]};min-width:130px">${j.n.split(" ")[0].toUpperCase()}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${STATS_LABELS.filter(st=>jugadores.some(j=>j.s?.[st.k]!=null)).map(st=>statRow(st,jugadores)).join("")}
      </tbody>
    </table>
  </div>

  <!-- RESUMEN -->
  <div style="display:grid;grid-template-columns:repeat(${jugadores.length},1fr);gap:10px;margin-bottom:14px">
    ${jugadores.map((j,i)=>`
    <div style="border-left:3px solid ${SLOTS[i]};padding:10px 12px;background:#f8fafc;border-radius:0 8px 8px 0">
      <div style="font-weight:700;color:${SLOTS[i]};font-size:11px;margin-bottom:6px;text-transform:uppercase">${j.n}</div>
      <div style="font-size:11px;color:#374151;line-height:1.9">
        <span style="color:#94a3b8">Contribución:</span> ${(j.s?.g||0)+(j.s?.a||0)} (${j.s?.g||0}G + ${j.s?.a||0}A)<br/>
        <span style="color:#94a3b8">Minutos:</span> ${j.s?.min||"—"}'<br/>
        <span style="color:#94a3b8">Liga:</span> ${j.l}<br/>
        <span style="color:#94a3b8">Equipo:</span> ${j.eq}
      </div>
    </div>`).join("")}
  </div>

  <!-- FOOTER -->
  <div style="background:#040a0f;border-radius:8px;padding:11px 18px;display:flex;justify-content:space-between;align-items:center">
    <span style="color:#00e87a;font-weight:800;font-size:13px">FichaScout</span>
    <span style="color:#3a5060;font-size:10px">Análisis generado con Inteligencia Artificial · fichascout.com</span>
    <span style="background:#fef3c7;color:#92400e;padding:3px 9px;border-radius:4px;font-size:10px;font-weight:700">🔒 CONFIDENCIAL</span>
  </div>
</body></html>`;

  const v = window.open("","_blank","width=1200,height=800");
  v.document.write(html); v.document.close(); v.focus();
  setTimeout(()=>v.print(), 900);
}

// ─── INFORME INDIVIDUAL PDF ───────────────────────────────────────────────────
function exportInformePDF(j, iaText) {
  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const c = POS_COLOR[j.pos] || G;

  const html = `<!DOCTYPE html><html lang="es">
<head><meta charset="UTF-8"/>
<title>FichaScout — ${j.n}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4;margin:14mm}
</style>
</head>
<body>
  <div style="background:linear-gradient(135deg,#040a0f,#07111a);padding:22px 30px;display:flex;justify-content:space-between;align-items:center;border-radius:10px;margin-bottom:20px">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:40px;height:40px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px">⚽</div>
      <div>
        <div style="font-weight:800;font-size:19px;color:#fff">Ficha<span style="color:#00e87a">Scout</span></div>
        <div style="font-size:9px;color:#3a5060;letter-spacing:2px">PLATAFORMA DE SCOUTING PROFESIONAL</div>
      </div>
    </div>
    <div style="text-align:right;color:#fff">
      <strong style="font-size:14px">FICHA DE JUGADOR PROFESIONAL</strong>
      <div style="font-size:11px;color:#3a5060;margin-top:2px">${fecha} · fichascout.com</div>
    </div>
  </div>

  <!-- JUGADOR -->
  <div style="display:flex;gap:20px;background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e2e8f0">
    <div style="width:90px;height:90px;border-radius:14px;overflow:hidden;border:2px solid ${c}44;flex-shrink:0">
      <img src="${j.foto}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:36px>${POS_ICON[j.pos]||"⚽"}</div>'"/>
    </div>
    <div style="flex:1">
      <div style="display:inline-block;background:${c}15;color:${c};border:1px solid ${c}44;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;margin-bottom:6px">${POS_ICON[j.pos]||""} ${j.pos}</div>
      <div style="font-weight:800;font-size:24px;color:#0f172a;margin-bottom:4px">${j.n}</div>
      <div style="font-size:13px;color:#64748b;margin-bottom:10px">${j.eq} · ${j.l} · ${j.reg}${j.nv===1?" · 1ª División":j.nv===2?" · 2ª División":""}</div>
      <div style="display:flex;gap:16px">
        ${[["Edad",j.e?""+j.e+" años":"—"],["País",j.pais||"—"],["Altura",j.alt||"—"],["Peso",j.pes||"—"]].map(([l,v])=>`
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;text-align:center">
          <div style="font-size:15px;font-weight:800;color:#0f172a">${v}</div>
          <div style="font-size:9px;color:#94a3b8;margin-top:1px">${l}</div>
        </div>`).join("")}
        ${j.s?.rat?`<div style="background:#fff;border:1px solid ${c}44;border-radius:8px;padding:8px 12px;text-align:center">
          <div style="font-size:18px;font-weight:800;color:${j.s.rat>=8?"#00a855":j.s.rat>=6.5?"#d97706":"#dc2626"}">★ ${j.s.rat}</div>
          <div style="font-size:9px;color:#94a3b8;margin-top:1px">Rating</div>
        </div>`:""}
      </div>
    </div>
  </div>

  <!-- ESTADÍSTICAS -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
    <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <div style="background:#f1f5f9;padding:8px 14px;font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px">ESTADÍSTICAS DE TEMPORADA</div>
      <div style="padding:12px 14px;display:flex;flex-direction:column;gap:8px">
        ${STATS_LABELS.filter(st=>j.s?.[st.k]!=null).slice(0,10).map(st=>`
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:#374151;min-width:120px">${st.l}</span>
          <div style="flex:1;height:4px;background:#e2e8f0;border-radius:2px">
            <div style="width:${Math.min((parseFloat(j.s[st.k])||0)/(st.max||100)*100,100)}%;height:100%;background:${c};border-radius:2px"></div>
          </div>
          <span style="font-size:12px;font-weight:700;color:${c};min-width:30px;text-align:right">${j.s[st.k]}</span>
        </div>`).join("")}
      </div>
    </div>
    <div>
      <!-- Contribución summary -->
      <div style="background:${c}08;border:1px solid ${c}25;border-radius:10px;padding:14px;margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;color:${c};letter-spacing:.5px;margin-bottom:8px">CONTRIBUCIÓN TOTAL</div>
        <div style="display:flex;gap:14px">
          ${[["⚽",j.s?.g??0,"Goles"],["🅰️",j.s?.a??0,"Asistencias"],["⏱️",j.s?.pts??0,"Partidos"],["🕐",j.s?.min??0,"Minutos"]].map(([ic,v,l])=>`
          <div style="text-align:center">
            <div style="font-size:12px;margin-bottom:3px">${ic}</div>
            <div style="font-size:20px;font-weight:800;color:#0f172a">${v}</div>
            <div style="font-size:9px;color:#94a3b8">${l}</div>
          </div>`).join("")}
        </div>
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px">
        <div style="font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px;margin-bottom:6px">CLUB</div>
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${j.eq_logo}" style="width:36px;height:36px;object-fit:contain" onerror="this.style.display='none'"/>
          <div>
            <div style="font-weight:700;font-size:14px;color:#0f172a">${j.eq}</div>
            <div style="font-size:12px;color:#64748b">${j.l} · Nivel ${j.nv}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${iaText?`
  <!-- ANÁLISIS IA -->
  <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px;margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-size:11px;font-weight:700;color:#166534;letter-spacing:.5px">ANÁLISIS SCOUT CON INTELIGENCIA ARTIFICIAL</div>
      <span style="background:#00a85518;color:#00a855;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700">🤖 FichaScout IA</span>
    </div>
    <div style="font-size:12px;color:#166534;line-height:1.75;white-space:pre-wrap">${iaText.substring(0,1400)}${iaText.length>1400?"...":""}</div>
  </div>`:""}

  <div style="background:#040a0f;border-radius:8px;padding:11px 18px;display:flex;justify-content:space-between;align-items:center">
    <span style="color:#00e87a;font-weight:800;font-size:13px">FichaScout</span>
    <span style="color:#3a5060;font-size:10px">Informe generado automáticamente · fichascout.com</span>
    <span style="background:#fef3c7;color:#92400e;padding:3px 9px;border-radius:4px;font-size:10px;font-weight:700">🔒 CONFIDENCIAL</span>
  </div>
</body></html>`;

  const v = window.open("","_blank","width=900,height=700");
  v.document.write(html); v.document.close(); v.focus();
  setTimeout(()=>v.print(), 900);
}

// ─── MODAL DETALLE JUGADOR ────────────────────────────────────────────────────
function ModalJugador({ j, onClose, onAddCompar, enCompar }) {
  const [iaText, setIaText] = useState("");
  const [loadIA, setLoadIA] = useState(false);
  const c = POS_COLOR[j.pos] || G;

  async function generarIA() {
    setLoadIA(true); setIaText("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1100,
          messages:[{role:"user",content:
            `Eres un scout profesional de élite. Genera un análisis completo del siguiente jugador:

JUGADOR: ${j.n}
Equipo: ${j.eq} | Liga: ${j.l} | País: ${j.pais||"—"} | Edad: ${j.e||"—"} años
Posición: ${j.pos} | Nivel liga: ${j.nv===1?"1ª División":j.nv===2?"2ª División":"3ª División"}
Altura: ${j.alt||"—"} | Peso: ${j.pes||"—"}

ESTADÍSTICAS TEMPORADA 2024:
Rating: ${j.s?.rat||"—"} | Partidos: ${j.s?.pts||0} | Minutos: ${j.s?.min||0}'
Goles: ${j.s?.g||0} | Asistencias: ${j.s?.a||0}
Pases totales: ${j.s?.pas||"—"} | Pases clave: ${j.s?.pc||"—"}
Regates exitosos: ${j.s?.reg||"—"} | Disparos arco: ${j.s?.dis||"—"}
Tackles: ${j.s?.tac||"—"} | Intercepciones: ${j.s?.int||"—"}
Duelos ganados: ${j.s?.due||"—"} | Atajadas: ${j.s?.ata||"—"}
Amarillas: ${j.s?.am||0} | Rojas: ${j.s?.ro||0}

Estructura el análisis en:
1. PERFIL GENERAL (tipo de jugador, estilo de juego)
2. FORTALEZAS (con datos específicos)
3. ÁREAS DE MEJORA
4. POTENCIAL DE FICHAJE (para qué perfil de equipo es ideal)
5. VALORACIÓN FINAL (puntuación 1-10 y recomendación)`
          }]
        })
      });
      const d = await r.json();
      setIaText(d.content?.[0]?.text || "Error al generar.");
    } catch { setIaText("Error de conexión."); }
    setLoadIA(false);
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#07111a",borderRadius:18,border:"1px solid rgba(255,255,255,0.09)",width:"100%",maxWidth:760,maxHeight:"92vh",overflowY:"auto",position:"relative"}}>

        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${c}12,transparent)`,padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:16,alignItems:"center",position:"sticky",top:0,backdropFilter:"blur(20px)",zIndex:1,borderRadius:"18px 18px 0 0"}}>
          <div style={{width:64,height:64,borderRadius:14,overflow:"hidden",border:`2px solid ${c}44`,flexShrink:0}}>
            <img src={j.foto} alt={j.n} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.parentElement.innerHTML=`<div style="width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:28px">${POS_ICON[j.pos]||"⚽"}</div>`;}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"inline-block",background:`${c}15`,color:c,borderRadius:6,padding:"2px 9px",fontSize:11,fontWeight:700,marginBottom:5}}>{POS_ICON[j.pos]} {j.pos}</div>
            <div style={{fontWeight:800,fontSize:20,color:"#eef2f6",marginBottom:2}}>{j.n}</div>
            <div style={{color:"#4a6070",fontSize:12}}>{j.eq} · {j.l} · {j.reg}{j.e?` · ${j.e} años`:""}</div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>onAddCompar(j)} style={{background:enCompar?`${c}20`:"rgba(255,255,255,0.06)",border:`1px solid ${enCompar?c+"44":"rgba(255,255,255,0.1)"}`,borderRadius:9,padding:"8px 14px",color:enCompar?c:"#eef2f6",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
              {enCompar?"✓ En comparación":"⚖️ Comparar"}
            </button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#4a6070",cursor:"pointer",fontSize:22,padding:0,lineHeight:1}}>✕</button>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{padding:"18px 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
            {[["⭐",j.s?.rat,"Rating",j.s?.rat>=8?"#00a855":j.s?.rat>=6.5?"#d97706":"#ef4444"],
              ["⚽",j.s?.g??0,"Goles",c],
              ["🅰️",j.s?.a??0,"Asistencias",c],
              ["⏱️",j.s?.pts??0,"Partidos","#64748b"],
              ["🕐",j.s?.min??0,"Minutos","#64748b"],
              ["📊",j.s?.pas??"—","Pases","#64748b"],
              ["🔑",j.s?.pc??"—","Pases clave",c],
              ["💪",j.s?.tac??"—","Tackles","#64748b"],
            ].map(([ico,v,l,col])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:13,marginBottom:3}}>{ico}</div>
                <div style={{fontWeight:800,fontSize:17,color:col||c}}>{v??'—'}</div>
                <div style={{fontSize:10,color:"#4a6070",marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Barras de stats */}
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
            <div style={{color:"#4a6070",fontSize:11,fontWeight:600,letterSpacing:.5,marginBottom:10}}>ESTADÍSTICAS DETALLADAS</div>
            {STATS_LABELS.filter(st=>j.s?.[st.k]!=null).map(st=>{
              const v = parseFloat(j.s[st.k])||0;
              const pct = Math.min((v/(st.max||100))*100,100);
              return(
                <div key={st.k} style={{display:"grid",gridTemplateColumns:"120px 1fr 40px",gap:8,alignItems:"center",marginBottom:7}}>
                  <div style={{fontSize:12,color:"#64748b"}}>{st.l}</div>
                  <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                    <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:c,textAlign:"right"}}>{j.s[st.k]}</div>
                </div>
              );
            })}
          </div>

          {/* IA */}
          {!iaText?(
            <button onClick={generarIA} disabled={loadIA} style={{width:"100%",border:"none",borderRadius:11,padding:"13px",color:"#fff",fontWeight:700,cursor:loadIA?"not-allowed":"pointer",fontSize:14,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              {loadIA?<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando jugador...</>:"🤖 Generar Análisis Scout IA"}
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </button>
          ):(
            <div style={{background:"rgba(139,92,246,0.07)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>🤖 Análisis Scout IA</span>
                <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:700}}>FichaScout PRO</span>
              </div>
              <div style={{color:"#94a3b8",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{iaText}</div>
              <button onClick={()=>setIaText("")} style={{marginTop:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 14px",color:"#4a6070",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>↻ Regenerar</button>
            </div>
          )}

          {/* Botones acción */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>exportInformePDF(j, iaText)} style={{border:"none",borderRadius:11,padding:"12px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:13,background:`linear-gradient(135deg,${G},#00c96a)`,fontFamily:"inherit"}}>
              📄 Exportar PDF Individual
            </button>
            <button onClick={()=>onAddCompar(j)} style={{border:`1px solid ${enCompar?c+"44":"rgba(255,255,255,0.1)"}`,borderRadius:11,padding:"12px",color:enCompar?c:"#eef2f6",fontWeight:700,cursor:"pointer",fontSize:13,background:enCompar?`${c}12`:"transparent",fontFamily:"inherit"}}>
              ⚖️ {enCompar?"Quitar de comparación":"Agregar a comparación"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────────────────
export default function BasePro() {
  const [dbData,    setDbData]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  // Filtros
  const [region,    setRegion]    = useState("");
  const [ligaId,    setLigaId]    = useState("");
  const [equipo,    setEquipo]    = useState("");
  const [posicion,  setPosicion]  = useState("");
  const [busqueda,  setBusqueda]  = useState("");
  const [edadMin,   setEdadMin]   = useState("");
  const [edadMax,   setEdadMax]   = useState("");
  const [soloStats, setSoloStats] = useState(true);
  const [ordenar,   setOrdenar]   = useState("rat");

  // UI
  const [pagina,    setPagina]    = useState(0);
  const [jugModal,  setJugModal]  = useState(null);
  const [comparar,  setComparar]  = useState([]);
  const [modoComp,  setModoComp]  = useState(false);
  const [iaComp,    setIaComp]    = useState("");
  const [loadIa,    setLoadIa]    = useState(false);

  const PER_PAGE = 40;

  // Cargar datos
  useEffect(()=>{
    setLoading(true);
    fetch("/fichascout_pro_data.json")
      .then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d=>{ setDbData(d); setLoading(false); })
      .catch(err=>{ setError("No se pudo cargar la base de datos. Verifica que fichascout_pro_data.json esté en la carpeta public/."); setLoading(false); });
  },[]);

  // Regiones únicas
  const regiones = useMemo(()=>{
    if(!dbData) return [];
    return [...new Set(Object.values(dbData.ligas).map(l=>l.region).filter(Boolean))].sort();
  },[dbData]);

  // Ligas filtradas por región
  const ligasDisp = useMemo(()=>{
    if(!dbData) return [];
    return Object.values(dbData.ligas).filter(l=>!region||l.region===region).sort((a,b)=>a.nombre.localeCompare(b.nombre));
  },[dbData,region]);

  // Equipos filtrados por liga
  const equiposDisp = useMemo(()=>{
    if(!dbData||!ligaId) return [];
    return [...new Map(
      Object.values(dbData.equipos).filter(e=>!ligaId||e.liga_id===parseInt(ligaId)).map(e=>[e.nombre,e])
    ).values()].sort((a,b)=>a.nombre.localeCompare(b.nombre));
  },[dbData,ligaId]);

  // Jugadores filtrados
  const filtrados = useMemo(()=>{
    if(!dbData) return [];
    let list = dbData.jugadores;
    if(soloStats) list = list.filter(j=>j.s?.rat||j.s?.g!=null||j.s?.pts);
    if(region)    list = list.filter(j=>j.reg===region);
    if(ligaId)    list = list.filter(j=>j.l_id===parseInt(ligaId));
    if(equipo)    list = list.filter(j=>j.eq===equipo);
    if(posicion)  list = list.filter(j=>j.pos===posicion||j.pos?.startsWith(posicion));
    if(edadMin)   list = list.filter(j=>j.e>=+edadMin);
    if(edadMax)   list = list.filter(j=>j.e<=+edadMax);
    if(busqueda){ const q=busqueda.toLowerCase(); list=list.filter(j=>(j.n||"").toLowerCase().includes(q)||(j.eq||"").toLowerCase().includes(q)); }

    // Ordenar
    list = [...list].sort((a,b)=>{
      if(ordenar==="rat") return (parseFloat(b.s?.rat)||0)-(parseFloat(a.s?.rat)||0);
      if(ordenar==="g")   return (b.s?.g||0)-(a.s?.g||0);
      if(ordenar==="min") return (b.s?.min||0)-(a.s?.min||0);
      if(ordenar==="nombre") return (a.n||"").localeCompare(b.n||"");
      return 0;
    });
    return list;
  },[dbData,region,ligaId,equipo,posicion,edadMin,edadMax,busqueda,soloStats,ordenar]);

  const pagJugadores = useMemo(()=>filtrados.slice(pagina*PER_PAGE,(pagina+1)*PER_PAGE),[filtrados,pagina]);
  const totalPags = Math.ceil(filtrados.length/PER_PAGE);

  const resetFiltros = ()=>{ setRegion(""); setLigaId(""); setEquipo(""); setPosicion(""); setBusqueda(""); setEdadMin(""); setEdadMax(""); setPagina(0); };

  const toggleCompar = useCallback((j)=>{
    setComparar(prev=>{
      const ya = prev.find(p=>p.id===j.id);
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
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1300,
          messages:[{role:"user",content:
            `Scout profesional de élite. Compara estos ${comparar.length} jugadores:\n\n`+
            comparar.map((j,i)=>`${i+1}. ${j.n} | ${j.pos} | ${j.eq} | ${j.l} | ${j.e||"—"}a\n   Rating:${j.s?.rat||"—"} Partidos:${j.s?.pts||0} Min:${j.s?.min||0}' G:${j.s?.g||0} A:${j.s?.a||0}\n   Pases:${j.s?.pas||"—"} Tackles:${j.s?.tac||"—"} Regates:${j.s?.reg||"—"}`).join("\n\n")+
            `\n\n1. RESUMEN EJECUTIVO (quién destaca)\n2. COMPARATIVA ESTADÍSTICA (quién lidera en cada dimensión)\n3. PERFIL INDIVIDUAL (fortalezas/debilidades de cada uno)\n4. PARA QUÉ EQUIPO ES IDEAL CADA JUGADOR\n5. RECOMENDACIÓN FINAL DE FICHAJE`
          }]
        })
      });
      const d=await r.json();
      setIaComp(d.content?.[0]?.text||"Error.");
    }catch{setIaComp("Error de conexión.");}
    setLoadIa(false);
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if(loading) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80,gap:16,color:"#4a6070"}}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00e87a" strokeWidth="2" style={{animation:"spin 1.2s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontWeight:600,color:"#64748b"}}>Cargando base de datos profesional...</div>
    </div>
  );

  if(error) return (
    <div style={{padding:32,background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:14,margin:24,color:"#fca5a5"}}>
      <div style={{fontWeight:700,marginBottom:8}}>⚠ Error al cargar los datos</div>
      <div style={{fontSize:13}}>{error}</div>
    </div>
  );

  return (
    <div style={{fontFamily:"system-ui,sans-serif"}}>
      {jugModal && <ModalJugador j={jugModal} onClose={()=>setJugModal(null)} onAddCompar={toggleCompar} enCompar={!!comparar.find(p=>p.id===jugModal.id)}/>}

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,rgba(0,232,122,0.08),rgba(59,130,246,0.06))`,border:"1px solid rgba(0,232,122,0.15)",borderRadius:16,padding:"16px 22px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:800,color:"#eef2f6",fontSize:19,letterSpacing:"-0.5px",marginBottom:3}}>🌍 Base de Jugadores Profesionales</div>
          <div style={{color:"#4a6070",fontSize:13}}>
            <span style={{color:G,fontWeight:700}}>{dbData?.meta?.total?.toLocaleString()}</span> jugadores ·
            <span style={{color:G,fontWeight:700}}> {dbData?.meta?.ligas}</span> ligas ·
            <span style={{color:G,fontWeight:700}}> {dbData?.meta?.equipos?.toLocaleString()}</span> equipos
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {comparar.length>0&&(
            <button onClick={()=>setModoComp(c=>!c)} style={{background:modoComp?"rgba(0,232,122,0.15)":"rgba(255,255,255,0.07)",border:`1px solid ${modoComp?"rgba(0,232,122,0.3)":"rgba(255,255,255,0.1)"}`,borderRadius:9,padding:"8px 16px",color:modoComp?G:"#eef2f6",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
              ⚖️ Comparar ({comparar.length})
            </button>
          )}
          {[["🌍",`${dbData?.meta?.ligas} ligas`],["👥",`${filtrados.length.toLocaleString()} results`]].map(([i,v])=>(
            <div key={v} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:"8px 14px",fontSize:12,color:"#4a6070"}}>
              {i} {v}
            </div>
          ))}
        </div>
      </div>

      {/* FILTROS */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px 18px",marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>REGIÓN</div>
            <select style={S()} value={region} onChange={e=>{setRegion(e.target.value);setLigaId("");setEquipo("");setPagina(0);}}>
              <option value="">Todas las regiones</option>
              {regiones.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>LIGA</div>
            <select style={S()} value={ligaId} onChange={e=>{setLigaId(e.target.value);setEquipo("");setPagina(0);}}>
              <option value="">Todas las ligas</option>
              {ligasDisp.map(l=><option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>EQUIPO</div>
            <select style={S()} value={equipo} onChange={e=>{setEquipo(e.target.value);setPagina(0);}}>
              <option value="">Todos los equipos</option>
              {equiposDisp.map(e=><option key={e.id} value={e.nombre}>{e.nombre}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>POSICIÓN</div>
            <select style={S()} value={posicion} onChange={e=>{setPosicion(e.target.value);setPagina(0);}}>
              <option value="">Todas las posiciones</option>
              {["Arquero","Defensor","Volante","Delantero"].map(p=><option key={p} value={p}>{POS_ICON[p]} {p}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 80px 80px 160px 1fr",gap:10,alignItems:"end"}}>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>BUSCAR JUGADOR</div>
            <input style={S()} placeholder="🔍  Nombre o equipo..." value={busqueda} onChange={e=>{setBusqueda(e.target.value);setPagina(0);}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>EDAD MÍN</div>
            <input style={S()} type="number" placeholder="16" value={edadMin} onChange={e=>{setEdadMin(e.target.value);setPagina(0);}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>EDAD MÁX</div>
            <input style={S()} type="number" placeholder="40" value={edadMax} onChange={e=>{setEdadMax(e.target.value);setPagina(0);}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:5,letterSpacing:.5}}>ORDENAR POR</div>
            <select style={S()} value={ordenar} onChange={e=>setOrdenar(e.target.value)}>
              <option value="rat">★ Rating</option>
              <option value="g">⚽ Goles</option>
              <option value="min">⏱ Minutos</option>
              <option value="nombre">🔤 Nombre</option>
            </select>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:"#64748b"}}>
              <input type="checkbox" checked={soloStats} onChange={e=>{setSoloStats(e.target.checked);setPagina(0);}} style={{accentColor:G}}/>
              Solo con stats
            </label>
            <button onClick={resetFiltros} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"6px 12px",color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"}}>✕ Limpiar</button>
          </div>
        </div>
      </div>

      {/* PANEL COMPARACIÓN */}
      {modoComp && comparar.length>0 && (
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{color:"#4a6070",fontSize:11,fontWeight:600,letterSpacing:.5,marginBottom:12}}>COMPARANDO {comparar.length}/4 JUGADORES</div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${comparar.length},1fr)`,gap:10,marginBottom:14}}>
            {comparar.map((j,i)=>(
              <div key={j.id} style={{background:`${SLOTS[i]}10`,border:`1px solid ${SLOTS[i]}33`,borderRadius:12,padding:12,position:"relative",textAlign:"center"}}>
                <button onClick={()=>toggleCompar(j)} style={{position:"absolute",top:6,right:6,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:5,color:"#ef4444",cursor:"pointer",fontSize:11,padding:"1px 5px",fontFamily:"inherit"}}>✕</button>
                <img src={j.foto} alt={j.n} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:`2px solid ${SLOTS[i]}`,marginBottom:6}} onError={e=>e.target.style.display="none"}/>
                <div style={{fontWeight:700,color:"#eef2f6",fontSize:12,lineHeight:1.2}}>{j.n}</div>
                <div style={{color:"#4a6070",fontSize:10,marginTop:2}}>{j.eq}</div>
                <div style={{color:SLOTS[i],fontSize:10}}>{j.l}</div>
                {j.s?.rat&&<div style={{fontWeight:800,color:SLOTS[i],fontSize:15,marginTop:4}}>★{j.s.rat}</div>}
              </div>
            ))}
          </div>

          {/* Tabla comparativa */}
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,overflow:"hidden",marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:`130px repeat(${comparar.length},1fr)`,gap:8,padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:11,fontWeight:600,color:"#4a6070"}}>
              <div>ESTADÍSTICA</div>
              {comparar.map((j,i)=><div key={i} style={{color:SLOTS[i]}}>{j.n.split(" ")[0]}</div>)}
            </div>
            {STATS_LABELS.filter(st=>comparar.some(j=>j.s?.[st.k]!=null)).map(st=>{
              const vals=comparar.map(j=>parseFloat(j.s?.[st.k])||0);
              const max=Math.max(...vals);
              return(
                <div key={st.k} style={{display:"grid",gridTemplateColumns:`130px repeat(${comparar.length},1fr)`,gap:8,padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{fontSize:12,color:"#4a6070"}}>{st.l}</div>
                  {comparar.map((j,i)=>{
                    const v=parseFloat(j.s?.[st.k])||0;
                    const best=v===max&&max>0&&!st.neg;
                    const pct=st.max?Math.min((v/st.max)*100,100):max>0?Math.min((v/max)*100,100):0;
                    return(
                      <div key={i}>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                          <div style={{flex:1,height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                            <div style={{width:`${pct}%`,height:"100%",background:best?SLOTS[i]:"rgba(255,255,255,0.15)",borderRadius:2}}/>
                          </div>
                          <span style={{fontSize:12,fontWeight:best?800:500,color:best?SLOTS[i]:"#64748b",minWidth:25,textAlign:"right"}}>{j.s?.[st.k]??'—'}</span>
                        </div>
                        {best&&<div style={{fontSize:9,color:SLOTS[i],fontWeight:700}}>▲ MEJOR</div>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div style={{display:"flex",gap:10}}>
            <button onClick={analizarComparacion} disabled={loadIa||comparar.length<2} style={{flex:1,border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:700,cursor:loadIa||comparar.length<2?"not-allowed":"pointer",fontSize:13,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",opacity:comparar.length<2?0.4:1}}>
              {loadIa?"⏳ Analizando...":"🤖 Análisis IA de Comparación"}
            </button>
            <button onClick={()=>exportPDF(comparar)} style={{flex:1,border:"none",borderRadius:10,padding:"11px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:13,background:`linear-gradient(135deg,${G},#00c96a)`,fontFamily:"inherit"}}>
              📄 Exportar PDF Comparación
            </button>
          </div>

          {iaComp&&(
            <div style={{background:"rgba(139,92,246,0.07)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:12,padding:14,marginTop:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>🤖 Análisis Scout IA</span>
                <button onClick={()=>setIaComp("")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"4px 12px",color:"#4a6070",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↻ Regenerar</button>
              </div>
              <div style={{color:"#94a3b8",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{iaComp}</div>
            </div>
          )}
        </div>
      )}

      {/* GRID DE JUGADORES */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:16}}>
        {pagJugadores.map(j=>{
          const c = POS_COLOR[j.pos] || G;
          const enComp = !!comparar.find(p=>p.id===j.id);
          const compIdx = comparar.findIndex(p=>p.id===j.id);
          return(
            <div key={j.id} onClick={()=>setJugModal(j)} style={{background:enComp?`${SLOTS[compIdx]}10`:"rgba(255,255,255,0.03)",border:`1px solid ${enComp?SLOTS[compIdx]+"44":"rgba(255,255,255,0.07)"}`,borderRadius:12,padding:14,cursor:"pointer",transition:"all .18s",position:"relative"}}
              onMouseEnter={e=>{if(!enComp)e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{if(!enComp)e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.transform="translateY(0)";}}>

              {enComp&&<div style={{position:"absolute",top:6,right:6,width:20,height:20,borderRadius:"50%",background:SLOTS[compIdx],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#000"}}>{compIdx+1}</div>}

              {/* Foto */}
              <div style={{width:56,height:56,borderRadius:"50%",overflow:"hidden",margin:"0 auto 10px",border:`2px solid ${c}33`}}>
                <img src={j.foto} alt={j.n} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.parentElement.innerHTML=`<div style="width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:22px">${POS_ICON[j.pos]||"⚽"}</div>`;}}/>
              </div>

              <div style={{fontWeight:700,color:"#eef2f6",fontSize:13,marginBottom:3,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{j.n}</div>
              <div style={{color:"#4a6070",fontSize:10,textAlign:"center",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{j.eq}</div>
              <div style={{color:"#3a5060",fontSize:10,textAlign:"center",marginBottom:8,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{j.l}</div>

              <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{background:`${c}15`,color:c,borderRadius:5,padding:"1px 7px",fontSize:10,fontWeight:700}}>{POS_ICON[j.pos]} {j.pos}</span>
                {j.e&&<span style={{color:"#4a6070",fontSize:10}}>{j.e}a</span>}
              </div>

              {j.s?.rat&&(
                <div style={{textAlign:"center",fontWeight:800,color:j.s.rat>=8?"#00a855":j.s.rat>=6.5?"#d97706":"#ef4444",fontSize:16}}>★ {j.s.rat}</div>
              )}

              <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:4}}>
                {j.s?.g!=null&&<span style={{fontSize:10,color:"#64748b"}}>{j.s.g}⚽</span>}
                {j.s?.a!=null&&<span style={{fontSize:10,color:"#64748b"}}>{j.s.a}🅰️</span>}
                {j.s?.pts!=null&&<span style={{fontSize:10,color:"#64748b"}}>{j.s.pts}P</span>}
              </div>

              {/* Botón comparar */}
              <button onClick={e=>{e.stopPropagation();toggleCompar(j);}} style={{width:"100%",marginTop:8,border:`1px solid ${enComp?SLOTS[compIdx]+"44":"rgba(255,255,255,0.08)"}`,borderRadius:7,padding:"5px",color:enComp?SLOTS[compIdx]:"#4a6070",background:"transparent",cursor:comparar.length>=4&&!enComp?"not-allowed":"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600,transition:"all .15s",opacity:comparar.length>=4&&!enComp?0.35:1}} disabled={comparar.length>=4&&!enComp}>
                {enComp?"✓ En comparación":"⚖️ Comparar"}
              </button>
            </div>
          );
        })}
      </div>

      {/* PAGINACIÓN */}
      {totalPags>1&&(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,padding:"12px 0"}}>
          <button onClick={()=>setPagina(p=>Math.max(0,p-1))} disabled={pagina===0} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 14px",color:pagina===0?"#1a2e3d":"#eef2f6",cursor:pagina===0?"not-allowed":"pointer",fontFamily:"inherit",fontSize:13}}>← Anterior</button>
          <span style={{color:"#4a6070",fontSize:12}}>{pagina+1} / {totalPags} ({filtrados.length.toLocaleString()} jugadores)</span>
          <button onClick={()=>setPagina(p=>Math.min(totalPags-1,p+1))} disabled={pagina>=totalPags-1} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 14px",color:pagina>=totalPags-1?"#1a2e3d":"#eef2f6",cursor:pagina>=totalPags-1?"not-allowed":"pointer",fontFamily:"inherit",fontSize:13}}>Siguiente →</button>
        </div>
      )}

      {filtrados.length===0&&(
        <div style={{textAlign:"center",padding:48,color:"#4a6070"}}>
          <div style={{fontSize:36,marginBottom:10}}>🔍</div>
          <div style={{fontWeight:600}}>Sin resultados</div>
          <div style={{fontSize:13,marginTop:6}}>Cambie los filtros o limpie la búsqueda</div>
          <button onClick={resetFiltros} style={{marginTop:14,background:`${G}15`,border:`1px solid ${G}33`,borderRadius:9,padding:"9px 20px",color:G,cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600}}>Limpiar filtros</button>
        </div>
      )}
    </div>
  );
}

// ── FICHASCOUT — Módulo de Exportación PDF Profesional ──────────────────────
// Genera un PDF completo del jugador con: foto, estadísticas, radar chart,
// historial de partidos y análisis IA. Listo para enviar a clubes.

export function generarPDF(jugador, equipo, liga, dims, historial, informe) {
  const pos = {
    "Arquero":              { color:"#f59e0b", icon:"🧤" },
    "Defensor Central":     { color:"#3b82f6", icon:"🛡️" },
    "Lateral":              { color:"#8b5cf6", icon:"↔️" },
    "Volante de Contención":{ color:"#10b981", icon:"🧱" },
    "Volante Ofensivo":     { color:"#f97316", icon:"🎨" },
    "Extremo":              { color:"#ec4899", icon:"⚡" },
    "Delantero Centro":     { color:"#ef4444", icon:"🎯" },
  };
  const pc = pos[jugador.posicion]?.color || "#00e87a";
  const pi = pos[jugador.posicion]?.icon  || "⚽";

  const avgAdj = historial?.length
    ? (historial.reduce((s,h)=>s+(h.puntuacionAdj||h.puntuacion||5),0)/historial.length).toFixed(1)
    : "—";
  const totalMin = historial?.reduce((s,h)=>s+(h.minutos||0),0)||0;
  const trend = historial?.length>=2
    ? (historial[historial.length-1].puntuacionAdj > historial[0].puntuacionAdj ? "MEJORANDO ↑" : "DECLINANDO ↓")
    : "SIN DATOS";
  const trendColor = trend.includes("MEJORANDO") ? "#00e87a" : "#ef4444";

  const DIMS_LABELS = [
    {k:"of",l:"Ofensivo"},{k:"def",l:"Defensivo"},{k:"tec",l:"Técnico"},
    {k:"fis",l:"Físico"},{k:"con",l:"Consistencia"},{k:"pre",l:"Bajo Presión"},{k:"prog",l:"Progresión"}
  ];

  // Generar SVG del radar chart para el PDF
  const radarSVG = (() => {
    if (!dims) return "";
    const vals = DIMS_LABELS.map(d => (dims[d.k]||0)/100);
    const n = vals.length;
    const cx=120, cy=120, r=90;
    const pts = vals.map((v,i)=>{
      const angle = (i/n)*2*Math.PI - Math.PI/2;
      return [cx+r*v*Math.cos(angle), cy+r*v*Math.sin(angle)];
    });
    const polygon = pts.map(p=>p.join(",")).join(" ");
    const gridLines = [0.25,0.5,0.75,1].map(scale=>
      vals.map((_,i)=>{
        const angle=(i/n)*2*Math.PI-Math.PI/2;
        return [cx+r*scale*Math.cos(angle), cy+r*scale*Math.sin(angle)];
      }).map(p=>p.join(",")).join(" ")
    );
    const axisLines = vals.map((_,i)=>{
      const angle=(i/n)*2*Math.PI-Math.PI/2;
      return `<line x1="${cx}" y1="${cy}" x2="${cx+r*Math.cos(angle)}" y2="${cy+r*Math.sin(angle)}" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>`;
    }).join("");
    const labels = DIMS_LABELS.map((d,i)=>{
      const angle=(i/n)*2*Math.PI-Math.PI/2;
      const lx=cx+(r+20)*Math.cos(angle);
      const ly=cy+(r+20)*Math.sin(angle);
      return `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#444" font-family="Arial">${d.l}\n${dims[d.k]||0}</text>`;
    }).join("");
    return `<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      ${gridLines.map(pts=>`<polygon points="${pts}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>`).join("")}
      ${axisLines}
      <polygon points="${polygon}" fill="${pc}22" stroke="${pc}" stroke-width="2"/>
      ${labels}
    </svg>`;
  })();

  const historialHTML = historial?.slice(-10).map(h=>{
    const tp = {amistoso:"Amistoso",local:"Liga Local",regional:"Copa Regional",nacional:"Torneo Nacional",playoff:"Playoffs",final:"Final"}[h.tipo]||h.tipo||"—";
    const sc = h.puntuacionAdj||h.puntuacion||"—";
    const scColor = sc>=7?"#00a855":sc>=5?"#d97706":"#dc2626";
    return `<tr>
      <td style="padding:6px 10px;font-size:12px;color:#374151;border-bottom:1px solid #f3f4f6">${h.fecha||"—"}</td>
      <td style="padding:6px 10px;font-size:12px;font-weight:600;color:#111827;border-bottom:1px solid #f3f4f6">${h.rival||"—"}</td>
      <td style="padding:6px 10px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6">${tp}</td>
      <td style="padding:6px 10px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6">${h.minutos||0}'</td>
      <td style="padding:6px 10px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6">${h.resultado||"—"}</td>
      <td style="padding:6px 10px;font-size:13px;font-weight:700;color:${scColor};border-bottom:1px solid #f3f4f6">${sc}/10</td>
    </tr>`;
  }).join("")||"";

  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>FichaScout — ${jugador.nombre}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#111827;font-size:14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4;margin:0}
  @media print{body{margin:0}}
  .page{width:210mm;min-height:297mm;padding:0;background:#fff}
  .header{background:linear-gradient(135deg,#040a0f 0%,#07111a 100%);color:#fff;padding:28px 36px;display:flex;justify-content:space-between;align-items:center}
  .logo{display:flex;align-items:center;gap:10px}
  .logo-ball{width:38px;height:38px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px}
  .logo-text{font-size:20px;font-weight:800;letter-spacing:-0.5px}
  .logo-text span{color:#00e87a}
  .logo-sub{font-size:9px;color:#4a6070;letter-spacing:1.5px;margin-top:1px}
  .header-right{text-align:right;font-size:11px;color:#4a6070}
  .header-right strong{color:#94a3b8;display:block;font-size:13px;margin-bottom:2px}
  .player-section{display:flex;gap:24px;padding:24px 36px;background:#f8fafc;border-bottom:3px solid #e2e8f0}
  .player-photo{width:100px;height:100px;border-radius:14px;object-fit:cover;border:2px solid ${pc}40}
  .player-photo-placeholder{width:100px;height:100px;border-radius:14px;background:${pc}18;border:2px solid ${pc}40;display:flex;align-items:center;justify-content:center;font-size:40px}
  .player-info{flex:1}
  .player-pos{display:inline-block;background:${pc}15;color:${pc};border:1px solid ${pc}40;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;margin-bottom:6px}
  .player-name{font-size:26px;font-weight:800;letter-spacing:-0.5px;color:#0f172a;margin-bottom:4px}
  .player-meta{font-size:13px;color:#64748b;margin-bottom:12px}
  .player-stats-row{display:flex;gap:20px}
  .pstat{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;text-align:center;min-width:70px}
  .pstat-val{font-size:18px;font-weight:800;color:#0f172a}
  .pstat-lbl{font-size:10px;color:#94a3b8;margin-top:2px}
  .trend-badge{background:${trendColor}15;color:${trendColor};border:1px solid ${trendColor}40;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;margin-left:10px}
  .content{padding:24px 36px}
  .section-title{font-size:13px;font-weight:700;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;padding-bottom:6px;border-bottom:2px solid #e2e8f0}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
  .radar-wrap{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center}
  .dims-list{display:flex;flex-direction:column;gap:8px}
  .dim-row{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border-radius:6px;padding:7px 12px}
  .dim-name{font-size:12px;color:#374151;font-weight:500}
  .dim-bar-wrap{flex:1;height:6px;background:#e2e8f0;border-radius:3px;margin:0 12px;position:relative}
  .dim-bar{height:100%;border-radius:3px;background:${pc}}
  .dim-val{font-size:12px;font-weight:700;color:${pc};min-width:30px;text-align:right}
  table{width:100%;border-collapse:collapse}
  .table-header th{background:#f1f5f9;padding:8px 10px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;text-align:left}
  .ai-box{background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px;margin-bottom:20px}
  .ai-badge{display:inline-block;background:#00a85518;color:#00a855;border:1px solid #00a85540;border-radius:5px;padding:2px 8px;font-size:10px;font-weight:700;margin-bottom:8px}
  .ai-text{font-size:12px;color:#166534;line-height:1.7;white-space:pre-wrap}
  .footer{background:#040a0f;color:#4a6070;padding:14px 36px;display:flex;justify-content:space-between;align-items:center;font-size:10px;margin-top:auto}
  .footer-brand{color:#00e87a;font-weight:700;font-size:12px}
  .confidential{background:#fef3c7;border:1px solid #fbbf24;border-radius:5px;padding:4px 10px;font-size:10px;color:#92400e;font-weight:600}
  .page-break{page-break-before:always}
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">
      <div class="logo-ball">⚽</div>
      <div>
        <div class="logo-text">Ficha<span>Scout</span></div>
        <div class="logo-sub">PLATAFORMA DE SCOUTING PROFESIONAL</div>
      </div>
    </div>
    <div class="header-right">
      <strong>INFORME DE SCOUTING</strong>
      Fecha: ${fecha}<br/>
      fichascout.com
    </div>
  </div>

  <!-- JUGADOR -->
  <div class="player-section">
    ${jugador.foto
      ? `<img src="${jugador.foto}" class="player-photo" alt="${jugador.nombre}" onerror="this.style.display='none'"/>`
      : `<div class="player-photo-placeholder">${pi}</div>`
    }
    <div class="player-info">
      <div class="player-pos">${pi} ${jugador.posicion}</div>
      <div class="player-name">${jugador.nombre}</div>
      <div class="player-meta">
        ${equipo || "—"} · ${liga || "—"}
        ${jugador.edad ? ` · ${jugador.edad} años` : ""}
        ${jugador.numero ? ` · #${jugador.numero}` : ""}
        ${jugador.pais ? ` · ${jugador.pais}` : ""}
      </div>
      <div class="player-stats-row">
        <div class="pstat"><div class="pstat-val">${historial?.length||0}</div><div class="pstat-lbl">Partidos</div></div>
        <div class="pstat"><div class="pstat-val">${totalMin}'</div><div class="pstat-lbl">Minutos</div></div>
        <div class="pstat"><div class="pstat-val" style="color:${avgAdj>=7?"#00a855":avgAdj>=5?"#d97706":"#dc2626"}">${avgAdj}</div><div class="pstat-lbl">Nota Adj.</div></div>
        <div class="pstat"><div class="pstat-val">/10</div><div class="pstat-lbl">Máx.</div></div>
        <div class="trend-badge">${trend}</div>
      </div>
    </div>
  </div>

  <!-- CONTENIDO -->
  <div class="content">

    <!-- RADAR + DIMENSIONES -->
    <div class="two-col">
      <div>
        <div class="section-title">Perfil por Dimensiones</div>
        <div class="radar-wrap">${radarSVG}</div>
      </div>
      <div>
        <div class="section-title">Puntuación Detallada</div>
        <div class="dims-list">
          ${DIMS_LABELS.map(d=>`
          <div class="dim-row">
            <div class="dim-name">${d.l}</div>
            <div class="dim-bar-wrap"><div class="dim-bar" style="width:${dims?.[d.k]||0}%"></div></div>
            <div class="dim-val">${dims?.[d.k]||0}</div>
          </div>`).join("")}
        </div>
      </div>
    </div>

    <!-- HISTORIAL -->
    ${historialHTML ? `
    <div class="section-title">Historial de Partidos (últimos ${Math.min(10,historial?.length||0)})</div>
    <table style="margin-bottom:20px">
      <thead class="table-header">
        <tr><th>Fecha</th><th>Rival</th><th>Tipo</th><th>Min.</th><th>Result.</th><th>Nota</th></tr>
      </thead>
      <tbody>${historialHTML}</tbody>
    </table>` : ""}

    <!-- ANÁLISIS IA -->
    ${informe ? `
    <div class="section-title">Análisis Scout con Inteligencia Artificial</div>
    <div class="ai-box">
      <div class="ai-badge">🤖 FichaScout IA</div>
      <div class="ai-text">${informe.substring(0,1200)}${informe.length>1200?"...":""}</div>
    </div>` : ""}

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div><span class="footer-brand">FichaScout</span> · fichascout.com · Plataforma de Scouting Profesional</div>
    <div class="confidential">🔒 DOCUMENTO CONFIDENCIAL</div>
    <div>Generado automáticamente con IA</div>
  </div>

</div>
</body>
</html>`;

  // Abrir ventana de impresión
  const ventana = window.open("","_blank","width=900,height=700");
  ventana.document.write(html);
  ventana.document.close();
  ventana.focus();
  setTimeout(()=>{
    ventana.print();
  }, 800);
}

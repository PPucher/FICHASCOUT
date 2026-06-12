import { useState, useEffect, useCallback, useMemo } from "react";

// ─── CONFIGURACIÓN API ────────────────────────────────────────────────────────
// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const G = "#00e87a";
const SLOTS = ["#00e87a","#3b82f6","#f59e0b","#ec4899"];
const POS_ICON  = {"Arquero":"🧤","Defensor":"🛡️","Volante":"🎨","Delantero":"🎯"};
const POS_COLOR = {"Arquero":"#f59e0b","Defensor":"#3b82f6","Volante":"#10b981","Delantero":"#ef4444"};

const STATS_DEF = [
  {k:"rat",l:"Rating",        max:10,  dec:true},
  {k:"g",  l:"Goles",         max:40},
  {k:"a",  l:"Asistencias",   max:25},
  {k:"pts",l:"Partidos",      max:38},
  {k:"min",l:"Minutos",       max:3400},
  {k:"pas",l:"Pases totales", max:2000},
  {k:"pc", l:"Pases clave",   max:100},
  {k:"dis",l:"Disparos arco", max:80},
  {k:"reg",l:"Regates",       max:80},
  {k:"tac",l:"Tackles",       max:100},
  {k:"int",l:"Intercepciones",max:80},
  {k:"due",l:"Duelos ganados",max:200},
  {k:"ata",l:"Atajadas",      max:120},
  {k:"am", l:"Amarillas",     max:12, neg:true},
];

const STATS_POS = {
  "Arquero":   ["rat","pts","min","ata","pas","am"],
  "Defensor":  ["rat","pts","min","tac","int","due","pas","g","am"],
  "Volante":   ["rat","pts","min","g","a","pas","pc","tac","int","due"],
  "Delantero": ["rat","pts","min","g","a","dis","reg","due","pas"],
};

// ─── DIFICULTAD DE LIGAS (0.55 - 1.00) ───────────────────────────────────────
const LIGA_DIF = {
  2:1.00, 39:0.97, 140:0.96, 78:0.95, 135:0.94, 61:0.93,  // CL + Big5
  3:0.92, 848:0.88, 94:0.87, 88:0.86, 144:0.85, 203:0.84, // UEL + ligas secundarias
  9:0.88, 13:0.87, 11:0.83,                                 // Copas SA
  128:0.82, 71:0.83, 253:0.81, 262:0.80,                   // Argentina, Brasil, MLS, México
  239:0.74, 268:0.72, 283:0.71, 240:0.70, 292:0.68,        // Colombia, Uruguay, Perú, Ecuador, Venezuela
  265:0.73, 266:0.61, 267:0.58,                             // Chile 1ª, 1B, Copa
  209:0.67, 282:0.66, 285:0.65,                             // Bolivia, Paraguay
  40:0.83, 141:0.81, 79:0.81, 136:0.79, 62:0.79,           // Seconds Europe
  98:0.80, 307:0.78, 106:0.76, 235:0.74,                   // J1, Saudi, Ekstraklasa, Rusia
};
const DIF_DEFAULT = 0.63;

// Etiquetas de dificultad
const DIF_LABEL = (d) =>
  d >= 0.95 ? {l:"Élite Mundial",   c:"#a855f7"} :
  d >= 0.88 ? {l:"Alta Exigencia",  c:"#ef4444"} :
  d >= 0.80 ? {l:"Alta",            c:"#f97316"} :
  d >= 0.72 ? {l:"Media-Alta",      c:"#f59e0b"} :
  d >= 0.65 ? {l:"Media",           c:"#3b82f6"} :
              {l:"Media-Baja",      c:"#64748b"};

// ─── VALOR DE MERCADO FICHASCOUT™ ─────────────────────────────────────────────
// Multiplicadores de mercado por liga (cuánto paga el mercado por liga)
const LIGA_MERCADO = {
  // UEFA / Big5
  2:4.0, 39:3.8, 140:3.2, 78:3.2, 135:3.0, 61:2.8,   // CL, PL, LaLiga, BL, SerieA, Ligue1
  3:3.5, 848:2.8,                                        // EL, Conference
  94:2.2, 88:2.2, 144:2.0, 203:1.8,                    // Portugal, Eredivisie, Bélgica, Turquía
  // Europa secundaria
  40:2.8, 141:2.5, 79:2.5, 136:2.4, 62:2.3,            // Championship, LaLiga2, BL2, SerieB, Ligue2
  98:2.0, 307:2.2, 106:1.6, 235:1.4, 197:1.5,          // J1, Saudi, Ekstraklasa, Rusia, Grecia
  // Sudamérica
  9:1.8, 13:1.8, 11:1.5,                                // Copa América, Libertadores, Sudamericana
  71:1.05, 128:0.95,                                      // Brasil SerieA (prom €3.5M), Argentina (prom €1.05M)
  239:0.38, 268:0.33, 283:0.22, 240:0.30, 292:0.18,     // Colombia, Uruguay, Perú, Ecuador, Venezuela
  265:0.19, 266:0.08, 267:0.07,                           // Chile 1ª (prom €377K), 1B (prom €165K), Copa Chile
  209:0.16, 282:0.14,                                     // Bolivia, Paraguay
  // CONCACAF
  253:1.6, 262:1.3, 254:1.0,                            // MLS, LigaMX, USL
};
const MERCADO_DEFAULT = 0.12;

// Valor base en millones EUR por posición (jugador promedio nivel 1)
const BASE_VALOR_POS = {
  "Delantero": 6.5, "Volante": 5.5, "Defensor": 4.5, "Arquero": 3.5,
  "Attacker": 6.5,  "Midfielder": 5.5, "Defender": 4.5, "Goalkeeper": 3.5,
};

// Curva de edad para valor de mercado (pico a 24-26 años)
function edadValorMult(edad) {
  if (!edad) return 0.8;
  if (edad <= 19) return 1.4 + (20 - edad) * 0.05;
  if (edad <= 23) return 1.6 + (23 - edad) * 0.05;
  if (edad <= 26) return 1.8;
  if (edad <= 29) return 1.8 - (edad - 26) * 0.12;
  if (edad <= 33) return 1.44 - (edad - 29) * 0.15;
  return Math.max(0.84 - (edad - 33) * 0.12, 0.05);
}

function calcValorMercado(j, ss) {
  const posBase = BASE_VALOR_POS[j.pos] || 5;
  const ligaMult = LIGA_MERCADO[j.l_id] || MERCADO_DEFAULT;
  const edadMult = edadValorMult(j.e);
  const scoreMult = ss ? Math.max(0.3, (ss.total / 50) * 0.85) : 0.85;

  // Contribución goles+asistencias
  const ga = j.s ? ((j.s.g || 0) + (j.s.a || 0)) : 0;
  const pts = j.s?.pts || 1;
  const gaMult = 1 + Math.min((ga / pts) * 0.4, 0.8);

  const valorBase = posBase * ligaMult * edadMult * scoreMult * gaMult;
  const min = Math.round(valorBase * 0.75 * 10) / 10;
  const max = Math.round(valorBase * 1.35 * 10) / 10;
  const mid = Math.round(valorBase * 10) / 10;

  // Format display
  const fmt = (v) => v >= 100 ? `€${Math.round(v)}M` : v >= 10 ? `€${v.toFixed(1)}M` : v >= 1 ? `€${v.toFixed(1)}M` : `€${(v*1000).toFixed(0)}K`;

  const label =
    mid >= 80 ? {l:"Estrella mundial",  c:"#a855f7"} :
    mid >= 40 ? {l:"Figura de liga top",c:"#ef4444"} :
    mid >= 20 ? {l:"Jugador de nivel alto",c:"#f97316"} :
    mid >= 8   ? {l:"Fichaje de valor",      c:"#f59e0b"} :
    mid >= 0.5 ? {l:"Jugador de liga local", c:"#3b82f6"} :
                 {l:"Promesa regional",      c:"#64748b"};

  return { min, max, mid, fmt: `${fmt(min)} – ${fmt(max)}`, midFmt: fmt(mid), label, ligaMult };
}


// ─── SCOUT SCORE ─────────────────────────────────────────────────────────────
function calcScoutScore(j) {
  const s = j.s;
  if (!s || (!s.rat && !s.pts)) return null;

  const rat    = parseFloat(s.rat) || 0;
  const edad   = j.e || 25;
  const pts    = s.pts  || 0;
  const min    = s.min  || 0;
  const pos    = j.pos  || "Volante";
  const ligaDif= LIGA_DIF[j.l_id] || DIF_DEFAULT;

  // ── 1. RENDIMIENTO (30%) ─────────────────────────────────────────────────
  // Basado en rating + G+A por partido + stats defensivas según posición
  let rend = 0;
  if (rat > 0) rend += (rat / 10) * 55;  // rating base (55pts máx)
  const ga = ((s.g || 0) + (s.a || 0));
  if (pts > 0) rend += Math.min((ga / pts) * 25, 30); // G+A por partido
  if (pos === "Defensor" || pos === "Arquero") {
    const def = ((s.tac||0)+(s.int||0)) / Math.max(pts,1);
    rend += Math.min(def * 2, 15);
  }
  if (pos === "Arquero" && s.ata) rend += Math.min((s.ata / Math.max(pts,1)) * 3, 15);
  rend = Math.min(rend, 100);

  // ── 2. EDAD / CURVA DE CARRERA (25%) ─────────────────────────────────────
  // Pico de valor a los 23-26 años
  let edadScore = 0;
  if      (edad <= 19) edadScore = 72 + (20 - edad) * 2;
  else if (edad <= 23) edadScore = 78 + (23 - edad) * 1.5;
  else if (edad <= 26) edadScore = 92 + (25 - Math.abs(edad - 25)) * 2;
  else if (edad <= 29) edadScore = 85 - (edad - 26) * 4;
  else if (edad <= 32) edadScore = 73 - (edad - 29) * 4;
  else                 edadScore = Math.max(61 - (edad - 32) * 3, 20);
  edadScore = Math.min(edadScore, 100);

  // ── 3. POTENCIAL (20%) ───────────────────────────────────────────────────
  // Joven + alto rendimiento = altísimo potencial
  const ratNorm = rat > 0 ? (rat / 10) : 0.65;
  let potencial = 0;
  if      (edad <= 21) potencial = Math.min(ratNorm * 100 * 1.35, 100);
  else if (edad <= 24) potencial = Math.min(ratNorm * 100 * 1.20, 100);
  else if (edad <= 27) potencial = Math.min(ratNorm * 100 * 1.05, 100);
  else                 potencial = Math.min(ratNorm * 100 * 0.85, 100);

  // ── 4. REGULARIDAD (15%) ─────────────────────────────────────────────────
  // Cuántos partidos de 38 posibles jugó y % de minutos disponibles
  let regular = 0;
  const ptsNorm = Math.min((pts / 30) * 100, 100);     // 30P = 100%
  const minNorm = min > 0 ? Math.min((min / 2500) * 100, 100) : ptsNorm * 0.7;
  regular = ptsNorm * 0.4 + minNorm * 0.6;

  // ── 5. NIVEL COMPETITIVO (10%) ───────────────────────────────────────────
  const nivelScore = ligaDif * 100;

  // ── SCORE PONDERADO ──────────────────────────────────────────────────────
  const raw =
    rend     * 0.30 +
    edadScore* 0.25 +
    potencial* 0.20 +
    regular  * 0.15 +
    nivelScore * 0.10;

  // Multiplicador por exigencia de liga (penaliza/premia según competencia)
  const ajustado = raw * (0.6 + ligaDif * 0.55);
  const total = Math.min(Math.round(ajustado), 100);

  const label =
    total >= 88 ? {l:"ÉLITE",         c:"#a855f7", bg:"rgba(168,85,247,0.15)"} :
    total >= 78 ? {l:"DESTACADO",     c:"#00a855", bg:"rgba(0,168,85,0.12)"}  :
    total >= 68 ? {l:"SÓLIDO",        c:"#3b82f6", bg:"rgba(59,130,246,0.12)"} :
    total >= 58 ? {l:"PROMEDIO",      c:"#f59e0b", bg:"rgba(245,158,11,0.12)"} :
                  {l:"EN DESARROLLO", c:"#ef4444", bg:"rgba(239,68,68,0.12)"};

  return {
    total,
    label,
    dif: ligaDif,
    difLabel: DIF_LABEL(ligaDif),
    comp: {
      rendimiento: Math.round(rend),
      edad:        Math.round(edadScore),
      potencial:   Math.round(potencial),
      regularidad: Math.round(regular),
      nivel:       Math.round(nivelScore),
    }
  };
}

// ─── COMPONENTE SCOUT SCORE ───────────────────────────────────────────────────
function ScoutScoreBar({score, compact=false}) {
  if (!score) return null;
  const {total, label, difLabel, comp} = score;

  if (compact) return(
    <div style={{background:label.bg,border:`1px solid ${label.c}33`,borderRadius:8,padding:"5px 10px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{fontWeight:900,fontSize:19,color:label.c,lineHeight:1}}>{total}</div>
      <div>
        <div style={{fontSize:9,fontWeight:700,color:label.c,letterSpacing:.5}}>{label.l}</div>
        <div style={{fontSize:9,color:"#4a6070"}}>Scout Score</div>
      </div>
    </div>
  );

  const bars = [
    {l:"Rendimiento",  v:comp.rendimiento, c:"#00e87a",  p:30},
    {l:"Edad/Curva",   v:comp.edad,        c:"#3b82f6",  p:25},
    {l:"Potencial",    v:comp.potencial,   c:"#a855f7",  p:20},
    {l:"Regularidad",  v:comp.regularidad, c:"#f59e0b",  p:15},
    {l:"Nivel liga",   v:comp.nivel,       c:difLabel.c, p:10},
  ];

  return(
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <div style={{fontSize:11,color:"#4a6070",fontWeight:600,letterSpacing:.5,marginBottom:3}}>🏅 SCOUT SCORE</div>
          <div style={{fontSize:10,color:"#3a5060"}}>Algoritmo exclusivo FichaScout · No disponible en API-Football</div>
        </div>
        <div style={{textAlign:"center",background:label.bg,border:`1px solid ${label.c}44`,borderRadius:12,padding:"8px 14px"}}>
          <div style={{fontWeight:900,fontSize:32,color:label.c,lineHeight:1}}>{total}</div>
          <div style={{fontSize:8,color:label.c,fontWeight:700,letterSpacing:.5,marginTop:2}}>/100 · {label.l}</div>
        </div>
      </div>

      {bars.map(b=>(
        <div key={b.l} style={{marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:11,color:"#64748b"}}>{b.l}</span>
              <span style={{fontSize:9,color:"#3a5060",background:"rgba(255,255,255,0.04)",borderRadius:3,padding:"0 4px"}}>{b.p}%</span>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:b.c}}>{b.v}<span style={{fontSize:9,color:"#4a6070"}}>/100</span></span>
          </div>
          <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3}}>
            <div style={{width:`${b.v}%`,height:"100%",background:b.c,borderRadius:3,transition:"width .4s ease"}}/>
          </div>
        </div>
      ))}

      <div style={{marginTop:10,padding:"7px 10px",background:`${difLabel.c}10`,border:`1px solid ${difLabel.c}25`,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:"#64748b"}}>Exigencia de liga:</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontWeight:700,color:difLabel.c,fontSize:11}}>{difLabel.l}</span>
          <span style={{background:`${difLabel.c}20`,color:difLabel.c,borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700}}>×{score.dif.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── PROMPTS IA ───────────────────────────────────────────────────────────────
function buildPromptIndividual(j, ss, vm) {
  const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);
  const statsStr = statsKeys.map(k=>{
    const def = STATS_DEF.find(s=>s.k===k);
    const v = j.s?.[k];
    return v!=null ? `${def?.l||k}: ${v}` : null;
  }).filter(Boolean).join(" | ");

  const ssInfo = ss ? `Scout Score: ${ss.total}/100 (${ss.label.l}) | Rendimiento:${ss.comp.rendimiento} Edad:${ss.comp.edad} Potencial:${ss.comp.potencial} Regularidad:${ss.comp.regularidad} Nivel:${ss.comp.nivel} | Liga: ${ss.difLabel.l} ×${ss.dif.toFixed(2)}` : "N/A";
  const vmInfo = vm ? `Rango estimado: ${vm.fmt} (central: ${vm.midFmt}) | Multiplicador mercado liga: ×${vm.ligaMult.toFixed(2)}` : "N/A";

  return `Eres el Chief Scout oficial de un club profesional. Genera el INFORME PROFESIONAL COMPLETO para el Director Deportivo. Usa datos concretos en CADA sección. Sé honesto, profundo y táctico:

JUGADOR: ${j.n} | ${j.pos} | ${j.e||"—"}a | ${j.pais||"—"} | ${j.alt||""} ${j.pes||""}
CLUB: ${j.eq} | ${j.l} | ${j.reg} | Nivel ${j.nv===1?"1ª División":j.nv===2?"2ª División":"Regional"}
SCOUT SCORE FICHASCOUT™: ${ssInfo}
ESTADÍSTICAS 2024: ${statsStr}
VALOR MERCADO ESTIMADO: ${vmInfo}

Responde con EXACTAMENTE estas 7 secciones:

━━━ 📊 ESTADÍSTICAS CLAVE Y CONTEXTO ━━━
Analiza los 4-5 números más importantes. Para CADA estadística: cita el valor exacto, compara con el promedio de su posición en ${j.l} (dando un porcentaje o percentil aproximado) y explica su impacto táctico real.

━━━ 💪 FORTALEZAS INDIVIDUALES ━━━
4-5 fortalezas. CADA UNA debe: citar la estadística exacta que la respalda + explicar el beneficio táctico concreto que aporta a un equipo (cómo cambia el juego del equipo cuando este jugador activa esta fortaleza).

━━━ ⚠️ DEBILIDADES Y RIESGOS ━━━

[A] DEBILIDADES PERSONALES DEL JUGADOR:
Analiza 3 debilidades propias basadas en sus estadísticas o ausencia de ellas: qué hace mal técnicamente, qué evita, qué le falta para ser un jugador completo en su posición. Cita datos específicos (o la ausencia notable de ciertos datos) como evidencia.

[B] DEBILIDADES QUE GENERA EN EL EQUIPO:
Analiza 2-3 problemas tácticos que su forma de jugar GENERA AL EQUIPO: espacios que deja desprotegidos, zonas del campo que no cubre, situaciones específicas (transición defensiva, presión alta, balón parado) donde el equipo se ve perjudicado por su estilo. Sé concreto y táctico, no genérico.

━━━ 🏆 COMPARACIÓN CON SU LIGA ━━━
Compara sus stats clave contra el jugador promedio de su posición en ${j.l}. ¿Top 10%, top 25%, promedio, por debajo? Menciona 2-3 jugadores reales de la ${j.l} o ligas similares con quienes se compara favorablemente o desfavorablemente. Qué lo hace diferente del resto.

━━━ 🎯 PERFIL TÁCTICO IDEAL ━━━
Sistema específico (4-3-3 / 4-4-2 / 3-5-2 etc.) donde maximizaría rendimiento. Rol exacto dentro del sistema. Tipo de compañeros que necesita. Perfil de DT que lo potenciaría. Nombra un club real concreto donde encajaría perfectamente y explica por qué.

━━━ 💰 VALOR DE MERCADO ━━━
Nuestro algoritmo estima: ${vm?.fmt||"Sin datos"}
Confirma, ajusta o corrige este rango con tu análisis experto. Cita 2-3 transferencias reales recientes de jugadores comparables como referencia de precio. Considera: liga de origen (${j.l}, multiplicador ×${vm?.ligaMult?.toFixed(2)||"N/A"} vs Premier League), edad, Scout Score ${ss?.total||"N/A"}/100, momento de carrera.

━━━ ⭐ RECOMENDACIÓN FINAL ━━━
Scout Score: ${ss?.total||"N/A"}/100 | Valor: ${vm?.midFmt||"N/A"}
VEREDICTO: [PRIORITARIO / RECOMENDADO / SEGUIMIENTO / NO RECOMENDADO]
Justificación en 3-4 líneas: por qué esta calificación, para qué perfil de club es ideal, en qué momento ficharlo (ahora / próxima ventana / esperar). Sé directo como en una reunión de directorio.`;
}


function buildPromptComparacion(jugadores, scores) {
  const ficha = (j, ss, idx) => {
    const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);
    const stats = statsKeys.map(k=>{const def=STATS_DEF.find(s=>s.k===k);const v=j.s?.[k];return v!=null?`${def?.l||k}:${v}`:null}).filter(Boolean).join(" | ");
    return `OPCIÓN ${idx+1}: ${j.n} (${j.pos}, ${j.e||"—"}a, ${j.pais||"—"})
  Club: ${j.eq} | Liga: ${j.l} (Exigencia: ${ss ? ss.difLabel.l+" ×"+ss.dif.toFixed(2) : "N/A"})
  Scout Score: ${ss?.total||"N/A"}/100 → ${ss?.label.l||""}
  Stats: ${stats}
  Desglose Scout Score: Rend.${ss?.comp.rendimiento||0} | Pot.${ss?.comp.potencial||0} | Edad:${ss?.comp.edad||0} | Reg:${ss?.comp.regularidad||0} | Liga:${ss?.comp.nivel||0}`;
  };

  return `Eres Chief Scout de un club profesional. Genera un informe comparativo COMPLETO para el Director Deportivo. ES OBLIGATORIO completar las SEIS secciones sin excepción. IMPORTANTE: en la sección de FORTALEZAS Y DEBILIDADES incluye para CADA jugador su valor de mercado estimado (dato disponible en el análisis) — la sección de RECOMENDACIÓN FINAL es la más importante y NUNCA puede quedar incompleta. Sé conciso (máx 4 líneas por jugador por sección) pero cubre a TODOS los jugadores en TODAS las secciones.

${jugadores.map((j,i)=>ficha(j,scores[i],i)).join("\n\n")}

━━━ 📊 RESUMEN EJECUTIVO ━━━
En 3 líneas: diferencia principal entre los ${jugadores.length} jugadores y quién lidera claramente.

━━━ 💪 FORTALEZAS Y ⚠️ DEBILIDADES ━━━
${jugadores.map((j,i)=>`[${i+1}] ${j.n} — FORTALEZAS: (2 fortalezas clave con dato concreto) | DEBILIDADES: (2 limitaciones reales con dato concreto o ausencia notable)`).join("\n")}

━━━ 📈 ESTADÍSTICAS Y EXIGENCIA DE LIGA ━━━
Para las 3 stats más relevantes: quién lidera y por cuánto. Luego ajusta por exigencia: ¿quién rinde más considerando su multiplicador de liga (×${scores.map(s=>s?.dif?.toFixed(2)||'N/A').join(' / ')})?  ¿Cuál tiene mayor mérito estadístico real?

━━━ 🎯 PERFIL TÁCTICO ━━━
${jugadores.map((j,i)=>`[${i+1}] ${j.n}: sistema ideal, rol exacto, tipo de club donde encaja.`).join("\n")}

━━━ ⭐ RECOMENDACIÓN FINAL ━━━
RANKING: ${jugadores.map((_,i)=>i+1+"°").join(" > ")} (completa el orden de mayor a menor recomendación con los nombres reales)

VEREDICTO CLARO — SI SOLO PUEDES FICHAR UNO:
· ¿Cuál es y por qué? (nombra al jugador explícitamente)
· ¿Para qué perfil de club es ideal?
· ¿Cuándo ficharlo — ahora, próxima ventana o esperar?
· Scout Score líder: ${Math.max(...scores.map(s=>s?.total||0))}/100 — ¿justifica la inversión vs los demás?`;
}

function mdToHtml(text) {
  if (!text) return '';
  var t = text;
  t = t.replace(/^### (.+)$/gm, '<h4 style="font-size:13px;font-weight:800;color:#0f172a;margin:14px 0 5px;padding-bottom:4px;border-bottom:1px solid #e2e8f0">$1</h4>');
  t = t.replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:800;color:#0f172a;margin:18px 0 7px;border-bottom:2px solid #00e87a55;padding-bottom:5px">$1</h3>');
  t = t.replace(/^# (.+)$/gm, '<h2 style="font-size:17px;font-weight:900;color:#0f172a;margin:20px 0 8px">$1</h2>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:#0f172a">$1</strong>');
  t = t.replace(/\*([^*]+)\*/g, '<em style="color:#374151">$1</em>');
  t = t.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0"/>');
  t = t.replace(/^> (.+)$/gm, '<div style="border-left:3px solid #00e87a;padding:7px 12px;background:#f8fffe;margin:8px 0;color:#065f46;font-size:11.5px;font-style:italic">$1</div>');
  t = t.replace(/^[\-\*] (.+)$/gm, '<li style="margin:4px 0;padding-left:2px">$1</li>');
  t = t.replace(/(<li[^>]*>[\s\S]*?<\/li>)/g, function(m){ return '<ul style="margin:6px 0 6px 18px;padding:0">' + m + '</ul>'; });
  t = t.replace(/^\|([\s\|\-:]+)\|$/gm, '');
  t = t.replace(/^\|(.+)\|$/gm, function(match, cells) { var tds = cells.split('|').map(function(td){ return td.trim(); }).filter(Boolean); return '<tr>' + tds.map(function(td){ return '<td style="padding:6px 9px;border:1px solid #e2e8f0;font-size:11px">' + td.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>') + '</td>'; }).join('') + '</tr>'; });
  t = t.replace(/(<tr>[\s\S]*?<\/tr>)/g, function(m){ return '<table style="width:100%;border-collapse:collapse;margin:10px 0">' + m + '</table>'; });
  t = t.replace(/\n{2,}/g, '</p><p style="margin:0 0 10px;text-align:justify;line-height:1.8">');
  t = t.replace(/\n/g, '<br>');
  return '<p style="margin:0 0 10px;text-align:justify;line-height:1.8">' + t + '</p>';
}

// ─── PDF INDIVIDUAL ───────────────────────────────────────────────────────────
function exportPDFIndividual(j, iaText, ss, vm) {
  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const c = POS_COLOR[j.pos] || G;
  const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);

  const ssHTML = ss ? `
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div><div style="font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px">🏅 SCOUT SCORE FICHASCOUT</div><div style="font-size:9px;color:#94a3b8;margin-top:1px">Algoritmo exclusivo · No disponible en API-Football</div></div>
      <div style="background:${ss.label.bg};border:1px solid ${ss.label.c}44;border-radius:10px;padding:8px 14px;text-align:center"><div style="font-size:28px;font-weight:900;color:${ss.label.c};line-height:1">${ss.total}</div><div style="font-size:9px;color:${ss.label.c};font-weight:700">/100 · ${ss.label.l}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:8px">
      ${[["Rendimiento",ss.comp.rendimiento,"#00e87a","30%"],["Edad/Curva",ss.comp.edad,"#3b82f6","25%"],["Potencial",ss.comp.potencial,"#a855f7","20%"],["Regularidad",ss.comp.regularidad,"#f59e0b","15%"],["Nivel liga",ss.comp.nivel,ss.difLabel.c,"10%"]].map(([l,v,col,p])=>`
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:7px;padding:7px;text-align:center">
        <div style="font-size:16px;font-weight:800;color:${col}">${v}</div>
        <div style="font-size:8px;color:#374151;margin-top:1px">${l}</div>
        <div style="font-size:8px;color:#94a3b8">${p}</div>
      </div>`).join("")}
    </div>
    <div style="background:${ss.difLabel.c}10;border:1px solid ${ss.difLabel.c}25;border-radius:6px;padding:6px 10px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:10px;color:#374151">Exigencia de liga:</span>
      <span style="font-weight:700;color:${ss.difLabel.c};font-size:11px">${ss.difLabel.l} · ×${ss.dif.toFixed(2)}</span>
    </div>
  </div>` : "";

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/><title>FichaScout — ${j.n}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4;margin:13mm}</style>
</head><body>

<!-- HEADER -->
<div style="background:linear-gradient(135deg,#040a0f,#071520);padding:18px 26px;display:flex;justify-content:space-between;align-items:center;border-radius:10px;margin-bottom:16px">
  <div style="display:flex;align-items:center;gap:12px">
    <div style="width:42px;height:42px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:21px">⚽</div>
    <div><div style="font-weight:800;font-size:20px;color:#fff">Ficha<span style="color:#00e87a">Scout</span></div><div style="font-size:9px;color:#3a5060;letter-spacing:2px">PLATAFORMA DE SCOUTING PROFESIONAL</div></div>
  </div>
  <div style="text-align:right"><div style="color:#fff;font-weight:800;font-size:14px">FICHA DE SCOUTING PROFESIONAL</div><div style="color:#3a5060;font-size:10px;margin-top:2px">${fecha} · fichascout.com</div></div>
</div>

<!-- JUGADOR -->
<div style="display:flex;gap:18px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${c};border-radius:12px;padding:16px 18px;margin-bottom:14px">
  <div style="width:82px;height:82px;border-radius:50%;overflow:hidden;border:3px solid ${c}55;flex-shrink:0">
    <img src="${j.foto}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:32px>${POS_ICON[j.pos]||"⚽"}</div>'"/>
  </div>
  <div style="flex:1">
    <div style="display:inline-block;background:${c}15;color:${c};border:1px solid ${c}44;border-radius:5px;padding:2px 9px;font-size:10px;font-weight:700;margin-bottom:5px">${POS_ICON[j.pos]||""} ${j.pos}</div>
    <div style="font-weight:800;font-size:22px;color:#0f172a;margin-bottom:3px">${j.n}</div>
    <div style="font-size:12px;color:#64748b;margin-bottom:8px">${j.eq} · ${j.l} · ${j.reg}${j.nv===1?" · 1ª División":j.nv===2?" · 2ª División":""}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${[["Edad",j.e?`${j.e}a`:"—"],["País",j.pais||"—"],["Altura",j.alt||"—"],["Peso",j.pes||"—"]].map(([l,v])=>`<div style="background:#fff;border:1px solid #e2e8f0;border-radius:7px;padding:6px 10px;text-align:center"><div style="font-size:13px;font-weight:800;color:#0f172a">${v}</div><div style="font-size:8px;color:#94a3b8;margin-top:1px">${l}</div></div>`).join("")}
      ${j.s?.rat?`<div style="background:${c}10;border:1px solid ${c}44;border-radius:7px;padding:6px 10px;text-align:center"><div style="font-size:16px;font-weight:800;color:${parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#dc2626"}">★ ${j.s.rat}</div><div style="font-size:8px;color:#94a3b8;margin-top:1px">Rating</div></div>`:""}
      ${ss?`<div style="background:${ss.label.bg};border:1px solid ${ss.label.c}44;border-radius:7px;padding:6px 10px;text-align:center"><div style="font-size:16px;font-weight:800;color:${ss.label.c}">${ss.total}</div><div style="font-size:8px;color:${ss.label.c};margin-top:1px">Scout Score</div></div>`:""}
    </div>
  </div>
</div>

<!-- SCOUT SCORE -->
${ssHTML}

<!-- ESTADÍSTICAS -->
<div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:14px">
  <div style="background:#f1f5f9;padding:8px 14px;font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px;border-bottom:1px solid #e2e8f0">ESTADÍSTICAS DE TEMPORADA · ${j.l} 2024</div>
  <div style="padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:6px">
    ${statsKeys.filter(k=>j.s?.[k]!=null).map(k=>{
      const def=STATS_DEF.find(s=>s.k===k);
      const v=parseFloat(j.s[k])||0;
      const pct=Math.min((v/(def?.max||100))*100,100);
      return `<div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:11px;color:#374151;min-width:105px">${def?.l||k}</span>
        <div style="flex:1;height:4px;background:#e2e8f0;border-radius:2px"><div style="width:${pct}%;height:100%;background:${c};border-radius:2px"></div></div>
        <span style="font-size:11px;font-weight:700;color:${c};min-width:28px;text-align:right">${j.s[k]}</span>
      </div>`;
    }).join("")}
  </div>
</div>

${iaText?`
<!-- ANÁLISIS IA -->
<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px;margin-bottom:14px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <div style="font-size:11px;font-weight:700;color:#166534;letter-spacing:.5px">ANÁLISIS SCOUT CON INTELIGENCIA ARTIFICIAL</div>
    <span style="background:#00a85515;color:#00a855;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700">🤖 FichaScout PRO</span>
  </div>
  <div style="font-size:12.5px;color:#1e293b;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif">${mdToHtml(iaText)}</div>
</div>`:""}

<div style="background:#040a0f;border-radius:8px;padding:10px 18px;display:flex;justify-content:space-between;align-items:center">
  <div style="display:flex;align-items:center;gap:8px"><div style="width:20px;height:20px;background:#00e87a;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px">⚽</div><span style="color:#00e87a;font-weight:800;font-size:12px">FichaScout</span><span style="color:#3a5060;font-size:10px">· fichascout.com</span></div>
  <span style="color:#3a5060;font-size:10px">Scout Score™ · Algoritmo exclusivo FichaScout</span>
  <span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700">🔒 CONFIDENCIAL</span>
</div>
</body></html>`;

  const v=window.open("","_blank","width=900,height=700");
  v.document.write(html); v.document.close(); v.focus();
  setTimeout(()=>v.print(),900);
}

// ─── PDF COMPARACIÓN ──────────────────────────────────────────────────────────
function exportPDFComparacion(jugadores, scores, iaText) {
  const fecha = new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const cols = SLOTS.slice(0,jugadores.length);

  const playerCard = (j,ss,i) => `
  <div style="background:#f8fafc;border:2px solid ${cols[i]}33;border-radius:12px;padding:14px;text-align:center">
    <div style="width:60px;height:60px;border-radius:50%;overflow:hidden;margin:0 auto 8px;border:2px solid ${cols[i]}">
      <img src="${j.foto}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=padding:8px;font-size:24px>${POS_ICON[j.pos]||"⚽"}</div>'"/>
    </div>
    <div style="font-weight:800;font-size:13px;color:#0f172a;margin-bottom:2px">${j.n}</div>
    <div style="font-size:10px;color:#64748b">${j.eq}</div>
    <div style="font-size:9px;color:#94a3b8;margin-bottom:6px">${j.l}</div>
    ${j.e?`<span style="background:#f1f5f9;color:#374151;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:600">${j.e}a</span> `:""}
    <span style="background:${cols[i]}15;color:${cols[i]};border-radius:4px;padding:1px 6px;font-size:9px;font-weight:700">${POS_ICON[j.pos]} ${j.pos}</span>
    ${j.s?.rat?`<div style="font-size:16px;font-weight:800;color:${parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#dc2626"};margin-top:5px">★${j.s.rat}</div>`:""}
    ${ss?`<div style="background:${ss.label.bg};border:1px solid ${ss.label.c}33;border-radius:7px;padding:5px;margin-top:5px">
      <div style="font-size:18px;font-weight:900;color:${ss.label.c}">${ss.total}</div>
      <div style="font-size:8px;color:${ss.label.c};font-weight:700">Scout Score · ${ss.label.l}</div>
      <div style="font-size:8px;color:#94a3b8">×${ss.dif.toFixed(2)} ${ss.difLabel.l}</div>
    </div>`:""}
    ${(()=>{try{const vm=calcValorMercado(j,ss);return vm?'<div style="background:'+vm.label.c+'10;border:1px solid '+vm.label.c+'33;border-radius:7px;padding:5px;margin-top:4px;text-align:center"><div style="font-size:8px;color:#94a3b8;margin-bottom:1px">💰 VALOR ESTIMADO</div><div style="font-size:14px;font-weight:900;color:'+vm.label.c+'">'+vm.midFmt+'</div><div style="font-size:8px;color:'+vm.label.c+';font-weight:600">'+vm.fmt+'</div></div>':'';}catch(e){return '';}})()}
  </div>`;

  const statsRelevantes = jugadores.length>0
    ? (STATS_POS[jugadores[0].pos]||STATS_DEF.map(s=>s.k)).filter(k=>jugadores.some(j=>j.s?.[k]!=null))
    : STATS_DEF.filter(st=>jugadores.some(j=>j.s?.[st.k]!=null)).map(s=>s.k);

  const statRow = (k) => {
    const def=STATS_DEF.find(s=>s.k===k);
    if(!def) return "";
    const vals=jugadores.map(j=>parseFloat(j.s?.[k])||0);
    const max=Math.max(...vals);
    return `<tr>
      <td style="padding:6px 11px;font-size:10px;color:#374151;border-bottom:1px solid #f1f5f9;white-space:nowrap">${def.l}</td>
      ${jugadores.map((j,i)=>{const v=j.s?.[k];const n=parseFloat(v)||0;const best=n===max&&max>0&&!def.neg;const pct=def.max?Math.min((n/def.max)*100,100):(max>0?Math.min((n/max)*100,100):0);
      return `<td style="padding:6px 11px;border-bottom:1px solid #f1f5f9;min-width:110px">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="flex:1;height:3px;background:#e2e8f0;border-radius:1px"><div style="width:${pct}%;height:100%;background:${best?cols[i]:"#cbd5e1"}"></div></div>
          <span style="font-size:11px;font-weight:${best?800:500};color:${best?cols[i]:"#374151"};min-width:24px;text-align:right">${v??'—'}</span>
        </div>
        ${best?`<div style="font-size:8px;color:${cols[i]};font-weight:700">▲ MEJOR</div>`:""}
      </td>`;}).join("")}
    </tr>`;
  };

  const ssRow = (label, key) => `<tr>
    <td style="padding:5px 11px;font-size:10px;color:#374151;border-bottom:1px solid #f8fafc">${label}</td>
    ${scores.map((ss,i)=>{
      const v=ss?.comp?.[key]||0;
      const max=Math.max(...scores.map(s=>s?.comp?.[key]||0));
      const best=v===max&&max>0;
      return `<td style="padding:5px 11px;border-bottom:1px solid #f8fafc;text-align:center"><span style="font-size:11px;font-weight:${best?800:500};color:${best?cols[i]:"#374151"}">${v}${best?" ▲":""}</span></td>`;
    }).join("")}
  </tr>`;

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/><title>FichaScout — Comparación</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4 landscape;margin:11mm}</style>
</head><body>

<div style="background:linear-gradient(135deg,#040a0f,#071520);padding:15px 22px;display:flex;justify-content:space-between;align-items:center;border-radius:10px;margin-bottom:12px">
  <div style="display:flex;align-items:center;gap:10px">
    <div style="width:36px;height:36px;background:linear-gradient(135deg,#00e87a,#00c96a);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px">⚽</div>
    <div><div style="font-weight:800;font-size:17px;color:#fff">Ficha<span style="color:#00e87a">Scout</span></div><div style="font-size:8px;color:#3a5060;letter-spacing:2px">PLATAFORMA DE SCOUTING PROFESIONAL</div></div>
  </div>
  <div style="text-align:right"><div style="color:#fff;font-weight:800;font-size:13px">INFORME COMPARATIVO · SCOUT SCORE™</div><div style="color:#3a5060;font-size:9px;margin-top:1px">${jugadores.length} jugadores · ${fecha} · fichascout.com</div></div>
</div>

<div style="display:grid;grid-template-columns:repeat(${jugadores.length},1fr);gap:10px;margin-bottom:12px">
  ${jugadores.map((j,i)=>playerCard(j,scores[i],i)).join("")}
</div>

<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px;margin-bottom:12px">
  <!-- Scout Scores -->
  <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#f1f5f9,#e8edf5);padding:8px 12px;border-bottom:2px solid #e2e8f0;font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px">🏅 SCOUT SCORE™ — Algoritmo Exclusivo FichaScout</div>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:#f8fafc">
        <th style="padding:6px 11px;font-size:9px;color:#94a3b8;text-align:left;border-bottom:1px solid #e2e8f0">COMPONENTE</th>
        ${jugadores.map((j,i)=>`<th style="padding:6px 11px;font-size:10px;font-weight:700;color:${cols[i]};text-align:center;border-bottom:2px solid ${cols[i]}">${j.n.split(" ")[0]}</th>`).join("")}
      </tr></thead>
      <tbody>
        <tr style="background:#f0fdf4"><td style="padding:7px 11px;font-size:11px;font-weight:800;color:#374151;border-bottom:2px solid #e2e8f0">TOTAL /100</td>${scores.map((ss,i)=>{const max=Math.max(...scores.map(s=>s?.total||0));const best=(ss?.total||0)===max;return `<td style="padding:7px 11px;text-align:center;border-bottom:2px solid ${best?cols[i]:"#e2e8f0"}"><span style="font-size:17px;font-weight:900;color:${best?cols[i]:"#374151"}">${ss?.total||"N/A"}</span> ${best?"▲":""}</td>`;}).join("")}</tr>
        ${ssRow("Rendimiento (30%)", "rendimiento")}
        ${ssRow("Edad/Curva (25%)", "edad")}
        ${ssRow("Potencial (20%)", "potencial")}
        ${ssRow("Regularidad (15%)", "regularidad")}
        ${ssRow("Nivel liga (10%)", "nivel")}
        <tr><td style="padding:6px 11px;font-size:10px;color:#374151">Multiplicador liga</td>${scores.map((ss,i)=>`<td style="padding:6px 11px;text-align:center;font-size:10px;color:${ss?.difLabel?.c||"#374151"};font-weight:700">×${ss?.dif?.toFixed(2)||"—"}<br/><span style="font-size:8px">${ss?.difLabel?.l||""}</span></td>`).join("")}</tr>
      </tbody>
    </table>
  </div>

  <!-- Stats -->
  <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
    <div style="background:#f8fafc;padding:8px 12px;border-bottom:2px solid #e2e8f0;font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px">ESTADÍSTICAS COMPARATIVAS · ▲ MEJOR</div>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr><th style="padding:6px 11px;font-size:9px;color:#94a3b8;text-align:left;border-bottom:1px solid #e2e8f0">ESTADÍSTICA</th>${jugadores.map((j,i)=>`<th style="padding:6px 11px;font-size:10px;font-weight:700;color:${cols[i]};text-align:left;border-bottom:2px solid ${cols[i]}">${j.n.split(" ")[0]}</th>`).join("")}</tr></thead>
      <tbody>${statsRelevantes.map(k=>statRow(k)).join("")}</tbody>
    </table>
  </div>
</div>

${iaText?`<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:12px;margin-bottom:10px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px"><div style="font-size:10px;font-weight:700;color:#166534;letter-spacing:.5px">ANÁLISIS COMPARATIVO — FichaScout IA PROFESIONAL</div><span style="background:#00a85515;color:#00a855;border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700">🤖 Scout IA</span></div>
  <div style="font-size:12.5px;color:#1e293b;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif">${iaText}</div>
</div>`:""}

<div style="background:#040a0f;border-radius:8px;padding:9px 16px;display:flex;justify-content:space-between;align-items:center">
  <div style="display:flex;align-items:center;gap:6px"><div style="width:16px;height:16px;background:#00e87a;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px">⚽</div><span style="color:#00e87a;font-weight:800;font-size:11px">FichaScout</span></div>
  <span style="color:#3a5060;font-size:9px">Scout Score™ · Algoritmo exclusivo · fichascout.com</span>
  <span style="background:#fef3c7;color:#92400e;padding:2px 7px;border-radius:3px;font-size:9px;font-weight:700">🔒 CONFIDENCIAL</span>
</div>
</body></html>`;

  const v=window.open("","_blank","width=1200,height=800");
  v.document.write(html); v.document.close(); v.focus();
  setTimeout(()=>v.print(),900);
}

// ─── MODAL JUGADOR ────────────────────────────────────────────────────────────
function ModalJugador({j, ss, vm, onClose, onToggle, enCompar}) {
  const [iaText, setIaText] = useState("");
  const [loadIA, setLoadIA] = useState(false);
  const c = POS_COLOR[j.pos] || G;

  async function generarIA() {
    setLoadIA(true); setIaText("");
    try {
      const r = await fetch("/api/claude", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          stream: true,
          messages: [{role: "user", content: buildPromptIndividual(j, ss, vm)}]
        }),
      });
      if (!r.ok) {
        let errMsg = "HTTP " + r.status;
        try { const e = await r.json(); errMsg = e.error || e.message || errMsg; } catch {}
        throw new Error(errMsg);
      }
      // Leer stream SSE - evita timeout de 25s en Vercel Hobby
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, {stream: true});
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const evt = JSON.parse(data);
            if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
              fullText += evt.delta.text;
              setIaText(fullText);
            }
          } catch {}
        }
      }
      if (!fullText) setIaText("No se recibio respuesta.");
    } catch(e) { setIaText("Error: " + e.message); }
    setLoadIA(false);
  }
  }

  const statsKeys = STATS_POS[j.pos] || STATS_DEF.map(s=>s.k);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 16px"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#07111a",borderRadius:18,border:"1px solid rgba(255,255,255,0.09)",width:"100%",maxWidth:920,maxHeight:"96vh",overflowY:"auto"}}>

        {/* Header */}
        <div style={{background:`${c}0a`,padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:13,alignItems:"center",position:"sticky",top:0,backdropFilter:"blur(20px)",zIndex:1,borderRadius:"18px 18px 0 0"}}>
          <div style={{width:56,height:56,borderRadius:28,overflow:"hidden",border:`2px solid ${c}44`,flexShrink:0}}>
            <img src={j.foto} alt={j.n} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.parentElement.innerHTML=`<div style="width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:24px">${POS_ICON[j.pos]||"⚽"}</div>`;}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"inline-block",background:`${c}15`,color:c,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,marginBottom:3}}>{POS_ICON[j.pos]} {j.pos}</div>
            <div style={{fontWeight:800,fontSize:18,color:"#eef2f6",lineHeight:1.2}}>{j.n}</div>
            <div style={{color:"#4a6070",fontSize:12,marginTop:1}}>{j.eq} · {j.l}{j.e?` · ${j.e}a`:""} · {j.pais||""}</div>
          </div>
          <div style={{display:"flex",gap:7,flexShrink:0,alignItems:"center"}}>
            {ss&&<div style={{background:ss.label.bg,border:`1px solid ${ss.label.c}44`,borderRadius:10,padding:"5px 10px",textAlign:"center"}}>
              <div style={{fontWeight:900,fontSize:18,color:ss.label.c,lineHeight:1}}>{ss.total}</div>
              <div style={{fontSize:8,color:ss.label.c,fontWeight:700,letterSpacing:.3}}>SCOUT</div>
            </div>}
            <button onClick={()=>onToggle(j)} style={{background:enCompar?`${c}20`:"rgba(255,255,255,0.05)",border:`1px solid ${enCompar?c+"44":"rgba(255,255,255,0.1)"}`,borderRadius:8,padding:"7px 12px",color:enCompar?c:"#eef2f6",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>
              {enCompar?"✓ En comp.":"⚖️ Comparar"}
            </button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#4a6070",cursor:"pointer",fontSize:20,padding:0}}>✕</button>
          </div>
        </div>

        <div style={{padding:"14px 20px"}}>
          {/* Stats grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:14}}>
            {[j.s?.rat!=null&&["★",j.s.rat,"Rating",parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#ef4444"],
              j.s?.g!=null&&["⚽",j.s.g,"Goles",c],
              j.s?.a!=null&&["🅰️",j.s.a,"Asist.",c],
              j.s?.pts!=null&&["📅",j.s.pts,"Partidos","#64748b"],
              j.s?.min!=null&&["⏱️",j.s.min+"'","Minutos","#64748b"],
              j.s?.pas!=null&&["📊",j.s.pas,"Pases","#64748b"],
              j.s?.tac!=null&&["🛡️",j.s.tac,"Tackles","#64748b"],
              j.s?.ata!=null&&["🧤",j.s.ata,"Atajadas","#64748b"],
            ].filter(Boolean).slice(0,8).map(([ico,v,l,col])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:9,padding:"8px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,marginBottom:2}}>{ico}</div>
                <div style={{fontWeight:800,fontSize:15,color:col}}>{v}</div>
                <div style={{fontSize:9,color:"#4a6070",marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Valor de Mercado */}
          {vm&&(
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:"#4a6070",fontWeight:600,letterSpacing:.5,marginBottom:3}}>💰 VALOR MERCADO FICHASCOUT™</div>
                <div style={{fontWeight:800,fontSize:18,color:vm.label.c}}>{vm.fmt}</div>
                <div style={{fontSize:10,color:"#4a6070",marginTop:1}}>{vm.label.l} · mercado {j.l} ×{vm.ligaMult.toFixed(2)}</div>
              </div>
              <div style={{textAlign:"center",background:`${vm.label.c}12`,border:`1px solid ${vm.label.c}33`,borderRadius:10,padding:"8px 14px"}}>
                <div style={{fontWeight:900,fontSize:22,color:vm.label.c,lineHeight:1}}>{vm.midFmt}</div>
                <div style={{fontSize:9,color:vm.label.c,fontWeight:700,marginTop:2}}>ESTIMACIÓN</div>
              </div>
            </div>
          )}

          {/* Scout Score */}
          {ss&&<div style={{marginBottom:14}}><ScoutScoreBar score={ss}/></div>}

          {/* Barras */}
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"11px 13px",marginBottom:12}}>
            <div style={{color:"#4a6070",fontSize:10,fontWeight:600,letterSpacing:.5,marginBottom:8}}>ESTADÍSTICAS DE TEMPORADA</div>
            {statsKeys.filter(k=>j.s?.[k]!=null).map(k=>{
              const def=STATS_DEF.find(s=>s.k===k);
              if(!def) return null;
              const v=parseFloat(j.s[k])||0;
              const pct=Math.min((v/(def.max||100))*100,100);
              return(
                <div key={k} style={{display:"grid",gridTemplateColumns:"105px 1fr 36px",gap:7,alignItems:"center",marginBottom:5}}>
                  <div style={{fontSize:11,color:"#64748b"}}>{def.l}</div>
                  <div style={{height:3.5,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                    <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:c,textAlign:"right"}}>{j.s[k]}</div>
                </div>
              );
            })}
          </div>

          {/* IA */}
          {!iaText?(
            <button onClick={generarIA} disabled={loadIA} style={{width:"100%",border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:700,cursor:loadIA?"wait":"pointer",fontSize:13,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loadIA?<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando como Chief Scout...</>:"📋 Generar Informe Scout IA Completo"}
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </button>
          ):(
            <div style={{background:"rgba(139,92,246,0.07)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:11,padding:13,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                <span style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>🤖 Análisis Scout IA Profesional</span>
                <div style={{display:"flex",gap:7}}>
                  <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700}}>FichaScout PRO</span>
                  <button onClick={()=>setIaText("")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"2px 9px",color:"#4a6070",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↻</button>
                </div>
              </div>
              <div style={{color:"#c4b5fd",lineHeight:1.9,fontSize:12.5,whiteSpace:"pre-wrap",fontFamily:"system-ui,sans-serif"}}>{iaText}</div>
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <button onClick={()=>exportPDFIndividual(j,iaText,ss,vm)} style={{border:"none",borderRadius:10,padding:"11px",color:"#000",fontWeight:800,cursor:"pointer",fontSize:13,background:`linear-gradient(135deg,${G},#00c96a)`,fontFamily:"inherit",letterSpacing:"0.2px"}}>📄 Generar Informe PDF</button>
            <button onClick={()=>onToggle(j)} style={{border:`1px solid ${enCompar?"rgba(0,232,122,.4)":"rgba(255,255,255,.1)"}`,borderRadius:10,padding:"11px",color:enCompar?G:"#eef2f6",fontWeight:700,cursor:"pointer",fontSize:13,background:enCompar?"rgba(0,232,122,.1)":"transparent",fontFamily:"inherit"}}>
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
  const [db,       setDb]       = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const [region,   setRegion]   = useState("");
  const [ligaId,   setLigaId]   = useState("");
  const [equipo,   setEquipo]   = useState("");
  const [posicion, setPosicion] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [edadMin,  setEdadMin]  = useState("");
  const [edadMax,  setEdadMax]  = useState("");
  const [soloStats,setSoloStats]= useState(true);
  const [ordenar,  setOrdenar]  = useState("score");
  const [pagina,   setPagina]   = useState(0);

  const [modal,    setModal]    = useState(null);
  const [comparar, setComparar] = useState([]);
  const [panel,    setPanel]    = useState(false);
  const [iaComp,   setIaComp]   = useState("");
  const [loadIa,   setLoadIa]   = useState(false);

  const PER = 40;

  useEffect(()=>{
    fetch("/fichascout_pro_data.json")
      .then(r=>{ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(d=>{ setDb(d); setLoading(false); })
      .catch(e=>{ setError("No se pudo cargar. Verifica que fichascout_pro_data.json esté en public/."); setLoading(false); });
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
    const lid=parseInt(ligaId);
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
    if(busqueda){ const q=busqueda.toLowerCase(); list=list.filter(j=>(j.n||"").toLowerCase().includes(q)||(j.eq||"").toLowerCase().includes(q)); }
    return [...list].sort((a,b)=>{
      if(ordenar==="score"){ const sa=calcScoutScore(a),sb=calcScoutScore(b); return (sb?.total||0)-(sa?.total||0); }
      if(ordenar==="rat")   return (parseFloat(b.s?.rat)||0)-(parseFloat(a.s?.rat)||0);
      if(ordenar==="g")     return (b.s?.g||0)-(a.s?.g||0);
      if(ordenar==="edad")  return (a.e||99)-(b.e||99);
      if(ordenar==="nombre")return (a.n||"").localeCompare(b.n||"");
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

  async function analizarComparacion() {
    if(comparar.length<2) return;
        setLoadIa(true); setIaComp("");
    const scores = comparar.map(j=>calcScoutScore(j));
    try{
      const r = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({model:"claude-sonnet-4-6", max_tokens:1800, messages:[{role:"user",content:buildPromptComparacion(comparar,scores)}]})
      });
      if(!r.ok){ const e=await r.json(); throw new Error(e.error?.message||`HTTP ${r.status}`); }
      const d = await r.json();
      setIaComp(d.content?.[0]?.text||"Error.");
    }catch(e){ setIaComp(`Error: ${e.message}`); }
    setLoadIa(false);
  }

  if(loading) return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80,gap:14}}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00e87a" strokeWidth="2" style={{animation:"spin 1.2s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{color:"#64748b",fontWeight:600}}>Cargando base de datos + calculando Scout Scores...</div>
    </div>
  );
  if(error) return <div style={{padding:24,background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,margin:20,color:"#fca5a5",fontSize:13}}><b>⚠ Error:</b> {error}</div>;

  const enComp  = (j)=>!!comparar.find(p=>p.id===j.id);
  const getIdx  = (j)=>comparar.findIndex(p=>p.id===j.id);
  const IN = {background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 11px",color:"#eef2f6",fontSize:12,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};

  return(
    <div style={{fontFamily:"system-ui,sans-serif"}}>
      {modal&&<ModalJugador j={modal} ss={calcScoutScore(modal)} vm={calcValorMercado(modal,calcScoutScore(modal))} onClose={()=>setModal(null)} onToggle={toggle} enCompar={enComp(modal)}/>}

      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,rgba(0,232,122,0.08),rgba(59,130,246,0.05))",border:"1px solid rgba(0,232,122,0.15)",borderRadius:14,padding:"13px 18px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:800,color:"#eef2f6",fontSize:17,marginBottom:2}}>🌍 Base Pro Mundial + Scout Score™</div>
          <div style={{color:"#4a6070",fontSize:12}}>
            <span style={{color:G,fontWeight:700}}>{db?.meta?.total?.toLocaleString()}</span> jugadores únicos ·
            <span style={{color:G,fontWeight:700}}> {db?.meta?.ligas}</span> ligas ·
            <span style={{color:"#a855f7",fontWeight:700}}> Scout Score™</span> exclusivo FichaScout ·
            <span style={{color:G,fontWeight:700}}> {filtrados.length.toLocaleString()}</span> resultados
          </div>
        </div>
        <div style={{display:"flex",gap:7}}>
          
          {comparar.length>0&&(
            <button onClick={()=>setPanel(p=>!p)} style={{background:panel?"rgba(0,232,122,0.15)":"rgba(255,255,255,0.07)",border:`1px solid ${panel?"rgba(0,232,122,0.3)":"rgba(255,255,255,0.1)"}`,borderRadius:8,padding:"7px 14px",color:panel?G:"#eef2f6",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
              ⚖️ Comparando ({comparar.length}/4)
            </button>
          )}
        </div>
      </div>

      {/* FILTROS */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"12px 15px",marginBottom:13}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
          {[["REGIÓN",<select style={IN} value={region} onChange={e=>{setRegion(e.target.value);setLigaId("");setEquipo("");setPagina(0);}}>
              <option value="">Todas las regiones</option>
              {regiones.map(r=><option key={r} value={r}>{r}</option>)}
            </select>],
            ["LIGA",<select style={IN} value={ligaId} onChange={e=>{setLigaId(e.target.value);setEquipo("");setPagina(0);}}>
              <option value="">Todas las ligas</option>
              {ligasDisp.map(l=><option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>],
            ["EQUIPO",<select style={IN} value={equipo} onChange={e=>{setEquipo(e.target.value);setPagina(0);}}>
              <option value="">Todos los equipos</option>
              {equiposDisp.map(e=><option key={e.id} value={e.nombre}>{e.nombre}</option>)}
            </select>],
            ["POSICIÓN",<select style={IN} value={posicion} onChange={e=>{setPosicion(e.target.value);setPagina(0);}}>
              <option value="">Todas las posiciones</option>
              {["Arquero","Defensor","Volante","Delantero"].map(p=><option key={p} value={p}>{POS_ICON[p]} {p}</option>)}
            </select>],
          ].map(([l,el])=><div key={l}><div style={{fontSize:9,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>{l}</div>{el}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 65px 65px 155px auto",gap:8,alignItems:"end"}}>
          <div>
            <div style={{fontSize:9,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>BUSCAR</div>
            <input style={IN} placeholder="🔍  Nombre o equipo..." value={busqueda} onChange={e=>{setBusqueda(e.target.value);setPagina(0);}}/>
          </div>
          <div><div style={{fontSize:9,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>EDAD MÍN</div><input style={IN} type="number" placeholder="16" value={edadMin} onChange={e=>{setEdadMin(e.target.value);setPagina(0);}}/></div>
          <div><div style={{fontSize:9,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>EDAD MÁX</div><input style={IN} type="number" placeholder="40" value={edadMax} onChange={e=>{setEdadMax(e.target.value);setPagina(0);}}/></div>
          <div>
            <div style={{fontSize:9,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.5}}>ORDENAR POR</div>
            <select style={IN} value={ordenar} onChange={e=>setOrdenar(e.target.value)}>
              <option value="score">🏅 Scout Score</option>
              <option value="rat">★ Rating</option>
              <option value="g">⚽ Goles</option>
              <option value="edad">🎂 Más joven</option>
              <option value="nombre">🔤 Nombre A-Z</option>
            </select>
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center",paddingBottom:1}}>
            <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:11,color:"#64748b",whiteSpace:"nowrap"}}>
              <input type="checkbox" checked={soloStats} onChange={e=>{setSoloStats(e.target.checked);setPagina(0);}} style={{accentColor:G}}/>Con stats
            </label>
            <button onClick={()=>{setRegion("");setLigaId("");setEquipo("");setPosicion("");setBusqueda("");setEdadMin("");setEdadMax("");setPagina(0);}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:7,padding:"6px 11px",color:"#f87171",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"}}>✕</button>
          </div>
        </div>
      </div>

      {/* PANEL COMPARACIÓN */}
      {panel&&comparar.length>0&&(()=>{
        const scores = comparar.map(j=>calcScoutScore(j));
        const statsKeys = comparar.length>0 ? (STATS_POS[comparar[0].pos]||STATS_DEF.map(s=>s.k)).filter(k=>comparar.some(j=>j.s?.[k]!=null)) : [];
        return(
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:14,marginBottom:13}}>
            <div style={{color:"#4a6070",fontSize:10,fontWeight:700,letterSpacing:.5,marginBottom:11}}>PANEL DE COMPARACIÓN · SCOUT SCORE™ · {comparar.length}/4 JUGADORES</div>

            {/* Cards */}
            <div style={{display:"grid",gridTemplateColumns:`repeat(${comparar.length},1fr)`,gap:9,marginBottom:13}}>
              {comparar.map((j,i)=>{
                const ss=scores[i];
                return(
                  <div key={j.id} style={{background:`${SLOTS[i]}10`,border:`1px solid ${SLOTS[i]}33`,borderRadius:11,padding:11,textAlign:"center",position:"relative"}}>
                    <button onClick={()=>toggle(j)} style={{position:"absolute",top:5,right:5,background:"rgba(239,68,68,0.1)",border:"none",borderRadius:4,color:"#ef4444",cursor:"pointer",fontSize:10,padding:"1px 5px",fontFamily:"inherit"}}>✕</button>
                    <img src={j.foto} alt={j.n} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:`2px solid ${SLOTS[i]}`,marginBottom:5}} onError={e=>e.target.style.display="none"}/>
                    <div style={{fontWeight:700,color:"#eef2f6",fontSize:11,lineHeight:1.2}}>{j.n}</div>
                    <div style={{color:"#4a6070",fontSize:9,marginTop:1}}>{j.eq}</div>
                    <div style={{color:SLOTS[i],fontSize:9}}>{j.l}</div>
                    {j.s?.rat&&<div style={{fontWeight:800,color:SLOTS[i],fontSize:13,marginTop:3}}>★{j.s.rat}</div>}
                    {ss&&<div style={{background:ss.label.bg,border:`1px solid ${ss.label.c}33`,borderRadius:6,padding:"3px 6px",marginTop:4}}>
                      <div style={{fontWeight:900,fontSize:15,color:ss.label.c,lineHeight:1}}>{ss.total}</div>
                      <div style={{fontSize:8,color:ss.label.c,fontWeight:700}}>Scout Score · {ss.label.l}</div>
                    </div>}
                  </div>
                );
              })}
            </div>

            {/* Scout Score detalle */}
            <div style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:11,padding:"10px 13px",marginBottom:11}}>
              <div style={{color:"#a855f7",fontSize:10,fontWeight:700,letterSpacing:.5,marginBottom:8}}>🏅 COMPARATIVA SCOUT SCORE™ — Algoritmo Exclusivo FichaScout</div>
              {[["TOTAL /100",null],["Rendimiento (30%)","rendimiento"],["Edad/Curva (25%)","edad"],["Potencial (20%)","potencial"],["Regularidad (15%)","regularidad"],["Nivel liga (10%)","nivel"]].map(([l,k])=>{
                const vals = k ? scores.map(ss=>ss?.comp?.[k]||0) : scores.map(ss=>ss?.total||0);
                const maxV = Math.max(...vals);
                return(
                  <div key={l} style={{display:"grid",gridTemplateColumns:`140px repeat(${comparar.length},1fr)`,gap:7,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div style={{fontSize:11,color:k?"#4a6070":"#eef2f6",fontWeight:k?400:700}}>{l}</div>
                    {vals.map((v,i)=>{
                      const best=v===maxV&&maxV>0;
                      return <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                        <div style={{flex:1,height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                          <div style={{width:`${v}%`,height:"100%",background:best?SLOTS[i]:"rgba(255,255,255,0.15)",borderRadius:2}}/>
                        </div>
                        <span style={{fontSize:11,fontWeight:best?800:400,color:best?SLOTS[i]:"#64748b",minWidth:20,textAlign:"right"}}>{v}{best?" ▲":""}</span>
                      </div>;
                    })}
                  </div>
                );
              })}
              <div style={{display:"grid",gridTemplateColumns:`140px repeat(${comparar.length},1fr)`,gap:7,paddingTop:5}}>
                <div style={{fontSize:11,color:"#4a6070"}}>Multiplicador liga</div>
                {scores.map((ss,i)=><div key={i} style={{fontSize:10,fontWeight:700,color:ss?.difLabel?.c||"#64748b"}}>×{ss?.dif?.toFixed(2)||"—"} {ss?.difLabel?.l||""}</div>)}
              </div>
            </div>

            {/* Stats */}
            <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,overflow:"hidden",marginBottom:11}}>
              <div style={{display:"grid",gridTemplateColumns:`115px repeat(${comparar.length},1fr)`,gap:7,padding:"6px 11px",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:9,fontWeight:700,color:"#4a6070",letterSpacing:.5}}>
                <div>ESTADÍSTICA</div>{comparar.map((j,i)=><div key={i} style={{color:SLOTS[i]}}>{j.n.split(" ")[0]}</div>)}
              </div>
              {statsKeys.map(k=>{
                const def=STATS_DEF.find(s=>s.k===k);
                const vals=comparar.map(j=>parseFloat(j.s?.[k])||0);
                const maxV=Math.max(...vals);
                return(
                  <div key={k} style={{display:"grid",gridTemplateColumns:`115px repeat(${comparar.length},1fr)`,gap:7,padding:"5px 11px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                    <div style={{fontSize:10,color:"#4a6070"}}>{def?.l||k}</div>
                    {comparar.map((j,i)=>{
                      const v=parseFloat(j.s?.[k])||0; const best=v===maxV&&maxV>0&&!def?.neg;
                      const pct=def?.max?Math.min((v/def.max)*100,100):(maxV>0?Math.min((v/maxV)*100,100):0);
                      return <div key={i}>
                        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:1}}>
                          <div style={{flex:1,height:3,background:"rgba(255,255,255,0.05)",borderRadius:2}}><div style={{width:`${pct}%`,height:"100%",background:best?SLOTS[i]:"rgba(255,255,255,0.15)",borderRadius:2}}/></div>
                          <span style={{fontSize:11,fontWeight:best?800:400,color:best?SLOTS[i]:"#64748b",minWidth:20,textAlign:"right"}}>{j.s?.[k]??'—'}</span>
                        </div>
                        {best&&<div style={{fontSize:8,color:SLOTS[i],fontWeight:700}}>▲ MEJOR</div>}
                      </div>;
                    })}
                  </div>
                );
              })}
            </div>

            <div style={{display:"flex",gap:9,marginBottom:iaComp?11:0}}>
              <button onClick={analizarComparacion} disabled={loadIa||comparar.length<2} style={{flex:1,border:"none",borderRadius:9,padding:"10px",color:"#fff",fontWeight:700,cursor:loadIa?"not-allowed":"pointer",fontSize:12,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",opacity:comparar.length<2?0.4:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                {loadIa?<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando...</>:"📋 Generar Informe Comparativo IA"}
              </button>
              <button onClick={()=>exportPDFComparacion(comparar,scores,iaComp)} style={{flex:1,border:"none",borderRadius:9,padding:"10px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:12,background:`linear-gradient(135deg,${G},#00c96a)`,fontFamily:"inherit"}}>
                📄 PDF con Scout Score™
              </button>
            </div>

            {iaComp&&(
              <div style={{background:"rgba(139,92,246,0.07)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:11,padding:13}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                  <span style={{color:"#eef2f6",fontWeight:700,fontSize:12}}>🤖 Análisis Comparativo Scout IA</span>
                  <div style={{display:"flex",gap:7}}>
                    <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:700}}>FichaScout PRO</span>
                    <button onClick={()=>setIaComp("")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"2px 8px",color:"#4a6070",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>↻</button>
                  </div>
                </div>
                <div style={{color:"#c4b5fd",lineHeight:1.85,fontSize:12.5,whiteSpace:"pre-wrap"}}>{iaComp}</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* GRID */}
      {filtrados.length===0?(
        <div style={{textAlign:"center",padding:48,color:"#4a6070"}}>
          <div style={{fontSize:32,marginBottom:10}}>🔍</div>
          <div style={{fontWeight:600,marginBottom:6}}>Sin resultados</div>
          <div style={{fontSize:13}}>Cambie los filtros para ver jugadores</div>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(172px,1fr))",gap:8,marginBottom:13}}>
          {pageData.map(j=>{
            const c=POS_COLOR[j.pos]||G;
            const ec=enComp(j); const ci=getIdx(j);
            const ss=calcScoutScore(j);
            return(
              <div key={j.id} onClick={()=>setModal(j)} style={{background:ec?`${SLOTS[ci]}10`:"rgba(255,255,255,0.03)",border:`1px solid ${ec?SLOTS[ci]+"44":"rgba(255,255,255,0.07)"}`,borderRadius:11,padding:12,cursor:"pointer",transition:"all .15s",position:"relative"}}
                onMouseEnter={e=>{if(!ec)e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{if(!ec)e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.transform="translateY(0)";}}>

                {ec&&<div style={{position:"absolute",top:5,right:5,width:18,height:18,borderRadius:"50%",background:SLOTS[ci],display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#000"}}>{ci+1}</div>}

                <div style={{width:48,height:48,borderRadius:"50%",overflow:"hidden",margin:"0 auto 8px",border:`2px solid ${c}33`}}>
                  <img src={j.foto} alt={j.n} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.parentElement.innerHTML=`<div style="width:100%;height:100%;background:${c}15;display:flex;align-items:center;justify-content:center;font-size:19px">${POS_ICON[j.pos]||"⚽"}</div>`;}}/>
                </div>

                <div style={{fontWeight:700,color:"#eef2f6",fontSize:12,marginBottom:1,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{j.n}</div>
                <div style={{color:"#4a6070",fontSize:9.5,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:1}}>{j.eq}</div>
                <div style={{color:"#3a5060",fontSize:9.5,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:6}}>{j.l}</div>

                <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{background:`${c}15`,color:c,borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>{POS_ICON[j.pos]} {j.pos}</span>
                  {j.e&&<span style={{color:"#4a6070",fontSize:9}}>{j.e}a</span>}
                </div>

                {/* Rating + Scout Score */}
                <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:5}}>
                  {j.s?.rat&&<div style={{textAlign:"center"}}>
                    <div style={{fontWeight:800,color:parseFloat(j.s.rat)>=8?"#00a855":parseFloat(j.s.rat)>=6.5?"#d97706":"#ef4444",fontSize:13}}>★{j.s.rat}</div>
                    <div style={{fontSize:8,color:"#3a5060"}}>Rating</div>
                  </div>}
                  {ss&&<div style={{textAlign:"center",background:ss.label.bg,borderRadius:5,padding:"2px 5px"}}>
                    <div style={{fontWeight:900,color:ss.label.c,fontSize:13}}>{ss.total}</div>
                    <div style={{fontSize:7,color:ss.label.c,fontWeight:700}}>Scout</div>
                  </div>}
                  {(()=>{const v=calcValorMercado(j,ss);return v?(<div style={{textAlign:"center",background:`${v.label.c}12`,borderRadius:5,padding:"2px 5px"}}>
                    <div style={{fontWeight:800,color:v.label.c,fontSize:10,lineHeight:1.2}}>{v.midFmt}</div>
                    <div style={{fontSize:7,color:v.label.c,fontWeight:600}}>Valor</div>
                  </div>):null;})()}
                </div>

                <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:6}}>
                  {j.s?.g!=null&&<span style={{fontSize:9.5,color:"#64748b"}}>{j.s.g}⚽</span>}
                  {j.s?.a!=null&&<span style={{fontSize:9.5,color:"#64748b"}}>{j.s.a}🅰️</span>}
                  {j.s?.pts!=null&&<span style={{fontSize:9.5,color:"#64748b"}}>{j.s.pts}P</span>}
                </div>

                <button onClick={e=>{e.stopPropagation();toggle(j);}} disabled={comparar.length>=4&&!ec} style={{width:"100%",border:`1px solid ${ec?SLOTS[ci]+"44":"rgba(255,255,255,0.07)"}`,borderRadius:6,padding:"5px",color:ec?SLOTS[ci]:"#4a6070",background:"transparent",cursor:comparar.length>=4&&!ec?"not-allowed":"pointer",fontSize:10,fontFamily:"inherit",fontWeight:600,opacity:comparar.length>=4&&!ec?0.3:1}}>
                  {ec?"✓ En comparación":"⚖️ Comparar"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {totalPags>1&&(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:7,padding:"8px 0"}}>
          <button onClick={()=>setPagina(p=>Math.max(0,p-1))} disabled={pagina===0} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:7,padding:"6px 13px",color:pagina===0?"#1a2e3d":"#eef2f6",cursor:pagina===0?"not-allowed":"pointer",fontFamily:"inherit",fontSize:11}}>← Anterior</button>
          <span style={{color:"#4a6070",fontSize:11}}>{pagina+1} / {totalPags} · {filtrados.length.toLocaleString()} jugadores</span>
          <button onClick={()=>setPagina(p=>Math.min(totalPags-1,p+1))} disabled={pagina>=totalPags-1} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:7,padding:"6px 13px",color:pagina>=totalPags-1?"#1a2e3d":"#eef2f6",cursor:pagina>=totalPags-1?"not-allowed":"pointer",fontFamily:"inherit",fontSize:11}}>Siguiente →</button>
        </div>
      )}
    </div>
  );
}

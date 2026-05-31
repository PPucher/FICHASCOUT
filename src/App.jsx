import ComparadorPro from "./ComparadorPro.jsx";
import { generarPDF } from "./PDFExport.jsx";
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
         RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

// ─── ESTILOS COMO OBJETOS JS (correcto para React) ───────────────────────────
const I = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px 13px", color:"#eef2f6", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const BG = { border:"none", borderRadius:10, padding:"10px 22px", color:"#000", fontWeight:700, cursor:"pointer", fontSize:13, background:"linear-gradient(135deg,#00e87a,#00c96a)", fontFamily:"inherit" };
const BN = { background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px 18px", color:"#94a3b8", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit" };
const BB = { border:"none", borderRadius:10, padding:"10px 22px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", fontFamily:"inherit" };
const BR = { border:"none", borderRadius:10, padding:"10px 22px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, background:"linear-gradient(135deg,#ef4444,#dc2626)", fontFamily:"inherit" };
const BP = { border:"none", borderRadius:10, padding:"10px 22px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", fontFamily:"inherit" };
const Card = ({children, style={}}) => <div style={{background:"rgba(255,255,255,0.03)", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", padding:20, ...style}}>{children}</div>;
const Lbl = ({children}) => <div style={{color:"#4a6070", fontSize:12, marginBottom:5, fontWeight:600, letterSpacing:.4}}>{children}</div>;
const Bdg = ({color, children}) => <span style={{background:color+"22", color, border:`1px solid ${color}44`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap"}}>{children}</span>;

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const TIPOS=[
  {id:"amistoso",label:"Amistoso",icon:"🤝",color:"#64748b",factor:0.65},
  {id:"local",label:"Liga Local",icon:"🏘️",color:"#10b981",factor:1.0},
  {id:"regional",label:"Copa Regional",icon:"🗺️",color:"#3b82f6",factor:1.35},
  {id:"nacional",label:"Torneo Nacional",icon:"🏆",color:"#f59e0b",factor:1.75},
  {id:"playoff",label:"Playoffs",icon:"⚡",color:"#ef4444",factor:2.1},
  {id:"final",label:"Final",icon:"👑",color:"#8b5cf6",factor:2.5},
];
const FORMS=["4-4-2","4-3-3","4-2-3-1","3-5-2","5-3-2","4-1-4-1","3-4-3","4-5-1","5-4-1"];
const FP={"4-4-2":[{x:50,y:118,r:"POR"},{x:12,y:90,r:"LD"},{x:35,y:90,r:"DC"},{x:65,y:90,r:"DC"},{x:88,y:90,r:"LI"},{x:12,y:58,r:"MC"},{x:35,y:58,r:"MC"},{x:65,y:58,r:"MC"},{x:88,y:58,r:"MC"},{x:33,y:22,r:"DEL"},{x:67,y:22,r:"DEL"}],"4-3-3":[{x:50,y:118,r:"POR"},{x:12,y:90,r:"LD"},{x:35,y:90,r:"DC"},{x:65,y:90,r:"DC"},{x:88,y:90,r:"LI"},{x:20,y:60,r:"MC"},{x:50,y:60,r:"MC"},{x:80,y:60,r:"MC"},{x:15,y:22,r:"EXT"},{x:50,y:22,r:"DEL"},{x:85,y:22,r:"EXT"}],"4-2-3-1":[{x:50,y:118,r:"POR"},{x:12,y:90,r:"LD"},{x:35,y:90,r:"DC"},{x:65,y:90,r:"DC"},{x:88,y:90,r:"LI"},{x:30,y:74,r:"MCD"},{x:70,y:74,r:"MCD"},{x:15,y:50,r:"EXT"},{x:50,y:50,r:"MOF"},{x:85,y:50,r:"EXT"},{x:50,y:18,r:"DEL"}],"3-5-2":[{x:50,y:118,r:"POR"},{x:22,y:90,r:"DC"},{x:50,y:90,r:"DC"},{x:78,y:90,r:"DC"},{x:8,y:58,r:"MC"},{x:28,y:58,r:"MC"},{x:50,y:58,r:"MC"},{x:72,y:58,r:"MC"},{x:92,y:58,r:"MC"},{x:33,y:20,r:"DEL"},{x:67,y:20,r:"DEL"}],"5-3-2":[{x:50,y:118,r:"POR"},{x:8,y:90,r:"CL"},{x:27,y:90,r:"DC"},{x:50,y:90,r:"DC"},{x:73,y:90,r:"DC"},{x:92,y:90,r:"CR"},{x:20,y:58,r:"MC"},{x:50,y:58,r:"MC"},{x:80,y:58,r:"MC"},{x:33,y:20,r:"DEL"},{x:67,y:20,r:"DEL"}],"4-1-4-1":[{x:50,y:118,r:"POR"},{x:12,y:90,r:"LD"},{x:35,y:90,r:"DC"},{x:65,y:90,r:"DC"},{x:88,y:90,r:"LI"},{x:50,y:76,r:"MCD"},{x:10,y:52,r:"MC"},{x:33,y:52,r:"MC"},{x:67,y:52,r:"MC"},{x:90,y:52,r:"MC"},{x:50,y:18,r:"DEL"}],"3-4-3":[{x:50,y:118,r:"POR"},{x:22,y:90,r:"DC"},{x:50,y:90,r:"DC"},{x:78,y:90,r:"DC"},{x:15,y:58,r:"MC"},{x:38,y:58,r:"MC"},{x:62,y:58,r:"MC"},{x:85,y:58,r:"MC"},{x:20,y:20,r:"EXT"},{x:50,y:20,r:"DEL"},{x:80,y:20,r:"EXT"}],"4-5-1":[{x:50,y:118,r:"POR"},{x:12,y:90,r:"LD"},{x:35,y:90,r:"DC"},{x:65,y:90,r:"DC"},{x:88,y:90,r:"LI"},{x:8,y:56,r:"MC"},{x:27,y:56,r:"MC"},{x:50,y:56,r:"MC"},{x:73,y:56,r:"MC"},{x:92,y:56,r:"MC"},{x:50,y:18,r:"DEL"}],"5-4-1":[{x:50,y:118,r:"POR"},{x:8,y:90,r:"CL"},{x:27,y:90,r:"DC"},{x:50,y:90,r:"DC"},{x:73,y:90,r:"DC"},{x:92,y:90,r:"CR"},{x:15,y:56,r:"MC"},{x:38,y:56,r:"MC"},{x:62,y:56,r:"MC"},{x:85,y:56,r:"MC"},{x:50,y:18,r:"DEL"}]};
const POS={
  "Arquero":{icon:"🧤",color:"#f59e0b",cat:"GK",ev:[{id:"atajadas",label:"Atajada",icon:"🛑"},{id:"goles_recibidos",label:"Gol Recibido",icon:"⚽"},{id:"pases_pie_conectados",label:"Saque Pie OK",icon:"✅"},{id:"centros_cortados",label:"Centro Cortado",icon:"✋"},{id:"salidas_area",label:"Salida al Área",icon:"🚶"},{id:"despejes",label:"Despeje",icon:"👊"}],bk:{1:{atajadas:4.2,pases_pie_conectados:82,centros_cortados:3.1,goles_recibidos:0.8},2:{atajadas:3.5,pases_pie_conectados:75,centros_cortados:2.5,goles_recibidos:1.1},3:{atajadas:3.0,pases_pie_conectados:65,centros_cortados:2.0,goles_recibidos:1.4},4:{atajadas:2.2,pases_pie_conectados:52,centros_cortados:1.4,goles_recibidos:1.8}}},
  "Defensor Central":{icon:"🛡️",color:"#3b82f6",cat:"DEF",ev:[{id:"intercepciones",label:"Intercepción",icon:"🚫"},{id:"despejes",label:"Despeje",icon:"👊"},{id:"duelos_aereos_ganados",label:"Duelo Aéreo ✓",icon:"⬆️"},{id:"duelos_aereos_perdidos",label:"Duelo Aéreo ✗",icon:"⬇️"},{id:"pases_completados",label:"Pase Completado",icon:"✅"},{id:"tackles",label:"Tackle",icon:"⚡"},{id:"faltas",label:"Falta Cometida",icon:"🟡"}],bk:{1:{intercepciones:3.8,despejes:6.2,duelos_aereos_ganados:4.5,pases_completados:78},2:{intercepciones:3.1,despejes:5.5,duelos_aereos_ganados:3.8,pases_completados:72},3:{intercepciones:2.5,despejes:4.8,duelos_aereos_ganados:3.2,pases_completados:65},4:{intercepciones:1.8,despejes:3.5,duelos_aereos_ganados:2.4,pases_completados:55}}},
  "Lateral":{icon:"↔️",color:"#8b5cf6",cat:"DEF",ev:[{id:"centros_completados",label:"Centro Completado",icon:"✅"},{id:"pases_completados",label:"Pase Completado",icon:"📤"},{id:"recuperaciones",label:"Recuperación",icon:"🔄"},{id:"incorporaciones",label:"Incorporación",icon:"🚀"},{id:"duelos_defensivos",label:"Duelo Defensivo",icon:"⚡"},{id:"faltas",label:"Falta Cometida",icon:"🟡"}],bk:{1:{centros_completados:2.8,pases_completados:72,recuperaciones:4.1,incorporaciones:5.2},2:{centros_completados:2.2,pases_completados:65,recuperaciones:3.5,incorporaciones:4.4},3:{centros_completados:1.7,pases_completados:58,recuperaciones:2.9,incorporaciones:3.6},4:{centros_completados:1.1,pases_completados:48,recuperaciones:2.1,incorporaciones:2.8}}},
  "Volante de Contención":{icon:"🧱",color:"#10b981",cat:"MID",ev:[{id:"recuperaciones",label:"Recuperación",icon:"🔄"},{id:"intercepciones",label:"Intercepción",icon:"🚫"},{id:"pases_completados",label:"Pase Completado",icon:"✅"},{id:"pases_fallados",label:"Pase Fallado",icon:"❌"},{id:"duelos_ganados",label:"Duelo Ganado",icon:"💪"},{id:"duelos_perdidos",label:"Duelo Perdido",icon:"😓"},{id:"faltas",label:"Falta Cometida",icon:"🟡"}],bk:{1:{recuperaciones:6.5,intercepciones:3.2,pases_completados:80,duelos_ganados:5.4},2:{recuperaciones:5.5,intercepciones:2.8,pases_completados:74,duelos_ganados:4.7},3:{recuperaciones:4.4,intercepciones:2.2,pases_completados:66,duelos_ganados:3.9},4:{recuperaciones:3.2,intercepciones:1.6,pases_completados:55,duelos_ganados:3.1}}},
  "Volante Ofensivo":{icon:"🎨",color:"#f97316",cat:"MID",ev:[{id:"pases_clave",label:"Pase Clave",icon:"🔑"},{id:"asistencias",label:"Asistencia",icon:"🎯"},{id:"pases_completados",label:"Pase Completado",icon:"✅"},{id:"disparos",label:"Disparo",icon:"💨"},{id:"regates_exitosos",label:"Regate Exitoso",icon:"🕺"},{id:"regates_fallados",label:"Regate Fallado",icon:"😓"},{id:"perdidas",label:"Pérdida de Balón",icon:"❌"}],bk:{1:{pases_clave:2.9,asistencias:0.4,pases_completados:76,disparos:2.1},2:{pases_clave:2.3,asistencias:0.3,pases_completados:70,disparos:1.7},3:{pases_clave:1.8,asistencias:0.25,pases_completados:63,disparos:1.3},4:{pases_clave:1.2,asistencias:0.18,pases_completados:52,disparos:0.9}}},
  "Extremo":{icon:"⚡",color:"#ec4899",cat:"FWD",ev:[{id:"regates_exitosos",label:"Regate Exitoso",icon:"🕺"},{id:"regates_fallados",label:"Regate Fallado",icon:"😓"},{id:"centros_completados",label:"Centro Completado",icon:"✅"},{id:"disparos",label:"Disparo",icon:"💨"},{id:"asistencias",label:"Asistencia",icon:"🎯"},{id:"pases_completados",label:"Pase Completado",icon:"📤"},{id:"perdidas",label:"Pérdida Balón",icon:"❌"}],bk:{1:{regates_exitosos:3.8,centros_completados:2.2,disparos:2.5,asistencias:0.35},2:{regates_exitosos:3.1,centros_completados:1.8,disparos:2.0,asistencias:0.28},3:{regates_exitosos:2.4,centros_completados:1.4,disparos:1.6,asistencias:0.22},4:{regates_exitosos:1.6,centros_completados:0.9,disparos:1.1,asistencias:0.15}}},
  "Delantero Centro":{icon:"🎯",color:"#ef4444",cat:"FWD",ev:[{id:"goles",label:"Gol",icon:"⚽"},{id:"disparos_arco",label:"Disparo al Arco",icon:"🎯"},{id:"disparos_fuera",label:"Disparo Fuera",icon:"💨"},{id:"asistencias",label:"Asistencia",icon:"🔑"},{id:"duelos_aereos_ganados",label:"Duelo Aéreo ✓",icon:"⬆️"},{id:"duelos_aereos_perdidos",label:"Duelo Aéreo ✗",icon:"⬇️"},{id:"offside",label:"Offside",icon:"🚩"}],bk:{1:{goles:0.7,disparos_arco:2.8,asistencias:0.22,duelos_aereos_ganados:3.5},2:{goles:0.55,disparos_arco:2.3,asistencias:0.18,duelos_aereos_ganados:2.9},3:{goles:0.42,disparos_arco:1.9,asistencias:0.15,duelos_aereos_ganados:2.3},4:{goles:0.28,disparos_arco:1.3,asistencias:0.10,duelos_aereos_ganados:1.7}}},
};
const SA={
  "🇨🇱 Chile":{"Primera División":{nv:1,cl:["Colo Colo","U. de Chile","U. Católica","Palestino","Deportes Iquique","O'Higgins","Union Española","Union La Calera","Huachipato","Audax Italiano","Coquimbo Unido","Cobresal","Cobreloa","Ñublense","Deportes Copiapó","Everton de Viña"]},"Primera B":{nv:2,cl:["Magallanes","Deportes Valdivia","Iberia","San Antonio Unido","Rangers","Deportes Puerto Montt"]},"Copa Chile":{nv:3,cl:["Curicó Unido","Deportes Limache","Municipal Puente Alto","Central Norte","Provincial Ovalle"]}},
  "🇦🇷 Argentina":{"Liga Profesional":{nv:1,cl:["River Plate","Boca Juniors","Racing Club","Independiente","San Lorenzo","Estudiantes LP","Vélez Sarsfield","Huracán","Talleres","Belgrano","Lanús","Banfield","Gimnasia LP","Defensa y Justicia"]},"Primera Nacional":{nv:2,cl:["Almirante Brown","Brown Adrogué","Quilmes","Ferro Carril Oeste","Agropecuario","Chacarita"]}},
  "🇧🇷 Brasil":{"Série A":{nv:1,cl:["Flamengo","Palmeiras","Atlético Mineiro","Fluminense","São Paulo FC","Santos","Vasco da Gama","Botafogo","Cruzeiro","Internacional","Grêmio","Corinthians","Athletico PR","Fortaleza"]},"Série B":{nv:2,cl:["CRB","Mirassol","Novorizontino","Operário PR","Sport Recife","Avaí"]}},
  "🇨🇴 Colombia":{"Primera A":{nv:1,cl:["Atlético Nacional","Millonarios","América de Cali","Deportivo Cali","Junior","Santa Fe","Dep. Medellín","Bucaramanga","Once Caldas","Deportivo Pasto"]}},
  "🇺🇾 Uruguay":{"Primera División":{nv:1,cl:["Nacional","Peñarol","Defensor Sporting","Danubio","Liverpool FC","Plaza Colonia","Fénix","Racing Club UY","Boston River","City Torque"]}},
  "🇵🇪 Perú":{"Liga 1":{nv:1,cl:["Alianza Lima","Universitario","Sporting Cristal","FBC Melgar","Sport Boys","César Vallejo","ADT","Mannucci"]}},
  "🇪🇨 Ecuador":{"LigaPro Serie A":{nv:1,cl:["Barcelona SC","Emelec","Liga de Quito","Independiente del Valle","Aucas","El Nacional","Delfín","Orense"]}},
  "🇧🇴 Bolivia":{"División Profesional":{nv:1,cl:["Bolívar","The Strongest","Oriente Petrolero","Nacional Potosí","Royal Pari","Blooming","Always Ready"]}},
  "🇵🇾 Paraguay":{"División de Honor":{nv:1,cl:["Olimpia","Cerro Porteño","Guaraní","Libertad","Tacuary","Nacional PY","12 de Octubre","Sol de América"]}},
  "🇻🇪 Venezuela":{"Liga FUTVE":{nv:1,cl:["Caracas FC","Zamora FC","Dep. Táchira","Carabobo FC","Monagas SC","Metropolitanos FC"]}},
};
const EV_EQ=[
  {id:"goles_favor",label:"Gol a Favor",icon:"⚽",tipo:"of"},{id:"goles_contra",label:"Gol en Contra",icon:"😰",tipo:"def"},
  {id:"tiros_arco",label:"Tiro al Arco",icon:"🎯",tipo:"of"},{id:"corners",label:"Córner",icon:"🚩",tipo:"of"},
  {id:"contraataques",label:"Contraataque",icon:"⚡",tipo:"of"},{id:"recuperaciones",label:"Recuperación",icon:"🔄",tipo:"def"},
  {id:"faltas_cometidas",label:"Falta Cometida",icon:"🟡",tipo:"def"},{id:"fuera_juego",label:"Fuera de Juego",icon:"🏴",tipo:"def"},
  {id:"posesion_perdida",label:"Pérdida Posesión",icon:"❌",tipo:"def"},{id:"presion_exitosa",label:"Presión Alta Exitosa",icon:"🫷",tipo:"def"},
];
const PIPE_ST=[
  {id:"radar",label:"En Radar",icon:"🔭",color:"#64748b"},
  {id:"observando",label:"Observando",icon:"👁️",color:"#3b82f6"},
  {id:"destacado",label:"Destacado",icon:"⭐",color:"#f59e0b"},
  {id:"negociando",label:"Negociando",icon:"🤝",color:"#10b981"},
  {id:"fichado",label:"Fichado",icon:"✅",color:"#00e87a"},
];
const ROLES=[
  {id:"scout",label:"Ojeador",icon:"🔍",desc:"Scouting y descubrimiento de talentos"},
  {id:"tecnico",label:"Técnico",icon:"📋",desc:"Gestión de plantilla y análisis táctico"},
  {id:"club",label:"Director de Club",icon:"🏟️",desc:"Visión global, fichajes y gestión completa"},
];
const NEG=new Set(["goles_recibidos","faltas","duelos_aereos_perdidos","duelos_perdidos","pases_fallados","regates_fallados","perdidas","offside","posesion_perdida","fuera_juego","faltas_cometidas","goles_contra"]);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);
const hoy = () => new Date().toISOString().slice(0,10);
const fmtFecha = d => d ? new Date(d).toLocaleDateString("es-CL",{day:"2-digit",month:"short",year:"2-digit"}) : "—";
const fmtMin = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const ytId = u => { const m = u?.match(/(?:v=|youtu\.be\/)([^&?/]+)/); return m?m[1]:null; };

function calcScore(stats, pos, nv=2) {
  const bk = POS[pos]?.bk[nv] || {};
  const keys = Object.keys(bk).filter(k => stats[k] != null);
  if (!keys.length) return 5;
  let s = 0;
  for (const k of keys) { const neg=NEG.has(k); const r=neg?bk[k]/Math.max(stats[k],0.1):stats[k]/Math.max(bk[k],0.1); s+=Math.min(r,2); }
  return Math.round(Math.min(10,(s/keys.length)*5+1)*10)/10;
}
function calcCtx(stats, pos, nv, tipo) {
  const raw = calcScore(stats, pos, nv);
  const tp = TIPOS.find(t=>t.id===tipo);
  return { raw:+raw.toFixed(1), adj:+Math.min(10,raw*(tp?.factor||1)).toFixed(1), factor:tp?.factor||1, color:tp?.color||"#64748b" };
}
function calcAvg(hist) {
  if (!hist?.length) return {};
  const s={}, c={};
  for (const h of hist) for (const [k,v] of Object.entries(h.stats||{})) { s[k]=(s[k]||0)+v; c[k]=(c[k]||0)+1; }
  return Object.fromEntries(Object.entries(s).map(([k,v])=>[k,+(v/c[k]).toFixed(2)]));
}
function calcDims(hist, pos) {
  if (!hist?.length) return {of:50,def:50,tec:50,fis:50,con:50,pre:50,prog:50};
  const bk = POS[pos]?.bk[2]||{};
  const avg = calcAvg(hist);
  const dim = (keys, sc=67) => { const r=keys.filter(k=>bk[k]>0&&avg[k]!=null); if(!r.length) return 50; return Math.round(Math.min(100,(r.reduce((a,k)=>a+Math.min(avg[k]/bk[k],1.5),0)/r.length)*sc)); };
  const defMap = { "Arquero":["atajadas","despejes"], "Defensor Central":["intercepciones","despejes","duelos_aereos_ganados","tackles"], "Lateral":["recuperaciones","duelos_defensivos"], "Volante de Contención":["recuperaciones","intercepciones","duelos_ganados"], "Volante Ofensivo":["pases_completados"], "Extremo":["pases_completados"], "Delantero Centro":["duelos_aereos_ganados"] };
  const ofMap = { "Arquero":["pases_pie_conectados","centros_cortados"], "Defensor Central":["pases_completados"], "Lateral":["centros_completados","incorporaciones","pases_completados"], "Volante de Contención":["pases_completados"], "Volante Ofensivo":["pases_clave","asistencias","disparos","regates_exitosos"], "Extremo":["regates_exitosos","centros_completados","disparos","asistencias"], "Delantero Centro":["goles","disparos_arco","asistencias"] };
  const of=dim(ofMap[pos]||[]), def=dim(defMap[pos]||[]), tec=Math.round((dim(ofMap[pos]||[])+of)*0.5), fis=dim(defMap[pos]||[],70);
  const scores = hist.map(h=>calcScore(h.stats||{},pos,2));
  const avg2 = scores.reduce((a,b)=>a+b,0)/scores.length;
  const con = Math.round(Math.max(20,100-scores.reduce((a,b)=>a+Math.abs(b-avg2),0)/scores.length*12));
  const highP = hist.filter(h=>["regional","nacional","playoff","final"].includes(h.tipo));
  const pre = highP.length>=2 ? Math.round(Math.min(100,highP.reduce((s,h)=>s+calcScore(h.stats||{},pos,2),0)/highP.length*10)) : 50;
  let prog = 50;
  if (scores.length>=4) { const half=Math.floor(scores.length/2); const a1=scores.slice(0,half).reduce((a,b)=>a+b,0)/half; const a2=scores.slice(half).reduce((a,b)=>a+b,0)/(scores.length-half); prog=Math.round(Math.min(100,Math.max(10,50+(a2-a1)*12))); }
  return {of,def,tec,fis,con,pre,prog};
}
async function askClaude(prompt, maxT=1300) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxT,messages:[{role:"user",content:prompt}]}) });
    const d = await r.json();
    return d.content?.[0]?.text || "Error al generar respuesta.";
  } catch { return "Error de conexión con IA."; }
}

// ─── UI SHARED ────────────────────────────────────────────────────────────────
function StatBar({label, val, bench, color}) {
  const mx = Math.max((bench||0)*2, val+1, 8);
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
        <span style={{color:"#4a6070"}}>{label}</span>
        <span style={{color,fontWeight:700}}>{val}{bench!=null && <span style={{color:"#334155",fontWeight:400}}> / {bench}</span>}</span>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,position:"relative"}}>
        <div style={{height:"100%",width:`${Math.min((val/mx)*100,100)}%`,background:color,borderRadius:3}}/>
        {bench!=null && <div style={{position:"absolute",top:-3,left:`${Math.min((bench/mx)*100,100)}%`,width:2,height:11,background:"#f59e0b",borderRadius:1}}/>}
      </div>
    </div>
  );
}

function Cancha({forma, small=false}) {
  const pts = FP[forma] || [];
  return (
    <svg viewBox="0 0 100 130" style={{width:"100%",maxWidth:small?170:210,display:"block",margin:"0 auto"}}>
      <rect width="100" height="130" fill="#0d2b1e" rx="5"/>
      {[0,1,2,3,4,5].map(i=><rect key={i} y={i*22} width="100" height="11" fill={i%2?"#0f3224":"#0d2b1e"} opacity={0.6}/>)}
      <rect x="2" y="2" width="96" height="126" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth=".7"/>
      <line x1="2" y1="65" x2="98" y2="65" stroke="rgba(255,255,255,.15)" strokeWidth=".5"/>
      <circle cx="50" cy="65" r="9" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth=".5"/>
      <rect x="28" y="2" width="44" height="17" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth=".5"/>
      <rect x="28" y="111" width="44" height="17" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth=".5"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5.5" fill={i===0?"#f59e0b":"#00e87a"} stroke="rgba(0,0,0,.5)" strokeWidth="1"/>
          <text x={p.x} y={p.y+9} textAnchor="middle" fill="rgba(0,0,0,.8)" fontSize="2.8" fontWeight="bold">{p.r}</text>
        </g>
      ))}
      <text x="50" y="6.5" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="3.8" fontWeight="bold">{forma}</text>
    </svg>
  );
}

// ─── MODAL PERFIL JUGADOR ─────────────────────────────────────────────────────
function PerfilModal({jug, eqNombre, ligaNombre, ligaObj, onClose}) {
  const [tab, setTab] = useState("resumen");
  const [inf, setInf] = useState("");
  const [load, setLoad] = useState(false);
  const posData = POS[jug.posicion];
  const hist = jug.historial || [];
  const dims = calcDims(hist, jug.posicion);
  const chartData = hist.map((h,i)=>({ n:i+1, fecha:fmtFecha(h.fecha), bruta:+(h.puntuacion||calcScore(h.stats||{},jug.posicion,2)).toFixed(1), adj:+(h.puntuacionAdj||h.puntuacion||calcScore(h.stats||{},jug.posicion,2)).toFixed(1) }));
  const totalMin = hist.reduce((s,h)=>s+(h.minutos||0),0);
  const avgAdj = chartData.length ? (chartData.reduce((s,d)=>s+d.adj,0)/chartData.length).toFixed(1) : "—";
  const trend = chartData.length>=2 ? (chartData[chartData.length-1].adj > chartData[0].adj ? "📈 MEJORANDO" : "📉 DECLINANDO") : "—";

  async function genIA() {
    setLoad(true);
    const avg = calcAvg(hist);
    const bk = POS[jug.posicion]?.bk||{};
    const txt = await askClaude(`Scout profesional latinoamericano. Análisis completo del jugador.\nJUGADOR: ${jug.nombre} | ${jug.posicion} | ${eqNombre} | ${ligaNombre}\nPartidos:${hist.length} | Minutos:${totalMin} | Nota ajustada promedio:${avgAdj}/10 | Tendencia:${trend}\nDimensiones: Ofensivo=${dims.of} Defensivo=${dims.def} Técnico=${dims.tec} Físico=${dims.fis} Consistencia=${dims.con} BajoPresión=${dims.pre} Progresión=${dims.prog}\nEstadísticas promedio: ${Object.entries(avg).map(([k,v])=>`${k}:${v}`).join(", ")||"sin datos"}\nBenchmarks 1ra div:${JSON.stringify(bk[1]||{})} | 2da div:${JSON.stringify(bk[2]||{})}\n\nGenera análisis en 6 secciones:\n1. PERFIL Y TENDENCIA\n2. FORTALEZAS (3 puntos con datos concretos)\n3. DEBILIDADES (3 puntos)\n4. RENDIMIENTO EN PARTIDOS IMPORTANTES\n5. NIVEL PROFESIONAL EQUIVALENTE\n6. PROYECCIÓN Y RECOMENDACIÓN SCOUT`,1400);
    setInf(txt);
    setLoad(false);
  }

  const DIMS_LABELS = [{k:"of",l:"Ofensivo"},{k:"def",l:"Defensivo"},{k:"tec",l:"Técnico"},{k:"fis",l:"Físico"},{k:"con",l:"Consistencia"},{k:"pre",l:"Bajo Presión"},{k:"prog",l:"Progresión"}];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:400,overflowY:"auto",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:820,margin:"0 auto",background:"#07111a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {jug.foto ? (
              <img src={jug.foto} alt={jug.nombre} style={{width:56,height:56,borderRadius:14,objectFit:"cover",border:`2px solid ${posData?.color||"#334155"}44`}} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}} />
            ) : null}
            <div style={{width:56,height:56,borderRadius:14,background:`${posData?.color||"#334155"}18`,border:`2px solid ${posData?.color||"#334155"}44`,display:jug.foto?"none":"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{posData?.icon||"⚽"}</div>
            <div>
              <div style={{fontWeight:800,color:"#eef2f6",fontSize:22,letterSpacing:"-0.5px"}}>{jug.nombre}</div>
              <div style={{color:"#4a6070",fontSize:13,marginTop:2}}>{jug.posicion} · {eqNombre} · {ligaNombre}{jug.edad?` · ${jug.edad}a`:""}{ jug.numero?` · #${jug.numero}`:""}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>generarPDF(jug,eqNombre,ligaNombre,dims,hist,inf)} style={{background:"linear-gradient(135deg,#00e87a,#00c96a)",border:"none",borderRadius:9,padding:"8px 16px",color:"#000",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit"}}>
              📄 Exportar PDF
            </button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#4a6070",cursor:"pointer",fontSize:26,lineHeight:1}}>✕</button>
          </div>
        </div>

        <div style={{display:"flex",gap:4,marginBottom:20,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:4}}>
          {["resumen","historial","análisis IA"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,background:tab===t?"rgba(0,232,122,0.12)":"transparent",border:`1px solid ${tab===t?"rgba(0,232,122,0.3)":"transparent"}`,borderRadius:8,padding:"8px 0",color:tab===t?"#00e87a":"#4a6070",cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"inherit",textTransform:"capitalize"}}>{t}</button>
          ))}
        </div>

        {tab==="resumen" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[{l:"Partidos",v:hist.length,i:"📋"},{l:"Minutos",v:totalMin,i:"⏱️"},{l:"Nota Ajustada",v:`${avgAdj}/10`,i:"⭐"},{l:"Tendencia",v:trend,i:"📈"}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"14px 12px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{s.i}</div>
                  <div style={{fontWeight:800,color:"#eef2f6",fontSize:16}}>{s.v}</div>
                  <div style={{color:"#4a6070",fontSize:10,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
            {chartData.length>=2 && (
              <Card style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{color:"#eef2f6",fontWeight:600,fontSize:13}}>📈 Evolución del Rendimiento</span>
                  <Bdg color={trend.includes("MEJORANDO")?"#00e87a":"#ef4444"}>{trend}</Bdg>
                </div>
                <ResponsiveContainer width="100%" height={130}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                    <XAxis dataKey="fecha" tick={{fill:"#4a6070",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0,10]} tick={{fill:"#4a6070",fontSize:10}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{background:"#07111a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#eef2f6",fontSize:11}}/>
                    <Line type="monotone" dataKey="bruta" stroke="#334155" strokeWidth={1.5} dot={false} name="Bruta" strokeDasharray="4 2"/>
                    <Line type="monotone" dataKey="adj" stroke={posData?.color||"#00e87a"} strokeWidth={2.5} dot={{fill:posData?.color||"#00e87a",r:3}} name="Ajustada"/>
                    <Legend wrapperStyle={{color:"#4a6070",fontSize:11}}/>
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}
            <Card>
              <div style={{color:"#eef2f6",fontWeight:600,fontSize:13,marginBottom:12}}>🕸️ Perfil por Dimensiones</div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={DIMS_LABELS.map(({k,l})=>({dim:l,val:dims[k]||0}))}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                  <PolarAngleAxis dataKey="dim" tick={{fill:"#4a6070",fontSize:10}}/>
                  <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:"#334155",fontSize:8}} tickCount={4}/>
                  <Radar dataKey="val" stroke={posData?.color||"#00e87a"} fill={posData?.color||"#00e87a"} fillOpacity={0.3}/>
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {tab==="historial" && (
          <Card>
            {hist.length > 0 ? (
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                      {["Fecha","Rival","Tipo","Factor","Min.","Bruta","Ajustada","Result."].map(h=>(
                        <th key={h} style={{color:"#4a6070",fontWeight:600,padding:"6px 10px",textAlign:"left"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hist.map((h,i)=>{
                      const ct = calcCtx(h.stats||{},jug.posicion,2,h.tipo||"local");
                      const tp = TIPOS.find(t=>t.id===h.tipo);
                      return (
                        <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                          <td style={{padding:"7px 10px",color:"#4a6070"}}>{fmtFecha(h.fecha)}</td>
                          <td style={{padding:"7px 10px",color:"#eef2f6",fontWeight:600}}>{h.rival||"—"}</td>
                          <td style={{padding:"7px 10px"}}>{tp&&<Bdg color={tp.color}>{tp.icon} {tp.label}</Bdg>}</td>
                          <td style={{padding:"7px 10px",color:ct.color,fontWeight:700}}>{ct.factor}x</td>
                          <td style={{padding:"7px 10px",color:"#4a6070"}}>{h.minutos||0}'</td>
                          <td style={{padding:"7px 10px",color:"#64748b"}}>{ct.raw}/10</td>
                          <td style={{padding:"7px 10px"}}><span style={{color:ct.adj>=7?"#00e87a":ct.adj>=5?"#f59e0b":"#ef4444",fontWeight:800}}>{ct.adj}/10</span></td>
                          <td style={{padding:"7px 10px"}}>{h.resultado&&<Bdg color="#334155">{h.resultado}</Bdg>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{textAlign:"center",padding:32,color:"#4a6070"}}>Sin partidos registrados aún.</div>
            )}
          </Card>
        )}

        {tab==="análisis IA" && (
          !inf ? (
            <button onClick={genIA} disabled={load} style={{...BP,width:"100%",padding:14,fontSize:14,opacity:load?0.5:1,cursor:load?"not-allowed":"pointer"}}>{load?"⏳ Generando análisis...":"🤖 Generar Análisis Scout Completo con IA"}</button>
          ) : (
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{color:"#eef2f6",fontWeight:600,fontSize:14}}>🤖 Análisis Scout Latino</span>
                <Bdg color="#8b5cf6">IA</Bdg>
              </div>
              <div style={{color:"#94a3b8",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{inf}</div>
              <button onClick={()=>setInf("")} style={{...BN,marginTop:14,fontSize:12}}>↻ Regenerar</button>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({data, role, setTab}) {
  const ligas = data.ligas||[];
  const totalJ = ligas.flatMap(l=>l.equipos.flatMap(e=>e.jugadores)).length;
  const totalP = ligas.flatMap(l=>l.equipos.flatMap(e=>e.jugadores.flatMap(j=>j.historial||[]))).length;
  const talentos = data.talentos||[];
  const pipeline = talentos.filter(t=>t.pipeline==="negociando"||t.pipeline==="destacado");
  const recientes = ligas.flatMap(l=>l.equipos.flatMap(e=>e.jugadores.flatMap(j=>(j.historial||[]).map(h=>({...h,jugador:j.nombre,equipo:e.nombre,icon:POS[j.posicion]?.icon||"⚽"}))))).sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)).slice(0,5);
  const roleLabel = ROLES.find(r=>r.id===role)?.label||"";
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:12,color:"#4a6070",marginBottom:4,fontWeight:600,letterSpacing:1}}>BIENVENIDO — {roleLabel.toUpperCase()}</div>
        <div style={{fontWeight:800,color:"#eef2f6",fontSize:28,letterSpacing:"-1px",marginBottom:4}}>Panel de Control</div>
        <div style={{color:"#4a6070",fontSize:14}}>Resumen de actividad y métricas clave</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {[{l:"Jugadores",v:totalJ,i:"👤",c:"#00e87a",tab:"ligas"},{l:"Partidos",v:totalP,i:"🎬",c:"#3b82f6",tab:"scouting"},{l:"Talentos",v:talentos.length,i:"🔭",c:"#f59e0b",tab:"talentos"},{l:"En Pipeline",v:pipeline.length,i:"📋",c:"#8b5cf6",tab:"pipeline"}].map(k=>(
          <div key={k.l} onClick={()=>setTab(k.tab)} style={{background:"rgba(255,255,255,0.03)",borderRadius:16,padding:"20px 18px",border:`1px solid ${k.c}22`,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=`${k.c}55`;e.currentTarget.style.background=`${k.c}08`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`${k.c}22`;e.currentTarget.style.background="rgba(255,255,255,0.03)";}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,background:`${k.c}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{k.i}</div>
              <span style={{fontSize:11,color:k.c,background:`${k.c}18`,padding:"2px 8px",borderRadius:100,fontWeight:600}}>Ver →</span>
            </div>
            <div style={{fontWeight:800,color:"#eef2f6",fontSize:30,marginTop:14,marginBottom:2}}>{k.v}</div>
            <div style={{color:"#4a6070",fontSize:12}}>{k.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16}}>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{color:"#eef2f6",fontWeight:600,fontSize:14}}>🕐 Actividad Reciente</span>
            <button onClick={()=>setTab("scouting")} style={{background:"none",border:"none",color:"#00e87a",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Ver todo →</button>
          </div>
          {recientes.length===0 && <div style={{color:"#4a6070",textAlign:"center",padding:"24px 0",fontSize:13}}>Sin actividad. Comienza en el módulo Scouting.</div>}
          {recientes.map((h,i)=>{
            const tp = TIPOS.find(t=>t.id===h.tipo);
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{width:34,height:34,borderRadius:9,background:"rgba(0,232,122,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{h.icon}</div>
                <div style={{flex:1}}>
                  <div style={{color:"#eef2f6",fontSize:13,fontWeight:500}}>{h.jugador}</div>
                  <div style={{color:"#4a6070",fontSize:11}}>{h.equipo} · {fmtFecha(h.fecha)}{tp&&<span style={{color:tp.color}}> · {tp.icon} {tp.label}</span>}</div>
                </div>
                {h.puntuacionAdj && <div style={{color:h.puntuacionAdj>=7?"#00e87a":h.puntuacionAdj>=5?"#f59e0b":"#ef4444",fontWeight:800,fontSize:14}}>{h.puntuacionAdj}/10</div>}
              </div>
            );
          })}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{color:"#eef2f6",fontWeight:600,fontSize:14,marginBottom:14}}>🚀 Acciones Rápidas</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{label:"Nuevo Scouting",icon:"🎬",tab:"scouting"},{label:"Analizar Rival",icon:"⚔️",tab:"rival"},{label:"Ver Pipeline",icon:"📋",tab:"pipeline"},{label:"Gestión de Ligas",icon:"🏆",tab:"ligas"},{label:"Base de Talentos",icon:"🔍",tab:"talentos"}].map(a=>(
                <button key={a.tab} onClick={()=>setTab(a.tab)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 14px",color:"#eef2f6",cursor:"pointer",textAlign:"left",fontSize:13,display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,232,122,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
                  <span>{a.icon}</span>{a.label}<span style={{marginLeft:"auto",color:"#4a6070"}}>→</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── LIGAS ────────────────────────────────────────────────────────────────────
function ModLigas({data, setData}) {
  const [ligaId, setLigaId] = useState(null);
  const [eqId, setEqId] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [perfil, setPerfil] = useState(null);
  const liga = data.ligas?.find(l=>l.id===ligaId);
  const equipo = liga?.equipos?.find(e=>e.id===eqId);

  const crearLiga = () => { if(!form.nombre)return; setData(d=>({...d,ligas:[...(d.ligas||[]),{id:uid(),nombre:form.nombre,region:form.region||"",temporada:form.temporada||"2025",equipos:[]}]})); setModal(null); setForm({}); };
  const crearEq = () => { if(!form.nombre)return; setData(d=>({...d,ligas:d.ligas.map(l=>l.id===ligaId?{...l,equipos:[...l.equipos,{id:uid(),nombre:form.nombre,ciudad:form.ciudad||"",jugadores:[]}]}:l)})); setModal(null); setForm({}); };
  const crearJ = () => { if(!form.nombre||!form.posicion)return; setData(d=>({...d,ligas:d.ligas.map(l=>l.id===ligaId?{...l,equipos:l.equipos.map(e=>e.id===eqId?{...e,jugadores:[...e.jugadores,{id:uid(),nombre:form.nombre,posicion:form.posicion,edad:form.edad||"",numero:form.numero||"",historial:[]}]}:e)}:l)})); setModal(null); setForm({}); };
  const del = (tipo, id) => { if(tipo==="liga"){setData(d=>({...d,ligas:d.ligas.filter(l=>l.id!==id)}));setLigaId(null);setEqId(null);} if(tipo==="eq")setData(d=>({...d,ligas:d.ligas.map(l=>l.id===ligaId?{...l,equipos:l.equipos.filter(e=>e.id!==id)}:l)})); if(tipo==="j")setData(d=>({...d,ligas:d.ligas.map(l=>l.id===ligaId?{...l,equipos:l.equipos.map(e=>e.id===eqId?{...e,jugadores:e.jugadores.filter(j=>j.id!==id)}:e)}:l)})); };

  return (
    <div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:20,fontSize:13,flexWrap:"wrap"}}>
        <span onClick={()=>{setLigaId(null);setEqId(null);}} style={{cursor:ligaId?"pointer":"default",color:ligaId?"#4a6070":"#00e87a",fontWeight:700}}>🏆 Ligas</span>
        {ligaId&&<><span style={{color:"#1e2d3a"}}>›</span><span onClick={()=>setEqId(null)} style={{cursor:eqId?"pointer":"default",color:eqId?"#4a6070":"#00e87a",fontWeight:700}}>⚽ {liga?.nombre}</span></>}
        {eqId&&<><span style={{color:"#1e2d3a"}}>›</span><span style={{color:"#00e87a",fontWeight:700}}>👥 {equipo?.nombre}</span></>}
      </div>

      {!ligaId && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>Ligas y Campeonatos</div>
            <button style={BG} onClick={()=>setModal("liga")}>+ Nueva Liga</button>
          </div>
          {!data.ligas?.length && <div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>🏟️</div>Crea tu primera liga para comenzar</div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
            {data.ligas?.map(l=>(
              <div key={l.id} onClick={()=>{setLigaId(l.id);setEqId(null);}} style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(0,232,122,0.15)",padding:20,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,232,122,0.4)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,232,122,0.15)"}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:20,marginBottom:6}}>🏆</div>
                    <div style={{fontWeight:700,color:"#eef2f6",fontSize:15}}>{l.nombre}</div>
                    <div style={{color:"#4a6070",fontSize:12,marginTop:2}}>{l.region} · {l.temporada}</div>
                    <div style={{marginTop:10,display:"flex",gap:6}}>
                      <Bdg color="#00e87a">{l.equipos.length} equipos</Bdg>
                      <Bdg color="#3b82f6">{l.equipos.reduce((s,e)=>s+e.jugadores.length,0)} jugadores</Bdg>
                    </div>
                  </div>
                  <button onClick={ev=>{ev.stopPropagation();del("liga",l.id);}} style={{background:"none",border:"none",color:"#ef444455",cursor:"pointer",fontSize:16,alignSelf:"flex-start"}}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ligaId && !eqId && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>Equipos — {liga?.nombre}</div>
            <button style={BG} onClick={()=>setModal("eq")}>+ Equipo</button>
          </div>
          {!liga?.equipos?.length && <div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>👕</div>Sin equipos aún</div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
            {liga?.equipos?.map(e=>(
              <div key={e.id} onClick={()=>setEqId(e.id)} style={{background:"rgba(255,255,255,0.03)",borderRadius:14,border:"1px solid rgba(59,130,246,0.15)",padding:18,cursor:"pointer"}} onMouseEnter={ev=>ev.currentTarget.style.borderColor="rgba(59,130,246,0.4)"} onMouseLeave={ev=>ev.currentTarget.style.borderColor="rgba(59,130,246,0.15)"}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:18,marginBottom:4}}>⚽</div>
                    <div style={{fontWeight:700,color:"#eef2f6",fontSize:14}}>{e.nombre}</div>
                    <div style={{color:"#4a6070",fontSize:12}}>{e.ciudad}</div>
                    <div style={{marginTop:8}}><Bdg color="#3b82f6">{e.jugadores.length} jugadores</Bdg></div>
                  </div>
                  <button onClick={ev=>{ev.stopPropagation();del("eq",e.id);}} style={{background:"none",border:"none",color:"#ef444455",cursor:"pointer",fontSize:15,alignSelf:"flex-start"}}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {eqId && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>Plantilla — {equipo?.nombre}</div>
            <button style={BG} onClick={()=>setModal("j")}>+ Jugador</button>
          </div>
          {!equipo?.jugadores?.length && <div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>🧑</div>Sin jugadores registrados</div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:11}}>
            {equipo?.jugadores?.map(j=>{
              const pd = POS[j.posicion];
              const pts = j.historial?.length||0;
              const avgSc = pts ? +(j.historial.reduce((s,h)=>s+(h.puntuacionAdj||h.puntuacion||5),0)/pts).toFixed(1) : null;
              return (
                <div key={j.id} onClick={()=>setPerfil({jug:j,eqNombre:equipo.nombre,ligaNombre:liga.nombre,ligaObj:liga})} style={{background:"rgba(255,255,255,0.03)",borderRadius:13,borderLeft:`3px solid ${pd?.color||"#334155"}`,padding:14,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      {j.foto ? (
                        <img src={j.foto} alt={j.nombre} style={{width:36,height:36,borderRadius:9,objectFit:"cover",marginBottom:4,border:`1px solid ${pd?.color||"#334155"}33`}} onError={e=>e.target.style.display="none"}/>
                      ) : (
                        <div style={{fontSize:18,marginBottom:2}}>{pd?.icon||"⚽"}</div>
                      )}
                      <div style={{fontWeight:700,color:"#eef2f6",fontSize:13}}>{j.nombre}</div>
                      <div style={{color:"#4a6070",fontSize:11,marginTop:1}}>{j.posicion}{j.numero?` · #${j.numero}`:""}</div>
                      {avgSc && <div style={{marginTop:6,color:avgSc>=7?"#00e87a":avgSc>=5?"#f59e0b":"#ef4444",fontWeight:800,fontSize:13}}>{avgSc}/10</div>}
                      {pts>0 && <div style={{marginTop:4}}><Bdg color={pd?.color||"#334155"}>{pts} partidos</Bdg></div>}
                    </div>
                    <button onClick={ev=>{ev.stopPropagation();del("j",j.id);}} style={{background:"none",border:"none",color:"#ef444455",cursor:"pointer",fontSize:12}}>🗑</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#07111a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:28,width:340,maxWidth:"92vw"}}>
            <div style={{fontWeight:700,color:"#eef2f6",fontSize:16,marginBottom:18}}>{modal==="liga"?"🏆 Nueva Liga":modal==="eq"?"⚽ Nuevo Equipo":"🧑 Nuevo Jugador"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input style={I} placeholder="Nombre *" value={form.nombre||""} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/>
              {modal==="liga" && <>
                <input style={I} placeholder="Región / Ciudad" value={form.region||""} onChange={e=>setForm(f=>({...f,region:e.target.value}))}/>
                <input style={I} placeholder="Temporada (ej: 2025)" value={form.temporada||""} onChange={e=>setForm(f=>({...f,temporada:e.target.value}))}/>
              </>}
              {modal==="eq" && <input style={I} placeholder="Ciudad" value={form.ciudad||""} onChange={e=>setForm(f=>({...f,ciudad:e.target.value}))}/>}
              {modal==="j" && <>
                <select style={I} value={form.posicion||""} onChange={e=>setForm(f=>({...f,posicion:e.target.value}))}>
                  <option value="">Seleccionar posición *</option>
                  {Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}
                </select>
                <input style={I} placeholder="Edad" type="number" value={form.edad||""} onChange={e=>setForm(f=>({...f,edad:e.target.value}))}/>
                <input style={I} placeholder="Número de camiseta" type="number" value={form.numero||""} onChange={e=>setForm(f=>({...f,numero:e.target.value}))}/>
              </>}
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button style={BG} onClick={modal==="liga"?crearLiga:modal==="eq"?crearEq:crearJ}>Crear</button>
                <button style={BN} onClick={()=>setModal(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {perfil && <PerfilModal {...perfil} onClose={()=>setPerfil(null)}/>}
    </div>
  );
}

// ─── SCOUTING ─────────────────────────────────────────────────────────────────
function ModScouting({data, setData}) {
  const [paso, setPaso] = useState(1);
  const [info, setInfo] = useState({nombre:"",posicion:"",liga:"",equipo:"",tipo:"local",rival:"",resultado:"",minutos:90,div:2,fecha:hoy()});
  const [url, setUrl] = useState(""); const [vid, setVid] = useState(null);
  const [stats, setStats] = useState({}); const [tl, setTl] = useState([]);
  const [timer, setTimer] = useState(0); const [run, setRun] = useState(false);
  const [informe, setInforme] = useState(""); const [load, setLoad] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [sv, setSv] = useState({lId:"",eId:"",jId:""});
  const timerRef = useRef(null);
  const pd = POS[info.posicion];
  const allJ = (data.ligas||[]).flatMap(l=>l.equipos.flatMap(e=>e.jugadores.map(j=>({...j,eN:e.nombre,lN:l.nombre,lId:l.id,eId:e.id}))));

  useEffect(()=>{ if(run) timerRef.current=setInterval(()=>setTimer(t=>t+1),1000); else clearInterval(timerRef.current); return()=>clearInterval(timerRef.current); },[run]);

  const reg = ev => { setStats(s=>({...s,[ev.id]:(s[ev.id]||0)+1})); setTl(t=>[{...ev,t:timer,k:uid()},...t]); };

  async function genInforme() {
    setLoad(true);
    const ct = calcCtx(stats, info.posicion, info.div, info.tipo);
    const bk = pd?.bk[info.div]||{};
    const tp = TIPOS.find(t=>t.id===info.tipo);
    const txt = await askClaude(`Scout profesional de fútbol latinoamericano. Informe de scouting.\nJUGADOR: ${info.nombre} | ${info.posicion} | ${info.equipo} | ${info.liga}\nPartido: ${tp?.label}(×${tp?.factor}) vs ${info.rival||"rival"} | Resultado:${info.resultado||"N/D"} | ${info.minutos}min\nEstadísticas registradas: ${Object.entries(stats).map(([k,v])=>`${k}:${v}`).join(", ")||"sin eventos registrados"}\nBenchmark referencia div${info.div}: ${Object.entries(bk).map(([k,v])=>`${k}:${v}`).join(", ")}\nNota bruta:${ct.raw}/10 | Nota ajustada(×${ct.factor}):${ct.adj}/10\n\n1. RENDIMIENTO EN ESTE PARTIDO\n2. FORTALEZAS observadas en el partido\n3. PUNTOS A MEJORAR\n4. ¿Rendimiento acorde al nivel del partido?\n5. PUNTUACIÓN FINAL justificada`,1000);
    setInforme(txt); setLoad(false); setPaso(5);
  }

  function guardar() {
    if (!sv.jId) return;
    const ct = calcCtx(stats, info.posicion, info.div, info.tipo);
    const match = {id:uid(),fecha:info.fecha,rival:info.rival,tipo:info.tipo,resultado:info.resultado,minutos:info.minutos,stats:{...stats},puntuacion:ct.raw,puntuacionAdj:ct.adj};
    setData(d=>({...d,ligas:d.ligas.map(l=>l.id!==sv.lId?l:{...l,equipos:l.equipos.map(e=>e.id!==sv.eId?e:{...e,jugadores:e.jugadores.map(j=>j.id!==sv.jId?j:{...j,historial:[...(j.historial||[]),match]})})})}));
    setGuardado(true);
  }

  const reset = () => { setPaso(1); setInfo({nombre:"",posicion:"",liga:"",equipo:"",tipo:"local",rival:"",resultado:"",minutos:90,div:2,fecha:hoy()}); setUrl(""); setVid(null); setStats({}); setTl([]); setTimer(0); setRun(false); setInforme(""); setGuardado(false); setSv({lId:"",eId:"",jId:""}); };

  if (paso===1) return (
    <Card>
      <div style={{fontWeight:700,color:"#eef2f6",fontSize:18,marginBottom:20}}>🎬 Información del Partido</div>
      {allJ.length>0 && (
        <div style={{marginBottom:14}}>
          <Lbl>CARGAR JUGADOR DEL SISTEMA</Lbl>
          <select style={I} onChange={e=>{const j=allJ.find(x=>x.id===e.target.value);if(j)setInfo(f=>({...f,nombre:j.nombre,posicion:j.posicion,equipo:j.eN,liga:j.lN}));}}>
            <option value="">— Seleccionar jugador registrado —</option>
            {allJ.map(j=><option key={j.id} value={j.id}>{j.nombre} ({j.posicion}) · {j.eN}</option>)}
          </select>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><Lbl>NOMBRE *</Lbl><input style={I} value={info.nombre} onChange={e=>setInfo(f=>({...f,nombre:e.target.value}))}/></div>
        <div><Lbl>POSICIÓN *</Lbl>
          <select style={I} value={info.posicion} onChange={e=>setInfo(f=>({...f,posicion:e.target.value}))}>
            <option value="">Seleccionar...</option>
            {Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}
          </select>
        </div>
        <div><Lbl>LIGA</Lbl><input style={I} value={info.liga} onChange={e=>setInfo(f=>({...f,liga:e.target.value}))}/></div>
        <div><Lbl>EQUIPO</Lbl><input style={I} value={info.equipo} onChange={e=>setInfo(f=>({...f,equipo:e.target.value}))}/></div>
        <div><Lbl>RIVAL</Lbl><input style={I} value={info.rival} onChange={e=>setInfo(f=>({...f,rival:e.target.value}))}/></div>
        <div><Lbl>RESULTADO</Lbl><input style={I} placeholder="2-1" value={info.resultado} onChange={e=>setInfo(f=>({...f,resultado:e.target.value}))}/></div>
        <div><Lbl>MINUTOS JUGADOS</Lbl><input style={I} type="number" min="1" max="120" value={info.minutos} onChange={e=>setInfo(f=>({...f,minutos:+e.target.value}))}/></div>
        <div><Lbl>FECHA</Lbl><input style={I} type="date" value={info.fecha} onChange={e=>setInfo(f=>({...f,fecha:e.target.value}))}/></div>
        <div style={{gridColumn:"1/-1"}}>
          <Lbl>TIPO DE PARTIDO</Lbl>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {TIPOS.map(tp=>(
              <button key={tp.id} onClick={()=>setInfo(f=>({...f,tipo:tp.id}))} style={{border:`2px solid ${info.tipo===tp.id?tp.color:"rgba(255,255,255,0.08)"}`,borderRadius:10,padding:"8px 4px",background:info.tipo===tp.id?tp.color+"18":"transparent",color:info.tipo===tp.id?tp.color:"#4a6070",cursor:"pointer",fontWeight:700,fontSize:11,textAlign:"center",fontFamily:"inherit"}}>
                {tp.icon}<br/>{tp.label}<br/><span style={{fontSize:9,opacity:.7}}>×{tp.factor}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{gridColumn:"1/-1"}}>
          <Lbl>NIVEL PROFESIONAL DE REFERENCIA</Lbl>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[1,2,3,4].map(n=>(
              <button key={n} onClick={()=>setInfo(f=>({...f,div:n}))} style={{border:`2px solid ${info.div===n?"#f59e0b":"rgba(255,255,255,0.08)"}`,borderRadius:10,padding:"8px 4px",background:info.div===n?"rgba(245,158,11,0.12)":"transparent",color:info.div===n?"#f59e0b":"#4a6070",cursor:"pointer",fontWeight:600,fontSize:11,textAlign:"center",fontFamily:"inherit"}}>
                {["🌎","🥇","🥈","🏘️"][n-1]}<br/>{["Libertadores","1ra Nac.","2da Nac.","Regional"][n-1]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button disabled={!info.nombre||!info.posicion} onClick={()=>setPaso(2)} style={{...BG,marginTop:18,opacity:info.nombre&&info.posicion?1:0.4,cursor:info.nombre&&info.posicion?"pointer":"not-allowed"}}>Siguiente →</button>
    </Card>
  );

  if (paso===2) return (
    <Card>
      <div style={{fontWeight:700,color:"#eef2f6",fontSize:18,marginBottom:18}}>📹 Video del Partido</div>
      <Lbl>LINK DE YOUTUBE (opcional)</Lbl>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <input style={{...I,flex:1}} placeholder="https://youtube.com/watch?v=..." value={url} onChange={e=>setUrl(e.target.value)}/>
        <button onClick={()=>{const id=ytId(url);if(id){setVid(id);setPaso(3);}else alert("Link de YouTube inválido");}} style={BR}>▶ Cargar</button>
      </div>
      <button onClick={()=>setPaso(3)} style={{...BN,width:"100%",marginBottom:10}}>📋 Continuar sin video →</button>
      <button onClick={()=>setPaso(1)} style={{background:"none",border:"none",color:"#4a6070",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← Atrás</button>
    </Card>
  );

  if (paso===3) return (
    <div>
      {vid && <div style={{borderRadius:14,overflow:"hidden",marginBottom:16,aspectRatio:"16/9"}}><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${vid}?rel=0`} allowFullScreen style={{border:"none",display:"block"}}/></div>}
      <div style={{background:"rgba(0,232,122,0.06)",border:"1px solid rgba(0,232,122,0.15)",borderRadius:12,padding:"10px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:13,color:"#94a3b8"}}><strong style={{color:"#eef2f6"}}>{info.nombre}</strong> · {pd?.icon} {info.posicion} · <Bdg color={TIPOS.find(t=>t.id===info.tipo)?.color||"#64748b"}>{TIPOS.find(t=>t.id===info.tipo)?.icon} {TIPOS.find(t=>t.id===info.tipo)?.label}</Bdg></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{color:"#00e87a",fontFamily:"monospace",fontWeight:800,fontSize:20}}>{fmtMin(timer)}</span>
          <button onClick={()=>setRun(r=>!r)} style={{background:run?"rgba(239,68,68,0.15)":"rgba(0,232,122,0.15)",border:`1px solid ${run?"#ef4444":"#00e87a"}`,borderRadius:8,padding:"5px 12px",color:run?"#ef4444":"#00e87a",cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>{run?"⏸ Pausa":"▶ Iniciar"}</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{color:"#eef2f6",fontWeight:600,fontSize:14,marginBottom:12}}>Eventos · {info.posicion}</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {pd?.ev.map(ev=>(
              <button key={ev.id} onClick={()=>reg(ev)} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${pd.color}22`,borderRadius:9,padding:"9px 12px",color:"#eef2f6",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,fontFamily:"inherit"}}>
                <span>{ev.icon} {ev.label}</span>
                <Bdg color={pd.color}>{stats[ev.id]||0}</Bdg>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{color:"#eef2f6",fontWeight:600,fontSize:14,marginBottom:12}}>📊 Registro en Vivo</div>
          <div style={{maxHeight:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
            {!tl.length && <div style={{color:"#4a6070",textAlign:"center",padding:"24px 0",fontSize:13}}>Presiona los botones para registrar eventos...</div>}
            {tl.map(t=>(
              <div key={t.k} style={{display:"flex",gap:8,alignItems:"center",background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"5px 9px"}}>
                <span style={{color:"#4a6070",fontFamily:"monospace",fontSize:11,minWidth:36}}>{fmtMin(t.t)}</span>
                <span>{t.icon}</span>
                <span style={{color:"#94a3b8",fontSize:12}}>{t.label}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>setPaso(4)} style={{...BP,width:"100%",marginTop:12}}>Ver Estadísticas →</button>
        </Card>
      </div>
    </div>
  );

  if (paso===4) {
    const bk = pd?.bk[info.div]||{};
    const ct = calcCtx(stats, info.posicion, info.div, info.tipo);
    const tp = TIPOS.find(t=>t.id===info.tipo);
    return (
      <div>
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontWeight:800,color:"#eef2f6",fontSize:17}}>{info.nombre}</div>
              <div style={{color:"#4a6070",fontSize:12}}>{pd?.icon} {info.posicion} · vs {info.rival}</div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {tp && <Bdg color={tp.color}>{tp.icon} {tp.label} ×{tp.factor}</Bdg>}
              <Bdg color="#00e87a">Bruta: {ct.raw}/10</Bdg>
              <Bdg color="#f59e0b">Ajustada: {ct.adj}/10</Bdg>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 20px"}}>
            {pd?.ev.map(ev=><StatBar key={ev.id} label={`${ev.icon} ${ev.label}`} val={stats[ev.id]||0} bench={bk[ev.id]} color={pd.color}/>)}
          </div>
          <div style={{fontSize:11,color:"#334155",marginTop:8}}>▌ Línea naranja = promedio profesional de referencia para div. {info.div}</div>
        </Card>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setPaso(3)} style={BN}>← Seguir</button>
          <button onClick={genInforme} disabled={load} style={{...BG,flex:1,padding:13,opacity:load?0.5:1,cursor:load?"not-allowed":"pointer"}}>{load?"⏳ Generando informe...":"🤖 Generar Informe de Scouting"}</button>
        </div>
      </div>
    );
  }

  if (paso===5) {
    const ct = calcCtx(stats, info.posicion, info.div, info.tipo);
    return (
      <div>
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:800,color:"#eef2f6",fontSize:18}}>📋 Informe de Scouting</div>
            <div style={{display:"flex",gap:8}}><Bdg color="#64748b">Bruta: {ct.raw}/10</Bdg><Bdg color="#f59e0b">Ajustada: {ct.adj}/10</Bdg></div>
          </div>
          <div style={{color:"#94a3b8",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{informe}</div>
        </Card>

        {!guardado ? (
          <Card style={{marginBottom:14,borderColor:"rgba(0,232,122,0.2)"}}>
            <div style={{fontWeight:600,color:"#eef2f6",fontSize:14,marginBottom:12}}>💾 Guardar en Historial del Jugador</div>
            {allJ.length>0 ? (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div>
                  <Lbl>LIGA</Lbl>
                  <select style={I} value={sv.lId} onChange={e=>setSv(s=>({...s,lId:e.target.value,eId:"",jId:""}))}>
                    <option value="">Seleccionar liga...</option>
                    {(data.ligas||[]).map(l=><option key={l.id} value={l.id}>{l.nombre}</option>)}
                  </select>
                </div>
                {sv.lId && (
                  <div>
                    <Lbl>EQUIPO</Lbl>
                    <select style={I} value={sv.eId} onChange={e=>setSv(s=>({...s,eId:e.target.value,jId:""}))}>
                      <option value="">Seleccionar equipo...</option>
                      {data.ligas?.find(l=>l.id===sv.lId)?.equipos?.map(e=><option key={e.id} value={e.id}>{e.nombre}</option>)}
                    </select>
                  </div>
                )}
                {sv.eId && (
                  <div>
                    <Lbl>JUGADOR</Lbl>
                    <select style={I} value={sv.jId} onChange={e=>setSv(s=>({...s,jId:e.target.value}))}>
                      <option value="">Seleccionar jugador...</option>
                      {data.ligas?.find(l=>l.id===sv.lId)?.equipos?.find(e=>e.id===sv.eId)?.jugadores?.map(j=><option key={j.id} value={j.id}>{POS[j.posicion]?.icon} {j.nombre}</option>)}
                    </select>
                  </div>
                )}
                <button disabled={!sv.jId} onClick={guardar} style={{...BG,opacity:sv.jId?1:0.4,cursor:sv.jId?"pointer":"not-allowed"}}>💾 Guardar en historial</button>
              </div>
            ) : <div style={{color:"#4a6070",fontSize:13}}>Crea ligas y jugadores primero en el módulo Ligas.</div>}
          </Card>
        ) : (
          <Card style={{marginBottom:14,textAlign:"center",padding:20,borderColor:"rgba(0,232,122,0.3)"}}>
            <div style={{fontSize:28,marginBottom:6}}>✅</div>
            <div style={{color:"#00e87a",fontWeight:700}}>Guardado en historial del jugador</div>
          </Card>
        )}
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setPaso(4)} style={BN}>← Ver stats</button>
          <button onClick={reset} style={BG}>+ Nuevo Scouting</button>
        </div>
      </div>
    );
  }
}

// ─── PLANTILLA ────────────────────────────────────────────────────────────────
function ModPlantilla({data}) {
  const [lId, setLId] = useState(""); const [eId, setEId] = useState("");
  const [cat, setCat] = useState("TODOS"); const [perfil, setPerfil] = useState(null);
  const liga = data.ligas?.find(l=>l.id===lId);
  const equipo = liga?.equipos?.find(e=>e.id===eId);
  const jugs = (equipo?.jugadores||[]).filter(j=>cat==="TODOS"||POS[j.posicion]?.cat===cat);
  const getForma = j => { const h=j.historial||[]; if(!h.length) return null; const sc=h.slice(-5).map(x=>x.puntuacionAdj||x.puntuacion||5); return +(sc.reduce((a,b)=>a+b,0)/sc.length).toFixed(1); };
  const getTrend = j => { const h=j.historial||[]; if(h.length<3) return "—"; const sc=h.map(x=>x.puntuacionAdj||x.puntuacion||5); const last=sc.slice(-2); const prev=sc.slice(0,-2); const ap=prev.reduce((a,b)=>a+b,0)/prev.length; const al=last.reduce((a,b)=>a+b,0)/last.length; return al>ap+0.5?"📈":al<ap-0.5?"📉":"➡️"; };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>👥 Gestión de Plantilla</div>
          <div style={{color:"#4a6070",fontSize:13,marginTop:2}}>Vista del técnico — forma y rendimiento de cada jugador</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <select style={{...I,width:"auto"}} value={lId} onChange={e=>{setLId(e.target.value);setEId("");}}>
            <option value="">Seleccionar liga...</option>
            {(data.ligas||[]).map(l=><option key={l.id} value={l.id}>{l.nombre}</option>)}
          </select>
          {lId && <select style={{...I,width:"auto"}} value={eId} onChange={e=>setEId(e.target.value)}>
            <option value="">Seleccionar equipo...</option>
            {liga?.equipos?.map(e=><option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>}
        </div>
      </div>
      {!eId && <div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>👥</div>Selecciona una liga y equipo para ver la plantilla</div>}
      {eId && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
            {["TODOS","GK","DEF","MID","FWD"].map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{padding:"6px 16px",borderRadius:8,border:`1px solid ${cat===c?"rgba(0,232,122,0.4)":"rgba(255,255,255,0.08)"}`,background:cat===c?"rgba(0,232,122,0.1)":"transparent",color:cat===c?"#00e87a":"#4a6070",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{c}</button>
            ))}
            <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center",fontSize:11,color:"#4a6070"}}>
              <span>🟢 7+ · 🟡 5-7 · 🔴 &lt;5</span>
            </div>
          </div>
          {jugs.length===0 && <div style={{textAlign:"center",padding:32,color:"#4a6070"}}>Sin jugadores en esta categoría</div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:12}}>
            {jugs.map(j=>{
              const f = getForma(j); const trend = getTrend(j);
              const pd = POS[j.posicion];
              const sc = f>=7?"#00e87a":f>=5?"#f59e0b":"#ef4444";
              return (
                <div key={j.id} onClick={()=>setPerfil({jug:j,eqNombre:equipo.nombre,ligaNombre:liga.nombre,ligaObj:liga})} style={{background:"rgba(255,255,255,0.03)",borderRadius:14,border:`1px solid ${f?sc+"33":"rgba(255,255,255,0.07)"}`,padding:16,cursor:"pointer",position:"relative"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
                  <div style={{position:"absolute",top:12,right:12,fontSize:16}}>{trend}</div>
                  <div style={{fontSize:22,marginBottom:6}}>{pd?.icon||"⚽"}</div>
                  <div style={{fontWeight:700,color:"#eef2f6",fontSize:14}}>{j.nombre}</div>
                  <div style={{color:"#4a6070",fontSize:11,marginTop:2}}>{j.posicion}{j.numero?` · #${j.numero}`:""}</div>
                  {f!==null ? <div style={{marginTop:10,display:"flex",alignItems:"baseline",gap:4}}><span style={{fontWeight:800,fontSize:22,color:sc}}>{f}</span><span style={{color:"#4a6070",fontSize:11}}>/10</span></div> : <div style={{marginTop:10,color:"#334155",fontSize:12}}>Sin partidos</div>}
                  <div style={{color:"#4a6070",fontSize:10,marginTop:3}}>{j.historial?.length||0} partidos · últimos 5</div>
                  {j.historial?.length>0 && <div style={{display:"flex",gap:3,marginTop:8}}>{j.historial.slice(-5).map((h,i)=>{const s=h.puntuacionAdj||h.puntuacion||5;return <div key={i} style={{flex:1,height:4,borderRadius:2,background:s>=7?"#00e87a":s>=5?"#f59e0b":"#ef4444"}}/>;})}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {perfil && <PerfilModal {...perfil} onClose={()=>setPerfil(null)}/>}
    </div>
  );
}

// ─── TALENTOS ─────────────────────────────────────────────────────────────────
function ModTalentos({data, setData}) {
  const [busq, setBusq] = useState(""); const [fPos, setFPos] = useState(""); const [fSt, setFSt] = useState(""); const [modal, setModal] = useState(false); const [form, setForm] = useState({});
  const talentos = data.talentos||[];
  const filtrados = talentos.filter(t=>{
    if (busq && !t.nombre.toLowerCase().includes(busq.toLowerCase()) && !(t.equipo||"").toLowerCase().includes(busq.toLowerCase())) return false;
    if (fPos && t.posicion!==fPos) return false;
    if (fSt && (t.pipeline||"radar")!==fSt) return false;
    return true;
  });
  const add = () => {
    if (!form.nombre||!form.posicion) return;
    setData(d=>({...d,talentos:[...(d.talentos||[]),{id:uid(),nombre:form.nombre,posicion:form.posicion,equipo:form.equipo||"",edad:form.edad||"",liga:form.liga||"",notas:form.notas||"",pipeline:"radar",fecha:hoy(),historial:[]}]}));
    setModal(false); setForm({});
  };
  const updPipe = (id, st) => setData(d=>({...d,talentos:(d.talentos||[]).map(t=>t.id===id?{...t,pipeline:st}:t)}));
  const del = id => setData(d=>({...d,talentos:(d.talentos||[]).filter(t=>t.id!==id)}));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>🔍 Base de Datos de Talentos</div>
          <div style={{color:"#4a6070",fontSize:13,marginTop:2}}>{talentos.length} jugadores observados</div>
        </div>
        <button style={BG} onClick={()=>setModal(true)}>+ Agregar Talento</button>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <input style={{...I,flex:1,minWidth:200}} placeholder="🔍 Buscar por nombre o equipo..." value={busq} onChange={e=>setBusq(e.target.value)}/>
        <select style={{...I,width:"auto"}} value={fPos} onChange={e=>setFPos(e.target.value)}>
          <option value="">Todas las posiciones</option>
          {Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}
        </select>
        <select style={{...I,width:"auto"}} value={fSt} onChange={e=>setFSt(e.target.value)}>
          <option value="">Todos los estados</option>
          {PIPE_ST.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
        </select>
      </div>
      {filtrados.length===0 && <div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>🔍</div>{talentos.length===0?"Agrega tu primer talento observado":"Sin resultados para los filtros seleccionados"}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {filtrados.map(t=>{
          const pd = POS[t.posicion]; const st = PIPE_ST.find(s=>s.id===(t.pipeline||"radar"));
          return (
            <div key={t.id} style={{background:"rgba(255,255,255,0.03)",borderRadius:16,border:`1px solid ${st?.color||"#334155"}22`,padding:18}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:11,background:`${pd?.color||"#334155"}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{pd?.icon||"⚽"}</div>
                  <div>
                    <div style={{fontWeight:700,color:"#eef2f6",fontSize:14}}>{t.nombre}</div>
                    <div style={{color:"#4a6070",fontSize:11,marginTop:1}}>{t.posicion}{t.edad?` · ${t.edad}a`:""}</div>
                  </div>
                </div>
                <button onClick={()=>del(t.id)} style={{background:"none",border:"none",color:"#ef444455",cursor:"pointer",fontSize:14}}>🗑</button>
              </div>
              {t.equipo && <div style={{color:"#4a6070",fontSize:12,marginBottom:8}}>🏟 {t.equipo}{t.liga?` · ${t.liga}`:""}</div>}
              {t.notas && <div style={{color:"#607080",fontSize:12,marginBottom:10,lineHeight:1.5,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"6px 9px"}}>{t.notas}</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                <Bdg color={st?.color||"#64748b"}>{st?.icon} {st?.label}</Bdg>
                <select value={t.pipeline||"radar"} onChange={e=>updPipe(t.id,e.target.value)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"3px 8px",color:"#94a3b8",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                  {PIPE_ST.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#07111a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:28,width:360,maxWidth:"92vw"}}>
            <div style={{fontWeight:700,color:"#eef2f6",fontSize:16,marginBottom:18}}>🔭 Agregar Talento Observado</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input style={I} placeholder="Nombre del jugador *" value={form.nombre||""} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/>
              <select style={I} value={form.posicion||""} onChange={e=>setForm(f=>({...f,posicion:e.target.value}))}>
                <option value="">Seleccionar posición *</option>
                {Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}
              </select>
              <input style={I} placeholder="Equipo actual" value={form.equipo||""} onChange={e=>setForm(f=>({...f,equipo:e.target.value}))}/>
              <input style={I} placeholder="Liga / Categoría" value={form.liga||""} onChange={e=>setForm(f=>({...f,liga:e.target.value}))}/>
              <input style={I} placeholder="Edad" type="number" value={form.edad||""} onChange={e=>setForm(f=>({...f,edad:e.target.value}))}/>
              <textarea style={{...I,resize:"vertical",minHeight:70}} placeholder="Notas del ojeador..." value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/>
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button style={BG} onClick={add}>Agregar</button>
                <button style={BN} onClick={()=>setModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PIPELINE ─────────────────────────────────────────────────────────────────
function ModPipeline({data, setData}) {
  const talentos = data.talentos||[];
  const move = (id, dir) => {
    const t = talentos.find(x=>x.id===id);
    const idx = PIPE_ST.findIndex(s=>s.id===(t?.pipeline||"radar"));
    const ni = Math.max(0, Math.min(PIPE_ST.length-1, idx+dir));
    setData(d=>({...d,talentos:(d.talentos||[]).map(x=>x.id===id?{...x,pipeline:PIPE_ST[ni].id}:x)}));
  };
  const grouped = PIPE_ST.reduce((acc,s)=>{ acc[s.id]=talentos.filter(t=>(t.pipeline||"radar")===s.id); return acc; },{});
  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>📋 Pipeline de Fichajes</div>
        <div style={{color:"#4a6070",fontSize:13,marginTop:2}}>{talentos.length} jugadores en seguimiento</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,alignItems:"start"}}>
        {PIPE_ST.map(stage=>{
          const items = grouped[stage.id]||[];
          return (
            <div key={stage.id} style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:`1px solid ${stage.color}22`,overflow:"hidden"}}>
              <div style={{padding:"12px 14px",borderBottom:`1px solid ${stage.color}22`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{color:stage.color,fontWeight:700,fontSize:13}}>{stage.icon} {stage.label}</div>
                <div style={{background:`${stage.color}22`,color:stage.color,borderRadius:100,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>{items.length}</div>
              </div>
              <div style={{padding:10,display:"flex",flexDirection:"column",gap:8,minHeight:120}}>
                {items.length===0 && <div style={{color:"#334155",fontSize:12,textAlign:"center",padding:"16px 0"}}>Vacío</div>}
                {items.map(t=>{
                  const pd = POS[t.posicion];
                  return (
                    <div key={t.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:12,border:`1px solid ${stage.color}18`}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <span style={{fontSize:16}}>{pd?.icon||"⚽"}</span>
                        <div>
                          <div style={{fontWeight:700,color:"#eef2f6",fontSize:12}}>{t.nombre}</div>
                          <div style={{color:"#4a6070",fontSize:10}}>{t.posicion}{t.edad?` · ${t.edad}a`:""}</div>
                        </div>
                      </div>
                      {t.equipo && <div style={{color:"#4a6070",fontSize:10,marginBottom:6}}>🏟 {t.equipo}</div>}
                      {t.notas && <div style={{color:"#607080",fontSize:10,marginBottom:8,lineHeight:1.4}}>{t.notas.slice(0,55)}{t.notas.length>55?"...":""}</div>}
                      <div style={{display:"flex",gap:5,justifyContent:"flex-end"}}>
                        {stage.id!=="radar" && <button onClick={()=>move(t.id,-1)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"3px 8px",color:"#4a6070",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>←</button>}
                        {stage.id!=="fichado" && <button onClick={()=>move(t.id,1)} style={{background:`${stage.color}18`,border:`1px solid ${stage.color}33`,borderRadius:6,padding:"3px 8px",color:stage.color,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>→</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {talentos.length===0 && <div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>📋</div>Agrega talentos desde el módulo Talentos para comenzar el pipeline</div>}
    </div>
  );
}

// ─── RIVAL ────────────────────────────────────────────────────────────────────
function ModRival() {
  const [pais, setPais] = useState("🇨🇱 Chile");
  const [div, setDiv] = useState("Primera División");
  const [rival, setRival] = useState("");
  const [fPropia, setFPropia] = useState("4-4-2");
  const [fRival, setFRival] = useState("4-4-2");
  const [inf, setInf] = useState(""); const [load, setLoad] = useState(false);
  const divKeys = Object.keys(SA[pais]||{});
  const clubes = SA[pais]?.[div]?.cl || [];
  const nv = SA[pais]?.[div]?.nv || 2;

  async function analizar() {
    if (!rival) { alert("Selecciona un equipo rival"); return; }
    setLoad(true);
    const txt = await askClaude(`Eres un analista táctico y scout de fútbol latinoamericano de élite.\nMI EQUIPO usa formación ${fPropia}.\nRIVAL: ${rival} | Liga: ${div} | País: ${pais} | Nivel: ${nv}\nFORMACIÓN RIVAL: ${fRival}\n\nGenera análisis táctico completo:\n1. PERFIL DEL RIVAL: estilo de juego típico de ${rival}\n2. FORTALEZAS del rival que debo neutralizar\n3. DEBILIDADES del rival que puedo explotar\n4. DUELO TÁCTICO: ${fPropia} vs ${fRival} — ventajas y desventajas\n5. JUGADORES CLAVE a vigilar\n6. ESTRATEGIA RECOMENDADA para ganar\n7. SISTEMA DE PRESIÓN sugerido\n8. ZONAS DEL CAMPO a explotar en ataque\n9. ZONAS A PROTEGER en defensa\n10. ONCE INICIAL RECOMENDADO con roles específicos`,1500);
    setInf(txt); setLoad(false);
  }

  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>⚔️ Análisis del Rival</div>
        <div style={{color:"#4a6070",fontSize:13,marginTop:2}}>Preparación táctica pre-partido con inteligencia artificial</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
        <Card style={{borderColor:"rgba(0,232,122,0.15)"}}>
          <div style={{color:"#00e87a",fontWeight:600,fontSize:13,marginBottom:14}}>▼ MI EQUIPO</div>
          <Lbl>MI FORMACIÓN</Lbl>
          <select style={{...I,marginBottom:14}} value={fPropia} onChange={e=>setFPropia(e.target.value)}>
            {FORMS.map(f=><option key={f} value={f}>{f}</option>)}
          </select>
          <Cancha forma={fPropia}/>
        </Card>
        <Card style={{borderColor:"rgba(239,68,68,0.15)"}}>
          <div style={{color:"#ef4444",fontWeight:600,fontSize:13,marginBottom:14}}>▲ RIVAL</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <div>
              <Lbl>PAÍS</Lbl>
              <select style={I} value={pais} onChange={e=>{setPais(e.target.value);setDiv(Object.keys(SA[e.target.value]||{})[0]||"");setRival("");}}>
                {Object.keys(SA).map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Lbl>LIGA</Lbl>
              <select style={I} value={div} onChange={e=>{setDiv(e.target.value);setRival("");}}>
                {divKeys.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <Lbl>EQUIPO RIVAL</Lbl>
          <select style={{...I,marginBottom:10}} value={rival} onChange={e=>setRival(e.target.value)}>
            <option value="">Seleccionar equipo...</option>
            {clubes.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <Lbl>FORMACIÓN RIVAL</Lbl>
          <select style={{...I,marginBottom:14}} value={fRival} onChange={e=>setFRival(e.target.value)}>
            {FORMS.map(f=><option key={f} value={f}>{f}</option>)}
          </select>
          <Cancha forma={fRival}/>
        </Card>
      </div>
      <button onClick={analizar} disabled={load} style={{...BR,width:"100%",padding:15,fontSize:15,opacity:load?0.5:1,cursor:load?"not-allowed":"pointer",marginBottom:16}}>
        {load?"⏳ Analizando rival...":"⚔️ Generar Análisis Táctico del Rival"}
      </button>
      {inf && (
        <Card style={{borderColor:"rgba(239,68,68,0.2)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:700,color:"#eef2f6",fontSize:16}}>⚔️ Análisis: {rival}</div>
            <div style={{display:"flex",gap:8}}><Bdg color="#ef4444">{rival}</Bdg><Bdg color="#8b5cf6">IA Scout</Bdg></div>
          </div>
          <div style={{color:"#94a3b8",lineHeight:1.85,fontSize:13,whiteSpace:"pre-wrap"}}>{inf}</div>
          <button onClick={()=>setInf("")} style={{...BN,marginTop:14,fontSize:12}}>↻ Nuevo análisis</button>
        </Card>
      )}
    </div>
  );
}

// ─── TÁCTICO ──────────────────────────────────────────────────────────────────
function ModTactico({data}) {
  const [paso, setPaso] = useState(1);
  const [info, setInfo] = useState({eq:"",rival:"",tipo:"local",res:"",fecha:hoy(),fPropia:"4-4-2",fRival:"4-4-2"});
  const [stats, setStats] = useState({}); const [timer, setTimer] = useState(0); const [run, setRun] = useState(false);
  const [inf, setInf] = useState(""); const [load, setLoad] = useState(false);
  const [url, setUrl] = useState(""); const [vid, setVid] = useState(null);
  const timerRef = useRef(null);
  const allEq = (data.ligas||[]).flatMap(l=>l.equipos.map(e=>({...e,liga:l.nombre})));
  useEffect(()=>{ if(run) timerRef.current=setInterval(()=>setTimer(t=>t+1),1000); else clearInterval(timerRef.current); return()=>clearInterval(timerRef.current); },[run]);
  const reg = ev => setStats(s=>({...s,[ev.id]:(s[ev.id]||0)+1}));
  async function genTactico() {
    setLoad(true);
    const tp = TIPOS.find(t=>t.id===info.tipo);
    const of = EV_EQ.filter(e=>e.tipo==="of").map(e=>`${e.label}:${stats[e.id]||0}`).join(", ");
    const def = EV_EQ.filter(e=>e.tipo==="def").map(e=>`${e.label}:${stats[e.id]||0}`).join(", ");
    const txt = await askClaude(`Analista táctico fútbol latinoamericano.\nEQUIPO: ${info.eq} vs ${info.rival} | ${tp?.label} | Resultado:${info.res||"N/D"}\nFORMACIÓN: ${info.fPropia} vs ${info.fRival}\nOFENSIVO: ${of}\nDEFENSIVO: ${def}\n1.ANÁLISIS FORMACIÓN ${info.fPropia}\n2.RENDIMIENTO OFENSIVO con datos\n3.RENDIMIENTO DEFENSIVO con datos\n4.DUELO TÁCTICO vs ${info.fRival}\n5.PATRONES DE JUEGO observados\n6.VIRTUDES del equipo\n7.DEBILIDADES a corregir\n8.RECOMENDACIONES para próximos partidos\n9.¿Mereció el resultado?`);
    setInf(txt); setLoad(false); setPaso(3);
  }
  const reset = () => { setPaso(1); setInfo({eq:"",rival:"",tipo:"local",res:"",fecha:hoy(),fPropia:"4-4-2",fRival:"4-4-2"}); setStats({}); setTimer(0); setRun(false); setInf(""); setVid(null); setUrl(""); };

  if (paso===1) return (
    <Card>
      <div style={{fontWeight:700,color:"#eef2f6",fontSize:18,marginBottom:20}}>🗺️ Análisis Táctico del Equipo</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"1/-1"}}>
          <Lbl>CARGAR EQUIPO DEL SISTEMA</Lbl>
          <select style={I} onChange={e=>{const eq=allEq.find(q=>q.id===e.target.value);if(eq)setInfo(f=>({...f,eq:`${eq.nombre} (${eq.liga})`}));}}>
            <option value="">— Seleccionar del sistema —</option>
            {allEq.map(e=><option key={e.id} value={e.id}>{e.nombre} · {e.liga}</option>)}
          </select>
        </div>
        <div><Lbl>EQUIPO</Lbl><input style={I} value={info.eq} onChange={e=>setInfo(f=>({...f,eq:e.target.value}))}/></div>
        <div><Lbl>RIVAL</Lbl><input style={I} value={info.rival} onChange={e=>setInfo(f=>({...f,rival:e.target.value}))}/></div>
        <div><Lbl>RESULTADO</Lbl><input style={I} placeholder="2-1" value={info.res} onChange={e=>setInfo(f=>({...f,res:e.target.value}))}/></div>
        <div><Lbl>FECHA</Lbl><input style={I} type="date" value={info.fecha} onChange={e=>setInfo(f=>({...f,fecha:e.target.value}))}/></div>
        <div style={{gridColumn:"1/-1"}}>
          <Lbl>TIPO DE PARTIDO</Lbl>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {TIPOS.map(tp=>(
              <button key={tp.id} onClick={()=>setInfo(f=>({...f,tipo:tp.id}))} style={{border:`2px solid ${info.tipo===tp.id?tp.color:"rgba(255,255,255,0.08)"}`,borderRadius:10,padding:"7px 4px",background:info.tipo===tp.id?tp.color+"18":"transparent",color:info.tipo===tp.id?tp.color:"#4a6070",cursor:"pointer",fontWeight:700,fontSize:11,textAlign:"center",fontFamily:"inherit"}}>
                {tp.icon}<br/>{tp.label}
              </button>
            ))}
          </div>
        </div>
        <div><Lbl>FORMACIÓN PROPIA</Lbl><select style={I} value={info.fPropia} onChange={e=>setInfo(f=>({...f,fPropia:e.target.value}))}>{FORMS.map(f=><option key={f} value={f}>{f}</option>)}</select></div>
        <div><Lbl>FORMACIÓN RIVAL</Lbl><select style={I} value={info.fRival} onChange={e=>setInfo(f=>({...f,fRival:e.target.value}))}>{FORMS.map(f=><option key={f} value={f}>{f}</option>)}</select></div>
        <div style={{gridColumn:"1/-1"}}>
          <Lbl>VIDEO YOUTUBE (opcional)</Lbl>
          <div style={{display:"flex",gap:8}}>
            <input style={{...I,flex:1}} placeholder="https://youtube.com/..." value={url} onChange={e=>setUrl(e.target.value)}/>
            <button onClick={()=>{const id=ytId(url);if(id)setVid(id);}} style={BR}>▶ Cargar</button>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:18}}>
        <div><div style={{color:"#00e87a",fontSize:11,fontWeight:700,textAlign:"center",marginBottom:8}}>▼ TU EQUIPO · {info.fPropia}</div><Cancha forma={info.fPropia}/></div>
        <div><div style={{color:"#ef4444",fontSize:11,fontWeight:700,textAlign:"center",marginBottom:8}}>▲ RIVAL · {info.fRival}</div><Cancha forma={info.fRival}/></div>
      </div>
      <button disabled={!info.eq} onClick={()=>setPaso(2)} style={{...BG,marginTop:16,opacity:info.eq?1:0.4,cursor:info.eq?"pointer":"not-allowed"}}>Iniciar Análisis →</button>
    </Card>
  );

  if (paso===2) return (
    <div>
      {vid && <div style={{borderRadius:14,overflow:"hidden",marginBottom:14,aspectRatio:"16/9"}}><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${vid}?rel=0`} allowFullScreen style={{border:"none",display:"block"}}/></div>}
      <div style={{background:"rgba(59,130,246,0.06)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:12,padding:"10px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{color:"#94a3b8",fontSize:13}}><strong style={{color:"#eef2f6"}}>{info.eq}</strong> {info.fPropia} vs <strong style={{color:"#eef2f6"}}>{info.rival||"Rival"}</strong> {info.fRival}</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{color:"#3b82f6",fontFamily:"monospace",fontWeight:800,fontSize:20}}>{fmtMin(timer)}</span>
          <button onClick={()=>setRun(r=>!r)} style={{background:run?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)",border:`1px solid ${run?"#ef4444":"#3b82f6"}`,borderRadius:8,padding:"5px 12px",color:run?"#ef4444":"#3b82f6",cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>{run?"⏸ Pausa":"▶ Iniciar"}</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{color:"#00e87a",fontWeight:700,fontSize:13,marginBottom:10}}>⚔️ OFENSIVOS</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {EV_EQ.filter(e=>e.tipo==="of").map(ev=>(
              <button key={ev.id} onClick={()=>reg(ev)} style={{background:"rgba(0,232,122,0.05)",border:"1px solid rgba(0,232,122,0.15)",borderRadius:9,padding:"8px 11px",color:"#eef2f6",cursor:"pointer",display:"flex",justifyContent:"space-between",fontSize:12,fontFamily:"inherit"}}>
                <span>{ev.icon} {ev.label}</span>
                <Bdg color="#00e87a">{stats[ev.id]||0}</Bdg>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{color:"#ef4444",fontWeight:700,fontSize:13,marginBottom:10}}>🛡️ DEFENSIVOS</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {EV_EQ.filter(e=>e.tipo==="def").map(ev=>(
              <button key={ev.id} onClick={()=>reg(ev)} style={{background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:9,padding:"8px 11px",color:"#eef2f6",cursor:"pointer",display:"flex",justifyContent:"space-between",fontSize:12,fontFamily:"inherit"}}>
                <span>{ev.icon} {ev.label}</span>
                <Bdg color="#ef4444">{stats[ev.id]||0}</Bdg>
              </button>
            ))}
          </div>
        </Card>
      </div>
      <div style={{marginTop:14,display:"flex",gap:10}}>
        <button onClick={()=>setPaso(1)} style={BN}>← Atrás</button>
        <button onClick={genTactico} disabled={load} style={{...BB,flex:1,padding:13,opacity:load?0.5:1,cursor:load?"not-allowed":"pointer"}}>{load?"⏳ Analizando...":"🤖 Generar Análisis Táctico Completo"}</button>
      </div>
    </div>
  );

  if (paso===3) return (
    <div>
      <Card style={{marginBottom:14,borderColor:"rgba(59,130,246,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontWeight:800,color:"#eef2f6",fontSize:17}}>📋 Análisis Táctico</div>
            <div style={{color:"#4a6070",fontSize:12}}>{info.eq} {info.fPropia} vs {info.rival||"Rival"} {info.fRival}</div>
          </div>
          <Bdg color="#3b82f6">{info.res||"N/D"}</Bdg>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><div style={{color:"#00e87a",fontSize:11,fontWeight:700,textAlign:"center",marginBottom:6}}>TU EQUIPO</div><Cancha forma={info.fPropia} small/></div>
          <div><div style={{color:"#ef4444",fontSize:11,fontWeight:700,textAlign:"center",marginBottom:6}}>RIVAL</div><Cancha forma={info.fRival} small/></div>
        </div>
        <div style={{color:"#94a3b8",lineHeight:1.8,fontSize:13,whiteSpace:"pre-wrap",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:14}}>{inf}</div>
      </Card>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setPaso(2)} style={BN}>← Eventos</button>
        <button onClick={reset} style={BG}>+ Nuevo Análisis</button>
      </div>
    </div>
  );
}

// ─── BENCHMARKS ───────────────────────────────────────────────────────────────
function ModBenchmarks() {
  const paises = Object.keys(SA);
  const [pais, setPais] = useState(paises[0]);
  const [div, setDiv] = useState(Object.keys(SA[paises[0]])[0]);
  const [pos, setPos] = useState("Delantero Centro");
  const divData = SA[pais]?.[div];
  const bk = POS[pos]?.bk[divData?.nv||2]||{};
  const pd = POS[pos];
  const nC = {1:"#00e87a",2:"#3b82f6",3:"#f59e0b"};
  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontWeight:700,color:"#eef2f6",fontSize:18}}>📊 Base de Datos Sudamericana</div>
        <div style={{color:"#4a6070",fontSize:13,marginTop:2}}>255 clubes reales · 30 ligas · 10 países · API-Football 2024</div>
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div>
            <Lbl>PAÍS</Lbl>
            <select style={I} value={pais} onChange={e=>{setPais(e.target.value);setDiv(Object.keys(SA[e.target.value])[0]);}}>
              {paises.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <Lbl>DIVISIÓN</Lbl>
            <select style={I} value={div} onChange={e=>setDiv(e.target.value)}>
              {Object.keys(SA[pais]||{}).map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <Lbl>POSICIÓN</Lbl>
            <select style={I} value={pos} onChange={e=>setPos(e.target.value)}>
              {Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}
            </select>
          </div>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:16}}>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{color:"#eef2f6",fontWeight:600,fontSize:14}}>{pd?.icon} {pos} · {div}</span>
            <Bdg color={nC[divData?.nv||2]}>Nivel {divData?.nv}</Bdg>
          </div>
          {Object.entries(bk).map(([k,v])=>{
            const ev = pd?.ev.find(e=>e.id===k);
            return <StatBar key={k} label={`${ev?.icon||""} ${ev?.label||k}`} val={v} bench={null} color={pd?.color||"#00e87a"}/>;
          })}
          <div style={{marginTop:10,padding:"8px 12px",background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:8,fontSize:11,color:"#fbbf24"}}>Promedios estadísticos por partido para este nivel profesional</div>
        </Card>
        <Card>
          <div style={{color:"#eef2f6",fontWeight:600,fontSize:14,marginBottom:12}}>🏆 Clubes — {div}</div>
          <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:380,overflowY:"auto"}}>
            {(divData?.cl||[]).map(c=>(
              <div key={c} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"6px 10px"}}>
                <span style={{color:nC[divData?.nv||2],fontSize:11,fontWeight:800}}>•</span>
                <span style={{color:"#94a3b8",fontSize:13}}>{c}</span>
              </div>
            ))}
            {!(divData?.cl?.length) && <div style={{color:"#334155",fontSize:12,textAlign:"center",padding:16}}>Datos no disponibles</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard",icon:"🏠",label:"Dashboard",roles:["scout","tecnico","club"]},
  {id:"ligas",icon:"🏆",label:"Ligas",roles:["scout","tecnico","club"]},
  {id:"scouting",icon:"🎬",label:"Scouting",roles:["scout","tecnico","club"]},
  {id:"plantilla",icon:"👥",label:"Plantilla",roles:["tecnico","club"]},
  {id:"talentos",icon:"🔍",label:"Talentos",roles:["scout","club"]},
  {id:"pipeline",icon:"📋",label:"Pipeline Fichajes",roles:["club","scout"]},
  {id:"rival",icon:"⚔️",label:"Análisis Rival",roles:["tecnico","club","scout"]},
  {id:"tactico",icon:"🗺️",label:"Análisis Táctico",roles:["tecnico","club","scout"]},
  {id:"benchmarks",icon:"📊",label:"Benchmarks SA",roles:["scout","tecnico","club"]},
];

export default function ScoutLatinoApp() {
  const [tab, setTab] = useState("dashboard");
  const [role, setRole] = useState(null);
  const [data, setData] = useState({ligas:[], talentos:[]});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        const r = await window.storage.get("sl-data-v4");
        if (r) setData(JSON.parse(r.value));
        const ro = await window.storage.get("sl-role-v4");
        if (ro) setRole(ro.value);
      } catch(e) { console.log("storage:", e); }
    })();
  },[]);

  useEffect(()=>{
    (async()=>{
      try { await window.storage.set("sl-data-v4", JSON.stringify(data)); }
      catch(e) { console.log("save:", e); }
    })();
  },[data]);

  async function selectRole(r) {
    setRole(r);
    try { await window.storage.set("sl-role-v4", r); } catch(e) {}
    setTab("dashboard");
  }

  // Pantalla de selección de rol
  if (!role) return (
    <div style={{minHeight:"100vh",background:"#040a0f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:20}}>
      <style>{`*{box-sizing:border-box} select option{background:#07111a}`}</style>
      <div style={{maxWidth:500,width:"100%",textAlign:"center"}}>
        <div style={{width:70,height:70,borderRadius:18,background:"linear-gradient(135deg,#00e87a,#00c96a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 28px",boxShadow:"0 0 40px rgba(0,232,122,0.25)"}}>⚽</div>
        <div style={{fontWeight:800,color:"#eef2f6",fontSize:32,letterSpacing:"-1px",marginBottom:6}}>Scout Latino</div>
        <div style={{color:"#4a6070",fontSize:15,marginBottom:40}}>Selecciona tu perfil para acceder</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {ROLES.map(r=>(
            <button key={r.id} onClick={()=>selectRole(r.id)} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 24px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,cursor:"pointer",textAlign:"left",fontFamily:"inherit",width:"100%"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,232,122,0.08)";e.currentTarget.style.borderColor="rgba(0,232,122,0.3)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
              <div style={{width:48,height:48,borderRadius:12,background:"rgba(0,232,122,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:"#eef2f6",fontSize:16,marginBottom:2}}>{r.label}</div>
                <div style={{color:"#4a6070",fontSize:13}}>{r.desc}</div>
              </div>
              <div style={{color:"#4a6070",fontSize:18}}>→</div>
            </button>
          ))}
        </div>
        <div style={{marginTop:24,color:"#334155",fontSize:12}}>Los datos se guardan localmente en este dispositivo</div>
      </div>
    </div>
  );

  const roleData = ROLES.find(r=>r.id===role);
  const navItems = NAV.filter(n=>n.roles.includes(role));

  return (
    <div style={{minHeight:"100vh",background:"#040a0f",display:"flex",fontFamily:"system-ui,sans-serif",color:"#eef2f6"}}>
      <style>{`*{box-sizing:border-box} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#07111a} ::-webkit-scrollbar-thumb{background:#1e2d3a;border-radius:3px} select option{background:#07111a} input[type=date]{color-scheme:dark}`}</style>

      {/* SIDEBAR */}
      <div style={{width:collapsed?56:210,flexShrink:0,background:"#07111a",borderRight:"1px solid rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",transition:"width .2s",overflow:"hidden",position:"sticky",top:0,height:"100vh"}}>
        {/* Logo */}
        <div style={{padding:collapsed?"14px 10px":"18px 14px 14px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#00e87a,#00c96a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⚽</div>
          {!collapsed && <div><div style={{fontWeight:800,fontSize:13,color:"#eef2f6",whiteSpace:"nowrap"}}>Scout Latino</div><div style={{fontSize:9,color:"#4a6070",whiteSpace:"nowrap"}}>{roleData?.icon} {roleData?.label}</div></div>}
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"10px 6px",overflowY:"auto"}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} title={n.label} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:collapsed?"10px":"9px 10px",borderRadius:9,border:"none",background:tab===n.id?"rgba(0,232,122,0.1)":"transparent",cursor:"pointer",marginBottom:2,fontFamily:"inherit",textAlign:"left"}} onMouseEnter={e=>{if(tab!==n.id)e.currentTarget.style.background="rgba(255,255,255,0.04)";}} onMouseLeave={e=>{if(tab!==n.id)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:17,flexShrink:0,lineHeight:1,minWidth:20,textAlign:"center"}}>{n.icon}</span>
              {!collapsed && <span style={{color:tab===n.id?"#00e87a":"#607080",fontSize:12,fontWeight:tab===n.id?600:400,whiteSpace:"nowrap"}}>{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div style={{padding:"10px 6px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <button onClick={()=>setRole(null)} title="Cambiar rol" style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:collapsed?"10px":"9px 10px",borderRadius:9,border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",marginBottom:2}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:16,flexShrink:0,minWidth:20,textAlign:"center"}}>🔄</span>
            {!collapsed && <span style={{color:"#4a6070",fontSize:12}}>Cambiar rol</span>}
          </button>
          <button onClick={()=>setCollapsed(c=>!c)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:collapsed?"10px":"9px 10px",borderRadius:9,border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:15,flexShrink:0,minWidth:20,textAlign:"center"}}>{collapsed?"►":"◄"}</span>
            {!collapsed && <span style={{color:"#4a6070",fontSize:12}}>Colapsar</span>}
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{flex:1,overflow:"auto"}}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"28px 24px"}}>
          {tab==="dashboard"  && <Dashboard   data={data} role={role} setTab={setTab}/>}
          {tab==="ligas"      && <ModLigas     data={data} setData={setData}/>}
          {tab==="scouting"   && <ModScouting  data={data} setData={setData}/>}
          {tab==="plantilla"  && <ModPlantilla data={data} setData={setData}/>}
          {tab==="talentos"   && <ModTalentos  data={data} setData={setData}/>}
          {tab==="pipeline"   && <ModPipeline  data={data} setData={setData}/>}
          {tab==="rival"      && <ModRival/>}
          {tab==="comparador" && <ComparadorPro realPlayers={[]}/>}
          {tab==="tactico"    && <ModTactico   data={data}/>}
          {tab==="benchmarks" && <ModBenchmarks/>}
        </div>
      </div>
    </div>
  );
}

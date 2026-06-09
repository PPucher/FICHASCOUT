import RadarOculto from "./RadarOculto.jsx";
import BuscarReemplazo from "./BuscarReemplazo.jsx";
import BasePro from "./BasePro.jsx";
import ComparadorPro from "./ComparadorPro.jsx";
import { generarPDF } from "./PDFExport.jsx";
import { useState, useEffect, useRef, useMemo } from "react";
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
  "cl Chile":{
    "Primera División":{"nv":1,"id":265,"cl":["A. Italiano", "Cobreloa", "Cobresal", "Colo Colo", "Coquimbo Unido", "Deportes Copiapo", "Deportes Iquique", "Everton de Vina", "Huachipato", "Nublense", "O'Higgins", "Palestino", "U. Catolica", "Union Espanola", "Union La Calera", "Universidad de Chile"]},
    "Copa Chile":{"nv":3,"id":267,"cl":["11 de Septiembre", "A. Italiano", "Antofagasta", "Barnechea", "Central Norte", "Cobreloa", "Cobresal", "Colo Colo", "Comunal Cabrero", "Concepción", "Concón National", "Coquimbo Unido", "Curico Unido", "D. La Serena", "D. Melipilla", "D. Puerto Montt", "Deportes Copiapo", "Deportes Iquique", "Deportes Limache", "Deportes Quillón", "Deportes Rengo", "Deportes Santa Cruz", "Deportes Temuco", "Everton de Vina", "Fernández Vial", "General Velásquez", "Glorias Navales", "Huachipato", "Imperial Unido", "Lautaro de Buin", "Linares Unido", "Magallanes", "Municipal Mejillones", "Municipal Puente Alto", "Municipal Salamanca", "Nublense", "O'Higgins", "Palestino", "Provincial Osorno", "Provincial Ovalle", "Rangers de Talca", "Real San Joaquín", "Recoleta", "San Antonio Unido", "San Luis", "San Marcos de Arica", "Santiago City", "Santiago Morning", "Santiago Wanderers", "Trasandino", "U. Catolica", "Union Espanola", "Union La Calera", "Union San Felipe", "Universidad de Chile", "Universidad de Concepcion", "Vicente Rosales"]},
    "Primera B":{"nv":2,"id":266,"cl":["Antofagasta", "Barnechea", "Curico Unido", "D. La Serena", "Deportes Limache", "Deportes Santa Cruz", "Deportes Temuco", "Magallanes", "Rangers de Talca", "Recoleta", "San Luis", "San Marcos de Arica", "Santiago Morning", "Santiago Wanderers", "Union San Felipe", "Universidad de Concepcion"]}
  },
  "AR Argentina":{
    "Liga Profesional":{"nv":1,"id":128,"cl":["Argentinos JRS", "Atletico Tucuman", "Banfield", "Barracas Central", "Belgrano Cordoba", "Boca Juniors", "Central Cordoba de Santiago", "Defensa Y Justicia", "Deportivo Riestra", "Estudiantes L.P.", "Gimnasia L.P.", "Godoy Cruz", "Huracan", "Independ. Rivadavia", "Independiente", "Instituto Cordoba", "Lanus", "Newells Old Boys", "Platense", "Racing Club", "River Plate", "Rosario Central", "San Lorenzo", "Sarmiento Junin", "Talleres Cordoba", "Tigre", "Union Santa Fe", "Velez Sarsfield"]},
    "Primera B Metro":{"nv":2,"id":131,"cl":["Acassuso", "Argentino Quilmes", "Argentino de Merlo", "Canuelas", "Colegiales", "Comunicaciones", "Deportivo Armenio", "Deportivo Laferrere", "Deportivo Merlo", "Dock Sud", "Excursionistas", "Flandria", "Fénix", "Liniers", "Los Andes", "Midland", "Sacachispas", "San Martín Burzaco", "Sarmiento de La Banda", "Sportivo Italiano", "UAI Urquiza", "Villa Dalmine", "Villa San Carlos"]}
  },
  "BR Brasil":{
    "Série A":{"nv":1,"id":71,"cl":["Atletico Goianiense", "Atletico Paranaense", "Atletico-MG", "Bahia", "Botafogo", "Corinthians", "Criciuma", "Cruzeiro", "Cuiaba", "Flamengo", "Fluminense", "Fortaleza EC", "Gremio", "Internacional", "Juventude", "Palmeiras", "RB Bragantino", "Sao Paulo", "Vasco DA Gama", "Vitoria"]},
    "Série B":{"nv":2,"id":72,"cl":["Amazonas", "America Mineiro", "Avai", "Botafogo SP", "Brusque", "CRB", "Ceara", "Chapecoense-sc", "Coritiba", "Goias", "Guarani Campinas", "Ituano", "Mirassol", "Novorizontino", "Operario-PR", "Paysandu", "Ponte Preta", "Santos", "Sport Recife", "Vila Nova"]},
    "Série C":{"nv":3,"id":75,"cl":["ABC", "Aparecidense", "Athletic Club", "Botafogo PB", "CSA", "Caxias", "Confiança", "Ferroviario", "Ferroviária", "Figueirense", "Floresta", "Londrina", "Nautico Recife", "Remo", "Sampaio Correa", "Sao Jose", "São Bernardo", "Tombense", "Volta Redonda", "Ypiranga-RS"]},
    "Copa Do Brasil":{"nv":3,"id":73,"cl":["ABC", "AO Itabaiana", "ASA", "Amazonas", "America Mineiro", "America-RN", "Anápolis", "Aparecidense", "Athletic Club", "Atletico Goianiense", "Atletico Paranaense", "Atletico-MG", "Audax Rio", "Bahia", "Botafogo", "Botafogo SP", "Brasiliense", "Brusque", "CEOV Operário", "CRB", "Capital", "Cascavel", "Caxias", "Cianorte", "Confiança", "Corinthians", "Coritiba", "Costa Rica ", "Criciuma", "Cruzeiro", "Cuiaba", "Ferroviario", "Flamengo", "Fluminense", "Fluminense PI", "GAS", "Goias", "Gremio", "Humaitá", "Iguatu", "Independente AP", "Internacional", "Itabuna", "Ituano", "Jacuipense", "Ji-Paraná", "Juventude", "Manauara", "Maranhão", "Marcílio Dias", "Maringá", "Moto Club", "Murici Fc", "Nova Iguaçu", "Nova Venécia", "Olaria", "Operario Ferroviario", "Palmeiras", "Petrolina", "Porto Velho", "Portuguesa RJ", "Portuguesa Santista", "RB Bragantino", "Real FC", "Real Noroeste", "Remo", "Retrô", "Rio Branco", "River AC", "Sampaio Correa", "Sao Paulo", "Sao Raimundo", "Sousa", "Sport Recife", "São Bernardo", "São Luiz", "Tocantinópolis", "Tombense", "Trem", "Treze", "União Rondonópolis", "Vasco DA Gama", "Villa Nova", "Vitoria", "Volta Redonda", "Ypiranga-RS", "Água Santa", "Águia de Marabá"]}
  },
  "CO Colombia":{
    "Primera A":{"nv":1,"id":239,"cl":["Alianza Valledupar", "America de Cali", "Atletico Nacional", "Bucaramanga", "Chico", "Deportes Tolima", "Deportivo Cali", "Deportivo Pasto", "Deportivo Pereira", "Envigado", "Fortaleza FC", "Independiente Medellin", "Internacional de Bogota", "Jaguares", "Junior", "Millonarios", "Once Caldas", "Patriotas", "Santa Fe", "Águilas Doradas"]},
    "Liga Nacional":{"nv":2,"id":241,"cl":["Alianza Valledupar", "America de Cali", "Atletico Nacional", "Bogota FC", "Bucaramanga", "Chico", "Cucuta", "Depor FC", "Deportes Tolima", "Deportivo Cali", "Deportivo Pasto", "Deportivo Pereira", "Envigado", "Fortaleza FC", "Huila", "Internacional Palmira", "Internacional de Bogota", "Jaguares", "Llaneros", "Millonarios", "Once Caldas", "Orsomarso", "Patriotas", "Popayan", "Quindio", "Real Cartagena", "Real Soacha", "Santa Fe", "Tigres FC", "Union Magdalena"]}
  },
  "UV Uruguay":{
    "Primera División Apertura":{"nv":1,"id":268,"cl":["Boston River", "CA River Plate", "Cerro", "Cerro Largo", "Club Nacional", "Danubio", "Defensor Sporting", "Deportivo Maldonado", "Fenix", "Liverpool Montevideo", "Livingston", "Miramar", "Penarol", "Progreso", "Racing Montevideo", "Rampla Juniors", "Wanderers"]}
  },
  "PE Perú":{
    "Liga 1":{"nv":1,"id":283,"cl":["AFC Hermannstadt", "CFR 1907 Cluj", "Dinamo Bucuresti", "FC Botosani", "FCSB", "Farul Constanta", "Oţelul", "Petrolul Ploiesti", "Politehnica Iasi", "Rapid", "SCM Gloria Buzău", "Sepsi OSK Sfantu Gheorghe", "Unirea Slobozia", "Universitatea Cluj", "Universitatea Craiova", "Uta Arad"]}
  },
  "EC Ecuador":{
    "LigaPro Serie A":{"nv":1,"id":240,"cl":["Barranquilla", "Bogota FC", "Cucuta", "Depor FC", "Huila", "Internacional Palmira", "Leones FC", "Llaneros", "Orsomarso", "Popayan", "Quindio", "Real Cartagena", "Real Santander", "Real Soacha", "Tigres FC", "Union Magdalena"]},
    "LigaPro Serie B":{"nv":2,"id":514,"cl":["ASO Chlef", "CR Belouizdad", "ES Setif", "El Bayadh", "JS Saoura", "Khenchela", "MC Alger", "MC Oran", "Mostaganem", "NC Magra", "Olympique Akbou", "Paradou AC", "Témouchent", "USM Alger", "Usm El Harrach"]}
  },
  "BO Bolivia":{
    "División Profesional":{"nv":1,"id":209,"cl":["Altstätten", "BSC Young Boys", "Bellinzona", "Besa St. Gallen", "Biel-Bienne", "Brühl", "Dardania St. Gallen", "Echallens", "Emmen", "FC Aarau", "FC Basel 1893", "FC Lugano", "FC Luzern", "FC ST. Gallen", "FC Schaffhausen", "FC Sion", "FC Thun", "FC WIL 1900", "FC Winterthur", "FC Zurich", "Gambarogno - Contone", "Genolier-Begnins", "Grasshoppers", "Lancy", "Langenthal", "Lausanne", "Le Locle Sports", "Mendrisio", "Monthey", "Neuchatel Xamax FC", "Paradiso", "Prishtina Bern", "Rapperswil", "SC Kriens", "Servette FC", "Signal", "Solothurn", "Stade Lausanne-Ouchy", "Stade Nyonnais", "Taverne", "Vevey Sports", "Wettswil-Bonstetten", "YF Juventus", "Yverdon Sport", "Étoile Carouge"]}
  },
  "PY Paraguay":{
    "División de Honor":{"nv":1,"id":282,"cl":["Academia Cantolao", "Alianza Universidad", "Ayacucho FC", "Carlos Stein", "Comerciantes", "Deportiva Agropecuaria", "Deportivo Binacional", "Deportivo Coopsol", "Deportivo Llacuabamba", "Deportivo Municipal", "Juan Pablo II College", "Molinos El Pirata", "San Marcos", "Santos", "U. San Martin", "UCV Moquegua"]}
  },
  "VE Venezuela":{
    "Liga FUTVE":{"nv":1,"id":292,"cl":["Daegu FC", "Daejeon Citizen", "FC Seoul", "Gangwon FC", "Gimcheon Sangmu FC", "Gwangju FC", "Incheon United", "Jeju United FC", "Jeonbuk Motors", "Pohang Steelers", "Suwon City FC", "Ulsan Hyundai FC"]}
  },
  "SA Copas":{
    "Copa Libertadores":{"nv":1,"id":13,"cl":["Alianza Lima", "Always Ready", "Atletico Nacional", "Aucas", "Aurora", "Barcelona SC", "Bolívar", "Botafogo", "Caracas FC", "Cerro Porteno", "Club Nacional", "Cobresal", "Colo Colo", "Defensor Sporting", "Deportivo Tachira FC", "El Nacional", "Estudiantes L.P.", "FBC Melgar", "Flamengo", "Fluminense", "Godoy Cruz", "Gremio", "Huachipato", "Independiente del Valle", "Junior", "LDU de Quito", "Libertad Asuncion", "Liverpool Montevideo", "Millonarios", "Nacional Asuncion", "Palestino", "Penarol", "Portuguesa FC", "Puerto Cabello", "RB Bragantino", "River Plate", "Rosario Central", "San Lorenzo", "Sporting Cristal", "Sportivo Trinidense", "Talleres Cordoba", "The Strongest", "Universitario", "Águilas Doradas"]},
    "Copa Sudamericana":{"nv":1,"id":11,"cl":["ADT", "Alianza Valledupar", "Always Ready", "America de Cali", "Argentinos JRS", "Atletico Paranaense", "Barcelona SC", "Belgrano Cordoba", "Boca Juniors", "Carabobo FC", "Cerro Largo", "Cerro Porteno", "Cesar Vallejo", "Club Guarani", "Coquimbo Unido", "Corinthians", "Cruzeiro", "Danubio", "Defensa Y Justicia", "Delfin SC", "Deportes Tolima", "Deportivo Cuenca", "Deportivo Garcilaso", "Deportivo La Guaira", "Everton de Vina", "Fortaleza EC", "Huachipato", "Independiente Medellin", "Independiente del Valle", "Internacional", "Jorge Wilstermann", "LDU de Quito", "Lanus", "Libertad Asuncion", "Metropolitanos FC", "Nacional Asuncion", "Nacional Potosí", "Olimpia", "Palestino", "RB Bragantino", "Racing Club", "Racing Montevideo", "Rayo Zuliano", "Real Tomayapo", "Rosario Central", "Sport Huancayo", "Sportivo Ameliano", "Sportivo Luqueno", "Sportivo Trinidense", "Tecnico Universitario", "U. Catolica", "Union La Calera", "Universidad Catolica", "Universitario de Vinto", "Wanderers"]},
    "Copa América":{"nv":1,"id":9,"cl":["Argentina", "Bolivia", "Canada", "Chile", "Colombia", "Costa Rica", "Jamaica", "Mexico", "Panama", "Paraguay", "Peru", "USA", "Venezuela"]}
  },
  "EN Inglaterra":{
    "Premier League":{"nv":1,"id":39,"cl":["Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich", "Leicester", "Liverpool", "Manchester City", "Manchester United", "Newcastle", "Nottingham Forest", "Southampton", "Tottenham", "West Ham", "Wolves"]},
    "Championship":{"nv":2,"id":40,"cl":["Blackburn", "Blackburn Rovers U21", "Bristol City", "Burnley", "Cardiff", "Coventry", "Derby", "Hull City", "Leeds", "Luton", "Middlesbrough", "Millwall", "Norwich", "Oxford United", "Plymouth", "Portsmouth", "Preston", "QPR", "Sheffield Utd", "Sheffield Wednesday", "Stoke City", "Sunderland", "Swansea", "Watford", "West Brom"]},
    "League One":{"nv":3,"id":41,"cl":["Barnsley", "Birmingham", "Birmingham City U21", "Blackpool", "Bolton", "Bristol Rovers", "Burton Albion", "Cambridge United", "Charlton", "Crawley Town", "Exeter City", "Huddersfield", "Leyton Orient", "Lincoln", "Mansfield Town", "Northampton", "Peterborough", "Reading", "Rotherham", "Shrewsbury", "Stevenage", "Stockport County", "Wigan", "Wrexham", "Wycombe"]}
  },
  "ES España":{
    "La Liga":{"nv":1,"id":140,"cl":["Alaves", "Athletic Club", "Atletico Madrid", "Barcelona", "Celta Vigo", "Espanyol", "Getafe", "Girona", "Las Palmas", "Leganes", "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Sociedad", "Sevilla", "Valencia", "Valladolid", "Villarreal"]},
    "La Liga 2":{"nv":2,"id":141,"cl":["Albacete", "Almeria", "Burgos", "Cadiz", "Castellón", "Cordoba", "Deportivo La Coruna", "Eibar", "Elche", "Eldense", "FC Cartagena", "Granada CF", "Huesca", "Levante", "Malaga", "Mirandes", "Oviedo", "Racing Ferrol", "Racing Santander", "Sporting Gijon", "Tenerife", "Zaragoza"]}
  },
  "DE Alemania":{
    "Bundesliga":{"nv":1,"id":78,"cl":["1. FC Heidenheim", "1899 Hoffenheim", "Bayer Leverkusen", "Bayern München", "Borussia Dortmund", "Borussia Mönchengladbach", "Eintracht Frankfurt", "FC Augsburg", "FC St. Pauli", "FSV Mainz 05", "Holstein Kiel", "RB Leipzig", "SC Freiburg", "Union Berlin", "VfB Stuttgart", "VfL Bochum", "VfL Wolfsburg", "Werder Bremen"]},
    "2. Bundesliga":{"nv":2,"id":79,"cl":["1. FC Kaiserslautern", "1. FC Köln", "1. FC Magdeburg", "1. FC Nürnberg", "Eintracht Braunschweig", "FC Schalke 04", "Fortuna Düsseldorf", "Hamburger SV", "Hannover 96", "Hertha BSC", "Karlsruher SC", "Preußen Münster", "SC Paderborn 07", "SSV Jahn Regensburg", "SSV Ulm 1846", "SV Darmstadt 98", "SV Elversberg", "SpVgg Greuther Fürth"]}
  },
  "IT Italia":{
    "Serie A":{"nv":1,"id":135,"cl":["AC Milan", "AS Roma", "Atalanta", "Bologna", "Cagliari", "Como", "Empoli", "Fiorentina", "Genoa", "Hellas Verona", "Inter", "Juventus", "Lazio", "Lecce", "Monza", "Napoli", "Parma", "Torino", "Udinese", "Venezia"]},
    "Serie B":{"nv":2,"id":136,"cl":["Bari", "Brescia", "Carrarese", "Catanzaro", "Cesena", "Cittadella", "Cosenza", "Cremonese", "Frosinone", "Juve Stabia", "Mantova", "Modena", "Palermo", "Pisa", "Reggiana", "Salernitana", "Sampdoria", "Sassuolo", "Spezia", "Sudtirol"]}
  },
  "FR Francia":{
    "Ligue 1":{"nv":1,"id":61,"cl":["Angers", "Auxerre", "Le Havre", "Lens", "Lille", "Lyon", "Marseille", "Monaco", "Montpellier", "Nantes", "Nice", "Paris Saint Germain", "Reims", "Rennes", "Saint Etienne", "Stade Brestois 29", "Strasbourg", "Toulouse"]},
    "Ligue 2":{"nv":2,"id":62,"cl":["Ajaccio", "Amiens", "Annecy", "Bastia", "Caen", "Clermont Foot", "Dunkerque", "Estac Troyes", "Grenoble", "Guingamp", "Laval", "Lorient", "Martigues", "Metz", "PAU", "Paris FC", "RED Star FC 93", "Rodez"]}
  },
  "PT Portugal":{
    "Primeira Liga":{"nv":1,"id":94,"cl":["AVS", "Arouca", "Benfica", "Boavista", "Casa Pia", "Estoril", "Estrela", "FC Porto", "Famalicao", "Farense", "GIL Vicente", "Guimaraes", "Moreirense", "Nacional", "Rio Ave", "SC Braga", "Santa Clara", "Sporting CP"]}
  },
  "NL Países Bajos":{
    "Eredivisie":{"nv":1,"id":88,"cl":["AZ Alkmaar", "Ajax", "Almere City FC", "Feyenoord", "Fortuna Sittard", "GO Ahead Eagles", "Groningen", "Heerenveen", "Heracles", "NAC Breda", "NEC Nijmegen", "PEC Zwolle", "PSV Eindhoven", "Sparta Rotterdam", "Tacoma Defiance", "Twente", "Utrecht", "Waalwijk", "Willem II"]},
    "Eerste Divisie":{"nv":2,"id":89,"cl":["ADO Den Haag", "Cambuur", "De Graafschap", "Den Bosch", "Dordrecht", "Emmen", "Excelsior", "FC Eindhoven", "FC OSS", "FC Volendam", "Helmond Sport", "Jong AZ", "Jong Ajax", "Jong PSV U21", "Jong Utrecht", "MVV", "Roda", "Telstar", "VVV Venlo", "Vitesse"]}
  },
  "TR Turquía":{
    "Süper Lig":{"nv":1,"id":203,"cl":["Adana Demirspor", "Alanyaspor", "Antalyaspor", "Başakşehir", "Beşiktaş", "Bodrum FK", "Eyüpspor", "Fenerbahçe", "Galatasaray", "Gaziantep FK", "Göztepe", "Hatayspor", "Kasımpaşa", "Kayserispor", "Konyaspor", "Rizespor", "Samsunspor", "Sivasspor", "Trabzonspor"]},
    "1. Lig":{"nv":2,"id":204,"cl":["Adanaspor", "Amed", "Ankaragücü", "Bandırmaspor", "Boluspor", "Erzurumspor FK", "Esenler Erokspor", "Fatih Karagümrük", "Gençlerbirliği S.K.", "Iğdır FK", "Keçiörengücü", "Kocaelispor", "Manisa F.K.", "Pendikspor", "Sakaryaspor", "Yeni Malatyaspor", "Çorum FK", "Ümraniyespor", "İstanbulspor", "Şanlıurfaspor"]}
  },
  "SC Escocia":{
    "Premiership":{"nv":1,"id":179,"cl":["Aberdeen", "Celtic", "Dundee", "Dundee Utd", "Heart Of Midlothian", "Hibernian", "Kilmarnock", "Motherwell", "Rangers", "Ross County", "ST Johnstone", "ST Mirren"]}
  },
  "EU UEFA":{
    "UEFA Champions League":{"nv":1,"id":2,"cl":["AC Milan", "Apoel Nicosia", "Arsenal", "Aston Villa", "Atalanta", "Atletico Madrid", "BSC Young Boys", "Ballkani", "Barcelona", "Bayer Leverkusen", "Bayern München", "Benfica", "Bodo/Glimt", "Bologna", "Borac Banja Luka", "Borussia Dortmund", "Celje", "Celtic", "Club Brugge KV", "Dečić", "Dinamo Batumi", "Dinamo Minsk", "Dinamo Minsk II", "Dinamo Zagreb", "Dynamo Kyiv", "Egnatia Rrogozhinë", "FC Differdange 03", "FC Lugano", "FC Midtjylland", "FCSB", "FK Crvena Zvezda", "FK Partizan", "Fenerbahçe", "Ferencvarosi TC", "Feyenoord", "Flora Tallinn", "Galatasaray", "Girona", "Grotta", "HJK Helsinki", "Hamrun Spartans", "Inter", "Jagiellonia", "Juventus", "KI Klaksvik", "Larne", "Lille", "Lincoln Red Imps FC", "Liverpool", "Ludogorets", "Maccabi Tel Aviv", "Malmo FF", "Manchester City", "Monaco", "Ordabasy", "PAOK", "PSV Eindhoven", "Panevėžys", "Paris Saint Germain", "Petrocub", "Pyunik Yerevan", "Qarabag", "RB Leipzig", "Rangers", "Real Madrid", "Red Bull Salzburg", "Rīgas FS", "Shakhtar Donetsk", "Shamrock Rovers", "Slavia Praha", "Slovan Bratislava", "Sparta Praha", "Sporting CP", "Stade Brestois 29", "Struga", "Sturm Graz", "The New Saints", "Twente", "UE Santa Coloma", "Union St. Gilloise", "VfB Stuttgart", "Vikingur Reykjavik", "Virtus"]},
    "UEFA Europa League":{"nv":1,"id":3,"cl":["1899 Hoffenheim", "AS Roma", "AZ Alkmaar", "Ajax", "Anderlecht", "Apoel Nicosia", "Athletic Club", "Beşiktaş", "Bodo/Glimt", "Botev Plovdiv", "Celje", "Cercle Brugge", "Corvinul Hunedoara", "Dynamo Kyiv", "Eintracht Frankfurt", "FC Midtjylland", "FC Porto", "FCSB", "FK Partizan", "FK Tobol Kostanay", "Fenerbahçe", "Ferencvarosi TC", "Galatasaray", "HNK Rijeka", "Heart Of Midlothian", "IF Elfsborg", "Jagiellonia", "KI Klaksvik", "Kilmarnock", "Kryvbas KR", "Lask Linz", "Lazio", "Lincoln Red Imps FC", "Llapi", "Ludogorets", "Lyon", "Maccabi Petah Tikva", "Maccabi Tel Aviv", "Malmo FF", "Manchester United", "Maribor", "Molde", "Nice", "Olympiakos Piraeus", "PAOK", "Pafos", "Paks", "Panathinaikos", "Panevėžys", "Petrocub", "Plzen", "Qarabag", "Rangers", "Rapid Vienna", "Real Sociedad", "Ružomberok", "Rīgas FS", "SC Braga", "Servette FC", "Shamrock Rovers", "Sheriff Tiraspol", "Silkeborg", "Slavia Praha", "TSC Backa Topola", "The New Saints", "Tottenham", "Trabzonspor", "Twente", "Union St. Gilloise", "Vojvodina", "Wisla Krakow", "Zira"]},
    "UEFA Conference League":{"nv":1,"id":848,"cl":["1. FC Heidenheim", "AEK Athens FC", "AEK Larnaca", "Aktobe", "Apoel Nicosia", "Ararat-Armenia", "Atlètic Club d'Escaldes", "Auda", "Austria Vienna", "B36 Torshavn", "BK Hacken", "Bala Town", "Ballkani", "Baník Ostrava", "Başakşehir", "Borac Banja Luka", "Botev Plovdiv", "Brann", "Bravo", "Breidablik", "Brondby", "Buducnost Podgorica", "CFR 1907 Cluj", "CSKA 1948", "Caernarfon Town", "Celje", "Cercle Brugge", "Chelsea", "Cherno More Varna", "Cliftonville FC", "Crusaders FC", "Derry City", "Dečić", "Dinamo Batumi", "Dinamo Minsk", "Dinamo Tbilisi", "Djurgardens IF", "Drita", "Dunajska Streda", "Egnatia Rrogozhinë", "F91 Dudelange", "FC Astana", "FC Copenhagen", "FC Differdange 03", "FC Isloch Minsk R.", "FC Levadia Tallinn", "FC Noah", "FC ST. Gallen", "FC Urartu", "FC Vaduz", "FC Zurich", "FK Liepaja", "FK Partizan", "FK Sarajevo", "FK Tobol Kostanay", "FK Zalgiris Vilnius", "Fehérvár FC", "Fiorentina", "Flora Tallinn", "Floriana", "GAP Connah S Quay FC", "GO Ahead Eagles", "Gent", "Guimaraes", "HB Torshavn", "HJK Helsinki", "HNK Hajduk Split", "Hamrun Spartans", "Hapoel Beer Sheva", "Heart Of Midlothian", "Ilves", "Inter Club d'Escaldes", "Jagiellonia", "KI Klaksvik", "Kilmarnock", "Kryvbas KR", "KuPS", "La Fiorita", "Larne", "Lask Linz", "Legia Warszawa", "Lens", "Lincoln Red Imps FC", "Linfield", "Llapi", "Maccabi Haifa", "Maccabi Petah Tikva", "Magpies", "Malisheva", "Maribor", "Marsaxlokk", "Milsami Orhei", "Mlada Boleslav", "Molde", "Mornar", "NK Osijek", "Neman", "Olimpija Ljubljana", "Omonia Nicosia", "Ordabasy", "Pafos", "Paide", "Paks", "Panathinaikos", "Panevėžys", "Partizani", "Patro Eisden", "Petrocub", "Polessya", "Progres Niederkorn", "Puskas Academy", "Pyunik Yerevan", "Radnicki 1923", "Rapid Vienna", "Real Betis", "Riga", "Ružomberok", "ST Mirren", "Sabah FA", "Saburtalo", "Shamrock Rovers", "Shelbourne", "Sheriff Tiraspol", "Shkendija", "Silkeborg", "Slask Wroclaw", "Sliema Wanderers", "Spartak Trnava", "St Joseph S Fc", "St Patrick's Athl.", "Stjarnan", "Struga", "Sumqayıt", "TSC Backa Topola", "Tallinna Kalev", "The New Saints", "Tikveš", "Tirana", "Torpedo Kutaisi", "Torpedo Zhodino", "Trabzonspor", "TransINVEST Vilnius", "Tre Penne", "Tromso", "UE Santa Coloma", "UNA Strassen", "VPS", "Valur Reykjavik", "Velež", "Vikingur Gota", "Vikingur Reykjavik", "Virtus", "Vllaznia Shkodër", "Vojvodina", "Wisla Krakow", "Zimbru", "Zira", "Zrinjski", "Šiauliai"]}
  },
  "PL Polonia":{
    "Ekstraklasa":{"nv":1,"id":106,"cl":["Cracovia Krakow", "GKS Katowice", "Gornik Zabrze", "Jagiellonia", "Korona Kielce", "Lech Poznan", "Lechia Gdansk", "Legia Warszawa", "Motor Lublin", "Piast Gliwice", "Pogon Szczecin", "Puszcza Niepołomice", "Radomiak Radom", "Raków Częstochowa", "Slask Wroclaw", "Stal Mielec", "Widzew Łódź", "Zaglebie Lubin"]}
  },
  "SE Suecia":{
    "Allsvenskan":{"nv":1,"id":113,"cl":["AIK Stockholm", "BK Hacken", "Djurgardens IF", "Gais", "Halmstad", "Hammarby FF", "IF Brommapojkarna", "IF Elfsborg", "IFK Goteborg", "IFK Norrkoping", "IFK Varnamo", "Kalmar FF", "Malmo FF", "Mjallby AIF", "Sirius", "Vasteras SK FK"]}
  },
  "NO Noruega":{
    "Eliteserien":{"nv":1,"id":103,"cl":["Bodo/Glimt", "Brann", "Fredrikstad", "Ham-Kam", "Haugesund", "KFUM Oslo", "Kristiansund BK", "Lillestrom", "Molde", "ODD Ballklubb", "Rosenborg", "Sandefjord", "Sarpsborg 08 FF", "Stromsgodset", "Tromso", "Viking"]}
  },
  "DK Dinamarca":{
    "Superliga":{"nv":1,"id":119,"cl":["Aalborg", "Aarhus", "Brondby", "FC Copenhagen", "FC Midtjylland", "FC Nordsjaelland", "Lyngby", "Randers FC", "Silkeborg", "Sonderjyske", "Vejle", "Viborg"]}
  },
  "CZ Rep. Checa":{
    "First League":{"nv":1,"id":345,"cl":["Baník Ostrava", "Bohemians 1905", "Dukla Praha", "FK Jablonec", "Hradec Králové", "Karviná", "Mlada Boleslav", "Pardubice", "Plzen", "Sigma Olomouc", "Slavia Praha", "Slovan Liberec", "Slovácko", "Sparta Praha", "Teplice", "České Budějovice"]}
  },
  "HR Croacia":{
    "HNL":{"nv":1,"id":210,"cl":["Dinamo Zagreb", "HNK Gorica", "HNK Hajduk Split", "HNK Rijeka", "Istra 1961", "NK Lokomotiva Zagreb", "NK Osijek", "NK Slaven Belupo", "NK Varazdin", "Sibenik"]}
  },
  "MX México":{
    "Liga MX":{"nv":1,"id":262,"cl":["Atlas", "Atletico San Luis", "CF Pachuca", "Club America", "Club Queretaro", "Club Tijuana", "Cruz Azul", "FC Juarez", "Guadalajara Chivas", "Leon", "Mazatlán", "Monterrey", "Necaxa", "Puebla", "Santos Laguna", "Tapatío", "Tigres UANL", "Toluca", "U.N.A.M. - Pumas"]},
    "Liga de Expansión":{"nv":2,"id":263,"cl":["Alebrijes de Oaxaca", "Atlante FC", "CA La Paz", "CDS Tampico Madero", "Cancún", "Celaya", "Correcaminos Uat", "Dorados", "Leones Negros UDG", "Mineros de Zacatecas", "Monarcas", "Tapatío", "Tepatitlán", "Tlaxcala", "Venados FC"]}
  },
  "US MLS":{
    "MLS":{"nv":1,"id":253,"cl":["Atlanta United FC", "Austin", "CF Montreal", "Charlotte", "Chicago Fire", "Colorado Rapids", "Columbus Crew", "DC United", "FC Cincinnati", "FC Dallas", "Houston Dynamo", "Inter Miami", "Los Angeles FC", "Los Angeles Galaxy", "Minnesota United FC", "Nashville SC", "New England Revolution", "New York City FC", "New York Red Bulls", "Orlando City SC", "Philadelphia Union", "Portland Timbers", "Real Salt Lake", "San Jose Earthquakes", "Seattle Sounders", "Sporting Kansas City", "St. Louis City", "Toronto FC", "Vancouver Whitecaps"]},
    "USL Championship":{"nv":2,"id":254,"cl":["Al Taawon", "Angel City W", "Bay FC W", "Chicago Red Stars W", "Houston Dash W", "Kansas City W", "NJ/NY Gotham FC W", "North Carolina Courage W", "Orlando Pride W", "Portland Thorns W", "Racing Louisville W", "San Diego Wave W", "Seattle Reign FC W", "Utah Royals W", "Washington Spirit W"]},
    "USL League One":{"nv":3,"id":255,"cl":["Birmingham Legion", "Charleston Battery", "Colorado Springs", "Detroit City", "El Paso Locomotive", "FC Tulsa", "Hartford Athletic", "Indy Eleven", "Las Vegas Lights", "Loudoun United", "Louisville City", "Memphis 901", "Miami FC", "Monterey Bay", "New Mexico United", "North Carolina", "Oakland Roots", "Orange County SC", "Phoenix Rising", "Pittsburgh Riverhounds", "Rhode Island", "Sacramento Republic", "San Antonio", "Tampa Bay Rowdies"]}
  },
  "SA Saudi":{
    "Pro League":{"nv":1,"id":307,"cl":["Al Khaleej Saihat", "Al Kholood", "Al Okhdood", "Al Orubah", "Al Riyadh", "Al Shabab", "Al Taawon", "Al Wehda Club", "Al-Ahli Jeddah", "Al-Ettifaq", "Al-Fateh", "Al-Fayha", "Al-Hilal Saudi FC", "Al-Ittihad FC", "Al-Nassr", "Al-Qadisiyah FC", "Al-Raed", "Damac"]}
  },
  "JP Japón":{
    "J1 League":{"nv":1,"id":98,"cl":["Albirex Niigata", "Avispa Fukuoka", "Cerezo Osaka", "Consadole Sapporo", "FC Tokyo", "Gamba Osaka", "Jubilo Iwata", "Kashima", "Kashiwa Reysol", "Kawasaki Frontale", "Kyoto Sanga", "Machida Zelvia", "Nagoya Grampus", "Sagan Tosu", "Sanfrecce Hiroshima", "Shonan Bellmare", "Tokyo Verdy", "Urawa", "Vissel Kobe", "Yokohama F. Marinos"]},
    "J2 League":{"nv":2,"id":99,"cl":["Blaublitz Akita", "Ehime FC", "Fagiano Okayama", "Fujieda MYFC", "Iwaki", "JEF United Chiba", "Kagoshima United", "Mito Hollyhock", "Montedio Yamagata", "Oita Trinita", "Renofa Yamaguchi", "Roasso Kumamoto", "Shimizu S-pulse", "Thespakusatsu Gunma", "Tochigi SC", "Tokushima Vortis", "V-varen Nagasaki", "Vegalta Sendai", "Ventforet Kofu", "Yokohama FC"]}
  }
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
    const r = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:API_HEADERS, body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:maxT,messages:[{role:"user",content:prompt}]}) });
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
                <span style={{color:"#eef2f6",fontWeight:600,fontSize:14}}>🤖 Análisis FichaScout</span>
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

// ─── TALENTOS v2 ──────────────────────────────────────────────────
const ETIQUETAS=[{id:"proyeccion",label:"Proyección Alta",icon:"🌟",color:"#f59e0b"},{id:"seguimiento",label:"Seguimiento",icon:"👁",color:"#3b82f6"},{id:"prioridad",label:"Prioridad",icon:"🔴",color:"#ef4444"},{id:"recomendado",label:"Recomendado",icon:"✅",color:"#00a855"}];

function ModTalentos({data,setData}){
  const [busq,setBusq]=useState("");
  const [fPos,setFPos]=useState("");
  const [fSt,setFSt]=useState("");
  const [fEtq,setFEtq]=useState("");
  const [modal,setModal]=useState(false);
  const [perfil,setPerfil]=useState(null);
  const [form,setForm]=useState({});
  const [obsText,setObsText]=useState("");
  const [videoUrl,setVideoUrl]=useState("");
  const talentos=data.talentos||[];
  const filtrados=talentos.filter(t=>{
    if(busq&&!t.nombre.toLowerCase().includes(busq.toLowerCase())&&!(t.equipo||"").toLowerCase().includes(busq.toLowerCase()))return false;
    if(fPos&&t.posicion!==fPos)return false;
    if(fSt&&(t.pipeline||"radar")!==fSt)return false;
    if(fEtq&&!(t.etiquetas||[]).includes(fEtq))return false;
    return true;
  });
  const add=()=>{
    if(!form.nombre||!form.posicion)return;
    const nuevo={id:uid(),nombre:form.nombre,posicion:form.posicion,equipo:form.equipo||"",edad:form.edad||"",liga:form.liga||"",nacionalidad:form.nacionalidad||"",altura:form.altura||"",peso:form.peso||"",pieHabil:form.pieHabil||"",valorMercado:form.valorMercado||"",notas:form.notas||"",pipeline:"radar",fecha:hoy(),ultimaObservacion:hoy(),historial:[{id:uid(),fecha:hoy(),texto:"Jugador agregado al sistema.",tipo:"sistema"}],etiquetas:[],videos:[]};
    setData(d=>({...d,talentos:[...(d.talentos||[]),nuevo]}));
    setModal(false);setForm({});
  };
  const updPipe=(id,st)=>{setData(d=>({...d,talentos:(d.talentos||[]).map(t=>t.id===id?{...t,pipeline:st,historial:[...(t.historial||[]),{id:uid(),fecha:hoy(),texto:"Estado: "+PIPE_ST.find(s=>s.id===st)?.label,tipo:"estado"}]}:t)}));};
  const toggleEtq=(tid,eid)=>{setData(d=>({...d,talentos:(d.talentos||[]).map(t=>{if(t.id!==tid)return t;const etqs=t.etiquetas||[];return{...t,etiquetas:etqs.includes(eid)?etqs.filter(e=>e!==eid):[...etqs,eid]};})})  );};
  const addObs=(tid)=>{if(!obsText.trim())return;setData(d=>({...d,talentos:(d.talentos||[]).map(t=>t.id===tid?{...t,ultimaObservacion:hoy(),historial:[...(t.historial||[]),{id:uid(),fecha:hoy(),texto:obsText.trim(),tipo:"observacion"}]}:t)}));setObsText("");};
  const addVideo=(tid)=>{const ytId=getYTId(videoUrl);if(!ytId&&!videoUrl.trim())return;setData(d=>({...d,talentos:(d.talentos||[]).map(t=>t.id===tid?{...t,videos:[...(t.videos||[]),{id:uid(),url:videoUrl.trim(),ytId,fecha:hoy()}]}:t)}));setVideoUrl("");};
  const delVideo=(tid,vid)=>{setData(d=>({...d,talentos:(d.talentos||[]).map(t=>t.id===tid?{...t,videos:(t.videos||[]).filter(v=>v.id!==vid)}:t)}));};
  const del=(id)=>{if(perfil?.id===id)setPerfil(null);setData(d=>({...d,talentos:(d.talentos||[]).filter(t=>t.id!==id)}));};
  const talentoPerfil=perfil?talentos.find(t=>t.id===perfil.id):null;
  const totalPrioridad=talentos.filter(t=>(t.etiquetas||[]).includes("prioridad")).length;
  const totalSeguimiento=talentos.filter(t=>(t.etiquetas||[]).includes("seguimiento")).length;
  const totalRecomendado=talentos.filter(t=>(t.etiquetas||[]).includes("recomendado")).length;
  return(<div style={{display:"grid",gridTemplateColumns:talentoPerfil?"1fr 420px":"1fr",gap:16,alignItems:"start"}}>
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontWeight:800,color:"#eef2f6",fontSize:19}}>🔭 Base de Talentos</div><div style={{color:"#4a6070",fontSize:12,marginTop:2}}>{talentos.length} jugadores observados</div></div>
        <button style={BG} onClick={()=>setModal(true)}>+ Agregar Talento</button>
      </div>
      {talentos.length>0&&(<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {[{l:"Total",v:talentos.length,c:"#00e87a"},{l:"Prioridad",v:totalPrioridad,c:"#ef4444"},{l:"Seguimiento",v:totalSeguimiento,c:"#3b82f6"},{l:"Recomendados",v:totalRecomendado,c:"#00a855"}].map(({l,v,c})=>(<div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:10,color:"#4a6070",fontWeight:600}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div></div>))}
      </div>)}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <input style={{...I,flex:1,minWidth:180}} placeholder="🔍 Buscar..." value={busq} onChange={e=>setBusq(e.target.value)}/>
        <select style={{...I,width:"auto"}} value={fPos} onChange={e=>setFPos(e.target.value)}><option value="">Todas posiciones</option>{Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}</select>
        <select style={{...I,width:"auto"}} value={fSt} onChange={e=>setFSt(e.target.value)}><option value="">Todos estados</option>{PIPE_ST.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}</select>
        <select style={{...I,width:"auto"}} value={fEtq} onChange={e=>setFEtq(e.target.value)}><option value="">Todas etiquetas</option>{ETIQUETAS.map(e=><option key={e.id} value={e.id}>{e.icon} {e.label}</option>)}</select>
      </div>
      {filtrados.length===0&&(<div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>🔭</div>{talentos.length===0?"Agrega tu primer talento observado":"Sin resultados con estos filtros"}</div>)}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {filtrados.map(t=>{const pd=POS[t.posicion];const st=PIPE_ST.find(s=>s.id===(t.pipeline||"radar"));const etqs=(t.etiquetas||[]).map(e=>ETIQUETAS.find(x=>x.id===e)).filter(Boolean);const isSel=talentoPerfil?.id===t.id;
          return(<div key={t.id} style={{background:isSel?"rgba(0,232,122,0.06)":"rgba(255,255,255,0.03)",borderRadius:14,border:"1px solid "+(isSel?"rgba(0,232,122,0.3)":(st?.color+"22")||"#334155"),padding:16,cursor:"pointer",transition:"all .15s"}} onClick={()=>setPerfil(isSel?null:t)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:42,height:42,borderRadius:12,background:(pd?.color||"#334155")+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{pd?.icon||"⚽"}</div>
                <div><div style={{fontWeight:700,color:"#eef2f6",fontSize:14}}>{t.nombre}</div><div style={{color:"#4a6070",fontSize:11}}>{t.posicion}{t.edad?" · "+t.edad+"a":""}</div></div>
              </div>
              <button onClick={e=>{e.stopPropagation();del(t.id);}} style={{background:"none",border:"none",color:"#ef444455",cursor:"pointer",fontSize:13}}>🗑</button>
            </div>
            {t.equipo&&<div style={{color:"#4a6070",fontSize:11,marginBottom:8}}>🏟 {t.equipo}{t.liga?" · "+t.liga:""}</div>}
            {etqs.length>0&&(<div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>{etqs.map(e=>(<span key={e.id} style={{background:e.color+"18",color:e.color,border:"1px solid "+e.color+"33",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700}}>{e.icon} {e.label}</span>))}</div>)}
            {(t.videos||[]).length>0&&<div style={{color:"#4a6070",fontSize:11,marginBottom:6}}>🎬 {t.videos.length} video{t.videos.length!==1?"s":""}</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <Bdg color={st?.color||"#64748b"}>{st?.icon} {st?.label}</Bdg>
              <div style={{fontSize:10,color:"#334155"}}>{t.ultimaObservacion||t.fecha}</div>
            </div>
          </div>);
        })}
      </div>
    </div>
    {talentoPerfil&&(()=>{const t=talentoPerfil;const pd=POS[t.posicion];const st=PIPE_ST.find(s=>s.id===(t.pipeline||"radar"));
      return(<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(0,232,122,0.15)",borderRadius:16,padding:18,position:"sticky",top:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:54,height:54,borderRadius:14,background:(pd?.color||"#334155")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{pd?.icon||"⚽"}</div>
            <div><div style={{fontWeight:800,color:"#eef2f6",fontSize:16}}>{t.nombre}</div><div style={{color:"#4a6070",fontSize:12,marginTop:2}}>{t.posicion}</div><Bdg color={st?.color||"#64748b"} style={{marginTop:4}}>{st?.icon} {st?.label}</Bdg></div>
          </div>
          <button onClick={()=>setPerfil(null)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"4px 10px",color:"#64748b",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
          {[["🎂","Edad",t.edad?t.edad+" años":"—"],["🌍","Nac.",t.nacionalidad||"—"],["🏟","Equipo",t.equipo||"—"],["🏆","Liga",t.liga||"—"],["📏","Altura",t.altura?t.altura+"cm":"—"],["⚖️","Peso",t.peso?t.peso+"kg":"—"],["🦶","Pie",t.pieHabil||"—"],["💰","Valor",t.valorMercado||"—"]].map(([ic,lb,v])=>(<div key={lb} style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"6px 10px",display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:13}}>{ic}</span><div><div style={{fontSize:9,color:"#4a6070",fontWeight:600}}>{lb}</div><div style={{fontSize:11,color:"#eef2f6",fontWeight:600}}>{v}</div></div></div>))}
        </div>
        <div style={{marginBottom:14}}><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:7,letterSpacing:.5}}>ETIQUETAS</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ETIQUETAS.map(e=>{const active=(t.etiquetas||[]).includes(e.id);return(<button key={e.id} onClick={()=>toggleEtq(t.id,e.id)} style={{background:active?e.color+"22":"rgba(255,255,255,0.04)",color:active?e.color:"#475569",border:"1px solid "+(active?e.color+"55":"rgba(255,255,255,0.08)"),borderRadius:7,padding:"4px 9px",fontSize:11,fontWeight:active?700:400,cursor:"pointer",fontFamily:"inherit"}}>{e.icon} {e.label}</button>);})}</div></div>
        <div style={{marginBottom:14}}><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:7,letterSpacing:.5}}>ESTADO PIPELINE</div><select style={{...I,width:"100%"}} value={t.pipeline||"radar"} onChange={e=>updPipe(t.id,e.target.value)}>{PIPE_ST.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}</select></div>
        <div style={{marginBottom:14}}><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:7,letterSpacing:.5}}>VIDEOS ({(t.videos||[]).length})</div>
          {(t.videos||[]).map(v=>(<div key={v.id} style={{marginBottom:8}}>{v.ytId?(<div style={{position:"relative",paddingBottom:"56.25%",borderRadius:8,overflow:"hidden",background:"#000"}}><iframe src={"https://www.youtube.com/embed/"+v.ytId} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}} allowFullScreen title="Video"/></div>):(<div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 10px",fontSize:11,color:"#64748b",display:"flex",justifyContent:"space-between"}}><span>🎬 {v.url.substring(0,35)}...</span><a href={v.url} target="_blank" rel="noreferrer" style={{color:"#3b82f6",fontSize:10}}>Ver</a></div>)}<div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{fontSize:10,color:"#334155"}}>{v.fecha}</span><button onClick={()=>delVideo(t.id,v.id)} style={{background:"none",border:"none",color:"#ef444455",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🗑 Eliminar</button></div></div>))}
          <div style={{display:"flex",gap:6,marginTop:6}}><input style={{...I,flex:1,fontSize:11}} placeholder="URL YouTube..." value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addVideo(t.id)}/><button onClick={()=>addVideo(t.id)} style={{...BG,padding:"6px 12px",fontSize:11}}>+ Video</button></div>
        </div>
        <div><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:7,letterSpacing:.5}}>HISTORIAL DE OBSERVACIONES</div>
          <div style={{maxHeight:200,overflowY:"auto",marginBottom:8}}>{[...(t.historial||[])].reverse().map(h=>(<div key={h.id} style={{padding:"7px 10px",borderLeft:"2px solid "+(h.tipo==="observacion"?"#00e87a":h.tipo==="estado"?"#3b82f6":"#334155"),marginBottom:6,background:"rgba(255,255,255,0.02)",borderRadius:"0 6px 6px 0"}}><div style={{fontSize:11,color:"#eef2f6",lineHeight:1.5}}>{h.texto}</div><div style={{fontSize:9,color:"#334155",marginTop:2}}>{h.fecha}</div></div>))}</div>
          <div style={{display:"flex",gap:6}}><input style={{...I,flex:1,fontSize:11}} placeholder="Nueva observación..." value={obsText} onChange={e=>setObsText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addObs(t.id)}/><button onClick={()=>addObs(t.id)} style={{...BG,padding:"6px 12px",fontSize:11}}>✓</button></div>
        </div>
      </div>);
    })()}
    {modal&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#07111a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:28,width:440,maxWidth:"94vw",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontWeight:800,color:"#eef2f6",fontSize:17,marginBottom:18}}>🔭 Agregar Talento Observado</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{gridColumn:"1/-1"}}><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4}}>NOMBRE *</div><input style={I} placeholder="Nombre completo" value={form.nombre||""} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/></div>
          <div style={{gridColumn:"1/-1"}}><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4}}>POSICIÓN *</div><select style={I} value={form.posicion||""} onChange={e=>setForm(f=>({...f,posicion:e.target.value}))}><option value="">Seleccionar posición</option>{Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}</select></div>
          {[["equipo","Equipo actual"],["liga","Liga / Categoría"],["edad","Edad"],["nacionalidad","Nacionalidad"],["altura","Altura (cm)"],["peso","Peso (kg)"]].map(([k,label])=>(<div key={k}><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4}}>{label.toUpperCase()}</div><input style={I} value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/></div>))}
          <div><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4}}>PIE HÁBIL</div><select style={I} value={form.pieHabil||""} onChange={e=>setForm(f=>({...f,pieHabil:e.target.value}))}><option value="">—</option><option>Derecho</option><option>Zurdo</option><option>Ambidiestro</option></select></div>
          <div><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4}}>VALOR MERCADO</div><input style={I} placeholder="€ estimado" value={form.valorMercado||""} onChange={e=>setForm(f=>({...f,valorMercado:e.target.value}))}/></div>
          <div style={{gridColumn:"1/-1"}}><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4}}>NOTAS DEL OJEADOR</div><textarea style={{...I,resize:"vertical",minHeight:80}} placeholder="Observaciones iniciales..." value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/></div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}><button style={BG} onClick={add}>Agregar Talento</button><button style={BN} onClick={()=>{setModal(false);setForm({});}}>Cancelar</button></div>
      </div>
    </div>)}
  </div>);
}

// ─── PIPELINE v2 ──────────────────────────────────────────────────
function ModPipeline({data,setData}){
  const talentos=data.talentos||[];
  const [dragId,setDragId]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [notif,setNotif]=useState(null);
  const moverA=(id,stageId)=>{const t=talentos.find(x=>x.id===id);if(!t||t.pipeline===stageId)return;const stLabel=PIPE_ST.find(s=>s.id===stageId)?.label||stageId;setData(d=>({...d,talentos:(d.talentos||[]).map(x=>x.id===id?{...x,pipeline:stageId,ultimaObservacion:hoy(),historial:[...(x.historial||[]),{id:uid(),fecha:hoy(),texto:"Movido a: "+stLabel,tipo:"estado"}]}:x)}));const stColor=PIPE_ST.find(s=>s.id===stageId)?.color||"#00e87a";setNotif({msg:t.nombre+" → "+stLabel,color:stColor});setTimeout(()=>setNotif(null),2500);};
  const grouped=PIPE_ST.reduce((acc,s)=>{acc[s.id]=talentos.filter(t=>(t.pipeline||"radar")===s.id);return acc;},{});
  const diasDesde=(fecha)=>{if(!fecha)return null;const p=fecha.split("/");if(p.length<3)return null;const d=new Date(p[2],p[1]-1,p[0]);const diff=Math.floor((Date.now()-d.getTime())/(1000*60*60*24));return diff;};
  const alertColor=(dias)=>{if(dias===null)return null;if(dias>30)return"#ef4444";if(dias>14)return"#f59e0b";return null;};
  return(<div>
    {notif&&(<div style={{position:"fixed",top:20,right:20,background:notif.color,color:"#fff",padding:"10px 18px",borderRadius:10,fontWeight:700,fontSize:13,zIndex:400,boxShadow:"0 4px 20px rgba(0,0,0,0.4)",animation:"fadeIn .2s ease"}}>✓ {notif.msg}<style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}"}</style></div>)}
    <div style={{marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
      <div><div style={{fontWeight:800,color:"#eef2f6",fontSize:19}}>📋 Pipeline de Fichajes</div><div style={{color:"#4a6070",fontSize:12,marginTop:2}}>{talentos.length} jugadores · Arrastra entre columnas para mover</div></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{PIPE_ST.map(s=>{const n=(grouped[s.id]||[]).length;return n>0?(<span key={s.id} style={{background:s.color+"18",color:s.color,border:"1px solid "+s.color+"33",borderRadius:7,padding:"3px 9px",fontSize:11,fontWeight:700}}>{s.icon} {n}</span>):null;})}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,alignItems:"start"}}>
      {PIPE_ST.map(stage=>{const items=grouped[stage.id]||[];const isOver=dragOver===stage.id;
        return(<div key={stage.id} style={{background:isOver?stage.color+"08":"rgba(255,255,255,0.02)",borderRadius:14,border:"1px solid "+(isOver?stage.color+"55":stage.color+"22"),overflow:"hidden",transition:"all .15s",minHeight:200}} onDragOver={e=>{e.preventDefault();setDragOver(stage.id);}} onDragLeave={()=>setDragOver(null)} onDrop={e=>{e.preventDefault();setDragOver(null);if(dragId)moverA(dragId,stage.id);}}>
          <div style={{padding:"11px 13px",borderBottom:"1px solid "+stage.color+"22",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{color:stage.color,fontWeight:700,fontSize:12}}>{stage.icon} {stage.label}</div>
            <div style={{background:stage.color+"22",color:stage.color,borderRadius:100,minWidth:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,padding:"0 6px"}}>{items.length}</div>
          </div>
          <div style={{padding:8,display:"flex",flexDirection:"column",gap:7,minHeight:140}}>
            {items.length===0&&(<div style={{color:"#2a3a4a",fontSize:11,textAlign:"center",padding:"20px 8px",border:"2px dashed "+stage.color+"22",borderRadius:8,marginTop:4}}>{isOver?"Soltar aquí":"Vacío"}</div>)}
            {items.map(t=>{const pd=POS[t.posicion];const dias=diasDesde(t.ultimaObservacion||t.fecha);const aColor=alertColor(dias);const etqs=(t.etiquetas||[]).map(e=>ETIQUETAS.find(x=>x.id===e)).filter(Boolean);
              return(<div key={t.id} draggable onDragStart={()=>setDragId(t.id)} onDragEnd={()=>setDragId(null)} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"11px 12px",border:"1px solid "+(dragId===t.id?"rgba(0,232,122,0.4)":stage.color+"18"),cursor:"grab",opacity:dragId===t.id?0.5:1,transition:"all .1s",outline:aColor?"1px solid "+aColor+"33":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
                  <span style={{fontSize:17}}>{pd?.icon||"⚽"}</span>
                  <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,color:"#eef2f6",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.nombre}</div><div style={{color:"#4a6070",fontSize:10}}>{t.posicion}{t.edad?" · "+t.edad+"a":""}</div></div>
                </div>
                {t.equipo&&<div style={{color:"#4a6070",fontSize:10,marginBottom:5}}>🏟 {t.equipo}</div>}
                {etqs.length>0&&(<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:5}}>{etqs.map(e=><span key={e.id} style={{fontSize:9,color:e.color}}>{e.icon}</span>)}</div>)}
                {(t.videos||[]).length>0&&<div style={{color:"#4a6070",fontSize:9,marginBottom:5}}>🎬 {t.videos.length} video{t.videos.length!==1?"s":""}</div>}
                {dias!==null&&(<div style={{fontSize:9,color:aColor||"#334155",marginBottom:6}}>{aColor&&"⚠️ "}{dias===0?"Hoy":dias===1?"Ayer":dias+"d sin observar"}</div>)}
                <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
                  {stage.id!=="radar"&&(<button onClick={()=>moverA(t.id,PIPE_ST[Math.max(0,PIPE_ST.findIndex(s=>s.id===stage.id)-1)].id)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:5,padding:"2px 7px",color:"#4a6070",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>←</button>)}
                  {stage.id!=="fichado"&&(<button onClick={()=>moverA(t.id,PIPE_ST[Math.min(PIPE_ST.length-1,PIPE_ST.findIndex(s=>s.id===stage.id)+1)].id)} style={{background:stage.color+"18",border:"1px solid "+stage.color+"33",borderRadius:5,padding:"2px 7px",color:stage.color,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>→</button>)}
                </div>
              </div>);
            })}
          </div>
        </div>);
      })}
    </div>
    {talentos.length===0&&(<div style={{textAlign:"center",padding:48,color:"#4a6070"}}><div style={{fontSize:48,marginBottom:12}}>📋</div>Agrega talentos desde el módulo Talentos para gestionar el pipeline</div>)}
  </div>);
}

// ─── VIDEO ANALYSIS ────────────────────────────────────────────────
function ModVideoAnalysis(){
  const [url,setUrl]=useState("");const [ytId,setYtId]=useState(null);const [titulo,setTitulo]=useState("");const [jugador,setJugador]=useState("");const [posicion,setPosicion]=useState("");const [contexto,setContexto]=useState("");const [analisis,setAnalisis]=useState("");const [loading,setLoading]=useState(false);const [minuto,setMinuto]=useState("");const [historial,setHistorial]=useState([]);
  const cargarVideo=()=>{const id=getYTId(url);if(!id){alert("URL de YouTube no válida.");return;}setYtId(id);setAnalisis("");};
  const analizarConIA=async()=>{
    if(!ytId&&!url){alert("Carga un video primero.");return;}
    if(!ANTHROPIC_KEY){setAnalisis("⚠️ Recarga créditos en console.anthropic.com para usar el análisis IA.");return;}
    setLoading(true);setAnalisis("");
    const prompt="Eres un analista de scouting profesional de fútbol.\n\n"
      +"VIDEO: "+ytId+"\n"+(titulo?"TÍTULO: "+titulo+"\n":"")+(jugador?"JUGADOR: "+jugador+"\n":"")+(posicion?"POSICIÓN: "+posicion+"\n":"")+(minuto?"MINUTO: "+minuto+"\n":"")+(contexto?"CONTEXTO: "+contexto+"\n":"")
      +"\nInforme profesional:\n\n1. PERFIL TÉCNICO\n   Habilidades, control, pase, regate\n\n2. PERFIL TÁCTICO\n   Lectura, posicionamiento, movimientos sin balón\n\n3. PERFIL FÍSICO\n   Intensidad, velocidad, toma de decisiones\n\n4. FORTALEZAS CLAVE (top 3)\n\n5. ÁREAS DE MEJORA (top 3)\n\n6. PROYECCIÓN\n   Nivel liga recomendado, rol ideal, puntuación /10\n\n7. VEREDICTO DEL OJEADOR";
    setLoading(false);
  };
  const exportarPDF=()=>{if(!analisis)return;const fecha=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});const html="<!DOCTYPE html><html><head><meta charset='UTF-8'/><title>Análisis Video "+jugador+"</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:28px;color:#0f172a}h1{font-size:22px;font-weight:900;border-bottom:3px solid #00e87a;padding-bottom:10px}pre{white-space:pre-wrap;font-size:12px;line-height:1.8;text-align:justify}.footer{margin-top:24px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;display:flex;justify-content:space-between}</style></head><body><div style='font-size:10px;color:#94a3b8;font-weight:700;letter-spacing:.5px;margin-bottom:4px'>🎬 ANÁLISIS DE VIDEO · FICHASCOUT PRO</div><h1>"+(jugador||"Análisis de Jugador")+"</h1><div style='color:#64748b;font-size:12px;margin-bottom:16px'>"+(posicion?posicion+" · ":"")+"Fecha: "+fecha+(ytId?"<br><a href='https://www.youtube.com/watch?v="+ytId+"' style='color:#3b82f6'>Ver video</a>":"")+"</div><pre>"+analisis+"</pre><div class='footer'><span>FichaScout PRO</span><span>fichascout.com · "+fecha+"</span></div></body></html>";const w=window.open("","_blank");w.document.write(html);w.document.close();setTimeout(()=>w.print(),700);};
  return(<div>
    <div style={{marginBottom:18}}><div style={{fontWeight:800,color:"#eef2f6",fontSize:19,marginBottom:3}}>🎬 Analizador de Video</div><div style={{color:"#4a6070",fontSize:12}}>Pega una URL de YouTube · Configura el análisis · Obtén informe de scouting con IA</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"14px 16px",marginBottom:12}}>
          <div style={{fontSize:11,color:"#4a6070",fontWeight:700,marginBottom:10,letterSpacing:.5}}>CARGAR VIDEO</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}><input style={{...I,flex:1}} placeholder="https://youtube.com/watch?v=..." value={url} onChange={e=>{setUrl(e.target.value);setYtId(null);}}/><button style={BG} onClick={cargarVideo}>Cargar</button></div>
          {ytId?(<div style={{position:"relative",paddingBottom:"56.25%",borderRadius:8,overflow:"hidden",background:"#000"}}><iframe src={"https://www.youtube.com/embed/"+ytId} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}} allowFullScreen title="Video"/></div>):(<div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,height:160,display:"flex",alignItems:"center",justifyContent:"center",color:"#334155",fontSize:13,border:"2px dashed rgba(255,255,255,0.06)"}}>🎬 El video aparecerá aquí</div>)}
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"14px 16px"}}>
          <div style={{fontSize:11,color:"#4a6070",fontWeight:700,marginBottom:10,letterSpacing:.5}}>CONFIGURAR ANÁLISIS</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div><div style={{fontSize:10,color:"#4a6070",marginBottom:3}}>TÍTULO DEL VIDEO</div><input style={I} placeholder="Ej: Highlights J. Rodríguez vs Colo Colo" value={titulo} onChange={e=>setTitulo(e.target.value)}/></div>
            <div><div style={{fontSize:10,color:"#4a6070",marginBottom:3}}>JUGADOR A OBSERVAR</div><input style={I} placeholder="Nombre del jugador" value={jugador} onChange={e=>setJugador(e.target.value)}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div><div style={{fontSize:10,color:"#4a6070",marginBottom:3}}>POSICIÓN</div><select style={I} value={posicion} onChange={e=>setPosicion(e.target.value)}><option value="">— Posición</option>{Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}</select></div>
              <div><div style={{fontSize:10,color:"#4a6070",marginBottom:3}}>MINUTO CLAVE</div><input style={I} placeholder="Ej: 23:40" value={minuto} onChange={e=>setMinuto(e.target.value)}/></div>
            </div>
            <div><div style={{fontSize:10,color:"#4a6070",marginBottom:3}}>CONTEXTO ADICIONAL</div><textarea style={{...I,resize:"vertical",minHeight:60}} placeholder="Rival, importancia del partido, rol específico..." value={contexto} onChange={e=>setContexto(e.target.value)}/></div>
            <button onClick={analizarConIA} disabled={loading} style={{width:"100%",border:"none",borderRadius:10,padding:"12px",color:"#fff",fontWeight:700,cursor:loading?"wait":"pointer",fontSize:13,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:loading?0.7:1}}>
              {loading?<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando con IA...</>:"🤖 Generar Análisis de Scouting"}
              <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
            </button>
          </div>
        </div>
      </div>
      <div>
        {analisis?(<div style={{background:"rgba(139,92,246,0.06)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:13,padding:16,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><div style={{color:"#eef2f6",fontWeight:700,fontSize:14}}>🎬 Informe de Scouting — {jugador||"Jugador"}</div><div style={{color:"#64748b",fontSize:11,marginTop:2}}>{posicion&&posicion+" · "}{hoy()}</div></div>
            <div style={{display:"flex",gap:7}}>
              <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}}>FichaScout PRO</span>
              <button onClick={exportarPDF} style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:6,padding:"3px 10px",color:"#818cf8",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700}}>📄 PDF</button>
              <button onClick={()=>setAnalisis("")} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"3px 10px",color:"#64748b",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↻</button>
            </div>
          </div>
          <div style={{color:"#c4b5fd",lineHeight:1.9,fontSize:12.5,whiteSpace:"pre-wrap",maxHeight:520,overflowY:"auto"}}>{analisis}</div>
        </div>):(<div style={{background:"rgba(255,255,255,0.02)",border:"2px dashed rgba(255,255,255,0.07)",borderRadius:13,padding:40,textAlign:"center",color:"#334155",marginBottom:12}}><div style={{fontSize:42,marginBottom:12}}>🤖</div><div style={{fontSize:14,color:"#475569",marginBottom:6}}>El análisis aparecerá aquí</div><div style={{fontSize:12,color:"#334155"}}>Carga un video y presiona<br/>«Generar Análisis de Scouting»</div></div>)}
        {historial.length>0&&(<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:14}}>
          <div style={{fontSize:11,color:"#4a6070",fontWeight:700,marginBottom:10,letterSpacing:.5}}>HISTORIAL DE ANÁLISIS</div>
          {historial.map(h=>(<div key={h.id} onClick={()=>{setAnalisis(h.analisis);setYtId(h.ytId);setUrl(h.url);setJugador(h.jugador);}} style={{padding:"8px 10px",background:"rgba(255,255,255,0.03)",borderRadius:8,marginBottom:6,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}><div><div style={{color:"#eef2f6",fontSize:12,fontWeight:600}}>🎬 {h.jugador}</div><div style={{color:"#334155",fontSize:10,marginTop:1}}>{h.fecha}</div></div><span style={{color:"#3b82f6",fontSize:11}}>Ver →</span></div>))}
        </div>)}
      </div>
    </div>
  </div>);
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


function exportBenchmarkPDF(jugSel,metricasFilled,sobrePromedio,percentilGlobal,fuenteBK,pais,div,nv,iaText){
  if(!jugSel)return;
  const nvL={1:"1ª Div.",2:"2ª Div.",3:"Copa",4:"Amateur"};
  const sC=d=>d?.mejor?"#00a855":d?.peor?"#ef4444":"#f59e0b";
  const sL=d=>!d?"—":d?.mejor?"▲ Sobre promedio":d?.peor?"▼ Bajo promedio":"● En promedio";
  const fv=v=>v!=null?(+v<10?(+v).toFixed(2):(+v).toFixed(0)):"—";
  const fecha=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});
  const rows=metricasFilled.map(m=>{
    const col=sC(m.diff);const lbl=sL(m.diff);
    const pct=m.diff?((+m.diff.pct>0?"+":"")+m.diff.pct+"%"):"—";
    return "<tr><td style='padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#374151'>"+m.icon+" "+m.l+"</td>"+
      "<td style='padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:12px;text-align:right;color:#64748b'>"+fv(m.ligaVal)+"</td>"+
      "<td style='padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:right;font-weight:700;color:"+col+"'>"+fv(m.jugVal)+"</td>"+
      "<td style='padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:12px;text-align:right;font-weight:700;color:"+col+"'>"+pct+"</td>"+
      "<td style='padding:7px 10px;border-bottom:1px solid #f1f5f9;text-align:center'><span style='background:"+col+"18;color:"+col+";border:1px solid "+col+"44;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700'>"+lbl+"</span></td></tr>";
  }).join("");
  const stats=[["⚽","Goles",jugSel.s?.g],["🎯","Asist",jugSel.s?.a],["💥","Disp",jugSel.s?.dis],["📅","PJ",jugSel.s?.pts],["⏱️","Min",jugSel.s?.min],["⭐","Rating",jugSel.s?.rat]]
    .filter(([,,v])=>v!=null)
    .map(([ic,lb,v])=>"<div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;text-align:center'><div style='font-size:16px'>"+ic+"</div><div style='font-size:15px;font-weight:800;color:#0f172a'>"+v+"</div><div style='font-size:10px;color:#94a3b8'>"+lb+"</div></div>").join("");
  const iaHtml=iaText?"<div style='margin-top:20px;padding:14px;background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px'><div style='font-size:13px;font-weight:800;color:#7c3aed;margin-bottom:8px'>🤖 Análisis IA — FichaScout PRO</div><div style='font-size:12px;line-height:1.9;color:#374151;text-align:justify;white-space:pre-wrap'>"+iaText+"</div></div>":"";
  const html="<!DOCTYPE html><html><head><meta charset='UTF-8'/><title>Benchmark "+jugSel.n+"</title>"+
    "<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#fff;color:#0f172a;padding:28px;max-width:800px;margin:0 auto}"+
    "h2{font-size:13px;font-weight:700;color:#0f172a;margin:18px 0 8px;padding-bottom:5px;border-bottom:2px solid #e2e8f0}"+
    "table{width:100%;border-collapse:collapse}th{padding:7px 10px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.4px;background:#f8fafc;border-bottom:2px solid #e2e8f0;text-align:left}"+
    "tr:last-child td{border-bottom:none}@media print{body{padding:14px}}</style></head><body>"+
    "<div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid #00e87a'>"+
    "<div><div style='font-size:10px;color:#94a3b8;font-weight:700;letter-spacing:.5px;margin-bottom:3px'>📊 INFORME DE BENCHMARK · FICHASCOUT PRO</div>"+
    "<div style='font-size:22px;font-weight:900;color:#0f172a'>"+jugSel.n+"</div>"+
    "<div style='font-size:12px;color:#64748b;margin-top:3px'>"+jugSel.pos+" · "+jugSel.eq+" · "+jugSel.l+"</div>"+
    "<div style='font-size:11px;color:#94a3b8;margin-top:2px'>"+pais+" · "+div+" ("+nvL[nv]+") · "+fecha+"</div></div>"+
    (jugSel.foto?"<img src='"+jugSel.foto+"' style='width:68px;height:68px;border-radius:50%;object-fit:cover;border:3px solid #00e87a'/>":"")+"</div>"+
    "<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px'>"+
    "<div style='background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:12px;text-align:center'><div style='font-size:10px;color:#16a34a;font-weight:700'>SOBRE PROMEDIO</div><div style='font-size:24px;font-weight:900;color:#15803d'>"+sobrePromedio+"/"+metricasFilled.length+"</div><div style='font-size:9px;color:#4ade80'>métricas</div></div>"+
    "<div style='background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;padding:12px;text-align:center'><div style='font-size:10px;color:#2563eb;font-weight:700'>PERCENTIL</div><div style='font-size:24px;font-weight:900;color:#1d4ed8'>P"+percentilGlobal+"</div><div style='font-size:9px;color:#60a5fa'>en su posición</div></div>"+
    "<div style='background:#fefce8;border:1px solid #fde047;border-radius:10px;padding:12px;text-align:center'><div style='font-size:10px;color:#ca8a04;font-weight:700'>BENCHMARK</div><div style='font-size:24px;font-weight:900;color:#a16207'>"+(fuenteBK>0?fuenteBK:"Ref.")+"</div><div style='font-size:9px;color:#fbbf24'>"+(fuenteBK>0?"jugadores reales":"referencial")+"</div></div>"+
    "</div>"+
    "<h2>Estadísticas del jugador</h2>"+
    "<div style='display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:18px'>"+stats+"</div>"+
    "<h2>Comparativa vs promedio de liga</h2>"+
    "<table><thead><tr><th>MÉTRICA</th><th style='text-align:right'>⌀ LIGA</th><th style='text-align:right'>JUGADOR</th><th style='text-align:right'>DIFERENCIA</th><th style='text-align:center'>ESTADO</th></tr></thead><tbody>"+rows+"</tbody></table>"+
    (fuenteBK>0?"<div style='font-size:9px;color:#94a3b8;margin-top:5px'>⌀ Calculado sobre "+fuenteBK+" jugadores reales · "+div+"</div>":"")+
    iaHtml+
    "<div style='margin-top:24px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:9px;color:#94a3b8'>"+
    "<span>FichaScout PRO — Plataforma de Scouting Profesional</span><span>fichascout.com · "+fecha+"</span></div>"+
    "</body></html>";
  const w=window.open("","_blank");w.document.write(html);w.document.close();setTimeout(()=>w.print(),700);
}

// ─── BENCHMARKS AVANZADO v3 ──────────────────────────────────────────────────
function ModBenchmarks() {
  const paises = Object.keys(SA);
  const [pais,setPais]=useState(paises[0]);
  const [div,setDiv]=useState(Object.keys(SA[paises[0]])[0]);
  const [pos,setPos]=useState("Delantero Centro");
  const [equipo,setEquipo]=useState("__todos__");
  const [busq,setBusq]=useState("");
  const [jugSel,setJugSel]=useState(null);
  const [dbPro,setDbPro]=useState(null);
  const [loadDB,setLoadDB]=useState(false);
  const [iaText,setIaText]=useState("");
  const [loadIA,setLoadIA]=useState(false);
  const [tab2,setTab2]=useState("comparacion");
  const [panelOpen,setPanelOpen]=useState(false);

  useEffect(()=>{
    if(!dbPro&&!loadDB){
      setLoadDB(true);
      fetch("/fichascout_pro_data.json").then(r=>r.json()).then(d=>{setDbPro(d);setLoadDB(false);}).catch(()=>setLoadDB(false));
    }
  },[]);

  const divData=SA[pais]?.[div];
  const ligaId=Number(divData?.id)||0;
  const nv=divData?.nv||2;
  const clubes=divData?.cl||[];
  const nC={1:"#00e87a",2:"#3b82f6",3:"#f59e0b",4:"#64748b"};
  const nvLbl={1:"1ª División",2:"2ª División",3:"Copa / Regional",4:"Amateur"};

  function posAC(p){
    if(!p)return"Delantero";
    if(p.includes("Arquero")||p.includes("Goalkeeper"))return"Arquero";
    if(p.includes("Defensor")||p.includes("Lateral")||p.includes("Defender"))return"Defensor";
    if(p.includes("Volante")||p.includes("Midfielder")||p.includes("Mediocampista"))return"Volante";
    return"Delantero";
  }

  // ── Filtrar por l_id (ID numérico único) — soluciona mezcla de ligas ────────
  const jugadoresLiga=useMemo(()=>{
    if(!dbPro||!ligaId)return[];
    return dbPro.jugadores.filter(j=>{
      const matchLiga = Number(j.l_id)===ligaId;
      const matchEquipo = equipo==="__todos__"||(j.eq===equipo);
      const matchPos = posAC(j.pos)===posAC(pos);
      return matchLiga&&matchEquipo&&matchPos&&j.s?.rat;
    });
  },[dbPro,ligaId,equipo,pos]);

  const todosLiga=useMemo(()=>{
    if(!dbPro||!ligaId)return[];
    return dbPro.jugadores.filter(j=>{
      const matchLiga = Number(j.l_id)===ligaId;
      const matchEquipo = equipo==="__todos__"||(j.eq===equipo);
      return matchLiga&&matchEquipo&&j.s?.rat;
    }).sort((a,b)=>(b.s?.rat||0)-(a.s?.rat||0));
  },[dbPro,ligaId,equipo]);

  const sugerencias=useMemo(()=>{
    if(!busq||busq.length<1||!dbPro)return[];
    const q=busq.toLowerCase();
    // Primero buscar en la liga actual
    const enLiga=todosLiga.filter(j=>j.n?.toLowerCase().includes(q));
    if(enLiga.length>0)return enLiga.slice(0,10);
    // Si no, buscar en toda la base
    return dbPro.jugadores.filter(j=>j.n?.toLowerCase().includes(q)&&j.s?.rat).slice(0,10);
  },[busq,todosLiga,dbPro]);

  const benchmarkReal=useMemo(()=>{
    if(jugadoresLiga.length<3)return null;
    const keys=["g","a","dis","reg","due","min","rat","pas","pc","tac","int","ata","pts"];
    const sums={};const counts={};
    keys.forEach(k=>{sums[k]=0;counts[k]=0;});
    jugadoresLiga.forEach(j=>keys.forEach(k=>{
      const v=j.s?.[k];
      if(v!=null&&!isNaN(v)&&+v>0){sums[k]+=parseFloat(v);counts[k]++;}
    }));
    const res={};keys.forEach(k=>{if(counts[k]>2)res[k]=sums[k]/counts[k];});
    return res;
  },[jugadoresLiga]);

  const BK_FB={
    "Arquero":{1:{ata:4.2,pas:580,min:2500,pts:28,rat:6.9},2:{ata:3.5,pas:480,min:2200,pts:25,rat:6.7},3:{ata:3.0,pas:380,min:1900,pts:22,rat:6.5}},
    "Defensor":{1:{tac:3.1,int:2.8,due:4.5,pas:680,g:0.8,rat:6.85},2:{tac:2.6,int:2.2,due:3.7,pas:560,g:0.5,rat:6.7},3:{tac:2.1,int:1.7,due:2.9,pas:440,g:0.3,rat:6.5}},
    "Volante":{1:{pas:920,pc:2.1,g:2.5,a:2.8,tac:2.4,int:1.9,rat:6.9},2:{pas:760,pc:1.7,g:1.8,a:2.1,tac:2.0,int:1.5,rat:6.75},3:{pas:600,pc:1.3,g:1.2,a:1.5,tac:1.6,int:1.1,rat:6.55}},
    "Delantero":{1:{g:8.5,a:3.2,dis:22.0,reg:28.0,due:95.0,min:2100,rat:7.0},2:{g:6.5,a:2.4,dis:17.0,reg:22.0,due:76.0,min:1850,rat:6.8},3:{g:4.5,a:1.7,dis:13.0,reg:16.0,due:58.0,min:1600,rat:6.6}},
  };
  const MET={
    "Arquero":[{k:"ata",l:"Atajadas",icon:"🛑"},{k:"pas",l:"Pases totales",icon:"📤"},{k:"min",l:"Minutos",icon:"⏱️"},{k:"pts",l:"Partidos",icon:"📅"},{k:"rat",l:"Rating",icon:"⭐"}],
    "Defensor":[{k:"tac",l:"Tackles",icon:"⚡"},{k:"int",l:"Intercepciones",icon:"🚫"},{k:"due",l:"Duelos ganados",icon:"💪"},{k:"pas",l:"Pases totales",icon:"📤"},{k:"g",l:"Goles",icon:"⚽"},{k:"rat",l:"Rating",icon:"⭐"}],
    "Volante":[{k:"pas",l:"Pases totales",icon:"📤"},{k:"pc",l:"Pases clave",icon:"🔑"},{k:"g",l:"Goles",icon:"⚽"},{k:"a",l:"Asistencias",icon:"🎯"},{k:"tac",l:"Tackles",icon:"⚡"},{k:"int",l:"Intercepciones",icon:"🚫"},{k:"rat",l:"Rating",icon:"⭐"}],
    "Delantero":[{k:"g",l:"Goles",icon:"⚽"},{k:"a",l:"Asistencias",icon:"🎯"},{k:"dis",l:"Disparos arco",icon:"💥"},{k:"reg",l:"Regates",icon:"🕺"},{k:"due",l:"Duelos ganados",icon:"💪"},{k:"min",l:"Minutos",icon:"⏱️"},{k:"rat",l:"Rating",icon:"⭐"}],
  };

  const catJug=jugSel?posAC(jugSel.pos):posAC(pos);
  const metricas=MET[catJug]||MET["Delantero"];
  const bkUsado=(benchmarkReal&&Object.keys(benchmarkReal).length>2)?benchmarkReal:(BK_FB[catJug]?.[Math.min(nv,3)]||{});
  const fuenteBK=(benchmarkReal&&Object.keys(benchmarkReal).length>2)?jugadoresLiga.length:0;

  const calcDiff=(jv,lv)=>{if(jv==null||lv==null||lv===0)return null;const pct=((jv-lv)/lv)*100;return{pct:pct.toFixed(1),mejor:pct>5,peor:pct<-5};};
  const calcPct=(jv,lv)=>{if(!jv||!lv)return null;const r=jv/lv;if(r>=2.0)return 97;if(r>=1.6)return 92;if(r>=1.3)return 82;if(r>=1.1)return 70;if(r>=0.9)return 50;if(r>=0.7)return 30;if(r>=0.5)return 18;return 8;};

  const metricasFilled=metricas.map(m=>{
    const jv=jugSel?(jugSel.s?.[m.k]??null):null;
    const lv=bkUsado[m.k]??null;
    return{...m,jugVal:jv,ligaVal:lv,diff:calcDiff(jv,lv),percentil:calcPct(jv,lv)};
  }).filter(m=>m.ligaVal!=null);

  const sobrePromedio=jugSel?metricasFilled.filter(m=>m.diff?.mejor).length:null;
  const percentilGlobal=jugSel?Math.round(metricasFilled.filter(m=>m.percentil).reduce((s,m)=>s+m.percentil,0)/Math.max(metricasFilled.filter(m=>m.percentil).length,1)):null;

  async function generarIA(){
    if(!jugSel){return;} if(!ANTHROPIC_KEY){setIaText("⚠️ Sin créditos API. Recarga en console.anthropic.com");return;}
    setLoadIA(true);setIaText("");
    const fv=v=>v!=null?(+v<10?(+v).toFixed(2):(+v).toFixed(0)):"N/D";
    const metStr=metricasFilled.map(m=>m.l+": jug="+fv(m.jugVal)+" vs liga="+fv(m.ligaVal)+(m.diff?(" ("+(+m.diff.pct>0?"+":"")+m.diff.pct+"%)"):""  )).join(" | ");
    const fb=fuenteBK>0?("Benchmark calculado sobre "+fuenteBK+" jugadores reales."):"Benchmark referencial.";
    const prompt="Eres Chief Scout. Analiza este benchmark.\n\nJUGADOR: "+jugSel.n+" | "+jugSel.pos+" | "+(jugSel.e||"s/d")+"a | "+jugSel.eq+"\nLIGA: "+pais+" - "+div+" (Nivel "+nv+") | "+fb+"\nPERCENTIL: "+(percentilGlobal||"N/D")+" | SOBRE PROMEDIO: "+(sobrePromedio||"N/D")+"/"+metricasFilled.length+"\nMETRICAS: "+metStr+"\n\n1. POSICIONAMIENTO\nEn que percentil real esta? Que lo distingue del promedio?\n\n2. METRICAS DESTACADAS\nLas 2-3 stats donde mas supera y su impacto tactico.\n\n3. BRECHAS CRITICAS\nDonde esta bajo promedio y que riesgo implica.\n\n4. VEREDICTO\nSupera, iguala o esta bajo el promedio de "+div+"? Vale el fichaje?";
    try{
      const rr=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:API_HEADERS,body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const d=await rr.json();setIaText(d.content?.[0]?.text||"Error.");
    }catch(err){setIaText("Error: "+err.message);}
    setLoadIA(false);
  }

  function selJug(j){
    setJugSel(j);setBusq("");setPanelOpen(false);setIaText("");
    const pm=Object.keys(POS).find(p=>posAC(p)===posAC(j.pos));
    if(pm)setPos(pm);
  }

  function BenchRow({m}){
    const{l,icon,jugVal,ligaVal,diff,percentil}=m;
    const hj=jugVal!=null;
    const bMax=hj?Math.max(+jugVal,+ligaVal,0.01):+ligaVal||1;
    const lPct=Math.round((+ligaVal/bMax)*100);
    const jPct=hj?Math.round((+jugVal/bMax)*100):0;
    const sc=!hj?"#64748b":diff?.mejor?"#00a855":diff?.peor?"#ef4444":"#f59e0b";
    const sb=!hj?"transparent":diff?.mejor?"rgba(0,168,85,0.1)":diff?.peor?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)";
    const sl=!hj?"—":diff?.mejor?"▲ Sobre":diff?.peor?"▼ Bajo":"● Promedio";
    const fv=v=>v!=null?(+v<10?(+v).toFixed(2):(+v).toFixed(0)):"—";
    return(
      <div style={{display:"grid",gridTemplateColumns:"1.7fr 1fr 1fr 1fr 100px",gap:8,padding:"9px 14px",borderBottom:"1px solid rgba(255,255,255,0.05)",alignItems:"center"}}>
        <span style={{fontSize:12,color:"#94a3b8",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:14}}>{icon}</span>{l}</span>
        <div><span style={{fontSize:13,color:"#64748b",display:"block",textAlign:"right",marginBottom:3}}>{fv(ligaVal)}</span><div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{width:lPct+"%",height:"100%",background:"#475569",borderRadius:2}}/></div></div>
        <div>{hj?<><span style={{fontSize:13,fontWeight:700,color:sc,display:"block",textAlign:"right",marginBottom:3}}>{fv(jugVal)}</span><div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{width:jPct+"%",height:"100%",background:sc,borderRadius:2}}/></div></>:<span style={{fontSize:12,color:"#334155",textAlign:"right",display:"block"}}>—</span>}</div>
        <div style={{textAlign:"right"}}>{hj&&diff?<span style={{fontSize:12,fontWeight:700,color:sc}}>{+diff.pct>0?"+":""}{diff.pct}%</span>:<span style={{fontSize:12,color:"#334155"}}>—</span>}{hj&&percentil&&<div style={{fontSize:10,color:"#475569",marginTop:1}}>P{percentil}</div>}</div>
        <div style={{background:sb,border:"1px solid "+sc+"33",borderRadius:6,padding:"3px 7px",textAlign:"center",fontSize:11,fontWeight:700,color:sc}}>{sl}</div>
      </div>
    );
  }

  function RadarViz(){
    const mts=metricasFilled.slice(0,6);if(mts.length<3)return null;
    const n=mts.length,cx=175,cy=165,R=125;
    const ang=i=>(i*2*Math.PI/n)-Math.PI/2;
    const pt=(val,max,i)=>{const r=R*Math.min(val/(max*1.2),1);return[cx+r*Math.cos(ang(i)),cy+r*Math.sin(ang(i))];};
    const pts=mts.map((m,i)=>({liga:pt(m.ligaVal||0,Math.max(m.ligaVal||0,m.jugVal||0,0.01),i),jug:m.jugVal!=null?pt(m.jugVal,Math.max(m.ligaVal||0,m.jugVal||0,0.01),i):null,lbl:m.l.split(" ")[0],lPt:[cx+(R+22)*Math.cos(ang(i)),cy+(R+22)*Math.sin(ang(i))]}));
    const polyL=pts.map(p=>p.liga.join(",")).join(" ");
    const polyJ=pts.filter(p=>p.jug).map(p=>p.jug.join(",")).join(" ");
    return(
      <svg viewBox="0 0 350 330" style={{width:"100%",maxWidth:340}}>
        {[.25,.5,.75,1].map(s=><polygon key={s} points={pts.map((_,i)=>{const rr=R*s;return[cx+rr*Math.cos(ang(i)),cy+rr*Math.sin(ang(i))].join(",");}).join(" ")} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>)}
        {pts.map((_,i)=><line key={i} x1={cx} y1={cy} x2={cx+R*Math.cos(ang(i))} y2={cy+R*Math.sin(ang(i))} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>)}
        <polygon points={polyL} fill="rgba(71,85,105,0.18)" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3"/>
        {polyJ&&<polygon points={polyJ} fill="rgba(0,168,85,0.15)" stroke="#00a855" strokeWidth="2"/>}
        {pts.map(p=>p.jug&&<circle key={p.lbl+"j"} cx={p.jug[0]} cy={p.jug[1]} r="3.5" fill="#00a855"/>)}
        {pts.map(p=><circle key={p.lbl+"l"} cx={p.liga[0]} cy={p.liga[1]} r="2.5" fill="#475569"/>)}
        {pts.map(p=><text key={p.lbl+"t"} x={p.lPt[0]} y={p.lPt[1]} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#64748b">{p.lbl}</text>)}
      </svg>
    );
  }

  const fv=v=>v!=null?(+v<10?(+v).toFixed(2):(+v).toFixed(0)):"—";

  return(
    <div>
      {/* HEADER */}
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:800,color:"#eef2f6",fontSize:19,marginBottom:3}}>📊 Benchmarks SA — Análisis Comparativo Avanzado</div>
        <div style={{color:"#4a6070",fontSize:12}}>Selecciona liga y equipo · Elige o busca un jugador · Compara contra el promedio estadístico real</div>
      </div>

      {/* FILTROS */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"12px 14px",marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
          <div><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4,letterSpacing:.5}}>PAÍS / LIGA</div>
            <select style={I} value={pais} onChange={e=>{setPais(e.target.value);setDiv(Object.keys(SA[e.target.value])[0]);setEquipo("__todos__");setJugSel(null);setBusq("");}}>
              {Object.keys(SA).map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4,letterSpacing:.5}}>DIVISIÓN</div>
            <select style={I} value={div} onChange={e=>{setDiv(e.target.value);setEquipo("__todos__");setJugSel(null);setBusq("");}}>
              {Object.keys(SA[pais]||{}).map(d=><option key={d} value={d}>{d}</option>)}</select></div>
          <div><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4,letterSpacing:.5}}>EQUIPO</div>
            <select style={I} value={equipo} onChange={e=>{setEquipo(e.target.value);setJugSel(null);setBusq("");}}>
              <option value="__todos__">— Todos —</option>
              {clubes.map(cc=><option key={cc} value={cc}>{cc}</option>)}</select></div>
          <div><div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4,letterSpacing:.5}}>POSICIÓN</div>
            <select style={I} value={pos} onChange={e=>{setPos(e.target.value);setJugSel(null);}}>
              {Object.keys(POS).map(p=><option key={p} value={p}>{POS[p].icon} {p}</option>)}</select></div>
        </div>

        {/* BUSCADOR */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8}}>
          <div style={{position:"relative"}}>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:700,marginBottom:4,letterSpacing:.5}}>
              BUSCAR JUGADOR
              {fuenteBK>0&&<span style={{marginLeft:8,color:"#00a855",fontWeight:600}}>⌀ calculado sobre {fuenteBK} jugadores reales</span>}
            </div>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#4a6070",fontSize:14,pointerEvents:"none"}}>🔍</span>
              <input style={{...I,paddingLeft:32}} placeholder={"Buscar en "+(equipo==="__todos__"?div:equipo)+"..."} value={busq} onChange={e=>setBusq(e.target.value)}/>
              {busq&&<button onClick={()=>{setBusq("");}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16,padding:"0 4px"}}>✕</button>}
            </div>
            {busq.length>0&&sugerencias.length>0&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#0a1929",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,zIndex:300,maxHeight:280,overflowY:"auto",marginTop:3,boxShadow:"0 12px 40px rgba(0,0,0,0.6)"}}>
                <div style={{padding:"6px 12px 4px",fontSize:10,color:"#475569",fontWeight:700,letterSpacing:.5,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  {sugerencias.some(j=>Number(j.l_id)===ligaId)?"JUGADORES EN "+div.toUpperCase():"RESULTADOS EN TODA LA BASE"}
                </div>
                {sugerencias.map(j=>(
                  <div key={j.id||j.n} onClick={()=>selJug(j)}
                    style={{padding:"10px 12px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(0,232,122,0.07)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <img src={j.foto} style={{width:34,height:34,borderRadius:"50%",objectFit:"cover",border:"1.5px solid rgba(255,255,255,0.1)"}} onError={e=>e.target.style.display="none"}/>
                      <div>
                        <div style={{color:"#eef2f6",fontSize:13,fontWeight:700}}>{j.n}</div>
                        <div style={{color:"#4a6070",fontSize:11,marginTop:1}}>{j.pos} · {j.eq} · {j.e}a</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{color:"#f59e0b",fontSize:13,fontWeight:800}}>★{j.s?.rat}</span>
                      <span style={{background:"rgba(100,116,139,0.15)",color:"#64748b",borderRadius:5,padding:"2px 7px",fontSize:10}}>{(j.l||"").substring(0,18)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {busq.length>0&&sugerencias.length===0&&!loadDB&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#0a1929",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,zIndex:300,padding:"14px",marginTop:3,textAlign:"center",color:"#475569",fontSize:12}}>
                Sin resultados para "{busq}"
              </div>
            )}
          </div>
          <div>
            <div style={{fontSize:10,color:"transparent",marginBottom:4}}>.</div>
            <button onClick={()=>setPanelOpen(!panelOpen)} style={{border:"1px solid rgba(0,232,122,0.3)",borderRadius:8,padding:"7px 14px",color:panelOpen?"#0d1f2d":"#00e87a",background:panelOpen?"#00e87a":"rgba(0,232,122,0.08)",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",transition:"all .2s"}}>
              {panelOpen?"✕ Cerrar":"👥 Ver jugadores"}{!loadDB&&todosLiga.length>0&&<span style={{background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"1px 7px",fontSize:10}}>{todosLiga.length}</span>}{loadDB&&<span style={{fontSize:10}}>⏳</span>}
            </button>
          </div>
        </div>
      </div>

      {/* JUGADOR SELECCIONADO — barra separada */}
      {jugSel&&(
        <div style={{background:"linear-gradient(135deg,rgba(0,232,122,0.06),rgba(0,168,85,0.03))",border:"1px solid rgba(0,232,122,0.25)",borderRadius:13,padding:"14px 16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <img src={jugSel.foto} style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",border:"2.5px solid rgba(0,232,122,0.5)",flexShrink:0}} onError={e=>e.target.style.display="none"}/>
              <div>
                <div style={{color:"#00e87a",fontWeight:800,fontSize:17,marginBottom:2}}>{jugSel.n}</div>
                <div style={{color:"#64748b",fontSize:12,marginBottom:6}}>{jugSel.pos} · {jugSel.eq} · {jugSel.l}</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <span style={{background:"rgba(245,158,11,0.15)",color:"#f59e0b",borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:700}}>★ {jugSel.s?.rat}</span>
                  <span style={{background:"rgba(100,116,139,0.15)",color:"#94a3b8",borderRadius:5,padding:"2px 8px",fontSize:11}}>🎂 {jugSel.e}a</span>
                  {jugSel.pais&&<span style={{background:"rgba(100,116,139,0.15)",color:"#94a3b8",borderRadius:5,padding:"2px 8px",fontSize:11}}>🌎 {jugSel.pais}</span>}
                  {jugSel.alt&&<span style={{background:"rgba(100,116,139,0.15)",color:"#94a3b8",borderRadius:5,padding:"2px 8px",fontSize:11}}>📏 {jugSel.alt}</span>}
                  {jugSel.pes&&<span style={{background:"rgba(100,116,139,0.15)",color:"#94a3b8",borderRadius:5,padding:"2px 8px",fontSize:11}}>⚖️ {jugSel.pes}</span>}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,auto)",gap:"6px 14px",fontSize:11,textAlign:"center"}}>
                {[["⚽","Goles",jugSel.s?.g],["🎯","Asist",jugSel.s?.a],["💥","Disp",jugSel.s?.dis],["📅","PJ",jugSel.s?.pts],["⏱️","Min",jugSel.s?.min],["⭐","Rating",jugSel.s?.rat]].map(([icon,lbl,val])=>val!=null&&(
                  <div key={lbl} style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"5px 8px",minWidth:48}}>
                    <div style={{fontSize:13,marginBottom:1}}>{icon}</div>
                    <div style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>{val}</div>
                    <div style={{color:"#475569",fontSize:9}}>{lbl}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>{setJugSel(null);setIaText("");}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:7,padding:"5px 9px",color:"#ef4444",cursor:"pointer",fontSize:13,fontFamily:"inherit",marginTop:2}}>✕</button>
            </div>
          </div>
          {percentilGlobal!=null&&(
            <div style={{marginTop:12,padding:"8px 12px",background:"rgba(0,0,0,0.2)",borderRadius:8,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"#4a6070"}}>vs promedio {div}:</span>
              <span style={{color:"#3b82f6",fontWeight:700,fontSize:13}}>Percentil P{percentilGlobal}/100</span>
              <span style={{color:sobrePromedio>=metricasFilled.length*0.6?"#00a855":"#f59e0b",fontWeight:700,fontSize:13}}>{sobrePromedio}/{metricasFilled.length} métricas sobre promedio</span>
              {fuenteBK>0&&<span style={{color:"#4a6070",fontSize:11}}>⌀ basado en {fuenteBK} jugadores reales</span>}
            </div>
          )}
        </div>
      )}

      {/* PANEL JUGADORES */}
      {panelOpen&&(
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(0,232,122,0.12)",borderRadius:13,padding:14,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>
              👥 {equipo==="__todos__"?div:equipo}
              <span style={{color:"#4a6070",fontSize:11,fontWeight:400,marginLeft:8}}>{loadDB?"Cargando...":(todosLiga.length+" jugadores")}</span>
            </span>
            <span style={{color:"#475569",fontSize:11}}>Click en cualquier fila para seleccionar</span>
          </div>
          {loadDB&&<div style={{textAlign:"center",padding:24,color:"#4a6070"}}>⏳ Cargando base de datos...</div>}
          {!loadDB&&todosLiga.length===0&&(
            <div style={{textAlign:"center",padding:24,color:"#334155",fontSize:13}}>
              <div style={{fontSize:28,marginBottom:8}}>🔍</div>
              Sin jugadores de <strong style={{color:"#4a6070"}}>{equipo==="__todos__"?div:equipo}</strong> en la base.
              {equipo!=="__todos__"&&<div style={{fontSize:11,color:"#334155",marginTop:4}}>Prueba con "Todos los equipos" o usa el buscador.</div>}
            </div>
          )}
          {todosLiga.length>0&&(
            <div style={{maxHeight:360,overflowY:"auto",borderRadius:8,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 1.2fr 0.5fr 0.5fr 0.5fr 0.5fr",gap:6,padding:"6px 10px",fontSize:10,fontWeight:700,color:"#334155",letterSpacing:.5,borderBottom:"1px solid rgba(255,255,255,0.07)",position:"sticky",top:0,background:"#07111a"}}>
                <span>JUGADOR</span><span>EQUIPO</span><span>POSICIÓN</span><span style={{textAlign:"right"}}>★</span><span style={{textAlign:"right"}}>⚽</span><span style={{textAlign:"right"}}>🎯</span><span style={{textAlign:"right"}}>EDAD</span>
              </div>
              {todosLiga.map(j=>(
                <div key={j.id||j.n} onClick={()=>selJug(j)}
                  style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 1.2fr 0.5fr 0.5fr 0.5fr 0.5fr",gap:6,padding:"8px 10px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.03)",alignItems:"center",background:jugSel?.id===j.id?"rgba(0,232,122,0.08)":"transparent",transition:"background .1s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=jugSel?.id===j.id?"rgba(0,232,122,0.1)":"rgba(0,232,122,0.05)"}
                  onMouseLeave={e=>e.currentTarget.style.background=jugSel?.id===j.id?"rgba(0,232,122,0.08)":"transparent"}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <img src={j.foto} style={{width:26,height:26,borderRadius:"50%",objectFit:"cover",flexShrink:0}} onError={e=>e.target.style.display="none"}/>
                    <span style={{color:"#eef2f6",fontSize:12,fontWeight:600}}>{j.n}</span>
                    {jugSel?.id===j.id&&<span style={{color:"#00e87a",fontSize:11,fontWeight:700}}>✓</span>}
                  </div>
                  <span style={{color:"#64748b",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.eq}</span>
                  <span style={{color:"#64748b",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.pos}</span>
                  <span style={{textAlign:"right",color:"#f59e0b",fontSize:12,fontWeight:700}}>{j.s?.rat||"—"}</span>
                  <span style={{textAlign:"right",color:"#00a855",fontSize:12,fontWeight:600}}>{j.s?.g??"—"}</span>
                  <span style={{textAlign:"right",color:"#3b82f6",fontSize:12,fontWeight:600}}>{j.s?.a??"—"}</span>
                  <span style={{textAlign:"right",color:"#94a3b8",fontSize:11}}>{j.e?j.e+"a":"—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
        {[
          {l:"Nivel liga",v:nvLbl[nv],c:nC[nv],s:pais+" · "+div},
          {l:"Benchmark",v:fuenteBK>0?fuenteBK+" jugadores":"Referencial",c:fuenteBK>0?"#00a855":"#f59e0b",s:fuenteBK>0?"datos reales de la base":"datos de referencia"},
          {l:"Sobre promedio",v:jugSel?(sobrePromedio+"/"+metricasFilled.length):"—",c:"#00a855",s:jugSel?"métricas destacadas":"Selecciona jugador"},
          {l:"Percentil",v:jugSel?("P"+percentilGlobal):"—",c:"#3b82f6",s:jugSel?"estimado en posición":"Selecciona jugador"},
        ].map(({l,v,c,s})=>(
          <div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"11px 13px"}}>
            <div style={{fontSize:10,color:"#4a6070",fontWeight:600,marginBottom:4,letterSpacing:.4}}>{l}</div>
            <div style={{fontSize:18,fontWeight:800,color:c,lineHeight:1.2}}>{v}</div>
            <div style={{fontSize:10,color:"#3a5060",marginTop:3}}>{s}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {[["comparacion","📊 Comparativa"],["radar","🕸️ Radar"],["historia","📈 Percentiles"],["clubes","🏟️ Equipos"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab2(id)} style={{border:"1px solid "+(tab2===id?"rgba(0,232,122,0.4)":"rgba(255,255,255,0.07)"),borderRadius:7,padding:"6px 13px",color:tab2===id?"#00e87a":"#64748b",background:tab2===id?"rgba(0,232,122,0.08)":"transparent",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",transition:"all .15s"}}>{lbl}</button>
        ))}
      </div>

      {/* TAB: COMPARATIVA */}
      {tab2==="comparacion"&&(
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,overflow:"hidden",marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1.7fr 1fr 1fr 1fr 100px",gap:8,padding:"8px 14px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.07)",fontSize:10,fontWeight:700,color:"#4a6070",letterSpacing:.5}}>
            <span>MÉTRICA</span><span style={{textAlign:"right"}}>⌀ {fuenteBK>0?"BASE REAL":"REFERENCIA"}</span>
            <span style={{textAlign:"right"}}>{jugSel?jugSel.n.split(" ").slice(-1)[0].toUpperCase():"JUGADOR"}</span>
            <span style={{textAlign:"right"}}>DIFERENCIA</span><span style={{textAlign:"center"}}>ESTADO</span>
          </div>
          {metricasFilled.map(m=><BenchRow key={m.k} m={m}/>)}
          {metricasFilled.length===0&&<div style={{padding:24,textAlign:"center",color:"#334155",fontSize:13}}>Sin métricas disponibles para esta posición</div>}
          <div style={{padding:"8px 14px",background:fuenteBK>0?"rgba(0,168,85,0.04)":"rgba(245,158,11,0.04)",borderTop:"1px solid "+(fuenteBK>0?"rgba(0,168,85,0.1)":"rgba(245,158,11,0.1)"),fontSize:10,color:fuenteBK>0?"#166534":"#92400e"}}>
            {fuenteBK>0?"⌀ Calculado sobre "+fuenteBK+" jugadores reales de "+posAC(pos)+" en "+div+" · Base Pro Mundial":"⌀ Datos referenciales · Selecciona un jugador para activar la comparativa."}
          </div>
        </div>
      )}

      {/* TAB: RADAR */}
      {tab2==="radar"&&(
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:16,marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
            <div>
              <div style={{fontSize:11,color:"#4a6070",marginBottom:8,fontWeight:600,letterSpacing:.5}}>RADAR — {pos.toUpperCase()}</div>
              <RadarViz/>
              <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:6}}>
                <span style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:5}}><span style={{width:20,height:2,background:"#475569",display:"inline-block",borderRadius:1}}/>⌀ Liga</span>
                {jugSel&&<span style={{fontSize:11,color:"#00a855",display:"flex",alignItems:"center",gap:5}}><span style={{width:12,height:12,background:"rgba(0,168,85,0.15)",border:"2px solid #00a855",display:"inline-block",borderRadius:2}}/>{jugSel.n.split(" ")[0]}</span>}
              </div>
            </div>
            <div>
              <div style={{fontSize:11,color:"#4a6070",marginBottom:8,fontWeight:600,letterSpacing:.5}}>DETALLE MÉTRICAS</div>
              {metricasFilled.slice(0,7).map(m=>{
                const sc2=m.diff?.mejor?"#00a855":m.diff?.peor?"#ef4444":"#f59e0b";
                const bar=m.jugVal&&m.ligaVal?Math.min((+m.jugVal/(Math.max(+m.jugVal,+m.ligaVal)*1.1))*100,100):(m.ligaVal?50:0);
                return(<div key={m.k} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:11,color:"#64748b"}}>{m.icon} {m.l}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:10,color:"#475569"}}>⌀{m.ligaVal!=null?(+m.ligaVal<10?(+m.ligaVal).toFixed(1):(+m.ligaVal).toFixed(0)):"—"}</span>
                      {m.jugVal!=null&&<span style={{fontSize:11,fontWeight:700,color:sc2}}>{fv(m.jugVal)}</span>}
                    </div>
                  </div>
                  <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2}}><div style={{width:bar+"%",height:"100%",background:m.jugVal!=null?sc2:"#475569",borderRadius:2}}/></div>
                </div>);
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PERCENTILES */}
      {tab2==="historia"&&(
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:16,marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{fontSize:11,color:"#4a6070",marginBottom:10,fontWeight:600,letterSpacing:.5}}>DISTRIBUCIÓN RATING — {div.toUpperCase()}</div>
              {[{l:"⌀ Promedio liga",v:bkUsado.rat??6.8,c:"#475569"},{l:"Top 25%",v:(bkUsado.rat??6.8)*1.07,c:"#3b82f6"},{l:"Top 10%",v:(bkUsado.rat??6.8)*1.14,c:"#00e87a"},...(jugSel?.s?.rat?[{l:jugSel.n.split(" ")[0],v:parseFloat(jugSel.s.rat),c:"#f59e0b",hi:true}]:[])].map(n=>(
                <div key={n.l} style={{marginBottom:9}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:n.hi?n.c:"#64748b",fontWeight:n.hi?700:400}}>{n.l}</span><span style={{fontSize:11,fontWeight:700,color:n.c}}>{(+n.v).toFixed(2)}</span></div>
                  <div style={{height:n.hi?7:5,background:"rgba(255,255,255,0.06)",borderRadius:3}}><div style={{width:Math.round((n.v/10)*100)+"%",height:"100%",background:n.c,borderRadius:3,opacity:n.hi?1:0.7}}/></div>
                </div>
              ))}
              <div style={{marginTop:10,fontSize:10,color:"#334155"}}>{fuenteBK>0?("Basado en "+fuenteBK+" jugadores reales de "+div):"Datos referenciales Nivel "+nv}</div>
            </div>
            <div>
              <div style={{fontSize:11,color:"#4a6070",marginBottom:8,fontWeight:600,letterSpacing:.5}}>ESCALA PERCENTILES</div>
              {[{r:"P90–100",l:"Élite absoluta",c:"#00a855",min:90},{r:"P75–90",l:"Muy sobre promedio",c:"#3b82f6",min:75},{r:"P50–75",l:"Sobre el promedio",c:"#00e87a",min:50},{r:"P25–50",l:"En el promedio",c:"#f59e0b",min:25},{r:"P10–25",l:"Bajo el promedio",c:"#f97316",min:10},{r:"P0–10",l:"Bajo nivel estándar",c:"#ef4444",min:0}].map(({r,l,c,min},idx,arr)=>{
                const max=(arr[idx-1]?.min??100);
                const enRango=jugSel&&percentilGlobal!=null&&percentilGlobal>=min&&percentilGlobal<max;
                return(<div key={r} style={{display:"flex",gap:8,alignItems:"center",padding:"7px 10px",marginBottom:4,background:enRango?"rgba(0,232,122,0.06)":"rgba(255,255,255,0.02)",borderRadius:7,border:"1px solid "+(enRango?"rgba(0,232,122,0.25)":"rgba(255,255,255,0.04)")}}>
                  <span style={{fontWeight:700,fontSize:11,color:c,minWidth:65}}>{r}</span>
                  <span style={{fontSize:11,color:"#64748b",flex:1}}>{l}</span>
                  {enRango&&<span style={{fontSize:10,fontWeight:700,background:c+"20",color:c,borderRadius:4,padding:"2px 6px"}}>P{percentilGlobal} ←</span>}
                </div>);
              })}
              {jugSel&&<div style={{marginTop:12,padding:"10px 12px",background:"rgba(0,232,122,0.06)",border:"1px solid rgba(0,232,122,0.2)",borderRadius:8}}>
                <div style={{fontSize:10,color:"#4a6070",marginBottom:4}}>ESTIMACIÓN GLOBAL</div>
                <div style={{fontSize:17,fontWeight:800,color:"#00e87a"}}>{jugSel.n.split(" ")[0]} → P{percentilGlobal}/100</div>
                <div style={{fontSize:11,color:"#4a6070",marginTop:2}}>vs {posAC(pos)} en {div}</div>
              </div>}
            </div>
          </div>
        </div>
      )}

      {/* TAB: EQUIPOS */}
      {tab2==="clubes"&&(
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:14,marginBottom:12}}>
          <div style={{fontWeight:700,color:"#eef2f6",fontSize:13,marginBottom:10}}>🏟️ {div} — {pais} <span style={{color:"#4a6070",fontWeight:400,fontSize:11,marginLeft:6}}>{clubes.length} equipos</span></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:7}}>
            {clubes.map(cc=>(
              <div key={cc} onClick={()=>{setEquipo(equipo===cc?"__todos__":cc);setJugSel(null);setBusq("");}}
                style={{display:"flex",alignItems:"center",gap:8,background:equipo===cc?"rgba(0,232,122,0.1)":"rgba(255,255,255,0.03)",borderRadius:8,padding:"8px 11px",border:"1px solid "+(equipo===cc?"rgba(0,232,122,0.3)":"rgba(255,255,255,0.05)"),cursor:"pointer",transition:"all .15s"}}
                onMouseEnter={e=>{if(equipo!==cc)e.currentTarget.style.background="rgba(0,232,122,0.05)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=equipo===cc?"rgba(0,232,122,0.1)":"rgba(255,255,255,0.03)";}}>
                <span style={{color:nC[nv],fontSize:9,fontWeight:800}}>●</span>
                <span style={{color:equipo===cc?"#00e87a":"#94a3b8",fontSize:12,flex:1}}>{cc}</span>
                {equipo===cc&&<span style={{color:"#00e87a",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
            ))}
          </div>
          <div style={{marginTop:10,padding:"7px 10px",background:"rgba(255,255,255,0.02)",borderRadius:7,fontSize:10,color:"#475569"}}>Clic en un equipo para filtrar · Clic de nuevo para quitar el filtro</div>
        </div>
      )}

      {/* ANÁLISIS IA */}
      {jugSel&&(
        <div style={{marginTop:4}}>
          {!iaText?(
            <button onClick={generarIA} disabled={loadIA} style={{width:"100%",border:"none",borderRadius:10,padding:"12px",color:"#fff",fontWeight:700,cursor:loadIA?"wait":"pointer",fontSize:13,background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:loadIA?0.7:1,transition:"opacity .2s"}}>
              {loadIA?<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:"spin 1s linear infinite"}}><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analizando benchmark...</>:"🤖 Análisis IA del Benchmark — "+jugSel.n}
              <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
            </button>
          ):(
            <div style={{background:"rgba(139,92,246,0.07)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:11,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{color:"#eef2f6",fontWeight:700,fontSize:13}}>🤖 Análisis IA — Benchmark {jugSel.n}</span>
                <div style={{display:"flex",gap:7}}>
                  <span style={{background:"rgba(139,92,246,0.2)",color:"#8b5cf6",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}}>FichaScout PRO</span>
                  <button onClick={()=>setIaText("")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"3px 10px",color:"#64748b",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↻ Regenerar</button>
                </div>
              </div>
              <div style={{color:"#c4b5fd",lineHeight:1.9,fontSize:12.5,whiteSpace:"pre-wrap",fontFamily:"system-ui,sans-serif"}}>{iaText}</div>
            </div>
          )}
        </div>
      )}

      {jugSel&&(<div style={{marginTop:8}}><button onClick={()=>exportBenchmarkPDF(jugSel,metricasFilled,sobrePromedio,percentilGlobal,fuenteBK,pais,div,nv,iaText)} style={{width:"100%",border:"1px solid rgba(99,102,241,0.35)",borderRadius:10,padding:"11px",color:"#818cf8",fontWeight:700,cursor:"pointer",fontSize:13,background:"rgba(99,102,241,0.07)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>📄 Descargar PDF del Benchmark</button></div>)}
    </div>
  );
}



// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard", icon:"🏠", label:"Dashboard",          roles:["scout","tecnico","club"]},
  {id:"ligas",     icon:"🏆", label:"Ligas",               roles:["scout","tecnico","club"]},
  {id:"scouting",  icon:"🎬", label:"Scouting",            roles:["scout","tecnico","club"]},
  {id:"plantilla", icon:"👥", label:"Plantilla",           roles:["tecnico","club"]},
  {id:"talentos",  icon:"🔍", label:"Talentos",            roles:["scout","club"]},
  {id:"pipeline",  icon:"📋", label:"Pipeline Fichajes",   roles:["club","scout"]},
  {id:"basepro",   icon:"🌍", label:"Base Pro Mundial",    roles:["scout","tecnico","club"], badge:"60K"},
  {id:"comparador",icon:"⚖️", label:"Comparar Jugadores",  roles:["scout","tecnico","club"], badge:"PRO"},
  {id:"rival",     icon:"⚔️", label:"Análisis Rival",      roles:["tecnico","club","scout"]},
  {id:"tactico",   icon:"🗺️", label:"Análisis Táctico",    roles:["tecnico","club","scout"]},
  {id:"videoanalysis",icon:"🎬", label:"Análisis Video",       roles:["scout","club","tecnico"]},
  {id:"benchmarks",icon:"📊", label:"Benchmarks SA",       roles:["scout","tecnico","club"]},
  {id:"radaroculto",icon:"📡", label:"Radar Oculto",        roles:["scout","tecnico","club"]},
  {id:"buscarreemplazo",icon:"🔁", label:"Buscar Reemplazo",    roles:["scout","tecnico","club"]},
];

export default function FichaScoutApp() {
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
        <div style={{fontWeight:800,color:"#eef2f6",fontSize:32,letterSpacing:"-1px",marginBottom:6}}>FichaScout</div>
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
          {!collapsed && <div><div style={{fontWeight:800,fontSize:13,color:"#eef2f6",whiteSpace:"nowrap"}}>FichaScout</div><div style={{fontSize:9,color:"#4a6070",whiteSpace:"nowrap"}}>{roleData?.icon} {roleData?.label}</div></div>}
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"10px 6px",overflowY:"auto"}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} title={n.label} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:collapsed?"10px":"9px 10px",borderRadius:9,border:"none",background:tab===n.id?"rgba(0,232,122,0.1)":"transparent",cursor:"pointer",marginBottom:2,fontFamily:"inherit",textAlign:"left"}} onMouseEnter={e=>{if(tab!==n.id)e.currentTarget.style.background="rgba(255,255,255,0.04)";}} onMouseLeave={e=>{if(tab!==n.id)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:17,flexShrink:0,lineHeight:1,minWidth:20,textAlign:"center"}}>{n.icon}</span>
              {!collapsed && <span style={{color:tab===n.id?"#00e87a":"#607080",fontSize:12,fontWeight:tab===n.id?600:400,whiteSpace:"nowrap",flex:1}}>{n.label}</span>}
              {!collapsed && n.badge && <span style={{background:n.badge==="60K"?"rgba(0,232,122,0.2)":"linear-gradient(135deg,#00e87a,#00c96a)",color:n.badge==="60K"?"#00e87a":"#000",fontSize:8,fontWeight:800,borderRadius:4,padding:"1px 5px",letterSpacing:.3}}>{n.badge}</span>}
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
          {tab==="basepro"    && <BasePro/>}
          {tab==="tactico"    && <ModTactico   data={data}/>}
          {tab==="benchmarks" && <ModBenchmarks/>}
          {tab==="videoanalysis" && <ModVideoAnalysis/>}
     {tab==="radaroculto" && <RadarOculto datos={data} />}
     {tab==="buscarreemplazo" && <BuscarReemplazo datos={data} />}
        </div>
      </div>
    </div>
  );
}

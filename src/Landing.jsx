import { useState, useEffect } from "react";

const G = "#00e87a";
const D = "#040a0f";
const D2 = "#06101a";

export default function Landing({ onLogin }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Btn = ({ children, onClick, outline, style = {} }) => (
    <button onClick={onClick} style={{
      border: outline ? "1px solid rgba(255,255,255,0.12)" : "none",
      borderRadius: 10, padding: "14px 32px",
      color: outline ? "#eef2f6" : "#000",
      fontWeight: 700, cursor: "pointer", fontSize: 15,
      background: outline ? "transparent" : `linear-gradient(135deg,${G},#00c96a)`,
      fontFamily: "'Syne',system-ui,sans-serif",
      display: "inline-flex", alignItems: "center", gap: 8,
      transition: "all .22s", ...style
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; if (!outline) e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,232,122,.25)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      {children}
    </button>
  );

  const SectionTag = ({ children }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: G, fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16 }}>
      <span style={{ width: 22, height: 2, background: G, display: "block" }} />
      {children}
    </div>
  );

  const BigTitle = ({ children, style = {} }) => (
    <h2 style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(40px,5.5vw,70px)", lineHeight: 1, letterSpacing: 2, color: "#fff", marginBottom: 14, ...style }}>
      {children}
    </h2>
  );

  const features = [
    { n: "01", icon: "⚖️", color: G, title: "Comparador Scout Mundial", desc: "Compara hasta 4 jugadores del mismo puesto de cualquier liga del mundo. Radar chart en 7 dimensiones y PDF profesional." },
    { n: "02", icon: "🎬", color: "#3b82f6", title: "Scouting en Video", desc: "Analice partidos de YouTube en tiempo real. Nota ajustada por dificultad del partido — de amistoso ×0.65 a final ×2.5." },
    { n: "03", icon: "⚔️", color: "#f59e0b", title: "Análisis Táctico IA", desc: "255 clubes reales sudamericanos. La IA detecta debilidades del rival y genera la estrategia completa para ganar." },
    { n: "04", icon: "📋", color: "#8b5cf6", title: "Pipeline Kanban", desc: "Gestione fichajes en 5 etapas: Radar → Observando → Destacado → Negociando → Fichado." },
    { n: "05", icon: "📄", color: "#ec4899", title: "Informes PDF", desc: "PDF con foto del jugador, radar chart, historial y análisis IA listo para enviar a cualquier club." },
    { n: "06", icon: "📊", color: "#10b981", title: "Benchmarks por Liga", desc: "Compare con promedios reales de 80+ competiciones. Temporada 2024 actualizada.", big: true },
  ];

  const steps = [
    ["1", "Crea tu liga", "Registra equipos y plantilla con un par de clics."],
    ["2", "Analiza en vivo", "Ve el partido y registra eventos en tiempo real."],
    ["3", "Compara con pros", "10.000+ jugadores de 80 ligas del mundo."],
    ["4", "Genera el PDF", "Informe profesional con foto, radar e IA."],
  ];

  const plans = [
    { name: "Ojeador", price: "0", period: "Para siempre", feats: ["1 liga · 2 equipos", "Scouting básico", "5 informes IA/mes"], no: ["PDF export", "Comparador Mundial"], outline: true },
    { name: "Club / Técnico", price: "19", period: "USD / mes", best: true, feats: ["Ligas ilimitadas", "10.000+ jugadores", "Comparador Mundial PRO", "PDF profesional", "Análisis rival IA", "Pipeline fichajes"], outline: false },
    { name: "Director Club", price: "49", period: "USD / mes", feats: ["Todo del plan Club", "10 usuarios", "Multi-equipo", "Rankings internos", "Soporte prioritario"], outline: true },
  ];

  const clubs = ["Colo Colo", "River Plate", "Flamengo", "Atlético Nacional", "Peñarol", "Alianza Lima", "Barcelona SC", "Bolívar", "Olimpia", "MLS", "Liga MX", "U. de Chile", "Boca Juniors", "Palmeiras", "Junior FC", "+ 240 clubes"];

  return (
    <div style={{ fontFamily: "'DM Sans','DM Sans',system-ui,sans-serif", background: D, color: "#eef2f6", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 68,
        padding: "0 6%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(4,10,15,0.95)" : "rgba(4,10,15,0.7)",
        backdropFilter: "blur(20px)", borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "all .3s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: G, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚽</div>
          <div style={{ fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 800, fontSize: 17 }}>
            Ficha<span style={{ color: G }}>Scout</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["funciones", "comparador", "precios"].map(s => (
            <a key={s} href={`#${s}`} style={{ color: "#4a6070", textDecoration: "none", fontSize: 14, fontWeight: 500, textTransform: "capitalize", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = "#eef2f6"}
              onMouseLeave={e => e.target.style.color = "#4a6070"}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>
        <Btn onClick={onLogin} style={{ padding: "8px 18px", fontSize: 13 }}>Iniciar sesión →</Btn>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 80, paddingTop: 68, overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1100, height: 520, background: "radial-gradient(ellipse at 50% 0%,rgba(0,232,122,0.11) 0%,transparent 65%)", pointerEvents: "none" }} />
        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,232,122,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 100% 80% at 50% 100%,black 0%,transparent 100%)" }} />
        {/* Field SVG */}
        <svg style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "min(1000px,110%)", opacity: 0.07, pointerEvents: "none" }} viewBox="0 0 900 420" fill="none">
          <rect x="2" y="2" width="896" height="416" stroke="white" strokeWidth="2"/>
          <line x1="450" y1="2" x2="450" y2="418" stroke="white" strokeWidth="1.5"/>
          <circle cx="450" cy="210" r="80" stroke="white" strokeWidth="1.5"/>
          <rect x="2" y="135" width="120" height="150" stroke="white" strokeWidth="1.5"/>
          <rect x="778" y="135" width="120" height="150" stroke="white" strokeWidth="1.5"/>
          <rect x="2" y="165" width="50" height="90" stroke="white" strokeWidth="1.5"/>
          <rect x="848" y="165" width="50" height="90" stroke="white" strokeWidth="1.5"/>
          <circle cx="450" cy="210" r="4" fill="white"/>
          <path d="M 122 135 Q 200 210 122 285" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M 778 135 Q 700 210 778 285" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: `linear-gradient(to bottom,transparent,${D})` }} />

        <div style={{ position: "relative", zIndex: 1, padding: "0 6%", maxWidth: 1260, margin: "0 auto", width: "100%" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,232,122,0.08)", border: "1px solid rgba(0,232,122,0.18)", borderRadius: 100, padding: "5px 16px", fontSize: 12, fontWeight: 600, color: G, letterSpacing: 0.5, marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: G, display: "block", animation: "blink 2s infinite" }} />
            La plataforma de scouting más avanzada de Latinoamérica
            <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}} @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
          </div>

          {/* H1 */}
          <h1 style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(70px,12vw,150px)", lineHeight: 0.93, letterSpacing: 2, color: "#fff", marginBottom: 24 }}>
            DESCUBRE<br/>
            <span style={{ color: G }}>EL TALENTO</span><br/>
            <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.18)", color: "transparent" }}>INVISIBLE</span>
          </h1>

          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#4a6070", maxWidth: 540, lineHeight: 1.7, marginBottom: 36, fontWeight: 300 }}>
            Analiza jugadores amateur, compáralos con profesionales de las mejores ligas del mundo y genera informes de scouting con Inteligencia Artificial.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
            <Btn onClick={onLogin} style={{ padding: "15px 34px", fontSize: 15 }}>Comenzar gratis →</Btn>
            <Btn outline onClick={() => document.getElementById("funciones")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 30px", fontSize: 14 }}>Ver funciones ↓</Btn>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, overflow: "hidden", maxWidth: 660 }}>
            {[["10K+", "Jugadores pro"], ["80+", "Ligas activas"], ["10", "Países SA"], ["IA", "Análisis scout"]].map(([v, l], i) => (
              <div key={i} style={{ flex: 1, padding: "16px 18px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 32, color: G, lineHeight: 1, marginBottom: 3 }}>{v}</div>
                <div style={{ fontSize: 10, color: "#4a6070", letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: "rgba(0,232,122,0.06)", borderTop: "1px solid rgba(0,232,122,0.1)", borderBottom: "1px solid rgba(0,232,122,0.1)", padding: "12px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: 52, animation: "mq 35s linear infinite" }}>
          {["Chile 1ª División", "Liga Profesional Argentina", "Brasileirão Serie A", "Premier League", "La Liga España", "Copa Libertadores", "Serie A Italia", "Bundesliga", "MLS", "Liga MX", "Ligue 1", "Saudi Pro League",
            "Chile 1ª División", "Liga Profesional Argentina", "Brasileirão Serie A", "Premier League", "La Liga España", "Copa Libertadores", "Serie A Italia", "Bundesliga", "MLS", "Liga MX", "Ligue 1", "Saudi Pro League"
          ].map((l, i) => (
            <div key={i} style={{ fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 700, fontSize: 12, color: G, letterSpacing: 2, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: G, display: "block" }} />{l}
            </div>
          ))}
        </div>
      </div>

      {/* ── FUNCIONES ── */}
      <section id="funciones" style={{ padding: "90px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <SectionTag>Funcionalidades</SectionTag>
          <BigTitle>TODO LO QUE UN<br/><span style={{ color: G }}>SCOUT NECESITA</span></BigTitle>
          <p style={{ fontSize: 17, color: "#4a6070", maxWidth: 520, lineHeight: 1.7, marginBottom: 44, fontWeight: 300 }}>
            Desde la anotación en cancha hasta el informe para el director técnico.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: D2, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 17, padding: 26,
                position: "relative", overflow: "hidden", transition: "all .25s",
                gridColumn: f.big ? "span 2" : "span 1"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,232,122,0.2)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ position: "absolute", top: 16, right: 18, fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>{f.n}</div>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: `${f.color}12`, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 7, color: "#eef2f6" }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#4a6070", lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section style={{ padding: "90px 6%", background: D2 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <SectionTag>Proceso</SectionTag>
          <BigTitle>DEL PARTIDO AL<br/><span style={{ color: G }}>INFORME PROFESIONAL</span></BigTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 44, position: "relative" }}>
            <div style={{ position: "absolute", top: 32, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,232,122,0.2) 25%,rgba(0,232,122,0.2) 75%,transparent)" }} />
            {steps.map(([n, t, d]) => (
              <div key={n} style={{ padding: "0 22px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: D, border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,232,122,0.35)"; e.currentTarget.style.boxShadow = "0 0 18px rgba(0,232,122,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: G }}>{n}</span>
                </div>
                <div style={{ fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 7, color: "#eef2f6" }}>{t}</div>
                <div style={{ fontSize: 13, color: "#4a6070", lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARADOR DEMO ── */}
      <section id="comparador" style={{ padding: "90px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <SectionTag>Comparador Mundial</SectionTag>
          <BigTitle>CUALQUIER LIGA.<br/><span style={{ color: G }}>UN SOLO ANÁLISIS.</span></BigTitle>
          <p style={{ fontSize: 16, color: "#4a6070", maxWidth: 520, lineHeight: 1.7, marginBottom: 40, fontWeight: 300 }}>
            Compare jugadores de la Primera División chilena con figuras de la Premier League o la Copa Libertadores.
          </p>
          {/* Demo visual */}
          <div style={{ background: D2, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["#ff5f57", "#ffbd2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <span style={{ fontSize: 12, color: "#4a6070", marginLeft: 8 }}>fichascout.com / comparador</span>
            </div>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 22 }}>
              {[
                { c: G, label: "JUGADOR 1 — LOCAL", name: "M. Rodríguez", club: "Colo Colo · Primera División Chile · 24a", stats: [["Goles", 7, 47], ["Asistencias", 4, 33], ["Rating", 7.8, 78], ["Pases clave", 28, 47], ["Regates", 42, 53]] },
                { c: "#3b82f6", label: "JUGADOR 2 — PRO INTERNACIONAL", name: "L. García", club: "Atlético Nacional · Copa Libertadores · 27a", stats: [["Goles", 12, 80], ["Asistencias", 7, 58], ["Rating", 8.9, 89], ["Pases clave", 43, 72], ["Regates", 61, 76]] }
              ].map((p, pi) => (
                <div key={pi} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: p.c, letterSpacing: 1, marginBottom: 4 }}>{p.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: `${p.c}15`, border: `2px solid ${p.c}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎯</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 800, fontSize: 14, color: "#eef2f6" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#4a6070", marginTop: 1 }}>{p.club}</div>
                    </div>
                  </div>
                  {p.stats.map(([l, v, pct]) => (
                    <div key={l} style={{ display: "grid", gridTemplateColumns: "86px 1fr 34px", gap: 8, alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: "#4a6070" }}>{l}</div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: p.c, borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: p.c, textAlign: "right" }}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div style={{ padding: "13px 22px", background: "rgba(139,92,246,0.05)", borderTop: "1px solid rgba(139,92,246,0.12)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ background: "rgba(139,92,246,0.18)", color: "#8b5cf6", padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>🤖 IA Scout</span>
              <span style={{ fontSize: 13, color: "#64748b" }}>M. Rodríguez tiene el 87% del rendimiento de L. García. Brecha principal: pases clave y rating bajo presión.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLUBES ── */}
      <div style={{ background: D, textAlign: "center", padding: "48px 6%" }}>
        <div style={{ fontSize: 11, color: "#4a6070", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 26 }}>Datos reales de estas ligas y más de 70 competencias activas</div>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          {clubs.map(c => (
            <span key={c} style={{ padding: "10px 18px", fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 700, fontSize: 12, color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, margin: "4px", display: "inline-block", cursor: "default", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = G; e.currentTarget.style.borderColor = "rgba(0,232,122,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── PRECIOS ── */}
      <section id="precios" style={{ padding: "90px 6%", background: `linear-gradient(180deg,${D2} 0%,${D} 100%)` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <SectionTag>Precios</SectionTag>
          <BigTitle>PLANES PARA<br/><span style={{ color: G }}>CADA NECESIDAD</span></BigTitle>
          <p style={{ fontSize: 16, color: "#4a6070", marginBottom: 44, fontWeight: 300 }}>Sin tarjeta de crédito. Comienza gratis hoy.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, textAlign: "left" }}>
            {plans.map((p, i) => (
              <div key={i} style={{
                background: p.best ? "linear-gradient(160deg,#071e14,#040a0f)" : D,
                border: p.best ? "1px solid rgba(0,232,122,0.28)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 19, padding: 28,
                boxShadow: p.best ? "0 0 0 1px rgba(0,232,122,0.07),0 20px 52px rgba(0,232,122,0.07)" : "none",
                transition: "transform .2s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: p.best ? G : "#4a6070", display: "block", marginBottom: 12 }}>{p.name}</span>
                  {p.best && <span style={{ background: "rgba(0,232,122,0.12)", color: G, fontSize: 10, padding: "2px 9px", borderRadius: 100, fontWeight: 700 }}>Popular</span>}
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 50, lineHeight: 1, color: p.best ? G : "#fff", marginBottom: 4 }}>
                  <sup style={{ fontSize: 22, verticalAlign: "top", marginTop: 10 }}>$</sup>{p.price}
                </div>
                <div style={{ fontSize: 13, color: "#4a6070", marginBottom: 20 }}>{p.period}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {p.feats.map(f => <li key={f} style={{ fontSize: 13, color: "#4a6070", display: "flex", alignItems: "center", gap: 9 }}><span style={{ color: G, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}</li>)}
                  {(p.no || []).map(f => <li key={f} style={{ fontSize: 13, color: "#4a6070", opacity: 0.3, display: "flex", alignItems: "center", gap: 9 }}><span style={{ fontWeight: 700, flexShrink: 0 }}>—</span>{f}</li>)}
                </ul>
                <button onClick={p.best ? onLogin : undefined} style={{
                  width: "100%", padding: 12, borderRadius: 10, border: p.best ? "none" : "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  background: p.best ? `linear-gradient(135deg,${G},#00c96a)` : "transparent", color: p.best ? "#000" : "#eef2f6",
                  transition: "all .2s"
                }}
                  onMouseEnter={e => { if (p.best) { e.currentTarget.style.background = "linear-gradient(135deg,#1af080,#00e070)"; } }}
                  onMouseLeave={e => { if (p.best) { e.currentTarget.style.background = `linear-gradient(135deg,${G},#00c96a)`; } }}>
                  {p.best ? "Comenzar ahora →" : p.name === "Director Club" ? "Contactar ventas" : "Comenzar gratis"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "110px 6%", background: D, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse at center,rgba(0,232,122,0.09) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(50px,9vw,100px)", lineHeight: 1, letterSpacing: 3, marginBottom: 18 }}>
            EL TALENTO<br/><span style={{ color: G }}>MERECE</span> SER<br/>DESCUBIERTO
          </h2>
          <p style={{ fontSize: 17, color: "#4a6070", marginBottom: 40, fontWeight: 300 }}>
            FichaScout — La primera plataforma de scouting profesional<br/>para el fútbol amateur latinoamericano.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={onLogin} style={{ padding: "15px 40px", fontSize: 15 }}>Crear cuenta gratis →</Btn>
            <Btn outline onClick={onLogin} style={{ padding: "14px 32px", fontSize: 14 }}>Iniciar sesión</Btn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#030810", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "44px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: G, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚽</div>
              <div style={{ fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 800, fontSize: 16 }}>Ficha<span style={{ color: G }}>Scout</span></div>
            </div>
            <p style={{ fontSize: 13, color: "#4a6070", lineHeight: 1.7, maxWidth: 230 }}>La plataforma de scouting para descubrir el talento invisible del fútbol amateur latinoamericano.</p>
          </div>
          {[["Plataforma", ["Funciones", "Comparador", "Precios", "API"]], ["Recursos", ["Documentación", "Blog", "Soporte", "Changelog"]], ["Legal", ["Privacidad", "Términos", "Cookies", "Contacto"]]].map(([h, links]) => (
            <div key={h}>
              <h4 style={{ fontFamily: "'Syne',system-ui,sans-serif", fontWeight: 700, fontSize: 12, color: "#eef2f6", letterSpacing: 0.5, marginBottom: 14, textTransform: "uppercase" }}>{h}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ color: "#4a6070", textDecoration: "none", fontSize: 13, transition: "color .2s" }}
                      onMouseEnter={e => e.target.style.color = G}
                      onMouseLeave={e => e.target.style.color = "#4a6070"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1160, margin: "34px auto 0", paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, fontSize: 12, color: "#4a6070" }}>
          <span>© 2025 FichaScout. Todos los derechos reservados.</span>
          <span>Hecho con ❤️ para el fútbol latinoamericano</span>
          <span>fichascout.com</span>
        </div>
      </footer>
    </div>
  );
}

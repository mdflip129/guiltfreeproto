import { useState, useEffect, useMemo, useCallback } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#f4f1eb; }

  /* ── Palette ──
     --parchment:  #f4f1eb
     --navy:       #2b3a52
     --navy-lt:    #3d5170
     --sage:       #7a9e87
     --sage-lt:    #a8c5b0
     --sand:       #c9b99a
     --sand-lt:    #e0d4c0
     --terra:      #b5735a
     --terra-lt:   #d4967e
     --ink:        #1e2d1f  (dark text)
     --mist:       #f8f6f1  (card bg)
  */

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn  { 0%{transform:scale(0.94);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.6} }

  .fade-up  { animation:fadeUp 0.45s ease both }
  .fade-up2 { animation:fadeUp 0.45s 0.09s ease both }
  .pop-in   { animation:popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both }

  .app { min-height:100vh; background:#f4f1eb; font-family:'DM Sans',sans-serif; color:#1e2d1f; }

  /* Nav */
  .nav { display:flex; align-items:center; justify-content:space-between; padding:14px 28px; background:#2b3a52; position:sticky; top:0; z-index:200; }
  .nav-logo { display:flex; align-items:center; gap:10px; }
  .nav-logomark { width:28px; height:28px; border-radius:50%; border:2px solid rgba(200,185,160,0.6); flex-shrink:0; position:relative; }
  .nav-logomark::after { content:''; position:absolute; top:50%; left:50%; width:4px; height:4px; border-radius:50%; background:#c9b99a; transform:translate(-50%,-50%); }
  .nav-wordmark { font-family:'DM Serif Display',serif; font-size:19px; color:#f4f1eb; letter-spacing:-0.3px; }
  .nav-wordmark span { color:#c9b99a; font-style:italic; }
  .nav-right { display:flex; align-items:center; gap:10px; }
  .nav-tag { font-size:11px; color:rgba(200,185,160,0.7); font-style:italic; letter-spacing:0.3px; }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; gap:7px; padding:12px 24px; border-radius:6px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; border:none; transition:all 0.17s ease; white-space:nowrap; }
  .btn-navy { background:#2b3a52; color:#f4f1eb; }
  .btn-navy:hover { background:#3d5170; transform:translateY(-1px); box-shadow:0 4px 16px rgba(43,58,82,0.25); }
  .btn-terra { background:#b5735a; color:#f8f6f1; }
  .btn-terra:hover { background:#a06349; transform:translateY(-1px); }
  .btn-sage { background:#7a9e87; color:#f8f6f1; }
  .btn-sage:hover { background:#6a8e77; transform:translateY(-1px); }
  .btn-ghost { background:transparent; color:#2b3a52; border:1.5px solid #c9b99a; }
  .btn-ghost:hover { border-color:#2b3a52; transform:translateY(-1px); }
  .btn-ghost-lt { background:transparent; color:#f4f1eb; border:1.5px solid rgba(200,185,160,0.35); }
  .btn-ghost-lt:hover { border-color:rgba(200,185,160,0.7); }
  .btn-sm { padding:8px 16px; font-size:13px; }
  .btn-xs { padding:5px 12px; font-size:12px; border-radius:5px; }
  .btn-full { width:100%; justify-content:center; }

  /* Cards */
  .card { background:#f8f6f1; border-radius:14px; border:1px solid #e5ddd0; box-shadow:0 2px 20px rgba(30,45,31,0.055); }
  .cp { padding:28px; }

  /* Form */
  .form-group { margin-bottom:22px; }
  .form-group:last-child { margin-bottom:0; }
  .lbl { display:block; font-size:11px; font-weight:600; letter-spacing:0.7px; text-transform:uppercase; color:#7a8a72; margin-bottom:8px; }
  .inp { width:100%; padding:11px 14px; border:1.5px solid #ddd5c4; border-radius:6px; font-family:'DM Sans',sans-serif; font-size:15px; color:#1e2d1f; background:#f4f1eb; transition:border-color 0.15s,background 0.15s; outline:none; }
  .inp:focus { border-color:#7a9e87; background:#fff; }
  .inp::placeholder { color:#b0a898; }
  .inp-pfx-wrap { position:relative; }
  .inp-pfx { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:15px; color:#7a8a72; pointer-events:none; }
  .inp-pfxd { padding-left:26px; }
  textarea.inp { resize:vertical; min-height:80px; }
  .hint { font-size:12px; color:#8a9882; margin-top:6px; line-height:1.5; }
  .err  { font-size:13px; color:#b5735a; margin-top:10px; }
  .warn { font-size:13px; color:#a07030; margin-top:10px; background:#fdf3e3; border:1px solid #e8c882; border-radius:6px; padding:10px 12px; line-height:1.5; }
  .divider { height:1px; background:#e5ddd0; margin:22px 0; }

  /* Radio */
  .radio-group { display:flex; flex-direction:column; gap:8px; }
  .radio-opt { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; border-radius:8px; border:1.5px solid #ddd5c4; cursor:pointer; transition:all 0.15s; background:#f4f1eb; }
  .radio-opt:hover { border-color:#7a9e87; }
  .radio-opt.sel { border-color:#7a9e87; background:#eef4f0; }
  .radio-opt input { margin-top:2px; accent-color:#7a9e87; flex-shrink:0; }
  .ro-lbl { font-size:14px; font-weight:500; color:#1e2d1f; }
  .ro-sub { font-size:12px; color:#7a8a72; margin-top:2px; }

  /* Toggle */
  .toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .toggle-btn { width:46px; height:26px; border-radius:100px; background:#ddd5c4; border:none; cursor:pointer; position:relative; transition:background 0.2s; flex-shrink:0; }
  .toggle-btn.on { background:#7a9e87; }
  .toggle-btn::after { content:''; position:absolute; top:4px; left:4px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.15); }
  .toggle-btn.on::after { transform:translateX(20px); }

  /* Progress */
  .prog-track { height:8px; background:#e5ddd0; border-radius:100px; position:relative; overflow:visible; }
  .prog-fill { height:100%; border-radius:100px; background:linear-gradient(90deg,#b5735a,#c9b99a); transition:width 0.9s cubic-bezier(0.34,1.1,0.64,1); position:relative; }
  .prog-fill::after { content:''; position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:18px; height:18px; border-radius:50%; background:#c9b99a; border:3px solid #f8f6f1; box-shadow:0 2px 8px rgba(181,115,90,0.35); }
  .prog-marker { position:absolute; top:-22px; transform:translateX(-50%); font-size:10px; font-weight:700; letter-spacing:0.3px; white-space:nowrap; color:#7a8a72; }
  .prog-line { position:absolute; top:-8px; bottom:-8px; width:1.5px; background:#c9b99a; }

  /* Chips */
  .chip { display:inline-block; padding:3px 10px; border-radius:100px; font-size:12px; font-weight:600; }
  .chip-sage   { background:#deeee3; color:#3d6b4a; }
  .chip-terra  { background:#f5e6e0; color:#8b3d25; }
  .chip-sand   { background:#f5eedf; color:#7a5a30; }
  .chip-navy   { background:#dce4f0; color:#2b3a52; }
  .chip-muted  { background:#ede8df; color:#5a5048; }

  /* Wizard steps */
  .steps-row { display:flex; align-items:center; margin-bottom:32px; }
  .step-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; border:2px solid #ddd5c4; color:#b0a898; background:#f8f6f1; transition:all 0.25s; flex-shrink:0; }
  .step-dot.active { border-color:#7a9e87; color:#7a9e87; background:#eef4f0; }
  .step-dot.done   { border-color:#7a9e87; background:#7a9e87; color:#fff; }
  .step-line { flex:1; height:2px; background:#ddd5c4; }
  .step-line.done { background:#7a9e87; }

  /* Tier cards */
  .tier-card { border:1.5px solid #e5ddd0; border-radius:10px; padding:16px; background:#f4f1eb; margin-bottom:10px; transition:border-color 0.15s; }
  .tier-card.unlocked { border-color:#a8c5b0; background:#eef4f0; }
  .tc-hd { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .tc-name { font-weight:600; font-size:15px; }
  .tc-desc { font-size:13px; color:#7a8a72; margin-top:3px; }
  .tc-right { text-align:right; flex-shrink:0; }
  .tc-total { font-family:'DM Serif Display',serif; font-size:20px; color:#1e2d1f; }
  .tc-avg-range  { font-size:12px; color:#7a8a72; margin-top:2px; }
  .tc-avg-actual { font-size:12px; color:#b5735a; font-weight:600; margin-top:2px; }
  .tc-togo { font-size:11px; color:#b5735a; font-weight:600; margin-top:4px; }
  .dream-tag { margin-left:6px; font-size:10px; color:#b5735a; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }

  /* Amount input */
  .amt-wrap { position:relative; }
  .amt-sym { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:22px; color:#7a8a72; pointer-events:none; font-family:'DM Serif Display',serif; }
  .amt-inp { width:100%; padding:18px 14px 18px 34px; border:2px solid #ddd5c4; border-radius:8px; font-size:36px; font-family:'DM Serif Display',serif; color:#1e2d1f; background:#f4f1eb; outline:none; transition:border-color 0.15s,background 0.15s; }
  .amt-inp:focus { border-color:#7a9e87; background:#fff; }

  /* Stats */
  .stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
  .stat-box { background:#eee8dc; border-radius:9px; padding:16px 18px; }
  .stat-lbl { font-size:11px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#7a8a72; margin-bottom:5px; }
  .stat-val { font-family:'DM Serif Display',serif; font-size:26px; color:#1e2d1f; }
  .stat-sub { font-size:11px; color:#8a9882; margin-top:3px; }

  /* Contrib rows */
  .contrib-row { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid #ede8df; }
  .contrib-row:last-child { border-bottom:none; }
  .c-name { font-weight:500; font-size:15px; }
  .c-anon { color:#b0a898; font-size:14px; font-style:italic; }
  .c-amt  { font-family:'DM Serif Display',serif; font-size:19px; }

  /* Tabs */
  .tabs { display:flex; background:#ede8df; border-radius:9px; padding:4px; margin-bottom:28px; }
  .tab  { flex:1; padding:10px 4px; border-radius:6px; font-size:13px; font-weight:500; cursor:pointer; border:none; background:transparent; font-family:'DM Sans',sans-serif; color:#7a8a72; transition:all 0.17s; text-align:center; }
  .tab.active { background:#f8f6f1; color:#1e2d1f; box-shadow:0 1px 5px rgba(30,45,31,0.08); }

  /* Success */
  .success-card { background:linear-gradient(135deg,#2b3a52,#3d5170); border-radius:14px; padding:36px; text-align:center; color:#f4f1eb; margin-bottom:20px; }
  .success-card h2 { font-family:'DM Serif Display',serif; font-size:32px; color:#c9b99a; margin-bottom:8px; }

  /* Hero */
  .hero { padding:72px 28px 52px; max-width:600px; margin:0 auto; text-align:center; }
  .eyebrow { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#7a8a72; margin-bottom:14px; }
  .hero h1 { font-family:'DM Serif Display',serif; font-size:clamp(36px,6vw,56px); line-height:1.04; color:#1e2d1f; margin-bottom:16px; }
  .hero h1 em { color:#b5735a; font-style:italic; }
  .hero-sub { font-size:17px; line-height:1.7; color:#4a5a48; margin-bottom:32px; }
  .hero-tagline { font-family:'DM Serif Display',serif; font-size:13px; color:#7a9e87; letter-spacing:1px; margin-bottom:28px; font-style:italic; }
  .hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

  /* Layout */
  .section { max-width:700px; margin:0 auto; padding:0 24px 80px; }
  .sec-hd  { font-family:'DM Serif Display',serif; font-size:26px; margin-bottom:6px; }
  .invite-box { background:#eee8dc; border:1.5px dashed #c9b99a; border-radius:9px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .invite-url { font-size:13px; color:#4a5a48; font-family:monospace; word-break:break-all; }
  .pl-badge { display:inline-flex; align-items:center; background:#eee8dc; border:1px solid #ddd5c4; border-radius:100px; padding:4px 12px; font-size:13px; font-weight:500; color:#4a5a48; gap:6px; }
  .pl-dot { width:6px; height:6px; border-radius:50%; background:#7a9e87; }
  .empty { text-align:center; padding:40px 24px; color:#7a8a72; }
  .empty-icon  { font-size:38px; margin-bottom:12px; }
  .empty-title { font-family:'DM Serif Display',serif; font-size:20px; color:#1e2d1f; margin-bottom:6px; }
  .empty-desc  { font-size:14px; line-height:1.6; }

  /* Phase banner */
  .phase-banner { border-radius:10px; padding:14px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .phase-banner.scheduling { background:#eef4f0; border:1.5px solid #a8c5b0; }
  .phase-banner.pledging   { background:#f5eedf; border:1.5px solid #d4b878; }
  .phase-banner.confirmed  { background:#deeee3; border:1.5px solid #a8c5b0; }

  /* Calendar */
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .cal-day { aspect-ratio:1; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; font-size:14px; font-weight:500; transition:all 0.12s; position:relative; border:2px solid transparent; user-select:none; }
  .cal-day:hover { background:#eee8dc; }
  .cal-day.today { border-color:#2b3a52; font-weight:700; }
  .cal-day.selected { border-color:rgba(122,158,135,0.5); background:rgba(122,158,135,0.15); }
  .cal-dots { display:flex; gap:2px; margin-top:2px; flex-wrap:wrap; justify-content:center; max-width:80%; }
  .cal-dot  { width:5px; height:5px; border-radius:50%; }

  /* Window cards */
  .window-card { padding:14px 16px; border-radius:10px; margin-bottom:10px; cursor:pointer; transition:all 0.15s; border:1.5px solid #e5ddd0; background:#f4f1eb; }
  .window-card:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(30,45,31,0.08); }
  .window-card.full { background:#eef4f0; border-color:#a8c5b0; }
  .window-card.locked { border-color:#b5735a !important; background:#f5e6e0 !important; }

  /* Availability count pill */
  .avail-pill { display:inline-flex; align-items:center; gap:8px; background:#eee8dc; border:1px solid #ddd5c4; border-radius:100px; padding:8px 16px; font-size:13px; color:#4a5a48; margin-bottom:16px; }
  .avail-pill strong { color:#2b3a52; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt      = n  => "$" + Number(n||0).toLocaleString();
const fmtR     = (lo,hi) => `${fmt(lo)}–${fmt(hi)}`;
const pct      = (a,b) => b ? Math.min(100,Math.round((a/b)*100)) : 0;
const uid      = () => Math.random().toString(36).slice(2,8);
const avgRange = (minP,maxP,total) => ({ lo:Math.round(total/Math.max(maxP,1)), hi:Math.round(total/Math.max(minP,1)) });

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const FRIEND_COLORS = ["#b5735a","#2b3a52","#7a9e87","#c9b99a","#8b6a9a","#4a7a8a","#a07030","#6a8a5a"];

function dateKey(y,m,d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate(); }
function getFirstDay(y,m) { return new Date(y,m,1).getDay(); }

function getOverlapWindows(availability, names) {
  if (names.length < 2) return [];
  const allDates = new Set<string>();
  names.forEach(n => { const d=availability[n]; if(d) Object.keys(d).forEach(k=>{ if(d[k]) allDates.add(k); }); });
  const overlaps = [];
  allDates.forEach((d: string) => {
    const count = names.filter(n=>availability[n]?.[d]).length;
    if (count >= 2) overlaps.push({date:d,count});
  });
  overlaps.sort((a,b)=>a.date.localeCompare(b.date));
  const windows=[]; let cur=null;
  overlaps.forEach(o => {
    const d=new Date(o.date+"T00:00:00");
    if (cur && (d.getTime()-cur.end.getTime())===86400000 && o.count===cur.count) { cur.end=d; cur.endStr=o.date; cur.days++; }
    else { if(cur) windows.push(cur); cur={start:d,end:d,startStr:o.date,endStr:o.date,count:o.count,days:1}; }
  });
  if(cur) windows.push(cur);
  return windows.filter(w=>w.days>=2);
}

function formatDateRange(s,e) {
  const sd=new Date(s+"T00:00:00"), ed=new Date(e+"T00:00:00");
  const sm=MONTH_NAMES[sd.getMonth()], em=MONTH_NAMES[ed.getMonth()];
  return sm===em ? `${sm} ${sd.getDate()}–${ed.getDate()}` : `${sm} ${sd.getDate()} – ${em} ${ed.getDate()}`;
}

// ── Demo data ─────────────────────────────────────────────────────────────────
const TODAY = new Date();
const DEMO = {
  id:"demo", name:"Napa Valley Weekend",
  description:"Wine tasting, a great dinner, and hopefully a pool house.",
  deadline:"2025-09-15", minBuyIn:200, topN:2,
  minAttendees:8, maxAttendees:12,
  fallback:"minimum", overage:"tripfund",
  phase:"scheduling",
  lockedDates:null,
  tiers:[
    { id:"t1", label:"Base Camp", description:"2-bed Airbnb, shared rooms",        total:2400 },
    { id:"t2", label:"Comfort",   description:"3-bed Airbnb, everyone has a bed",   total:3600 },
    { id:"t3", label:"Dream",     description:"Private pool house + welcome dinner", total:5200 },
  ],
  pledges:[
    { id:"p1", name:"Marcus T.", amount:600, wantsCredit:true,  availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-17":true,"2025-08-22":true,"2025-08-23":true} },
    { id:"p2", name:"Diana R.",  amount:400, wantsCredit:false, availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
    { id:"p3", name:"Chris L.",  amount:250, wantsCredit:false, availability:{"2025-08-16":true,"2025-08-17":true,"2025-08-22":true,"2025-08-23":true} },
    { id:"p4", name:"Priya K.",  amount:350, wantsCredit:true,  availability:{"2025-08-15":true,"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
  ],
};

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const el=document.createElement("style"); el.id="gf-styles"; el.textContent=CSS;
    if(!document.getElementById("gf-styles")) document.head.appendChild(el);
    return ()=>{ const s=document.getElementById("gf-styles"); if(s) s.remove(); };
  },[]);

  const [screen,  setScreen]  = useState("home");
  const [trip,    setTrip]    = useState(DEMO);
  const [pledger, setPledger] = useState("");
  const go = s => setScreen(s);

  if (screen==="home")      return <Home      onOrganize={()=>go("organizer")} onCreate={()=>go("create")} onPledge={()=>go("pledge")} />;
  if (screen==="create")    return <CreateWizard onDone={t=>{setTrip(t);go("organizer");}} onBack={()=>go("home")} />;
  if (screen==="organizer") return <Organizer trip={trip} setTrip={setTrip} onBack={()=>go("home")} onCreate={()=>go("create")} />;
  if (screen==="pledge")    return <ContribFlow trip={trip} setTrip={setTrip} pledger={pledger} setPledger={setPledger} onBack={()=>go("home")} />;
  return null;
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ right, tagline }: { right?: React.ReactNode, tagline?: boolean }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <div className="nav-logomark"/>
        <div className="nav-wordmark">guilt<span>free</span></div>
        {tagline && <div className="nav-tag">— all we want</div>}
      </div>
      <div className="nav-right">{right}</div>
    </nav>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
function Home({ onOrganize, onCreate, onPledge }) {
  const total = DEMO.pledges.reduce((s,p)=>s+p.amount,0);
  return (
    <div className="app">
      <Nav tagline right={<span className="chip chip-muted">Prototype</span>}/>
      <div className="hero fade-up">
        <div className="eyebrow">Group travel · done right</div>
        <h1>Go.<br/><em>Don't overthink.</em></h1>
        <p className="hero-sub">Chip in what feels right. The rest works itself out.</p>
        <div className="hero-btns">
          <button className="btn btn-navy" onClick={onCreate}>Plan a trip →</button>
          <button className="btn btn-ghost" onClick={onOrganize}>Demo dashboard</button>
          <button className="btn btn-ghost" onClick={onPledge}>Contributor view</button>
        </div>
      </div>
      <div className="section" style={{paddingTop:0}}>
        <div className="card cp fade-up2">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:16}}>
            <div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:21,marginBottom:3}}>Napa Valley Weekend</div>
              <div style={{fontSize:13,color:"#7a8a72"}}>4 in · 8–12 expected · 3 tiers</div>
            </div>
            <span className="chip chip-sage">Collecting dates</span>
          </div>
          <MiniProg tiers={DEMO.tiers} total={total}/>
          <div style={{marginTop:16,fontSize:13,color:"#7a8a72",fontStyle:"italic"}}>Pledging opens once dates are locked.</div>
        </div>
      </div>
    </div>
  );
}

function MiniProg({ tiers, total }) {
  const dream=tiers[tiers.length-1]?.total||1;
  return (
    <div style={{paddingTop:28,paddingBottom:8}}>
      <div className="prog-track">
        {tiers.slice(0,-1).map(t=>{ const p=pct(t.total,dream); return (
          <div key={t.id} style={{position:"absolute",left:`${p}%`,top:0,bottom:0}}>
            <div className="prog-line"/><div className="prog-marker">{t.label}</div>
          </div>
        );})}
        <div className="prog-fill" style={{width:`${pct(total,dream)}%`}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:14,fontSize:13,color:"#7a8a72"}}>
        <span>{fmt(total)} pledged</span><span>Dream: {fmt(dream)}</span>
      </div>
    </div>
  );
}

// ── Shared TierProg ───────────────────────────────────────────────────────────
function TierProg({ trip, total }) {
  const dream=trip.tiers[trip.tiers.length-1]?.total||1;
  const n=trip.pledges.length, minP=trip.minAttendees||1, maxP=trip.maxAttendees||minP;
  const hasActual=n>0, actualAvg=hasActual?Math.round(total/n):null;
  return (
    <div>
      <div style={{paddingTop:30,paddingBottom:8}}>
        <div className="prog-track">
          {trip.tiers.slice(0,-1).map(t=>{ const p=pct(t.total,dream),done=total>=t.total; return (
            <div key={t.id} style={{position:"absolute",left:`${p}%`,top:0,bottom:0}}>
              <div className="prog-line" style={{background:done?"#b5735a":"#c9b99a"}}/>
              <div className="prog-marker" style={{color:done?"#b5735a":"#7a8a72"}}>{t.label}</div>
            </div>
          );})}
          <div className="prog-fill" style={{width:`${pct(total,dream)}%`}}/>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#7a8a72",marginTop:12}}>
        <span>Min: {fmt(trip.minBuyIn)}/person</span>
        <span>{pct(total,dream)}% there</span>
        <span>Dream: {fmt(dream)}</span>
      </div>
      <div style={{marginTop:18}}>
        {trip.tiers.map((t,i)=>{
          const r=avgRange(minP,maxP,t.total), unlocked=total>=t.total;
          return (
            <div key={t.id} className={`tier-card ${unlocked?"unlocked":""}`} style={{marginBottom:8}}>
              <div className="tc-hd">
                <div>
                  <div className="tc-name">{unlocked?"✓ ":""}{t.label}{i===trip.tiers.length-1&&<span className="dream-tag">Dream</span>}</div>
                  <div className="tc-desc">{t.description}</div>
                </div>
                <div className="tc-right">
                  <div className="tc-total">{fmt(t.total)}</div>
                  <div className="tc-avg-range">est. {fmtR(r.lo,r.hi)}/person</div>
                  {hasActual&&<div className="tc-avg-actual">{fmt(actualAvg)} actual avg ({n} in)</div>}
                  {!unlocked&&<div className="tc-togo">{fmt(t.total-total)} to go</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Interactive Calendar ──────────────────────────────────────────────────────
function InteractiveCal({ value, onChange }) {
  const today=new Date();
  const [viewYear,setViewYear]=useState(today.getFullYear());
  const [viewMonth,setViewMonth]=useState(today.getMonth());
  const [isDragging,setIsDragging]=useState(false);
  const [dragVal,setDragVal]=useState(null);
  const daysInMonth=getDaysInMonth(viewYear,viewMonth), firstDay=getFirstDay(viewYear,viewMonth);
  const toggle=useCallback((day,forceVal)=>{ const key=dateKey(viewYear,viewMonth,day); onChange(prev=>{ const n={...prev}; n[key]=forceVal!==undefined?forceVal:!n[key]; return n; }); },[viewYear,viewMonth,onChange]);
  const prev=()=>{ if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); };
  const next=()=>{ if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); };
  return (
    <div onMouseUp={()=>{setIsDragging(false);setDragVal(null);}} onMouseLeave={()=>{setIsDragging(false);setDragVal(null);}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <button className="btn btn-ghost btn-sm" onClick={prev}>‹</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20}}>{MONTH_NAMES[viewMonth]}</div>
          <div style={{fontSize:12,color:"#7a8a72"}}>{viewYear}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={next}>›</button>
      </div>
      <div className="cal-grid" style={{marginBottom:6}}>
        {DAY_LABELS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#b0a898",padding:"4px 0"}}>{d}</div>)}
      </div>
      <div className="cal-grid" style={{userSelect:"none"}}>
        {Array.from({length:firstDay}).map((_,i)=><div key={`p${i}`}/>)}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const day=i+1, key=dateKey(viewYear,viewMonth,day), selected=!!value[key];
          const isToday=day===today.getDate()&&viewMonth===today.getMonth()&&viewYear===today.getFullYear();
          return (
            <div key={day} className={`cal-day ${isToday?"today":""} ${selected?"selected":""}`}
              style={{fontWeight:isToday?700:500}}
              onMouseDown={()=>{ const nv=!selected; setIsDragging(true); setDragVal(nv); toggle(day,nv); }}
              onMouseEnter={()=>{ if(isDragging&&dragVal!==null) toggle(day,dragVal); }}>
              {day}
            </div>
          );
        })}
      </div>
      <p className="hint" style={{marginTop:10}}>Click or drag to mark the days you could make it.</p>
    </div>
  );
}

// ── Read-only overlap calendar ────────────────────────────────────────────────
function MiniCal({ trip }) {
  const today=new Date();
  const [viewYear,setViewYear]=useState(today.getFullYear());
  const [viewMonth,setViewMonth]=useState(today.getMonth());
  const daysInMonth=getDaysInMonth(viewYear,viewMonth), firstDay=getFirstDay(viewYear,viewMonth);
  const names=trip.pledges.map(p=>p.name);
  const getAvail=(day)=>{ const key=dateKey(viewYear,viewMonth,day); return trip.pledges.filter(p=>p.availability?.[key]); };
  const prev=()=>{ if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); };
  const next=()=>{ if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); };
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <button className="btn btn-ghost btn-sm" onClick={prev}>‹</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20}}>{MONTH_NAMES[viewMonth]}</div>
          <div style={{fontSize:12,color:"#7a8a72"}}>{viewYear}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={next}>›</button>
      </div>
      <div className="cal-grid" style={{marginBottom:6}}>
        {DAY_LABELS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#b0a898",padding:"4px 0"}}>{d}</div>)}
      </div>
      <div className="cal-grid">
        {Array.from({length:firstDay}).map((_,i)=><div key={`p${i}`}/>)}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const day=i+1, key=dateKey(viewYear,viewMonth,day);
          const avail=getAvail(day);
          const isToday=day===today.getDate()&&viewMonth===today.getMonth()&&viewYear===today.getFullYear();
          const isAll=avail.length===names.length&&names.length>1;
          const isLocked=trip.lockedDates&&key>=trip.lockedDates.start&&key<=trip.lockedDates.end;
          return (
            <div key={day} className={`cal-day ${isToday?"today":""}`}
              style={{
                background:isLocked?"rgba(181,115,90,0.12)":isAll?"rgba(122,158,135,0.2)":avail.length>=2?"rgba(201,185,154,0.2)":"transparent",
                borderColor:isLocked?"#b5735a":isAll?"#7a9e87":"transparent",
                cursor:"default",
              }}>
              <span style={{fontWeight:isToday?700:500}}>{day}</span>
              {avail.length>0&&(
                <div className="cal-dots">
                  {avail.slice(0,5).map((p,ci)=><div key={p.name} className="cal-dot" style={{background:FRIEND_COLORS[ci%FRIEND_COLORS.length]}}/>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#7a8a72"}}>
          <div style={{width:12,height:12,borderRadius:3,background:"rgba(122,158,135,0.2)",border:"1px solid #7a9e87"}}/>Everyone free
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#7a8a72"}}>
          <div style={{width:12,height:12,borderRadius:3,background:"rgba(181,115,90,0.12)",border:"1px solid #b5735a"}}/>Locked dates
        </div>
      </div>
    </div>
  );
}

// ── Manual date picker ────────────────────────────────────────────────────────
function DatePicker({ onSelect }) {
  const [start,setStart]=useState(""); const [end,setEnd]=useState(""); const [err,setErr]=useState("");
  const handleSubmit=()=>{
    if(!start||!end){setErr("Please set both a start and end date.");return;}
    if(end<start){setErr("End date must be after start date.");return;}
    onSelect({startStr:start,endStr:end});
  };
  return (
    <div style={{background:"#eee8dc",borderRadius:10,padding:20,marginTop:16}}>
      <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Pick dates manually</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div><label className="lbl">Start date</label><input className="inp" type="date" value={start} onChange={e=>setStart(e.target.value)}/></div>
        <div><label className="lbl">End date</label><input className="inp" type="date" value={end} onChange={e=>setEnd(e.target.value)}/></div>
      </div>
      {err&&<div className="err" style={{marginBottom:8}}>{err}</div>}
      <button className="btn btn-navy btn-sm" onClick={handleSubmit}>Lock these dates →</button>
    </div>
  );
}

// ── Contributor Flow ──────────────────────────────────────────────────────────
function ContribFlow({ trip, setTrip, pledger, setPledger, onBack }) {
  const [phase,setPhase]=useState(pledger?"avail":"identify");
  const [myAvail,setMyAvail]=useState({});
  const [amount,setAmount]=useState("");
  const [wantsCredit,setWC]=useState(null);
  const [err,setErr]=useState("");
  const [pledgeWarn,setPledgeWarn]=useState("");

  const total   = trip.pledges.reduce((s,p)=>s+p.amount,0);
  const dream   = trip.tiers[trip.tiers.length-1]?.total||1;
  const n       = trip.pledges.length;
  const existing= trip.pledges.find(p=>p.name===pledger);
  const isReturn= !!existing;
  const dreamR  = avgRange(trip.minAttendees||1,trip.maxAttendees||1,dream);
  const selectedDays=Object.values(myAvail).filter(Boolean).length;
  const respondedCount=trip.pledges.filter(p=>Object.keys(p.availability||{}).length>0).length;

  const handleIdentify=()=>{
    if(!pledger.trim()){setErr("Please enter your name.");return;}
    setErr(""); setPhase("avail");
    if(existing){ setMyAvail(existing.availability||{}); setAmount(existing.amount?(existing.amount.toString()):""); }
  };

  const handleAvailSubmit=()=>{
    if(selectedDays===0){setErr("Mark at least one day you could make it.");return;}
    setErr(""); setPhase("pledge");
  };

  const handlePledgeChange=(val)=>{
    setAmount(val);
    if(isReturn&&existing.amount&&Number(val)<existing.amount&&Number(val)>0){
      setPledgeWarn(`You're reducing from ${fmt(existing.amount)}. That's totally fine — just making sure it's intentional.`);
    } else { setPledgeWarn(""); }
  };

  const handlePledge=()=>{
    const val=parseInt(amount)||0;
    if(trip.phase==="pledging"){
      if(val<trip.minBuyIn){setErr(`The minimum is ${fmt(trip.minBuyIn)}. You've got this.`);return;}
      if(trip.topN>0&&wantsCredit===null){setErr("One quick question before we lock it in.");return;}
    }
    setErr(""); setPhase("confirm");
  };

  const handleConfirm=()=>{
    const val=trip.phase==="pledging"?(parseInt(amount)||0):(existing?.amount||0);
    setTrip(t=>{
      const ex=t.pledges.find(p=>p.name===pledger);
      const newP={ id:ex?.id||"p_"+uid(), name:pledger, amount:val, wantsCredit:wantsCredit??false, availability:myAvail };
      if(ex) return{...t,pledges:t.pledges.map(p=>p.name===pledger?newP:p)};
      return{...t,pledges:[...t.pledges,newP]};
    });
    setPhase("done");
  };

  const val=parseInt(amount)||0;
  const projTotal=total+val-(existing?.amount||0);
  const projPct=pct(projTotal,dream);

  return (
    <div className="app">
      <Nav right={<button className="btn btn-ghost-lt btn-sm" onClick={onBack}>← Home</button>}/>
      <div className="section" style={{paddingTop:36,maxWidth:520}}>

        {/* Header */}
        <div className="fade-up" style={{marginBottom:20}}>
          <div className="eyebrow">You're invited</div>
          <div className="sec-hd">{trip.name}</div>
          {trip.description&&<div style={{fontSize:15,color:"#4a5a48",marginBottom:14,lineHeight:1.7}}>{trip.description}</div>}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <span className="pl-badge"><span className="pl-dot"/>Min {fmt(trip.minBuyIn)}/person</span>
            <span className="pl-badge"><span className="pl-dot"/>{trip.minAttendees}–{trip.maxAttendees} expected</span>
            {trip.deadline&&<span className="pl-badge"><span className="pl-dot"/>Deadline {trip.deadline}</span>}
          </div>
        </div>

        {/* Phase banner */}
        <div className={`phase-banner ${trip.phase} fade-up2`}>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>
              {trip.phase==="scheduling"?"📅 First, let's find dates that work":trip.phase==="pledging"?"💰 Dates are set — time to commit":"✅ This trip is happening."}
            </div>
            <div style={{fontSize:12,color:"#4a5a48",marginTop:2}}>
              {trip.phase==="scheduling"
                ? `${respondedCount} of ${trip.minAttendees}–${trip.maxAttendees} expected have responded.`
                : trip.lockedDates?`Locked in: ${formatDateRange(trip.lockedDates.start,trip.lockedDates.end)}`:""}
            </div>
          </div>
          <span className={`chip ${trip.phase==="scheduling"?"chip-sage":trip.phase==="pledging"?"chip-sand":"chip-sage"}`}>
            {trip.phase==="scheduling"?"Scheduling":trip.phase==="pledging"?"Pledging open":"Confirmed"}
          </span>
        </div>

        {/* Progress (always visible) */}
        {(phase==="pledge"||phase==="confirm"||phase==="done")&&(
          <div className="card cp fade-up2" style={{marginBottom:20}}>
            <div style={{fontWeight:600,marginBottom:14}}>Where we're at</div>
            <TierProg trip={trip} total={total}/>
          </div>
        )}

        {/* ── Identify ── */}
        {phase==="identify"&&<div className="card cp pop-in">
          <div style={{fontWeight:700,fontSize:17,marginBottom:4}}>Hey — who are you?</div>
          <div style={{fontSize:14,color:"#7a8a72",marginBottom:20,lineHeight:1.6}}>Your name helps the organizer know who's in. What you contribute stays between you and you.</div>
          <div className="form-group">
            <label className="lbl">Your name</label>
            <input className="inp" placeholder="First name works great" value={pledger} onChange={e=>setPledger(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleIdentify()}/>
          </div>
          {err&&<div className="err">{err}</div>}
          <button className="btn btn-navy btn-full" style={{marginTop:8}} onClick={handleIdentify}>Let's go →</button>
        </div>}

        {/* ── Availability ── */}
        {phase==="avail"&&<div className="card cp pop-in">
          <div style={{fontWeight:700,fontSize:17,marginBottom:4}}>When could you make it, {pledger.split(" ")[0]}?</div>
          <div style={{fontSize:14,color:"#7a8a72",marginBottom:20,lineHeight:1.6}}>Mark every day that could work. Nobody sees your individual selections — just the overlap.</div>
          <InteractiveCal value={myAvail} onChange={setMyAvail}/>
          <div style={{marginTop:14,padding:"10px 14px",background:"#eee8dc",borderRadius:8,fontSize:13,color:"#4a5a48"}}>
            {selectedDays===0?"No days selected yet":selectedDays===1?"1 day selected":`${selectedDays} days selected`}
          </div>
          {err&&<div className="err">{err}</div>}
          <button className="btn btn-navy btn-full" style={{marginTop:16}} onClick={handleAvailSubmit}>
            Save and continue →
          </button>
        </div>}

        {/* ── Pledge (scheduling phase — optional) ── */}
        {phase==="pledge"&&trip.phase==="scheduling"&&<div className="card cp pop-in">
          <div style={{fontWeight:700,fontSize:17,marginBottom:4}}>Want to put something in now?</div>
          <div style={{fontSize:14,color:"#7a8a72",marginBottom:20,lineHeight:1.6}}>
            Totally optional at this stage. But if you already know you're in, a pledge helps the group see what's possible — and it builds momentum.
            {isReturn&&existing.amount>0&&<span> You've already put in <strong>{fmt(existing.amount)}</strong>.</span>}
          </div>
          <div className="form-group">
            <label className="lbl">Your pledge <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"#b0a898"}}>(optional for now)</span></label>
            <div className="amt-wrap">
              <span className="amt-sym">$</span>
              <input className="amt-inp" type="number" min={0} placeholder="0" value={amount} onChange={e=>handlePledgeChange(e.target.value)}/>
            </div>
            <p className="hint">Dream tier avg: <strong>{fmtR(dreamR.lo,dreamR.hi)}</strong>/person · held until dates confirm, not charged now</p>
          </div>
          {pledgeWarn&&<div className="warn">{pledgeWarn}</div>}
          <div style={{display:"flex",gap:10,marginTop:20}}>
            <button className="btn btn-ghost" style={{flex:1}} onClick={()=>{ setAmount(""); setPhase("confirm"); }}>Skip for now</button>
            <button className="btn btn-navy" style={{flex:2}} onClick={handlePledge}>Continue →</button>
          </div>
        </div>}

        {/* ── Pledge (pledging phase — required) ── */}
        {phase==="pledge"&&trip.phase==="pledging"&&<div className="card cp pop-in">
          <div style={{fontWeight:700,fontSize:17,marginBottom:4}}>{isReturn?`Update your pledge, ${pledger.split(" ")[0]}`:`Time to commit, ${pledger.split(" ")[0]}.`}</div>
          <div style={{fontSize:14,color:"#7a8a72",marginBottom:20,lineHeight:1.6}}>
            {isReturn?`You're currently at ${fmt(existing.amount)}.`:"This is just between you and the trip. Nobody sees your number but you."}
            {" "}Minimum is {fmt(trip.minBuyIn)}.
          </div>
          {trip.lockedDates&&<div style={{background:"#eee8dc",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#4a5a48",marginBottom:20}}>
            📅 Dates locked: <strong>{formatDateRange(trip.lockedDates.start,trip.lockedDates.end)}</strong>
          </div>}
          <div className="form-group">
            <label className="lbl">Your pledge</label>
            <div className="amt-wrap">
              <span className="amt-sym">$</span>
              <input className="amt-inp" type="number" min={trip.minBuyIn} placeholder="0" value={amount} onChange={e=>handlePledgeChange(e.target.value)}/>
            </div>
            <p className="hint">Dream tier avg: <strong>{fmtR(dreamR.lo,dreamR.hi)}</strong>/person · not charged until the trip confirms</p>
          </div>
          {pledgeWarn&&<div className="warn">{pledgeWarn}</div>}
          {trip.topN>0&&<>
            <div className="divider"/>
            <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>One quick thing.</div>
            <div style={{fontSize:14,color:"#4a5a48",marginBottom:14,lineHeight:1.6}}>If you end up being a top {trip.topN} contributor, do you want people to know who you are?</div>
            <div className="radio-group">
              <label className={`radio-opt ${wantsCredit===true?"sel":""}`}><input type="radio" name="credit" checked={wantsCredit===true} onChange={()=>setWC(true)}/><span className="ro-lbl">Yes — show my name if I make the top {trip.topN}</span></label>
              <label className={`radio-opt ${wantsCredit===false?"sel":""}`}><input type="radio" name="credit" checked={wantsCredit===false} onChange={()=>setWC(false)}/><span className="ro-lbl">No — keep me anonymous either way</span></label>
            </div>
          </>}
          {err&&<div className="err" style={{marginTop:12}}>{err}</div>}
          <button className="btn btn-terra btn-full" style={{marginTop:24}} onClick={handlePledge}>Review →</button>
        </div>}

        {/* ── Confirm ── */}
        {phase==="confirm"&&<div className="card cp pop-in">
          <div style={{fontWeight:700,fontSize:17,marginBottom:20}}>Looking good. Confirm?</div>
          <div style={{display:"grid",gridTemplateColumns:val>0?"1fr 1fr":"1fr",gap:12,marginBottom:20}}>
            <div style={{background:"#eee8dc",borderRadius:10,padding:"18px",textAlign:"center"}}>
              <div style={{fontSize:12,color:"#7a8a72",marginBottom:4}}>Days marked</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36}}>{selectedDays}</div>
            </div>
            {val>0&&<div style={{background:"#eee8dc",borderRadius:10,padding:"18px",textAlign:"center"}}>
              <div style={{fontSize:12,color:"#7a8a72",marginBottom:4}}>Your pledge</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36}}>{fmt(val)}</div>
            </div>}
          </div>
          {val>0&&trip.phase==="pledging"&&<div style={{marginBottom:18}}>
            <div style={{fontSize:13,color:"#7a8a72",marginBottom:8}}>What this does for the group</div>
            <div style={{height:7,background:"#e5ddd0",borderRadius:100,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",borderRadius:100,background:"linear-gradient(90deg,#b5735a,#c9b99a)",width:`${projPct}%`,transition:"width 0.6s ease"}}/>
            </div>
            <div style={{fontSize:13,color:"#4a5a48"}}>Group total would reach <strong>{fmt(projTotal)}</strong> — {projPct}% of the dream</div>
          </div>}
          <div style={{fontSize:13,color:"#7a8a72",padding:"12px 14px",background:"#eee8dc",borderRadius:8,lineHeight:1.7,marginBottom:20}}>
            Nothing is charged until dates are confirmed and the trip locks in.
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setPhase(trip.phase==="scheduling"?"pledge":"pledge")}>← Edit</button>
            <button className="btn btn-navy" style={{flex:2}} onClick={handleConfirm}>
              {trip.phase==="scheduling"?"I'm in ✓":"Lock it in ✓"}
            </button>
          </div>
        </div>}

        {/* ── Done ── */}
        {phase==="done"&&<div className="pop-in">
          <div className="success-card">
            <div style={{fontSize:44,marginBottom:14}}>{trip.phase==="scheduling"?"📅":"🥂"}</div>
            <h2>{trip.phase==="scheduling"?"You're on the list.":"You're in."}</h2>
            <div style={{fontSize:16,color:"rgba(200,185,160,0.85)",lineHeight:1.7}}>
              {trip.phase==="scheduling"
                ? val>0
                  ? `Availability saved. Pledge of ${fmt(val)} is held — nothing moves until dates are confirmed.`
                  : "Availability saved. Check back once dates are locked to enter your pledge."
                : `Pledge of ${fmt(val)} locked. Nothing is charged until the trip confirms. Life is short — this is the good stuff.`}
            </div>
          </div>
          <div className="card cp" style={{marginBottom:16}}>
            <div style={{fontWeight:600,marginBottom:14}}>Group progress</div>
            <TierProg trip={trip} total={trip.pledges.reduce((s,p)=>s+p.amount,0)}/>
          </div>
          {isReturn&&<button className="btn btn-ghost btn-full" onClick={()=>{ setPhase("avail"); }}>Update my response</button>}
        </div>}
      </div>
    </div>
  );
}

// ── Organizer ─────────────────────────────────────────────────────────────────

// ── Demo scenarios ────────────────────────────────────────────────────────────
const DEMO_SCENARIOS = {
  early: {
    phase:"scheduling", lockedDates:null,
    pledges:[
      { id:"d1", name:"Marcus T.", amount:400, wantsCredit:true,  availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-22":true,"2025-08-23":true} },
      { id:"d2", name:"Diana R.",  amount:0,   wantsCredit:false, availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-22":true,"2025-08-23":true} },
      { id:"d3", name:"Chris L.",  amount:0,   wantsCredit:false, availability:{"2025-08-16":true,"2025-08-22":true,"2025-08-23":true} },
    ]
  },
  busy: {
    phase:"scheduling", lockedDates:null,
    pledges:[
      { id:"d1", name:"Marcus T.", amount:600, wantsCredit:true,  availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-17":true,"2025-08-22":true,"2025-08-23":true} },
      { id:"d2", name:"Diana R.",  amount:400, wantsCredit:false, availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d3", name:"Chris L.",  amount:250, wantsCredit:false, availability:{"2025-08-16":true,"2025-08-17":true,"2025-08-22":true,"2025-08-23":true} },
      { id:"d4", name:"Priya K.",  amount:350, wantsCredit:true,  availability:{"2025-08-15":true,"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d5", name:"James W.",  amount:200, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d6", name:"Sofia M.",  amount:0,   wantsCredit:false, availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-22":true,"2025-08-23":true} },
      { id:"d7", name:"Tyler B.",  amount:0,   wantsCredit:true,  availability:{"2025-08-22":true,"2025-08-23":true} },
      { id:"d8", name:"Rachel H.", amount:0,   wantsCredit:false, availability:{"2025-08-15":true,"2025-08-16":true,"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
    ]
  },
  pledging: {
    phase:"pledging", lockedDates:{start:"2025-08-22",end:"2025-08-24"},
    pledges:[
      { id:"d1", name:"Marcus T.", amount:600, wantsCredit:true,  availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d2", name:"Diana R.",  amount:400, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d3", name:"Chris L.",  amount:250, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true} },
      { id:"d4", name:"Priya K.",  amount:350, wantsCredit:true,  availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d5", name:"James W.",  amount:200, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d6", name:"Sofia M.",  amount:0,   wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true} },
      { id:"d7", name:"Tyler B.",  amount:0,   wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d8", name:"Rachel H.", amount:300, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
    ]
  },
  almostThere: {
    phase:"pledging", lockedDates:{start:"2025-08-22",end:"2025-08-24"},
    pledges:[
      { id:"d1", name:"Marcus T.", amount:700, wantsCredit:true,  availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d2", name:"Diana R.",  amount:500, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d3", name:"Chris L.",  amount:300, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true} },
      { id:"d4", name:"Priya K.",  amount:450, wantsCredit:true,  availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d5", name:"James W.",  amount:400, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d6", name:"Sofia M.",  amount:600, wantsCredit:true,  availability:{"2025-08-22":true,"2025-08-23":true} },
      { id:"d7", name:"Tyler B.",  amount:350, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d8", name:"Rachel H.", amount:400, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d9", name:"Cam D.",    amount:500, wantsCredit:true,  availability:{"2025-08-22":true,"2025-08-23":true,"2025-08-24":true} },
      { id:"d10",name:"Nina F.",   amount:200, wantsCredit:false, availability:{"2025-08-22":true,"2025-08-23":true} },
    ]
  },
};

function Organizer({ trip, setTrip, onBack, onCreate }) {
  const [tab,setTab]=useState("scheduling");
  const [showAmts,setShowAmts]=useState(false);
  const [showDatePicker,setShowDatePicker]=useState(false);
  const [lockWarning,setLockWarning]=useState(null);
  const [pendingWindow,setPendingWindow]=useState(null);

  const [showDemo,setShowDemo]=useState(true);

  const loadScenario=(key)=>{
    const s=DEMO_SCENARIOS[key];
    setTrip(t=>({...t,phase:s.phase,lockedDates:s.lockedDates,pledges:s.pledges}));
    setTab(s.phase==="scheduling"?"scheduling":"dashboard");
  };

  const resetTrip=()=>{
    setTrip(t=>({...t,phase:"scheduling",lockedDates:null,pledges:[]}));
    setTab("scheduling");
  };


  const total  = trip.pledges.reduce((s,p)=>s+p.amount,0);
  const n      = trip.pledges.length;
  const avg    = n?Math.round(total/n):0;
  const sorted = [...trip.pledges].sort((a,b)=>b.amount-a.amount);
  const topN   = sorted.slice(0,trip.topN||0);
  const curTier= [...trip.tiers].reverse().find(t=>total>=t.total);
  const nxtTier= trip.tiers.find(t=>total<t.total);
  const names  = trip.pledges.map(p=>p.name);
  const availability = Object.fromEntries(trip.pledges.map(p=>[p.name,p.availability||{}]));
  const overlapWindows = useMemo(()=>getOverlapWindows(availability,names),[availability,names]);
  const respondedCount = trip.pledges.filter(p=>Object.keys(p.availability||{}).length>0).length;

  const initLock=(window)=>{
    // Check who's not available for these dates
    const unavailable = trip.pledges.filter(p=>{
      const days=[];
      const s=new Date(window.startStr+"T00:00:00"), e=new Date(window.endStr+"T00:00:00");
      for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){
        const k=d.toISOString().slice(0,10); if(p.availability?.[k]) return false;
      }
      return p.amount>0;
    });
    if(unavailable.length>0){
      setLockWarning({ window, unavailable });
      setPendingWindow(window);
    } else { confirmLock(window); }
  };

  const confirmLock=(window)=>{
    // Zero out pledges for people not available on locked dates
    setTrip(t=>{
      const updated=t.pledges.map(p=>{
        const s=new Date(window.startStr+"T00:00:00"), e=new Date(window.endStr+"T00:00:00");
        let avail=false;
        for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){
          const k=d.toISOString().slice(0,10); if(p.availability?.[k]){avail=true;break;}
        }
        return avail?p:{...p,amount:0};
      });
      return{...t,phase:"pledging",lockedDates:{start:window.startStr,end:window.endStr},pledges:updated};
    });
    setLockWarning(null); setPendingWindow(null); setTab("dashboard");
  };

  const reopenScheduling=()=>{
    setTrip(t=>({...t,phase:"scheduling",lockedDates:null}));
    setTab("scheduling");
  };

  return (
    <div className="app">
      <Nav right={<><button className="btn btn-terra btn-sm" onClick={onCreate}>+ New trip</button><button className="btn btn-ghost-lt btn-sm" onClick={onBack}>← Home</button></>}/>
      <div className="section" style={{paddingTop:36}}>
        <div className="fade-up">
          <div className="eyebrow">Organizer view</div>
          <div className="sec-hd">{trip.name}</div>
          {trip.description&&<div style={{fontSize:15,color:"#4a5a48",marginBottom:10,lineHeight:1.6}}>{trip.description}</div>}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
            <span className={`chip ${trip.phase==="scheduling"?"chip-sage":trip.phase==="pledging"?"chip-sand":"chip-sage"}`}>
              {trip.phase==="scheduling"?"📅 Collecting dates":trip.phase==="pledging"?"💰 Pledging open":"✅ Confirmed"}
            </span>
            {trip.deadline&&<span className="chip chip-navy">Deadline {trip.deadline}</span>}
            {curTier&&<span className="chip chip-sage">✓ {curTier.label}</span>}
            {trip.lockedDates&&<span className="chip chip-terra">📅 {formatDateRange(trip.lockedDates.start,trip.lockedDates.end)}</span>}
          </div>
        </div>


        {/* ── Demo controls ── */}
        <div style={{marginBottom:24,border:"1.5px dashed #c9b99a",borderRadius:12,overflow:"hidden"}}>
          <button onClick={()=>setShowDemo(v=>!v)} style={{width:"100%",padding:"10px 16px",background:"#eee8dc",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"inherit",fontSize:13,fontWeight:600,color:"#4a5a48"}}>
            <span>🎛️ Demo controls — simulate different stages</span>
            <span>{showDemo?"▲":"▼"}</span>
          </button>
          {showDemo&&<div style={{padding:"16px",background:"#f8f6f1"}}>
            <div style={{fontSize:12,color:"#7a8a72",marginBottom:12,lineHeight:1.5}}>Jump to any stage to see how the app looks. These controls are only visible to you.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <button className="btn btn-ghost btn-sm" style={{fontSize:12,justifyContent:"flex-start"}} onClick={()=>loadScenario("early")}>📅 Early — 3 responses</button>
              <button className="btn btn-ghost btn-sm" style={{fontSize:12,justifyContent:"flex-start"}} onClick={()=>loadScenario("busy")}>📅 Active — 8 responses</button>
              <button className="btn btn-ghost btn-sm" style={{fontSize:12,justifyContent:"flex-start"}} onClick={()=>loadScenario("pledging")}>💰 Pledging open</button>
              <button className="btn btn-ghost btn-sm" style={{fontSize:12,justifyContent:"flex-start"}} onClick={()=>loadScenario("almostThere")}>🎯 Almost funded</button>
            </div>
            <button className="btn btn-ghost btn-sm" style={{fontSize:12,color:"#b5735a",borderColor:"#d4967e"}} onClick={resetTrip}>↺ Reset to empty</button>
          </div>}
        </div>

        <div className="tabs">
          {["scheduling","dashboard","contributors","settings"].map(t=>(
            <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
              {t==="scheduling"?"📅 Dates":t==="dashboard"?"Budget":t==="contributors"?"People":"Settings"}
            </button>
          ))}
        </div>

        {/* ── Scheduling tab ── */}
        {tab==="scheduling"&&<div className="fade-up">

          {/* Lock warning modal */}
          {lockWarning&&<div style={{background:"#f5e6e0",border:"1.5px solid #d4967e",borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>⚠️ Heads up before locking</div>
            <div style={{fontSize:14,color:"#4a2010",lineHeight:1.6,marginBottom:16}}>
              <strong>{lockWarning.unavailable.map(p=>p.name).join(", ")}</strong> {lockWarning.unavailable.length===1?"has":"have"} a pledge but aren't marked as available for {formatDateRange(lockWarning.window.startStr,lockWarning.window.endStr)}. Their pledge{lockWarning.unavailable.length===1?" will":"s will"} be removed if you lock these dates.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>setLockWarning(null)}>Cancel</button>
              <button className="btn btn-terra btn-sm" onClick={()=>confirmLock(pendingWindow)}>Lock anyway →</button>
            </div>
          </div>}

          <div className="card cp" style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontWeight:600,marginBottom:4}}>Availability overview</div>
                <div className="avail-pill"><strong>{respondedCount}</strong> of {trip.minAttendees}–{trip.maxAttendees} expected have responded</div>
              </div>
              {trip.phase==="pledging"&&<button className="btn btn-ghost btn-sm" onClick={reopenScheduling}>Re-open availability</button>}
            </div>
            <MiniCal trip={trip}/>
          </div>

          {trip.phase==="scheduling"&&<div className="card cp" style={{marginBottom:16}}>
            <div style={{fontWeight:600,marginBottom:4}}>✨ Best windows</div>
            <p style={{fontSize:13,color:"#7a8a72",marginBottom:16}}>Consecutive days where 2+ people are free. Click to lock dates and open pledging.</p>
            {overlapWindows.length===0?(
              <div className="empty" style={{padding:"24px 0"}}>
                <div className="empty-icon">📅</div>
                <div className="empty-title">No overlaps yet</div>
                <div className="empty-desc">Need availability from at least 2 people to find windows.</div>
              </div>
            ):(
              overlapWindows.slice(0,6).map((w,i)=>(
                <div key={i} className={`window-card ${w.count===names.length&&names.length>1?"full":""}`} onClick={()=>initLock(w)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                    <div>
                      <div style={{fontSize:15,fontWeight:600,marginBottom:2}}>{formatDateRange(w.startStr,w.endStr)}</div>
                      <div style={{fontSize:12,color:"#7a8a72"}}>{w.days} days · {w.count}/{n} available{w.count===n&&n>1?" 🎉":""}</div>
                    </div>
                    <button className="btn btn-navy btn-sm" onClick={e=>{e.stopPropagation();initLock(w);}}>Lock →</button>
                  </div>
                </div>
              ))
            )}
            <div style={{marginTop:8}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>setShowDatePicker(v=>!v)}>
                {showDatePicker?"Hide manual picker":"Or pick dates manually"}
              </button>
              {showDatePicker&&<DatePicker onSelect={w=>{ initLock(w); setShowDatePicker(false); }}/>}
            </div>
          </div>}

          {trip.phase==="pledging"&&<div style={{background:"#eef4f0",border:"1.5px solid #a8c5b0",borderRadius:10,padding:"16px 18px"}}>
            <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>📅 Dates locked — pledging is open</div>
            <div style={{fontSize:13,color:"#3d6b4a"}}>Locked: <strong>{formatDateRange(trip.lockedDates.start,trip.lockedDates.end)}</strong>. People are now entering pledges.</div>
          </div>}
        </div>}

        {/* ── Budget tab ── */}
        {tab==="dashboard"&&<div className="fade-up">
          <div className="stat-grid">
            <div className="stat-box"><div className="stat-lbl">Total pledged</div><div className="stat-val">{fmt(total)}</div></div>
            <div className="stat-box"><div className="stat-lbl">Responses</div><div className="stat-val">{respondedCount}</div><div className="stat-sub">of {trip.minAttendees}–{trip.maxAttendees} expected</div></div>
            <div className="stat-box"><div className="stat-lbl">Avg pledge</div><div className="stat-val">{fmt(avg)}</div></div>
            <div className="stat-box"><div className="stat-lbl">To next tier</div><div className="stat-val" style={{color:"#b5735a"}}>{nxtTier?fmt(nxtTier.total-total):"—"}</div></div>
          </div>
          <div className="card cp" style={{marginBottom:16}}>
            <div style={{fontWeight:600,marginBottom:18}}>Budget progress</div>
            <TierProg trip={trip} total={total}/>
          </div>
          <div className="card cp" style={{marginBottom:16}}>
            <div style={{fontWeight:600,marginBottom:10}}>Contributor link</div>
            <div className="invite-box">
              <span className="invite-url">guiltfree.app/trip/{trip.name.toLowerCase().replace(/\s+/g,"-")}</span>
              <button className="btn btn-ghost btn-sm">Copy</button>
            </div>
            <p className="hint" style={{marginTop:10}}>One link for everyone. They mark availability first, then pledge once you lock dates.</p>
          </div>
          {trip.topN>0&&topN.length>0&&<div className="card cp">
            <div style={{fontWeight:600,marginBottom:14}}>Top {trip.topN} contributors</div>
            {topN.map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<topN.length-1?"1px solid #ede8df":"none"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:i===0?"#c9b99a":"#ddd5c4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
                <div style={{flex:1}}>{p.wantsCredit?<div className="c-name">{p.name}</div>:<div className="c-anon">Anonymous</div>}</div>
                <div className="c-amt">{fmt(p.amount)}</div>
              </div>
            ))}
          </div>}
        </div>}

        {/* ── People tab ── */}
        {tab==="contributors"&&<div className="fade-up">
          <div className="card cp" style={{marginBottom:16}}>
            <div className="toggle-row">
              <div><div style={{fontWeight:600,marginBottom:2}}>Show individual pledges</div><div style={{fontSize:13,color:"#7a8a72"}}>Off by default — toggle when you need it</div></div>
              <button className={`toggle-btn ${showAmts?"on":""}`} onClick={()=>setShowAmts(v=>!v)}/>
            </div>
          </div>
          <div className="card">
            {trip.pledges.length===0&&<div className="empty"><div className="empty-icon">👥</div><div className="empty-title">Nobody yet</div><div className="empty-desc">Share the link and watch the group come together.</div></div>}
            {trip.pledges.map(p=>{
              const days=Object.values(p.availability||{}).filter(Boolean).length;
              return (
                <div key={p.id} className="contrib-row">
                  <div>
                    <div className="c-name">{p.name}</div>
                    <div style={{fontSize:11,color:"#7a8a72",marginTop:2}}>{days} days marked{p.wantsCredit?" · ✓ leaderboard opt-in":""}</div>
                  </div>
                  <div className="c-amt">{showAmts?fmt(p.amount):<span className="c-anon">private</span>}</div>
                </div>
              );
            })}
          </div>
        </div>}

        {/* ── Settings tab ── */}
        {tab==="settings"&&<div className="fade-up card cp">
          <div style={{fontWeight:600,marginBottom:16}}>Trip rules</div>
          <div className="form-group">
            <label className="lbl">If dream budget isn't hit</label>
            <div className="radio-group">
              {[["minimum","Run on minimum budget","The trip happens at whatever was raised."],["cancel","Cancel & refund","Everyone gets their pledge back."],["organizer","Organizer decides","You handle it at the time."]].map(([val,lbl,sub])=>(
                <label key={val} className={`radio-opt ${trip.fallback===val?"sel":""}`}><input type="radio" name="fb" checked={trip.fallback===val} onChange={()=>setTrip(t=>({...t,fallback:val}))}/><div><div className="ro-lbl">{lbl}</div><div className="ro-sub">{sub}</div></div></label>
              ))}
            </div>
          </div>
          <div className="divider"/>
          <div className="form-group">
            <label className="lbl">If pledges exceed dream budget</label>
            <div className="radio-group">
              {[["cap","Cap & return surplus","Everyone pays proportionally less."],["tripfund","Surplus → shared trip fund","Upgrades, incidentals, group dinner."],["organizer","Organizer decides","You handle it."]].map(([val,lbl,sub])=>(
                <label key={val} className={`radio-opt ${trip.overage===val?"sel":""}`}><input type="radio" name="ov" checked={trip.overage===val} onChange={()=>setTrip(t=>({...t,overage:val}))}/><div><div className="ro-lbl">{lbl}</div><div className="ro-sub">{sub}</div></div></label>
              ))}
            </div>
          </div>
          <div className="divider"/>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="lbl">Top N on leaderboard</label>
            <input className="inp" type="number" min={0} max={20} value={trip.topN} onChange={e=>setTrip(t=>({...t,topN:parseInt(e.target.value)||0}))}/>
            <p className="hint">0 disables it entirely. Most trips keep this off.</p>
          </div>
        </div>}
      </div>
    </div>
  );
}

// ── Create Wizard ─────────────────────────────────────────────────────────────
const WIZ=["Details","Buy-in & Headcount","Tiers","Rules","Done"];

function CreateWizard({ onDone, onBack }) {
  const [step,setStep]=useState(0);
  const [data,setData]=useState({name:"",description:"",deadline:"",minBuyIn:"",topN:0,minAttendees:"",maxAttendees:"",fallback:"minimum",overage:"tripfund",tiers:[{id:uid(),label:"",description:"",total:""}]});
  const [err,setErr]=useState("");
  const up=patch=>setData(d=>({...d,...patch}));

  const validate=()=>{
    if(step===0){if(!data.name.trim())return"Give your trip a name.";if(!data.deadline)return"Set a deadline so people know when to respond.";}
    if(step===1){if(!data.minBuyIn||isNaN(Number(data.minBuyIn))||Number(data.minBuyIn)<1)return"Enter a minimum pledge amount.";const lo=Number(data.minAttendees),hi=Number(data.maxAttendees);if(!data.minAttendees||isNaN(lo)||lo<1)return"Enter a minimum headcount.";if(!data.maxAttendees||isNaN(hi)||hi<1)return"Enter a maximum headcount.";if(hi<lo)return"Max must be ≥ min.";}
    if(step===2){for(const t of data.tiers){if(!t.label.trim())return"Each tier needs a name.";if(!t.total||isNaN(Number(t.total))||Number(t.total)<1)return"Each tier needs a budget.";}}
    return "";
  };

  const next=()=>{const e=validate();if(e){setErr(e);return;}setErr("");setStep(s=>s+1);};
  const finish=()=>{onDone({id:uid(),name:data.name,description:data.description,deadline:data.deadline,minBuyIn:Number(data.minBuyIn),topN:Number(data.topN)||0,minAttendees:Number(data.minAttendees),maxAttendees:Number(data.maxAttendees),fallback:data.fallback,overage:data.overage,phase:"scheduling",lockedDates:null,tiers:[...data.tiers].map(t=>({...t,total:Number(t.total)})).sort((a,b)=>a.total-b.total),pledges:[]});};

  const lo=Number(data.minAttendees)||0,hi=Number(data.maxAttendees)||0,hasRange=lo>0&&hi>=lo;

  return (
    <div className="app">
      <Nav right={<button className="btn btn-ghost-lt btn-sm" onClick={onBack}>← Back</button>}/>
      <div className="section" style={{paddingTop:40,maxWidth:560}}>
        <div className="eyebrow fade-up">New trip</div>
        <div className="sec-hd fade-up">Let's make it happen.</div>
        <div className="steps-row fade-up">
          {WIZ.map((s,i)=>(
            <div key={s} style={{display:"contents"}}>
              <div className={`step-dot ${i<step?"done":i===step?"active":""}`}>{i<step?"✓":i+1}</div>
              {i<WIZ.length-1&&<div className={`step-line ${i<step?"done":""}`}/>}
            </div>
          ))}
        </div>

        <div className="card cp pop-in" key={step}>
          {step===0&&<>
            <div style={{fontWeight:700,fontSize:17,marginBottom:20}}>The basics</div>
            <div className="form-group"><label className="lbl">Trip name</label><input className="inp" placeholder="e.g. Scottsdale Golf Trip 2025" value={data.name} onChange={e=>up({name:e.target.value})}/></div>
            <div className="form-group"><label className="lbl">Description <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></label><textarea className="inp" placeholder="Paint a little picture. What's the vibe?" value={data.description} onChange={e=>up({description:e.target.value})}/></div>
            <div className="form-group"><label className="lbl">Response deadline</label><input className="inp" type="date" value={data.deadline} onChange={e=>up({deadline:e.target.value})}/><p className="hint">The date you want everyone to have responded by. Availability first, then pledges once you lock dates.</p></div>
          </>}

          {step===1&&<>
            <div style={{fontWeight:700,fontSize:17,marginBottom:6}}>Money & headcount</div>
            <div style={{fontSize:14,color:"#7a8a72",marginBottom:24,lineHeight:1.6}}>Set the floor and how many people you're hoping to bring. This drives the per-person estimates contributors see on each tier.</div>
            <div className="form-group"><label className="lbl">Minimum pledge per person</label><div className="amt-wrap"><span className="amt-sym">$</span><input className="amt-inp" type="number" min={1} placeholder="0" value={data.minBuyIn} onChange={e=>up({minBuyIn:e.target.value})}/></div><p className="hint">Nobody pledges below this. They can always go higher — that's the whole point.</p></div>
            <div className="divider"/>
            <div className="form-group"><label className="lbl">Expected headcount</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"end"}}>
                <div><label className="lbl" style={{fontSize:10}}>Minimum</label><input className="inp" type="number" min={1} placeholder="e.g. 8" value={data.minAttendees} onChange={e=>up({minAttendees:e.target.value})}/></div>
                <div style={{paddingBottom:11,color:"#b0a898",fontSize:18,textAlign:"center"}}>–</div>
                <div><label className="lbl" style={{fontSize:10}}>Maximum</label><input className="inp" type="number" min={1} placeholder="e.g. 12" value={data.maxAttendees} onChange={e=>up({maxAttendees:e.target.value})}/></div>
              </div>
              <p className="hint">Contributors see a per-person range per tier based on these numbers.</p>
            </div>
            <div className="divider"/>
            <div className="form-group" style={{marginBottom:0}}><label className="lbl">Top N on leaderboard</label><input className="inp" type="number" min={0} max={20} value={data.topN} onChange={e=>up({topN:e.target.value})}/><p className="hint">How many top contributors can choose to reveal their name. Most trips keep this at 0.</p></div>
          </>}

          {step===2&&<>
            <div style={{fontWeight:700,fontSize:17,marginBottom:6}}>What the money unlocks</div>
            <div style={{fontSize:14,color:"#7a8a72",marginBottom:20,lineHeight:1.6}}>Each tier is a real thing — a better house, a nicer dinner, the pool. Makes pledging feel concrete. Avg/person based on {lo}–{hi} people.</div>
            {data.tiers.map((tier,i)=>(
              <div key={tier.id} style={{border:"1.5px solid #ddd5c4",borderRadius:10,padding:16,marginBottom:12,background:"#f4f1eb"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:600,fontSize:13,color:"#7a8a72"}}>{i===data.tiers.length-1?"✦ Dream tier":`Tier ${i+1}`}</div>
                  {data.tiers.length>1&&<button className="btn btn-ghost btn-xs" style={{color:"#b5735a",borderColor:"#f0d4d4"}} onClick={()=>up({tiers:data.tiers.filter((_,j)=>j!==i)})}>Remove</button>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label className="lbl">Tier name</label><input className="inp" placeholder="e.g. Base Camp" value={tier.label} onChange={e=>up({tiers:data.tiers.map((t,j)=>j===i?{...t,label:e.target.value}:t)})}/></div>
                  <div><label className="lbl">Total budget</label><div className="inp-pfx-wrap"><span className="inp-pfx">$</span><input className="inp inp-pfxd" type="number" placeholder="0" value={tier.total} onChange={e=>up({tiers:data.tiers.map((t,j)=>j===i?{...t,total:e.target.value}:t)})}/></div>
                    {hasRange&&tier.total&&!isNaN(Number(tier.total))&&Number(tier.total)>0&&<p className="hint" style={{color:"#b5735a",fontWeight:600}}>≈ {fmtR(avgRange(lo,hi,Number(tier.total)).lo,avgRange(lo,hi,Number(tier.total)).hi)}/person</p>}
                  </div>
                </div>
                <div><label className="lbl">What it unlocks</label><input className="inp" placeholder="e.g. Private pool house + welcome dinner" value={tier.description} onChange={e=>up({tiers:data.tiers.map((t,j)=>j===i?{...t,description:e.target.value}:t)})}/></div>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={()=>up({tiers:[...data.tiers,{id:uid(),label:"",description:"",total:""}]})}>+ Add a tier</button>
          </>}

          {step===3&&<>
            <div style={{fontWeight:700,fontSize:17,marginBottom:6}}>Set the ground rules.</div>
            <div style={{fontSize:14,color:"#7a8a72",marginBottom:24,lineHeight:1.6}}>Pre-commit to these now. Contributors see them before pledging so everyone's on the same page from the start.</div>
            <div className="form-group"><label className="lbl">If the dream budget isn't hit</label>
              <div className="radio-group">
                {[["minimum","Run the trip on what was raised","Still happening — just at the minimum tier."],["cancel","Cancel and refund everyone","Clean slate if the numbers don't work."],["organizer","Organizer calls it at the time","Keeps options open, puts it on you."]].map(([val,lbl,sub])=>(
                  <label key={val} className={`radio-opt ${data.fallback===val?"sel":""}`}><input type="radio" name="fallback" value={val} checked={data.fallback===val} onChange={()=>up({fallback:val})}/><div><div className="ro-lbl">{lbl}</div><div className="ro-sub">{sub}</div></div></label>
                ))}
              </div>
            </div>
            <div className="divider"/>
            <div className="form-group"><label className="lbl">If pledges go over the dream</label>
              <div className="radio-group">
                {[["cap","Cap it and return the extra","Everyone pays a bit less."],["tripfund","Extra goes into the trip fund","Better upgrades, a nicer dinner, a boat."],["organizer","Organizer decides","You'll figure it out."]].map(([val,lbl,sub])=>(
                  <label key={val} className={`radio-opt ${data.overage===val?"sel":""}`}><input type="radio" name="overage" value={val} checked={data.overage===val} onChange={()=>up({overage:val})}/><div><div className="ro-lbl">{lbl}</div><div className="ro-sub">{sub}</div></div></label>
                ))}
              </div>
            </div>
          </>}

          {step===4&&<div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:48,marginBottom:16}}>✌️</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,marginBottom:8}}>You're all set.</div>
            <div style={{fontSize:15,color:"#4a5a48",marginBottom:8,lineHeight:1.7}}><strong>{data.name}</strong> is ready to go.</div>
            <div style={{fontSize:14,color:"#7a8a72",marginBottom:28,lineHeight:1.6}}>Share the link. People mark their availability, you lock dates, then everyone pledges. No awkward conversations required.</div>
            <div className="invite-box" style={{marginBottom:24,justifyContent:"center"}}>
              <span className="invite-url">guiltfree.app/trip/{data.name.toLowerCase().replace(/\s+/g,"-")}</span>
            </div>
            <button className="btn btn-navy btn-full" onClick={finish}>Go to dashboard →</button>
          </div>}

          {err&&<div className="err">{err}</div>}
          {step<4&&<div style={{display:"flex",gap:10,marginTop:28}}>
            {step>0&&<button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setErr("");setStep(s=>s-1);}}>← Back</button>}
            <button className="btn btn-navy" style={{flex:2}} onClick={next}>{step===3?"Create trip →":"Continue →"}</button>
          </div>}
        </div>
      </div>
    </div>
  );
}

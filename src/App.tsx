import { useState, useEffect } from 'react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f0e8; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn  { 0% { transform:scale(0.94); opacity:0; } 100% { transform:scale(1); opacity:1; } }
  .fade-up  { animation: fadeUp 0.4s ease both; }
  .fade-up2 { animation: fadeUp 0.4s 0.08s ease both; }
  .pop-in   { animation: popIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both; }
  .app { min-height:100vh; background:#f5f0e8; font-family:'DM Sans',sans-serif; color:#1a1410; }
  .nav { display:flex; align-items:center; justify-content:space-between; padding:16px 28px; background:#1a1410; position:sticky; top:0; z-index:200; }
  .logo { font-family:'DM Serif Display',serif; font-size:21px; color:#f5f0e8; letter-spacing:-0.5px; }
  .logo span { color:#e8b86d; font-style:italic; }
  .nav-right { display:flex; align-items:center; gap:10px; }
  .badge { background:#e8b86d; color:#1a1410; font-size:11px; font-weight:700; letter-spacing:0.6px; padding:5px 12px; border-radius:100px; text-transform:uppercase; }
  .btn { display:inline-flex; align-items:center; gap:7px; padding:13px 26px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; border:none; transition:all 0.17s ease; white-space:nowrap; }
  .btn-dark { background:#1a1410; color:#f5f0e8; }
  .btn-dark:hover { background:#2e2419; transform:translateY(-1px); box-shadow:0 4px 16px rgba(26,20,16,0.18); }
  .btn-gold { background:#e8b86d; color:#1a1410; }
  .btn-gold:hover { background:#d4a45c; transform:translateY(-1px); }
  .btn-ghost { background:transparent; color:#1a1410; border:1.5px solid #c4b49a; }
  .btn-ghost:hover { border-color:#1a1410; transform:translateY(-1px); }
  .btn-ghost-lt { background:transparent; color:#f5f0e8; border:1.5px solid rgba(245,240,232,0.3); }
  .btn-ghost-lt:hover { border-color:rgba(245,240,232,0.7); }
  .btn-sm { padding:9px 18px; font-size:13px; }
  .btn-xs { padding:6px 13px; font-size:12px; border-radius:5px; }
  .btn-full { width:100%; justify-content:center; }
  .card { background:#fff; border-radius:14px; border:1px solid #e8ddd0; box-shadow:0 2px 20px rgba(26,20,16,0.06); }
  .cp { padding:28px; }
  .form-group { margin-bottom:22px; }
  .form-group:last-child { margin-bottom:0; }
  .lbl { display:block; font-size:11px; font-weight:600; letter-spacing:0.7px; text-transform:uppercase; color:#8a7a6a; margin-bottom:8px; }
  .inp { width:100%; padding:11px 14px; border:1.5px solid #e0d4c4; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:15px; color:#1a1410; background:#faf8f5; transition:border-color 0.15s,background 0.15s; outline:none; }
  .inp:focus { border-color:#c17f3a; background:#fff; }
  .inp::placeholder { color:#b0a090; }
  .inp-pfx-wrap { position:relative; }
  .inp-pfx { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:15px; color:#8a7a6a; pointer-events:none; }
  .inp-pfxd { padding-left:26px; }
  textarea.inp { resize:vertical; min-height:80px; }
  .hint { font-size:12px; color:#9a8a7a; margin-top:6px; line-height:1.5; }
  .err  { font-size:13px; color:#a03030; margin-top:10px; }
  .divider { height:1px; background:#ede5d8; margin:22px 0; }
  .radio-group { display:flex; flex-direction:column; gap:8px; }
  .radio-opt { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; border-radius:8px; border:1.5px solid #e0d4c4; cursor:pointer; transition:all 0.15s; background:#faf8f5; }
  .radio-opt:hover { border-color:#c17f3a; }
  .radio-opt.sel { border-color:#c17f3a; background:#fdf6ed; }
  .radio-opt input { margin-top:2px; accent-color:#c17f3a; flex-shrink:0; }
  .ro-lbl { font-size:14px; font-weight:500; color:#1a1410; }
  .ro-sub { font-size:12px; color:#8a7a6a; margin-top:2px; }
  .toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .toggle-btn { width:46px; height:26px; border-radius:100px; background:#e0d4c4; border:none; cursor:pointer; position:relative; transition:background 0.2s; flex-shrink:0; }
  .toggle-btn.on { background:#c17f3a; }
  .toggle-btn::after { content:''; position:absolute; top:4px; left:4px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.15); }
  .toggle-btn.on::after { transform:translateX(20px); }
  .prog-track { height:10px; background:#f0e8da; border-radius:100px; position:relative; overflow:visible; }
  .prog-fill { height:100%; border-radius:100px; background:linear-gradient(90deg,#c17f3a,#e8b86d); transition:width 0.9s cubic-bezier(0.34,1.1,0.64,1); position:relative; }
  .prog-fill::after { content:''; position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:20px; height:20px; border-radius:50%; background:#e8b86d; border:3px solid #fff; box-shadow:0 2px 8px rgba(193,127,58,0.4); }
  .prog-marker { position:absolute; top:-24px; transform:translateX(-50%); font-size:10px; font-weight:700; letter-spacing:0.3px; white-space:nowrap; color:#8a7a6a; }
  .prog-line { position:absolute; top:-9px; bottom:-9px; width:1.5px; background:#c4b49a; }
  .chip { display:inline-block; padding:3px 10px; border-radius:100px; font-size:12px; font-weight:600; }
  .chip-green { background:#e6f4ea; color:#2d7a3a; }
  .chip-amber { background:#fef3e2; color:#b06010; }
  .chip-blue  { background:#e8f0fe; color:#1a5cd4; }
  .steps-row { display:flex; align-items:center; margin-bottom:32px; }
  .step-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; border:2px solid #e0d4c4; color:#b0a090; background:#fff; transition:all 0.25s; flex-shrink:0; }
  .step-dot.active { border-color:#c17f3a; color:#c17f3a; background:#fdf6ed; }
  .step-dot.done   { border-color:#c17f3a; background:#c17f3a; color:#fff; }
  .step-line { flex:1; height:2px; background:#e0d4c4; }
  .step-line.done { background:#c17f3a; }
  .tier-card { border:1.5px solid #e8ddd0; border-radius:10px; padding:16px; background:#faf8f5; margin-bottom:10px; }
  .tier-card.unlocked { border-color:#b8e0c0; background:#f4fbf6; }
  .tc-hd { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .tc-name { font-weight:600; font-size:15px; }
  .tc-desc { font-size:13px; color:#8a7a6a; margin-top:3px; }
  .tc-right { text-align:right; flex-shrink:0; }
  .tc-total { font-family:'DM Serif Display',serif; font-size:20px; color:#1a1410; }
  .tc-avg-range  { font-size:12px; color:#8a7a6a; margin-top:2px; }
  .tc-avg-actual { font-size:12px; color:#c17f3a; font-weight:600; margin-top:2px; }
  .tc-togo { font-size:11px; color:#c17f3a; font-weight:600; margin-top:4px; }
  .dream-tag { margin-left:6px; font-size:10px; color:#c17f3a; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
  .amt-wrap { position:relative; }
  .amt-sym { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:22px; color:#8a7a6a; pointer-events:none; font-family:'DM Serif Display',serif; }
  .amt-inp { width:100%; padding:18px 14px 18px 34px; border:2px solid #e0d4c4; border-radius:8px; font-size:36px; font-family:'DM Serif Display',serif; color:#1a1410; background:#faf8f5; outline:none; transition:border-color 0.15s,background 0.15s; }
  .amt-inp:focus { border-color:#c17f3a; background:#fff; }
  .stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
  .stat-box { background:#f5f0e8; border-radius:9px; padding:16px 18px; }
  .stat-lbl { font-size:11px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#8a7a6a; margin-bottom:5px; }
  .stat-val { font-family:'DM Serif Display',serif; font-size:26px; color:#1a1410; }
  .stat-sub { font-size:11px; color:#9a8a7a; margin-top:3px; }
  .contrib-row { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid #f5f0e8; }
  .contrib-row:last-child { border-bottom:none; }
  .c-name { font-weight:500; font-size:15px; }
  .c-anon { color:#b0a090; font-size:14px; font-style:italic; }
  .c-amt  { font-family:'DM Serif Display',serif; font-size:19px; }
  .tabs { display:flex; background:#f0e8da; border-radius:9px; padding:4px; margin-bottom:28px; }
  .tab  { flex:1; padding:10px 6px; border-radius:6px; font-size:14px; font-weight:500; cursor:pointer; border:none; background:transparent; font-family:'DM Sans',sans-serif; color:#8a7a6a; transition:all 0.17s; text-align:center; }
  .tab.active { background:#fff; color:#1a1410; box-shadow:0 1px 5px rgba(26,20,16,0.1); }
  .success-card { background:linear-gradient(135deg,#1a1410,#2e2419); border-radius:14px; padding:36px; text-align:center; color:#f5f0e8; margin-bottom:20px; }
  .success-card h2 { font-family:'DM Serif Display',serif; font-size:34px; color:#e8b86d; margin-bottom:8px; }
  .hero { padding:64px 28px 48px; max-width:620px; margin:0 auto; text-align:center; }
  .eyebrow { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#8a7a6a; margin-bottom:14px; }
  .hero h1 { font-family:'DM Serif Display',serif; font-size:clamp(34px,6vw,54px); line-height:1.06; color:#1a1410; margin-bottom:18px; }
  .hero h1 em { color:#c17f3a; font-style:italic; }
  .hero p { font-size:17px; line-height:1.65; color:#5a4a3a; margin-bottom:32px; }
  .hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .section { max-width:700px; margin:0 auto; padding:0 24px 80px; }
  .sec-hd  { font-family:'DM Serif Display',serif; font-size:27px; margin-bottom:6px; }
  .invite-box { background:#f5f0e8; border:1.5px dashed #c4b49a; border-radius:9px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .invite-url { font-size:13px; color:#5a4a3a; font-family:monospace; word-break:break-all; }
  .pl-badge { display:inline-flex; align-items:center; background:#f5f0e8; border:1px solid #e0d4c4; border-radius:100px; padding:4px 12px; font-size:13px; font-weight:500; color:#5a4a3a; gap:6px; }
  .pl-dot { width:6px; height:6px; border-radius:50%; background:#e8b86d; }
  .empty { text-align:center; padding:48px 24px; color:#8a7a6a; }
  .empty-icon  { font-size:40px; margin-bottom:12px; }
  .empty-title { font-family:'DM Serif Display',serif; font-size:20px; color:#1a1410; margin-bottom:6px; }
  .empty-desc  { font-size:14px; line-height:1.6; }
`;

const fmt = (n) => '$' + Number(n || 0).toLocaleString();
const fmtR = (lo, hi) => `${fmt(lo)}–${fmt(hi)}`;
const pct = (a, b) => (b ? Math.min(100, Math.round((a / b) * 100)) : 0);
const uid = () => Math.random().toString(36).slice(2, 8);
const avgRange = (minP, maxP, total) => ({
  lo: Math.round(total / Math.max(maxP, 1)),
  hi: Math.round(total / Math.max(minP, 1)),
});

const DEMO = {
  id: 'demo',
  name: 'Napa Valley Weekend',
  description: 'Wine tasting, a great dinner, and hopefully a pool house.',
  deadline: '2025-09-15',
  minBuyIn: 200,
  topN: 2,
  minAttendees: 8,
  maxAttendees: 12,
  fallback: 'minimum',
  overage: 'tripfund',
  tiers: [
    {
      id: 't1',
      label: 'Base Camp',
      description: '2-bed Airbnb, shared rooms',
      total: 2400,
    },
    {
      id: 't2',
      label: 'Comfort',
      description: '3-bed Airbnb, everyone has a bed',
      total: 3600,
    },
    {
      id: 't3',
      label: 'Dream',
      description: 'Private pool house + welcome dinner',
      total: 5200,
    },
  ],
  pledges: [
    { id: 'p1', name: 'Marcus T.', amount: 600, wantsCredit: true },
    { id: 'p2', name: 'Diana R.', amount: 400, wantsCredit: false },
    { id: 'p3', name: 'Chris L.', amount: 250, wantsCredit: false },
    { id: 'p4', name: 'Priya K.', amount: 350, wantsCredit: true },
  ],
};

export default function App() {
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'pooltrip-styles';
    el.textContent = CSS;
    if (!document.getElementById('pooltrip-styles')) {
      document.head.appendChild(el);
    }
    return () => {
      const s = document.getElementById('pooltrip-styles');
      if (s) s.remove();
    };
  }, []);

  const [screen, setScreen] = useState('home');
  const [trip, setTrip] = useState(DEMO);
  const [pledger, setPledger] = useState('');
  const go = (s) => setScreen(s);

  if (screen === 'home')
    return (
      <Home
        onOrganize={() => go('organizer')}
        onCreate={() => go('create')}
        onPledge={() => go('pledge')}
      />
    );
  if (screen === 'create')
    return (
      <CreateWizard
        onDone={(t) => {
          setTrip(t);
          go('organizer');
        }}
        onBack={() => go('home')}
      />
    );
  if (screen === 'organizer')
    return (
      <Organizer
        trip={trip}
        setTrip={setTrip}
        onBack={() => go('home')}
        onCreate={() => go('create')}
      />
    );
  if (screen === 'pledge')
    return (
      <PledgeView
        trip={trip}
        setTrip={setTrip}
        pledger={pledger}
        setPledger={setPledger}
        onBack={() => go('home')}
      />
    );
  return null;
}

function Home({ onOrganize, onCreate, onPledge }) {
  const total = DEMO.pledges.reduce((s, p) => s + p.amount, 0);
  return (
    <div className="app">
      <nav className="nav">
        <div className="logo">
          pool<span>trip</span>
        </div>
        <span className="badge">Prototype</span>
      </nav>
      <div className="hero fade-up">
        <div className="eyebrow">Group travel · no awkward money talks</div>
        <h1>
          Everyone chips in.
          <br />
          <em>Nobody compares.</em>
        </h1>
        <p>
          Set a minimum, dream big, and let your group privately pledge what
          they're comfortable with. The bar fills. The trip happens.
        </p>
        <div className="hero-btns">
          <button className="btn btn-dark" onClick={onCreate}>
            Create a trip →
          </button>
          <button className="btn btn-ghost" onClick={onOrganize}>
            Demo dashboard
          </button>
          <button className="btn btn-ghost" onClick={onPledge}>
            Contributor flow
          </button>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="card cp fade-up2">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 21,
                  marginBottom: 3,
                }}
              >
                Napa Valley Weekend
              </div>
              <div style={{ fontSize: 13, color: '#8a7a6a' }}>
                4 contributors · 8–12 expected · 3 tiers · Deadline Sep 15
              </div>
            </div>
            <span className="chip chip-amber">Pledging open</span>
          </div>
          <MiniProg tiers={DEMO.tiers} total={total} />
        </div>
      </div>
    </div>
  );
}

function MiniProg({ tiers, total }) {
  const dream = tiers[tiers.length - 1]?.total || 1;
  return (
    <div style={{ paddingTop: 30, paddingBottom: 8 }}>
      <div className="prog-track">
        {tiers.slice(0, -1).map((t) => {
          const p = pct(t.total, dream);
          return (
            <div
              key={t.id}
              style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0 }}
            >
              <div className="prog-line" />
              <div className="prog-marker">{t.label}</div>
            </div>
          );
        })}
        <div className="prog-fill" style={{ width: `${pct(total, dream)}%` }} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 14,
          fontSize: 13,
          color: '#8a7a6a',
        }}
      >
        <span>{fmt(total)} pledged</span>
        <span>Dream: {fmt(dream)}</span>
      </div>
    </div>
  );
}

function TierProg({ trip, total }) {
  const dream = trip.tiers[trip.tiers.length - 1]?.total || 1;
  const n = trip.pledges.length;
  const minP = trip.minAttendees || 1;
  const maxP = trip.maxAttendees || minP;
  const hasActual = n > 0;
  const actualAvg = hasActual ? Math.round(total / n) : null;

  return (
    <div>
      <div style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div className="prog-track">
          {trip.tiers.slice(0, -1).map((t) => {
            const p = pct(t.total, dream);
            const done = total >= t.total;
            return (
              <div
                key={t.id}
                style={{
                  position: 'absolute',
                  left: `${p}%`,
                  top: 0,
                  bottom: 0,
                }}
              >
                <div
                  className="prog-line"
                  style={{ background: done ? '#c17f3a' : '#c4b49a' }}
                />
                <div
                  className="prog-marker"
                  style={{ color: done ? '#c17f3a' : '#8a7a6a' }}
                >
                  {t.label}
                </div>
              </div>
            );
          })}
          <div
            className="prog-fill"
            style={{ width: `${pct(total, dream)}%` }}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          color: '#8a7a6a',
          marginTop: 12,
        }}
      >
        <span>Min: {fmt(trip.minBuyIn)}/person</span>
        <span>{pct(total, dream)}% to dream</span>
        <span>Dream: {fmt(dream)}</span>
      </div>
      <div style={{ marginTop: 18 }}>
        {trip.tiers.map((t, i) => {
          const r = avgRange(minP, maxP, t.total);
          const unlocked = total >= t.total;
          return (
            <div
              key={t.id}
              className={`tier-card ${unlocked ? 'unlocked' : ''}`}
              style={{ marginBottom: 8 }}
            >
              <div className="tc-hd">
                <div>
                  <div className="tc-name">
                    {unlocked ? '✓ ' : ''}
                    {t.label}
                    {i === trip.tiers.length - 1 && (
                      <span className="dream-tag">Dream</span>
                    )}
                  </div>
                  <div className="tc-desc">{t.description}</div>
                </div>
                <div className="tc-right">
                  <div className="tc-total">{fmt(t.total)}</div>
                  <div className="tc-avg-range">
                    est. {fmtR(r.lo, r.hi)}/person
                  </div>
                  {hasActual && (
                    <div className="tc-avg-actual">
                      {fmt(actualAvg)} actual avg ({n} pledges)
                    </div>
                  )}
                  {!unlocked && (
                    <div className="tc-togo">{fmt(t.total - total)} to go</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const WIZ = ['Details', 'Buy-in & Headcount', 'Tiers', 'Rules', 'Done'];

function CreateWizard({ onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '',
    description: '',
    deadline: '',
    minBuyIn: '',
    topN: 2,
    minAttendees: '',
    maxAttendees: '',
    fallback: 'minimum',
    overage: 'tripfund',
    tiers: [{ id: uid(), label: '', description: '', total: '' }],
  });
  const [err, setErr] = useState('');
  const up = (patch) => setData((d) => ({ ...d, ...patch }));

  const validate = () => {
    if (step === 0) {
      if (!data.name.trim()) return 'Please enter a trip name.';
      if (!data.deadline) return 'Please set a deadline.';
    }
    if (step === 1) {
      if (
        !data.minBuyIn ||
        isNaN(Number(data.minBuyIn)) ||
        Number(data.minBuyIn) < 1
      )
        return 'Enter a valid minimum buy-in.';
      const lo = Number(data.minAttendees),
        hi = Number(data.maxAttendees);
      if (!data.minAttendees || isNaN(lo) || lo < 1)
        return 'Enter a minimum number of attendees.';
      if (!data.maxAttendees || isNaN(hi) || hi < 1)
        return 'Enter a maximum number of attendees.';
      if (hi < lo) return 'Max must be ≥ min attendees.';
    }
    if (step === 2) {
      for (const t of data.tiers) {
        if (!t.label.trim()) return 'Each tier needs a name.';
        if (!t.total || isNaN(Number(t.total)) || Number(t.total) < 1)
          return 'Each tier needs a valid budget.';
      }
    }
    return '';
  };

  const next = () => {
    const e = validate();
    if (e) {
      setErr(e);
      return;
    }
    setErr('');
    setStep((s) => s + 1);
  };

  const finish = () => {
    onDone({
      id: uid(),
      name: data.name,
      description: data.description,
      deadline: data.deadline,
      minBuyIn: Number(data.minBuyIn),
      topN: Number(data.topN) || 0,
      minAttendees: Number(data.minAttendees),
      maxAttendees: Number(data.maxAttendees),
      fallback: data.fallback,
      overage: data.overage,
      tiers: [...data.tiers]
        .map((t) => ({ ...t, total: Number(t.total) }))
        .sort((a, b) => a.total - b.total),
      pledges: [],
    });
  };

  const lo = Number(data.minAttendees) || 0,
    hi = Number(data.maxAttendees) || 0;
  const hasRange = lo > 0 && hi >= lo;

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo">
          pool<span>trip</span>
        </div>
        <button className="btn btn-ghost-lt btn-sm" onClick={onBack}>
          ← Back
        </button>
      </nav>
      <div className="section" style={{ paddingTop: 40, maxWidth: 560 }}>
        <div className="eyebrow fade-up">New trip</div>
        <div className="sec-hd fade-up">Set up your trip</div>
        <div className="steps-row fade-up">
          {WIZ.map((s, i) => (
            <div key={s} style={{ display: 'contents' }}>
              <div
                className={`step-dot ${
                  i < step ? 'done' : i === step ? 'active' : ''
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < WIZ.length - 1 && (
                <div className={`step-line ${i < step ? 'done' : ''}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card cp pop-in" key={step}>
          {step === 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
                Trip details
              </div>
              <div className="form-group">
                <label className="lbl">Trip name</label>
                <input
                  className="inp"
                  placeholder="e.g. Scottsdale Golf Trip 2025"
                  value={data.name}
                  onChange={(e) => up({ name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="lbl">
                  Description{' '}
                  <span
                    style={{
                      fontWeight: 400,
                      textTransform: 'none',
                      letterSpacing: 0,
                    }}
                  >
                    (optional)
                  </span>
                </label>
                <textarea
                  className="inp"
                  placeholder="Give people a sense of what's planned..."
                  value={data.description}
                  onChange={(e) => up({ description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="lbl">Pledge deadline</label>
                <input
                  className="inp"
                  type="date"
                  value={data.deadline}
                  onChange={(e) => up({ deadline: e.target.value })}
                />
                <p className="hint">
                  Pledges are held until this date, then the trip confirms or
                  falls back based on your rules.
                </p>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
                Buy-in & headcount
              </div>
              <div style={{ fontSize: 14, color: '#8a7a6a', marginBottom: 24 }}>
                Set the pledge floor and expected headcount. The range you enter
                here drives the avg/person estimates contributors see on each
                tier.
              </div>
              <div className="form-group">
                <label className="lbl">Minimum pledge per person</label>
                <div className="amt-wrap">
                  <span className="amt-sym">$</span>
                  <input
                    className="amt-inp"
                    type="number"
                    min={1}
                    placeholder="0"
                    value={data.minBuyIn}
                    onChange={(e) => up({ minBuyIn: e.target.value })}
                  />
                </div>
                <p className="hint">
                  Nobody can pledge below this. Contributors can go as high as
                  they want.
                </p>
              </div>
              <div className="divider" />
              <div className="form-group">
                <label className="lbl">Expected number of attendees</label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    gap: 10,
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <label className="lbl" style={{ fontSize: 10 }}>
                      Minimum
                    </label>
                    <input
                      className="inp"
                      type="number"
                      min={1}
                      placeholder="e.g. 8"
                      value={data.minAttendees}
                      onChange={(e) => up({ minAttendees: e.target.value })}
                    />
                  </div>
                  <div
                    style={{
                      paddingBottom: 11,
                      color: '#b0a090',
                      fontSize: 18,
                      textAlign: 'center',
                    }}
                  >
                    –
                  </div>
                  <div>
                    <label className="lbl" style={{ fontSize: 10 }}>
                      Maximum
                    </label>
                    <input
                      className="inp"
                      type="number"
                      min={1}
                      placeholder="e.g. 12"
                      value={data.maxAttendees}
                      onChange={(e) => up({ maxAttendees: e.target.value })}
                    />
                  </div>
                </div>
                <p className="hint">
                  Contributors see an estimated avg/person range per tier based
                  on these numbers. Once pledges come in, the actual avg shows
                  alongside.
                </p>
              </div>
              <div className="divider" />
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="lbl">Top N on leaderboard</label>
                <input
                  className="inp"
                  type="number"
                  min={0}
                  max={20}
                  value={data.topN}
                  onChange={(e) => up({ topN: e.target.value })}
                />
                <p className="hint">
                  How many top contributors can optionally reveal their name.
                  Set to 0 to disable — most trips do.
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
                Budget tiers
              </div>
              <div style={{ fontSize: 14, color: '#8a7a6a', marginBottom: 20 }}>
                Each tier is a real thing the money unlocks. Avg/person
                estimates are based on {lo}–{hi} attendees.
              </div>
              {data.tiers.map((tier, i) => (
                <div
                  key={tier.id}
                  style={{
                    border: '1.5px solid #e0d4c4',
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 12,
                    background: '#faf8f5',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#8a7a6a',
                      }}
                    >
                      {i === data.tiers.length - 1
                        ? '✦ Dream tier'
                        : `Tier ${i + 1}`}
                    </div>
                    {data.tiers.length > 1 && (
                      <button
                        className="btn btn-ghost btn-xs"
                        style={{ color: '#a03030', borderColor: '#f0d4d4' }}
                        onClick={() =>
                          up({ tiers: data.tiers.filter((_, j) => j !== i) })
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <label className="lbl">Tier name</label>
                      <input
                        className="inp"
                        placeholder="e.g. Base Camp"
                        value={tier.label}
                        onChange={(e) =>
                          up({
                            tiers: data.tiers.map((t, j) =>
                              j === i ? { ...t, label: e.target.value } : t
                            ),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="lbl">Total budget</label>
                      <div className="inp-pfx-wrap">
                        <span className="inp-pfx">$</span>
                        <input
                          className="inp inp-pfxd"
                          type="number"
                          placeholder="0"
                          value={tier.total}
                          onChange={(e) =>
                            up({
                              tiers: data.tiers.map((t, j) =>
                                j === i ? { ...t, total: e.target.value } : t
                              ),
                            })
                          }
                        />
                      </div>
                      {hasRange &&
                        tier.total &&
                        !isNaN(Number(tier.total)) &&
                        Number(tier.total) > 0 && (
                          <p
                            className="hint"
                            style={{ color: '#c17f3a', fontWeight: 600 }}
                          >
                            ≈{' '}
                            {fmtR(
                              avgRange(lo, hi, Number(tier.total)).lo,
                              avgRange(lo, hi, Number(tier.total)).hi
                            )}
                            /person
                          </p>
                        )}
                    </div>
                  </div>
                  <div>
                    <label className="lbl">What it unlocks</label>
                    <input
                      className="inp"
                      placeholder="e.g. 3-bed Airbnb, everyone has a bed"
                      value={tier.description}
                      onChange={(e) =>
                        up({
                          tiers: data.tiers.map((t, j) =>
                            j === i ? { ...t, description: e.target.value } : t
                          ),
                        })
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  up({
                    tiers: [
                      ...data.tiers,
                      { id: uid(), label: '', description: '', total: '' },
                    ],
                  })
                }
              >
                + Add tier
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
                Group rules
              </div>
              <div style={{ fontSize: 14, color: '#8a7a6a', marginBottom: 24 }}>
                Pre-commit now so contributors know exactly what they're
                agreeing to before pledging.
              </div>
              <div className="form-group">
                <label className="lbl">
                  If dream budget isn't hit by deadline
                </label>
                <div className="radio-group">
                  {[
                    [
                      'minimum',
                      'Run the trip on minimum budget',
                      'The trip happens regardless, at whatever was raised.',
                    ],
                    [
                      'cancel',
                      'Cancel and refund all pledges',
                      'Everyone gets their pledge back, no trip.',
                    ],
                    [
                      'organizer',
                      'Organizer decides at the time',
                      'Flexible, but puts the decision on you.',
                    ],
                  ].map(([val, lbl, sub]) => (
                    <label
                      key={val}
                      className={`radio-opt ${
                        data.fallback === val ? 'sel' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="fallback"
                        value={val}
                        checked={data.fallback === val}
                        onChange={() => up({ fallback: val })}
                      />
                      <div>
                        <div className="ro-lbl">{lbl}</div>
                        <div className="ro-sub">{sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="divider" />
              <div className="form-group">
                <label className="lbl">
                  If pledges exceed the dream budget
                </label>
                <div className="radio-group">
                  {[
                    [
                      'cap',
                      'Cap at dream budget, return surplus',
                      'Everyone pays proportionally less.',
                    ],
                    [
                      'tripfund',
                      'Surplus → shared trip fund',
                      'Upgrades, incidentals, group dinner — decided on-trip.',
                    ],
                    [
                      'organizer',
                      'Organizer decides',
                      "You'll handle it when the time comes.",
                    ],
                  ].map(([val, lbl, sub]) => (
                    <label
                      key={val}
                      className={`radio-opt ${
                        data.overage === val ? 'sel' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="overage"
                        value={val}
                        checked={data.overage === val}
                        onChange={() => up({ overage: val })}
                      />
                      <div>
                        <div className="ro-lbl">{lbl}</div>
                        <div className="ro-sub">{sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <div
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 26,
                  marginBottom: 8,
                }}
              >
                Trip created!
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: '#5a4a3a',
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                <strong>{data.name}</strong> is ready. Share the link and watch
                pledges roll in.
              </div>
              <div
                className="invite-box"
                style={{ marginBottom: 24, justifyContent: 'center' }}
              >
                <span className="invite-url">
                  pooltrip.app/c/{data.name.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>
              <button className="btn btn-gold btn-full" onClick={finish}>
                Go to dashboard →
              </button>
            </div>
          )}

          {err && <div className="err">{err}</div>}
          {step < 4 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              {step > 0 && (
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setErr('');
                    setStep((s) => s - 1);
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                className="btn btn-dark"
                style={{ flex: 2 }}
                onClick={next}
              >
                {step === 3 ? 'Create trip →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Organizer({ trip, setTrip, onBack, onCreate }) {
  const [tab, setTab] = useState('dashboard');
  const [showAmts, setShowAmts] = useState(false);
  const total = trip.pledges.reduce((s, p) => s + p.amount, 0);
  const n = trip.pledges.length;
  const avg = n ? Math.round(total / n) : 0;
  const sorted = [...trip.pledges].sort((a, b) => b.amount - a.amount);
  const topN = sorted.slice(0, trip.topN || 0);
  const curTier = [...trip.tiers].reverse().find((t) => total >= t.total);
  const nxtTier = trip.tiers.find((t) => total < t.total);

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo">
          pool<span>trip</span>
        </div>
        <div className="nav-right">
          <button className="btn btn-gold btn-sm" onClick={onCreate}>
            + New trip
          </button>
          <button className="btn btn-ghost-lt btn-sm" onClick={onBack}>
            ← Home
          </button>
        </div>
      </nav>
      <div className="section" style={{ paddingTop: 36 }}>
        <div className="fade-up">
          <div className="eyebrow">Organizer dashboard</div>
          <div className="sec-hd">{trip.name}</div>
          {trip.description && (
            <div
              style={{
                fontSize: 15,
                color: '#5a4a3a',
                marginBottom: 10,
                lineHeight: 1.6,
              }}
            >
              {trip.description}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 28,
            }}
          >
            <span className="chip chip-amber">Pledging open</span>
            {trip.deadline && (
              <span className="chip chip-blue">Deadline {trip.deadline}</span>
            )}
            {curTier && (
              <span className="chip chip-green">
                ✓ {curTier.label} unlocked
              </span>
            )}
          </div>
        </div>
        <div className="tabs">
          {['dashboard', 'tiers', 'contributors', 'settings'].map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div className="fade-up">
            <div className="stat-grid">
              <div className="stat-box">
                <div className="stat-lbl">Total pledged</div>
                <div className="stat-val">{fmt(total)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-lbl">Contributors</div>
                <div className="stat-val">{n}</div>
                <div className="stat-sub">
                  of {trip.minAttendees}–{trip.maxAttendees} expected
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-lbl">Actual avg pledge</div>
                <div className="stat-val">{fmt(avg)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-lbl">To next tier</div>
                <div className="stat-val" style={{ color: '#c17f3a' }}>
                  {nxtTier ? fmt(nxtTier.total - total) : '—'}
                </div>
              </div>
            </div>
            <div className="card cp" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 18 }}>
                Budget progress
              </div>
              <TierProg trip={trip} total={total} />
            </div>
            <div className="card cp" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>
                Contributor link
              </div>
              <div className="invite-box">
                <span className="invite-url">
                  pooltrip.app/c/{trip.name.toLowerCase().replace(/\s+/g, '-')}
                </span>
                <button className="btn btn-ghost btn-sm">Copy</button>
              </div>
              <p className="hint" style={{ marginTop: 10 }}>
                Share privately with each contributor. Their pledge is visible
                only to them.
              </p>
            </div>
            {trip.topN > 0 && topN.length > 0 && (
              <div className="card cp">
                <div style={{ fontWeight: 600, marginBottom: 14 }}>
                  Top {trip.topN} contributors
                </div>
                {topN.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 0',
                      borderBottom:
                        i < topN.length - 1 ? '1px solid #f5f0e8' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: i === 0 ? '#e8b86d' : '#e0d4c4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      {p.wantsCredit ? (
                        <div className="c-name">{p.name}</div>
                      ) : (
                        <div className="c-anon">Anonymous contributor</div>
                      )}
                    </div>
                    <div className="c-amt">{fmt(p.amount)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'tiers' && (
          <div className="fade-up card cp">
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Goal tiers</div>
            <p style={{ fontSize: 13, color: '#8a7a6a', marginBottom: 16 }}>
              Estimated avg/person based on {trip.minAttendees}–
              {trip.maxAttendees} expected attendees.
              {n > 0
                ? ' Actual avg shown alongside.'
                : ' Actual avg appears once pledges come in.'}
            </p>
            {trip.tiers.map((t, i) => {
              const r = avgRange(trip.minAttendees, trip.maxAttendees, t.total);
              const actualAvg = n > 0 ? Math.round(total / n) : null;
              const unlocked = total >= t.total;
              return (
                <div
                  key={t.id}
                  className={`tier-card ${unlocked ? 'unlocked' : ''}`}
                >
                  <div className="tc-hd">
                    <div>
                      <div className="tc-name">
                        {unlocked ? '✓ ' : ''}
                        {t.label}
                        {i === trip.tiers.length - 1 && (
                          <span className="dream-tag">Dream</span>
                        )}
                      </div>
                      <div className="tc-desc">{t.description}</div>
                    </div>
                    <div className="tc-right">
                      <div className="tc-total">{fmt(t.total)}</div>
                      <div className="tc-avg-range">
                        est. {fmtR(r.lo, r.hi)}/person
                      </div>
                      {actualAvg && (
                        <div className="tc-avg-actual">
                          {fmt(actualAvg)} actual avg
                        </div>
                      )}
                      {!unlocked && (
                        <div className="tc-togo">
                          {fmt(t.total - total)} to go
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'contributors' && (
          <div className="fade-up">
            <div className="card cp" style={{ marginBottom: 16 }}>
              <div className="toggle-row">
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>
                    Show individual amounts
                  </div>
                  <div style={{ fontSize: 13, color: '#8a7a6a' }}>
                    Toggle to reveal each person's pledge
                  </div>
                </div>
                <button
                  className={`toggle-btn ${showAmts ? 'on' : ''}`}
                  onClick={() => setShowAmts((v) => !v)}
                />
              </div>
            </div>
            <div className="card">
              {trip.pledges.length === 0 && (
                <div className="empty">
                  <div className="empty-icon">👥</div>
                  <div className="empty-title">No pledges yet</div>
                  <div className="empty-desc">
                    Share your contributor link to get the ball rolling.
                  </div>
                </div>
              )}
              {trip.pledges.map((p) => (
                <div key={p.id} className="contrib-row">
                  <div>
                    <div className="c-name">{p.name}</div>
                    {p.wantsCredit && (
                      <div
                        style={{ fontSize: 11, color: '#c17f3a', marginTop: 2 }}
                      >
                        ✓ Opted in to leaderboard
                      </div>
                    )}
                  </div>
                  <div className="c-amt">
                    {showAmts ? (
                      fmt(p.amount)
                    ) : (
                      <span className="c-anon">hidden</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="fade-up card cp">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Trip rules</div>
            <div className="form-group">
              <label className="lbl">If dream budget isn't hit</label>
              <div className="radio-group">
                {[
                  ['minimum', 'Run on minimum budget'],
                  ['cancel', 'Cancel & refund pledges'],
                  ['organizer', 'Organizer decides'],
                ].map(([val, lbl]) => (
                  <label
                    key={val}
                    className={`radio-opt ${
                      trip.fallback === val ? 'sel' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="fb"
                      checked={trip.fallback === val}
                      onChange={() => setTrip((t) => ({ ...t, fallback: val }))}
                    />
                    <span className="ro-lbl">{lbl}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="divider" />
            <div className="form-group">
              <label className="lbl">If pledges exceed dream budget</label>
              <div className="radio-group">
                {[
                  ['cap', 'Cap & return surplus'],
                  ['tripfund', 'Surplus → shared trip fund'],
                  ['organizer', 'Organizer decides'],
                ].map(([val, lbl]) => (
                  <label
                    key={val}
                    className={`radio-opt ${trip.overage === val ? 'sel' : ''}`}
                  >
                    <input
                      type="radio"
                      name="ov"
                      checked={trip.overage === val}
                      onChange={() => setTrip((t) => ({ ...t, overage: val }))}
                    />
                    <span className="ro-lbl">{lbl}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="divider" />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="lbl">Top N on leaderboard</label>
              <input
                className="inp"
                type="number"
                min={0}
                max={20}
                value={trip.topN}
                onChange={(e) =>
                  setTrip((t) => ({
                    ...t,
                    topN: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <p className="hint">
                Set to 0 to disable. Contributors who opt in appear if they're
                in the top {trip.topN}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PledgeView({ trip, setTrip, pledger, setPledger, onBack }) {
  const [step, setStep] = useState(pledger ? 'pledge' : 'identify');
  const [amount, setAmount] = useState('');
  const [wantsCredit, setWC] = useState(null);
  const [err, setErr] = useState('');

  const total = trip.pledges.reduce((s, p) => s + p.amount, 0);
  const dream = trip.tiers[trip.tiers.length - 1]?.total || 1;
  const n = trip.pledges.length;
  const existing = trip.pledges.find((p) => p.name === pledger);
  const isReturn = !!existing;
  const dreamR = avgRange(
    trip.minAttendees || 1,
    trip.maxAttendees || 1,
    dream
  );

  const handleIdentify = () => {
    if (!pledger.trim()) {
      setErr('Please enter your name.');
      return;
    }
    setErr('');
    setStep('pledge');
    if (existing) setAmount(existing.amount.toString());
  };
  const handlePledge = () => {
    const val = parseInt(amount);
    if (isNaN(val) || val < trip.minBuyIn) {
      setErr(`Minimum pledge is ${fmt(trip.minBuyIn)}.`);
      return;
    }
    if (isReturn && val < existing.amount) {
      setErr(`You can only increase (currently ${fmt(existing.amount)}).`);
      return;
    }
    if (trip.topN > 0 && wantsCredit === null) {
      setErr('Please answer the leaderboard question.');
      return;
    }
    setErr('');
    setStep('confirm');
  };
  const handleConfirm = () => {
    const val = parseInt(amount);
    setTrip((t) => {
      const ex = t.pledges.find((p) => p.name === pledger);
      if (ex)
        return {
          ...t,
          pledges: t.pledges.map((p) =>
            p.name === pledger
              ? { ...p, amount: val, wantsCredit: wantsCredit ?? false }
              : p
          ),
        };
      return {
        ...t,
        pledges: [
          ...t.pledges,
          {
            id: 'p_' + uid(),
            name: pledger,
            amount: val,
            wantsCredit: wantsCredit ?? false,
          },
        ],
      };
    });
    setStep('done');
  };

  const val = parseInt(amount) || 0;
  const projTotal = total + val - (existing?.amount || 0);
  const projPct = pct(projTotal, dream);

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo">
          pool<span>trip</span>
        </div>
        <button className="btn btn-ghost-lt btn-sm" onClick={onBack}>
          ← Home
        </button>
      </nav>
      <div className="section" style={{ paddingTop: 36, maxWidth: 520 }}>
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div className="eyebrow">You're invited</div>
          <div className="sec-hd">{trip.name}</div>
          {trip.description && (
            <div
              style={{
                fontSize: 15,
                color: '#5a4a3a',
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              {trip.description}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="pl-badge">
              <span className="pl-dot" />
              Min {fmt(trip.minBuyIn)}/person
            </span>
            <span className="pl-badge">
              <span className="pl-dot" />
              {trip.minAttendees}–{trip.maxAttendees} expected
            </span>
            {trip.deadline && (
              <span className="pl-badge">
                <span className="pl-dot" />
                Deadline {trip.deadline}
              </span>
            )}
          </div>
        </div>

        <div className="card cp fade-up2" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>
            Group progress
          </div>
          <TierProg trip={trip} total={total} />
        </div>

        {step === 'identify' && (
          <div className="card cp pop-in">
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
              Who are you?
            </div>
            <div style={{ fontSize: 14, color: '#8a7a6a', marginBottom: 20 }}>
              Your name helps the organizer track RSVPs. Your pledge amount
              stays private — only you can see it.
            </div>
            <div className="form-group">
              <label className="lbl">Your name</label>
              <input
                className="inp"
                placeholder="First name or nickname"
                value={pledger}
                onChange={(e) => setPledger(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleIdentify()}
              />
            </div>
            {err && <div className="err">{err}</div>}
            <button
              className="btn btn-dark btn-full"
              style={{ marginTop: 8 }}
              onClick={handleIdentify}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 'pledge' && (
          <div className="card cp pop-in">
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
              {isReturn
                ? `Update your pledge, ${pledger.split(' ')[0]}`
                : `Hey ${pledger.split(' ')[0]}, what's your pledge?`}
            </div>
            <div style={{ fontSize: 14, color: '#8a7a6a', marginBottom: 22 }}>
              {isReturn
                ? `Currently ${fmt(
                    existing.amount
                  )}. You can go higher, not lower.`
                : `This is private. Only you see your number. Minimum is ${fmt(
                    trip.minBuyIn
                  )}.`}
            </div>
            <div className="form-group">
              <label className="lbl">Your pledge</label>
              <div className="amt-wrap">
                <span className="amt-sym">$</span>
                <input
                  className="amt-inp"
                  type="number"
                  min={trip.minBuyIn}
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p className="hint">
                Dream tier avg: <strong>{fmtR(dreamR.lo, dreamR.hi)}</strong>
                /person ({trip.minAttendees}–{trip.maxAttendees} attendees)
              </p>
            </div>
            {trip.topN > 0 && (
              <>
                <div className="divider" />
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                  One quick question
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: '#5a4a3a',
                    marginBottom: 14,
                    lineHeight: 1.6,
                  }}
                >
                  If you end up being a top {trip.topN} contributor, do you want
                  people to know who you are?
                </div>
                <div className="radio-group">
                  <label
                    className={`radio-opt ${wantsCredit === true ? 'sel' : ''}`}
                  >
                    <input
                      type="radio"
                      name="credit"
                      checked={wantsCredit === true}
                      onChange={() => setWC(true)}
                    />
                    <span className="ro-lbl">
                      Yes, show my name if I'm in the top {trip.topN}
                    </span>
                  </label>
                  <label
                    className={`radio-opt ${
                      wantsCredit === false ? 'sel' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="credit"
                      checked={wantsCredit === false}
                      onChange={() => setWC(false)}
                    />
                    <span className="ro-lbl">
                      No, keep me anonymous either way
                    </span>
                  </label>
                </div>
              </>
            )}
            {err && (
              <div className="err" style={{ marginTop: 12 }}>
                {err}
              </div>
            )}
            <button
              className="btn btn-gold btn-full"
              style={{ marginTop: 24 }}
              onClick={handlePledge}
            >
              Review my pledge →
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="card cp pop-in">
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
              Confirm your pledge
            </div>
            <div
              style={{
                background: '#f5f0e8',
                borderRadius: 10,
                padding: '24px',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 13, color: '#8a7a6a', marginBottom: 4 }}>
                Your pledge
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 48,
                  color: '#1a1410',
                }}
              >
                {fmt(val)}
              </div>
              <div style={{ fontSize: 13, color: '#9a8a7a', marginTop: 4 }}>
                Not charged until the trip confirms
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, color: '#8a7a6a', marginBottom: 8 }}>
                What your pledge does for the group
              </div>
              <div
                style={{
                  height: 8,
                  background: '#f0e8da',
                  borderRadius: 100,
                  overflow: 'hidden',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 100,
                    background: 'linear-gradient(90deg,#c17f3a,#e8b86d)',
                    width: `${projPct}%`,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: 13, color: '#5a4a3a' }}>
                Group total would reach <strong>{fmt(projTotal)}</strong> —{' '}
                {projPct}% of dream budget
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#8a7a6a',
                padding: '12px 14px',
                background: '#f9f6f2',
                borderRadius: 8,
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              <strong>Pre-agreed rules:</strong>
              <br />
              Not enough? →{' '}
              {trip.fallback === 'minimum'
                ? 'Run on minimum budget'
                : trip.fallback === 'cancel'
                ? 'Cancel & refund'
                : 'Organizer decides'}
              <br />
              Too much? →{' '}
              {trip.overage === 'cap'
                ? 'Return surplus'
                : trip.overage === 'tripfund'
                ? 'Surplus → trip fund'
                : 'Organizer decides'}
            </div>
            {err && (
              <div className="err" style={{ marginBottom: 12 }}>
                {err}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setStep('pledge')}
              >
                ← Edit
              </button>
              <button
                className="btn btn-dark"
                style={{ flex: 2 }}
                onClick={handleConfirm}
              >
                Lock in pledge ✓
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="pop-in">
            <div className="success-card">
              <div style={{ fontSize: 44, marginBottom: 14 }}>🥂</div>
              <h2>You're in.</h2>
              <div style={{ fontSize: 16, color: '#c4b49a', lineHeight: 1.6 }}>
                Your pledge of{' '}
                <strong style={{ color: '#e8b86d' }}>{fmt(val)}</strong> is
                locked. Nothing is charged until the trip confirms.
              </div>
            </div>
            <div className="card cp" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>
                Updated group progress
              </div>
              <TierProg
                trip={trip}
                total={trip.pledges.reduce((s, p) => s + p.amount, 0)}
              />
            </div>
            <button
              className="btn btn-ghost btn-full"
              onClick={() => setStep('pledge')}
            >
              Update my pledge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

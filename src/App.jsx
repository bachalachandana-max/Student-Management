import { useState, useEffect, useCallback, useRef } from "react";

// ── Constants ──────────────────────────────────────────────
const DEPTS = ["Computer Science","Electronics & Comm.","Mechanical Engg.","Civil Engineering","Info Technology"];
const DEPT_COLORS = {
  "Computer Science":    "#1d4f91",
  "Electronics & Comm.": "#0891b2",
  "Mechanical Engg.":    "#b45309",
  "Civil Engineering":   "#27500a",
  "Info Technology":     "#7c3aed",
};
const BLOOD = ["O+","O-","A+","A-","B+","B-","AB+","AB-"];
const STATUSES = ["Active","On Leave","Graduated","Suspended"];
const DEMO_USERS = [
  { username:"admin@kluniversity.in",    password:"admin123",  role:"Admin",      name:"Dr. K. Ramaiah"   },
  { username:"registrar@kluniversity.in", password:"reg2024",  role:"Registrar",  name:"Ms. Lakshmi Devi" },
];

// ── Helpers ────────────────────────────────────────────────
function mapUser(u, i) {
  const dept   = DEPTS[i % DEPTS.length];
  const yr     = (i % 4) + 1;
  const admYr  = (2024 - yr + 1).toString();
  const deptCode = { "Computer Science":"CS","Electronics & Comm.":"EC","Mechanical Engg.":"ME","Civil Engineering":"CI","Info Technology":"IT" };
  const roll   = `${admYr.slice(2)}${deptCode[dept]}${String(i+1).padStart(3,"0")}`;
  const gpa    = parseFloat((7 + Math.sin(u.id * 3.7) * 1.5).toFixed(1));
  const ss     = ["Active","Active","Active","Active","On Leave","Graduated"];
  return {
    id: u.id, name:`${u.firstName} ${u.lastName}`, email:u.email, roll,
    dept, year:yr, gpa, status:ss[i%ss.length], phone:u.phone,
    dob:u.birthDate||"", address:u.address?`${u.address.address}, ${u.address.city}`:"",
    bloodGroup:BLOOD[i%BLOOD.length], hostel:i%2===0?"Yes":"No",
    admYear:admYr, avatar:u.image||"", username:u.username,
  };
}

function gpaColor(g) { return g>=9?"#27500a":g>=8?"#1d4f91":g>=7?"#b45309":"#a32d2d"; }
function gpaGrade(g) { return g>=9?"🏆 Distinction":g>=8?"⭐ First Class with Distinction":g>=7?"✅ First Class":"📘 Second Class"; }
function initials(name){ return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }

function StatusBadge({ status }) {
  const map = {
    "Active":     { cls:"#eaf3de","#27500a":"","icon":"✓" },
    "On Leave":   { cls:"#faeeda","#633806":"","icon":"⏱" },
    "Graduated":  { cls:"#e8f0fc","#1d4f91":"","icon":"🎓" },
    "Suspended":  { cls:"#fcebeb","#a32d2d":"","icon":"✗" },
  };
  const colors = {
    "Active":    { bg:"#eaf3de", color:"#27500a" },
    "On Leave":  { bg:"#faeeda", color:"#633806" },
    "Graduated": { bg:"#e8f0fc", color:"#1d4f91" },
    "Suspended": { bg:"#fcebeb", color:"#a32d2d" },
  };
  const c = colors[status] || colors["Active"];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:600,
      background:c.bg, color:c.color,
    }}>{status}</span>
  );
}

// ── Toast ──────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position:"fixed", bottom:26, right:26, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:"#fff", borderLeft:`4px solid ${t.type==="err"?"#a32d2d":"#27500a"}`,
          border:"1px solid #e4e1d8", borderRadius:10, padding:"14px 18px",
          fontSize:14, fontWeight:500, boxShadow:"0 8px 28px rgba(0,0,0,.12)",
          display:"flex", alignItems:"center", gap:10, minWidth:260,
          animation:"fadeUp .25s ease",
        }}>
          <span style={{ fontSize:16 }}>{t.type==="err"?"⚠":"✓"}</span>
          {t.msg}
          <button onClick={()=>removeToast(t.id)} style={{ marginLeft:"auto", background:"none", border:"none", color:"#7a7870", cursor:"pointer", fontSize:18 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ── Login Screen ───────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    if (!email || !pass) { setError("Please enter both credentials."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 900));
    const user = DEMO_USERS.find(x => x.username===email && x.password===pass);
    if (!user) { setError("Invalid credentials."); setLoading(false); return; }
    onLogin(user);
  }

  function fill(u, p) { setEmail(u); setPass(p); setError(""); }

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", background:"#fff", fontFamily:"'DM Sans',sans-serif" }}>
      {/* Left panel */}
      <div style={{
        flex:1, background:"linear-gradient(160deg,#0d2118 0%,#1a3a2a 50%,#0d3330 100%)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"60px 56px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ width:72, height:72, borderRadius:20, background:"#c9a84c", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:32, boxShadow:"0 8px 32px rgba(0,0,0,.3)" }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
        </div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:38, color:"#fff", lineHeight:1.15, marginBottom:12, textAlign:"center" }}>Eduverse</h1>
        <p style={{ color:"rgba(255,255,255,.5)", fontSize:13, letterSpacing:".12em", textTransform:"uppercase", textAlign:"center", marginBottom:52 }}>Student Information System</p>
        {[
          ["📊","Real-time student analytics & GPA tracking"],
          ["🔒","Role-based secure access control"],
          ["🎓","Complete academic records management"],
          ["📋","Enrollment, edits & departmental filters"],
        ].map(([icon, text]) => (
          <div key={text} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18, width:"100%", maxWidth:360 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
            <span style={{ color:"rgba(255,255,255,.65)", fontSize:13.5, lineHeight:1.5 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div style={{ width:480, background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 52px" }}>
        <div style={{ width:"100%", maxWidth:340 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:".14em", textTransform:"uppercase", color:"#2d6a4f", marginBottom:8 }}>Welcome back</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:30, color:"#1a1916", marginBottom:6, lineHeight:1.2 }}>Sign in to your account</h2>
          <p style={{ fontSize:13, color:"#7a7870", marginBottom:32 }}>Access the student records portal</p>

          {/* Demo box */}
          <div style={{ background:"#fdf5e0", border:"1px solid #e8d48b", borderRadius:10, padding:"14px 16px", marginBottom:28 }}>
            <p style={{ fontSize:11, fontWeight:600, color:"#633806", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Demo credentials — click to fill</p>
            {DEMO_USERS.map(u => (
              <button key={u.username} onClick={()=>fill(u.username,u.password)} style={{ display:"block", width:"100%", textAlign:"left", background:"rgba(201,168,76,.12)", border:"1px solid rgba(201,168,76,.3)", borderRadius:8, padding:"7px 12px", marginBottom:6, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                <strong style={{ color:"#1a1916", fontSize:12.5 }}>{u.name}</strong>
                <em style={{ color:"#7a7870", fontSize:11, fontStyle:"normal", marginLeft:6 }}>({u.role})</em>
              </button>
            ))}
          </div>

          {/* Email */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:11.5, fontWeight:600, color:"#7a7870", letterSpacing:".06em", textTransform:"uppercase", marginBottom:6 }}>Email address</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7a7870" }}>✉</span>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="name@eduverse.in"
                style={{ width:"100%", padding:"11px 14px 11px 38px", border:"1.5px solid #e4e1d8", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#1a1916", background:"#fff", outline:"none", boxSizing:"border-box" }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:11.5, fontWeight:600, color:"#7a7870", letterSpacing:".06em", textTransform:"uppercase", marginBottom:6 }}>Password</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7a7870" }}>🔒</span>
              <input value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} type="password" placeholder="Enter your password"
                style={{ width:"100%", padding:"11px 14px 11px 38px", border:"1.5px solid #e4e1d8", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#1a1916", background:"#fff", outline:"none", boxSizing:"border-box" }} />
            </div>
          </div>

          {error && <div style={{ background:"#fcebeb", border:"1px solid #f09595", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#a32d2d", marginBottom:16 }}>{error}</div>}

          <button onClick={doLogin} disabled={loading} style={{
            width:"100%", padding:13, border:"none", borderRadius:10,
            background: loading ? "#9ca3af" : "#1a3a2a", color:"#fff",
            fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
            cursor: loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            {loading ? "Signing in…" : "→ Sign in to portal"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar Student Card ───────────────────────────────────
function SidebarCard({ s, active, onSelect, onDelete }) {
  const c = DEPT_COLORS[s.dept] || "#1d4f91";
  const gc = gpaColor(s.gpa);
  const ini = initials(s.name);
  return (
    <div onClick={onSelect} style={{
      background:"#fff", border:`1.5px solid ${active?"#2d6a4f":"#e4e1d8"}`,
      borderRadius:10, padding:"12px 13px", marginBottom:8, cursor:"pointer",
      transition:"all .15s", position:"relative",
      boxShadow: active ? "0 0 0 3px rgba(45,106,79,.1)" : "none",
    }}>
      {active && <div style={{ position:"absolute", left:0, top:6, bottom:6, width:3, background:"#2d6a4f", borderRadius:"0 3px 3px 0" }} />}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:`${c}18`, color:c, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0, overflow:"hidden", position:"relative" }}>
          {s.avatar && <img src={s.avatar} alt={s.name} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute" }} onError={e=>e.target.style.display="none"} />}
          {ini}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13.5, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
          <div style={{ fontSize:11, color:"#7a7870", marginTop:1 }}>{s.roll}</div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontSize:15, fontWeight:600, color:gc }}>{s.gpa.toFixed(1)}</div>
          <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:".04em", color:"#7a7870" }}>CGPA</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:9 }}>
        <span style={{ background:`${c}14`, color:c, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{s.dept}</span>
        <StatusBadge status={s.status} />
        <button onClick={e=>{e.stopPropagation();onDelete(s.id);}} style={{ marginLeft:"auto", background:"none", border:"none", color:"#e4e1d8", cursor:"pointer", fontSize:13, padding:"2px 5px", borderRadius:6 }}>✕</button>
      </div>
    </div>
  );
}

// ── Big Directory Card ─────────────────────────────────────
function BigCard({ s, onClick, delay }) {
  const c = DEPT_COLORS[s.dept] || "#1d4f91";
  const gc = gpaColor(s.gpa);
  const ini = initials(s.name);
  return (
    <div onClick={onClick} style={{
      background:"#fff", border:"1px solid #e4e1d8", borderRadius:14,
      overflow:"hidden", cursor:"pointer", transition:"all .2s",
      animationDelay:`${delay}s`,
    }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(26,58,42,.1)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
      <div style={{ height:4, background:`linear-gradient(90deg,${c},${c}66)` }} />
      <div style={{ padding:"18px 18px 16px" }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:`${c}18`, color:c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, marginBottom:12, overflow:"hidden", position:"relative" }}>
          {s.avatar && <img src={s.avatar} alt={s.name} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute" }} onError={e=>e.target.style.display="none"} />}
          {ini}
        </div>
        <div style={{ fontSize:15, fontWeight:700, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
        <div style={{ fontSize:11.5, color:"#7a7870", marginBottom:10 }}>{s.roll}</div>
        <span style={{ background:`${c}14`, color:c, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{s.dept}</span>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <StatusBadge status={s.status} />
            <span style={{ background:"#f4f3ef", borderRadius:6, padding:"2px 7px", fontSize:11, fontWeight:600 }}>Yr {s.year}</span>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:20, fontWeight:700, color:gc, lineHeight:1 }}>{s.gpa.toFixed(1)}</div>
            <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:".04em", color:"#7a7870" }}>CGPA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Directory View ─────────────────────────────────────────
function DirectoryView({ students, deptFilter, setDeptFilter, onSelectStudent }) {
  const shown = deptFilter
    ? students.filter(s=>s.dept===deptFilter).sort((a,b)=>a.name.localeCompare(b.name))
    : [...students].sort((a,b)=>a.name.localeCompare(b.name));

  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:30, lineHeight:1.15 }}>Student Directory</h1>
      </div>

      {/* Dept chips */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:22 }}>
        {DEPTS.map(d => {
          const c = DEPT_COLORS[d];
          const cnt = students.filter(s=>s.dept===d).length;
          const on = deptFilter===d;
          return (
            <div key={d} onClick={()=>setDeptFilter(on?"":d)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:8,
              background: on ? c : "#fff", border:`1.5px solid ${on?c:c+"44"}`,
              cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .15s",
            }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background: on?"#fff":c, display:"inline-block" }} />
              <span style={{ color: on?"#fff":c }}>{d}</span>
              <span style={{ fontSize:11, color: on?"rgba(255,255,255,.65)":"#7a7870" }}>{cnt}</span>
            </div>
          );
        })}
      </div>

      {students.length === 0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px", color:"#7a7870" }}>
          <div style={{ fontSize:42, marginBottom:12, animation:"spin 1s linear infinite" }}>⟳</div>
          <p style={{ fontSize:14 }}>Fetching from DummyJSON API…</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
          {shown.map((s,i) => (
            <BigCard key={s.id} s={s} onClick={()=>onSelectStudent(s)} delay={i*0.04} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Profile View ───────────────────────────────────────────
function ProfileView({ s, onBack, onEdit }) {
  const c  = DEPT_COLORS[s.dept] || "#1d4f91";
  const gc = gpaColor(s.gpa);
  const ini = initials(s.name);
  const pct = Math.min(100, (s.gpa/10)*100);
  const circ = 2*Math.PI*22;

  function InfoRow({ icon, label, value }) {
    return (
      <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 0", borderBottom:"1px solid #f4f3ef" }}>
        <span style={{ fontSize:15, color:"#7a7870", width:20, textAlign:"center", marginTop:1, flexShrink:0 }}>{icon}</span>
        <div>
          <div style={{ fontSize:10.5, color:"#7a7870", textTransform:"uppercase", letterSpacing:".06em", fontWeight:600 }}>{label}</div>
          <div style={{ fontSize:13.5, fontWeight:500, marginTop:2 }}>{value||"—"}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"1.5px solid #e4e1d8", borderRadius:9, padding:"7px 16px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, marginBottom:18, display:"flex", alignItems:"center", gap:6 }}>← Back to Directory</button>

      {/* Stat strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:18 }}>
        {[
          [s.gpa.toFixed(1),"CGPA",gc],
          [Math.floor(s.gpa*8+20),"Credits","#1a1916"],
          [s.year,"Year","#1a1916"],
        ].map(([n,l,col]) => (
          <div key={l} style={{ background:"#fff", border:"1px solid #e4e1d8", borderRadius:10, padding:16, textAlign:"center", boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize:26, fontWeight:700, lineHeight:1, color:col }}>{n}</div>
            <div style={{ fontSize:11, color:"#7a7870", textTransform:"uppercase", letterSpacing:".06em", marginTop:3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Hero */}
      <div style={{ background:"#fff", border:"1px solid #e4e1d8", borderRadius:14, overflow:"hidden", marginBottom:18, boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>
        <div style={{ background:`linear-gradient(135deg,${c},${c}99)`, padding:"28px 28px 24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:18 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden", position:"relative" }}>
              {s.avatar && <img src={s.avatar} alt={s.name} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute" }} onError={e=>e.target.style.display="none"} />}
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#fff" }}>{ini}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:22, fontWeight:700, color:"#fff", fontFamily:"'DM Serif Display',serif" }}>{s.name}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.7)", marginTop:3 }}>{s.roll} · {s.email}</div>
              <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
                <span style={{ background:"rgba(255,255,255,.18)", color:"#fff", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{s.dept}</span>
                <span style={{ background:"rgba(255,255,255,.18)", color:"#fff", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:600 }}>Year {s.year}</span>
                <StatusBadge status={s.status} />
              </div>
            </div>
            <button onClick={onEdit} style={{ background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.3)", borderRadius:9, padding:"8px 16px", color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>✏ Edit</button>
          </div>
        </div>

        {/* GPA bar */}
        <div style={{ padding:"18px 28px", borderBottom:"1px solid #f4f3ef", display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ position:"relative", width:60, height:60, flexShrink:0 }}>
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="22" fill="none" stroke="#e4e1d8" strokeWidth="4"/>
              <circle cx="30" cy="30" r="22" fill="none" stroke={gc} strokeWidth="4"
                strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
                style={{ transition:"stroke-dasharray 1.2s" }}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:gc }}>{s.gpa.toFixed(1)}</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:600, marginBottom:6 }}>
              <span>CGPA Score</span><span style={{ color:gc }}>{s.gpa}/10</span>
            </div>
            <div style={{ height:6, background:"#f4f3ef", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${gc},${gc}88)`, borderRadius:3, transition:"width 1.2s" }} />
            </div>
            <div style={{ fontSize:12, color:"#7a7870", marginTop:5 }}>{gpaGrade(s.gpa)}</div>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
          <div style={{ padding:"18px 28px", borderRight:"1px solid #f4f3ef" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#2d6a4f", textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>Personal Details</div>
            <InfoRow icon="📅" label="Date of Birth" value={s.dob} />
            <InfoRow icon="🩸" label="Blood Group" value={s.bloodGroup} />
            <InfoRow icon="📞" label="Phone" value={s.phone} />
            <InfoRow icon="📍" label="Address" value={s.address} />
          </div>
          <div style={{ padding:"18px 28px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#2d6a4f", textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>Academic Details</div>
            <InfoRow icon="📅" label="Admission Year" value={s.admYear} />
            <InfoRow icon="🏠" label="Accommodation" value={s.hostel==="Yes"?"Hostel Resident":"Day Scholar"} />
            <InfoRow icon="✉" label="Email" value={s.email} />
            <InfoRow icon="🚩" label="Status" value={s.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Form View (Add / Edit) ─────────────────────────────────
function FormView({ student, onSave, onCancel, addToast }) {
  const isEdit = !!student;
  const [form, setForm] = useState(student ? {...student} : {
    name:"",dob:"",email:"",phone:"",bloodGroup:"O+",address:"",
    roll:"",dept:DEPTS[0],year:1,admYear:"2024",gpa:0,status:"Active",hostel:"No",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function set(k,v) { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); }

  async function handleSave() {
    const errs = {};
    if (!form.name?.trim()) errs.name = "Full name is required";
    if (!form.email?.includes("@")) errs.email = "Valid email required";
    if (!form.roll?.trim()) errs.roll = "Roll number is required";
    if (isNaN(form.gpa)||form.gpa<0||form.gpa>10) errs.gpa = "GPA must be 0–10";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r=>setTimeout(r,700));
    if (Math.random()<0.04) { addToast("Save failed. Please try again.","err"); setSaving(false); return; }
    onSave({...form, gpa:parseFloat(form.gpa), year:parseInt(form.year), id:student?.id||Date.now()});
    addToast(isEdit?"Student record updated successfully.":"New student enrolled successfully.");
  }

  function Field({ label, name, type="text", req, placeholder }) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        <label style={{ fontSize:11.5, fontWeight:600, color:"#7a7870", textTransform:"uppercase", letterSpacing:".06em" }}>
          {label}{req&&<span style={{color:"#a32d2d"}}> *</span>}
        </label>
        <input value={form[name]||""} onChange={e=>set(name,e.target.value)} type={type} placeholder={placeholder}
          style={{ padding:"10px 12px", border:`1.5px solid ${errors[name]?"#a32d2d":"#e4e1d8"}`, borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13.5, color:"#1a1916", background:"#fff", outline:"none", width:"100%", boxSizing:"border-box" }} />
        {errors[name] && <span style={{fontSize:11,color:"#a32d2d"}}>{errors[name]}</span>}
      </div>
    );
  }

  function Select({ label, name, opts }) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        <label style={{ fontSize:11.5, fontWeight:600, color:"#7a7870", textTransform:"uppercase", letterSpacing:".06em" }}>{label}</label>
        <select value={form[name]||""} onChange={e=>set(name,e.target.value)}
          style={{ padding:"10px 12px", border:"1.5px solid #e4e1d8", borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13.5, color:"#1a1916", background:"#fff", outline:"none" }}>
          {opts.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }

  const sectionHd = (title) => (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <div style={{ height:1.5, width:18, background:"#2d6a4f", borderRadius:2 }} />
      <span style={{ fontSize:11, fontWeight:700, color:"#2d6a4f", textTransform:"uppercase", letterSpacing:".1em" }}>{title}</span>
      <div style={{ flex:1, height:1, background:"#f9f8f5" }} />
    </div>
  );

  return (
    <div>
      {isEdit && (
        <button onClick={onCancel} style={{ background:"none", border:"1.5px solid #e4e1d8", borderRadius:9, padding:"7px 16px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, marginBottom:18, display:"flex", alignItems:"center", gap:6 }}>← Back to Profile</button>
      )}
      <div style={{ background:"#fff", border:"1px solid #e4e1d8", borderRadius:14, padding:"28px 32px", boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, marginBottom:24 }}>{isEdit?"✏ Edit Student Record":"📋 Enroll New Student"}</h2>

        <div style={{ marginBottom:26 }}>
          {sectionHd("Personal Information")}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Field label="Full Name" name="name" req />
            <Field label="Date of Birth" name="dob" type="date" />
            <Field label="Email Address" name="email" type="email" req />
            <Field label="Phone Number" name="phone" />
            <Select label="Blood Group" name="bloodGroup" opts={BLOOD} />
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Residential Address" name="address" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom:26 }}>
          {sectionHd("Academic Information")}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Field label="Roll Number" name="roll" req />
            <Select label="Department" name="dept" opts={DEPTS} />
            <Field label="Year of Study" name="year" type="number" />
            <Field label="Admission Year" name="admYear" />
            <Field label="CGPA (0–10)" name="gpa" type="number" req />
            <Select label="Status" name="status" opts={STATUSES} />
            <Select label="Hostel" name="hostel" opts={["Yes","No"]} />
          </div>
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:10, borderTop:"1px solid #f9f8f5", marginTop:4 }}>
          <button onClick={onCancel} style={{ padding:"10px 22px", borderRadius:9, background:"#f9f8f5", border:"1.5px solid #e4e1d8", color:"#1a1916", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding:"10px 26px", borderRadius:9, background: saving?"#9ca3af":"#1a3a2a", border:"none", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor: saving?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:8 }}>
            {saving ? "Saving…" : "💾 Save Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Delete Modal ───────────────────────────────────
function ConfirmModal({ student, onConfirm, onCancel }) {
  if (!student) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.45)", zIndex:8000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(3px)" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"32px 36px", maxWidth:400, width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:"#fcebeb", border:"2px solid #f09595", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 18px" }}>⚠</div>
        <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, textAlign:"center", marginBottom:10 }}>Confirm Deletion</h3>
        <p style={{ color:"#7a7870", fontSize:14, textAlign:"center", lineHeight:1.6, marginBottom:26 }}>
          Are you sure you want to permanently delete the record for <strong>{student.name}</strong> ({student.roll})? This action cannot be undone.
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:10, borderRadius:9, background:"#f9f8f5", border:"1.5px solid #e4e1d8", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:10, borderRadius:9, background:"#a32d2d", border:"none", color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState(null);
  const [route, setRoute]             = useState("list"); // list | profile | edit | add
  const [currentStudent, setCurrentStudent] = useState(null);
  const [search, setSearch]           = useState("");
  const [deptFilter, setDeptFilter]   = useState("");
  const [sort, setSort]               = useState("name");
  const [deptFilterDir, setDeptFilterDir] = useState(""); // for directory chip filter
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [toasts, setToasts]           = useState([]);
  const toastId = useRef(0);
  const userMenuRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Load students from API
  const loadStudents = useCallback(async () => {
    setLoading(true); setApiError(null);
    try {
      const r = await fetch("https://dummyjson.com/users?limit=30");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      setStudents(d.users.map(mapUser));
    } catch(e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) loadStudents();
  }, [currentUser, loadStudents]);

  // Close user menu on outside click
  useEffect(() => {
    function handler(e) { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  function addToast(msg, type="ok") {
    const id = ++toastId.current;
    setToasts(t => [...t, {id, msg, type}]);
    setTimeout(() => setToasts(t => t.filter(x=>x.id!==id)), 4000);
  }

  // Filtered + sorted students
  const filtered = students
    .filter(s => (!deptFilter||s.dept===deptFilter) && (!search||(s.name+s.roll+s.email).toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=> sort==="gpa"?b.gpa-a.gpa:sort==="roll"?a.roll.localeCompare(b.roll):a.name.localeCompare(b.name));

  // Stats
  const totalActive = students.filter(s=>s.status==="Active").length;
  const avgGpa = students.length ? (students.reduce((a,s)=>a+s.gpa,0)/students.length).toFixed(1) : "—";

  function handleLogin(user) { setCurrentUser(user); }
  function handleLogout() {
    setCurrentUser(null); setStudents([]); setRoute("list");
    setCurrentStudent(null); setSearch(""); setDeptFilter("");
    setUserMenuOpen(false);
  }

  function openProfile(s) { setCurrentStudent(s); setRoute("profile"); }

  function handleSave(data) {
    if (data.id && students.find(s=>s.id===data.id)) {
      setStudents(prev => prev.map(s=>s.id===data.id?{...s,...data}:s));
      setCurrentStudent(data);
      setRoute("profile");
    } else {
      setStudents(prev => [data, ...prev]);
      setRoute("list");
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setStudents(prev => prev.filter(s=>s.id!==deleteTarget.id));
    if (currentStudent?.id===deleteTarget.id) { setCurrentStudent(null); setRoute("list"); }
    setDeleteTarget(null);
    addToast("Student record removed.");
  }

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  const userInitials = currentUser.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#f4f3ef", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Header */}
      <header style={{ background:"linear-gradient(90deg,#0d2118,#1a3a2a)", padding:"0 28px", height:62, display:"flex", alignItems:"center", gap:16, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:"#c9a84c", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
        </div>
        <div>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:"#fff", lineHeight:1 }}>Eduverse</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:".1em" }}>Student Information System</div>
        </div>
        <div style={{ width:1, height:28, background:"rgba(255,255,255,.15)", margin:"0 4px" }} />
        {["list","add"].map(r => (
          <button key={r} onClick={()=>setRoute(r)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, background: route===r?"rgba(255,255,255,.12)":"none", border:`1px solid ${route===r?"rgba(255,255,255,.2)":"transparent"}`, color: route===r?"#fff":"rgba(255,255,255,.55)", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500 }}>
            {r==="list"?"👥 Students":"＋ Enroll Student"}
          </button>
        ))}

        {/* User pill */}
        <div ref={userMenuRef} onClick={()=>setUserMenuOpen(v=>!v)} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:10, padding:"6px 14px", cursor:"pointer", position:"relative" }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"#c9a84c", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Serif Display',serif", fontSize:12, color:"#fff" }}>{userInitials}</div>
          <div>
            <div style={{ fontSize:12.5, fontWeight:500, color:"#fff", lineHeight:1.1 }}>{currentUser.name}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.45)" }}>{currentUser.role}</div>
          </div>
          <span style={{ color:"rgba(255,255,255,.45)", fontSize:13 }}>▾</span>

          {userMenuOpen && (
            <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"#fff", border:"1px solid #e4e1d8", borderRadius:10, boxShadow:"0 4px 16px rgba(0,0,0,.1)", minWidth:200, zIndex:200, overflow:"hidden" }}>
              <div style={{ padding:"14px 16px", borderBottom:"1px solid #e4e1d8" }}>
                <strong style={{ display:"block", fontSize:13 }}>{currentUser.name}</strong>
                <span style={{ fontSize:11, color:"#7a7870" }}>{currentUser.username}</span>
              </div>
              <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 16px", background:"none", border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#a32d2d", cursor:"pointer" }}>🚪 Sign out</button>
            </div>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e4e1d8", padding:"0 28px", height:36, display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#7a7870" }}>
        🏠 <span>Home</span><span>›</span>
        <a onClick={()=>setRoute("list")} style={{ color:"#2d6a4f", fontWeight:500, cursor:"pointer" }}>Student Records</a>
        {(route==="profile"||route==="edit") && currentStudent && <><span>›</span><span>{currentStudent.name}</span></>}
        {route==="add" && <><span>›</span><span>Enroll Student</span></>}
      </div>

      {/* Layout */}
      <div style={{ display:"flex", maxWidth:1380, margin:"0 auto" }}>
        {/* Sidebar */}
        <aside style={{ width:340, minWidth:280, background:"#fff", borderRight:"1px solid #e4e1d8", height:"calc(100vh - 98px)", display:"flex", flexDirection:"column", position:"sticky", top:98, overflow:"hidden" }}>
          <div style={{ padding:"16px 16px 0" }}>
            {/* Stats */}
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[["Total",students.length],["Active",totalActive],["Avg GPA",avgGpa]].map(([l,v])=>(
                <div key={l} style={{ flex:1, background:"#f9f8f5", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:9.5, fontWeight:600, color:"#7a7870", textTransform:"uppercase", letterSpacing:".07em", marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:20, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ position:"relative", marginBottom:10 }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:15, color:"#7a7870" }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, roll, email…"
                style={{ width:"100%", padding:"9px 32px 9px 32px", border:"1.5px solid #e4e1d8", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#1a1916", background:"#f9f8f5", outline:"none", boxSizing:"border-box" }} />
              {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#7a7870", cursor:"pointer", fontSize:18 }}>×</button>}
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:7, marginBottom:10 }}>
              <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} style={{ flex:1, background:"#f9f8f5", border:"1.5px solid #e4e1d8", borderRadius:8, padding:"7px 8px", fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#1a1916", outline:"none" }}>
                <option value="">All Departments</option>
                {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{ flex:1, background:"#f9f8f5", border:"1.5px solid #e4e1d8", borderRadius:8, padding:"7px 8px", fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#1a1916", outline:"none" }}>
                <option value="name">Name A–Z</option>
                <option value="roll">Roll No.</option>
                <option value="gpa">Top GPA</option>
              </select>
            </div>
            <div style={{ fontSize:11, fontWeight:600, color:"#7a7870", textTransform:"uppercase", letterSpacing:".06em", paddingBottom:8, borderBottom:"1px solid #e4e1d8" }}>
              {filtered.length} student{filtered.length!==1?"s":""}
            </div>
          </div>

          {/* List */}
          <div style={{ flex:1, overflowY:"auto", padding:"8px 14px 14px" }}>
            {loading && [1,2,3,4].map(i=>(
              <div key={i} style={{ height:84, borderRadius:10, marginBottom:8, background:"linear-gradient(90deg,#f0ede6 25%,#e8e4db 37%,#f0ede6 63%)", backgroundSize:"400px 100%", animation:"shimmer 1.4s ease infinite" }} />
            ))}
            {apiError && (
              <div style={{ textAlign:"center", padding:"20px 10px" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>📡</div>
                <p style={{ color:"#a32d2d", fontWeight:600, fontSize:13 }}>{apiError}</p>
                <button onClick={loadStudents} style={{ marginTop:10, padding:"7px 16px", borderRadius:8, background:"#a32d2d", border:"none", color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12 }}>Retry</button>
              </div>
            )}
            {!loading && !apiError && filtered.length===0 && students.length>0 && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px", color:"#7a7870" }}>
                <span style={{ fontSize:32, marginBottom:8 }}>🔍</span>
                <p style={{ fontSize:14 }}>No students found</p>
              </div>
            )}
            {!loading && filtered.map(s=>(
              <SidebarCard key={s.id} s={s}
                active={currentStudent?.id===s.id && (route==="profile"||route==="edit")}
                onSelect={()=>openProfile(s)}
                onDelete={()=>setDeleteTarget(s)} />
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex:1, padding:"28px 32px", overflowY:"auto", height:"calc(100vh - 98px)" }}>
          {apiError && route==="list" && (
            <div style={{ background:"#fcebeb", border:"1px solid #f09595", borderRadius:12, padding:28, textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📡</div>
              <p style={{ color:"#a32d2d", fontWeight:600, marginBottom:6 }}>Failed to load student data</p>
              <small style={{ color:"#7a7870", fontSize:13, display:"block", marginBottom:16 }}>{apiError}</small>
              <button onClick={loadStudents} style={{ padding:"8px 20px", borderRadius:8, background:"#a32d2d", border:"none", color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>Retry</button>
            </div>
          )}

          {!apiError && route==="list" && (
            <DirectoryView students={students} deptFilter={deptFilterDir} setDeptFilter={setDeptFilterDir} onSelectStudent={openProfile} />
          )}
          {!apiError && route==="profile" && currentStudent && (
            <ProfileView s={currentStudent} onBack={()=>setRoute("list")} onEdit={()=>setRoute("edit")} />
          )}
          {(route==="edit") && currentStudent && (
            <FormView student={currentStudent} onSave={handleSave} onCancel={()=>setRoute("profile")} addToast={addToast} />
          )}
          {route==="add" && (
            <FormView student={null} onSave={handleSave} onCancel={()=>setRoute("list")} addToast={addToast} />
          )}
        </main>
      </div>

      {/* Delete Modal */}
      {deleteTarget && <ConfirmModal student={deleteTarget} onConfirm={confirmDelete} onCancel={()=>setDeleteTarget(null)} />}

      {/* Toasts */}
      <Toast toasts={toasts} removeToast={id=>setToasts(t=>t.filter(x=>x.id!==id))} />
    </div>
  );
}

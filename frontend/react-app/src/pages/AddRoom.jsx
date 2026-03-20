import { useState, useRef } from "react";

/* ─── Schema-exact enums ─────────────────────────────────────── */
const PROPERTY_TYPES = ["1RK", "1BHK", "2BHK", "3BHK", "Room", "PG"];
const FURNISHING_OPTS = ["Unfurnished", "Semi-Furnished", "Fully-Furnished"];
const TENANT_PREFS   = ["Boys", "Girls", "Family", "Anyone"];

const AMENITY_LIST = [
  { id: "WiFi",          icon: "📶" },
  { id: "AC",            icon: "❄️" },
  { id: "Parking",       icon: "🚗" },
  { id: "Laundry",       icon: "🧺" },
  { id: "Kitchen",       icon: "🍳" },
  { id: "Gym",           icon: "💪" },
  { id: "Security",      icon: "🔒" },
  { id: "CCTV",          icon: "📹" },
  { id: "Power Backup",  icon: "⚡" },
  { id: "24hr Water",    icon: "💧" },
  { id: "Cleaning",      icon: "🧹" },
  { id: "TV",            icon: "📺" },
];

const INIT = {
  title:           "",
  propertyType:    "",
  rent:            "",
  deposit:         "",
  city:            "",
  area:            "",
  furnishing:      "",
  preferredTenant: "",
  amenities:       [],
  images:          [],
  available:       true,
  ownerContact:    "",
};

export default function AddRoomForm() {
  const [form, setForm]         = useState(INIT);
  const [imagePreviews, setPrev]= useState([]);
  const [status, setStatus]     = useState("idle");
  const fileRef                 = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAmenity = id =>
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(id)
        ? f.amenities.filter(a => a !== id)
        : [...f.amenities, id],
    }));

  const handleImages = e => {
    const files = Array.from(e.target.files).slice(0, 8);
    setPrev(files.map(f => URL.createObjectURL(f)));
    set("images", files);
  };

  const removeImg = i => {
    setPrev(p => p.filter((_, j) => j !== i));
    setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("loading");
    try {
      const fd = new FormData();
      ["title","propertyType","rent","deposit","city","area",
       "furnishing","preferredTenant","ownerContact"].forEach(k => {
        if (form[k] !== "") fd.append(k, form[k]);
      });
      fd.append("available", form.available);
      form.amenities.forEach(a  => fd.append("amenities", a));
      form.images.forEach(img   => fd.append("images",    img));
      const res = await fetch("/api/rooms", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setStatus("success");
      setTimeout(() => { setStatus("idle"); setForm(INIT); setPrev([]); }, 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const busy = status === "loading";

  return (
    <div style={s.page}>
      <div style={s.mesh} />
      <div style={s.orb1} /><div style={s.orb2} /><div style={s.orb3} />

      <div style={s.wrap}>
        <header style={s.hero}>
          <div style={s.heroBadge}>OWNER DASHBOARD</div>
          <h1 style={s.heroTitle}>List Your <em style={s.heroEm}>Property</em></h1>
          <p style={s.heroSub}>Reach thousands of verified seekers instantly</p>
          <div style={s.heroRule} />
        </header>

        <form onSubmit={handleSubmit} style={s.form}>

          {/* ── 1. Listing Details ─────────────────────────────── */}
          <Card accent="#f97316" icon="🏷️" title="Listing Details">
            <div style={s.col1}>
              <Fld label="Listing Title *">
                <input style={s.inp} required
                  placeholder='e.g. "Spacious 2BHK near Metro, Wakad"'
                  value={form.title} onChange={e => set("title", e.target.value)} />
              </Fld>
            </div>

            <div style={s.col2}>
              <Fld label="Property Type *">
                <div style={s.pillRow}>
                  {PROPERTY_TYPES.map(pt => (
                    <PillBtn key={pt} active={form.propertyType === pt}
                      color="#f97316" onClick={() => set("propertyType", pt)}>{pt}</PillBtn>
                  ))}
                </div>
              </Fld>
              <Fld label="Furnishing">
                <div style={s.pillRow}>
                  {FURNISHING_OPTS.map(f => (
                    <PillBtn key={f} active={form.furnishing === f}
                      color="#06b6d4" onClick={() => set("furnishing", f)} small>{f}</PillBtn>
                  ))}
                </div>
              </Fld>
            </div>

            <div style={s.col2}>
              <Fld label="Monthly Rent (₹) *">
                <div style={s.rupeeWrap}>
                  <span style={s.rupeeSign}>₹</span>
                  <input style={{...s.inp, paddingLeft:"36px"}} required type="number" min="0"
                    placeholder="e.g. 9000"
                    value={form.rent} onChange={e => set("rent", e.target.value)} />
                </div>
              </Fld>
              <Fld label="Security Deposit (₹)">
                <div style={s.rupeeWrap}>
                  <span style={s.rupeeSign}>₹</span>
                  <input style={{...s.inp, paddingLeft:"36px"}} type="number" min="0"
                    placeholder="Default: 0"
                    value={form.deposit} onChange={e => set("deposit", e.target.value)} />
                </div>
              </Fld>
            </div>
          </Card>

          {/* ── 2. Location ────────────────────────────────────── */}
          <Card accent="#8b5cf6" icon="📍" title="Location">
            <div style={s.col2}>
              <Fld label="City *">
                <input style={s.inp} required placeholder="e.g. Pune"
                  value={form.city} onChange={e => set("city", e.target.value)} />
              </Fld>
              <Fld label="Area / Locality *">
                <input style={s.inp} required placeholder="e.g. Hinjewadi, Baner"
                  value={form.area} onChange={e => set("area", e.target.value)} />
              </Fld>
            </div>
          </Card>

          {/* ── 3. Tenant Preference ───────────────────────────── */}
          <Card accent="#ec4899" icon="👥" title="Tenant Preference">
            <Fld label="Who can rent this place?">
              <div style={s.pillRow}>
                {TENANT_PREFS.map(t => (
                  <PillBtn key={t} active={form.preferredTenant === t}
                    color="#ec4899" onClick={() => set("preferredTenant", t)}>{t}</PillBtn>
                ))}
              </div>
            </Fld>
            <Fld label="Availability Status">
              <button type="button"
                onClick={() => set("available", !form.available)}
                style={{...s.toggle, ...(form.available ? s.toggleOn : s.toggleOff)}}>
                <span style={{...s.tKnob, ...(form.available ? s.knobOn : s.knobOff)}} />
                <span style={s.tLabel}>
                  {form.available ? "✅  Available Now" : "🔴  Not Available"}
                </span>
              </button>
            </Fld>
          </Card>

          {/* ── 4. Amenities ───────────────────────────────────── */}
          <Card accent="#06b6d4" icon="✨" title="Amenities">
            <p style={s.hint}>Stored as amenities: [String] in your schema</p>
            <div style={s.amenGrid}>
              {AMENITY_LIST.map(a => {
                const on = form.amenities.includes(a.id);
                return (
                  <button key={a.id} type="button" className="amenBtn"
                    onClick={() => toggleAmenity(a.id)}
                    style={{...s.amenBtn, ...(on ? s.amenOn : {})}}>
                    <span style={s.amenIcon}>{a.icon}</span>
                    <span style={s.amenLabel}>{a.id}</span>
                    {on && <span style={s.amenTick}>✓</span>}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* ── 5. Photos ──────────────────────────────────────── */}
          <Card accent="#f59e0b" icon="📸" title="Photos">
            <div className="uploadZone" style={s.uploadZone}
              onClick={() => fileRef.current.click()}>
              <input ref={fileRef} type="file" multiple accept="image/*"
                style={{display:"none"}} onChange={handleImages} />
              <div style={s.uploadIco}>🖼️</div>
              <p style={s.uploadTxt}>Drop or click to upload</p>
              <p style={s.uploadSub}>Up to 8 images · sent as multipart/form-data</p>
            </div>
            {imagePreviews.length > 0 && (
              <div style={s.prevGrid}>
                {imagePreviews.map((src, i) => (
                  <div key={i} style={s.prevItem}>
                    <img src={src} alt="" style={s.prevImg} />
                    <button type="button" onClick={() => removeImg(i)} style={s.prevDel}>×</button>
                    {i === 0 && <span style={s.coverBadge}>Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ── 6. Owner Contact ───────────────────────────────── */}
          <Card accent="#10b981" icon="📞" title="Owner Contact">
            <p style={s.hint}>
              owner ObjectId is injected server-side from your JWT — just provide a contact number
            </p>
            <Fld label="Contact Number (ownerContact)">
              <input style={s.inp} type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={form.ownerContact}
                onChange={e => set("ownerContact", e.target.value)} />
            </Fld>
          </Card>

          {/* ── Submit ─────────────────────────────────────────── */}
          <button type="submit" disabled={busy} className="submitBtn"
            style={{...s.submitBtn, ...(busy ? s.submitBusy : {})}}>
            {status === "loading" && <span style={s.spinner} />}
            {status === "idle"    && <><span>🚀</span> Publish Listing</>}
            {status === "loading" && "Uploading…"}
            {status === "success" && "✅ Published Successfully!"}
            {status === "error"   && "❌ Something went wrong — retry"}
          </button>

          <p style={s.note}>
            POST <code style={s.code}>/api/rooms</code> · multipart/form-data ·
            owner ref injected from JWT
          </p>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        @keyframes orbFloat{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-38px) scale(1.06);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:translateY(0);}}
        @keyframes gShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes glow{0%,100%{box-shadow:0 8px 40px rgba(139,92,246,.45);}50%{box-shadow:0 8px 60px rgba(249,115,22,.65),0 0 0 6px rgba(139,92,246,.12);}}

        .card-a{animation:fadeUp .5s ease both;}
        .card-a:nth-child(1){animation-delay:.06s}.card-a:nth-child(2){animation-delay:.13s}
        .card-a:nth-child(3){animation-delay:.20s}.card-a:nth-child(4){animation-delay:.27s}
        .card-a:nth-child(5){animation-delay:.34s}.card-a:nth-child(6){animation-delay:.41s}
        .card-a:nth-child(7){animation-delay:.48s}

        input,select,textarea{font-family:'DM Sans',sans-serif;}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,.28);}
        input[type=number]::-webkit-inner-spin-button{opacity:.35;}
        input:focus,textarea:focus{
          outline:none;
          border-color:rgba(139,92,246,.75)!important;
          box-shadow:0 0 0 3px rgba(139,92,246,.18),inset 0 1px 0 rgba(255,255,255,.05)!important;
          background:rgba(255,255,255,.09)!important;
        }

        .amenBtn:hover{transform:translateY(-3px) scale(1.04);border-color:rgba(255,255,255,.35)!important;background:rgba(255,255,255,.1)!important;}
        .uploadZone:hover{border-color:rgba(245,158,11,.7)!important;background:rgba(245,158,11,.07)!important;}
        .submitBtn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 22px 64px rgba(139,92,246,.65)!important;}
        .submitBtn:active:not(:disabled){transform:scale(.985);}

        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,.04);}
        ::-webkit-scrollbar-thumb{background:rgba(139,92,246,.45);border-radius:3px;}
      `}</style>
    </div>
  );
}

function Card({ accent, icon, title, children }) {
  return (
    <div className="card-a" style={{...s.card, borderTopColor: accent}}>
      <div style={s.cardHead}>
        <span style={{...s.cardIco, background: accent+"1a", color: accent}}>{icon}</span>
        <span style={{...s.cardTitle, color: accent}}>{title}</span>
        <div style={{...s.cardLine, background:`linear-gradient(90deg,${accent}55,transparent)`}} />
      </div>
      <div style={s.cardBody}>{children}</div>
    </div>
  );
}

function Fld({ label, children }) {
  return (
    <div style={s.field}>
      <label style={s.lbl}>{label}</label>
      {children}
    </div>
  );
}

function PillBtn({ active, color, onClick, children, small }) {
  return (
    <button type="button" onClick={onClick} style={{
      ...s.pill, ...(small ? s.pillSm : {}),
      ...(active ? {background:color, borderColor:color, color:"#fff",
                    boxShadow:`0 0 18px ${color}66`} : {}),
    }}>{children}</button>
  );
}

const s = {
  page:{
    minHeight:"100vh",
    background:"linear-gradient(145deg,#07040f 0%,#120825 40%,#060d18 75%,#0a0f1e 100%)",
    padding:"48px 16px 100px",
    position:"relative",overflow:"hidden",
    fontFamily:"'DM Sans',sans-serif",
  },
  mesh:{
    position:"fixed",inset:0,
    background:`radial-gradient(ellipse 80% 50% at 20% 20%,rgba(139,92,246,.12) 0%,transparent 60%),
                radial-gradient(ellipse 60% 40% at 80% 80%,rgba(249,115,22,.10) 0%,transparent 55%),
                radial-gradient(ellipse 50% 60% at 50% 50%,rgba(6,182,212,.07) 0%,transparent 65%)`,
    pointerEvents:"none",
  },
  orb1:{position:"fixed",top:"-120px",right:"-80px",width:"420px",height:"420px",background:"radial-gradient(circle,rgba(139,92,246,.22) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none",animation:"orbFloat 9s ease-in-out infinite"},
  orb2:{position:"fixed",bottom:"-80px",left:"-100px",width:"480px",height:"480px",background:"radial-gradient(circle,rgba(249,115,22,.15) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none",animation:"orbFloat 11s ease-in-out infinite reverse"},
  orb3:{position:"fixed",top:"55%",left:"60%",width:"280px",height:"280px",background:"radial-gradient(circle,rgba(6,182,212,.1) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none",animation:"orbFloat 7s ease-in-out infinite 2s"},

  wrap:{maxWidth:"800px",margin:"0 auto",position:"relative",zIndex:1},

  hero:{textAlign:"center",marginBottom:"52px",animation:"fadeUp .6s ease"},
  heroBadge:{display:"inline-block",padding:"5px 16px",background:"rgba(139,92,246,.15)",border:"1px solid rgba(139,92,246,.35)",borderRadius:"999px",fontSize:"11px",fontWeight:700,color:"rgba(139,92,246,.9)",letterSpacing:"2px",marginBottom:"16px"},
  heroTitle:{fontFamily:"'Syne',sans-serif",fontSize:"clamp(30px,5.5vw,52px)",fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:"12px"},
  heroEm:{fontStyle:"italic",background:"linear-gradient(100deg,#f97316,#ec4899,#8b5cf6,#06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",backgroundSize:"300%",animation:"gShift 5s linear infinite"},
  heroSub:{color:"rgba(255,255,255,.42)",fontSize:"16px",marginBottom:"24px"},
  heroRule:{width:"72px",height:"3px",margin:"0 auto",borderRadius:"2px",background:"linear-gradient(90deg,#f97316,#8b5cf6)"},

  form:{display:"flex",flexDirection:"column",gap:"20px"},

  card:{background:"rgba(255,255,255,.038)",border:"1px solid rgba(255,255,255,.08)",borderTop:"3px solid",borderRadius:"20px",backdropFilter:"blur(24px)",boxShadow:"0 12px 48px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.06)",overflow:"hidden"},
  cardHead:{display:"flex",alignItems:"center",gap:"10px",padding:"18px 24px 14px",background:"rgba(255,255,255,.025)",position:"relative"},
  cardIco:{width:"34px",height:"34px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0},
  cardTitle:{fontFamily:"'Syne',sans-serif",fontSize:"15px",fontWeight:700,letterSpacing:".4px"},
  cardLine:{position:"absolute",bottom:0,left:0,right:0,height:"1px"},
  cardBody:{padding:"22px 24px 28px",display:"flex",flexDirection:"column",gap:"18px"},

  field:{display:"flex",flexDirection:"column",gap:"8px",flex:1},
  lbl:{fontSize:"11.5px",fontWeight:700,color:"rgba(255,255,255,.48)",textTransform:"uppercase",letterSpacing:".9px"},
  inp:{background:"rgba(255,255,255,.065)",border:"1px solid rgba(255,255,255,.11)",borderRadius:"12px",padding:"13px 16px",color:"rgba(255,255,255,.9)",fontSize:"15px",width:"100%",transition:"all .25s"},

  col1:{display:"flex",flexDirection:"column",gap:"18px"},
  col2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},

  rupeeWrap:{position:"relative"},
  rupeeSign:{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,.4)",fontSize:"15px",pointerEvents:"none"},

  pillRow:{display:"flex",flexWrap:"wrap",gap:"8px"},
  pill:{padding:"8px 18px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.14)",borderRadius:"999px",color:"rgba(255,255,255,.65)",fontSize:"13px",fontWeight:600,cursor:"pointer",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"},
  pillSm:{padding:"7px 14px",fontSize:"12px"},

  toggle:{display:"inline-flex",alignItems:"center",gap:"10px",padding:"10px 18px",borderRadius:"999px",border:"1px solid",cursor:"pointer",transition:"all .3s",fontFamily:"'DM Sans',sans-serif"},
  toggleOn:{background:"rgba(16,185,129,.15)",borderColor:"rgba(16,185,129,.5)",boxShadow:"0 0 18px rgba(16,185,129,.2)"},
  toggleOff:{background:"rgba(239,68,68,.1)",borderColor:"rgba(239,68,68,.35)"},
  tKnob:{width:"18px",height:"18px",borderRadius:"50%",display:"inline-block",transition:"all .3s"},
  knobOn:{background:"#10b981",boxShadow:"0 0 8px #10b981"},
  knobOff:{background:"rgba(239,68,68,.7)"},
  tLabel:{fontSize:"14px",fontWeight:600,color:"rgba(255,255,255,.85)"},

  hint:{color:"rgba(255,255,255,.32)",fontSize:"12.5px",marginTop:"-6px"},
  amenGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(108px,1fr))",gap:"10px"},
  amenBtn:{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"14px",padding:"13px 8px",color:"rgba(255,255,255,.7)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",transition:"all .2s",position:"relative",fontFamily:"'DM Sans',sans-serif"},
  amenOn:{background:"linear-gradient(135deg,rgba(6,182,212,.2),rgba(139,92,246,.15))",border:"1px solid rgba(6,182,212,.55)",color:"#fff",boxShadow:"0 0 20px rgba(6,182,212,.2)"},
  amenIcon:{fontSize:"22px"},
  amenLabel:{fontSize:"11px",fontWeight:700,textAlign:"center",letterSpacing:".3px"},
  amenTick:{position:"absolute",top:"7px",right:"9px",fontSize:"10px",color:"#06b6d4",fontWeight:800},

  uploadZone:{border:"2px dashed rgba(245,158,11,.3)",borderRadius:"16px",padding:"44px 24px",textAlign:"center",cursor:"pointer",transition:"all .3s",background:"rgba(245,158,11,.02)"},
  uploadIco:{fontSize:"38px",marginBottom:"10px"},
  uploadTxt:{color:"rgba(255,255,255,.75)",fontSize:"16px",fontWeight:600,marginBottom:"4px"},
  uploadSub:{color:"rgba(255,255,255,.3)",fontSize:"12px"},
  prevGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(96px,1fr))",gap:"10px",marginTop:"6px"},
  prevItem:{position:"relative",borderRadius:"12px",overflow:"hidden",aspectRatio:"1"},
  prevImg:{width:"100%",height:"100%",objectFit:"cover",display:"block"},
  prevDel:{position:"absolute",top:"5px",right:"5px",background:"rgba(0,0,0,.75)",border:"none",color:"#fff",borderRadius:"50%",width:"22px",height:"22px",cursor:"pointer",fontSize:"14px",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"},
  coverBadge:{position:"absolute",bottom:"5px",left:"5px",background:"rgba(249,115,22,.85)",color:"#fff",fontSize:"9px",fontWeight:700,padding:"2px 7px",borderRadius:"999px",letterSpacing:".5px"},

  submitBtn:{background:"linear-gradient(135deg,#f97316,#ec4899 40%,#8b5cf6 75%,#06b6d4)",backgroundSize:"250%",border:"none",borderRadius:"16px",padding:"20px 40px",color:"#fff",fontSize:"18px",fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:"pointer",letterSpacing:".5px",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",transition:"all .3s",animation:"glow 3s ease-in-out infinite,gShift 5s linear infinite",marginTop:"8px"},
  submitBusy:{opacity:.75,cursor:"not-allowed",animation:"gShift 2s linear infinite"},
  spinner:{width:"20px",height:"20px",borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin .8s linear infinite",flexShrink:0},

  note:{textAlign:"center",color:"rgba(255,255,255,.22)",fontSize:"12px",marginTop:"-4px"},
  code:{background:"rgba(255,255,255,.08)",padding:"2px 7px",borderRadius:"5px",color:"rgba(6,182,212,.8)",fontSize:"12px",fontFamily:"monospace"},
};

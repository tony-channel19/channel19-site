import { useState, useEffect, useRef } from "react";

const PAGES = { HOME: "home", CARRIERS: "carriers", BROKERS: "brokers", CARRIER_WF: "carrier-workflows", BROKER_WF: "broker-workflows", TERMS: "terms", PRIVACY: "privacy" };

const TESTIMONIALS_CARRIER = [
  { quote: "I learnt about Channel19 from a fellow fleet leader and decided to give them a chance. They are focused on delivering value to their customers. I highly recommend them to anyone interested in reducing operational costs & increasing their profit margins.", author: "Isael Borges, Director of Fleet Management", company: "Best Carrier Solutions" },
  { quote: "Saves my team a ton of time and is accurate. Channel19 is very responsive to our requests with quick turnaround times. They are unique in their approach to making sure their software works for us rather than the other way around.", author: "Aaron Reibling, Operations Manager", company: "Best Carrier Solutions" },
];

const TESTIMONIALS_BROKER = [
  { quote: "Channel19 AI agent handles the outbound & inbound calls and email, and our reps focus on the loads that need a human touch.", author: "Carrier Sales Director", company: "National 3PL" },
  { quote: "Our reps used to max out at 8–10 loads a day. With Channel19 handling the carrier outreach across calls and email, they're consistently covering twice that — and our buy rates have come down because the agent evaluates so many more options.", author: "VP of Operations", company: "Mid-Size Freight Brokerage" },
  { quote: "As a small brokerage, we don't have the headcount to compete with the big shops on carrier outreach. Channel19 levels the playing field — our AI agent works around the clock covering loads, and we've seen our per-rep productivity double since we started using it.", author: "Owner & Principal Broker", company: "Boutique Brokerage" },
];

const INTEGRATIONS = [
  "DAT","Truckstop","123Loadboard","Parade","McLeod","TMW","Alvys","Turvo",
  "PCS","Loadstop","Highway","Carrier411","MyCarrierPackets","Gmail","Outlook","and more...",
];

const CARRIER_WORKFLOW_VIDEO = "https://www.loom.com/share/9de628c2b07d49d48fc832a067a87dc5";
const CARRIER_VOICE_VIDEO = "https://www.loom.com/share/d0adae18ab06432d9af8dbc04c97169d";
const BROKER_WORKFLOW_VIDEO = "https://www.loom.com/share/e3f827a4232544879a58b967da11cd47";
const BROKER_VOICE_VIDEO = "https://www.loom.com/share/ecc0711fd13346c5b20aaf41e2448eac";

function loomEmbed(u) { const id = u.split("/share/")[1]?.split("?")[0]; return id ? `https://www.loom.com/embed/${id}` : u; }

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  @keyframes c19fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes c19pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  @keyframes c19glow { 0%,100% { opacity:0.15; } 50% { opacity:0.25; } }
  iframe { border:none; }
`;

const C = {
  navy:"#1B2A4A",navyDark:"#0F1A2E",navyDeep:"#0A1220",navyMid:"#243656",navyLight:"#2E4268",
  red:"#E31937",
  white:"#FFFFFF",offWhite:"#F7F8FA",lightGray:"#E8EBF0",midGray:"#94A3B8",darkGray:"#64748B",
  green:"#22C55E",blue:"#3B82F6",
  serif:"'Instrument Serif',Georgia,serif",sans:"'DM Sans',-apple-system,sans-serif",mono:"'SF Mono','Fira Code','Courier New',monospace",
};

const Em = ({ children }) => <span style={{ fontStyle:"italic" }}>{children}</span>;
const SectionLabel = ({ children }) => <div style={{ fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em",color:C.navyLight,marginBottom:16 }}>{children}</div>;
const SectionTitle = ({ children }) => <div style={{ fontFamily:C.serif,fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:400,color:C.navy,lineHeight:1.1,marginBottom:16,letterSpacing:"-0.02em" }}>{children}</div>;
const Divider = () => <div style={{ height:1,background:"linear-gradient(90deg,transparent,rgba(27,42,74,0.08),transparent)",maxWidth:1300,margin:"0 auto" }}/>;
const Section = ({ children, style:s }) => <section style={{ padding:"clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)",maxWidth:1300,margin:"0 auto",...s }}>{children}</section>;

function Logo({ height=30, light, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor:"pointer",display:"flex",alignItems:"center" }}>
      <img src="channel19-logo.svg" alt="Channel19" style={{ height,objectFit:"contain",filter:light?"brightness(0) invert(1)":"none" }} />
    </div>
  );
}

function Nav({ page, setPage }) {
  const [scrolled,setScrolled] = useState(false);
  const [open,setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY>40); window.addEventListener("scroll",h); return () => window.removeEventListener("scroll",h); },[]);
  const go = (p) => { setPage(p); setOpen(false); window.scrollTo(0,0); };
  const items = [[PAGES.HOME,"Home"],[PAGES.CARRIERS,"Carriers"],[PAGES.BROKERS,"Brokers/3PLs & Shippers"]];
  const loginUrl = "https://fleetapp.channel19.io/login";
  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,height:72,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(1rem,4vw,3rem)",background:scrolled?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.92)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${scrolled?"rgba(27,42,74,0.08)":"rgba(27,42,74,0.04)"}`,transition:"all 0.3s" }}>
        <Logo height={26} onClick={() => go(PAGES.HOME)} />
        <div style={{ display:"flex",alignItems:"center" }}>
          {items.map(([p,l]) => (
            <button key={p} onClick={() => go(p)} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:C.sans,fontSize:14,fontWeight:500,color:(page===p||(p===PAGES.CARRIERS&&page===PAGES.CARRIER_WF)||(p===PAGES.BROKERS&&page===PAGES.BROKER_WF))?C.navy:C.darkGray,padding:"8px 16px",borderRadius:8,transition:"color 0.2s",display:"var(--c19-nav-link,inline-block)" }}>{l}</button>
          ))}
          <a href={loginUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily:C.sans,fontSize:14,fontWeight:500,color:C.darkGray,padding:"8px 16px",textDecoration:"none",display:"var(--c19-nav-link,inline-block)" }}>Login</a>
          <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer" style={{ background:C.navy,color:C.white,fontFamily:C.sans,fontWeight:600,fontSize:14,padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",marginLeft:12,display:"var(--c19-nav-link,inline-block)",textDecoration:"none" }}>Book a Demo</a>
          <button onClick={() => setOpen(!open)} style={{ display:"var(--c19-nav-toggle,none)",background:"none",border:"none",cursor:"pointer",padding:8 }}>
            <span style={{ display:"block",width:22,height:2,background:C.navy,borderRadius:2,marginBottom:5 }}/>
            <span style={{ display:"block",width:22,height:2,background:C.navy,borderRadius:2,marginBottom:5 }}/>
            <span style={{ display:"block",width:22,height:2,background:C.navy,borderRadius:2 }}/>
          </button>
        </div>
      </nav>
      {open && (
        <div style={{ position:"fixed",top:72,left:0,right:0,bottom:0,background:"rgba(255,255,255,0.98)",zIndex:99,padding:"2rem",display:"flex",flexDirection:"column",gap:8 }}>
          {items.map(([p,l]) => <button key={p} onClick={() => go(p)} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:C.sans,fontSize:20,fontWeight:500,color:C.navy,padding:"16px 0",textAlign:"left",borderBottom:"1px solid rgba(27,42,74,0.08)" }}>{l}</button>)}
          <a href={loginUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily:C.sans,fontSize:20,fontWeight:500,color:C.navy,padding:"16px 0",textDecoration:"none",borderBottom:"1px solid rgba(27,42,74,0.08)",display:"block" }}>Login</a>
          <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer" style={{ background:C.navy,color:C.white,fontFamily:C.sans,fontWeight:600,fontSize:16,padding:"14px 32px",borderRadius:12,border:"none",cursor:"pointer",marginTop:16,textDecoration:"none",display:"inline-block" }}>Book a Demo →</a>
        </div>
      )}
      <style>{`@media(max-width:900px){:root{--c19-nav-link:none !important;--c19-nav-toggle:flex !important;}}`}</style>
    </>
  );
}

function Btn({ primary, children, onClick, style:s }) {
  const base = primary
    ? { background:C.navy,color:C.white,border:"none",fontWeight:600 }
    : { background:"transparent",color:C.navy,border:`1px solid ${C.lightGray}`,fontWeight:500 };
  return <button onClick={onClick} style={{ fontFamily:C.sans,fontSize:16,padding:"14px 32px",borderRadius:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,transition:"all 0.25s",...base,...s }}>{children}</button>;
}

function Stats({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:`repeat(${items.length},1fr)`,gap:2,borderRadius:20,overflow:"hidden",boxShadow:"0 2px 20px rgba(27,42,74,0.06)" }}>
      {items.map((s,i) => (
        <div key={i} style={{ padding:"clamp(1.5rem,3vw,2.5rem)",textAlign:"center",background:C.white }}>
          <div style={{ fontFamily:C.serif,fontSize:"clamp(1.8rem,3.5vw,2.8rem)",color:C.navy,fontWeight:400 }}>{s.value}</div>
          <div style={{ fontSize:13,color:C.darkGray,fontWeight:500,marginTop:4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Workflow({ steps }) {
  const row1 = steps.slice(0,3);
  const row2 = steps.slice(3);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:2,borderRadius:20,overflow:"hidden",boxShadow:"0 2px 20px rgba(27,42,74,0.06)" }}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2 }}>
        {row1.map((s,i) => (
          <div key={"r1-"+i} style={{ padding:"36px 28px",background:C.white }}>
            <div style={{ fontFamily:C.serif,fontSize:"2.5rem",color:"rgba(27,42,74,0.1)",fontWeight:400,marginBottom:4 }}>0{i+1}</div>
            <h4 style={{ fontSize:16,fontWeight:600,color:C.navy,marginBottom:6 }}>{s.title}</h4>
            <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.55 }}>{s.desc}</p>
          </div>
        ))}
      </div>
      {row2.length>0 && (
        <div style={{ display:"grid",gridTemplateColumns:`repeat(${row2.length},1fr)`,gap:2 }}>
          {row2.map((s,i) => (
            <div key={"r2-"+i} style={{ padding:"36px 28px",background:C.white }}>
              <div style={{ fontFamily:C.serif,fontSize:"2.5rem",color:"rgba(27,42,74,0.1)",fontWeight:400,marginBottom:4 }}>0{i+4}</div>
              <h4 style={{ fontSize:16,fontWeight:600,color:C.navy,marginBottom:6 }}>{s.title}</h4>
              <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.55 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Features({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20 }}>
      {items.map((f,i) => (
        <div key={i} style={{ background:C.white,border:"1px solid rgba(27,42,74,0.06)",borderRadius:16,padding:"32px 28px",boxShadow:"0 2px 12px rgba(27,42,74,0.04)" }}>
          <div style={{ width:42,height:42,background:"rgba(27,42,74,0.05)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:16 }}>{f.icon}</div>
          <h4 style={{ fontSize:16,fontWeight:600,color:C.navy,marginBottom:6 }}>{f.title}</h4>
          <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.55 }}>{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

function LoomVideo({ src, title }) {
  return (
    <div style={{ borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(27,42,74,0.1)",background:C.navy }}>
      <iframe src={loomEmbed(src)} frameBorder="0" allowFullScreen allow="autoplay; fullscreen" style={{ width:"100%",aspectRatio:"16/9",display:"block" }} title={title} />
    </div>
  );
}

function TestimonialCards({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20,marginTop:16 }}>
      {items.map((t,i) => (
        <div key={i} style={{ background:C.white,border:"1px solid rgba(27,42,74,0.06)",borderRadius:20,padding:"36px 30px",boxShadow:"0 2px 12px rgba(27,42,74,0.04)" }}>
          <div style={{ color:"#F59E0B",fontSize:14,marginBottom:16,letterSpacing:2 }}>★★★★★</div>
          <p style={{ fontSize:15,color:C.navyMid,lineHeight:1.65,marginBottom:20,fontStyle:"italic" }}>"{t.quote}"</p>
          <div style={{ fontSize:13,fontWeight:600,color:C.navy }}>{t.author}</div>
          <div style={{ fontSize:12,color:C.darkGray }}>{t.company}</div>
        </div>
      ))}
    </div>
  );
}


function ContactBlock({ label,title,desc,source,formRef }) {
  return (
    <div style={{ padding:"clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)",maxWidth:1300,margin:"0 auto",position:"relative" }}>
      <div ref={formRef} style={{ position:"absolute",top:-80 }}/>
      <div style={{ textAlign:"center",maxWidth:700,margin:"0 auto" }}>
        <SectionLabel>{label}</SectionLabel>
        <SectionTitle>{title}</SectionTitle>
        <p style={{ fontSize:16,color:C.darkGray,lineHeight:1.6,marginBottom:32 }}>{desc}</p>
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12,marginBottom:32 }}>
          {["AI handles calls & email — you keep control","Integrates with your existing tools (TMS, Communication, Compliance, Loadboards etc.)","Live in days, not months","No per-seat pricing — pay for outcomes"].map(t => (
            <div key={t} style={{ display:"flex",alignItems:"center",gap:8,color:C.navy,fontSize:14 }}>
              <span style={{ color:C.green,fontWeight:700 }}>✓</span> {t}
            </div>
          ))}
        </div>
        <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer" style={{ display:"inline-block",background:C.navy,color:C.white,fontFamily:C.sans,fontWeight:600,fontSize:16,padding:"16px 40px",borderRadius:12,textDecoration:"none",transition:"opacity 0.2s" }}>Book a Demo →</a>
        <p style={{ fontSize:14,color:C.darkGray,marginTop:16 }}>Or email us at <a href="mailto:tony@channel19.io" style={{ color:C.navy,textDecoration:"underline" }}>tony@channel19.io</a></p>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo(0,0); };
  const lk = { display:"block",background:"none",border:"none",cursor:"pointer",fontFamily:C.sans,fontSize:14,color:"rgba(255,255,255,0.7)",padding:"4px 0",textAlign:"left" };
  return (
    <footer style={{ background:C.navyDeep,padding:"4rem clamp(1.5rem,6vw,6rem) 2rem" }}>
      <div style={{ maxWidth:1300,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:"3rem",marginBottom:"3rem" }}>
          <div>
            <Logo height={32} light onClick={() => go(PAGES.HOME)} />
            <p style={{ color:"rgba(255,255,255,0.5)",fontSize:14,lineHeight:1.6,maxWidth:300,marginTop:16 }}>AI agents that call, handle inbound calls, and manage email to help book loads in minutes instead of hours.</p>
            <div style={{ marginTop:16,fontSize:13,color:"rgba(255,255,255,0.5)" }}>
              <a href="mailto:tony@channel19.io" style={{ color:"rgba(255,255,255,0.6)",textDecoration:"none" }}>tony@channel19.io</a>
              <span style={{ margin:"0 8px" }}>·</span>
              <a href="tel:+15304000983" style={{ color:"rgba(255,255,255,0.6)",textDecoration:"none" }}>+1 (530) 400-0983</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,0.4)",marginBottom:16 }}>Solutions</h4>
            <button style={lk} onClick={() => go(PAGES.CARRIERS)}>For Carriers</button>
            <button style={lk} onClick={() => go(PAGES.BROKERS)}>For Brokers/3PLs & Shippers</button>
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,color:"rgba(255,255,255,0.4)",flexWrap:"wrap",gap:16 }}>
          <span>© 2026 Channel19, Inc. All rights reserved.</span>
          <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            <button onClick={() => { go(PAGES.TERMS); }} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",textDecoration:"none",fontSize:12,fontFamily:C.sans,padding:0 }}>Terms of Use</button>
            <button onClick={() => { go(PAGES.PRIVACY); }} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",textDecoration:"none",fontSize:12,fontFamily:C.sans,padding:0 }}>Privacy Policy</button>
            <div style={{ display:"flex",gap:14,marginLeft:8 }}>
              <a href="https://www.linkedin.com/company/channel19" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(255,255,255,0.5)",textDecoration:"none",fontSize:16 }} title="LinkedIn">in</a>
              <a href="https://x.com/Channel19Inc" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(255,255,255,0.5)",textDecoration:"none",fontSize:14 }} title="X / Twitter">𝕏</a>
              <a href="https://www.facebook.com/channel19inc" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(255,255,255,0.5)",textDecoration:"none",fontSize:15 }} title="Facebook">f</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══ HOME PAGE ═══
function HomePage({ setPage, formRef }) {
  return (
    <>
      <section style={{ minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px clamp(1.5rem,6vw,6rem) 80px",position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${C.navyDeep} 0%,${C.navy} 100%)` }}>
        <div style={{ position:"absolute",top:-200,right:-100,width:600,height:600,background:"radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:"clamp(2rem,5vw,5rem)",alignItems:"center",maxWidth:1300,margin:"0 auto",width:"100%" }}>
          <div>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:100,padding:"6px 18px 6px 10px",fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.8)",marginBottom:24,animation:"c19fadeUp 0.6s ease-out" }}>
              <span style={{ width:8,height:8,background:C.green,borderRadius:"50%",animation:"c19pulse 2s infinite",display:"inline-block" }}/>
              AI Agents for Freight
            </div>
            <h1 style={{ fontFamily:C.serif,fontSize:"clamp(2.8rem,5.5vw,4.5rem)",lineHeight:1.08,fontWeight:400,color:C.white,marginBottom:24,letterSpacing:"-0.02em",animation:"c19fadeUp 0.6s ease-out 0.1s both" }}>
              AI agents that help Dispatch & Carrier Sales teams book loads in <Em>minutes</Em> instead of hours
            </h1>
            <p style={{ fontSize:"clamp(1rem,1.8vw,1.15rem)",color:C.midGray,lineHeight:1.65,maxWidth:520,marginBottom:40,animation:"c19fadeUp 0.6s ease-out 0.2s both" }}>
              Dispatch and Carrier Sales teams use our AI agents that call, email, and text to help book loads 10× faster — handling outbound calls, inbound calls, and email.
            </p>
            <div style={{ display:"flex",gap:14,flexWrap:"wrap",animation:"c19fadeUp 0.6s ease-out 0.3s both" }}>
              <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer"><Btn primary style={{ background:C.white,color:C.navy }}>Book a Demo →</Btn></a>
              <Btn onClick={() => { setPage(PAGES.CARRIERS); window.scrollTo(0,0); }} style={{ color:"rgba(255,255,255,0.9)",border:"1px solid rgba(255,255,255,0.2)" }}>See How It Works</Btn>
            </div>
          </div>
          <div style={{ animation:"c19fadeUp 0.8s ease-out 0.4s both" }}>
            <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:28,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }}/>
              <div style={{ position:"absolute",top:20,right:20,display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:600,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em" }}>
                <span style={{ width:6,height:6,background:C.green,borderRadius:"50%",animation:"c19pulse 1.5s infinite",display:"inline-block" }}/> Live Agent
              </div>
              <div style={{ display:"flex",gap:6,marginBottom:20 }}>
                <span style={{ width:10,height:10,borderRadius:"50%",background:"#EF4444",display:"inline-block" }}/>
                <span style={{ width:10,height:10,borderRadius:"50%",background:"#F59E0B",display:"inline-block" }}/>
                <span style={{ width:10,height:10,borderRadius:"50%",background:C.green,display:"inline-block" }}/>
              </div>
              <div style={{ fontFamily:C.mono,fontSize:12.5,lineHeight:2,color:C.midGray }}>
                <span style={{ color:"#60A5FA" }}>agent</span> → Dialing <span style={{ color:C.white }}>ABC Logistics</span> for CHI→DAL<br/>
                <span style={{ color:C.green }}>connected</span> → Navigating IVR… hold music…<br/>
                <span style={{ color:"#60A5FA" }}>agent</span> → "53' dry van, rate to Dallas?"<br/>
                <span style={{ color:"#F59E0B" }}>broker</span> → "$2,850 all-in, pickup tomorrow 8am"<br/>
                <span style={{ color:"#60A5FA" }}>agent</span> → Negotiating → <span style={{ color:C.green }}>$2,950 agreed</span><br/>
                <span style={{ color:C.white }}>dispatcher</span> → ✓ <span style={{ color:C.green }}>Approved. Load booked.</span><br/>
                <span style={{ color:"#A78BFA" }}>inbound</span> → Carrier calling about DAL→HOU lane<br/>
                <span style={{ color:"#60A5FA" }}>agent</span> → Qualifying… capacity confirmed ✓<br/>
                <span style={{ color:"#38BDF8" }}>email</span> → Rate sheet from broker parsed → 3 loads added
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section style={{ paddingTop:"clamp(3rem,5vw,5rem)",paddingBottom:0 }}>
        <Stats items={[{value:"2–3×",label:"More loads booked"},{value:"10×",label:"More options evaluated"},{value:"100%",label:"Calls handled"}]}/>
      </Section>

      <Section>
        <SectionLabel>Solutions</SectionLabel>
        <SectionTitle>One platform. <Em>Two solutions.</Em></SectionTitle>
        <p style={{ fontSize:17,color:C.darkGray,lineHeight:1.6,maxWidth:620,marginBottom:32 }}>Whether you're a carrier dispatching trucks or a broker/shipper covering freight — Channel19 has an AI agent that fits your workflow.</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
          {[
            { icon:"🚛",title:"For-Hire Carriers",desc:"AI agent makes outbound calls to brokers, handles inbound broker calls, and processes load emails — negotiating rates and booking the best loads while dispatchers stay in control.",page:PAGES.CARRIERS },
            { icon:"🤝",title:"Brokers/3PLs & Shippers",desc:"AI agent makes outbound calls to carriers, handles inbound carrier calls, and manages email — collecting capacity, negotiating rates, and covering loads faster for your reps and logistics teams.",page:PAGES.BROKERS },
          ].map(card => (
            <div key={card.title} onClick={() => { setPage(card.page); window.scrollTo(0,0); }}
              style={{ background:C.white,border:"1px solid rgba(27,42,74,0.06)",borderRadius:20,padding:"36px 30px",cursor:"pointer",transition:"all 0.35s",boxShadow:"0 2px 12px rgba(27,42,74,0.04)" }}>
              <div style={{ width:52,height:52,background:"rgba(27,42,74,0.05)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:20 }}>{card.icon}</div>
              <h3 style={{ fontFamily:C.serif,fontSize:24,fontWeight:400,color:C.navy,marginBottom:8 }}>{card.title}</h3>
              <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.6,marginBottom:24 }}>{card.desc}</p>
              <span style={{ fontSize:14,fontWeight:600,color:C.navy }}>Learn more →</span>
            </div>
          ))}
        </div>
      </Section>

      <Divider/>
      <Section>
        <SectionLabel>See It In Action</SectionLabel>
        <SectionTitle>Watch our AI agents <Em>book real loads</Em></SectionTitle>
        <p style={{ fontSize:16,color:C.darkGray,maxWidth:600,lineHeight:1.6,marginBottom:32 }}>Real demonstrations of Channel19's AI agents handling calls and booking loads for carriers and brokers.</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24 }}>
          <div>
            <LoomVideo src={CARRIER_WORKFLOW_VIDEO} title="AI Agent for Carriers" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>AI Agent for Carrier Dispatchers</p>
            <p style={{ fontSize:13,color:C.darkGray }}>Agent calls brokers, gathers load details, negotiates, and books.</p>
          </div>
          <div>
            <LoomVideo src={BROKER_WORKFLOW_VIDEO} title="AI Agent for Brokers & Shippers" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>AI Agent for Brokers/3PLs & Shippers</p>
            <p style={{ fontSize:13,color:C.darkGray }}>Agent calls carriers, collects capacity, and covers loads faster.</p>
          </div>
        </div>
      </Section>

      <Divider/>
      <Section style={{ textAlign:"center" }}>
        <SectionLabel>Trusted By</SectionLabel>
        <SectionTitle>Customers of varying sizes stay ahead with <Em>Channel19</Em></SectionTitle>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"center",gap:"clamp(32px,5vw,56px)",marginTop:32 }}>
          {[
            { src:"logo-best-carrier.png",alt:"Best Carrier Solutions",h:40 },
            { src:"logo-kam-way.png",alt:"Kam-Way Transportation",h:44 },
            { src:"logo-inland-xpress.png",alt:"Inland Xpress",h:32 },
            { src:"logo-js-drayage.png",alt:"J&S Drayage",h:28 },
            { src:"logo-royal-carrier.png",alt:"Royal Carrier LLC",h:48 },
            { src:"logo-transjet.png",alt:"TransJet Cargo",h:36 },
            { src:"logo-grtm.png",alt:"GRTM",h:40 },
            { src:"logo-sunrise.png",alt:"Sunrise Trucking",h:40 },
          ].map((logo,i) => (
            <img key={i} src={logo.src} alt={logo.alt} style={{ height:logo.h,objectFit:"contain",opacity:0.7,filter:"grayscale(100%)",transition:"all 0.3s" }} onMouseOver={e=>{e.target.style.opacity="1";e.target.style.filter="grayscale(0%)"}} onMouseOut={e=>{e.target.style.opacity="0.7";e.target.style.filter="grayscale(100%)"}} />
          ))}
        </div>
      </Section>

      <Divider/>
      <Section style={{ textAlign:"center" }}>
        <SectionLabel>Integrations</SectionLabel>
        <SectionTitle><span style={{ display:"block",maxWidth:600,margin:"0 auto" }}>Plugs into the tools <Em>you already use</Em></span></SectionTitle>
        <p style={{ color:C.darkGray,maxWidth:500,margin:"0 auto 24px",lineHeight:1.6,fontSize:15 }}>Channel19 has pre-built integrations with your existing TMS, load boards, ELD providers, and compliance systems.</p>
        <div style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center" }}>
          {INTEGRATIONS.map(n => <div key={n} style={{ background:C.white,border:"1px solid rgba(27,42,74,0.08)",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:500,color:C.navy }}>{n}</div>)}
        </div>
      </Section>

      <Divider/>
      <div style={{ background:C.offWhite }}>
        <ContactBlock label="Get Started" title={<>Ready to book loads <Em>10× faster?</Em></>} desc="Schedule a personalized demo and see how Channel19's AI agents can transform your load booking operations." source="homepage" formRef={formRef}/>
      </div>
    </>
  );
}

// ═══ CARRIERS PAGE ═══
function CarriersPage({ formRef, setPage }) {
  const [wfTab,setWfTab] = useState(0);
  const carrierWfTabs = [
    { tab:"Outbound Calling", title:"Call brokers from load boards", desc:"The AI agent dials brokers listed on load boards, navigates IVRs, handles hold times, and gathers complete load details — all without dispatcher intervention.",
      bullets:["Dials multiple brokers in parallel from DAT, Truckstop, 123Loadboard","Navigates IVRs and waits on hold automatically","Collects origin/destination, rate, equipment, weight, appointment times","Structures every detail into load cards for comparison"],
      conversation:[
        { from:"AI",color:C.navy,text:"Dialing ABC Logistics from DAT for CHI→DAL lane. 53' dry van, pickup tomorrow." },
        { from:"AI",color:C.navy,text:"Connected. Navigating IVR... on hold... connected to freight desk." },
        { from:"B",color:C.navyMid,text:"Hey, yeah we've got that load. 42,000 lbs, pickup at 8am, delivering to Dallas Thursday. Rate is $2,850 all-in." },
        { from:"AI",color:C.navy,text:"We'd need at least $3,050 for that lane. We've got a truck in Chicago ready to go tomorrow." },
        { from:"B",color:C.navyMid,text:"I can stretch to $2,950. That's the best I can do." },
        { from:"AI",color:C.navy,text:"$2,950 works. Sending to dispatcher for approval." },
      ]},
    { tab:"Inbound Calls", title:"Answer broker calls 24/7", desc:"When brokers call with load offers, the AI agent picks up instantly — qualifies the load, collects all details, and routes the opportunity to your dispatcher.",
      bullets:["Answers inbound broker calls instantly — no missed opportunities","Qualifies loads against your lane preferences and equipment","Collects full load details and creates structured load cards","Routes qualified loads to dispatcher with one-click accept/decline"],
      conversation:[
        { from:"B",color:C.navyMid,text:"Hi, I'm calling from XYZ Logistics. I've got a reefer load from Atlanta to Miami, 38,000 lbs, pickup Monday at 6am. You guys have a truck?" },
        { from:"AI",color:C.navy,text:"Let me check availability. We do have a reefer unit available in Atlanta. What's the rate and delivery timeline?" },
        { from:"B",color:C.navyMid,text:"$3,200 all-in, deliver by Wednesday noon. Temperature control at 34°F." },
        { from:"AI",color:C.navy,text:"That fits our requirements. I'm routing this to the dispatcher now for approval. Expect a confirmation within 15 minutes." },
      ]},
    { tab:"Email Processing", title:"Parse load emails automatically", desc:"The AI agent reads incoming load emails from brokers, extracts load details and rate sheets, and adds them to your comparison dashboard — no manual data entry.",
      bullets:["Monitors inbox for load offers from brokers","Parses rate sheets, PDFs, and unstructured email text","Extracts origin, destination, rate, equipment, appointments","Auto-responds to confirm interest or request more details"],
      conversation:[
        { from:"E",color:"#3B82F6",text:"New email from dispatch@abcfreight.com — 'Available: DRY VAN, Memphis→Nashville, 40K lbs, $1,800, pickup Tue 2pm'",file:"rate-sheet-0612.pdf" },
        { from:"AI",color:C.navy,text:"Parsed email. Load details extracted: Memphis→Nashville, dry van, 40,000 lbs, $1,800, pickup Tuesday 2:00 PM. Adding to load comparison dashboard." },
        { from:"AI",color:C.navy,text:"Auto-replied to broker confirming interest. Load card created and sent to dispatcher for review." },
      ]},
    { tab:"Negotiation", title:"Negotiate rates within your guardrails", desc:"The AI agent negotiates on calls and via email using rules you set — floor/ceiling prices, target margins, and lane-specific preferences.",
      bullets:["Negotiates within dispatcher-defined rate guardrails","Applies lane-specific rules and margin targets","Counters intelligently based on market context","Escalates to dispatcher when outside parameters"],
      conversation:[
        { from:"B",color:C.navyMid,text:"Best I can offer is $2,800 for that Dallas load." },
        { from:"AI",color:C.navy,text:"Our target for this lane is $3,000–$3,200. Can you come up to $3,100?" },
        { from:"B",color:C.navyMid,text:"$2,950 is the most I can do." },
        { from:"AI",color:C.navy,text:"$2,950 is within range. Confirming with dispatcher now." },
        { from:"D",color:C.green,text:"✓ Approved. Book it." },
        { from:"AI",color:C.navy,text:"Load booked at $2,950. Rate confirmation sent. Pushing to TMS." },
      ]},
    { tab:"Booking & Handoff", title:"Book loads and keep dispatchers in control", desc:"The AI agent books loads autonomously within your rules or sends to the dispatcher for one-click approval. Dispatchers can join any live call instantly.",
      bullets:["One-click approval workflow with full load context","Autopilot mode: books within rules, escalates exceptions","Co-pilot mode: dispatcher reviews and approves in real time","Instant 'Join Call' button to take over any conversation"],
      conversation:[
        { from:"AI",color:C.navy,text:"3 load options ready for review. Best match: CHI→DAL at $2,950, 53' dry van, pickup 8am tomorrow. Margin: +12% above target." },
        { from:"D",color:C.green,text:"Option 1 looks good. Approve." },
        { from:"AI",color:C.navy,text:"Load booked. Rate confirmation sent to broker. Load details pushed to TMS. Confirmation #TL-48271." },
      ]},
  ];
  return (
    <>
      <div style={{ background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,padding:"140px clamp(1.5rem,6vw,6rem) 60px",textAlign:"center" }}>
        <div style={{ maxWidth:1300,margin:"0 auto" }}>
          <div style={{ fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.5)",marginBottom:16 }}>For-Hire Carriers</div>
          <h1 style={{ fontFamily:C.serif,fontSize:"clamp(2.5rem,5vw,4rem)",fontWeight:400,color:C.white,lineHeight:1.08,marginBottom:16 }}>AI Agent for load booking for <Em>Dispatchers</Em></h1>
          <p style={{ fontSize:18,color:C.midGray,maxWidth:620,margin:"0 auto 32px",lineHeight:1.6 }}>Makes outbound calls to brokers from load boards, handles inbound broker calls, and processes load emails — navigating IVRs, negotiating rates, and booking the best loads while your dispatchers stay in full control.</p>
          <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer"><Btn primary style={{ background:C.white,color:C.navy }}>Book a Demo →</Btn></a>
        </div>
      </div>
      <Section style={{ paddingTop:"clamp(3rem,5vw,5rem)",paddingBottom:0 }}><Stats items={[{value:"2–3×",label:"More loads booked"},{value:"10×",label:"More options evaluated"},{value:"100%",label:"Calls handled"}]}/></Section>
      <Section>
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>From load board to <Em>booked load</Em> in minutes</SectionTitle>
        <p style={{ fontSize:16,color:C.darkGray,maxWidth:600,lineHeight:1.6,marginBottom:24 }}>Your AI agent calls brokers on load boards, handles inbound broker calls, and processes load emails — just like a dispatcher would — but handles dozens of interactions simultaneously, around the clock.</p>
        <Workflow steps={[
          { title:"Outbound Calls to Brokers",desc:"Dials brokers from load boards, navigates IVRs, waits on hold, and gathers load details — origin/destination, rate, equipment, appointments." },
          { title:"Inbound Call Handling",desc:"Answers inbound calls from brokers, qualifies loads, collects details, and routes opportunities to dispatchers." },
          { title:"Email Processing",desc:"Reads and responds to load emails from brokers. Parses rate sheets, extracts load details, and adds options for comparison." },
          { title:"Live Transcription & Structuring",desc:"Captures every call and email, organizing details into structured load cards for side-by-side comparison." },
          { title:"Rate Negotiation & Booking",desc:"Negotiates within your guardrails. Books loads autonomously or sends to the dispatcher for one-click approval. Dispatchers can join any call instantly." },
        ]}/>
      </Section>
      <Divider/>
      <Section>
        <SectionLabel>Detailed Workflows</SectionLabel>
        <SectionTitle>How the AI agent fits into <Em>every step</Em></SectionTitle>
        <WorkflowTabs tabs={carrierWfTabs} activeTab={wfTab} setActiveTab={setWfTab} />
        <WorkflowDetail step={carrierWfTabs[wfTab]} />
      </Section>
      <Divider/>
      <Section>
        <SectionLabel>See the AI Agent in Action</SectionLabel>
        <SectionTitle>Watch the agent <Em>book loads</Em> for dispatchers</SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:24 }}>
          <div>
            <LoomVideo src={CARRIER_WORKFLOW_VIDEO} title="Carrier Workflow Demo" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>Carrier Workflow Demo</p>
            <p style={{ fontSize:13,color:C.darkGray }}>End-to-end walkthrough of the AI agent booking loads for a dispatcher.</p>
          </div>
          <div>
            <LoomVideo src={CARRIER_VOICE_VIDEO} title="AI Voice Conversation with Broker" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>AI Agent ↔ Broker Voice Conversation</p>
            <p style={{ fontSize:13,color:C.darkGray }}>Listen to the actual voice conversation between the AI agent and a broker.</p>
          </div>
        </div>
      </Section>
      <Divider/>
      <Section>
        <SectionLabel>Capabilities</SectionLabel>
        <SectionTitle>Everything a dispatcher needs, <Em>powered by AI</Em></SectionTitle>
        <div style={{ marginTop:24 }}><Features items={[
          { icon:"📞",title:"Outbound Calling & IVR Handling",desc:"Agent dials brokers, navigates phone trees, and handles hold times — no more waiting." },
          { icon:"📥",title:"Inbound Call Handling",desc:"Answers inbound broker calls 24/7, qualifies loads, collects details, and routes to dispatchers." },
          { icon:"✉️",title:"Email Processing",desc:"Reads broker emails, parses rate sheets, extracts load details, and responds automatically." },
          { icon:"📊",title:"Structured Load Cards",desc:"Origin/destination, weight, equipment, appointments, notes — ready for quick comparison." },
          { icon:"⚖️",title:"Smart Negotiation Guardrails",desc:"Floor/ceiling prices, target margins, lane rules. Agent negotiates within your rules." },
          { icon:"🔗",title:"Integrates With Your Tools",desc:"Plugs into your TMS and load board workflow. Ask us about your stack." },
        ]}/></div>
      </Section>
      <Divider/>
      <Section>
        <SectionLabel>Autopilot & Co-Pilot Modes</SectionLabel>
        <SectionTitle>Your agent, <Em>your way</Em></SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:24 }}>
          <div style={{ background:C.white,border:"1px solid rgba(27,42,74,0.06)",borderRadius:20,padding:"36px 30px",boxShadow:"0 2px 12px rgba(27,42,74,0.04)" }}>
            <h4 style={{ fontSize:18,fontWeight:600,color:C.navy,marginBottom:12 }}>Autopilot Mode</h4>
            <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.6 }}>Agent calls, qualifies, negotiates, and books within your preset rules. Handles inbound calls and email autonomously. Escalates only on exceptions. Pushes booked loads to your workflow and sends confirmations.</p>
          </div>
          <div style={{ background:C.white,border:"1px solid rgba(27,42,74,0.06)",borderRadius:20,padding:"36px 30px",boxShadow:"0 2px 12px rgba(27,42,74,0.04)" }}>
            <h4 style={{ fontSize:18,fontWeight:600,color:C.navy,marginBottom:12 }}>Co-Pilot Mode</h4>
            <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.6 }}>Agent does the dialing, IVR, inbound answering, and email processing. Dispatcher reviews options. Negotiation suggestions appear in real time — dispatcher clicks to approve. One-click "Join Call" for instant takeover.</p>
          </div>
        </div>
        <p style={{ fontSize:14,color:C.darkGray,marginTop:16,fontStyle:"italic" }}>Switch modes per lane, per dispatcher, or per customer — anytime.</p>
      </Section>
      <Divider/>
      <Section style={{ textAlign:"center" }}>
        <SectionLabel>Trusted By</SectionLabel>
        <SectionTitle>Carriers of all sizes use <Em>Channel19</Em></SectionTitle>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"center",gap:"clamp(24px,4vw,48px)",marginTop:32 }}>
          {[
            { src:"logo-best-carrier.png",alt:"Best Carrier Solutions",h:40 },
            { src:"logo-inland-xpress.png",alt:"Inland Xpress",h:32 },
            { src:"logo-js-drayage.png",alt:"J&S Drayage",h:28 },
            { src:"logo-royal-carrier.png",alt:"Royal Carrier LLC",h:48 },
            { src:"logo-sunrise.png",alt:"Sunrise Trucking",h:40 },
          ].map((logo,i) => (
            <img key={i} src={logo.src} alt={logo.alt} style={{ height:logo.h,objectFit:"contain",opacity:0.7,filter:"grayscale(100%)",transition:"all 0.3s" }} onMouseOver={e=>{e.target.style.opacity="1";e.target.style.filter="grayscale(0%)"}} onMouseOut={e=>{e.target.style.opacity="0.7";e.target.style.filter="grayscale(100%)"}} />
          ))}
        </div>
      </Section>
      <Divider/>
      <div style={{ background:C.offWhite }}><ContactBlock label="For Carriers" title={<>Start booking smarter <Em>today</Em></>} desc="See how Channel19 helps your fleet evaluate more loads, book faster, and improve margins — without adding headcount." source="carriers" formRef={formRef}/></div>
    </>
  );
}

// ═══ BROKERS/3PLs & SHIPPERS PAGE (COMBINED) ═══
function BrokersShippersPage({ formRef, setPage }) {
  const [wfTab,setWfTab] = useState(0);
  const brokerWfTabs = [
    { tab:"Outbound Calling", title:"Call carriers from your tools", desc:"The AI agent dials carriers from your TMS, load boards, and compliance tools — collecting capacity, equipment details, and rates at scale.",
      bullets:["Dials carriers in parallel from your TMS, load boards, and compliance tools","Navigates IVRs, handles hold times automatically","Collects capacity, lane fit, equipment, and rate details","Structures every interaction into carrier cards for comparison"],
      conversation:[
        { from:"AI",color:C.navy,text:"Dialing ABC Trucking for open load ATL→MIA. Reefer, 38K lbs, pickup Monday." },
        { from:"AI",color:C.navy,text:"Connected to dispatch. Collecting capacity details..." },
        { from:"C",color:"#F59E0B",text:"Yeah, we have a reefer available in Atlanta. What's the rate?" },
        { from:"AI",color:C.navy,text:"We're offering $2,900 for ATL→MIA, reefer, pickup Monday 6am, deliver Wednesday." },
        { from:"C",color:"#F59E0B",text:"Can you do $3,100? It's a long haul with temperature control." },
        { from:"AI",color:C.navy,text:"I can go to $3,000. That's our best for this lane." },
        { from:"C",color:"#F59E0B",text:"$3,000 works. Let's book it." },
        { from:"AI",color:C.navy,text:"Confirmed. Sending to carrier sales rep for final approval." },
      ]},
    { tab:"Inbound Calls", title:"Answer carrier calls 24/7", desc:"When carriers call in with available capacity, the AI agent answers instantly — qualifies the carrier, collects details, and routes the best options to your reps.",
      bullets:["Answers inbound carrier calls instantly — never miss available capacity","Verifies carrier compliance and authority in real time","Collects equipment, availability, lane preferences, and rate expectations","Routes qualified carriers to reps with full context"],
      conversation:[
        { from:"C",color:"#F59E0B",text:"Hey, this is Mike from Heartland Transport. I've got a dry van available in Dallas, looking for loads going east. What do you have?" },
        { from:"AI",color:C.navy,text:"Thanks Mike. Let me check. We have an open load DAL→ATL, 42K lbs, dry van, pickup Wednesday. Rate is $2,400. Interested?" },
        { from:"C",color:"#F59E0B",text:"That works for us. We can do pickup at 10am." },
        { from:"AI",color:C.navy,text:"Great. Verifying your authority and insurance now... Confirmed, all clear. Routing to our carrier sales rep for booking confirmation." },
      ]},
    { tab:"Email Management", title:"Process carrier emails automatically", desc:"The AI agent monitors your inbox for carrier capacity offers, parses details, verifies compliance, and adds qualified carriers to your options.",
      bullets:["Monitors inbox for carrier capacity emails and rate offers","Parses unstructured emails and attached rate sheets","Verifies carrier compliance before surfacing to reps","Auto-responds to acknowledge and request additional details"],
      conversation:[
        { from:"E",color:"#3B82F6",text:"New email from dispatch@heartlandtransport.com — 'We have 3 dry vans available this week in TX. Looking for loads to East Coast or Midwest.'",file:"capacity-sheet.pdf" },
        { from:"AI",color:C.navy,text:"Parsed email. Carrier: Heartland Transport. 3 dry vans available in TX. Looking for eastbound/midwest loads. Checking compliance..." },
        { from:"AI",color:C.navy,text:"Carrier verified: MC active, insurance current, safety rating satisfactory. Matched to 2 open loads. Carrier card created and sent to rep." },
        { from:"AI",color:C.navy,text:"Auto-replied: 'Thanks Mike, we have loads that may fit. A rep will follow up shortly.'" },
      ]},
    { tab:"Negotiation", title:"Negotiate buy rates within your guardrails", desc:"The AI agent negotiates with carriers using your margin rules, rate bands, and lane-specific parameters — lowering buy rates while maintaining coverage speed.",
      bullets:["Negotiates within rep-defined rate guardrails and margin targets","Applies lane-specific rules and historical rate data","Counters carrier asks intelligently","Escalates to rep when outside parameters"],
      conversation:[
        { from:"C",color:"#F59E0B",text:"We need $3,200 for that Miami load." },
        { from:"AI",color:C.navy,text:"Our target buy rate for this lane is $2,800–$3,000. Can you come down to $3,000?" },
        { from:"C",color:"#F59E0B",text:"$3,050 is the lowest I can go." },
        { from:"AI",color:C.navy,text:"$3,050 is within our range. Confirming with the rep now." },
        { from:"D",color:C.green,text:"✓ Approved at $3,050. Good margin." },
        { from:"AI",color:C.navy,text:"Booked. Rate confirmation sent to carrier. Load updated in TMS." },
      ]},
    { tab:"Booking & Handoff", title:"Cover loads and keep reps in control", desc:"The AI agent books carriers autonomously or routes to your rep for one-click approval. Reps can take over any live call at any moment.",
      bullets:["One-click approval workflow with full carrier context and margin analysis","Autopilot mode: books within rules, escalates exceptions only","Co-pilot mode: rep reviews carrier options and approves in real time","Instant 'Join Call' to take over any live carrier conversation"],
      conversation:[
        { from:"AI",color:C.navy,text:"4 carriers qualified for ATL→MIA reefer load. Best match: Heartland Transport at $3,000, reefer available Monday, compliance verified. Margin: 18%." },
        { from:"D",color:C.green,text:"Book Heartland at $3,000." },
        { from:"AI",color:C.navy,text:"Carrier booked. Rate confirmation sent. Load updated in TMS. Dispatch notification sent to carrier. Confirmation #BK-91824." },
      ]},
  ];
  return (
    <>
      <div style={{ background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,padding:"140px clamp(1.5rem,6vw,6rem) 60px",textAlign:"center" }}>
        <div style={{ maxWidth:1300,margin:"0 auto" }}>
          <div style={{ fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.5)",marginBottom:16 }}>For Brokers/3PLs & Shippers</div>
          <h1 style={{ fontFamily:C.serif,fontSize:"clamp(2.5rem,5vw,4rem)",fontWeight:400,color:C.white,lineHeight:1.08,marginBottom:16 }}>AI Agent for load booking for <Em>Carrier Sales Teams</Em></h1>
          <p style={{ fontSize:18,color:C.midGray,maxWidth:650,margin:"0 auto 32px",lineHeight:1.6 }}>Cover more loads at better margins — without the phone tag. AI makes outbound calls to carriers, handles inbound carrier calls, and manages email to collect capacity, negotiate rates, and surface the best-fit options.</p>
          <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer"><Btn primary style={{ background:C.white,color:C.navy }}>Book a Demo →</Btn></a>
        </div>
      </div>

      {/* New metrics */}
      <Section style={{ paddingTop:"clamp(3rem,5vw,5rem)",paddingBottom:0 }}>
        <Stats items={[
          { value:"2–3×",label:"More loads booked" },
          { value:"10×",label:"More options evaluated" },
          { value:"100%",label:"Calls handled" },
        ]}/>
      </Section>

      <Section>
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>From open load to <Em>covered & confirmed</Em></SectionTitle>
        <p style={{ fontSize:16,color:C.darkGray,maxWidth:600,lineHeight:1.6,marginBottom:24 }}>Your AI agent calls carriers outbound, handles inbound carrier calls, and processes emails — managing the dialing, hold times, data collection, and email responses so your reps and logistics teams can focus on closing.</p>
        <Workflow steps={[
          { title:"Outbound Calls to Carriers",desc:"Dials carriers from your load boards, compliance systems, and TMS. Navigates IVRs, waits on hold, and collects capacity, lane fit, equipment, and other details." },
          { title:"Inbound Call Handling",desc:"Answers inbound calls from carriers 24/7, qualifies capacity, collects details, and routes the best options to your reps." },
          { title:"Email Management",desc:"Reads and responds to carrier emails. Parses capacity offers, extracts details, and adds carriers to your options." },
          { title:"Live Transcription & Structuring",desc:"Every call and email captured and organized into carrier cards for side-by-side comparison." },
          { title:"Negotiation & Booking",desc:"Counters within your guardrails. Confirms loads autonomously or routes to rep for one-click approval. Reps can join any call instantly." },
        ]}/>
      </Section>
      <Divider/>
      <Section>
        <SectionLabel>Detailed Workflows</SectionLabel>
        <SectionTitle>How the AI agent fits into <Em>every step</Em></SectionTitle>
        <WorkflowTabs tabs={brokerWfTabs} activeTab={wfTab} setActiveTab={setWfTab} />
        <WorkflowDetail step={brokerWfTabs[wfTab]} />
      </Section>

      <Divider/>
      <Section>
        <SectionLabel>See the AI Agent in Action</SectionLabel>
        <SectionTitle>Watch the agent <Em>cover loads</Em> in real time</SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:24 }}>
          <div>
            <LoomVideo src={BROKER_WORKFLOW_VIDEO} title="Broker/Shipper Workflow Demo" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>Carrier Sales & Shipper Workflow</p>
            <p style={{ fontSize:13,color:C.darkGray }}>End-to-end demo of the AI agent covering loads for carrier sales reps and shippers.</p>
          </div>
          <div>
            <LoomVideo src={BROKER_VOICE_VIDEO} title="AI Voice Conversation with Carrier" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>AI Agent ↔ Carrier Voice Conversation</p>
            <p style={{ fontSize:13,color:C.darkGray }}>Listen to the actual voice conversation between the AI agent and a carrier.</p>
          </div>
        </div>
      </Section>

      <Divider/>
      <Section>
        <SectionLabel>Capabilities</SectionLabel>
        <SectionTitle>AI-powered carrier sales, <Em>your way</Em></SectionTitle>
        <div style={{ marginTop:24 }}><Features items={[
          { icon:"📞",title:"Outbound Carrier Scouting",desc:"Screens more carriers in parallel for each lane via outbound calls — 10× more options evaluated." },
          { icon:"📥",title:"Inbound Call Handling",desc:"Answers inbound carrier calls 24/7, qualifies capacity, and routes best-fit options to reps." },
          { icon:"✉️",title:"Email Management",desc:"Reads carrier emails, parses capacity offers, and responds automatically. No manual inbox management." },
          { icon:"⚖️",title:"Smart Negotiation Guardrails",desc:"Min margin, rate bands, and lane rules. Agent negotiates within your rules across calls and email." },
          { icon:"🎙️",title:"Instant Call Handoff",desc:"Reps can join any live call in real time with one click." },
          { icon:"🔗",title:"Integrates With Your Stack",desc:"Works alongside your TMS, load boards, and compliance tools." },
        ]}/></div>
      </Section>

      <Divider/>
      <Section>
        <SectionLabel>Autopilot & Co-Pilot Modes</SectionLabel>
        <SectionTitle>Your agent, <Em>your way</Em></SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:24 }}>
          <div style={{ background:C.white,border:"1px solid rgba(27,42,74,0.06)",borderRadius:20,padding:"36px 30px",boxShadow:"0 2px 12px rgba(27,42,74,0.04)" }}>
            <h4 style={{ fontSize:18,fontWeight:600,color:C.navy,marginBottom:12 }}>Autopilot Mode</h4>
            <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.6 }}>Agent calls carriers, handles inbound calls, processes email, negotiates, and books within your preset rules. Escalates only on exceptions. Posts booked loads back to your system.</p>
          </div>
          <div style={{ background:C.white,border:"1px solid rgba(27,42,74,0.06)",borderRadius:20,padding:"36px 30px",boxShadow:"0 2px 12px rgba(27,42,74,0.04)" }}>
            <h4 style={{ fontSize:18,fontWeight:600,color:C.navy,marginBottom:12 }}>Co-Pilot Mode</h4>
            <p style={{ fontSize:14,color:C.darkGray,lineHeight:1.6 }}>Agent handles outbound dialing, inbound answering, IVR, email, and data capture. Rep reviews curated options. Real-time negotiation suggestions — rep clicks to approve. One-click Join Call for instant takeover.</p>
          </div>
        </div>
        <p style={{ fontSize:14,color:C.darkGray,marginTop:16,fontStyle:"italic" }}>Switch modes per lane, per rep, or per customer — anytime.</p>
      </Section>

      <Divider/>
      <Section style={{ textAlign:"center" }}>
        <SectionLabel>Trusted By</SectionLabel>
        <SectionTitle>Brokers, 3PLs & Shippers use <Em>Channel19</Em></SectionTitle>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"center",gap:"clamp(24px,4vw,48px)",marginTop:32 }}>
          {[
            { src:"logo-kam-way.png",alt:"Kam-Way Transportation",h:44 },
            { src:"logo-transjet.png",alt:"TransJet Cargo",h:36 },
            { src:"logo-grtm.png",alt:"GRTM",h:40 },
          ].map((logo,i) => (
            <img key={i} src={logo.src} alt={logo.alt} style={{ height:logo.h,objectFit:"contain",opacity:0.7,filter:"grayscale(100%)",transition:"all 0.3s" }} onMouseOver={e=>{e.target.style.opacity="1";e.target.style.filter="grayscale(0%)"}} onMouseOut={e=>{e.target.style.opacity="0.7";e.target.style.filter="grayscale(100%)"}} />
          ))}
        </div>
      </Section>
      <Divider/>
      <div style={{ background:C.offWhite }}><ContactBlock label="For Brokers/3PLs & Shippers" title={<>Cover loads faster, <Em>protect margins</Em></>} desc="See how Channel19 helps you cover more freight with fewer calls, better carriers, and higher margins — whether you're a brokerage or a shipper." source="brokers-shippers" formRef={formRef}/></div>
    </>
  );
}

// ═══ WORKFLOW TAB COMPONENT ═══
function WorkflowTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:32 }}>
      {tabs.map((t,i) => (
        <button key={i} onClick={() => setActiveTab(i)} style={{
          fontFamily:C.sans,fontSize:14,fontWeight:activeTab===i?600:500,
          color:activeTab===i?C.white:C.navy,
          background:activeTab===i?C.navy:"rgba(27,42,74,0.05)",
          border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",transition:"all 0.25s"
        }}>{t.tab}</button>
      ))}
    </div>
  );
}

function AgentMsg({ label, color, children, file }) {
  return (
    <div style={{ display:"flex",gap:12,marginBottom:16,animation:"c19fadeUp 0.4s ease-out" }}>
      <div style={{ width:36,height:36,borderRadius:10,background:color||"rgba(27,42,74,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.white,flexShrink:0 }}>
        {label==="AI"?"🤖":label==="B"?"👤":label==="D"?"👨‍💼":label==="C"?"🚛":"📧"}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11,fontWeight:600,color:C.darkGray,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4 }}>
          {label==="AI"?"Channel19 Agent":label==="B"?"Broker":label==="D"?"Dispatcher":label==="C"?"Carrier":label==="E"?"Email":"System"}
        </div>
        <div style={{ background:C.white,border:"1px solid rgba(27,42,74,0.08)",borderRadius:12,padding:"14px 18px",fontSize:14,color:C.navyMid,lineHeight:1.6 }}>
          {children}
          {file && <div style={{ marginTop:8,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(27,42,74,0.04)",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:500,color:C.navy }}>📎 {file}</div>}
        </div>
      </div>
    </div>
  );
}

function WorkflowDetail({ step, videoSrc, videoTitle }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,alignItems:"start" }}>
      <div>
        <h3 style={{ fontFamily:C.serif,fontSize:"clamp(1.5rem,3vw,2rem)",color:C.navy,fontWeight:400,marginBottom:8 }}>{step.title}</h3>
        <p style={{ fontSize:15,color:C.darkGray,lineHeight:1.6,marginBottom:20 }}>{step.desc}</p>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {step.bullets.map((b,i) => (
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10,fontSize:14,color:C.navyMid,lineHeight:1.5 }}>
              <span style={{ color:C.green,fontWeight:700,marginTop:2,flexShrink:0 }}>✓</span>{b}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"rgba(27,42,74,0.02)",border:"1px solid rgba(27,42,74,0.06)",borderRadius:20,padding:24 }}>
        {step.conversation.map((msg,i) => (
          <AgentMsg key={i} label={msg.from} color={msg.color} file={msg.file}>{msg.text}</AgentMsg>
        ))}
      </div>
    </div>
  );
}

// ═══ CARRIER WORKFLOWS PAGE ═══
function CarrierWorkflowsPage({ setPage, formRef }) {
  const [tab,setTab] = useState(0);
  const tabs = [
    { tab:"Outbound Calling", title:"Call brokers from load boards", desc:"The AI agent dials brokers listed on load boards, navigates IVRs, handles hold times, and gathers complete load details — all without dispatcher intervention.",
      bullets:["Dials multiple brokers in parallel from DAT, Truckstop, 123Loadboard","Navigates IVRs and waits on hold automatically","Collects origin/destination, rate, equipment, weight, appointment times","Structures every detail into load cards for comparison"],
      conversation:[
        { from:"AI",color:C.navy,text:"Dialing ABC Logistics from DAT for CHI→DAL lane. 53' dry van, pickup tomorrow." },
        { from:"AI",color:C.navy,text:"Connected. Navigating IVR... on hold... connected to freight desk." },
        { from:"B",color:C.navyMid,text:"Hey, yeah we've got that load. 42,000 lbs, pickup at 8am, delivering to Dallas Thursday. Rate is $2,850 all-in." },
        { from:"AI",color:C.navy,text:"We'd need at least $3,050 for that lane. We've got a truck in Chicago ready to go tomorrow." },
        { from:"B",color:C.navyMid,text:"I can stretch to $2,950. That's the best I can do." },
        { from:"AI",color:C.navy,text:"$2,950 works. Sending to dispatcher for approval." },
      ]},
    { tab:"Inbound Calls", title:"Answer broker calls 24/7", desc:"When brokers call with load offers, the AI agent picks up instantly — qualifies the load, collects all details, and routes the opportunity to your dispatcher.",
      bullets:["Answers inbound broker calls instantly — no missed opportunities","Qualifies loads against your lane preferences and equipment","Collects full load details and creates structured load cards","Routes qualified loads to dispatcher with one-click accept/decline"],
      conversation:[
        { from:"B",color:C.navyMid,text:"Hi, I'm calling from XYZ Logistics. I've got a reefer load from Atlanta to Miami, 38,000 lbs, pickup Monday at 6am. You guys have a truck?" },
        { from:"AI",color:C.navy,text:"Let me check availability. We do have a reefer unit available in Atlanta. What's the rate and delivery timeline?" },
        { from:"B",color:C.navyMid,text:"$3,200 all-in, deliver by Wednesday noon. Temperature control at 34°F." },
        { from:"AI",color:C.navy,text:"That fits our requirements. I'm routing this to the dispatcher now for approval. Expect a confirmation within 15 minutes." },
      ]},
    { tab:"Email Processing", title:"Parse load emails automatically", desc:"The AI agent reads incoming load emails from brokers, extracts load details and rate sheets, and adds them to your comparison dashboard — no manual data entry.",
      bullets:["Monitors inbox for load offers from brokers","Parses rate sheets, PDFs, and unstructured email text","Extracts origin, destination, rate, equipment, appointments","Auto-responds to confirm interest or request more details"],
      conversation:[
        { from:"E",color:"#3B82F6",text:"New email from dispatch@abcfreight.com — 'Available: DRY VAN, Memphis→Nashville, 40K lbs, $1,800, pickup Tue 2pm'",file:"rate-sheet-0612.pdf" },
        { from:"AI",color:C.navy,text:"Parsed email. Load details extracted: Memphis→Nashville, dry van, 40,000 lbs, $1,800, pickup Tuesday 2:00 PM. Adding to load comparison dashboard." },
        { from:"AI",color:C.navy,text:"Auto-replied to broker confirming interest. Load card created and sent to dispatcher for review." },
      ]},
    { tab:"Negotiation", title:"Negotiate rates within your guardrails", desc:"The AI agent negotiates on calls and via email using rules you set — floor/ceiling prices, target margins, and lane-specific preferences.",
      bullets:["Negotiates within dispatcher-defined rate guardrails","Applies lane-specific rules and margin targets","Counters intelligently based on market context","Escalates to dispatcher when outside parameters"],
      conversation:[
        { from:"B",color:C.navyMid,text:"Best I can offer is $2,800 for that Dallas load." },
        { from:"AI",color:C.navy,text:"Our target for this lane is $3,000–$3,200. Can you come up to $3,100?" },
        { from:"B",color:C.navyMid,text:"$2,950 is the most I can do." },
        { from:"AI",color:C.navy,text:"$2,950 is within range. Confirming with dispatcher now." },
        { from:"D",color:C.green,text:"✓ Approved. Book it." },
        { from:"AI",color:C.navy,text:"Load booked at $2,950. Rate confirmation sent. Pushing to TMS." },
      ]},
    { tab:"Booking & Handoff", title:"Book loads and keep dispatchers in control", desc:"The AI agent books loads autonomously within your rules or sends to the dispatcher for one-click approval. Dispatchers can join any live call instantly.",
      bullets:["One-click approval workflow with full load context","Autopilot mode: books within rules, escalates exceptions","Co-pilot mode: dispatcher reviews and approves in real time","Instant 'Join Call' button to take over any conversation"],
      conversation:[
        { from:"AI",color:C.navy,text:"3 load options ready for review. Best match: CHI→DAL at $2,950, 53' dry van, pickup 8am tomorrow. Margin: +12% above target." },
        { from:"D",color:C.green,text:"Option 1 looks good. Approve." },
        { from:"AI",color:C.navy,text:"Load booked. Rate confirmation sent to broker. Load details pushed to TMS. Confirmation #TL-48271." },
      ]},
  ];

  return (
    <>
      <div style={{ background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,padding:"140px clamp(1.5rem,6vw,6rem) 60px",textAlign:"center" }}>
        <div style={{ maxWidth:1300,margin:"0 auto" }}>
          <button onClick={() => { setPage(PAGES.CARRIERS); window.scrollTo(0,0); }} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:C.sans,fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:16 }}>← Back to Carriers</button>
          <div style={{ fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.5)",marginBottom:16 }}>Carrier Workflows</div>
          <h1 style={{ fontFamily:C.serif,fontSize:"clamp(2.5rem,5vw,4rem)",fontWeight:400,color:C.white,lineHeight:1.08,marginBottom:16 }}>How the AI agent fits into <Em>every step</Em> of load booking</h1>
          <p style={{ fontSize:18,color:C.midGray,maxWidth:620,margin:"0 auto 32px",lineHeight:1.6 }}>From finding loads on load boards to booking and confirmation — see exactly how Channel19's AI agent handles each workflow for carrier dispatchers.</p>
          <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer"><Btn primary style={{ background:C.white,color:C.navy }}>Book a Demo →</Btn></a>
        </div>
      </div>

      <Section>
        <SectionLabel>Dispatcher Workflows</SectionLabel>
        <SectionTitle>Every workflow, from load board to <Em>booked load</Em></SectionTitle>
        <WorkflowTabs tabs={tabs} activeTab={tab} setActiveTab={setTab} />
        <WorkflowDetail step={tabs[tab]} />
      </Section>

      <Divider/>
      <Section>
        <SectionLabel>See It Live</SectionLabel>
        <SectionTitle>Watch the workflows <Em>in action</Em></SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:24 }}>
          <div>
            <LoomVideo src={CARRIER_WORKFLOW_VIDEO} title="Carrier Workflow Demo" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>Full Carrier Workflow Demo</p>
            <p style={{ fontSize:13,color:C.darkGray }}>End-to-end walkthrough of load booking for dispatchers.</p>
          </div>
          <div>
            <LoomVideo src={CARRIER_VOICE_VIDEO} title="AI Agent ↔ Broker Voice" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>AI Agent ↔ Broker Voice Conversation</p>
            <p style={{ fontSize:13,color:C.darkGray }}>Actual voice conversation between the AI agent and a broker.</p>
          </div>
        </div>
      </Section>

      <Divider/>
      <div style={{ background:C.offWhite }}>
        <ContactBlock label="For Carriers" title={<>Ready to see these workflows <Em>live?</Em></>} desc="Book a personalized demo and see how Channel19's AI agent handles your specific lanes and load types." source="carrier-workflows" formRef={formRef}/>
      </div>
    </>
  );
}

// ═══ BROKER/SHIPPER WORKFLOWS PAGE ═══
function BrokerWorkflowsPage({ setPage, formRef }) {
  const [tab,setTab] = useState(0);
  const tabs = [
    { tab:"Outbound Calling", title:"Call carriers from your tools", desc:"The AI agent dials carriers from your TMS, load boards, and compliance tools — collecting capacity, equipment details, and rates at scale.",
      bullets:["Dials carriers in parallel from your TMS, load boards, and compliance tools","Navigates IVRs, handles hold times automatically","Collects capacity, lane fit, equipment, and rate details","Structures every interaction into carrier cards for comparison"],
      conversation:[
        { from:"AI",color:C.navy,text:"Dialing ABC Trucking for open load ATL→MIA. Reefer, 38K lbs, pickup Monday." },
        { from:"AI",color:C.navy,text:"Connected to dispatch. Collecting capacity details..." },
        { from:"C",color:"#F59E0B",text:"Yeah, we have a reefer available in Atlanta. What's the rate?" },
        { from:"AI",color:C.navy,text:"We're offering $2,900 for ATL→MIA, reefer, pickup Monday 6am, deliver Wednesday." },
        { from:"C",color:"#F59E0B",text:"Can you do $3,100? It's a long haul with temperature control." },
        { from:"AI",color:C.navy,text:"I can go to $3,000. That's our best for this lane." },
        { from:"C",color:"#F59E0B",text:"$3,000 works. Let's book it." },
        { from:"AI",color:C.navy,text:"Confirmed. Sending to carrier sales rep for final approval." },
      ]},
    { tab:"Inbound Calls", title:"Answer carrier calls 24/7", desc:"When carriers call in with available capacity, the AI agent answers instantly — qualifies the carrier, collects details, and routes the best options to your reps.",
      bullets:["Answers inbound carrier calls instantly — never miss available capacity","Verifies carrier compliance and authority in real time","Collects equipment, availability, lane preferences, and rate expectations","Routes qualified carriers to reps with full context"],
      conversation:[
        { from:"C",color:"#F59E0B",text:"Hey, this is Mike from Heartland Transport. I've got a dry van available in Dallas, looking for loads going east. What do you have?" },
        { from:"AI",color:C.navy,text:"Thanks Mike. Let me check. We have an open load DAL→ATL, 42K lbs, dry van, pickup Wednesday. Rate is $2,400. Interested?" },
        { from:"C",color:"#F59E0B",text:"That works for us. We can do pickup at 10am." },
        { from:"AI",color:C.navy,text:"Great. Verifying your authority and insurance now... Confirmed, all clear. Routing to our carrier sales rep for booking confirmation." },
      ]},
    { tab:"Email Management", title:"Process carrier emails automatically", desc:"The AI agent monitors your inbox for carrier capacity offers, parses details, verifies compliance, and adds qualified carriers to your options.",
      bullets:["Monitors inbox for carrier capacity emails and rate offers","Parses unstructured emails and attached rate sheets","Verifies carrier compliance before surfacing to reps","Auto-responds to acknowledge and request additional details"],
      conversation:[
        { from:"E",color:"#3B82F6",text:"New email from dispatch@heartlandtransport.com — 'We have 3 dry vans available this week in TX. Looking for loads to East Coast or Midwest.'",file:"capacity-sheet.pdf" },
        { from:"AI",color:C.navy,text:"Parsed email. Carrier: Heartland Transport. 3 dry vans available in TX. Looking for eastbound/midwest loads. Checking compliance..." },
        { from:"AI",color:C.navy,text:"Carrier verified: MC active, insurance current, safety rating satisfactory. Matched to 2 open loads. Carrier card created and sent to rep." },
        { from:"AI",color:C.navy,text:"Auto-replied: 'Thanks Mike, we have loads that may fit. A rep will follow up shortly.'" },
      ]},
    { tab:"Negotiation", title:"Negotiate buy rates within your guardrails", desc:"The AI agent negotiates with carriers using your margin rules, rate bands, and lane-specific parameters — lowering buy rates while maintaining coverage speed.",
      bullets:["Negotiates within rep-defined rate guardrails and margin targets","Applies lane-specific rules and historical rate data","Counters carrier asks intelligently","Escalates to rep when outside parameters"],
      conversation:[
        { from:"C",color:"#F59E0B",text:"We need $3,200 for that Miami load." },
        { from:"AI",color:C.navy,text:"Our target buy rate for this lane is $2,800–$3,000. Can you come down to $3,000?" },
        { from:"C",color:"#F59E0B",text:"$3,050 is the lowest I can go." },
        { from:"AI",color:C.navy,text:"$3,050 is within our range. Confirming with the rep now." },
        { from:"D",color:C.green,text:"✓ Approved at $3,050. Good margin." },
        { from:"AI",color:C.navy,text:"Booked. Rate confirmation sent to carrier. Load updated in TMS." },
      ]},
    { tab:"Booking & Handoff", title:"Cover loads and keep reps in control", desc:"The AI agent books carriers autonomously or routes to your rep for one-click approval. Reps can take over any live call at any moment.",
      bullets:["One-click approval workflow with full carrier context and margin analysis","Autopilot mode: books within rules, escalates exceptions only","Co-pilot mode: rep reviews carrier options and approves in real time","Instant 'Join Call' to take over any live carrier conversation"],
      conversation:[
        { from:"AI",color:C.navy,text:"4 carriers qualified for ATL→MIA reefer load. Best match: Heartland Transport at $3,000, reefer available Monday, compliance verified. Margin: 18%." },
        { from:"D",color:C.green,text:"Book Heartland at $3,000." },
        { from:"AI",color:C.navy,text:"Carrier booked. Rate confirmation sent. Load updated in TMS. Dispatch notification sent to carrier. Confirmation #BK-91824." },
      ]},
  ];

  return (
    <>
      <div style={{ background:`linear-gradient(135deg,${C.navyDeep},${C.navy})`,padding:"140px clamp(1.5rem,6vw,6rem) 60px",textAlign:"center" }}>
        <div style={{ maxWidth:1300,margin:"0 auto" }}>
          <button onClick={() => { setPage(PAGES.BROKERS); window.scrollTo(0,0); }} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:C.sans,fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:16 }}>← Back to Brokers/3PLs & Shippers</button>
          <div style={{ fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.5)",marginBottom:16 }}>Broker, 3PL & Shipper Workflows</div>
          <h1 style={{ fontFamily:C.serif,fontSize:"clamp(2.5rem,5vw,4rem)",fontWeight:400,color:C.white,lineHeight:1.08,marginBottom:16 }}>How the AI agent fits into <Em>every step</Em> of carrier sales</h1>
          <p style={{ fontSize:18,color:C.midGray,maxWidth:620,margin:"0 auto 32px",lineHeight:1.6 }}>From sourcing carriers to booking and confirmation — see exactly how Channel19's AI agent handles each workflow for carrier sales reps and logistics teams.</p>
          <a href="https://calendly.com/tonysingh/" target="_blank" rel="noopener noreferrer"><Btn primary style={{ background:C.white,color:C.navy }}>Book a Demo →</Btn></a>
        </div>
      </div>

      <Section>
        <SectionLabel>Carrier Sales & Shipper Workflows</SectionLabel>
        <SectionTitle>Every workflow, from open load to <Em>covered & confirmed</Em></SectionTitle>
        <WorkflowTabs tabs={tabs} activeTab={tab} setActiveTab={setTab} />
        <WorkflowDetail step={tabs[tab]} />
      </Section>

      <Divider/>
      <Section>
        <SectionLabel>See It Live</SectionLabel>
        <SectionTitle>Watch the workflows <Em>in action</Em></SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:24 }}>
          <div>
            <LoomVideo src={BROKER_WORKFLOW_VIDEO} title="Broker/Shipper Workflow Demo" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>Carrier Sales Workflow Demo</p>
            <p style={{ fontSize:13,color:C.darkGray }}>End-to-end walkthrough of covering loads for brokers and shippers.</p>
          </div>
          <div>
            <LoomVideo src={BROKER_VOICE_VIDEO} title="AI Agent ↔ Carrier Voice" />
            <p style={{ fontSize:14,fontWeight:600,color:C.navy,marginTop:12 }}>AI Agent ↔ Carrier Voice Conversation</p>
            <p style={{ fontSize:13,color:C.darkGray }}>Actual voice conversation between the AI agent and a carrier.</p>
          </div>
        </div>
      </Section>

      <Divider/>
      <div style={{ background:C.offWhite }}>
        <ContactBlock label="For Brokers/3PLs & Shippers" title={<>Ready to see these workflows <Em>live?</Em></>} desc="Book a personalized demo and see how Channel19's AI agent handles your carrier outreach and load coverage." source="broker-workflows" formRef={formRef}/>
      </div>
    </>
  );
}

// ═══ MAIN ═══
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const formRef = useRef(null);
  return (
    <div style={{ fontFamily:C.sans,background:C.offWhite,color:C.navy,minHeight:"100vh",overflowX:"hidden" }}>
      <style>{globalCSS}</style>
      <Nav page={page} setPage={setPage}/>
      {page===PAGES.HOME && <HomePage setPage={setPage} formRef={formRef}/>}
      {page===PAGES.CARRIERS && <CarriersPage formRef={formRef} setPage={setPage}/>}
      {page===PAGES.BROKERS && <BrokersShippersPage formRef={formRef} setPage={setPage}/>}
      {page===PAGES.CARRIER_WF && <CarrierWorkflowsPage setPage={setPage} formRef={formRef}/>}
      {page===PAGES.BROKER_WF && <BrokerWorkflowsPage setPage={setPage} formRef={formRef}/>}
      {page===PAGES.TERMS && <TermsPage />}
      {page===PAGES.PRIVACY && <PrivacyPage />}
      <Footer setPage={setPage}/>
    </div>
  );
}

// ═══ TERMS OF USE PAGE ═══
function TermsPage() {
  const legalStyle = { maxWidth:800,margin:"0 auto",padding:"140px clamp(1.5rem,6vw,4rem) 80px",fontFamily:C.sans,color:C.navyMid,lineHeight:1.75,fontSize:15 };
  const h2s = { fontFamily:C.serif,fontSize:22,fontWeight:600,color:C.navy,marginTop:40,marginBottom:12 };
  const ps = { marginBottom:16 };
  return (
    <div style={legalStyle}>
      <h1 style={{ fontFamily:C.serif,fontSize:"clamp(2rem,4vw,3rem)",fontWeight:400,color:C.navy,marginBottom:24 }}>Terms of Use</h1>

      <p style={ps}>This Terms of Service Agreement (the "Agreement") describes the terms by which "Channel19, Inc." offers to you, as a Carrier, access to its website www.channel19.io (the "Site") and the associated mobile software application platform owned and operated by Channel19 ("Mobile App"). Channel19, Inc. ("Channel19") owns and operates the Channel19 proprietary software platform (the "Platform") that helps small independent owner-operators and trucking companies in finding the best loads for their trucks. It further helps with booking, tracking and management of loads (each, a "Load"), booked through the Platform and related trucking operations.</p>

      <p style={ps}>This terms of service agreement (the "Agreement") sets forth the legally binding terms and conditions governing the access and use of the Platform, Services, Content, Load Data (as each term is defined in Sections 5.1), and any related services provided by Channel19 in connection with the use of any of the foregoing (collectively, the "Channel19 Service"). By booking a load (a "transaction"), registering an account to access and/or use the Channel19 service (an "account") and/or otherwise accessing and/or utilizing the Channel19 service (or any part thereof): you acknowledge that you have read, understand, and agree to be bound by all of the terms and conditions of this agreement; you represent that you have the authority to enter into this agreement on behalf of the entity or person identified on the account and in respect of whom the Channel19 service was ordered and/or the transaction was placed (such entity or person, "customer"), and to bind customer to the terms of this agreement; and you agree that the customer is entering into this agreement with Channel19, Inc.</p>

      <p style={ps}>If you do not agree with all of the terms of this agreement, or do not have such authority to bind customer to the terms of this agreement, do not create an account, book a transaction, or otherwise access and/or use the Channel19 service or any part thereof.</p>

      <p style={ps}>Customer agrees to provide and maintain up to date information that is true, accurate, current, and complete. Customer agrees that Customer will not (i) create an Account using a false identity or fictitious name or information, and/or (ii) create an Account or use the Channel19 Service if Customer has been previously removed or banned by Channel19 from use of the Channel19 Service, or any part thereof. Customer understands and agrees that Customer is solely responsible for maintaining the confidentiality of and protecting Customer's and its Authorized User's passwords for the Account. Customer is solely responsible for any activity originating from its Account, regardless of whether such activity is authorized by Customer. Customer agrees to notify Channel19 immediately of any unauthorized use of its Account.</p>

      <p style={ps}>Channel19 reserves the right to limit the number of Accounts that can be created from any one (1) computer or mobile device and the number of computer or mobile devices that can access an individual Account. "Authorized Users" means Customer's employees, contractors, and/or agents of Customer, including, without limitation, drivers of trucks and/or vehicle owned and/or operated by Customer, that Customer has authorized to access and use the Channel19 Service and/or that transport Loads on behalf of Customer.</p>

      <h2 style={h2s}>Channel19 Service</h2>
      <p style={ps}>Channel19 reserves the rights to either temporarily or permanently modify, suspend or discontinue the Channel19 Service (or any part thereof) with or without notice. Customer agrees that Channel19 will not be liable to Customer or to any third party for any modification, suspension or discontinuance of the Channel19 Service (or any part thereof).</p>

      <p style={ps}>Customer agrees to provide reasonable assistance and support to Channel19 in the provision of the Channel19 Service and/or performance of Services under this Agreement. Customer acknowledges and agrees that Channel19's ability to successfully provide the Channel19 Service and perform Services under this Agreement in a timely manner is contingent upon performance by Customer of the obligations set forth in this Agreement, and Channel19 shall have no liability for deficiencies in the performance and/or delivery of the Channel19 Service (or any part thereof) resulting from any act or omission of Customer, or any of its employees, contractors, or agents.</p>

      <p style={ps}>Customer shall not permit any person other than Authorized Users to access and use the Channel19 Service (or any part thereof), and shall ensure that Authorized Users use the Channel19 Service solely in accordance with this Agreement. Customer acknowledges and agrees that Customer is solely responsible for its Authorized Users, and any breach of this Agreement by any Authorized User will be deemed a breach by Customer.</p>

      <p style={ps}>Customer understands and agrees that Channel19 may collect data and information, which may include Personal Data (as defined in Section 2.4), in connection with Customer's and/or its Authorized User's use of the Channel19 Service (collectively, "Customer Data"). Customer grants to Channel19 a non-exclusive, royalty-free, fully-paid, worldwide license to use and process Customer Data as reasonably necessary for Channel19 to provide Customer the Channel19 Service hereunder.</p>

      <p style={ps}>Customer acknowledges and agrees that, as between the parties, with respect to the collection, transmission, disclosure, processing and/or use of any personally identifiable data and/or information through or in connection with the use of the Channel19 Service ("Personal Data"), that is subject to any applicable laws, rules, or regulations pertaining to data privacy or data security ("Data Protection Laws"), Customer is the data controller and Channel19 is merely a data processor and/or service provider as such terms are defined pursuant to Data Protection Laws. Personal Data provided to, or collected by, Channel19 in connection with Channel19 Service shall only be used in accordance with this Agreement and the Channel19 Privacy Policy.</p>

      <p style={ps}>Channel19 does not conduct any verification of our Partners Loads through the Platform. Channel19 does not represent, warrant or guarantee the Partner's identity and whether the Partner is trustworthy. Customer understands and agrees that Customer's and its Authorized Users' interactions and dealings with Partners in connection with any Transactions, are solely between Customer and such Partner. Customer is solely responsible and liable for, and Channel19 shall not be a party to or responsible for, any Transactions booked by or on behalf of Customer.</p>

      <h2 style={h2s}>Intellectual Property Ownership</h2>
      <p style={ps}>All intellectual property rights in and to the Channel19 Service, including but not limited to patents, copyrights, trademarks, and trade secrets, are and shall remain the sole and exclusive property of Channel19.</p>

      <h2 style={h2s}>Notices</h2>
      <p style={ps}>All notices permitted or required under this Agreement shall be in writing and shall be delivered by personal delivery, e-mail, or by certified or registered mail, return receipt requested. Notices shall be sent to Customer at the email address or other address Channel19 has on file for Customer, and to Channel19 at tony@channel19.io; Subject Line: Legal Notice – Customer Terms of Service Agreement.</p>

      <h2 style={h2s}>Other Provisions</h2>
      <p style={ps}>Customer shall not assign this Agreement or transfer any of its rights hereunder, or delegate the performance of any of its duties or obligations arising under this Agreement, whether by merger, acquisition, sale of assets, operation of law, or otherwise, without the prior written consent of Channel19. Any purported assignment in violation of the preceding sentence is null and void.</p>

      <p style={ps}>No waiver will be implied from conduct or failure to enforce rights. If any term of this Agreement is found invalid or unenforceable that term will be enforced to the maximum extent permitted by law and the remainder of this Agreement will remain in full force. The parties are independent contractors. This Agreement represents the entire agreement between the parties relating to its subject matter and supersedes all prior and/or contemporaneous representations, discussions, negotiations and agreements, whether written or oral.</p>

      <h2 style={h2s}>Agreement Changes</h2>
      <p style={ps}>Channel19 reserves the right to update or modify this Agreement at any time. Channel19 agrees to notify Customer of any material changes to the terms of this Agreement by posting a notice of the changes on our website. Customer's continued use of the Channel19 Service after Channel19 has posted the updated Agreement signifies Customer's acknowledgment and agreement to be bound by the revised Agreement.</p>

      <p style={{ ...ps,marginTop:40,fontSize:13,color:C.darkGray }}>Copyright © {new Date().getFullYear()} Channel19, Inc. All Rights Reserved.</p>
    </div>
  );
}

// ═══ PRIVACY POLICY PAGE ═══
function PrivacyPage() {
  const legalStyle = { maxWidth:800,margin:"0 auto",padding:"140px clamp(1.5rem,6vw,4rem) 80px",fontFamily:C.sans,color:C.navyMid,lineHeight:1.75,fontSize:15 };
  const h2s = { fontFamily:C.serif,fontSize:22,fontWeight:600,color:C.navy,marginTop:40,marginBottom:12 };
  const h3s = { fontSize:16,fontWeight:600,color:C.navy,marginTop:24,marginBottom:8 };
  const ps = { marginBottom:16 };
  return (
    <div style={legalStyle}>
      <h1 style={{ fontFamily:C.serif,fontSize:"clamp(2rem,4vw,3rem)",fontWeight:400,color:C.navy,marginBottom:24 }}>Privacy Policy</h1>

      <p style={ps}>Channel19 provides an online and mobile platform to connect Freight Sources (Brokers) with Carriers for the transportation of cargo. Freight Sources can submit a request for the transportation of cargo ("Load"), Carriers can accept such requests and assign Drivers to fulfill them, and Freight Sources, Carriers, and Drivers can track such requests. This Privacy Policy describes how Channel19 ("we" or "us") collects, uses, and discloses information when you use our websites, mobile applications, and other online products and services (collectively, the "Services") or when you otherwise interact with us.</p>

      <p style={ps}>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice. We encourage you to review the Privacy Policy whenever you access the Services to stay informed about our information practices.</p>

      <h2 style={h2s}>Collection of Information</h2>

      <h3 style={h3s}>Information You Provide to Us</h3>
      <p style={ps}>We collect information you provide directly to us. For example, we collect information when you fill out a form, request to be a Carrier or a Freight Source, log into your Channel19 account, submit or accept a Load request, request customer support, or otherwise communicate with us. This information may include name, company name, email address, phone number, payment information, insurance information, service ratings and reviews, and any other information you choose to provide.</p>

      <h3 style={h3s}>Information We Collect When You Use the Services</h3>
      <p style={ps}>When you use the Services, we collect additional information about Load requests and how they are fulfilled, including the following:</p>
      <p style={ps}><strong>Freight Sources:</strong> If you are a Freight Source and submit a Load request, we collect certain details related to your submission, including the date and time of your request, origin and destination addresses, description of the cargo being transported, rate, and other information about the Load.</p>
      <p style={ps}><strong>Carriers:</strong> If you are a Carrier, we collect information on your bids on Load requests as well as information about your acceptance and fulfillment of any Load requests, including vehicle and driver information.</p>
      <p style={ps}><strong>Drivers:</strong> If you are a driver transporting cargo on behalf of a Carrier, we may collect information on your travel to fulfill a Load request. We also collect information about your location and about files you upload.</p>
      <p style={ps}><strong>Location Information:</strong> Providing Services to our users requires the collection of precise location information. When you download and use our mobile applications, we will ask for permission to access your precise location. We use this information to track Loads, and also to understand your typical driving patterns to offer Carriers jobs that are more likely to be relevant to them and their Drivers.</p>

      <h3 style={h3s}>Photos</h3>
      <p style={ps}>Our Services may ask you to photograph and upload to the Services certain documents related to the fulfillment of a Load request, such as certificates of insurance and other legal documents, bills of lading, and proofs of delivery. You may also be able to upload pictures of cargo that you carry.</p>

      <h3 style={h3s}>Information We Collect Automatically</h3>
      <p style={ps}><strong>Log Information:</strong> We collect log information about your use of the Services, including the type of browser or app version you use, access times, pages viewed, your IP address, and the page you visited before navigating to our Services.</p>
      <p style={ps}><strong>Device Information:</strong> We collect information about the computer or mobile device you use to access our Services, including the hardware model, operating system and version, device and app identifiers, and mobile network information.</p>
      <p style={ps}><strong>Cookies and Tracking Technologies:</strong> We use various technologies to collect information, including cookies and web beacons. Cookies are small data files stored on your hard drive or in device memory that help us improve our Services and your experience, see which areas and features of our Services are popular, and count visits.</p>

      <h2 style={h2s}>Use of Information</h2>
      <p style={ps}>We may also obtain information from other sources and combine that with information we collect directly. These third parties include verification services, credit bureaus, and publicly available sources.</p>
      <p style={ps}>We use the information we collect in order to provide and improve our Services, including to connect Freight Sources with Carriers, match Drivers with Load requests, facilitate transportation of cargo, process payments, and confirm delivery. We use your phone number to call you and send you SMS messages about potential and current Loads. We may also use information to: send you technical notices, updates, security alerts and administrative messages; respond to your comments, questions, and requests; communicate with you about products, services, offers, and promotions; monitor and analyze trends, usage, and activities; detect, investigate, and prevent fraudulent transactions and other illegal activities; personalize and improve the Services; and carry out any other purpose described to you at the time the information was collected.</p>

      <h2 style={h2s}>Sharing of Information</h2>
      <p style={ps}>Depending on how you use our Services, we may share information about you with other users of the Services. For example, if you are a driver, we share your name, vehicle information, precise or approximate location, and certain contact information with Freight Sources involved in the Load request you helped to fulfill.</p>
      <p style={ps}>We may also share information about you with third parties, such as: vendors and service providers who carry out work on our behalf; in response to legal requests; to protect the rights, property, and safety of Channel19 or others; in connection with any merger, sale of company assets, or acquisition; between Channel19 and our affiliates; and with your consent or at your direction. We may also share aggregated or de-identified information, which cannot reasonably be used to identify you.</p>

      <h2 style={h2s}>Advertising and Analytics</h2>
      <p style={ps}>We may allow others to provide analytics services and serve advertisements on our behalf across the Internet and in applications. These entities may use cookies, web beacons, device identifiers, and other technologies to collect information about your use of the Services. For more information about interest-based ads, or to opt out, please visit www.aboutads.info/choices.</p>

      <h2 style={h2s}>Security</h2>
      <p style={ps}>Channel19 takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.</p>

      <h2 style={h2s}>Contact Us</h2>
      <p style={ps}>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:tony@channel19.io" style={{ color:C.navy,textDecoration:"underline" }}>tony@channel19.io</a></p>

      <p style={{ ...ps,marginTop:40,fontSize:13,color:C.darkGray }}>Copyright © {new Date().getFullYear()} Channel19, Inc. All Rights Reserved.</p>
    </div>
  );
}

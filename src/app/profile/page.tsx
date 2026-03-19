"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PageHeader, Button, Toast } from "@/components/ui";
import { MOCK_PLEDGE } from "@/lib/mockData";

const LOCATION_OPTIONS  = ["BU campus (Comm Ave)","Kenmore / Fenway","Back Bay","South End","Allston / Brighton","Brookline","Downtown / Financial","Cambridge / MIT"];
const TRANSPORT_OPTIONS = ["Walking","MBTA / T","Bike","Car"];
const FOOD_OPTIONS      = ["Coffee","Boba / Tea","Casual dining","Dining hall","Brunch","No preference"];
const SPORTS_OPTIONS    = ["Basketball","Soccer","Football","Baseball","Hockey","Tennis","Running","No preference"];
const HOBBY_OPTIONS     = ["Hackathons","Gaming","Music","Film","Startups","Design","Fitness","Reading","Travel","Machine Learning","Open source"];

type Step = 0 | 1 | 2 | 3 | 4;
const STEP_LABELS = ["Basic info","Budget","Location","Interests","Preview"];

function MultiSelect({ options, selected, onChange, green }: {
  options: string[]; selected: string[];
  onChange: (v: string[]) => void; green?: boolean;
}) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt]);
  }
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {options.map(opt => {
        const on = selected.includes(opt);
        return (
          <div
            key={opt}
            onClick={() => toggle(opt)}
            style={{
              padding:"7px 14px", borderRadius:999, fontSize:12, fontWeight:500,
              cursor:"pointer", transition:"all 0.15s", userSelect:"none",
              background: on ? (green ? "var(--green-bg2)" : "var(--blue-bg2)") : "var(--gray-100)",
              color:       on ? (green ? "var(--green)"    : "var(--blue)")     : "var(--gray-600)",
              border:      on ? `1.5px solid ${green ? "var(--green-mid)" : "var(--blue)"}` : "1.5px solid var(--gray-200)",
            }}
          >
            {opt}
          </div>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const p = MOCK_PLEDGE;
  const [step,      setStep]      = useState<Step>(0);
  const [name,      setName]      = useState(p.full_name);
  const [major,     setMajor]     = useState(p.major ?? "");
  const [year,      setYear]      = useState(String(p.grad_year ?? ""));
  const [budget,    setBudget]    = useState(p.budget_max);
  const [locations, setLocations] = useState<string[]>(p.locations);
  const [transport, setTransport] = useState<string[]>(p.transport);
  const [food,      setFood]      = useState<string[]>(p.food_prefs);
  const [sports,    setSports]    = useState<string[]>(p.sports);
  const [hobbies,   setHobbies]   = useState<string[]>(p.hobbies);
  const [toast,     setToast]     = useState({ visible: false, msg: "" });
  const [saving,    setSaving]    = useState(false);

  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  function next() { if (step < 4) setStep((step + 1) as Step); }
  function back() { if (step > 0) setStep((step - 1) as Step); }

  async function save() {
    setSaving(true);
    // TODO: supabase.from("profiles").upsert({ id: userId, full_name: name, major, grad_year: +year, budget_max: budget, locations, transport, food_prefs: food, sports, hobbies, profile_complete: true })
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setToast({ visible: true, msg: "Profile saved!" });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  return (
    <AppLayout>
      <PageHeader title="My profile" subtitle="Pledge · Spring 2025" />

      <main style={{ padding:28 }} className="page-enter">
        <div style={{ maxWidth:600, margin:"0 auto" }}>

          {/* Wizard steps */}
          <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
            {STEP_LABELS.map((label, i) => (
              <>
                <div
                  key={label}
                  style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}
                  onClick={() => i < step && setStep(i as Step)}
                >
                  <div style={{
                    width:26, height:26, borderRadius:"50%", flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:700,
                    background: i < step ? "var(--green)" : i === step ? "var(--blue)" : "var(--gray-100)",
                    color:      i < step ? "white"        : i === step ? "white"       : "var(--gray-400)",
                    border:     i < step ? "none"         : i === step ? "none"        : "1.5px solid var(--gray-200)",
                    cursor:     i < step ? "pointer" : "default",
                    transition:"all 0.2s",
                  }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span style={{
                    fontSize:12, fontWeight:500,
                    color: i === step ? "var(--blue)" : i < step ? "var(--green)" : "var(--gray-400)",
                    display: i > 2 ? "none" : "block", // hide labels on smaller screens when crowded
                  }}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div key={`conn-${i}`} style={{ flex:1, height:1.5, background: i < step ? "var(--green)" : "var(--gray-200)", margin:"0 4px", maxWidth:40 }} />
                )}
              </>
            ))}
          </div>

          <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"24px 28px" }}>

            {/* Step 0: Basic info */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:"var(--gray-900)", marginBottom:20 }}>Basic information</h2>
                <FormGroup label="Full name">
                  <input className="form-input" value={name} onChange={e => setName(e.target.value)} type="text" />
                </FormGroup>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <FormGroup label="Major">
                    <input className="form-input" value={major} onChange={e => setMajor(e.target.value)} type="text" />
                  </FormGroup>
                  <FormGroup label="Graduation year">
                    <input className="form-input" value={year} onChange={e => setYear(e.target.value)} type="text" />
                  </FormGroup>
                </div>
                <FormGroup label="BU email">
                  <input className="form-input" value={p.email} readOnly style={{ background:"var(--gray-50)", color:"var(--gray-400)" }} />
                </FormGroup>
              </div>
            )}

            {/* Step 1: Budget */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:"var(--gray-900)", marginBottom:6 }}>Budget preferences</h2>
                <p style={{ fontSize:13, color:"var(--gray-500)", marginBottom:20, lineHeight:1.65 }}>
                  Budget is the most heavily weighted factor in your matches. Be honest — it helps everyone find a comfortable fit.
                </p>
                <FormGroup label="Maximum spend per chat" hint="Drag to set your comfortable maximum (including tip)">
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:8 }}>
                    <span style={{ fontSize:12, color:"var(--gray-400)" }}>$0</span>
                    <input type="range" min={0} max={40} step={1} value={budget} onChange={e => setBudget(+e.target.value)} style={{ flex:1 }} />
                    <span style={{ fontSize:12, color:"var(--gray-400)" }}>$40+</span>
                  </div>
                  <div style={{ textAlign:"center", marginTop:12 }}>
                    <span style={{ fontFamily:"'DM Mono', monospace", fontSize:28, fontWeight:600, color:"var(--blue)" }}>${budget}</span>
                    <span style={{ fontSize:13, color:"var(--gray-400)" }}> max per chat</span>
                  </div>
                </FormGroup>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:"var(--gray-900)", marginBottom:6 }}>Location preferences</h2>
                <p style={{ fontSize:13, color:"var(--gray-500)", marginBottom:20, lineHeight:1.65 }}>
                  Proximity is the second most heavily weighted factor. Select all areas you're comfortable meeting in.
                </p>
                <FormGroup label="Preferred neighborhoods / areas">
                  <MultiSelect options={LOCATION_OPTIONS} selected={locations} onChange={setLocations} />
                </FormGroup>
                <FormGroup label="Transportation">
                  <MultiSelect options={TRANSPORT_OPTIONS} selected={transport} onChange={setTransport} />
                </FormGroup>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:"var(--gray-900)", marginBottom:6 }}>Interests</h2>
                <p style={{ fontSize:13, color:"var(--gray-500)", marginBottom:20, lineHeight:1.65 }}>
                  These surface conversation starters and have lower weight in the algorithm.
                </p>
                <FormGroup label="Food & drink preferences">
                  <MultiSelect options={FOOD_OPTIONS} selected={food} onChange={setFood} />
                </FormGroup>
                <FormGroup label="Sports you follow">
                  <MultiSelect options={SPORTS_OPTIONS} selected={sports} onChange={setSports} />
                </FormGroup>
                <FormGroup label="Hobbies & interests">
                  <MultiSelect options={HOBBY_OPTIONS} selected={hobbies} onChange={setHobbies} />
                </FormGroup>
              </div>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:"var(--gray-900)", marginBottom:16 }}>Profile preview</h2>
                <div style={{ background:"var(--gray-50)", border:"1px solid var(--gray-200)", borderRadius:14, padding:20, marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                    <div style={{ width:48, height:48, borderRadius:"50%", background:"var(--blue-bg2)", border:"1.5px solid var(--blue-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"var(--blue)" }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:"var(--gray-900)" }}>{name}</div>
                      <div style={{ fontSize:12, color:"var(--gray-500)", marginTop:2 }}>{major} · {year} · Pledge</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:500, background:"var(--blue-bg)", color:"var(--blue)", border:"1px solid rgba(69,142,255,0.25)" }}>${budget} max</span>
                    {locations.slice(0, 2).map(l => <span key={l} style={{ display:"inline-block", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:500, background:"var(--blue-bg)", color:"var(--blue)", border:"1px solid rgba(69,142,255,0.25)" }}>{l}</span>)}
                    {food.slice(0, 1).map(f => <span key={f} style={{ display:"inline-block", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:500, background:"var(--gray-100)", color:"var(--gray-500)", border:"1px solid var(--gray-200)" }}>{f}</span>)}
                    {sports.slice(0, 1).map(s => <span key={s} style={{ display:"inline-block", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:500, background:"var(--gray-100)", color:"var(--gray-500)", border:"1px solid var(--gray-200)" }}>{s}</span>)}
                    {hobbies.slice(0, 2).map(h => <span key={h} style={{ display:"inline-block", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:500, background:"var(--gray-100)", color:"var(--gray-500)", border:"1px solid var(--gray-200)" }}>{h}</span>)}
                  </div>
                </div>
                <div style={{ padding:"14px 16px", background:"var(--green-bg2)", border:"1px solid var(--green-light)", borderRadius:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--green)", marginBottom:2 }}>Profile complete</div>
                  <div style={{ fontSize:12, color:"var(--gray-600)" }}>You'll appear in brother search results and receive match suggestions.</div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:28, paddingTop:20, borderTop:"1px solid var(--gray-100)" }}>
              <Button variant="ghost" onClick={back} style={{ visibility: step === 0 ? "hidden" : "visible" }}>← Back</Button>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:12, color:"var(--gray-400)" }}>Step {step + 1} of {STEP_LABELS.length}</span>
                {step < 4
                  ? <Button variant="primary" onClick={next}>Continue →</Button>
                  : <Button variant="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save profile ✓"}</Button>
                }
              </div>
            </div>
          </div>
        </div>
      </main>

      <Toast message={toast.msg} visible={toast.visible} />
    </AppLayout>
  );
}

function FormGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--gray-700)", marginBottom: hint ? 4 : 6 }}>{label}</label>
      {hint && <div style={{ fontSize:11, color:"var(--gray-400)", marginBottom:6 }}>{hint}</div>}
      {children}
    </div>
  );
}

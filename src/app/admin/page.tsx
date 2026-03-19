import AppLayout from "@/components/AppLayout";
import { PageHeader, StatCard, Pill } from "@/components/ui";

// Mock admin data
// TODO: replace with Supabase query that joins profiles + chat_requests
const PLEDGE_STATS = [
  { name:"Jamie S.",  major:"CS",         chats:2, last:"Mar 15" },
  { name:"Kai L.",    major:"Finance",     chats:4, last:"Mar 17" },
  { name:"Morgan T.", major:"ECE",         chats:1, last:"Mar 10" },
  { name:"Riley P.",  major:"Data Sci",    chats:3, last:"Mar 16" },
  { name:"Avery M.",  major:"BioE",        chats:0, last:"—" },
  { name:"Dakota W.", major:"CS",          chats:5, last:"Mar 17" },
  { name:"Quinn H.",  major:"Math",        chats:2, last:"Mar 12" },
  { name:"Blake R.",  major:"MechE",       chats:0, last:"—" },
  { name:"Casey N.",  major:"CE",          chats:3, last:"Mar 14" },
  { name:"Drew K.",   major:"CS / Econ",   chats:1, last:"Mar 9" },
  { name:"Hayden J.", major:"ECE",         chats:4, last:"Mar 16" },
  { name:"Reese A.",  major:"CS",          chats:0, last:"—" },
];
const GOAL = 5;
const LOW_MATCH_BROTHERS = ["Jordan P.", "Omar W.", "Sam R."];

export default function AdminPage() {
  const total     = PLEDGE_STATS.length;
  const avgChats  = (PLEDGE_STATS.reduce((s, p) => s + p.chats, 0) / total).toFixed(1);
  const onTrack   = PLEDGE_STATS.filter(p => p.chats >= 2).length;
  const noChats   = PLEDGE_STATS.filter(p => p.chats === 0).length;

  return (
    <AppLayout>
      <PageHeader title="Admin view" subtitle="Exec board only · Spring 2025">
        <ExportButton />
      </PageHeader>

      <main style={{ padding:28 }} className="page-enter">

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
          <StatCard label="Total pledges"  value={total}    color="blue" />
          <StatCard label="Avg chats done" value={avgChats} color="green" />
          <StatCard label="On track (≥2)"  value={onTrack}  sub="completed ≥ 2 chats" color="blue" />
          <StatCard label="Needs attention" value={noChats} sub="0 chats yet" color={noChats > 0 ? "warn" : "default"} />
        </div>

        {/* Pledge table */}
        <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, overflow:"hidden", marginBottom:16 }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--gray-100)" }}>
            <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)" }}>
              Pledge completion tracker
            </div>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"var(--gray-50)" }}>
                {["Pledge","Major","Completed","Progress","Last chat","Status"].map(h => (
                  <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", borderBottom:"1px solid var(--gray-100)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLEDGE_STATS.map((p, i) => {
                const pct = Math.round((p.chats / GOAL) * 100);
                const barColor = p.chats === 0 ? "var(--gray-200)" : p.chats >= GOAL ? "var(--green)" : "var(--blue)";
                const pill = p.chats === 0
                  ? <Pill label="No chats yet" color="warn" />
                  : p.chats >= GOAL
                  ? <Pill label="Complete ✓"   color="green" />
                  : <Pill label="In progress"  color="blue" />;

                return (
                  <tr key={p.name} style={{ borderBottom: i < PLEDGE_STATS.length - 1 ? "1px solid var(--gray-100)" : "none" }}>
                    <td style={{ padding:"12px 16px", fontWeight:600, color:"var(--gray-900)" }}>{p.name}</td>
                    <td style={{ padding:"12px 16px", color:"var(--gray-500)" }}>{p.major}</td>
                    <td style={{ padding:"12px 16px", color:"var(--gray-700)" }}>
                      <strong>{p.chats}</strong> / {GOAL}
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:80, height:6, background:"var(--gray-100)", borderRadius:999, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:barColor, borderRadius:999 }} />
                        </div>
                        <span style={{ fontSize:11, color:"var(--gray-400)" }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px", color:"var(--gray-500)" }}>{p.last}</td>
                    <td style={{ padding:"12px 16px" }}>{pill}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Low match brothers */}
        <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"16px 20px" }}>
          <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", marginBottom:8 }}>
            Brothers with low match count
          </div>
          <p style={{ fontSize:13, color:"var(--gray-500)", marginBottom:12, lineHeight:1.65 }}>
            Brothers who have received fewer than 2 chat requests this semester. Consider nudging pledges toward them — shown anonymously to pledges.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
            {LOW_MATCH_BROTHERS.map(b => (
              <span key={b} style={{ display:"inline-block", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:500, background:"var(--blue-bg)", color:"var(--blue)", border:"1px solid rgba(69,142,255,0.25)" }}>
                {b}
              </span>
            ))}
            <span style={{ fontSize:12, color:"var(--gray-400)" }}>— nudge pledges to browse them</span>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

// Client component for CSV export
// (needs "use client" — separated to keep parent as Server Component)
function ExportButton() {
  return (
    <button
      style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:10, fontFamily:"inherit", fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid var(--gray-200)", background:"white", color:"var(--gray-600)" }}
      onClick={() => {
        const rows = [["Pledge","Major","Chats","Last chat"],
          ...[ {name:"Jamie S.", major:"CS", chats:2, last:"Mar 15"} ].map(p => [p.name, p.major, p.chats, p.last])
        ];
        const csv = rows.map(r => r.join(",")).join("\n");
        const a = document.createElement("a");
        a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        a.download = "ktphriends-spring2025.csv";
        a.click();
      }}
    >
      Export CSV ↓
    </button>
  );
}

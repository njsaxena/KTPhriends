import AppLayout from "@/components/AppLayout";
import { PageHeader, StatCard, ScoreBar, AvailDot } from "@/components/ui";
import { rankBrothers } from "@/lib/matching";
import { MOCK_PLEDGE, MOCK_PLEDGE_AVAIL, MOCK_BROTHERS, MOCK_BROTHER_AVAILS, MOCK_CHATS } from "@/lib/mockData";

// TODO: Replace mock data with Supabase queries:
// const supabase = createClient();
// const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
// const { data: brothers } = await supabase.from("profiles").select("*").eq("role", "brother");
// etc.

export default function DashboardPage() {
  const pledge = MOCK_PLEDGE;
  const chats  = MOCK_CHATS;
  const ranked = rankBrothers(pledge, MOCK_PLEDGE_AVAIL, MOCK_BROTHERS, MOCK_BROTHER_AVAILS);
  const topMatches = ranked.slice(0, 4);

  const completed  = chats.filter(c => c.status === "completed").length;
  const confirmed  = chats.filter(c => c.status === "confirmed").length;
  const goalTotal  = 50;
  const pct        = Math.round((completed / goalTotal) * 100);
  const availCount = MOCK_BROTHERS.filter(b => b.available_this_week).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Spring 2025" />

      <main style={{ padding:28 }} className="page-enter">

        {/* Hero */}
        <div style={{
          background:"white", border:"1px solid var(--gray-200)", borderRadius:20,
          padding:"28px 32px", marginBottom:20,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg, var(--blue), var(--green))" }} />
          <div style={{ maxWidth:480 }}>
            <div style={{ fontSize:22, fontWeight:700, color:"var(--gray-900)", letterSpacing:-0.5 }}>
              {greeting}, {pledge.full_name.split(" ")[0]} 👋
            </div>
            <div style={{ fontSize:14, color:"var(--gray-500)", marginTop:4 }}>
              You have <strong>{completed} chat{completed !== 1 ? "s" : ""} completed</strong> this semester.
              {completed < goalTotal ? ` Aim for ${goalTotal} total!` : " You've hit your goal!"}
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <a href="/browse" style={{ textDecoration:"none" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"var(--blue)", color:"white", fontSize:13, fontWeight:500, cursor:"pointer" }}>
                  Browse brothers
                </div>
              </a>
              <a href="/availability" style={{ textDecoration:"none" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, background:"transparent", color:"var(--gray-600)", border:"1px solid var(--gray-200)", fontSize:13, fontWeight:500, cursor:"pointer" }}>
                  Update availability
                </div>
              </a>
            </div>
          </div>
          {/* Decorative circles */}
          <div style={{ position:"absolute", right:32, top:"50%", transform:"translateY(-50%)", display:"flex", gap:8, alignItems:"center", opacity:0.4, pointerEvents:"none" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", border:"2px solid var(--blue-light)" }} />
            <div style={{ width:44, height:44, borderRadius:"50%", border:"2px solid var(--green-mid)", marginTop:12 }} />
            <div style={{ width:52, height:52, borderRadius:"50%", border:"2px solid var(--blue-light)", marginTop:-8 }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
          <StatCard label="Chats completed" value={completed} sub={`of ${goalTotal} goal`} color="blue" />
          <StatCard label="Brothers available" value={availCount} sub="this week" color="green" />
          <StatCard label="Top match score"   value={`${ranked[0]?.score ?? 0}%`} sub={ranked[0]?.full_name} color="blue" />
          <StatCard label="Pending requests"  value={confirmed} sub="awaiting confirm" color={confirmed > 0 ? "warn" : "default"} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Progress + Activity */}
          <div>
            <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"20px 24px", marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", marginBottom:12 }}>
                Semester progress
              </div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--gray-500)", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:8 }}>
                Chat completion — {completed} of {goalTotal}
              </div>
              <div style={{ background:"var(--gray-100)", borderRadius:999, height:8, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg, var(--blue), var(--green-mid))", borderRadius:999 }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:12, color:"var(--gray-400)" }}>
                <span style={{ color:"var(--blue)", fontWeight:600 }}>{pct}%</span>
                <span>{goalTotal} required</span>
              </div>
            </div>

            <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"20px 24px" }}>
              <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", marginBottom:14 }}>
                Recent activity
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {chats.slice(0, 3).map(chat => (
                  <div key={chat.id} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13 }}>
                    <div style={{
                      width:30, height:30, borderRadius:"50%", flexShrink:0,
                      background: chat.brother?.avatar_color === "green" ? "var(--green-bg2)" : "var(--blue-bg2)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:700,
                      color: chat.brother?.avatar_color === "green" ? "var(--green)" : "var(--blue)",
                    }}>
                      {chat.brother?.initials}
                    </div>
                    <div>
                      <span style={{ fontWeight:600, color:"var(--gray-800)" }}>{chat.brother?.full_name}</span>
                      <span style={{ color:"var(--gray-400)" }}> · {
                        chat.status === "completed" ? "Chat completed ✓" :
                        chat.status === "confirmed" ? "Chat confirmed" : "Chat requested"
                      }</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top matches */}
          <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"20px 24px" }}>
            <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", marginBottom:14 }}>
              Top matches for you
            </div>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {topMatches.map((b, i) => (
                <a key={b.id} href="/browse" style={{ textDecoration:"none" }}>
                  <div style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 0",
                    borderBottom: i < topMatches.length - 1 ? "1px solid var(--gray-100)" : "none",
                    cursor:"pointer",
                  }}>
                    <div style={{
                      width:32, height:32, borderRadius:"50%", flexShrink:0,
                      background: b.avatar_color === "green" ? "var(--green-bg2)" : "var(--blue-bg2)",
                      border: `1.5px solid ${b.avatar_color === "green" ? "var(--green-mid)" : "var(--blue-light)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:700,
                      color: b.avatar_color === "green" ? "var(--green)" : "var(--blue)",
                    }}>
                      {b.initials}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"var(--gray-900)" }}>{b.full_name}</div>
                      <div style={{ fontSize:11, color:"var(--gray-400)" }}>{b.major} · {b.ktp_role}</div>
                    </div>
                    <div style={{ width:80 }}>
                      <ScoreBar score={b.score} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <a href="/browse" style={{ textDecoration:"none" }}>
              <div style={{
                marginTop:14, padding:"8px 14px", borderRadius:10,
                background:"var(--blue-bg)", color:"var(--blue)",
                border:"1px solid var(--blue-light)",
                fontSize:13, fontWeight:500, textAlign:"center", cursor:"pointer",
              }}>
                See all brothers →
              </div>
            </a>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

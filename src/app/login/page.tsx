"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();
  const supabase = supabaseConfigured ? createClient() : null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Supabase isn’t configured. Add env vars in .env.local to enable login.");
      setLoading(false);
      return;
    }

    // Optional: restrict to @bu.edu
    if (process.env.NEXT_PUBLIC_RESTRICT_BU_EMAIL === "true" && !email.endsWith("@bu.edu")) {
      setError("Please use your @bu.edu email address.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--gray-50)" }}>
      <div style={{ width:"100%", maxWidth:420, padding:24 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:500, color:"white" }}>
            KTP
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:700, color:"var(--gray-900)", letterSpacing:-0.4 }}>KTPhriends</div>
            <div style={{ fontSize:12, color:"var(--gray-400)" }}>Kappa Theta Pi · Boston University</div>
          </div>
        </div>

        <div className="ktp-card" style={{ position:"relative", overflow:"hidden" }}>
          {/* Gradient accent */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg, var(--blue), var(--green))" }} />

          {!sent ? (
            <>
              <h1 style={{ fontSize:18, fontWeight:700, color:"var(--gray-900)", marginBottom:6 }}>Sign in</h1>
              <p style={{ fontSize:13, color:"var(--gray-500)", marginBottom:24, lineHeight:1.6 }}>
                Enter your BU email. We&apos;ll send you a magic link — no password needed.
              </p>

              {!supabaseConfigured && (
                <div style={{ fontSize:13, color:"var(--gray-600)", background:"var(--gray-50)", border:"1px solid var(--gray-200)", padding:"10px 12px", borderRadius:10, marginBottom:14, lineHeight:1.5 }}>
                  Supabase isn’t configured yet, so email login is disabled. You can still use the app via the dashboard in mock-data mode.
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--gray-700)", marginBottom:6 }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@bu.edu"
                    required
                    style={{
                      width:"100%", padding:"10px 14px",
                      border:"1.5px solid var(--gray-200)", borderRadius:10,
                      fontSize:14, fontFamily:"inherit", color:"var(--gray-800)",
                      outline:"none", background:"white",
                    }}
                  />
                </div>

                {error && (
                  <div style={{ fontSize:13, color:"var(--danger)", background:"rgba(239,68,68,0.07)", padding:"8px 12px", borderRadius:8, marginBottom:14 }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !supabaseConfigured}
                  style={{
                    width:"100%", padding:"10px 16px",
                    background: loading ? "var(--gray-300)" : "var(--blue)",
                    color:"white", border:"none", borderRadius:10,
                    fontSize:14, fontWeight:600, cursor: loading ? "not-allowed" : "pointer",
                    fontFamily:"inherit",
                  }}
                >
                  {loading ? "Sending..." : "Send magic link →"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"16px 0" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📬</div>
              <h2 style={{ fontSize:17, fontWeight:700, color:"var(--gray-900)", marginBottom:8 }}>Check your inbox</h2>
              <p style={{ fontSize:13, color:"var(--gray-500)", lineHeight:1.65 }}>
                We sent a login link to <strong>{email}</strong>.<br />
                Click it to sign in. You can close this tab.
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign:"center", fontSize:12, color:"var(--gray-400)", marginTop:20 }}>
          Only KTP members with a verified BU email can access this app.
        </p>
      </div>
    </div>
  );
}

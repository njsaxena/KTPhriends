"use client";

import { Button, Tag, AvailDot, ScoreBar } from "@/components/ui";
import type { BrotherWithScore } from "@/types";

interface BrotherModalProps {
  brother: BrotherWithScore | null;
  onClose: () => void;
  onRequest: (brother: BrotherWithScore) => void;
}

const DIM_LABELS: Record<string, string> = {
  budget: "Budget", proximity: "Proximity", time: "Time overlap",
  food: "Food & drink", sports: "Sports", hobbies: "Hobbies",
};

export function BrotherModal({ brother, onClose, onRequest }: BrotherModalProps) {
  if (!brother) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, zIndex:100,
        background:"rgba(15,19,32,0.45)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20,
      }}
    >
      <div style={{
        background:"white", borderRadius:20,
        width:"100%", maxWidth:520,
        maxHeight:"88vh", overflowY:"auto",
        boxShadow:"var(--shadow-lg)",
      }}>

        {/* Header */}
        <div style={{ padding:"24px 24px 0", position:"relative" }}>
          <button
            onClick={onClose}
            style={{
              position:"absolute", top:16, right:16,
              width:30, height:30, borderRadius:"50%",
              background:"var(--gray-100)", border:"none",
              cursor:"pointer", fontSize:14, color:"var(--gray-500)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >
            ✕
          </button>

          <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:20 }}>
            {/* Avatar */}
            <div style={{
              width:56, height:56, borderRadius:"50%", flexShrink:0,
              background: brother.avatar_color === "green" ? "var(--green-bg2)" : "var(--blue-bg2)",
              border: `2px solid ${brother.avatar_color === "green" ? "var(--green-mid)" : "var(--blue-light)"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, fontWeight:700,
              color: brother.avatar_color === "green" ? "var(--green)" : "var(--blue)",
            }}>
              {brother.initials}
            </div>

            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:18, fontWeight:700, color:"var(--gray-900)", letterSpacing:-0.3 }}>
                {brother.full_name}
              </div>
              <div style={{ fontSize:13, color:"var(--gray-500)", marginTop:2 }}>
                {brother.major} · Class of {brother.grad_year} · {brother.ktp_role}
              </div>
              <div style={{ marginTop:6 }}>
                <AvailDot available={brother.available_this_week} />
              </div>
            </div>

            {/* Score badge */}
            <div style={{
              fontFamily:"'DM Mono', monospace",
              fontSize:22, fontWeight:600,
              color: brother.score >= 80 ? "var(--blue)" : brother.score >= 60 ? "var(--blue-light)" : "var(--gray-400)",
              background: brother.score >= 80 ? "var(--blue-bg2)" : "var(--gray-100)",
              padding:"8px 12px", borderRadius:10, flexShrink:0,
            }}>
              {brother.score}%
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"0 24px 4px" }}>

          {/* About */}
          {brother.bio && (
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--gray-400)", marginBottom:8 }}>
                About
              </div>
              <p style={{ fontSize:13, color:"var(--gray-600)", lineHeight:1.65 }}>{brother.bio}</p>
            </div>
          )}

          {/* Score breakdown */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--gray-400)", marginBottom:10 }}>
              Match breakdown
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(Object.entries(brother.scoreBreakdown) as [string, number][])
                .filter(([k]) => k !== "total")
                .map(([key, val]) => (
                  <div key={key} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ fontSize:12, color:"var(--gray-500)", minWidth:90 }}>
                      {DIM_LABELS[key] ?? key}
                    </div>
                    <div style={{ flex:1, height:6, background:"var(--gray-100)", borderRadius:999, overflow:"hidden" }}>
                      <div style={{
                        width:`${val}%`, height:"100%", borderRadius:999,
                        background: val >= 70 ? "var(--blue)" : val >= 40 ? "var(--blue-light)" : "var(--gray-300)",
                      }} />
                    </div>
                    <span style={{
                      fontFamily:"'DM Mono', monospace", fontSize:11,
                      color: val >= 70 ? "var(--blue)" : "var(--gray-400)",
                      minWidth:30, textAlign:"right",
                    }}>
                      {val}%
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Preferred spots */}
          {brother.preferred_spots.length > 0 && (
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--gray-400)", marginBottom:8 }}>
                Preferred spots
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {brother.preferred_spots.map(s => (
                  <div key={s} style={{ fontSize:13, color:"var(--gray-700)", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:"var(--gray-300)" }}>▸</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--gray-400)", marginBottom:8 }}>
              Interests
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {[...brother.food_prefs, ...brother.sports, ...brother.hobbies].map(t => (
                <Tag key={t} label={t} />
              ))}
            </div>
          </div>

          {/* Budget */}
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--gray-400)", marginBottom:8 }}>
              Budget
            </div>
            <div style={{ fontSize:13, color:"var(--gray-700)" }}>
              Up to{" "}
              <span style={{ fontFamily:"'DM Mono', monospace", color:"var(--blue)", fontWeight:600 }}>
                ${brother.budget_max}
              </span>{" "}
              per chat
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:"16px 24px", borderTop:"1px solid var(--gray-100)", display:"flex", gap:10 }}>
          <Button variant="primary" style={{ flex:1 }} onClick={() => onRequest(brother)}>
            Request chat
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

      </div>
    </div>
  );
}

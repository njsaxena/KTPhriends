"use client";

import { ScoreBar, Tag, AvailDot } from "@/components/ui";
import type { BrotherWithScore } from "@/types";

interface BrotherCardProps {
  brother: BrotherWithScore;
  isTopMatch?: boolean;
  onClick: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function BrotherCard({ brother, isTopMatch, onClick, isSelected, onToggleSelect }: BrotherCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background:"white",
        border: isTopMatch ? "1.5px solid var(--blue)" : "1px solid var(--gray-200)",
        borderRadius:14,
        padding:18,
        cursor:"pointer",
        transition:"all 0.18s",
        position:"relative",
        overflow:"hidden",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
        if (!isTopMatch) (e.currentTarget as HTMLDivElement).style.borderColor = "var(--blue-light)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        if (!isTopMatch) (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gray-200)";
      }}
    >
      {/* Top match badge */}
      {isTopMatch && (
        <div style={{ position:"absolute", top:10, right:10, fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px", background:"var(--blue)", color:"white", padding:"2px 7px", borderRadius:999 }}>
          Top match
        </div>
      )}

      {/* Selection checkbox (used for multi-request) */}
      {onToggleSelect && (
        <button
          type="button"
          aria-pressed={Boolean(isSelected)}
          onClick={e => {
            e.stopPropagation();
            onToggleSelect();
          }}
          style={{
            position:"absolute", top:10, left:10,
            width:26, height:26, borderRadius:999,
            border:`1.5px solid ${isSelected ? "var(--blue-light)" : "var(--gray-200)"}`,
            background: isSelected ? "var(--blue)" : "white",
            color: isSelected ? "white" : "var(--gray-600)",
            cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:800, lineHeight:1,
          }}
        >
          {isSelected ? "✓" : ""}
        </button>
      )}

      {/* Avatar */}
      <div style={{
        width:42, height:42, borderRadius:"50%", marginBottom:12,
        background: brother.avatar_color === "green" ? "var(--green-bg2)" : "var(--blue-bg2)",
        border: `1.5px solid ${brother.avatar_color === "green" ? "var(--green-mid)" : "var(--blue-light)"}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:13, fontWeight:700,
        color: brother.avatar_color === "green" ? "var(--green)" : "var(--blue)",
      }}>
        {brother.initials}
      </div>

      {/* Name / meta */}
      <div style={{ fontSize:14, fontWeight:700, color:"var(--gray-900)", marginBottom:2 }}>{brother.full_name}</div>
      <div style={{ fontSize:11, color:"var(--gray-400)", marginBottom:10 }}>
        {brother.major} · {brother.grad_year} · {brother.ktp_role}
      </div>

      {/* Score bar */}
      <div style={{ marginBottom:10 }}>
        <ScoreBar score={brother.score} />
      </div>

      {/* Tags */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        <AvailDot available={brother.available_this_week} />
        {brother.food_prefs.slice(0, 1).map(f => <Tag key={f} label={f} />)}
        {brother.hobbies.slice(0, 1).map(h => <Tag key={h} label={h} />)}
      </div>
    </div>
  );
}

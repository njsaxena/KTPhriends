// ─────────────────────────────────────────────────────────
// KTPhriends — Reusable UI Components
// ─────────────────────────────────────────────────────────
"use client";

import React from "react";
import { scoreTier } from "@/lib/matching";

// ── PageHeader ────────────────────────────────────────────
export function PageHeader({
  title, subtitle, children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header style={{
      background:"white", borderBottom:"1px solid var(--gray-200)",
      padding:"0 28px", height:60,
      display:"flex", alignItems:"center", gap:14,
      position:"sticky", top:0, zIndex:10,
    }}>
      <span style={{ fontSize:16, fontWeight:700, color:"var(--gray-900)", letterSpacing:-0.2 }}>{title}</span>
      {subtitle && <span style={{ fontSize:13, color:"var(--gray-400)" }}>{subtitle}</span>}
      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
        {children}
      </div>
    </header>
  );
}

// ── Button ────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "ghost" | "green" | "danger";
type ButtonSize    = "sm" | "md";

export function Button({
  variant = "primary", size = "md",
  children, onClick, disabled, type = "button", style,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    display:"inline-flex", alignItems:"center", gap:6,
    borderRadius:10, fontFamily:"inherit",
    fontWeight:500, cursor: disabled ? "not-allowed" : "pointer",
    border:"none", transition:"all 0.15s", whiteSpace:"nowrap",
    opacity: disabled ? 0.55 : 1,
    padding: size === "sm" ? "5px 12px" : "8px 16px",
    fontSize: size === "sm" ? 12 : 13,
  };
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary:   { background:"var(--blue)",     color:"white" },
    secondary: { background:"var(--blue-bg2)", color:"var(--blue)",    border:"1px solid var(--blue-light)" },
    ghost:     { background:"transparent",     color:"var(--gray-600)",border:"1px solid var(--gray-200)" },
    green:     { background:"var(--green)",    color:"white" },
    danger:    { background:"transparent",     color:"var(--danger)",  border:"1px solid rgba(239,68,68,0.3)" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

// ── Pill ──────────────────────────────────────────────────
export function Pill({ label, color = "blue" }: { label: string; color?: "blue"|"green"|"gray"|"warn" }) {
  const colors = {
    blue:  { background:"var(--blue-bg2)",  color:"var(--blue)"  },
    green: { background:"var(--green-bg2)", color:"var(--green)" },
    gray:  { background:"var(--gray-100)",  color:"var(--gray-500)" },
    warn:  { background:"rgba(245,158,11,0.1)", color:"var(--warn)" },
  };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:500, ...colors[color] }}>
      {label}
    </span>
  );
}

// ── Tag ───────────────────────────────────────────────────
export function Tag({ label, variant = "default" }: { label: string; variant?: "default"|"blue"|"green" }) {
  const styles = {
    default: { background:"var(--gray-100)", color:"var(--gray-500)", borderColor:"var(--gray-200)" },
    blue:    { background:"var(--blue-bg)",  color:"var(--blue)",     borderColor:"rgba(69,142,255,0.25)" },
    green:   { background:"var(--green-bg2)",color:"var(--green)",    borderColor:"rgba(141,221,136,0.4)" },
  };
  return (
    <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:500, border:"1px solid", ...styles[variant] }}>
      {label}
    </span>
  );
}

// ── ScoreBar ──────────────────────────────────────────────
export function ScoreBar({ score }: { score: number }) {
  const tier = scoreTier(score);
  const colors = { high:"var(--blue)", mid:"var(--blue-light)", low:"var(--gray-300)" };
  const textColors = { high:"var(--blue)", mid:"var(--blue-light)", low:"var(--gray-400)" };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:5, background:"var(--gray-100)", borderRadius:999, overflow:"hidden" }}>
        <div style={{ width:`${score}%`, height:"100%", background:colors[tier], borderRadius:999 }} />
      </div>
      <span style={{ fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:500, color:textColors[tier], minWidth:34, textAlign:"right" }}>
        {score}%
      </span>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ label, value, sub, color = "blue" }: { label: string; value: string|number; sub?: string; color?: "blue"|"green"|"warn"|"default" }) {
  const valueColors = { blue:"var(--blue)", green:"var(--green)", warn:"var(--warn)", default:"var(--gray-900)" };
  return (
    <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"18px 20px" }}>
      <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:600, letterSpacing:-1, fontFamily:"'DM Mono', monospace", color: valueColors[color] }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"var(--gray-400)", marginTop:4 }}>{sub}</div>}
    </div>
  );
}

// ── AvailDot ──────────────────────────────────────────────
export function AvailDot({ available }: { available: boolean }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:500, color: available ? "var(--green)" : "var(--gray-400)" }}>
      <span style={{ display:"block", width:7, height:7, borderRadius:"50%", background: available ? "var(--green-mid)" : "var(--gray-300)", boxShadow: available ? "0 0 0 2px var(--green-bg2)" : "none" }} />
      {available ? "Available" : "Busy"}
    </span>
  );
}

// ── Toast ─────────────────────────────────────────────────
export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:200,
      background:"var(--gray-900)", color:"white",
      padding:"12px 20px", borderRadius:14,
      fontSize:13, fontWeight:500,
      boxShadow:"var(--shadow-lg)",
      display:"flex", alignItems:"center", gap:10,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition:"all 0.2s ease",
      pointerEvents:"none",
    }}>
      <span style={{ display:"block", width:8, height:8, borderRadius:"50%", background:"var(--green-mid)", flexShrink:0 }} />
      {message}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOCK_PLEDGE } from "@/lib/mockData";

const NAV = [
  { href:"/dashboard",     icon:"⌂", label:"Dashboard",       badge:null },
  { href:"/browse",        icon:"⊞", label:"Browse brothers",  badge:"24" },
  { href:"/chats",         icon:"☕", label:"My chats",         badge:"2",  badgeGreen:true },
  { href:"/availability",  icon:"◷", label:"My availability",  badge:null },
  { href:"/profile",       icon:"◎", label:"My profile",       badge:null },
  { href:"/admin",         icon:"⚙", label:"Admin view",       badge:null },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = MOCK_PLEDGE; // TODO: replace with useUser() hook from Supabase

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width:240, flexShrink:0,
        background:"white", borderRight:"1px solid var(--gray-200)",
        display:"flex", flexDirection:"column",
        position:"sticky", top:0, height:"100vh", overflowY:"auto",
      }}>
        {/* Logo */}
        <div style={{ padding:"22px 20px 18px", borderBottom:"1px solid var(--gray-100)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, color:"white", flexShrink:0 }}>
            KTP
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"var(--gray-900)", letterSpacing:-0.3 }}>KTPhriends</div>
            <div style={{ fontSize:11, color:"var(--gray-400)" }}>BU · Kappa Theta Pi</div>
          </div>
        </div>

        {/* User */}
        <Link href="/profile" style={{ padding:"12px 20px", borderBottom:"1px solid var(--gray-100)", display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--blue-bg2)", border:"1.5px solid var(--blue-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"var(--blue)", flexShrink:0 }}>
            {user.initials}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--gray-800)" }}>{user.full_name.split(" ")[0]} {user.full_name.split(" ")[1]?.[0]}.</div>
            <div style={{ fontSize:11, color:"var(--gray-400)", textTransform:"capitalize" }}>{user.role} · Spring 2025</div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ padding:"10px 12px", flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"var(--gray-400)", padding:"8px 8px 4px", marginTop:4 }}>Menu</div>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration:"none" }}>
                <div style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"9px 10px", borderRadius:10,
                  fontSize:13, fontWeight:500,
                  color: active ? "var(--blue)" : "var(--gray-600)",
                  background: active ? "var(--blue-bg)" : "transparent",
                  marginBottom:2, transition:"all 0.15s",
                }}>
                  <span style={{ fontSize:15, width:20, textAlign:"center", flexShrink:0 }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize:10, fontWeight:700, background: item.badgeGreen ? "var(--green)" : "var(--blue)", color:"white", padding:"2px 6px", borderRadius:999 }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding:"12px 20px", borderTop:"1px solid var(--gray-100)", fontSize:12, color:"var(--gray-400)" }}>
          <span style={{ color:"var(--blue)", fontWeight:600 }}>{user.full_name.split(" ")[0]}</span> · {user.email}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
        {children}
      </div>
    </div>
  );
}

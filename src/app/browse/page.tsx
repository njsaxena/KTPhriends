"use client";

import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { PageHeader, Toast } from "@/components/ui";
import { BrotherCard } from "@/components/BrotherCard";
import { BrotherModal } from "@/components/BrotherModal";
import { rankBrothers } from "@/lib/matching";
import { MOCK_PLEDGE, MOCK_PLEDGE_AVAIL, MOCK_BROTHERS, MOCK_BROTHER_AVAILS } from "@/lib/mockData";
import type { BrotherWithScore } from "@/types";

const FILTER_OPTIONS = [
  { label:"Available this week", key:"available" },
  { label:"Budget match",        key:"budget" },
  { label:"Near BU",             key:"nearBU" },
  { label:"Coffee",              key:"coffee" },
  { label:"Boba",                key:"boba" },
  { label:"CS / Eng",            key:"cs" },
  { label:"Time overlap",        key:"time" },
];

type SortKey = "score" | "name" | "available";

export default function BrowsePage() {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("score");
  const [selected, setSelected] = useState<BrotherWithScore | null>(null);
  const [toast, setToast] = useState({ visible: false, msg: "" });

  // TODO: replace with Supabase query
  const allRanked = useMemo(
    () => rankBrothers(MOCK_PLEDGE, MOCK_PLEDGE_AVAIL, MOCK_BROTHERS, MOCK_BROTHER_AVAILS),
    []
  );

  const filtered = useMemo(() => {
    let bros = [...allRanked];

    if (activeFilters.has("available")) bros = bros.filter(b => b.available_this_week);
    if (activeFilters.has("budget"))    bros = bros.filter(b => b.budget_max >= MOCK_PLEDGE.budget_max - 5);
    if (activeFilters.has("nearBU"))    bros = bros.filter(b => b.locations.some(l => l.includes("BU campus") || l.includes("Kenmore")));
    if (activeFilters.has("coffee"))    bros = bros.filter(b => b.food_prefs.includes("Coffee"));
    if (activeFilters.has("boba"))      bros = bros.filter(b => b.food_prefs.includes("Boba / Tea"));
    if (activeFilters.has("cs"))        bros = bros.filter(b => b.major.toLowerCase().includes("cs") || b.major.toLowerCase().includes("computer") || b.major.toLowerCase().includes("eng"));
    if (activeFilters.has("time"))      bros = bros.filter(b => b.scoreBreakdown.time >= 20);

    if (sort === "name")      bros.sort((a, b) => a.full_name.localeCompare(b.full_name));
    if (sort === "available") bros.sort((a, b) => Number(b.available_this_week) - Number(a.available_this_week));
    // "score" is already the default from rankBrothers

    return bros;
  }, [allRanked, activeFilters, sort]);

  function toggleFilter(key: string) {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function showToast(msg: string) {
    setToast({ visible: true, msg });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  function handleRequest(bro: BrotherWithScore) {
    setSelected(null);
    showToast(`Chat request sent to ${bro.full_name}!`);
    // TODO: supabase.from("chat_requests").insert({ pledge_id, brother_id: bro.id, status:"requested" })
  }

  const topScore = filtered[0]?.score ?? 0;

  return (
    <AppLayout>
      <PageHeader title="Browse brothers" subtitle={`${filtered.length} of ${allRanked.length} shown`}>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          style={{ fontFamily:"inherit", fontSize:12, fontWeight:500, color:"var(--gray-600)", border:"1px solid var(--gray-200)", borderRadius:10, padding:"5px 10px", background:"white", cursor:"pointer" }}
        >
          <option value="score">Sort: Match score</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="available">Sort: Available first</option>
        </select>
      </PageHeader>

      <main style={{ padding:28 }} className="page-enter">

        {/* Filter bar */}
        <div style={{
          background:"white", border:"1px solid var(--gray-200)", borderRadius:14,
          padding:"12px 16px", marginBottom:20,
          display:"flex", alignItems:"center", gap:8, flexWrap:"wrap",
        }}>
          <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.6px", color:"var(--gray-400)", flexShrink:0 }}>
            Filter
          </span>
          {FILTER_OPTIONS.map(f => (
            <div
              key={f.key}
              onClick={() => toggleFilter(f.key)}
              style={{
                padding:"5px 12px", borderRadius:999,
                fontSize:12, fontWeight:500,
                cursor:"pointer", transition:"all 0.15s",
                background: activeFilters.has(f.key) ? "var(--blue-bg2)" : "var(--gray-100)",
                color:       activeFilters.has(f.key) ? "var(--blue)"    : "var(--gray-500)",
                border:      activeFilters.has(f.key) ? "1px solid var(--blue-light)" : "1px solid var(--gray-200)",
              }}
            >
              {f.label}
            </div>
          ))}
          {activeFilters.size > 0 && (
            <button
              onClick={() => setActiveFilters(new Set())}
              style={{ marginLeft:"auto", fontSize:12, color:"var(--gray-400)", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"var(--gray-400)" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>☕</div>
            <div style={{ fontSize:15, fontWeight:600, color:"var(--gray-600)", marginBottom:6 }}>No brothers match these filters</div>
            <div style={{ fontSize:13 }}>Try removing some filters to see more results.</div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(210px, 1fr))", gap:14 }}>
            {filtered.map((bro, i) => (
              <BrotherCard
                key={bro.id}
                brother={bro}
                isTopMatch={i === 0 && bro.score === topScore && bro.score >= 75}
                onClick={() => setSelected(bro)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selected && (
        <BrotherModal
          brother={selected}
          onClose={() => setSelected(null)}
          onRequest={handleRequest}
        />
      )}

      <Toast message={toast.msg} visible={toast.visible} />
    </AppLayout>
  );
}

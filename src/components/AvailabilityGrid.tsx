"use client";

import { useState, useCallback } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_LABELS = [
  "8am","9am","10am","11am","12pm",
  "1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm",
];
const NUM_DAYS  = 7;
const NUM_SLOTS = 14;

interface AvailabilityGridProps {
  /** Initial selected blocks as "day,slot" strings */
  initialBlocks?: string[];
  onChange?: (blocks: string[]) => void;
}

export function AvailabilityGrid({ initialBlocks = [], onChange }: AvailabilityGridProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialBlocks));
  const [dragging, setDragging] = useState<boolean | null>(null); // true = selecting, false = deselecting

  const toggle = useCallback((key: string, forceState?: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      const shouldSelect = forceState !== undefined ? forceState : !prev.has(key);
      if (shouldSelect) next.add(key); else next.delete(key);
      onChange?.(Array.from(next));
      return next;
    });
  }, [onChange]);

  const handleMouseDown = (key: string) => {
    const nextState = !selected.has(key);
    setDragging(nextState);
    toggle(key, nextState);
  };

  const handleMouseEnter = (key: string) => {
    if (dragging !== null) toggle(key, dragging);
  };

  const handleMouseUp = () => setDragging(null);

  const clear = () => {
    setSelected(new Set());
    onChange?.([]);
  };

  return (
    <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ userSelect:"none" }}>
      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--gray-500)" }}>
          <div style={{ width:12, height:12, background:"var(--gray-100)", borderRadius:2, border:"1px solid var(--gray-200)" }} />
          Not available
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--blue)" }}>
          <div style={{ width:12, height:12, background:"var(--blue)", borderRadius:2 }} />
          Available
        </div>
        <button
          onClick={clear}
          style={{ marginLeft:"auto", fontSize:12, color:"var(--gray-400)", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}
        >
          Clear all
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:`52px repeat(${NUM_DAYS}, 1fr)`,
        gap:3,
      }}>
        {/* Day headers */}
        <div />
        {DAYS.map(d => (
          <div key={d} style={{ fontSize:11, fontWeight:600, color:"var(--gray-500)", textAlign:"center", paddingBottom:4 }}>
            {d}
          </div>
        ))}

        {/* Time rows */}
        {Array.from({ length: NUM_SLOTS }, (_, slot) => (
          <>
            <div
              key={`label-${slot}`}
              style={{ fontSize:10, color:"var(--gray-400)", textAlign:"right", paddingRight:8, display:"flex", alignItems:"center", justifyContent:"flex-end", height:26 }}
            >
              {TIME_LABELS[slot]}
            </div>
            {Array.from({ length: NUM_DAYS }, (_, day) => {
              const key = `${day},${slot}`;
              const isSelected = selected.has(key);
              return (
                <div
                  key={key}
                  onMouseDown={() => handleMouseDown(key)}
                  onMouseEnter={() => handleMouseEnter(key)}
                  style={{
                    height:26, borderRadius:3, cursor:"pointer",
                    background: isSelected ? "var(--blue)" : "var(--gray-100)",
                    border: isSelected ? "1px solid var(--blue)" : "1px solid transparent",
                    transition:"background 0.1s",
                  }}
                  onMouseOver={e => {
                    if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "var(--blue-bg2)";
                  }}
                  onMouseOut={e => {
                    if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "var(--gray-100)";
                  }}
                />
              );
            })}
          </>
        ))}
      </div>

      <div style={{ marginTop:12, fontSize:12, color:"var(--gray-400)" }}>
        <span style={{ color:"var(--blue)", fontWeight:600 }}>{selected.size}</span> time blocks selected
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PageHeader, Button, Toast } from "@/components/ui";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { MOCK_PLEDGE_AVAIL } from "@/lib/mockData";

export default function AvailabilityPage() {
  const [blocks, setBlocks] = useState<string[]>(MOCK_PLEDGE_AVAIL.time_blocks);
  const [toast, setToast]   = useState({ visible: false, msg: "" });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    // TODO: replace with Supabase upsert:
    // const supabase = createClient();
    // await supabase.from("availability").upsert({ user_id: userId, time_blocks: blocks, updated_at: new Date().toISOString() });
    await new Promise(r => setTimeout(r, 600)); // simulate network
    setSaving(false);
    setToast({ visible: true, msg: "Availability saved!" });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  return (
    <AppLayout>
      <PageHeader title="My availability" subtitle="Click blocks to mark when you're free">
        <Button variant="ghost" size="sm" onClick={() => setBlocks([])}>Clear all</Button>
        <Button variant="primary" size="sm" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </PageHeader>

      <main style={{ padding:28 }} className="page-enter">
        <div style={{ maxWidth:800 }}>
          <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"20px 24px", marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", marginBottom:4 }}>
              How this works
            </div>
            <p style={{ fontSize:13, color:"var(--gray-500)", lineHeight:1.65 }}>
              Click and drag to mark your free blocks. Brothers with the most overlapping time slots will rank higher in your match scores. Time blocks repeat weekly — you can override specific weeks later.
            </p>
          </div>

          <div style={{ background:"white", border:"1px solid var(--gray-200)", borderRadius:14, padding:"20px 24px" }}>
            <AvailabilityGrid
              initialBlocks={blocks}
              onChange={setBlocks}
            />
          </div>
        </div>
      </main>

      <Toast message={toast.msg} visible={toast.visible} />
    </AppLayout>
  );
}

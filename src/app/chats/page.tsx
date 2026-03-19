"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PageHeader, Pill, Button, Toast } from "@/components/ui";
import { MOCK_CHATS } from "@/lib/mockData";
import type { ChatRequest, ChatStatus } from "@/types";

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatRequest[]>(MOCK_CHATS);
  const [toast, setToast] = useState({ visible: false, msg: "" });

  function showToast(msg: string) {
    setToast({ visible: true, msg });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  function markComplete(chatId: string) {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, pledge_marked_complete: true, status: "completed" as ChatStatus } : c));
    showToast("Chat marked as complete!");
    // TODO: supabase.from("chat_requests").update({ pledge_marked_complete: true }).eq("id", chatId)
  }

  const pending   = chats.filter(c => c.status === "requested");
  const confirmed = chats.filter(c => c.status === "confirmed");
  const completed = chats.filter(c => c.status === "completed");

  return (
    <AppLayout>
      <PageHeader title="My chats" subtitle={`${completed.length} completed · ${confirmed.length} upcoming · ${pending.length} pending`} />

      <main style={{ padding:28 }} className="page-enter">

        <ChatSection title="Pending confirmation" chats={pending} onMarkComplete={markComplete}
          emptyMsg="No pending requests" showConfirm />
        <ChatSection title="Upcoming" chats={confirmed} onMarkComplete={markComplete}
          emptyMsg="No upcoming chats — browse brothers to request one!" />
        <ChatSection title="Completed" chats={completed} onMarkComplete={markComplete}
          emptyMsg="No completed chats yet" dimmed />

      </main>

      <Toast message={toast.msg} visible={toast.visible} />
    </AppLayout>
  );
}

function ChatSection({ title, chats, onMarkComplete, emptyMsg, showConfirm, dimmed }: {
  title: string;
  chats: ChatRequest[];
  onMarkComplete: (id: string) => void;
  emptyMsg: string;
  showConfirm?: boolean;
  dimmed?: boolean;
}) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.7px", color:"var(--gray-400)", marginBottom:10 }}>
        {title}
      </div>

      {chats.length === 0 ? (
        <div style={{ fontSize:13, color:"var(--gray-400)", padding:"12px 0", fontStyle:"italic" }}>{emptyMsg}</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {chats.map(chat => (
            <div
              key={chat.id}
              style={{
                background:"white", border:"1px solid var(--gray-200)", borderRadius:14,
                padding:"16px 20px", display:"flex", alignItems:"center", gap:14,
                opacity: dimmed ? 0.75 : 1,
                transition:"all 0.15s",
              }}
            >
              {/* Avatar */}
              <div style={{
                width:40, height:40, borderRadius:"50%", flexShrink:0,
                background: chat.brother?.avatar_color === "green" ? "var(--green-bg2)" :
                            dimmed ? "var(--gray-100)" : "var(--blue-bg2)",
                border: `1.5px solid ${dimmed ? "var(--gray-200)" : chat.brother?.avatar_color === "green" ? "var(--green-mid)" : "var(--blue-light)"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, fontWeight:700,
                color: dimmed ? "var(--gray-500)" : chat.brother?.avatar_color === "green" ? "var(--green)" : "var(--blue)",
              }}>
                {chat.brother?.initials}
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:"var(--gray-900)" }}>
                  {chat.brother?.full_name}
                </div>
                <div style={{ fontSize:12, color:"var(--gray-400)", marginTop:2 }}>
                  {chat.location ?? "Location TBD"}
                  {chat.confirmed_time && (
                    <> · {new Date(chat.confirmed_time).toLocaleDateString("en-US", { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" })}</>
                  )}
                </div>
              </div>

              {/* Status / actions */}
              <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                {chat.status === "requested" && showConfirm && (
                  <>
                    <Button variant="green" size="sm" onClick={() => onMarkComplete(chat.id)}>Confirm</Button>
                    <Button variant="ghost"  size="sm">Reschedule</Button>
                  </>
                )}
                {chat.status === "confirmed" && !chat.pledge_marked_complete && (
                  <>
                    <Pill label="Confirmed" color="blue" />
                    <Button variant="ghost" size="sm" onClick={() => onMarkComplete(chat.id)}>Mark complete</Button>
                  </>
                )}
                {chat.status === "completed" && (
                  <Pill label="Completed ✓" color="green" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

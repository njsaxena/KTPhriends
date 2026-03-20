"use client";

export function ExportButton() {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 10,
        fontFamily: "inherit",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        border: "1px solid var(--gray-200)",
        background: "white",
        color: "var(--gray-600)",
      }}
      onClick={() => {
        const rows = [["Pledge", "Major", "Chats", "Last chat"], ...[{ name: "Jamie S.", major: "CS", chats: 2, last: "Mar 15" }].map(p => [p.name, p.major, p.chats, p.last])];
        const csv = rows.map(r => r.join(",")).join("\n");
        const a = document.createElement("a");
        a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        a.download = "ktphriends-spring2025.csv";
        a.click();
      }}
    >
      Export CSV ↓
    </button>
  );
}


import { ImageResponse } from "next/og";

export const alt = "Jericho Paul Salvador — Web Developer, Frontend and Full-stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#090e1c", color: "#f2f4ff", border: "2px solid #324563" }}>
      <div style={{ display: "flex", color: "#a9c5ff", fontSize: 26, marginBottom: 30 }}>JPS / SELECTED WORK</div>
      <div style={{ display: "flex", fontSize: 82, fontWeight: 700, letterSpacing: -4 }}>Jericho Paul Salvador.</div>
      <div style={{ display: "flex", fontSize: 36, color: "#b8ccff", marginTop: 28 }}>Web Developer — Frontend &amp; Full-stack</div>
      <div style={{ display: "flex", fontSize: 24, color: "#c4cce2", marginTop: 42 }}>Web &amp; mobile projects · Pasig City, Philippines</div>
    </div>, size,
  );
}

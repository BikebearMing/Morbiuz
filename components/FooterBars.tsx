"use client";

export default function FooterBars() {
  return (
    <div className="footer-bars">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="footer-bar"
          style={{
            animationDelay: `${(i * 0.07) % 0.5}s`,
            animationDuration: `${0.5 + (i % 5) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

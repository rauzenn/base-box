"use client";

export function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Radial burst */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(0, 82, 255, 0.15) 0%, transparent 60%)",
          opacity: 0.25,
        }}
      />
      
      {/* Halftone dots pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0, 82, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          opacity: 0.2,
        }}
      />
    </div>
  );
}
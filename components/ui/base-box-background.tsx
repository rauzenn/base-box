"use client";

export function BaseBoxBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#000814]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-[#001e3c] via-[#000814] to-[#000000] opacity-80" />
      
      {/* Animated squares grid (CSS only) */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="animate-slide-slow"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 58px,
                rgba(0, 82, 255, 0.15) 58px,
                rgba(0, 82, 255, 0.15) 60px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 58px,
                rgba(0, 82, 255, 0.15) 58px,
                rgba(0, 82, 255, 0.15) 60px
              )
            `,
            backgroundSize: "60px 60px",
            width: "200%",
            height: "100%",
          }}
        />
      </div>

      {/* Glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0052FF] rounded-full blur-[120px] opacity-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0052FF] rounded-full blur-[120px] opacity-10 animate-pulse delay-1000" />
    </div>
  );
}
import { useEffect, useRef } from "react";

export interface CrossStyleFlashProps {
  styleId: string;
  styleName: string;
  onDone: () => void;
}

/**
 * Slides down from the top of the stage area when cross-style navigation happens.
 * Animation: fade in 200ms, hold 800ms, fade out 200ms. Total 1200ms.
 * Calls onDone after animation completes.
 */
export default function CrossStyleFlash({
  styleId,
  styleName,
  onDone,
}: CrossStyleFlashProps) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDoneRef.current();
    }, 1200);

    return () => clearTimeout(timer);
  }, [styleId, styleName]);

  return (
    <div
      data-testid="cross-style-flash"
      data-style-id={styleId}
      className="cross-style-flash"
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        padding: "8px 20px",
        background: "rgba(0, 0, 0, 0.75)",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 500,
        borderRadius: "0 0 6px 6px",
        whiteSpace: "nowrap",
        animation: "crossStyleFlash 1.2s ease-in-out forwards",
        pointerEvents: "none",
      }}
    >
      {`Style ${styleId} — ${styleName}`}
      <style>{`
        @keyframes crossStyleFlash {
          0% { opacity: 0; transform: translateX(-50%) translateY(-100%); }
          16.67% { opacity: 1; transform: translateX(-50%) translateY(0); }
          83.33% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-100%); }
        }
      `}</style>
    </div>
  );
}

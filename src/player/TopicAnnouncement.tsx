import { useEffect } from "react";
import { modelColor } from "../utils/model-color";

export interface TopicAnnouncementProps {
  styleNumber: number;
  styleName: string;
  topicName: string;
  modelId: string;
  reducedMotion: boolean;
  onDone: () => void;
}

export default function TopicAnnouncement({
  styleNumber,
  styleName,
  topicName,
  modelId,
  reducedMotion,
  onDone,
}: TopicAnnouncementProps) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 1200);
    return () => window.clearTimeout(id);
  }, [onDone]);
  return (
    <div
      role="status"
      className={`pointer-events-none absolute left-1/2 top-3 z-30 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/65 px-3 py-2 text-white shadow-xl backdrop-blur-md ${reducedMotion ? "" : "animate-[topicNotice_1.2s_ease_both]"}`}
    >
      <span className="font-mono text-[9px] text-white/55">{String(styleNumber).padStart(2, "0")}</span>
      <span className="max-w-32 truncate text-[10px] text-white/70">{styleName}</span>
      <span className="text-white/30">›</span>
      <span className="max-w-44 truncate text-[11px] font-medium">{topicName}</span>
      <span className="hidden items-center gap-1 font-mono text-[8px] text-white/55 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: modelColor(modelId) }} />
        {modelId}
      </span>
    </div>
  );
}

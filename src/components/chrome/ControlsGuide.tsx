import { useRef } from "react";
import { useModalFocus } from "../../hooks/useModalFocus";

export interface ControlsGuideProps {
  open: boolean;
  view: "overview" | "lab";
  language: "en" | "zh";
  onClose: () => void;
}

export default function ControlsGuide({ open, view, language, onClose }: ControlsGuideProps) {
  const dialogRef = useRef<HTMLElement>(null);
  useModalFocus(open, dialogRef, onClose);

  if (!open) return null;
  const zh = language === "zh";
  return (
    <div className="fixed inset-0 z-[110] grid place-items-center p-4">
      <button type="button" className="absolute inset-0 cursor-default bg-black/35 backdrop-blur-[2px]" onClick={onClose} aria-label={zh ? "关闭操作说明" : "Close controls"} />
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={zh ? "操作说明" : "Controls"} className="relative w-full max-w-lg rounded-2xl border border-ink/10 bg-elevated p-5 text-ink shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-ink/35">FH Slides</div>
            <h2 className="text-lg font-semibold">{zh ? "操作说明" : "Controls"}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/[0.06]" aria-label={zh ? "关闭" : "Close"}>×</button>
        </div>
        <div className="grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/40">Keyboard</h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-4"><dt>{zh ? "快速跳转" : "Search"}</dt><dd><kbd>⌘/Ctrl K</kbd></dd></div>
              <div className="flex justify-between gap-4"><dt>{zh ? "关闭顶层面板" : "Close top layer"}</dt><dd><kbd>Esc</kbd></dd></div>
              <div className="flex justify-between gap-4"><dt>{zh ? "操作说明" : "Controls"}</dt><dd><kbd>?</kbd></dd></div>
              {view === "lab" && <>
                <div className="flex justify-between gap-4"><dt>{zh ? "前后移动" : "Previous / next"}</dt><dd><kbd>← →</kbd></dd></div>
                <div className="flex justify-between gap-4"><dt>{zh ? "下一步" : "Next"}</dt><dd><kbd>Space</kbd></dd></div>
              </>}
            </dl>
          </div>
          {view === "lab" && <div>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/40">Pointer & Touch</h3>
            <ul className="space-y-2 text-xs text-ink/70">
              <li>{zh ? "点击左侧 20%：上一步" : "Click left 20%: previous"}</li>
              <li>{zh ? "点击其余区域：下一步" : "Click remaining area: next"}</li>
              <li>{zh ? "左滑 / 上滑：下一步" : "Swipe left / up: next"}</li>
              <li>{zh ? "右滑 / 下滑：上一步" : "Swipe right / down: previous"}</li>
              <li className="text-ink/40">{zh ? "触控板和滚轮不会翻页" : "Trackpad and wheel do not navigate"}</li>
            </ul>
          </div>}
        </div>
      </section>
    </div>
  );
}

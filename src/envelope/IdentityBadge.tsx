import { useRef, useState } from "react";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../catalog/runtime-registry";
import { modelColor } from "../utils/model-color";
import { useModalFocus } from "./useModalFocus";

export interface IdentityBadgeProps {
  group: RuntimeStyleGroup | null;
  topicId: string;
  topicOptions: readonly RuntimeTopic[];
  language: "en" | "zh";
  onSelectTopic: (topicId: string) => void;
}

export default function IdentityBadge({
  group,
  topicId,
  topicOptions,
  language,
  onSelectTopic,
}: IdentityBadgeProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const topic = group?.topics.find((item) => item.id === topicId) ?? null;
  const labels = language === "zh"
    ? {
        open: "打开 Topic Switcher",
        dialog: "题材切换器",
        close: "关闭题材切换器",
        dismiss: "收起题材切换器",
        empty: "当前筛选在此风格下没有 Topic",
      }
    : {
        open: "Open Topic Switcher",
        dialog: "Topic Switcher",
        close: "Close Topic Switcher",
        dismiss: "Dismiss Topic Switcher",
        empty: "No Topics in this Style match the current filters",
      };

  useModalFocus(open, dialogRef, () => setOpen(false));

  if (!group || !topic) return null;

  const identity = `${group.style.name[language]} · ${topic.title[language]} · ${topic.modelId}`;

  return (
    <div
      data-testid="identity-badge"
      className="relative h-11 max-w-[calc(100vw-1.5rem)]"
    >
      <button
        type="button"
        aria-label={`${identity} · ${labels.open}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="group flex h-11 max-w-full items-center text-left focus:outline-none"
      >
        <span
          data-testid="identity-badge-pill"
          className="flex h-7 max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 text-white backdrop-blur-sm group-hover:bg-black/60 group-focus-visible:border-white/35 group-focus-visible:bg-black/60"
        >
          <span className="max-w-28 truncate text-[9px] font-medium text-white/55 sm:max-w-40">
            {group.style.name[language]}
          </span>
          <span aria-hidden="true" className="text-[9px] text-white/25">›</span>
          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-white/85">
            {topic.title[language]}
          </span>
          <span aria-hidden="true" className="text-[9px] text-white/25">·</span>
          <span className="flex shrink-0 items-center gap-1 font-mono text-[8px] text-white/55">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: modelColor(topic.modelId) }}
            />
            {topic.modelId}
          </span>
          <span aria-hidden="true" className="ml-0.5 text-[8px] text-white/35">⌄</span>
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label={labels.dismiss}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[95] cursor-default bg-black/25 md:bg-transparent"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={labels.dialog}
            tabIndex={-1}
            className="fixed inset-x-3 bottom-3 z-[100] max-h-[76vh] overflow-y-auto rounded-2xl border border-ink/12 bg-elevated p-3 text-ink shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:top-full md:w-[min(420px,calc(100vw-4rem))] md:rounded-xl"
          >
            <div className="mb-2 flex items-center justify-between gap-3 px-1.5">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                  {group.style.name[language]}
                </p>
                <p className="mt-0.5 text-xs font-semibold">{labels.dialog}</p>
              </div>
              <button
                type="button"
                aria-label={labels.close}
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base text-ink/40 hover:bg-ink/[0.06] hover:text-ink"
              >
                ×
              </button>
            </div>
            <div className="space-y-1">
              {topicOptions.map((option) => {
                const active = option.id === topicId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-current={active ? "page" : undefined}
                    aria-label={`${option.title[language]} · ${option.modelId}`}
                    onClick={() => {
                      if (!active) onSelectTopic(option.id);
                      setOpen(false);
                    }}
                    className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 text-left ${
                      active ? "bg-ink/[0.08]" : "hover:bg-ink/[0.05]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: modelColor(option.modelId) }}
                    />
                    <span className="min-w-0 flex-1 truncate text-xs">
                      {option.title[language]}
                    </span>
                    <span className="shrink-0 font-mono text-[9px] text-ink/40">
                      {option.modelId}
                    </span>
                  </button>
                );
              })}
              {topicOptions.length === 0 && (
                <p className="px-2.5 py-3 text-xs text-ink/45">{labels.empty}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

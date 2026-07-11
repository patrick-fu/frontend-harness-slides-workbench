import type { TopicMetadata } from "../../domain/topic";

export interface BottomBarProps {
  scenes: TopicMetadata["scenes"];
  currentScene: number;
  currentBeat: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpScene: (scene: number) => void;
  onJumpBeat: (beat: number) => void;
}

export default function BottomBar({
  scenes,
  currentScene,
  currentBeat,
  onPrev,
  onNext,
  onJumpScene,
  onJumpBeat,
}: BottomBarProps) {
  const activeScene = scenes.find((scene) => scene.id === currentScene);
  const beats = activeScene?.beats ?? [];
  const navButton =
    "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-ink/55 hover:bg-ink/[0.07] hover:text-ink";

  return (
    <div
      data-testid="bottom-bar"
      role="toolbar"
      aria-label="Slide navigation"
      className="flex h-14 shrink-0 items-center gap-2 border-t border-ink/10 bg-chrome px-2 text-chrome-ink sm:gap-3 sm:px-3"
    >
      <button
        type="button"
        data-testid="prev-button"
        onClick={onPrev}
        className={navButton}
        aria-label="Previous"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
        </svg>
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-4">
        <div role="group" aria-label="Scene navigation" className="flex min-w-0 items-center gap-1">
          {scenes.map((scene) => {
            const active = scene.id === currentScene;
            return (
              <button
                key={scene.id}
                type="button"
                data-testid={`scene-dot-${scene.id}`}
                aria-label={`Scene ${scene.id}`}
                aria-current={active ? "step" : undefined}
                title={scene.title}
                onClick={() => {
                  if (!active) onJumpScene(scene.id);
                }}
                className={`flex h-9 items-center justify-center rounded-lg transition-[width,background-color] ${
                  active
                    ? "w-9 bg-ink text-paper sm:w-[min(16vw,180px)] sm:justify-start sm:px-3"
                    : "w-8 text-ink/45 hover:bg-ink/[0.06] hover:text-ink"
                }`}
              >
                <span className="shrink-0 font-mono text-[10px] tabular-nums">
                  {String(scene.id).padStart(2, "0")}
                </span>
                {active && (
                  <span className="ml-2 hidden min-w-0 truncate text-left text-[11px] font-medium sm:block">
                    {scene.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden min-w-[92px] max-w-[190px] flex-1 items-center gap-2 sm:flex">
          <div className="flex h-7 min-w-0 flex-1 items-center gap-1" aria-label="Beat progress">
            {beats.map((beat, index) => {
              const active = beat.id === currentBeat;
              const complete = beat.id < currentBeat;
              return (
                <button
                  key={beat.id}
                  type="button"
                  aria-label={`Beat ${index + 1} of ${beats.length}`}
                  title={beat.title || `Beat ${index + 1}`}
                  onClick={() => onJumpBeat(beat.id)}
                  className="group flex h-7 min-w-3 flex-1 items-center"
                >
                  <span
                    className={`h-1 w-full rounded-full transition-colors ${
                      active ? "bg-ink" : complete ? "bg-ink/45" : "bg-ink/15 group-hover:bg-ink/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span data-testid="beat-counter" className="shrink-0 font-mono text-[9px] tabular-nums text-ink/40">
            {Math.max(0, currentBeat) + 1}/{Math.max(1, beats.length)}
          </span>
        </div>
      </div>

      <button
        type="button"
        data-testid="next-button"
        onClick={onNext}
        className={navButton}
        aria-label="Next"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
        </svg>
      </button>
    </div>
  );
}

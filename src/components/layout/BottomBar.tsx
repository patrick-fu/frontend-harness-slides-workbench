import type { SceneMetadata } from "../../types";

export interface BottomBarProps {
  scenes: SceneMetadata[];
  currentScene: number;
  currentBeat: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpScene: (scene: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function BottomBar({
  scenes,
  currentScene,
  currentBeat,
  onPrev,
  onNext,
  onJumpScene,
  isFirst,
  isLast,
}: BottomBarProps) {
  // Find current scene to get total beats
  const currentSceneDef = scenes.find((s) => s.id === currentScene);
  const totalBeats = currentSceneDef?.beats.length ?? 1;

  // Beat progress: (currentBeat + 1) / totalBeats
  const beatProgress = ((currentBeat + 1) / totalBeats) * 100;

  return (
    <div
      data-testid="bottom-bar"
      className="fixed bottom-0 left-0 right-0 w-full z-50 h-9 bg-chrome text-chrome-ink border-t border-white/10 flex items-center px-3"
      role="toolbar"
      aria-label="Slide navigation"
    >
      {/* Prev button */}
      <button
        type="button"
        data-testid="prev-button"
        onClick={onPrev}
        disabled={isFirst}
        className="p-1 rounded-md hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        aria-label="Previous"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="12,4 6,10 12,16" />
        </svg>
      </button>

      {/* Center: scene dots + beat progress */}
      <div className="flex-1 flex items-center justify-center gap-4">
        {/* Scene dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Scene navigation">
          {scenes.map((scene) => {
            const isActive = scene.id === currentScene;
            return (
              <button
                key={scene.id}
                type="button"
                data-testid={`scene-dot-${scene.id}`}
                role="tab"
                aria-current={isActive ? "true" : undefined}
                aria-label={`Scene ${scene.id}`}
                onClick={() => onJumpScene(scene.id)}
                className={[
                  "w-2 h-2 rounded-full transition-all duration-200",
                  isActive
                    ? "bg-chrome-ink scale-125"
                    : "bg-white/25 hover:bg-white/50",
                ].join(" ")}
              />
            );
          })}
        </div>

        {/* Beat progress + counter */}
        <div className="flex items-center gap-2 min-w-[80px]">
          <div
            data-testid="beat-progress-bar"
            className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden min-w-[40px]"
            role="progressbar"
            aria-valuenow={currentBeat + 1}
            aria-valuemin={1}
            aria-valuemax={totalBeats}
            aria-label="Beat progress"
          >
            <div
              data-testid="beat-progress-fill"
              className="h-full bg-white/60 rounded-full transition-all duration-200"
              style={{ width: `${beatProgress}%` }}
            />
          </div>
          <span
            data-testid="beat-counter"
            className="text-[10px] font-mono text-chrome-ink/50 tabular-nums whitespace-nowrap"
          >
            {currentBeat + 1}/{totalBeats}
          </span>
        </div>
      </div>

      {/* Next button */}
      <button
        type="button"
        data-testid="next-button"
        onClick={onNext}
        disabled={isLast}
        className="p-1 rounded-md hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        aria-label="Next"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="8,4 14,10 8,16" />
        </svg>
      </button>
    </div>
  );
}

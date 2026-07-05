import { useMemo, useState } from "react";
import type {
  SceneMetadata,
  StyleRegistryEntry,
  StyleVersion,
} from "../../types";
import { computeNext, computePrev } from "../../utils/navigation";

export interface BottomBarProps {
  scenes: SceneMetadata[];
  currentScene: number;
  currentBeat: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpScene: (scene: number) => void;
  isFirst: boolean;
  isLast: boolean;
  /** Version-aware navigation context (optional) */
  registry?: StyleRegistryEntry[];
  styleId?: string;
  versionId?: string;
  onSelectVersion?: (styleId: string, versionId: string) => void;
  language?: "en" | "zh";
}

// ─── Helpers for version card computation ─────────────────────────────────

interface VersionCardData {
  styleId: string;
  versionId: string;
  topic: string;
  model: string;
  panelColor: string;
  inkColor: string;
  styleName: string;
}

function getVersionFromRegistry(
  registry: StyleRegistryEntry[],
  styleId: string,
  versionId: string,
): { style: StyleRegistryEntry; version: StyleVersion } | null {
  const style = registry.find((s) => s.id === styleId);
  if (!style) return null;
  const version = style.versions.find((v) => v.id === versionId);
  if (!version) return null;
  return { style, version };
}

function getVersionEndBeat(
  registry: StyleRegistryEntry[],
  styleId: string,
  versionId: string,
  language: "en" | "zh",
): { scene: number; beat: number } | null {
  const info = getVersionFromRegistry(registry, styleId, versionId);
  if (!info) return null;
  const meta = info.version.getMetadata(language);
  const lastScene = meta.scenes[meta.scenes.length - 1];
  if (!lastScene || lastScene.beats.length === 0) return null;
  return {
    scene: lastScene.id,
    beat: lastScene.beats[lastScene.beats.length - 1].id,
  };
}

function buildCardData(
  registry: StyleRegistryEntry[],
  styleId: string,
  versionId: string,
  language: "en" | "zh",
): VersionCardData | null {
  const info = getVersionFromRegistry(registry, styleId, versionId);
  if (!info) return null;
  const meta = info.version.getMetadata(language);
  return {
    styleId,
    versionId,
    topic: info.version.topic,
    model: info.version.model,
    panelColor: meta.colors.panel,
    inkColor: meta.colors.ink,
    styleName: info.style.name[language] ?? info.style.name.en,
  };
}

/**
 * Compute up to 2 adjacent version cards on each side.
 * Cards appear when the next/prev navigation crosses a version boundary.
 */
function computeAdjacentCards(
  registry: StyleRegistryEntry[],
  styleId: string,
  versionId: string,
  scene: number,
  beat: number,
  language: "en" | "zh",
): { leftCards: VersionCardData[]; rightCards: VersionCardData[] } {
  const rightCards: VersionCardData[] = [];
  const leftCards: VersionCardData[] = [];

  // ── Right side: what's "next" ──────────────────────────────────────
  const nextTarget = computeNext(registry, styleId, versionId, scene, beat, false);
  if (
    nextTarget &&
    (nextTarget.styleId !== styleId || nextTarget.versionId !== versionId)
  ) {
    const card1 = buildCardData(registry, nextTarget.styleId, nextTarget.versionId, language);
    if (card1) rightCards.push(card1);

    // Peek one more ahead from the end of card1's version
    const endState = getVersionEndBeat(registry, nextTarget.styleId, nextTarget.versionId, language);
    if (endState) {
      const next2 = computeNext(
        registry,
        nextTarget.styleId,
        nextTarget.versionId,
        endState.scene,
        endState.beat,
        false,
      );
      if (
        next2 &&
        (next2.styleId !== nextTarget.styleId || next2.versionId !== nextTarget.versionId)
      ) {
        const card2 = buildCardData(registry, next2.styleId, next2.versionId, language);
        if (card2) rightCards.push(card2);
      }
    }
  }

  // ── Left side: what's "prev" ───────────────────────────────────────
  const prevTarget = computePrev(registry, styleId, versionId, scene, beat, false);
  if (
    prevTarget &&
    (prevTarget.styleId !== styleId || prevTarget.versionId !== versionId)
  ) {
    const card1 = buildCardData(registry, prevTarget.styleId, prevTarget.versionId, language);
    if (card1) leftCards.push(card1);

    // Peek one more behind from the beginning of card1's version
    const prev2 = computePrev(
      registry,
      prevTarget.styleId,
      prevTarget.versionId,
      prevTarget.scene,
      prevTarget.beat,
      false,
    );
    if (
      prev2 &&
      (prev2.styleId !== prevTarget.styleId || prev2.versionId !== prevTarget.versionId)
    ) {
      const card2 = buildCardData(registry, prev2.styleId, prev2.versionId, language);
      if (card2) leftCards.push(card2);
    }
  }

  return { leftCards, rightCards };
}

// ─── VersionCardStack component ───────────────────────────────────────────

interface CardStackProps {
  cards: VersionCardData[];
  side: "left" | "right";
  onSelectVersion: (styleId: string, versionId: string) => void;
}

const CARD_W = 44;
const CARD_H = 30;
const STACK_OFFSET = 4;
const FAN_OFFSET = 22;

function VersionCardStack({ cards, side, onSelectVersion }: CardStackProps) {
  const [hovered, setHovered] = useState(false);

  if (cards.length === 0) return null;

  const isRight = side === "right";
  // For right side: card[0] is front (closest to current), card[1] behind
  // For left side: card[0] is front (closest to current), card[1] behind
  // We reverse the rendering order so front card renders last (on top in DOM)
  const displayCards = isRight ? cards : [...cards].reverse();

  return (
    <div
      data-testid={`version-card-stack-${side}`}
      className="relative flex items-center"
      style={{
        width: CARD_W + (cards.length - 1) * STACK_OFFSET + (hovered ? (cards.length - 1) * (FAN_OFFSET - STACK_OFFSET) : 0),
        height: CARD_H + (cards.length - 1) * 2,
        marginLeft: isRight ? 0 : 0,
        marginRight: isRight ? 0 : 0,
        transition: "width 0.25s ease-out",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${side === "right" ? "Upcoming" : "Previous"} versions`}
      role="group"
    >
      {displayCards.map((card, displayIdx) => {
        // displayIdx 0 = bottom of stack (farthest), displayIdx last = top of stack (closest)
        const stackIdx = isRight ? displayIdx : (cards.length - 1 - displayIdx);
        const isFront = isRight
          ? displayIdx === cards.length - 1
          : displayIdx === 0;

        const baseLeft = isRight
          ? stackIdx * STACK_OFFSET
          : (cards.length - 1 - stackIdx) * STACK_OFFSET;

        const fannedLeft = isRight
          ? stackIdx * FAN_OFFSET
          : (cards.length - 1 - stackIdx) * FAN_OFFSET;

        const left = hovered ? fannedLeft : baseLeft;
        const top = stackIdx * 2;
        const rotation = isRight
          ? `${stackIdx * 1.5}deg`
          : `${-stackIdx * 1.5}deg`;

        return (
          <button
            key={`${card.styleId}-${card.versionId}`}
            type="button"
            data-testid={`version-card-${card.styleId}-${card.versionId}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectVersion(card.styleId, card.versionId);
            }}
            className="absolute rounded-md border border-black/10 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-250 ease-out"
            style={{
              width: CARD_W,
              height: CARD_H,
              left,
              top,
              backgroundColor: card.panelColor,
              color: card.inkColor,
              boxShadow: isFront
                ? "0 2px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)"
                : "0 1px 3px rgba(0,0,0,0.12)",
              transform: `rotate(${rotation})`,
              transformOrigin: isRight ? "bottom left" : "bottom right",
              zIndex: isFront ? cards.length : cards.length - stackIdx,
              opacity: hovered ? 1 : (isFront ? 1 : 0.85),
              transition: "left 0.25s ease-out, top 0.2s ease-out, transform 0.25s ease-out, opacity 0.2s ease-out, box-shadow 0.2s ease-out",
              animation: "cardStackEnter 0.2s ease-out",
            }}
            title={`${card.styleName} — ${card.topic} (${card.model})`}
            aria-label={`Switch to ${card.styleName} ${card.versionId}: ${card.topic}`}
          >
            <span
              className="text-[8px] font-semibold leading-tight truncate max-w-full px-1 text-center"
              style={{ lineHeight: "10px" }}
            >
              {card.topic}
            </span>
            <span
              className="text-[6px] opacity-50 leading-tight truncate max-w-full px-0.5 text-center font-mono"
              style={{ lineHeight: "8px" }}
            >
              {card.model}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main BottomBar component ─────────────────────────────────────────────

export default function BottomBar({
  scenes,
  currentScene,
  currentBeat,
  onPrev,
  onNext,
  onJumpScene,
  isFirst,
  isLast,
  registry,
  styleId,
  versionId,
  onSelectVersion,
  language = "en",
}: BottomBarProps) {
  // Find current scene to get total beats
  const currentSceneDef = scenes.find((s) => s.id === currentScene);
  const totalBeats = currentSceneDef?.beats.length ?? 1;

  // Beat progress: (currentBeat + 1) / totalBeats
  const beatProgress = ((currentBeat + 1) / totalBeats) * 100;

  // Compute adjacent version cards for stacked-card visual
  const { leftCards, rightCards } = useMemo(() => {
    if (!registry || !styleId || !versionId) {
      return { leftCards: [], rightCards: [] };
    }
    return computeAdjacentCards(
      registry,
      styleId,
      versionId,
      currentScene,
      currentBeat,
      language,
    );
  }, [registry, styleId, versionId, currentScene, currentBeat, language]);

  const handleSelectVersion = (sid: string, vid: string) => {
    onSelectVersion?.(sid, vid);
  };

  return (
    <>
      {/* Keyframe animation for card stack entrance */}
      <style>{`
        @keyframes cardStackEnter {
          from { opacity: 0; transform: scale(0.82); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div
        data-testid="bottom-bar"
        className="fixed bottom-0 left-0 right-0 w-full z-50 h-9 bg-chrome text-chrome-ink border-t border-ink/10 flex items-center px-3"
        role="toolbar"
        aria-label="Slide navigation"
      >
        {/* Prev button area */}
        <div className="flex items-center">
          <button
            type="button"
            data-testid="prev-button"
            onClick={onPrev}
            disabled={isFirst}
            className="p-1 rounded-md hover:bg-ink/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
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

          {/* Left stacked cards (previous versions) */}
          {leftCards.length > 0 && onSelectVersion && (
            <div className="ml-1 mr-1">
              <VersionCardStack
                cards={leftCards}
                side="left"
                onSelectVersion={handleSelectVersion}
              />
            </div>
          )}
        </div>

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
                      ? "bg-ink scale-125"
                      : "bg-ink/25 hover:bg-ink/50",
                  ].join(" ")}
                />
              );
            })}
          </div>

          {/* Beat progress + counter */}
          <div className="flex items-center gap-2 min-w-[80px]">
            <div
              data-testid="beat-progress-bar"
              className="flex-1 h-0.5 bg-ink/10 rounded-full overflow-hidden min-w-[40px]"
              role="progressbar"
              aria-valuenow={currentBeat + 1}
              aria-valuemin={1}
              aria-valuemax={totalBeats}
              aria-label="Beat progress"
            >
              <div
                data-testid="beat-progress-fill"
                className="h-full bg-ink/60 rounded-full transition-all duration-200"
                style={{ width: `${beatProgress}%` }}
              />
            </div>
            <span
              data-testid="beat-counter"
              className="text-[10px] font-mono text-ink/50 tabular-nums whitespace-nowrap"
            >
              {currentBeat + 1}/{totalBeats}
            </span>
          </div>
        </div>

        {/* Next button area */}
        <div className="flex items-center">
          {/* Right stacked cards (next versions) */}
          {rightCards.length > 0 && onSelectVersion && (
            <div className="ml-1 mr-1">
              <VersionCardStack
                cards={rightCards}
                side="right"
                onSelectVersion={handleSelectVersion}
              />
            </div>
          )}

          <button
            type="button"
            data-testid="next-button"
            onClick={onNext}
            disabled={isLast}
            className="p-1 rounded-md hover:bg-ink/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
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
      </div>
    </>
  );
}

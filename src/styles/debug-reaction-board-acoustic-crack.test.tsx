import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import AcousticCrack, {
  ACOUSTIC_ARRIVAL_ORDER,
  ACOUSTIC_CRACK_CLAIMS,
  ACOUSTIC_CRACK_SCENE_CLAIMS,
  ACOUSTIC_CRACK_SOURCES,
  ACOUSTIC_CRACK_TRANSITION_SCORE,
  ACOUSTIC_EVENT_SOURCE_POSITION,
  ACOUSTIC_SENSOR_POSITIONS,
  acousticCrackTopic,
  getMetadata,
} from "./debug-reaction-board-acoustic-crack";
import componentSource from "./debug-reaction-board-acoustic-crack.tsx?raw";
import styleClasses from "./debug-reaction-board-acoustic-crack.module.css";

const runtimeProcess = (
  globalThis as typeof globalThis & {
    process: { getBuiltinModule: (name: "node:fs") => unknown };
  }
).process;
const { readFileSync } = runtimeProcess.getBuiltinModule("node:fs") as {
  readFileSync: (path: string, encoding: "utf8") => string;
};
const styleSource = readFileSync(
  "src/styles/debug-reaction-board-acoustic-crack.module.css",
  "utf8",
);

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
};

const VISIBLE_CLAIM_FIELDS = [
  "heading",
  "state",
  "visual",
  "body",
  "readout",
  "beat",
  "boundary",
] as const;

const BASE_PROPS: BespokeStyleProps = {
  scene: 1,
  beat: 0,
  language: "en",
  isThumbnail: false,
  reducedMotion: false,
  onNavigate: vi.fn(),
};

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
  onStagePointerDown = vi.fn(),
  onStageTouchStart = vi.fn(),
  onStageTouchEnd = vi.fn(),
) {
  // DOM contract only. Pixel geometry and overflow are covered by the real-browser
  // 1920×1080 audit because JSDOM does not perform layout.
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <div
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={onStageClick}
      onPointerDown={onStagePointerDown}
      onTouchStart={onStageTouchStart}
      onTouchEnd={onStageTouchEnd}
    >
      <AcousticCrack {...props} />
    </div>,
  );

  return {
    ...result,
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="acoustic-crack"]',
      ),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<BespokeStyleProps>) {
      result.rerender(
        <div
          data-testid="stage"
          style={{
            width: 1920,
            height: 1080,
            containerType: "size",
            overflow: "hidden",
            position: "relative",
          }}
          onClick={onStageClick}
          onPointerDown={onStagePointerDown}
          onTouchStart={onStageTouchStart}
          onTouchEnd={onStageTouchEnd}
        >
          <AcousticCrack {...props} {...next} />
        </div>,
      );
    },
  };
}

describe("Debug Reaction Board / Acoustic Crack — protocol", () => {
  it("declares the exact topic, evidence packet, transition score, navigation, and bilingual beat curve", () => {
    expect(acousticCrackTopic.id).toBe("acoustic-crack");
    expect(acousticCrackTopic.topic).toEqual({
      en: "Acoustic Crack",
      zh: "听裂缝",
    });
    expect(acousticCrackTopic.navigation).toEqual({
      geometry: "edge-scale",
      carrier: "acoustic-trace-ruler",
      invocation: "proximity-reveal",
      feedback: "mechanical-displacement",
    });
    expect(acousticCrackTopic.sources).toBe(ACOUSTIC_CRACK_SOURCES);
    expect(acousticCrackTopic.transitionScore).toBe(
      ACOUSTIC_CRACK_TRANSITION_SCORE,
    );
    expect(ACOUSTIC_CRACK_TRANSITION_SCORE).toEqual({
      "1->2": "scanline",
      "2->3": "focus-swap",
      "3->4": "dip-to-color",
      "4->5": "scanline",
    });

    expect(ACOUSTIC_CRACK_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of ACOUSTIC_CRACK_SOURCES) {
      expect(source.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority.trim().length).toBeGreaterThan(3);
      expect(source.title.trim().length).toBeGreaterThan(6);
      expect(source.citation.trim().length).toBeGreaterThan(8);
      expect(source.supports.trim().length).toBeGreaterThan(30);
    }

    const english = getMetadata("en");
    const chinese = getMetadata("zh");
    expect(english.id).toBe("debug-reaction-board");
    expect(english.band).toBe("balanced-hybrid");
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 4, 1, 3, 1,
    ]);
    expect(chinese.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 4, 1, 3, 1,
    ]);
    expect(chinese.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id)).toEqual(
      english.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id),
    );
  });

  it("resolves every source and claim in both directions", () => {
    const sourceIds = ACOUSTIC_CRACK_SOURCES.map((source) => source.id);
    expect(new Set(sourceIds).size).toBe(sourceIds.length);

    for (const source of ACOUSTIC_CRACK_SOURCES) {
      for (const claimId of source.claimIds) {
        const claim = ACOUSTIC_CRACK_CLAIMS[claimId];
        expect(claim, `${source.id} -> ${claimId}`).toBeDefined();
        expect(claim.id).toBe(claimId);
        expect(claim.sourceIds).toContain(source.id);
      }
    }

    for (const [claimId, claim] of Object.entries(ACOUSTIC_CRACK_CLAIMS)) {
      expect(claim.id).toBe(claimId);
      expect(claim.statement.trim().length).toBeGreaterThan(20);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        const source = ACOUSTIC_CRACK_SOURCES.find(
          (candidate) => candidate.id === sourceId,
        );
        expect(source, `${claimId} -> ${sourceId}`).toBeDefined();
        expect(source?.claimIds).toContain(claim.id);
      }
    }
  });

  it("maps every visible fact field and scene source stamp to resolvable claims", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const sceneClaims =
          ACOUSTIC_CRACK_SCENE_CLAIMS[
            scene as keyof typeof ACOUSTIC_CRACK_SCENE_CLAIMS
          ];
        expect(sceneClaims.beats).toHaveLength(BEAT_COUNTS[scene]);

        const expectedSceneClaimIds = [
          ...new Set([
            ...sceneClaims.heading,
            ...sceneClaims.state,
            ...sceneClaims.visual,
            ...sceneClaims.body,
            ...sceneClaims.readout,
            ...sceneClaims.boundary,
            ...sceneClaims.beats.flat(),
          ]),
        ];
        const expectedSourceIds = ACOUSTIC_CRACK_SOURCES.filter((source) =>
          source.claimIds.some((claimId) =>
            expectedSceneClaimIds.includes(claimId),
          ),
        ).map((source) => source.id);

        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const active = view.activePanel();
          const visibleScene = active?.querySelector<HTMLElement>(
            `[data-scene="${scene}"]`,
          );
          const factFields = Array.from(
            visibleScene?.querySelectorAll<HTMLElement>("[data-claim-field]") ?? [],
          );

          expect(visibleScene).toHaveAttribute(
            "data-visible-claim-ids",
            expectedSceneClaimIds.join(" "),
          );
          expect(visibleScene).toHaveAttribute(
            "data-source-ids",
            expectedSourceIds.join(" "),
          );
          expect(factFields.map((field) => field.dataset.claimField)).toEqual(
            VISIBLE_CLAIM_FIELDS,
          );

          for (const field of factFields) {
            const fieldName = field.dataset
              .claimField as (typeof VISIBLE_CLAIM_FIELDS)[number];
            const expectedClaimIds =
              fieldName === "beat"
                ? sceneClaims.beats[beat]
                : sceneClaims[fieldName];
            const renderedClaimIds =
              field.dataset.claimIds?.split(" ").filter(Boolean) ?? [];

            expect(renderedClaimIds).toEqual([...expectedClaimIds]);
            for (const claimId of renderedClaimIds) {
              const claim =
                ACOUSTIC_CRACK_CLAIMS[
                  claimId as keyof typeof ACOUSTIC_CRACK_CLAIMS
                ];
              expect(claim, `${scene}/${beat}/${fieldName}/${claimId}`).toBeDefined();
              expect(claim.sourceIds.length).toBeGreaterThan(0);
            }
          }

          const sourceStamp = visibleScene?.querySelector<HTMLElement>(
            '[data-source-stamp="true"]',
          );
          expect(sourceStamp).toHaveAttribute(
            "data-source-ids",
            expectedSourceIds.join(" "),
          );
          expect(sourceStamp?.textContent).not.toMatch(/\bS[1-5]\b/);
          view.unmount();
        }
      }
    }
  });

  it("renders every English and Chinese beat as a settled diagnostic frame", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const active = view.activePanel();

          expect(active).toHaveAttribute("data-scene-id", String(scene));
          expect(active?.querySelector('[data-reading-state="settled"]')).not.toBeNull();
          expect(active?.textContent?.trim().length).toBeGreaterThan(90);
          expect(
            active?.querySelectorAll('[data-beat-layout-item="true"]').length,
          ).toBeGreaterThanOrEqual(3);
          if (BEAT_COUNTS[scene] > 1) {
            expect(active).toHaveAttribute("data-beat-layout-mode", "reserved");
          }
          view.unmount();
        }
      }
    }
  });

  it("keeps silence, one transient event, arrival evidence, noise, and inspection limits distinct", () => {
    const baseline = renderStage({ scene: 1, beat: 1 });
    expect(baseline.activePanel()).toHaveTextContent(/silent baseline/i);
    expect(baseline.activePanel()).toHaveTextContent(/alarm stays off/i);
    expect(
      baseline.activePanel()?.querySelector('[data-alert-state="off"]'),
    ).not.toBeNull();
    baseline.unmount();

    const event = renderStage({ scene: 2, beat: 3 });
    expect(event.activePanel()).toHaveTextContent(/one transient event/i);
    expect(
      event.activePanel()?.querySelector('[data-event-state="captured-once"]'),
    ).not.toBeNull();
    expect(
      event.activePanel()?.querySelectorAll('[data-sensor-arrival="true"]'),
    ).toHaveLength(3);
    event.unmount();

    const arrivals = renderStage({ scene: 3 });
    expect(arrivals.activePanel()).toHaveTextContent(/event—not continuous audio/i);
    expect(arrivals.activePanel()).toHaveTextContent(/no fixed crack-type lookup/i);
    expect(
      arrivals.activePanel()?.querySelectorAll('[data-arrival-trace="true"]'),
    ).toHaveLength(3);
    arrivals.unmount();

    const location = renderStage({ scene: 4, beat: 2 });
    expect(location.activePanel()).toHaveTextContent(/candidate source zone/i);
    expect(location.activePanel()).toHaveTextContent(/noise candidate retained/i);
    expect(
      location.activePanel()?.querySelector('[data-noise-candidate="retained"]'),
    ).not.toBeNull();
    expect(
      location.activePanel()?.querySelectorAll('[data-event-cluster="true"]').length,
    ).toBeGreaterThanOrEqual(3);
    location.unmount();

    const conclusion = renderStage({ scene: 5 });
    expect(conclusion.activePanel()).toHaveTextContent(/where to inspect next/i);
    expect(conclusion.activePanel()).toHaveTextContent(/not a severity verdict/i);
    expect(conclusion.activePanel()).toHaveTextContent(/dormant cracks may stay silent/i);
    expect(conclusion.activePanel()).toHaveTextContent(/verify with another NDE method/i);
    conclusion.unmount();
  });

  it("keeps the illustrated arrival order consistent with source and sensor geometry", () => {
    const geometryOrder = [...ACOUSTIC_SENSOR_POSITIONS]
      .sort((left, right) => {
        const leftDistance =
          (left.x - ACOUSTIC_EVENT_SOURCE_POSITION.x) ** 2 +
          (left.y - ACOUSTIC_EVENT_SOURCE_POSITION.y) ** 2;
        const rightDistance =
          (right.x - ACOUSTIC_EVENT_SOURCE_POSITION.x) ** 2 +
          (right.y - ACOUSTIC_EVENT_SOURCE_POSITION.y) ** 2;
        return leftDistance - rightDistance;
      })
      .map((sensor) => sensor.id);

    expect(geometryOrder).toEqual(["A", "B", "C"]);
    expect(ACOUSTIC_ARRIVAL_ORDER).toEqual(geometryOrder);

    const firstArrival = renderStage({ scene: 2, beat: 1 });
    const firstArrivedSensors = Array.from(
      firstArrival.activePanel()?.querySelectorAll(
        '[data-sensor-arrival="true"][data-arrived="true"]',
      ) ?? [],
    ).map((node) => node.getAttribute("data-sensor-id"));
    expect(firstArrivedSensors).toEqual(["A"]);
    firstArrival.unmount();

    for (const language of ["en", "zh"] as const) {
      const secondArrival = renderStage({ scene: 2, beat: 2, language });
      const secondArrivedSensors = Array.from(
        secondArrival.activePanel()?.querySelectorAll(
          '[data-sensor-arrival="true"][data-arrived="true"]',
        ) ?? [],
      ).map((node) => node.getAttribute("data-sensor-id"));
      expect(secondArrivedSensors).toEqual(["A", "B"]);
      expect(secondArrival.activePanel()).toHaveTextContent(
        language === "zh" ? /传感器 C 此时仍在等待/ : /sensor C remains pending/i,
      );
      secondArrival.unmount();

      const finalArrival = renderStage({ scene: 2, beat: 3, language });
      const finalArrivedSensors = Array.from(
        finalArrival.activePanel()?.querySelectorAll(
          '[data-sensor-arrival="true"][data-arrived="true"]',
        ) ?? [],
      ).map((node) => node.getAttribute("data-sensor-id"));
      expect(finalArrivedSensors).toEqual(["A", "B", "C"]);
      finalArrival.unmount();
    }

    const arrivals = renderStage({ scene: 3 });
    expect(
      arrivals.activePanel()?.querySelector('[data-arrival-order="A-B-C"]'),
    ).not.toBeNull();
    expect(arrivals.activePanel()).toHaveTextContent(/tA < tB < tC/);
    arrivals.unmount();
  });

  it("exposes the acoustic ruler, isolates container events, and keeps Space and repeats local", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStagePointerDown = vi.fn();
    const onStageTouchStart = vi.fn();
    const onStageTouchEnd = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const view = renderStage(
      { scene: 2, beat: 1, onNavigate },
      onStageClick,
      onStagePointerDown,
      onStageTouchStart,
      onStageTouchEnd,
    );

    try {
      const navigation = view.root()?.querySelector<HTMLElement>(
        '[data-topic-navigation="true"]',
      );
      expect(navigation).toHaveAttribute("data-navigation-geometry", "edge-scale");
      expect(navigation).toHaveAttribute(
        "data-navigation-carrier",
        "acoustic-trace-ruler",
      );
      expect(navigation).toHaveAttribute(
        "data-navigation-invocation",
        "proximity-reveal",
      );
      expect(navigation).toHaveAttribute(
        "data-navigation-feedback",
        "mechanical-displacement",
      );
      expect(within(navigation!).getAllByRole("button")).toHaveLength(5);
      expect(navigation?.querySelectorAll('[data-nav-state="active"]')).toHaveLength(1);

      fireEvent.pointerDown(navigation!);
      fireEvent.click(navigation!);
      fireEvent.touchStart(navigation!);
      fireEvent.touchEnd(navigation!);
      expect(onStagePointerDown).not.toHaveBeenCalled();
      expect(onStageClick).not.toHaveBeenCalled();
      expect(onStageTouchStart).not.toHaveBeenCalled();
      expect(onStageTouchEnd).not.toHaveBeenCalled();
      expect(onNavigate).not.toHaveBeenCalled();

      const current = within(navigation!).getByRole("button", {
        name: "Open acoustic trace scene 2",
      });
      fireEvent.keyDown(current, { key: " " });
      fireEvent.keyDown(current, { key: "ArrowRight", repeat: true });
      expect(onNavigate).not.toHaveBeenCalled();
      expect(onWindowKey).not.toHaveBeenCalled();

      fireEvent.keyDown(current, { key: "ArrowRight" });
      expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
      fireEvent.keyDown(current, { key: "End" });
      expect(onNavigate).toHaveBeenLastCalledWith(5, 0);

      const first = within(navigation!).getByRole("button", {
        name: "Open acoustic trace scene 1",
      });
      fireEvent.pointerDown(first);
      fireEvent.click(first);
      expect(onNavigate).toHaveBeenLastCalledWith(1, 0);
      expect(onWindowKey).not.toHaveBeenCalled();
      expect(onStagePointerDown).not.toHaveBeenCalled();
      expect(onStageClick).not.toHaveBeenCalled();
    } finally {
      view.unmount();
      window.removeEventListener("keydown", onWindowKey);
    }
  });

  it("uses the exact score on all four consecutive scene edges", () => {
    const view = renderStage({ scene: 1, beat: 0 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [target, kind] of [
      [2, "scanline"],
      [3, "focus-swap"],
      [4, "dip-to-color"],
      [5, "scanline"],
    ] as const) {
      view.rerenderProps({ scene: target, beat: 0 });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });

  it("settles reduced-motion, frozen-style, and thumbnail frames", () => {
    const reduced = renderStage({
      scene: 2,
      beat: 3,
      reducedMotion: true,
      onNavigate: undefined,
    });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(reduced.root()).toHaveAttribute("data-frame-state", "settled");
    expect(reduced.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(
      reduced.activePanel()?.querySelector('[data-event-state="captured-once"]'),
    ).not.toBeNull();
    reduced.unmount();

    const thumbnail = renderStage({
      scene: 2,
      beat: 0,
      isThumbnail: true,
      onNavigate: undefined,
    });
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(thumbnail.root()).toHaveAttribute("data-thumbnail", "true");
    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(
      thumbnail.activePanel()?.querySelector('[data-active-beat="3"]'),
    ).not.toBeNull();
    expect(
      thumbnail.activePanel()?.querySelector('[data-event-state="captured-once"]'),
    ).not.toBeNull();
    thumbnail.unmount();
  });

  it("locks the stage-local root, track, scene, and data contract", () => {
    const view = renderStage({ scene: 4, beat: 2, language: "zh" });
    const root = view.root();
    const track = root?.querySelector<HTMLElement>(
      '[data-spatial-scene-track="true"]',
    );
    const panel = view.activePanel();
    const scene = panel?.querySelector<HTMLElement>('[data-scene="4"]');

    expect(root).toHaveClass(styleClasses.root);
    expect(root).toHaveAttribute("data-topic-id", "acoustic-crack");
    expect(root).toHaveAttribute("data-language", "zh");
    expect(root).toHaveAttribute("data-thumbnail", "false");
    expect(root).toHaveAttribute("data-motion", "on");
    expect(root).toHaveAttribute("data-frame-state", "settled");

    expect(track).toHaveClass(styleClasses.track);
    expect(track).toHaveAttribute("data-spatial-scene-track", "true");
    expect(track).toHaveAttribute("data-active-scene", "4");
    expect(track).toHaveAttribute("data-scene-transition-kind", "scanline");

    expect(panel).toHaveAttribute("data-scene-id", "4");
    expect(panel).toHaveAttribute("data-active", "true");
    expect(panel).toHaveAttribute("data-beat-layout-container", "true");
    expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");

    expect(scene).toHaveClass(styleClasses.scene);
    expect(scene).toHaveAttribute("data-scene", "4");
    expect(scene).toHaveAttribute("data-active-beat", "2");
    expect(scene).toHaveAttribute("data-panel-active", "true");
    expect(scene).toHaveAttribute("data-reading-state", "settled");

    view.unmount();
  });

  it("keeps stage CSS clipped and container-unit safe without JSDOM geometry claims", () => {
    const rootRule = styleSource.match(/(?:^|\n)\.root\s*\{([^}]*)\}/)?.[1];
    const trackRule = styleSource.match(/(?:^|\n)\.track\s*\{([^}]*)\}/)?.[1];
    const sceneRule = styleSource.match(/(?:^|\n)\.scene\s*\{([^}]*)\}/)?.[1];

    expect(rootRule).toMatch(/position:\s*relative\s*;/);
    expect(rootRule).toMatch(/width:\s*100%\s*;/);
    expect(rootRule).toMatch(/height:\s*100%\s*;/);
    expect(rootRule).toMatch(/overflow:\s*hidden\s*;/);
    expect(rootRule).toMatch(/container-type:\s*size\s*;/);

    expect(trackRule).toMatch(/position:\s*relative\s*;/);

    expect(sceneRule).toMatch(/position:\s*relative\s*;/);
    expect(sceneRule).toMatch(/width:\s*100%\s*;/);
    expect(sceneRule).toMatch(/height:\s*100%\s*;/);
    expect(sceneRule).toMatch(/overflow:\s*hidden\s*;/);
    expect(sceneRule).toMatch(/padding:\s*[^;]*cqh[^;]*cqw[^;]*;/);

    expect(styleSource).toMatch(/\d*\.?\d+cqw\b/i);
    expect(styleSource).toMatch(/\d*\.?\d+cqh\b/i);
    expect(styleSource).not.toMatch(/position:\s*fixed\b/i);

    const source = `${componentSource}\n${styleSource}`;
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(source).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(source).not.toMatch(/animation[^;{]*infinite/i);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//i);
    expect(styleSource).not.toMatch(/@import\s+url\([^)]*https?:\/\//i);
    expect(componentSource).not.toMatch(/createElement\(["']link["']\)/);
    expect(source).not.toMatch(
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i,
    );
  });
});

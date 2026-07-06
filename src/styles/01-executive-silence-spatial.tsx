import { useCallback, useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./01-executive-silence-spatial.module.css";

interface SceneCopy {
  kicker: string;
  title: string;
  body: string;
  metrics?: Array<{ value: string; label: string }>;
  points?: string[];
}

const COPY: Record<number, Record<"en" | "zh", SceneCopy>> = {
  1: {
    en: {
      kicker: "Nova launch",
      title: "Quiet signals move first.",
      body: "A launch narrative built for restraint: one assertion, then evidence.",
    },
    zh: {
      kicker: "Nova 发布",
      title: "安静的信号先移动。",
      body: "克制的发布叙事：先给出一个主张，再给出证据。",
    },
  },
  2: {
    en: {
      kicker: "Market read",
      title: "Demand is clear before it is loud.",
      body: "The strongest pattern is not volume. It is repeated intent from the same narrow group.",
      metrics: [
        { value: "3.8×", label: "repeat trials" },
        { value: "41%", label: "shorter setup" },
      ],
    },
    zh: {
      kicker: "市场读数",
      title: "需求先清晰，后喧哗。",
      body: "最强的模式不是声量，而是同一小群人的重复意图。",
      metrics: [
        { value: "3.8×", label: "重复试用" },
        { value: "41%", label: "配置缩短" },
      ],
    },
  },
  3: {
    en: {
      kicker: "Product posture",
      title: "Fewer surfaces. More certainty.",
      body: "Every removed choice gives the remaining choices more authority.",
      points: ["One primary path", "One visible promise", "One reversible commitment"],
    },
    zh: {
      kicker: "产品姿态",
      title: "更少表面，更多确定性。",
      body: "每移除一个选择，剩下的选择就更有分量。",
      points: ["一条主路径", "一个可见承诺", "一次可回退投入"],
    },
  },
  4: {
    en: {
      kicker: "Operating model",
      title: "The launch stays small on purpose.",
      body: "Small is not caution. It is how the team keeps the feedback legible.",
      metrics: [
        { value: "12", label: "anchor accounts" },
        { value: "5", label: "weekly decisions" },
      ],
    },
    zh: {
      kicker: "运营模型",
      title: "发布会刻意保持小。",
      body: "小不是谨慎，而是为了让反馈保持可读。",
      metrics: [
        { value: "12", label: "锚点客户" },
        { value: "5", label: "每周决策" },
      ],
    },
  },
  5: {
    en: {
      kicker: "Decision",
      title: "Open the door. Keep the room quiet.",
      body: "Launch with enough surface to learn, and enough restraint to stay precise.",
    },
    zh: {
      kicker: "决策",
      title: "把门打开，让房间保持安静。",
      body: "发布足够学习的表面，同时保留足够的克制。",
    },
  },
};

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 2,
  5: 1,
};

function useFonts() {
  useEffect(() => {
    const id = "style-01-spatial-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@500&display=swap";
    document.head.appendChild(link);
  }, []);
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const sceneTitles = {
    en: ["Signal", "Demand", "Posture", "Model", "Decision"],
    zh: ["信号", "需求", "姿态", "模型", "决策"],
  };

  return {
    id: "01",
    band: "minimal-keynote",
    name: lang === "zh" ? "极简产品主题演讲" : "Minimal Product Keynote",
    theme:
      lang === "zh"
        ? "安静发布——用空间轨道呈现高端产品发布"
        : "Quiet Launch — a spatial-track premium product reveal",
    densityLabel: lang === "zh" ? "稀疏" : "Sparse",
    heroScene: 1,
    colors: { bg: "#0d0d0c", ink: "#f2efe9", panel: "#161614" },
    typography: { header: "Playfair Display 500", body: "Inter 300" },
    tags: [
      "minimal",
      "premium",
      "product",
      "keynote",
      "sparse",
      "spatial-track",
      "protocol-version",
    ],
    fonts: ["Playfair Display", "Inter"],
    scenes: [1, 2, 3, 4, 5].map((sceneId) => {
      const copy = COPY[sceneId][lang];
      return {
        id: sceneId,
        title: sceneTitles[lang][sceneId - 1],
        beats: Array.from({ length: BEAT_COUNTS[sceneId] }, (_, beatId) => ({
          id: beatId,
          action:
            beatId === 0
              ? copy.title
              : lang === "zh"
                ? `展开 ${beatId}`
                : `Reveal ${beatId}`,
          title: copy.title,
          body: copy.body,
        })),
      };
    }),
  };
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
}: {
  scene: number;
  beat: number;
  language: "en" | "zh";
  isActive: boolean;
}) {
  const copy = COPY[scene]?.[language] ?? COPY[1][language];
  const metrics = copy.metrics ?? [];
  const points = copy.points ?? [];

  return (
    <div className={styles.scenePanel}>
      <div className={styles.content}>
        <p className={styles.kicker}>{copy.kicker}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.body}>{copy.body}</p>

        {metrics.length > 0 && beat >= 1 && (
          <div className={`${styles.metricRow} ${isActive ? styles.reveal : ""}`}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metric}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        )}

        {points.length > 0 && (
          <ul className={styles.quietList}>
            {points.slice(0, beat + 1).map((point, index) => (
              <li
                key={point}
                className={`${styles.quietItem} ${isActive ? styles.reveal : ""}`}
              >
                <span className={styles.quietIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ExecutiveSilenceSpatial({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const handleNavClick = useCallback(
    (event: React.MouseEvent, targetScene: number) => {
      event.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClassName = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
    isThumbnail ? styles.thumbnail : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        axis="x"
        reducedMotion={reducedMotion || isThumbnail}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />

      {!isThumbnail && (
        <nav className={styles.rulerNav} aria-label="Scene navigation">
          {[1, 2, 3, 4, 5].map((sceneId) => (
            <button
              key={sceneId}
              type="button"
              className={[
                styles.rulerMarker,
                sceneId === scene ? styles.rulerMarkerActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={`Jump to scene ${sceneId}`}
              onClick={(event) => handleNavClick(event, sceneId)}
            >
              {String(sceneId).padStart(2, "0")}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export const executiveSilenceSpatialVersion = defineStyleVersion({
  id: "spatial-track",
  topic: "Quiet Launch",
  model: "GPT-5",
  component: ExecutiveSilenceSpatial,
  getMetadata,
});

export default ExecutiveSilenceSpatial;

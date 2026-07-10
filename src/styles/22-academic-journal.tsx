import React, { useLayoutEffect, useEffect, useCallback, useState } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./22-academic-journal.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    sessionLabel?: string;
    title?: string;
    subtitle?: string;
    catalog?: string;
    artistLabel?: string;
    artistName?: string;
    artistCredit?: string;
    artistBio?: string;
    lineupLabel?: string;
    lineupTitle?: string;
    tracks?: Array<{ num: string; title: string; duration: string }>;
    specsLabel?: string;
    specsTitle?: string;
    specs?: Array<{ label: string; value: string }>;
    closing?: string;
    closingCredit?: string;
  };
  zh: {
    sessionLabel?: string;
    title?: string;
    subtitle?: string;
    catalog?: string;
    artistLabel?: string;
    artistName?: string;
    artistCredit?: string;
    artistBio?: string;
    lineupLabel?: string;
    lineupTitle?: string;
    tracks?: Array<{ num: string; title: string; duration: string }>;
    specsLabel?: string;
    specsTitle?: string;
    specs?: Array<{ label: string; value: string }>;
    closing?: string;
    closingCredit?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      sessionLabel: "Session No. 07",
      title: "LATE NIGHT\nPROTOCOL",
      subtitle: "A recording session in five movements",
      catalog: "Catalog No. BN-2026-07",
    },
    zh: {
      sessionLabel: "第七号录制",
      title: "深夜\n协议",
      subtitle: "一场分为五个乐章的录制",
      catalog: "编号 BN-2026-07",
    },
  },
  2: {
    en: {
      artistLabel: "Featured",
      artistName: "Maya Okonkwo",
      artistCredit: "Composer · Piano · Electronics",
      artistBio:
        "Trained in classical composition at Juilliard, drawn to the pulse of late-night studios. Her work lives where notation meets improvisation — scored with precision, played with feeling.",
    },
    zh: {
      artistLabel: "特邀",
      artistName: "玛雅·奥孔科沃",
      artistCredit: "作曲 · 钢琴 · 电子",
      artistBio:
        "在茱莉亚学院接受古典作曲训练，被深夜工作室的脉搏吸引。她的作品存在于记谱法与即兴的交汇处——以精确谱曲，以情感演奏。",
    },
  },
  3: {
    en: {
      lineupLabel: "Track Listing",
      lineupTitle: "Side A",
      tracks: [
        { num: "01", title: "Prelude to Stillness", duration: "4:32" },
        { num: "02", title: "Frequency Drift", duration: "6:18" },
        { num: "03", title: "Analog Heart", duration: "5:47" },
      ],
    },
    zh: {
      lineupLabel: "曲目列表",
      lineupTitle: "A面",
      tracks: [
        { num: "01", title: "寂静前奏曲", duration: "4:32" },
        { num: "02", title: "频率漂移", duration: "6:18" },
        { num: "03", title: "模拟之心", duration: "5:47" },
      ],
    },
  },
  4: {
    en: {
      specsLabel: "Technical",
      specsTitle: "Session Data",
      specs: [
        { label: "Studio", value: "RCA Studio B, Nashville" },
        { label: "Date", value: "March 14–16, 2026" },
        { label: "Engineer", value: "Daniel Lanois III" },
        { label: "Format", value: "Live to 2-inch tape" },
      ],
    },
    zh: {
      specsLabel: "技术",
      specsTitle: "录制数据",
      specs: [
        { label: "录音室", value: "RCA Studio B，纳什维尔" },
        { label: "日期", value: "2026年3月14–16日" },
        { label: "工程师", value: "丹尼尔·拉努瓦三世" },
        { label: "格式", value: "现场录制到2英寸磁带" },
      ],
    },
  },
  5: {
    en: {
      closing: "THE BEST\nRECORDINGS\nHAPPEN AFTER\nMIDNIGHT.",
      closingCredit: "— Late Night Protocol, out July 2026",
    },
    zh: {
      closing: "最好的\n录音\n发生在\n午夜之后。",
      closingCredit: "—— 《深夜协议》，2026年7月发行",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Duotone Session", zh: "双调录制" };
  const themeMap = {
    en: "LP-sleeve session posters — warm black ground, single spot-ink duotone tint, enormous condensed gothic type stacked asymmetrically",
    zh: "黑胶封套录制海报——暖色黑底、单一专色双调、巨大的浓缩哥特字体非对称堆叠",
  };
  const densityLabelMap = { en: "Visual-First", zh: "视觉优先" };

  const sceneTitles = {
    en: ["Session Title", "Featured Artist", "Track Listing", "Technical", "Manifesto"],
    zh: ["录制标题", "特邀艺术家", "曲目列表", "技术数据", "宣言"],
  };

  const beatActions = {
    en: {
      1: ["Session title and catalog appear"],
      2: ["Artist name and credit", "Bio text reveals"],
      3: ["Track listing header", "Tracks populate"],
      4: ["Specs header", "Data rows reveal"],
      5: ["Closing statement", "Credit line appears"],
    },
    zh: {
      1: ["录制标题与编号呈现"],
      2: ["艺术家姓名与署名", "简介文本揭示"],
      3: ["曲目列表标题", "曲目填充"],
      4: ["技术规格标题", "数据行揭示"],
      5: ["结语陈述", "署名行出现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const content = SCENES[id][lang];
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = content.title || "";
        beatBody = content.catalog || "";
      } else if (id === 2) {
        beatTitle = content.artistName || "";
        beatBody = beatIdx >= 1 ? content.artistBio || "" : content.artistCredit || "";
      } else if (id === 3) {
        beatTitle = content.lineupTitle || "";
        beatBody = beatIdx >= 1 ? (content.tracks || []).map((t) => `${t.num} ${t.title}`).join(" / ") : "";
      } else if (id === 4) {
        beatTitle = content.specsTitle || "";
        beatBody = beatIdx >= 1 ? (content.specs || []).map((s) => `${s.label}: ${s.value}`).join(" / ") : "";
      } else if (id === 5) {
        beatTitle = content.closing || "";
        beatBody = beatIdx >= 1 ? content.closingCredit || "" : "";
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return {
      id,
      title: sceneTitles[lang][id - 1],
      beats,
    };
  });

  return {
    id: "duotone-session",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 1,
    colors: {
      bg: "#1c1c20",
      ink: "#f0ece4",
      panel: "#252530",
    },
    typography: {
      header: "Oswald 700",
      body: "Inter 400",
    },
    tags: [
      "duotone",
      "session",
      "blue-note",
      "gothic-sans",
      "lp-sleeve",
      "flat-ink",
      "photo-first",
      "asymmetric",
      "percussive",
    ],
    fonts: ["Oswald", "Playfair Display", "Inter", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Transition constants ──────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2 };

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function AcademicJournal({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  // Font injection
  useEffect(() => {
    const id = "style-22-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Beat-level entered state
  useLayoutEffect(() => {
    setEntered(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [scene, beat]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
    isThumbnail ? styles.thumbnail : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    isOutgoing: boolean,
  ) => {
    const content = SCENES[sceneNum]?.[language] || SCENES[1][language];
    const effectiveBeat = isOutgoing ? BEAT_COUNTS[sceneNum] - 1 : beatNum;
    const effectiveEntered = isOutgoing ? true : entered;

    if (sceneNum === 1) {
      return (
        <div className={styles.journalTitlePage}>
          <div className={styles.duotonePhotoArea} />
          <div className={styles.sessionContent}>
            <p className={styles.sessionLabel}>{content.sessionLabel}</p>
            <h1 className={styles.sessionTitle}>
              {(content.title || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (content.title || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className={styles.sessionSubtitle}>{content.subtitle}</p>
            <p className={styles.sessionCatalog}>{content.catalog}</p>
          </div>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.abstractScene}>
          <div className={styles.artistPhoto} />
          <div className={styles.artistInfo}>
            <p className={styles.artistLabel}>{content.artistLabel}</p>
            <h2 className={styles.artistName}>{content.artistName}</h2>
            <p className={styles.artistCredit}>{content.artistCredit}</p>
            {effectiveBeat >= 1 && (
              <p
                className={styles.artistBio}
                style={{
                  opacity: effectiveEntered ? 0.7 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.5s ease 0.2s",
                }}
              >
                {content.artistBio}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      const tracks = content.tracks || [];
      return (
        <div className={styles.methodScene}>
          <div className={styles.methodSectionHead}>
            <p className={styles.lineupLabel}>{content.lineupLabel}</p>
            <h2 className={styles.lineupTitle}>{content.lineupTitle}</h2>
          </div>
          {effectiveBeat >= 1 && (
            <div
              className={styles.trackList}
              style={{
                opacity: effectiveEntered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.4s ease 0.1s",
              }}
            >
              {tracks.map((track, i) => (
                <div key={i} className={styles.trackItem}>
                  <span className={styles.trackNum}>{track.num}</span>
                  <span className={styles.trackTitle}>{track.title}</span>
                  <span className={styles.trackDuration}>{track.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sceneNum === 4) {
      const specs = content.specs || [];
      return (
        <div className={styles.resultsScene}>
          <div className={styles.resultsHeader}>
            <p className={styles.specsLabel}>{content.specsLabel}</p>
            <h2 className={styles.specsTitle}>{content.specsTitle}</h2>
          </div>
          {effectiveBeat >= 1 && (
            <div
              className={styles.specsList}
              style={{
                opacity: effectiveEntered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.4s ease 0.1s",
              }}
            >
              {specs.map((spec, i) => (
                <div key={i} className={styles.specItem}>
                  <span className={styles.specItemLabel}>{spec.label}</span>
                  <span className={styles.specItemValue}>{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.conclusionScene}>
          <div className={styles.closingDuotoneBg} />
          <div className={styles.closingContent}>
            <p className={styles.closingStatement}>
              {(content.closing || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (content.closing || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            {effectiveBeat >= 1 && (
              <p
                className={styles.closingCredit}
                style={{
                  opacity: effectiveEntered ? 0.5 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.5s ease 0.3s",
                }}
              >
                {content.closingCredit}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderNavIndicators = () => {
    if (isThumbnail) return null;

    return (
      <div className={styles.navIndicators} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const classes = [
            styles.navIndicator,
            isActive ? styles.navIndicatorActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={classes}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.navIndicatorNum}>{s}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, false)}
          </div>
        )}
      />

      {renderNavIndicators()}
    </div>
  );
}

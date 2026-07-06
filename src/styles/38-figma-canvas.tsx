import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./38-figma-canvas.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-38-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      title: "THE QUIET",
      titleSecond: "HOURS",
      subtitle: "A film in five chapters",
      studio: "MERIDIAN PICTURES  presents",
    },
    zh: {
      title: "静谧",
      titleSecond: "时光",
      subtitle: "一部五章电影",
      studio: "子午线影业 出品",
    },
  },
  2: {
    en: {
      chapter: "CHAPTER ONE",
      title: "Arrival",
      credits: [
        { role: "Director", name: "E. Moreau" },
        { role: "Cinematography", name: "J. Tanaka" },
        { role: "Music", name: "The Hollow Ensemble" },
      ],
    },
    zh: {
      chapter: "第一章",
      title: "抵达",
      credits: [
        { role: "导演", name: "E. 莫罗" },
        { role: "摄影", name: "J. 田中" },
        { role: "音乐", name: "空谷乐团" },
      ],
    },
  },
  3: {
    en: {
      title: "Three Moments",
      subtitle: "that changed everything",
      cards: [
        { num: "I", title: "The Train Station", time: "04:12 AM", desc: "She was the only one waiting." },
        { num: "II", title: "The Empty Room", time: "Dust in light", desc: "Nothing had been moved in seven years." },
        { num: "III", title: "The Letter", time: "Postmarked 1987", desc: "It had been written, but never sent." },
      ],
    },
    zh: {
      title: "三个瞬间",
      subtitle: "改变了一切",
      cards: [
        { num: "一", title: "火车站", time: "凌晨 4:12", desc: "她是唯一在等的人。" },
        { num: "二", title: "空房间", time: "光中的尘埃", desc: "七年了，什么都没被动过。" },
        { num: "三", title: "那封信", time: "邮戳 1987", desc: "它被写下了，但从未寄出。" },
      ],
    },
  },
  4: {
    en: {
      quote: "Time is the only currency we spend without knowing the balance.",
      attribution: "— from Chapter Three",
      role: "Narrated by",
      actor: "M. Rostova",
    },
    zh: {
      quote: "时间是唯一一种我们在不知余额的情况下花费的货币。",
      attribution: "——摘自第三章",
      role: "旁白",
      actor: "M. 罗斯托娃",
    },
  },
  5: {
    en: {
      fin: "FIN.",
      sub: "End of Part One",
      coming: "PART TWO  —  COMING SOON",
      studio: "MERIDIAN PICTURES",
    },
    zh: {
      fin: "终。",
      sub: "第一部分 完",
      coming: "第二部分  —  即将上映",
      studio: "子午线影业",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Widescreen Title Card", zh: "宽屏标题卡" };
  const themeMap = {
    en: "Section Titles & Chapter Transitions — cinematic letterbox framing with graded still ground, film-poster title treatment and credit-like supporting text",
    zh: "章节标题与过渡——宽屏信箱式构图，分级剧照底色，电影海报式标题处理，演职员表式辅助文字",
  };
  const densityLabelMap = { en: "Cinematic-Sparse", zh: "电影留白" };

  const sceneTitles = {
    en: ["Title Card", "Chapter One", "Three Moments", "Narration", "Fin."],
    zh: ["标题卡", "第一章", "三个瞬间", "旁白", "终"],
  };

  const beatActions = {
    en: {
      1: ["Title settles in"],
      2: ["Chapter title appears", "Credits roll in"],
      3: ["Card I reveals", "Card II reveals", "Card III reveals"],
      4: ["Quote fades in", "Attribution appears"],
      5: ["Fin. card settles"],
    },
    zh: {
      1: ["标题落定"],
      2: ["章节标题出现", "演职员表滑入"],
      3: ["卡片一揭示", "卡片二揭示", "卡片三揭示"],
      4: ["引言淡入", "署名出现"],
      5: ["终卡落定"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        const c1 = c as unknown as { title: string; subtitle: string };
        beatTitle = c1.title;
        beatBody = c1.subtitle;
      } else if (id === 2) {
        const c2 = c as unknown as { title: string; chapter: string; credits: Array<{ role: string; name: string }> };
        beatTitle = `${c2.chapter}: ${c2.title}`;
        if (beatIdx === 0) {
          beatBody = c2.chapter;
        } else {
          beatBody = c2.credits.map((cr) => `${cr.role}: ${cr.name}`).join(" / ");
        }
      } else if (id === 3) {
        const c3 = c as unknown as { title: string; cards: Array<{ num: string; title: string }> };
        beatTitle = c3.title;
        const visible = c3.cards.slice(0, beatIdx + 1);
        beatBody = visible.map((ca) => `${ca.num}. ${ca.title}`).join(" / ");
      } else if (id === 4) {
        const c4 = c as unknown as { quote: string; attribution: string; actor: string };
        beatTitle = c4.attribution;
        if (beatIdx === 0) {
          beatBody = c4.quote.slice(0, 60) + "...";
        } else {
          beatBody = c4.actor;
        }
      } else if (id === 5) {
        const c5 = c as unknown as { fin: string; sub: string; coming: string };
        beatTitle = c5.fin;
        beatBody = `${c5.sub} — ${c5.coming}`;
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
    id: "38",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#0a0808",
      ink: "#f0ebe3",
      panel: "rgba(240, 235, 227, 0.06)",
    },
    typography: {
      header: "Playfair Display 900",
      body: "Inter 300",
    },
    tags: [
      "cinematic",
      "widescreen",
      "letterbox",
      "film-poster",
      "title-card",
      "warm-black",
      "editorial",
      "serif",
      "ken-burns",
      "chapter",
    ],
    fonts: ["Playfair Display", "Inter"],
    scenes,
  };
}

// ─── Transition constants ───────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function FigmaCanvas({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const [entered, setEntered] = useState(false);

  // Beat-level entered state — controls reveal animations
  useEffect(() => {
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [scene, reducedMotion]);

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
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene 1: Title Card ────────────────────────────────────────────────

  const renderScene1 = (isEntered: boolean) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.titleCardScene}>
        <div className={styles.titleCardInner}>
          <p
            className={styles.studioCredit}
            style={{
              opacity: isEntered ? 0.4 : 0,
              transition: reducedMotion ? "none" : "opacity 1.2s ease 0.3s",
            }}
          >
            {c.studio}
          </p>
          <h1
            className={styles.filmTitle}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "scale(1)" : "scale(1.04)",
              transition: reducedMotion
                ? "none"
                : "opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            }}
          >
            {c.title}
            <br />
            <span className={styles.filmTitleSecond}>{c.titleSecond}</span>
          </h1>
          <p
            className={styles.filmSubtitle}
            style={{
              opacity: isEntered ? 0.5 : 0,
              transition: reducedMotion ? "none" : "opacity 1.2s ease 1.2s",
            }}
          >
            {c.subtitle}
          </p>
        </div>
      </div>
    );
  };

  // ── Scene 2: Chapter ───────────────────────────────────────────────────

  const renderScene2 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[2][language];
    return (
      <div className={styles.chapterScene}>
        <div className={styles.chapterInner}>
          <p
            className={styles.chapterLabel}
            style={{
              opacity: isEntered ? 0.6 : 0,
              transition: reducedMotion ? "none" : "opacity 1s ease 0.3s",
            }}
          >
            {c.chapter}
          </p>
          <h2
            className={styles.chapterTitle}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "translateY(0)" : "translateY(2cqh)",
              transition: reducedMotion
                ? "none"
                : "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
            }}
          >
            {c.title}
          </h2>
          {beatNum >= 1 && (
            <div
              className={styles.creditList}
              style={{
                opacity: isEntered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 1s ease 1s",
              }}
            >
              {c.credits.map((cr, i) => (
                <div
                  key={i}
                  className={styles.creditItem}
                  style={{
                    opacity: isEntered ? 1 : 0,
                    transform: isEntered ? "translateY(0)" : "translateY(1cqh)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.8s ease ${1.2 + i * 0.15}s, transform 0.8s ease ${1.2 + i * 0.15}s`,
                  }}
                >
                  <span className={styles.creditRole}>{cr.role}</span>
                  <span className={styles.creditName}>{cr.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Scene 3: Three Moments ─────────────────────────────────────────────

  const renderScene3 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[3][language];
    return (
      <div className={styles.momentsScene}>
        <h2
          className={styles.momentsTitle}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 1s ease 0.3s",
          }}
        >
          {c.title}
        </h2>
        <p
          className={styles.momentsSub}
          style={{
            opacity: isEntered ? 0.5 : 0,
            transition: reducedMotion ? "none" : "opacity 1s ease 0.5s",
          }}
        >
          {c.subtitle}
        </p>
        <div className={styles.momentsCards}>
          {c.cards.map((card, i) => {
            const visible = isEntered && i <= beatNum;
            return (
              <div
                key={i}
                className={styles.momentCard}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0) scale(1)" : "translateY(3cqh) scale(0.97)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.2}s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.2}s`,
                }}
              >
                <span className={styles.momentNum}>{card.num}</span>
                <h3 className={styles.momentCardTitle}>{card.title}</h3>
                <p className={styles.momentTime}>{card.time}</p>
                <p className={styles.momentDesc}>{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Scene 4: Narration / Pull-quote ────────────────────────────────────

  const renderScene4 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[4][language];
    return (
      <div className={styles.narrationScene}>
        <div className={styles.narrationInner}>
          <p
            className={styles.narrationQuote}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "scale(1)" : "scale(1.02)",
              transition: reducedMotion
                ? "none"
                : "opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            &ldquo;{c.quote}&rdquo;
          </p>
          {beatNum >= 1 && (
            <div
              className={styles.narrationAttribution}
              style={{
                opacity: isEntered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 1s ease 1.2s",
              }}
            >
              <p className={styles.narrationAttrText}>{c.attribution}</p>
              <p className={styles.narrationRole}>
                {c.role} <span className={styles.narrationActor}>{c.actor}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Scene 5: Fin. ──────────────────────────────────────────────────────

  const renderScene5 = (isEntered: boolean) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.finScene}>
        <div className={styles.finInner}>
          <h1
            className={styles.finText}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "scale(1)" : "scale(0.96)",
              transition: reducedMotion
                ? "none"
                : "opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            {c.fin}
          </h1>
          <p
            className={styles.finSub}
            style={{
              opacity: isEntered ? 0.5 : 0,
              transition: reducedMotion ? "none" : "opacity 1.2s ease 1s",
            }}
          >
            {c.sub}
          </p>
          <p
            className={styles.finComing}
            style={{
              opacity: isEntered ? 0.35 : 0,
              transition: reducedMotion ? "none" : "opacity 1.2s ease 1.5s",
            }}
          >
            {c.coming}
          </p>
          <p
            className={styles.finStudio}
            style={{
              opacity: isEntered ? 0.25 : 0,
              transition: reducedMotion ? "none" : "opacity 1.2s ease 2s",
            }}
          >
            {c.studio}
          </p>
        </div>
      </div>
    );
  };

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(isEntered);
      case 2:
        return renderScene2(isEntered, beatNum);
      case 3:
        return renderScene3(isEntered, beatNum);
      case 4:
        return renderScene4(isEntered, beatNum);
      case 5:
        return renderScene5(isEntered);
      default:
        return null;
    }
  };

  // ── Navigation Indicators ───────────────────────────────────────────────

  const renderNavIndicators = () => {
    if (isThumbnail) return null;
    return (
      <div className={styles.navIndicators} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={`${styles.navIndicator} ${isActive ? styles.navIndicatorActive : ""}`}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            />
          );
        })}
      </div>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
      {/* Letterbox bars (persistent) */}
      <div className={styles.letterboxTop} />
      <div className={styles.letterboxBottom} />

      {/* Graded still ground layer */}
      <div className={styles.groundLayer} />

            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
          </div>
        )}
      />

      {renderNavIndicators()}
    </div>
  );
}

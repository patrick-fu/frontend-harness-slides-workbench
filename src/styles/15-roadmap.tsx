import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./15-roadmap.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-15-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      label: "Studio Console",
      title: "Mixing",
      titleAccent: "Parameters",
      sub: "Every channel tuned, every fader set — balancing inputs for the perfect output",
      meta: [
        { val: "12", lbl: "Channels" },
        { val: "4", lbl: "Busses" },
        { val: "0dB", lbl: "Headroom" },
      ],
    },
    zh: {
      label: "录音控制台",
      title: "参数",
      titleAccent: "混音",
      sub: "每个通道都调好，每个推子都到位——平衡输入以获得完美输出",
      meta: [
        { val: "12", lbl: "通道" },
        { val: "4", lbl: "总线" },
        { val: "0dB", lbl: "余量" },
      ],
    },
  },
  2: {
    en: {
      label: "Channel Strips",
      title: "Fader Levels",
      months: ["Ch 1", "Ch 2", "Ch 3", "Ch 4", "Ch 5", "Ch 6", "Ch 7", "Ch 8", "Ch 9", "Ch 10", "Ch 11", "Ch 12"],
      currentMonth: 3,
      tasks: [
        { name: "Input Gain", start: 0, width: 25, phase: "Q1", label: "+6dB" },
        { name: "EQ Low", start: 15, width: 30, phase: "Q2", label: "-3dB" },
        { name: "EQ Mid", start: 35, width: 25, phase: "Q2", label: "+2dB" },
        { name: "Compression", start: 55, width: 25, phase: "Q3", label: "4:1" },
        { name: "Reverb Send", start: 65, width: 20, phase: "Q3", label: "15%" },
        { name: "Master Out", start: 80, width: 20, phase: "Q4", label: "0dB" },
      ],
    },
    zh: {
      label: "通道条",
      title: "推子电平",
      months: ["通道1", "通道2", "通道3", "通道4", "通道5", "通道6", "通道7", "通道8", "通道9", "通道10", "通道11", "通道12"],
      currentMonth: 3,
      tasks: [
        { name: "输入增益", start: 0, width: 25, phase: "Q1", label: "+6dB" },
        { name: "低频 EQ", start: 15, width: 30, phase: "Q2", label: "-3dB" },
        { name: "中频 EQ", start: 35, width: 25, phase: "Q2", label: "+2dB" },
        { name: "压缩", start: 55, width: 25, phase: "Q3", label: "4:1" },
        { name: "混响发送", start: 65, width: 20, phase: "Q3", label: "15%" },
        { name: "主输出", start: 80, width: 20, phase: "Q4", label: "0dB" },
      ],
    },
  },
  3: {
    en: {
      label: "Channel Detail",
      title: "Parameter Tweaks",
      phases: [
        {
          q: "CH 01",
          name: "Input Stage",
          period: "Gain & Trim",
          items: [
            { icon: "🎚️", title: "Preamp Gain", desc: "+6dB pad engaged, phantom power on" },
            { icon: "🔗", title: "Input Routing", desc: "Direct in from stage box, no insert" },
            { icon: "📊", title: "Metering", desc: "Peak hold, VU mode, -18dBFS ref" },
          ],
        },
        {
          q: "CH 02",
          name: "EQ Section",
          period: "4-Band Parametric",
          items: [
            { icon: "⚡", title: "High Shelf", desc: "8kHz, +2dB, gentle Q" },
            { icon: "💾", title: "Mid Parametric", desc: "2.5kHz, -1dB, Q=1.4" },
            { icon: "🎨", title: "Low Cut", desc: "80Hz, 12dB/octave slope" },
          ],
        },
        {
          q: "CH 03",
          name: "Dynamics",
          period: "Compressor & Gate",
          items: [
            { icon: "🚀", title: "Compressor", desc: "4:1 ratio, -20dB threshold, fast attack" },
            { icon: "🤖", title: "Noise Gate", desc: "-40dB threshold, 50ms release" },
            { icon: "📈", title: "Limiter", desc: "Brickwall at -0.3dBFS" },
          ],
        },
        {
          q: "CH 04",
          name: "Output Bus",
          period: "Master & Sends",
          items: [
            { icon: "🎯", title: "Main Out", desc: "Stereo bus, -0.5dB peak, 0dB average" },
            { icon: "📣", title: "Aux Sends", desc: "Reverb 15%, Delay 8%, Headphone mix" },
            { icon: "🏁", title: "Meter Bridge", desc: "All channels green, no clipping" },
          ],
        },
      ],
    },
    zh: {
      label: "通道详情",
      title: "参数微调",
      phases: [
        {
          q: "通道 01",
          name: "输入级",
          period: "增益与微调",
          items: [
            { icon: "🎚️", title: "前置放大增益", desc: "+6dB 衰减启用，幻象电源开启" },
            { icon: "🔗", title: "输入路由", desc: "舞台盒直入，无插入" },
            { icon: "📊", title: "计量", desc: "峰值保持，VU 模式，-18dBFS 参考" },
          ],
        },
        {
          q: "通道 02",
          name: "EQ 段",
          period: "4 段参数均衡",
          items: [
            { icon: "⚡", title: "高频搁架", desc: "8kHz，+2dB，柔和 Q 值" },
            { icon: "💾", title: "中频参数", desc: "2.5kHz，-1dB，Q=1.4" },
            { icon: "🎨", title: "低切", desc: "80Hz，12dB/倍频程斜率" },
          ],
        },
        {
          q: "通道 03",
          name: "动态",
          period: "压缩与门限",
          items: [
            { icon: "🚀", title: "压缩器", desc: "4:1 比率，-20dB 阈值，快速启动" },
            { icon: "🤖", title: "噪声门", desc: "-40dB 阈值，50ms 释放" },
            { icon: "📈", title: "限制器", desc: "砖墙限制在 -0.3dBFS" },
          ],
        },
        {
          q: "通道 04",
          name: "输出总线",
          period: "主输出与发送",
          items: [
            { icon: "🎯", title: "主输出", desc: "立体声总线，-0.5dB 峰值，0dB 平均" },
            { icon: "📣", title: "辅助发送", desc: "混响 15%，延迟 8%，耳机混音" },
            { icon: "🏁", title: "电平表桥", desc: "所有通道绿色，无削波" },
          ],
        },
      ],
    },
  },
  4: {
    en: {
      label: "Signal Flow",
      title: "Routing Path",
      chains: [
        { nodes: [
          { key: "IN", name: "Stage Input" },
          { key: "PRE", name: "Preamp" },
          { key: "EQ", name: "Equalizer" },
          { key: "DYN", name: "Dynamics" },
        ]},
        { nodes: [
          { key: "BUS", name: "Aux Bus" },
          { key: "FX", name: "Effects Send" },
          { key: "RET", name: "Return" },
          { key: "OUT", name: "Master Output" },
        ]},
      ],
    },
    zh: {
      label: "信号流",
      title: "路由路径",
      chains: [
        { nodes: [
          { key: "IN", name: "舞台输入" },
          { key: "PRE", name: "前置放大" },
          { key: "EQ", name: "均衡器" },
          { key: "DYN", name: "动态处理" },
        ]},
        { nodes: [
          { key: "BUS", name: "辅助总线" },
          { key: "FX", name: "效果发送" },
          { key: "RET", name: "返回" },
          { key: "OUT", name: "主输出" },
        ]},
      ],
    },
  },
  5: {
    en: {
      text: "A great mix is <em>every channel in balance</em>.",
      sub: "When each fader is set with intention, the whole sounds greater than the sum of its parts.",
      progress: [
        { val: "GRN", lbl: "Healthy" },
        { val: "YEL", lbl: "Watch" },
        { val: "RED", lbl: "Clipping" },
        { val: "MTR", lbl: "Metered" },
      ],
    },
    zh: {
      text: "好的混音是<em>每个通道都平衡</em>。",
      sub: "当每个推子都用心调好，整体效果胜过各部分之和。",
      progress: [
        { val: "GRN", lbl: "健康" },
        { val: "YEL", lbl: "注意" },
        { val: "RED", lbl: "削波" },
        { val: "MTR", lbl: "已计量" },
      ],
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function phaseBarClass(phase: string) {
  const map: Record<string, string> = {
    Q1: styles.barQ1,
    Q2: styles.barQ2,
    Q3: styles.barQ3,
    Q4: styles.barQ4,
  };
  return map[phase] || styles.barQ1;
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Studio Mixing Console", zh: "录音混音控制台" };
  const themeMap = {
    en: "Deep studio-dark background with metallic hardware-feel panels. Vivid meter colors (green/yellow/red) appear only on fader indicators — never as floods. Compact technical/monospace labels give pro-audio gear feel. Best for parameter tuning, balancing multiple inputs, and showing levels.",
    zh: "深色录音棚背景配金属质感硬件面板。鲜明的电平颜色（绿/黄/红）仅出现在推子指示器上——从不泛滥。紧凑的技术/等宽标签营造专业音频设备感。最适合参数调优、平衡多路输入和显示电平。",
  };
  const densityLabelMap = { en: "Technical", zh: "技术型" };

  const sceneTitles = {
    en: ["Title", "Gantt Overview", "Phase Detail", "Dependencies", "Closing"],
    zh: ["标题", "甘特总览", "阶段详情", "依赖关系", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and meta appear"],
      2: ["Header appears", "Rows 1-3 animate in", "Rows 4-6 animate in"],
      3: ["Phase tabs appear", "Items reveal for active phase"],
      4: ["Title appears", "Dependency chains reveal"],
      5: ["Closing statement and progress appear"],
    },
    zh: {
      1: ["标题和元数据呈现"],
      2: ["标题呈现", "第 1-3 行动画进入", "第 4-6 行动画进入"],
      3: ["阶段标签呈现", "当前阶段项目揭示"],
      4: ["标题呈现", "依赖链揭示"],
      5: ["结语和进度呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleAccent}`;
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const tasks = (c.tasks as Array<{ name: string }>) || [];
          const visible = Math.min(beatIdx * 3, 6);
          beatBody = tasks.slice(0, visible).map((t) => t.name).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const phases = (c.phases as Array<{ name: string }>) || [];
          beatBody = phases.map((p) => p.name).join(" / ");
        }
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          beatBody = lang === "en" ? "Platform → API → Data → ML pipeline chain" : "平台 → API → 数据 → ML 流水线链";
        }
      } else if (id === 5) {
        beatTitle = c.text.replace(/<[^>]+>/g, "");
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "15",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: { bg: "#121212", ink: "#e8e8e8", panel: "#1e1e1e" },
    typography: { header: "JetBrains Mono 500", body: "Inter 400" },
    tags: ["mixing-console", "faders", "metering", "parameter-tuning", "balancing", "studio", "dark", "hardware", "audio", "levels"],
    fonts: ["Inter", "JetBrains Mono"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function Roadmap({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: BespokeStyleProps) {
  useFonts();

    const [entered, setEntered] = useState(false);

  // Beat-level "entered" state for current scene — triggers CSS reveals
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for gantt rows (scene 2) — when new rows appear
  const { ref: ganttRowsRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  // FLIP for phase items (scene 3) — when items in active phase shift
  const { ref: phaseItemsRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const langKey = language as keyof typeof SCENES[1];

    if (sceneNum === 1) {
      const c = SCENES[1][langKey];
      return (
        <div className={styles.scene1}>
          <span className={styles.roadmapLabel}>{c.label}</span>
          <h1 className={styles.roadmapTitle}>
            {c.title} <em>{c.titleAccent}</em>
          </h1>
          <p className={styles.roadmapSub}>{c.sub}</p>
          <div className={styles.roadmapMeta}>
            {c.meta.map((m, i) => (
              <div key={i} className={styles.roadmapMetaItem}>
                <span className={styles.roadmapMetaVal}>{m.val}</span>
                <span className={styles.roadmapMetaLbl}>{m.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sceneNum === 2) {
      const c = SCENES[2][langKey];
      const tasks = c.tasks as Array<{ name: string; start: number; width: number; phase: string; label: string }>;
      const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 3 : 6;
      return (
        <div className={styles.scene2}>
          <div className={styles.ganttHeader}>
            <span className={styles.ganttLabel}>{c.label}</span>
            <h2 className={styles.ganttTitle}>{c.title}</h2>
          </div>
          <div className={styles.ganttChart}>
            <div className={styles.ganttMonths}>
              {c.months.map((m, i) => (
                <span key={i} className={[styles.ganttMonth, i === c.currentMonth ? styles.current : ""].filter(Boolean).join(" ")}>{m}</span>
              ))}
            </div>
            <div ref={sceneNum === scene ? ganttRowsRef : undefined} className={styles.ganttRows}>
              {tasks.map((task, i) => {
                const visible = i < visibleCount;
                const cls = [styles.ganttRow, visible && isEntered ? styles.ganttRowVisible : ""].filter(Boolean).join(" ");
                return (
                  <div
                    key={i}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.08}s` }}
                  >
                    <span className={styles.ganttTaskName}>{task.name}</span>
                    <div className={styles.ganttTrack}>
                      <div
                        className={[styles.ganttBar, phaseBarClass(task.phase)].join(" ")}
                        style={{
                          left: `${task.start}%`,
                          width: `${task.width}%`,
                        }}
                      >
                        <span className={styles.ganttBarLabel}>{task.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      const c = SCENES[3][langKey];
      const phases = c.phases as Array<{ q: string; name: string; period: string; items: Array<{ icon: string; title: string; desc: string }> }>;
      const activePhase = Math.min(beatNum, phases.length - 1);
      const active = phases[activePhase];
      return (
        <div className={styles.scene3}>
          <div className={styles.ganttHeader}>
            <span className={styles.ganttLabel}>{c.label}</span>
            <h2 className={styles.ganttTitle}>{c.title}</h2>
          </div>
          <div className={styles.phaseDetail}>
            <div className={styles.phaseSidebar}>
              {phases.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  className={[styles.phaseTab, i === activePhase ? styles.active : ""].filter(Boolean).join(" ")}
                >
                  <span className={styles.phaseTabQ}>{p.q}</span>
                  {p.name}
                </button>
              ))}
            </div>
            <div className={styles.phaseContent}>
              <div className={styles.phaseHeader}>
                <h3 className={styles.phaseName}>{active.name}</h3>
                <span className={styles.phasePeriod}>{active.period}</span>
              </div>
              <div ref={sceneNum === scene ? phaseItemsRef : undefined} className={styles.phaseItems}>
                {active.items.map((item, ii) => {
                  const visible = true;
                  const cls = [styles.phaseItem, visible && isEntered ? styles.phaseItemVisible : ""].filter(Boolean).join(" ");
                  return (
                    <div
                      key={ii}
                      className={cls}
                      style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${ii * 0.12}s` }}
                    >
                      <div className={styles.phaseItemIcon}>{item.icon}</div>
                      <div className={styles.phaseItemText}>
                        <span className={styles.phaseItemTitle}>{item.title}</span>
                        <span className={styles.phaseItemDesc}>{item.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      const c = SCENES[4][langKey];
      const chains = c.chains as Array<{ nodes: Array<{ key: string; name: string }> }>;
      return (
        <div className={styles.scene4}>
          <div className={styles.ganttHeader}>
            <span className={styles.ganttLabel}>{c.label}</span>
            <h2 className={styles.ganttTitle}>{c.title}</h2>
          </div>
          <div className={styles.depArea}>
            {chains.map((chain, ci) => {
              const visible = true;
              const cls = [styles.depChain, visible && isEntered ? styles.depChainVisible : ""].filter(Boolean).join(" ");
              return (
                <div
                  key={ci}
                  className={cls}
                  style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${ci * 0.2}s` }}
                >
                  {chain.nodes.map((node, ni) => (
                    <React.Fragment key={ni}>
                      <div className={styles.depNode}>
                        <span className={styles.depNodeKey}>{node.key}</span>
                        <span className={styles.depNodeName}>{node.name}</span>
                      </div>
                      {ni < chain.nodes.length - 1 && (
                        <svg className={styles.depArrow} viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M2 8h18M16 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (sceneNum === 5) {
      const c = SCENES[5][langKey];
      return (
        <div className={styles.scene5}>
          <h2 className={styles.closingRoadmap} dangerouslySetInnerHTML={{ __html: c.text }} />
          <p className={styles.closingRoadmapSub}>{c.sub}</p>
          <div className={styles.closingProgress}>
            {c.progress.map((p, i) => (
              <div key={i} className={styles.closingProgItem}>
                <span className={styles.closingProgVal}>{p.val}</span>
                <span className={styles.closingProgLbl}>{p.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.navDots} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[styles.navDot, isActive ? styles.navDotActive : ""].filter(Boolean).join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            />
          );
        })}
      </nav>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
            </div>
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

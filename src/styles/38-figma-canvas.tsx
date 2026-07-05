import React, { useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./38-figma-canvas.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-38-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      title: "Design System v3.0",
      subtitle: "Component library & design tokens",
      frames: [
        { id: "btn-primary", label: "Button / Primary", x: 4, y: 5, w: 22, h: 28, color: "#0d99ff" },
        { id: "card-profile", label: "Card / Profile", x: 30, y: 5, w: 28, h: 35, color: "#a855f7" },
        { id: "nav-sidebar", label: "Navigation / Sidebar", x: 62, y: 5, w: 18, h: 50, color: "#22c55e" },
        { id: "form-input", label: "Form / Input", x: 4, y: 42, w: 22, h: 25, color: "#f97316" },
        { id: "modal-dialog", label: "Modal / Dialog", x: 30, y: 48, w: 28, h: 22, color: "#ec4899" },
      ],
    },
    zh: {
      title: "设计系统 v3.0",
      subtitle: "组件库与设计令牌",
      frames: [
        { id: "btn-primary", label: "按钮 / 主要", x: 4, y: 5, w: 22, h: 28, color: "#0d99ff" },
        { id: "card-profile", label: "卡片 / 资料", x: 30, y: 5, w: 28, h: 35, color: "#a855f7" },
        { id: "nav-sidebar", label: "导航 / 侧边栏", x: 62, y: 5, w: 18, h: 50, color: "#22c55e" },
        { id: "form-input", label: "表单 / 输入", x: 4, y: 42, w: 22, h: 25, color: "#f97316" },
        { id: "modal-dialog", label: "弹窗 / 对话框", x: 30, y: 48, w: 28, h: 22, color: "#ec4899" },
      ],
    },
  },
  2: {
    en: {
      title: "Design Tokens",
      subtitle: "Color, typography, and spacing primitives",
      tokens: [
        { name: "Primary Blue", value: "#0D99FF", category: "Color", color: "#0d99ff" },
        { name: "Success Green", value: "#22C55E", category: "Color", color: "#22c55e" },
        { name: "Warning Orange", value: "#F97316", category: "Color", color: "#f97316" },
        { name: "Error Pink", value: "#EC4899", category: "Color", color: "#ec4899" },
        { name: "Purple Accent", value: "#A855F7", category: "Color", color: "#a855f7" },
        { name: "Neutral Gray", value: "#6B7280", category: "Color", color: "#6b7280" },
      ],
      typography: {
        preview: "Aa",
        fontFamily: "Inter",
        fontSize: "48 / 36 / 24 / 16",
        fontWeight: "800 / 600 / 400",
        lineHeight: "1.1 / 1.3 / 1.5",
        letterSpacing: "-0.02em / 0",
      },
    },
    zh: {
      title: "设计令牌",
      subtitle: "颜色、排版和间距基础",
      tokens: [
        { name: "主色蓝", value: "#0D99FF", category: "颜色", color: "#0d99ff" },
        { name: "成功绿", value: "#22C55E", category: "颜色", color: "#22c55e" },
        { name: "警告橙", value: "#F97316", category: "颜色", color: "#f97316" },
        { name: "错误粉", value: "#EC4899", category: "颜色", color: "#ec4899" },
        { name: "紫色强调", value: "#A855F7", category: "颜色", color: "#a855f7" },
        { name: "中性灰", value: "#6B7280", category: "颜色", color: "#6b7280" },
      ],
      typography: {
        preview: "字",
        fontFamily: "Inter",
        fontSize: "48 / 36 / 24 / 16",
        fontWeight: "800 / 600 / 400",
        lineHeight: "1.1 / 1.3 / 1.5",
        letterSpacing: "-0.02em / 0",
      },
    },
  },
  3: {
    en: {
      title: "User Flow: Onboarding",
      subtitle: "5-step interactive prototype with auto-advance",
      nodes: [
        { id: "start", icon: "🏠", title: "Home Screen", desc: "App launch", x: 5, y: 35, color: "rgba(13,153,255,0.15)" },
        { id: "signup", icon: "📝", title: "Sign Up", desc: "Email or OAuth", x: 28, y: 10, color: "rgba(168,85,247,0.15)" },
        { id: "verify", icon: "✉️", title: "Verify Email", desc: "6-digit code", x: 28, y: 60, color: "rgba(249,115,22,0.15)" },
        { id: "profile", icon: "👤", title: "Setup Profile", desc: "Avatar + bio", x: 52, y: 35, color: "rgba(34,197,94,0.15)" },
        { id: "tutorial", icon: "🎓", title: "Quick Tour", desc: "3-step guide", x: 72, y: 10, color: "rgba(236,72,153,0.15)" },
        { id: "done", icon: "🎉", title: "Dashboard", desc: "All set!", x: 72, y: 60, color: "rgba(13,153,255,0.15)" },
      ],
      connections: [
        { from: "start", to: "signup" },
        { from: "start", to: "verify" },
        { from: "signup", to: "profile" },
        { from: "verify", to: "profile" },
        { from: "profile", to: "tutorial" },
        { from: "profile", to: "done" },
        { from: "tutorial", to: "done" },
      ],
    },
    zh: {
      title: "用户流程：新手引导",
      subtitle: "5 步交互原型，自动推进",
      nodes: [
        { id: "start", icon: "🏠", title: "首页", desc: "应用启动", x: 5, y: 35, color: "rgba(13,153,255,0.15)" },
        { id: "signup", icon: "📝", title: "注册", desc: "邮箱或第三方", x: 28, y: 10, color: "rgba(168,85,247,0.15)" },
        { id: "verify", icon: "✉️", title: "验证邮箱", desc: "6 位验证码", x: 28, y: 60, color: "rgba(249,115,22,0.15)" },
        { id: "profile", icon: "👤", title: "设置资料", desc: "头像 + 简介", x: 52, y: 35, color: "rgba(34,197,94,0.15)" },
        { id: "tutorial", icon: "🎓", title: "快速导览", desc: "3 步指南", x: 72, y: 10, color: "rgba(236,72,153,0.15)" },
        { id: "done", icon: "🎉", title: "仪表盘", desc: "全部完成！", x: 72, y: 60, color: "rgba(13,153,255,0.15)" },
      ],
      connections: [
        { from: "start", to: "signup" },
        { from: "start", to: "verify" },
        { from: "signup", to: "profile" },
        { from: "verify", to: "profile" },
        { from: "profile", to: "tutorial" },
        { from: "profile", to: "done" },
        { from: "tutorial", to: "done" },
      ],
    },
  },
  4: {
    en: {
      frameLabel: "Card / Profile — Selected",
      name: "Sarah Chen",
      role: "Senior Product Designer",
      initial: "S",
      stats: [
        { value: "142", label: "Projects" },
        { value: "8.9K", label: "Followers" },
        { value: "36", label: "Awards" },
      ],
      button: "Follow",
      properties: [
        { label: "X", value: "1240" },
        { label: "Y", value: "320" },
        { label: "W", value: "400" },
        { label: "H", value: "520" },
        { label: "Radius", value: "24" },
        { label: "Opacity", value: "100%" },
      ],
      fills: [
        { color: "#ffffff", label: "Background" },
        { color: "#0d99ff", label: "Accent" },
      ],
      effects: [
        { label: "Shadow", value: "0 4 24 rgba(0,0,0,0.08)" },
        { label: "Blur", value: "None" },
      ],
    },
    zh: {
      frameLabel: "卡片 / 资料卡 — 已选中",
      name: "陈莎拉",
      role: "高级产品设计师",
      initial: "S",
      stats: [
        { value: "142", label: "项目" },
        { value: "8.9K", label: "关注者" },
        { value: "36", label: "获奖" },
      ],
      button: "关注",
      properties: [
        { label: "X", value: "1240" },
        { label: "Y", value: "320" },
        { label: "宽", value: "400" },
        { label: "高", value: "520" },
        { label: "圆角", value: "24" },
        { label: "不透明度", value: "100%" },
      ],
      fills: [
        { color: "#ffffff", label: "背景" },
        { color: "#0d99ff", label: "强调色" },
      ],
      effects: [
        { label: "阴影", value: "0 4 24 rgba(0,0,0,0.08)" },
        { label: "模糊", value: "无" },
      ],
    },
  },
  5: {
    en: {
      badge: "Ready for Handoff",
      title: "Design, documented.",
      sub: "Every component, token, and pattern — organized and ready for development.",
      stats: [
        { value: "128", label: "Components" },
        { value: "64", label: "Tokens" },
        { value: "12", label: "Patterns" },
      ],
    },
    zh: {
      badge: "交付就绪",
      title: "设计，已文档化。",
      sub: "每个组件、令牌和模式——井井有条，随时开发。",
      stats: [
        { value: "128", label: "组件" },
        { value: "64", label: "令牌" },
        { value: "12", label: "模式" },
      ],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Figma Canvas", zh: "Figma 画布" };
  const themeMap = {
    en: "Design System Documentation — Figma-like canvas with frames, bezier connections, and design tokens",
    zh: "设计系统文档——类 Figma 画布，框架、贝塞尔连接线和设计令牌",
  };
  const densityLabelMap = { en: "Canvas-Rich", zh: "画布丰富" };

  const sceneTitles = {
    en: ["Overview", "Tokens", "User Flow", "Detail Frame", "Handoff"],
    zh: ["总览", "令牌", "用户流程", "详情框架", "交付"],
  };

  const beatActions = {
    en: {
      1: ["Canvas renders"],
      2: ["Color tokens appear", "Typography card fills"],
      3: ["Flow nodes connect"],
      4: ["Frame selected", "Inspector populates"],
      5: ["Handoff summary"],
    },
    zh: {
      1: ["画布渲染"],
      2: ["颜色令牌出现", "排版卡片填充"],
      3: ["流程节点连接"],
      4: ["框架选中", "检查器填充"],
      5: ["交付摘要"],
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
        const c2 = c as unknown as { title: string; subtitle: string; tokens: Array<{ name: string; value: string }> };
        beatTitle = c2.title;
        if (beatIdx === 0) {
          beatBody = c2.tokens.slice(0, 3).map((t) => `${t.name}: ${t.value}`).join(" / ");
        } else {
          beatBody = c2.tokens.map((t) => t.name).join(" / ");
        }
      } else if (id === 3) {
        const c3 = c as unknown as { title: string; nodes: Array<{ title: string }> };
        beatTitle = c3.title;
        const visible = c3.nodes.slice(0, (beatIdx + 1) * 2);
        beatBody = visible.map((n) => n.title).join(" -> ");
      } else if (id === 4) {
        const c4 = c as unknown as { frameLabel: string; name: string; properties: Array<{ label: string; value: string }> };
        beatTitle = c4.frameLabel;
        if (beatIdx >= 1) {
          beatBody = c4.properties.map((p) => `${p.label}: ${p.value}`).join(" / ");
        } else {
          beatBody = c4.name;
        }
      } else if (id === 5) {
        const c5 = c as unknown as { title: string; sub: string; stats: Array<{ value: string; label: string }> };
        beatTitle = c5.title;
        beatBody = `${c5.sub} — ${c5.stats.map((s) => `${s.value} ${s.label}`).join(", ")}`;
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
      bg: "#f5f5f5",
      ink: "#2c2c2c",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: [
      "figma",
      "design-system",
      "canvas",
      "frames",
      "tokens",
      "documentation",
      "light",
      "clean",
      "ui",
      "handoff",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Transition constants ───────────────────────────────────────────────────

const TRANSITION_DURATION = 500; // ms — matches zoom/pan animation duration
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function FigmaCanvas({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const [entered, setEntered] = useState(false);
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

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

  // FLIP for canvas design elements
  const { ref: canvasRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".figmaFrame, .flowNode, .tokenCard",
  });

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

  // ── Figma Toolbar (persistent across scenes) ────────────────────────────

  const renderToolbar = () => {
    if (isThumbnail) return null;
    return (
      <div className={styles.figmaToolbar}>
        <div className={styles.toolbarLogo}>
          <div className={styles.logoShapes}>
            <div className={`${styles.logoShape} ${styles.logoShape1}`} />
            <div className={`${styles.logoShape} ${styles.logoShape2}`} />
            <div className={`${styles.logoShape} ${styles.logoShape3}`} />
          </div>
          <span>DesignSys</span>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarTools}>
          {["▢", "○", "↗", "T", "🖌", "💬"].map((tool, i) => (
            <div
              key={i}
              className={`${styles.toolbarTool} ${i === 0 ? styles.toolbarToolActive : ""}`}
            >
              {tool}
            </div>
          ))}
        </div>
        <div className={styles.toolbarZoom}>
          <span>−</span>
          <span>100%</span>
          <span>+</span>
        </div>
      </div>
    );
  };

  // ── Scene 1: Canvas Overview ────────────────────────────────────────────

  const renderScene1 = (isEntered: boolean) => {
    const c = SCENES[1][language];
    const frames = c.frames as Array<{
      id: string; label: string; x: number; y: number; w: number; h: number; color: string;
    }>;
    return (
      <div className={styles.canvasOverview}>
        <h1
          className={styles.canvasTitle}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0)" : "translateY(-1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {c.title}
        </h1>
        <p
          className={styles.canvasSubtitle}
          style={{
            opacity: isEntered ? 0.6 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.1s",
          }}
        >
          {c.subtitle}
        </p>
        <div className={styles.overviewFrames}>
          {frames.map((frame, i) => (
            <div
              key={frame.id}
              className={`${styles.figmaFrame} ${i === 1 ? styles.figmaFrameSelected : ""}`}
              style={{
                left: `${frame.x}cqw`,
                top: `${frame.y}cqh`,
                width: `${frame.w}cqw`,
                height: `${frame.h}cqh`,
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "translateY(0) scale(1)" : "translateY(1.5cqh) scale(0.95)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.4s ease ${0.2 + i * 0.08}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.08}s`,
              }}
            >
              <span
                className={`${styles.frameLabel} ${i === 1 ? styles.frameLabelSelected : ""}`}
              >
                {frame.label}
              </span>
              {/* Frame content mockup */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, ${frame.color}10, ${frame.color}05)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "1cqh",
                  padding: "2cqh",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: "3cqh",
                    background: frame.color,
                    borderRadius: "0.8cqh",
                    opacity: 0.3,
                  }}
                />
                <div
                  style={{
                    width: "80%",
                    height: "1.5cqh",
                    background: "#e5e5e5",
                    borderRadius: "0.4cqh",
                  }}
                />
                <div
                  style={{
                    width: "65%",
                    height: "1.5cqh",
                    background: "#e5e5e5",
                    borderRadius: "0.4cqh",
                  }}
                />
                <div
                  style={{
                    width: "40%",
                    height: "4cqh",
                    background: frame.color,
                    borderRadius: "1cqh",
                    marginTop: "1cqh",
                    opacity: 0.6,
                  }}
                />
              </div>
              {/* Selection handles for selected frame */}
              {i === 1 && (
                <>
                  <div className={styles.selectionHandle} style={{ top: "-0.6cqh", left: "-0.6cqh" }} />
                  <div className={styles.selectionHandle} style={{ top: "-0.6cqh", right: "-0.6cqh" }} />
                  <div className={styles.selectionHandle} style={{ bottom: "-0.6cqh", left: "-0.6cqh" }} />
                  <div className={styles.selectionHandle} style={{ bottom: "-0.6cqh", right: "-0.6cqh" }} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Scene 2: Design Tokens ──────────────────────────────────────────────

  const renderScene2 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[2][language];
    const tokens = c.tokens as Array<{
      name: string; value: string; category: string; color: string;
    }>;
    const typo = c.typography as {
      preview: string; fontFamily: string; fontSize: string; fontWeight: string;
      lineHeight: string; letterSpacing: string;
    };
    return (
      <div className={styles.tokensScene}>
        <h2
          className={styles.tokensTitle}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
          }}
        >
          {c.title}
        </h2>
        <p
          className={styles.tokensSubtitle}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.1s",
          }}
        >
          {c.subtitle}
        </p>
        <div className={styles.tokensGrid}>
          {tokens.map((token, i) => {
            const visible = isEntered;
            return (
              <div
                key={i}
                className={`${styles.tokenCard} ${visible ? styles.tokenCardVisible : ""}`}
                style={{
                  transitionDelay: reducedMotion ? "0s" : `${i * 0.08}s`,
                }}
              >
                <div
                  className={styles.tokenSwatch}
                  style={{ background: token.color }}
                />
                <span className={styles.tokenCategory}>{token.category}</span>
                <h4 className={styles.tokenName}>{token.name}</h4>
                <span className={styles.tokenValue}>{token.value}</span>
              </div>
            );
          })}
          {beatNum >= 1 && (
            <div
              className={styles.typoCard}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "translateY(0)" : "translateY(1cqh)",
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s",
              }}
            >
              <span className={styles.tokenCategory}>Typography</span>
              <div className={styles.typoPreview}>{typo.preview}</div>
              <div className={styles.typoDetails}>
                <div className={styles.typoDetailItem}>
                  <span className={styles.typoDetailLabel}>Family</span>
                  <span className={styles.typoDetailValue}>{typo.fontFamily}</span>
                </div>
                <div className={styles.typoDetailItem}>
                  <span className={styles.typoDetailLabel}>Size</span>
                  <span className={styles.typoDetailValue}>{typo.fontSize}</span>
                </div>
                <div className={styles.typoDetailItem}>
                  <span className={styles.typoDetailLabel}>Weight</span>
                  <span className={styles.typoDetailValue}>{typo.fontWeight}</span>
                </div>
                <div className={styles.typoDetailItem}>
                  <span className={styles.typoDetailLabel}>Line</span>
                  <span className={styles.typoDetailValue}>{typo.lineHeight}</span>
                </div>
                <div className={styles.typoDetailItem}>
                  <span className={styles.typoDetailLabel}>Tracking</span>
                  <span className={styles.typoDetailValue}>{typo.letterSpacing}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Scene 3: Component Flow ─────────────────────────────────────────────

  const renderScene3 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[3][language];
    const nodes = c.nodes as Array<{
      id: string; icon: string; title: string; desc: string; x: number; y: number; color: string;
    }>;
    const connections = c.connections as Array<{ from: string; to: string }>;

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    return (
      <div className={styles.flowScene}>
        <h2
          className={styles.flowTitle}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
          }}
        >
          {c.title}
        </h2>
        <p
          className={styles.flowSubtitle}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.1s",
          }}
        >
          {c.subtitle}
        </p>
        <div className={styles.flowCanvas}>
          {/* SVG connection lines */}
          <svg
            className={styles.flowConnections}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
          >
            {connections.map((conn, i) => {
              const from = nodeMap.get(conn.from);
              const to = nodeMap.get(conn.to);
              if (!from || !to) return null;
              const x1 = from.x + 7;
              const y1 = from.y + 8;
              const x2 = to.x + 7;
              const y2 = to.y + 8;
              const mx = (x1 + x2) / 2;
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#0d99ff"
                  strokeWidth="0.3"
                  strokeDasharray="1.5 0.8"
                  opacity={isEntered && beatNum >= 1 ? 0.5 : 0}
                  style={{
                    transition: reducedMotion ? "none" : "opacity 0.5s ease 0.4s",
                  }}
                />
              );
            })}
          </svg>
          {/* Flow nodes */}
          {nodes.map((node, i) => {
            const nodeVisible = isEntered && i <= beatNum * 2 + 1;
            return (
              <div
                key={node.id}
                className={`${styles.flowNode} ${nodeVisible ? styles.flowNodeVisible : ""}`}
                style={{
                  left: `${node.x}cqw`,
                  top: `${node.y}cqh`,
                  transitionDelay: reducedMotion ? "0s" : `${i * 0.1}s`,
                }}
              >
                <div
                  className={styles.flowNodeIcon}
                  style={{ background: node.color }}
                >
                  {node.icon}
                </div>
                <span className={styles.flowNodeTitle}>{node.title}</span>
                <span className={styles.flowNodeDesc}>{node.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Scene 4: Detail Frame + Inspector ───────────────────────────────────

  const renderScene4 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[4][language];
    return (
      <div className={styles.detailScene}>
        <div
          className={styles.detailMainFrame}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "scale(1)" : "scale(0.97)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span className={styles.detailFrameLabel}>{c.frameLabel}</span>
          <div className={styles.frameMockup}>
            <div className={styles.mockupHeader}>
              <div className={styles.mockupAvatar}>{c.initial}</div>
              <div className={styles.mockupHeaderInfo}>
                <h3 className={styles.mockupName}>{c.name}</h3>
                <p className={styles.mockupRole}>{c.role}</p>
              </div>
            </div>
            <div className={styles.mockupStats}>
              {c.stats.map((stat, i) => (
                <div key={i} className={styles.mockupStat}>
                  <span className={styles.mockupStatValue}>{stat.value}</span>
                  <span className={styles.mockupStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
            <button className={styles.mockupButton}>{c.button}</button>
          </div>
          {/* Selection handles */}
          <div className={styles.selectionHandle} style={{ top: "-0.7cqh", left: "-0.7cqh" }} />
          <div className={styles.selectionHandle} style={{ top: "-0.7cqh", right: "-0.7cqh" }} />
          <div className={styles.selectionHandle} style={{ bottom: "-0.7cqh", left: "-0.7cqh" }} />
          <div className={styles.selectionHandle} style={{ bottom: "-0.7cqh", right: "-0.7cqh" }} />
        </div>

        {beatNum >= 1 && (
          <div
            className={styles.detailSidebar}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "translateX(0)" : "translateX(2cqw)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
            }}
          >
            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarSectionTitle}>
                {language === "zh" ? "位置与尺寸" : "Position & Size"}
              </h4>
              {c.properties.map((prop, i) => (
                <div key={i} className={styles.sidebarRow}>
                  <span className={styles.sidebarLabel}>{prop.label}</span>
                  <span className={styles.sidebarValue}>{prop.value}</span>
                </div>
              ))}
            </div>
            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarSectionTitle}>
                {language === "zh" ? "填充" : "Fill"}
              </h4>
              {c.fills.map((fill, i) => (
                <div key={i} className={styles.sidebarColorRow}>
                  <div
                    className={styles.sidebarColorSwatch}
                    style={{ background: fill.color }}
                  />
                  <span style={{ fontSize: "1.6cqh" }}>{fill.label}</span>
                  <span
                    className={styles.sidebarValue}
                    style={{ marginLeft: "auto" }}
                  >
                    {fill.color}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarSectionTitle}>
                {language === "zh" ? "效果" : "Effects"}
              </h4>
              {c.effects.map((eff, i) => (
                <div key={i} className={styles.sidebarRow}>
                  <span className={styles.sidebarLabel}>{eff.label}</span>
                  <span className={styles.sidebarValue}>{eff.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Scene 5: Handoff / Closing ──────────────────────────────────────────

  const renderScene5 = (isEntered: boolean) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.handoffScene}>
        <span
          className={styles.handoffBadge}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0)" : "translateY(-1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          ✓ {c.badge}
        </span>
        <h1
          className={styles.handoffTitle}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0)" : "translateY(1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          {c.title}
        </h1>
        <p
          className={styles.handoffSub}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.3s",
          }}
        >
          {c.sub}
        </p>
        <div
          className={styles.handoffStats}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.4s",
          }}
        >
          {c.stats.map((stat, i) => (
            <div key={i} className={styles.handoffStat}>
              <span
                className={styles.handoffStatValue}
                style={{
                  color: ["#0d99ff", "#a855f7", "#22c55e"][i],
                }}
              >
                {stat.value}
              </span>
              <span className={styles.handoffStatLabel}>{stat.label}</span>
            </div>
          ))}
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

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClasses}>
      {/* Persistent toolbar (outside scene layers so it doesn't animate) */}
      {renderToolbar()}

      {/* Outgoing scene (exit animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.canvasArea}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div ref={canvasRef} className={styles.canvasArea}>
          {renderSceneFor(scene, beat, entered)}
        </div>
      </div>

      {renderNavIndicators()}
    </div>
  );
}

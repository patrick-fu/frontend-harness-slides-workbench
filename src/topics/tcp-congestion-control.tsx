import React from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack, {
  type SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";

type Lang = "en" | "zh";

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "motion",
  4: "reserved",
  5: "reserved",
} satisfies Record<number, "motion" | "reserved">;

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "linear-wipe",
  "2->3": "zoom-through",
  "3->4": "dolly-pull",
  "4->5": "crossfade",
  "5->4": "crossfade",
  "4->3": "dolly-pull",
  "3->2": "zoom-through",
  "2->1": "linear-wipe",
};

const TCP_TRANSITION_SCORE = {
  "1->2": "linear-wipe",
  "2->3": "zoom-through",
  "3->4": "dolly-pull",
  "4->5": "crossfade",
} as const satisfies TopicTransitionScore;

export const TCP_CONGESTION_CONTROL_SOURCES = [
  {
    authority: "IETF",
    title: "RFC 9293: Transmission Control Protocol (TCP)",
    url: "https://www.rfc-editor.org/rfc/rfc9293.html",
    supports:
      "TCP connection establishment, sequence and acknowledgment numbers, reliable ordered delivery, receive-window flow control, and graceful close.",
  },
  {
    authority: "IETF",
    title: "RFC 5681: TCP Congestion Control",
    url: "https://www.rfc-editor.org/rfc/rfc5681.html",
    supports:
      "The congestion window, slow start, congestion avoidance, multiplicative decrease after congestion signals, and additive growth behavior.",
  },
] as const;

const COPY = {
  en: {
    name: "Engineering Whiteboard Explainer",
    theme:
      "An emoji-driven engineering whiteboard that turns TCP handshake and congestion control into a visual story with packets flying, windows sliding, and a roller-coaster cwnd curve.",
    density: "Explainer",
    title: "TCP Handshake & Congestion Control",
    subtitle:
      "How two machines find each other on an unreliable network — and keep the internet fair.",
    lane: "Takeaway",
    scenes: [
      {
        title: "The unreliable network",
        beats: [
          {
            action: "Show two endpoints",
            title: "Two machines want to talk — but the network lies",
            body: "A laptop and a server, separated by a chaotic internet.",
          },
          {
            action: "Demonstrate IP failures",
            title: "IP promises only one thing: it promises nothing",
            body: "Packets get lost, reordered, and duplicated. No guarantees.",
          },
        ],
      },
      {
        title: "Three-way handshake",
        beats: [
          {
            action: "Send SYN",
            title: "SYN — \"Can you hear me?\"",
            body: "Client initiates with a sequence number x.",
          },
          {
            action: "Send SYN-ACK",
            title: "SYN-ACK — \"Loud and clear. Can you hear me?\"",
            body: "Server acknowledges x+1 and sends its own sequence y.",
          },
          {
            action: "Send ACK + connect",
            title: "ACK — \"Got it. Let's talk.\"",
            body: "Both sides confirm each other's send and receive capability.",
          },
        ],
      },
      {
        title: "Sliding window",
        beats: [
          {
            action: "Show sender window",
            title: "A window of 4 packets is ready to fly",
            body: "Sender buffer holds 8; the window says \"send these 4 now.\"",
          },
          {
            action: "Transmit + receive ACKs",
            title: "Packets fly, acknowledgments return",
            body: "Each ACK tells the sender \"I received up to here.\"",
          },
          {
            action: "Window slides right",
            title: "The receiver decides the pace — the sender follows",
            body: "Receiver advertises rwnd=6. Flow control is receiver-driven.",
          },
        ],
      },
      {
        title: "Congestion control",
        beats: [
          {
            action: "Slow start phase",
            title: "Slow start: hit the gas, double every RTT",
            body: "cwnd grows exponentially — we don't know the pipe's capacity yet.",
          },
          {
            action: "Packet loss event",
            title: "Loss! The network is sending a signal",
            body: "A dropped packet means the bottleneck is full. Time to back off.",
          },
          {
            action: "AIMD phase",
            title: "Probe the limit, then gracefully retreat",
            body: "cwnd halves instantly (MD), then climbs one packet per RTT (AI).",
          },
          {
            action: "Steady-state sawtooth",
            title: "The sawtooth is why the internet works",
            body: "AIMD converges to fairness. Every flow gets a fair share of the pipe.",
          },
        ],
      },
      {
        title: "The full picture",
        beats: [
          {
            action: "Lifecycle timeline",
            title: "From SYN to FIN — a complete TCP conversation",
            body: "Handshake, data transfer, congestion control, graceful close.",
          },
          {
            action: "Final takeaway",
            title: "TCP doesn't make the network fast — it makes it usable on top of unreliability",
            body: "Reliability, ordering, flow control, and fairness — all invented in software.",
          },
        ],
      },
    ],
    tags: ["tcp", "networking", "handshake", "congestion-control", "sliding-window"],
    finalTakeaway:
      "TCP doesn't make the network fast — it makes it usable on top of unreliability.",
  },
  zh: {
    name: "工程讲解白板",
    theme:
      "用 emoji 驱动的工程白板，把 TCP 握手和拥塞控制讲成一个看得见的故事：飞包、滑窗、过山车般的 cwnd 曲线。",
    density: "讲解型",
    title: "TCP 握手与拥塞控制",
    subtitle: "两台机器如何在不可靠的网络上找到彼此——并让互联网保持公平。",
    lane: "结论",
    scenes: [
      {
        title: "不可靠的网络",
        beats: [
          {
            action: "展示两端",
            title: "两台机器想说话——但网络在撒谎",
            body: "一台笔记本和一台服务器，被混乱的互联网隔开。",
          },
          {
            action: "演示 IP 的失败模式",
            title: "IP 保证的只有一件事：不保证任何事",
            body: "包会丢、会乱序、会重复。没有任何承诺。",
          },
        ],
      },
      {
        title: "三次握手",
        beats: [
          {
            action: "发 SYN",
            title: "SYN——\"你能听到我吗？\"",
            body: "客户端发起连接，带上初始序列号 x。",
          },
          {
            action: "发 SYN-ACK",
            title: "SYN-ACK——\"听到了，你能听到我吗？\"",
            body: "服务器确认 x+1，并发送自己的序列号 y。",
          },
          {
            action: "发 ACK + 连接建立",
            title: "ACK——\"收到了，开始说话吧。\"",
            body: "双方都确认了对方的收发能力。",
          },
        ],
      },
      {
        title: "滑动窗口",
        beats: [
          {
            action: "展示发送窗口",
            title: "一个窗口装着 4 个包，准备起飞",
            body: "发送缓冲区有 8 个包，窗口说\"现在发这 4 个。\"",
          },
          {
            action: "传输 + 收到 ACK",
            title: "包飞出去，确认飞回来",
            body: "每个 ACK 告诉发送方\"我收到这里了。\"",
          },
          {
            action: "窗口右滑",
            title: "接收方说了算，发送方跟着走",
            body: "接收方通告 rwnd=6。流量控制是接收方驱动的。",
          },
        ],
      },
      {
        title: "拥塞控制",
        beats: [
          {
            action: "慢启动阶段",
            title: "慢启动：踩死油门，每个 RTT 翻倍",
            body: "cwnd 指数增长——我们还不知道管道能装多少。",
          },
          {
            action: "丢包事件",
            title: "丢包！网络在发信号",
            body: "一个包掉了，说明瓶颈已满。该退了。",
          },
          {
            action: "AIMD 阶段",
            title: "先试探极限，再优雅退让",
            body: "cwnd 瞬间减半（MD），然后每个 RTT 涨一个包（AI）。",
          },
          {
            action: "稳态锯齿波",
            title: "这道锯齿波，就是互联网能跑的原因",
            body: "AIMD 收敛于公平。每条流都能分到管道的合理份额。",
          },
        ],
      },
      {
        title: "完整生命周期",
        beats: [
          {
            action: "生命周期时间线",
            title: "从 SYN 到 FIN——一次完整的 TCP 对话",
            body: "握手、数据传输、拥塞控制、优雅关闭。",
          },
          {
            action: "终极总结",
            title: "TCP 不是让网络变快，而是让网络在不可靠之上变得可用",
            body: "可靠、有序、流量控制、公平——全是软件发明出来的。",
          },
        ],
      },
    ],
    tags: ["tcp", "网络", "握手", "拥塞控制", "滑动窗口"],
    finalTakeaway: "TCP 不是让网络变快，而是让网络在不可靠之上变得可用。",
  },
} as const;

const sceneTitles = (lang: Lang) =>
  COPY[lang].scenes.map((scene, index) => ({
    id: index + 1,
    title: scene.title,
    beats: scene.beats.map((beat, beatIndex) => ({
      id: beatIndex,
      action: beat.action,
      title: beat.title,
      body: beat.body,
    })),
  }));

const HANDWRITTEN_EN = "Caveat, cursive";
const HANDWRITTEN_ZH = '"Ma Shan Zheng", "LXGW WenKai", cursive';
const TITLE_EN = '"Space Grotesk", "Inter", sans-serif';
const TITLE_ZH = '"LXGW WenKai", "Noto Sans SC", sans-serif';
const BODY = '"Inter", "Noto Sans SC", system-ui, sans-serif';

function handFont(lang: Lang): string {
  return lang === "zh" ? HANDWRITTEN_ZH : HANDWRITTEN_EN;
}

function titleFont(lang: Lang): string {
  return lang === "zh" ? TITLE_ZH : TITLE_EN;
}

function buildMetadata(lang: Lang): TopicMetadata {
  const copy = COPY[lang];
  return {
    theme: copy.theme,
    densityLabel: copy.density,
    heroScene: 4,
    colors: { bg: "#fbfcff", ink: "#20242a", panel: "#ffffff" },
    typography: {
      header: "Space Grotesk 700 / LXGW WenKai 700",
      body: "Inter 400",
    },
    tags: [
      "engineering",
      "whiteboard",
      "explainer",
      "networking",
      "tcp",
      "developer-education",
      ...copy.tags,
    ],
    fonts: ["Inter", "JetBrains Mono", "cjk:LXGW WenKai", "Caveat", "cjk:Ma Shan Zheng", "Space Grotesk"],
    scenes: sceneTitles(lang),
  };
}

function showAt(beat: number, threshold: number) {
  return beat >= threshold;
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "0.7cqw",
        padding: "0.35cqh 0.7cqw",
        background: `${color}18`,
        border: `0.12cqw solid ${color}`,
        color: "#20242a",
        fontFamily: "JetBrains Mono, ui-monospace, monospace",
        fontSize: "0.95cqw",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function Takeaway({ text, label, lang }: { text: string; label: string; lang: Lang }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "5cqw",
        right: "5cqw",
        bottom: "4.5cqh",
        minHeight: "8.2cqh",
        borderTop: "0.18cqw solid #cfd7e1",
        display: "flex",
        alignItems: "center",
        gap: "1.4cqw",
        color: "#20242a",
      }}
    >
      <Badge color="#f6c945">{label}</Badge>
      <div
        style={{
          fontFamily: handFont(lang),
          fontSize: "3cqw",
          fontWeight: 700,
          lineHeight: 1.15,
          background: "linear-gradient(transparent 62%, #ffe580 62%)",
          fontStyle: lang === "zh" ? "normal" : "normal",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function Header({
  sceneTitle,
  copy,
  lang,
}: {
  sceneTitle: string;
  copy: (typeof COPY)[Lang];
  lang: Lang;
}) {
  return (
    <header
      style={{
        position: "absolute",
        top: "4.6cqh",
        left: "5cqw",
        right: "5cqw",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "2cqw",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: "0.95cqw",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#94a3b8",
              textTransform: "uppercase",
              marginBottom: "0.8cqh",
            }}
          >
            {sceneTitle}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: titleFont(lang),
              fontSize: "4.8cqw",
              fontWeight: 700,
              lineHeight: 0.95,
              color: "#1a1f2e",
              letterSpacing: lang === "zh" ? "0.02em" : "-0.02em",
            }}
          >
            {copy.title}
          </h1>
        </div>
        <div
          style={{
            width: "28cqw",
            fontSize: "1.2cqw",
            lineHeight: 1.4,
            color: "#64748b",
            fontFamily: BODY,
            fontWeight: 400,
            paddingBottom: "0.5cqh",
          }}
        >
          {copy.subtitle}
        </div>
      </div>
    </header>
  );
}

/* ─── Scene 1: Unreliable Network ─── */

function SceneOne({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const showChaos = showAt(beat, 1);
  return (
    <>
      <Header sceneTitle={copy.scenes[0].title} copy={copy} lang={lang} />
      <main
        style={{
          position: "absolute",
          left: "5cqw",
          right: "5cqw",
          top: "26cqh",
          bottom: "16cqh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: laptop */}
        <div
          data-beat-layout-item="true"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5cqh",
          }}
        >
          <div style={{ fontSize: "7cqw", lineHeight: 1 }}>💻</div>
          <Badge color="#4b8fe8">CLIENT</Badge>
        </div>

        {/* Middle: network chaos */}
        <div
          style={{
            flex: 1,
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Globe label */}
          <div
            style={{
              position: "absolute",
              top: "2cqh",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "2.5cqw",
              opacity: 0.6,
            }}
          >
            🌐
          </div>

          {/* Dotted line baseline */}
          <svg
            viewBox="0 0 400 40"
            style={{
              position: "absolute",
              width: "100%",
              height: "4cqh",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.3,
            }}
          >
            <line
              x1="0"
              y1="20"
              x2="400"
              y2="20"
              stroke="#4b8fe8"
              strokeWidth="3"
              strokeDasharray="10 12"
            />
          </svg>

          {/* Flying packets (beat 1+) */}
          {showChaos && (
            <>
              {/* Packet 1 — arrives safely */}
              <div
                style={{
                  position: "absolute",
                  fontSize: "3cqw",
                  left: "15%",
                  top: "35%",
                  opacity: 0.9,
                  animation: "none",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                📦
              </div>
              {/* Packet 2 — falls into hole */}
              <div
                style={{
                  position: "absolute",
                  fontSize: "2.5cqw",
                  left: "35%",
                  top: "65%",
                  opacity: 0.7,
                }}
              >
                📦
              </div>
              <div
                style={{
                  position: "absolute",
                  fontSize: "3.5cqw",
                  left: "33%",
                  top: "72%",
                  opacity: 0.8,
                }}
              >
                🕳️
              </div>
              {/* Packet 3 — hits cloud */}
              <div
                style={{
                  position: "absolute",
                  fontSize: "2.5cqw",
                  left: "55%",
                  top: "20%",
                  opacity: 0.7,
                }}
              >
                📦
              </div>
              <div
                style={{
                  position: "absolute",
                  fontSize: "4cqw",
                  left: "52%",
                  top: "8%",
                  opacity: 0.6,
                }}
              >
                ☁️
              </div>
              {/* Duplicate packets */}
              <div
                style={{
                  position: "absolute",
                  fontSize: "2.5cqw",
                  left: "72%",
                  top: "40%",
                  opacity: 0.85,
                }}
              >
                📦
              </div>
              <div
                style={{
                  position: "absolute",
                  fontSize: "2.5cqw",
                  left: "75%",
                  top: "50%",
                  opacity: 0.7,
                }}
              >
                📦
              </div>

              {/* Labels */}
              <div
                style={{
                  position: "absolute",
                  top: "8%",
                  left: "26%",
                  fontFamily: handFont(lang),
                  fontSize: "1.8cqw",
                  color: "#d8514e",
                  fontWeight: 700,
                  transform: "rotate(-4deg)",
                }}
              >
                {lang === "zh" ? "丢包！" : "Lost!"}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "-2%",
                  left: "56%",
                  fontFamily: handFont(lang),
                  fontSize: "1.8cqw",
                  color: "#d8514e",
                  fontWeight: 700,
                  transform: "rotate(3deg)",
                }}
              >
                {lang === "zh" ? "乱序" : "Reordered"}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "56%",
                  left: "78%",
                  fontFamily: handFont(lang),
                  fontSize: "1.8cqw",
                  color: "#d8514e",
                  fontWeight: 700,
                  transform: "rotate(-2deg)",
                }}
              >
                {lang === "zh" ? "重复" : "Duplicate"}
              </div>
            </>
          )}
        </div>

        {/* Right: server */}
        <div
          data-beat-layout-item="true"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5cqh",
          }}
        >
          <div style={{ fontSize: "7cqw", lineHeight: 1 }}>🗄️</div>
          <Badge color="#7b61ff">SERVER</Badge>
        </div>
      </main>
      <Takeaway
        text={copy.scenes[0].beats[Math.min(beat, 1)].title}
        label={copy.lane}
        lang={lang}
      />
    </>
  );
}

/* ─── Scene 2: Three-Way Handshake ─── */

function SceneTwo({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  return (
    <>
      <Header sceneTitle={copy.scenes[1].title} copy={copy} lang={lang} />
      <main
        style={{
          position: "absolute",
          left: "8cqw",
          right: "8cqw",
          top: "25cqh",
          bottom: "16cqh",
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          alignItems: "center",
        }}
      >
        {/* Client radio */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5cqh",
          }}
        >
          <div style={{ fontSize: "6cqw", lineHeight: 1 }}>📡</div>
          <Badge color="#4b8fe8">CLIENT</Badge>
          {/* SYN bubble */}
          <div
            data-beat-layout-item="true"
            style={{
              opacity: showAt(beat, 0) ? 1 : 0,
              transform: showAt(beat, 0) ? "translateY(0)" : "translateY(1cqh)",
              transition: "all 0.4s ease",
              fontSize: "1.5cqw",
              background: "#eef4ff",
              border: "0.12cqw solid #4b8fe8",
              borderRadius: "1cqw",
              padding: "0.8cqh 1cqw",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontWeight: 700,
              color: "#1a56db",
              whiteSpace: "nowrap",
            }}
          >
            SYN seq=x
          </div>
          {/* ACK bubble */}
          <div
            data-beat-layout-item="true"
            style={{
              opacity: showAt(beat, 2) ? 1 : 0,
              transform: showAt(beat, 2) ? "translateY(0)" : "translateY(1cqh)",
              transition: "all 0.4s ease",
              fontSize: "1.5cqw",
              background: "#eef4ff",
              border: "0.12cqw solid #4b8fe8",
              borderRadius: "1cqw",
              padding: "0.8cqh 1cqw",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontWeight: 700,
              color: "#1a56db",
              whiteSpace: "nowrap",
            }}
          >
            ACK ack=y+1
          </div>
        </div>

        {/* Middle: timeline + handshake icon */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Vertical dashed axis */}
          <svg
            viewBox="0 0 20 300"
            style={{
              position: "absolute",
              width: "1cqw",
              height: "100%",
              opacity: 0.2,
            }}
          >
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="300"
              stroke="#20242a"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Beat 1: SYN arrow */}
          <div
            data-beat-layout-item="true"
            style={{
              position: "absolute",
              top: "10%",
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              opacity: showAt(beat, 0) ? 1 : 0,
              transform: showAt(beat, 0) ? "translateX(0)" : "translateX(-2cqw)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg viewBox="0 0 200 24" style={{ width: "100%", height: "3cqh" }}>
              <path
                d="M10 12 L186 12"
                fill="none"
                stroke="#4b8fe8"
                strokeWidth="3"
                strokeLinecap="round"
                markerEnd="url(#arrow-blue)"
              />
              <defs>
                <marker
                  id="arrow-blue"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0 0 L10 5 L0 10 Z" fill="#4b8fe8" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Beat 2: SYN-ACK arrow */}
          <div
            data-beat-layout-item="true"
            style={{
              position: "absolute",
              top: "40%",
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              opacity: showAt(beat, 1) ? 1 : 0,
              transform: showAt(beat, 1) ? "translateX(0)" : "translateX(2cqw)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg viewBox="0 0 200 24" style={{ width: "100%", height: "3cqh" }}>
              <path
                d="M190 12 L14 12"
                fill="none"
                stroke="#7b61ff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon points="14,12 24,6 24,18" fill="#7b61ff" />
            </svg>
          </div>

          {/* Beat 3: ACK arrow */}
          <div
            data-beat-layout-item="true"
            style={{
              position: "absolute",
              top: "68%",
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              opacity: showAt(beat, 2) ? 1 : 0,
              transform: showAt(beat, 2) ? "translateX(0)" : "translateX(-2cqw)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg viewBox="0 0 200 24" style={{ width: "100%", height: "3cqh" }}>
              <path
                d="M10 12 L186 12"
                fill="none"
                stroke="#24a66a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon points="186,12 176,6 176,18" fill="#24a66a" />
            </svg>
          </div>

          {/* Handshake emoji (beat 3) */}
          <div
            data-beat-layout-item="true"
            style={{
              position: "absolute",
              bottom: "5%",
              fontSize: "5cqw",
              opacity: showAt(beat, 2) ? 1 : 0,
              transform: showAt(beat, 2) ? "scale(1)" : "scale(0.5)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: showAt(beat, 2)
                ? "drop-shadow(0 0 1.5cqw rgba(36,166,106,0.5))"
                : "none",
            }}
          >
            🤝
          </div>

          {/* Connection badge (beat 3) */}
          {showAt(beat, 2) && (
            <div
              style={{
                position: "absolute",
                bottom: "0%",
                transform: "translateY(100%)",
                marginTop: "1cqh",
              }}
            >
              <Badge color="#24a66a">
                {lang === "zh" ? "连接已建立" : "Connected"}
              </Badge>
            </div>
          )}
        </div>

        {/* Server radio */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5cqh",
          }}
        >
          <div style={{ fontSize: "6cqw", lineHeight: 1 }}>📡</div>
          <Badge color="#7b61ff">SERVER</Badge>
          {/* SYN-ACK bubble */}
          <div
            data-beat-layout-item="true"
            style={{
              opacity: showAt(beat, 1) ? 1 : 0,
              transform: showAt(beat, 1) ? "translateY(0)" : "translateY(1cqh)",
              transition: "all 0.4s ease",
              fontSize: "1.3cqw",
              background: "#f3efff",
              border: "0.12cqw solid #7b61ff",
              borderRadius: "1cqw",
              padding: "0.8cqh 1cqw",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontWeight: 700,
              color: "#5b42c8",
              whiteSpace: "nowrap",
            }}
          >
            SYN+ACK seq=y ack=x+1
          </div>
        </div>
      </main>
      <Takeaway
        text={copy.scenes[1].beats[Math.min(beat, 2)].title}
        label={copy.lane}
        lang={lang}
      />
    </>
  );
}

/* ─── Scene 3: Sliding Window ─── */

const PACKET_EMOJIS = ["📦", "📦", "📦", "📦", "📦", "📦", "📦", "📦"] as const;

function SceneThree({
  lang,
  beat,
  reducedMotion,
}: {
  lang: Lang;
  beat: number;
  reducedMotion: boolean;
}) {
  const copy = COPY[lang];
  const { ref: windowRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 500,
    disabled: reducedMotion,
  });

  // Window position: 0 at beat 0, slides right at beat 2
  const windowStart = beat >= 2 ? 3 : 0;
  const windowSize = 4;
  const ackedCount = beat >= 1 ? Math.min(beat + 1, 4) : 0;

  return (
    <>
      <Header sceneTitle={copy.scenes[2].title} copy={copy} lang={lang} />
      <main
        style={{
          position: "absolute",
          left: "5cqw",
          right: "5cqw",
          top: "25cqh",
          bottom: "16cqh",
          display: "flex",
          flexDirection: "column",
          gap: "3cqh",
        }}
      >
        {/* Sender buffer + window */}
        <div style={{ display: "flex", alignItems: "center", gap: "2cqw" }}>
          <Badge color="#4b8fe8">
            {lang === "zh" ? "发送方" : "Sender"}
          </Badge>
          <div
            ref={windowRef}
            data-beat-layout-item="true"
            style={{
              position: "relative",
              display: "flex",
              gap: "0.6cqw",
              padding: "1.2cqh 1cqw",
              background: "#f0f4fa",
              borderRadius: "1cqw",
              border: "0.12cqw solid #cfd7e1",
            }}
          >
            {/* Handwritten window annotation */}
            <div
              style={{
                position: "absolute",
                top: "-2.8cqh",
                left: `${windowStart * 5.6 + 4}cqw`,
                fontFamily: handFont(lang),
                fontSize: "1.6cqw",
                color: "#2779d8",
                fontWeight: 700,
                transform: "rotate(-3deg)",
                whiteSpace: "nowrap",
                transition: "left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              {lang === "zh" ? "↙ 发这几个！" : "↙ Send these!"}
            </div>
            {/* Window highlight frame */}
            <div
              style={{
                position: "absolute",
                top: "0.4cqh",
                bottom: "0.4cqh",
                left: `${windowStart * 5.6 + 0.5}cqw`,
                width: `${windowSize * 5.6}cqw`,
                border: "0.2cqw solid #2779d8",
                borderRadius: "0.8cqw",
                background: "rgba(39,121,216,0.08)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            {PACKET_EMOJIS.map((emoji, i) => {
              const inWindow = i >= windowStart && i < windowStart + windowSize;
              const sent = i < ackedCount;
              return (
                <div
                  key={i}
                  data-flip-id={`pkt-${i}`}
                  style={{
                    width: "5cqw",
                    height: "7cqh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.8cqw",
                    background: sent ? "#e6f7ee" : inWindow ? "#fff" : "#f7f9fc",
                    border: `0.12cqw solid ${sent ? "#24a66a" : inWindow ? "#2779d8" : "#d7dde5"}`,
                    opacity: sent ? 0.5 : 1,
                    transition: "all 0.4s ease",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <span style={{ fontSize: "2.8cqw" }}>{emoji}</span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, ui-monospace, monospace",
                      fontSize: "0.85cqw",
                      fontWeight: 700,
                      color: sent ? "#24a66a" : "#6b7280",
                      marginTop: "0.3cqh",
                    }}
                  >
                    {i + 1}
                  </span>
                  {sent && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-0.8cqh",
                        right: "-0.5cqw",
                        fontSize: "1.5cqw",
                      }}
                    >
                      ✅
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: "1cqw",
              color: "#2779d8",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            cwnd={windowSize}
          </div>
        </div>

        {/* Network channel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1cqw",
            height: "6cqh",
            position: "relative",
          }}
        >
          {beat >= 1 && (
            <>
              <div style={{ fontSize: "3cqw" }}>💨</div>
              <div
                style={{
                  flex: 1,
                  height: "0.6cqh",
                  background:
                    "linear-gradient(90deg, #2779d8 0%, #4b8fe8 50%, #2779d8 100%)",
                  borderRadius: "1cqh",
                  opacity: 0.4,
                  position: "relative",
                }}
              >
                {/* Flying packets on the wire */}
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      top: "-1.5cqh",
                      left: `${20 + idx * 25}%`,
                      fontSize: "2cqw",
                      opacity: beat >= 1 ? 0.85 : 0,
                      transform: `translateY(${beat >= 1 ? 0 : 1}cqh)`,
                      transition: `all 0.4s ease ${idx * 0.1}s`,
                    }}
                  >
                    📦
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "3cqw", transform: "scaleX(-1)" }}>💨</div>
            </>
          )}
        </div>

        {/* Receiver buffer */}
        <div style={{ display: "flex", alignItems: "center", gap: "2cqw" }}>
          <Badge color="#24a66a">
            {lang === "zh" ? "接收方" : "Receiver"}
          </Badge>
          <div
            style={{
              display: "flex",
              gap: "0.6cqw",
              padding: "1.2cqh 1cqw",
              background: "#f0faf4",
              borderRadius: "1cqw",
              border: "0.12cqw solid #b8e0c8",
              minWidth: "30cqw",
            }}
          >
            {PACKET_EMOJIS.slice(0, 6).map((emoji, i) => {
              const received = i < ackedCount;
              return (
                <div
                  key={i}
                  style={{
                    width: "4.5cqw",
                    height: "6.5cqh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.8cqw",
                    background: received ? "#d4f0de" : "#fff",
                    border: `0.12cqw solid ${received ? "#24a66a" : "#cfd7e1"}`,
                    opacity: received ? 1 : 0.4,
                    transition: "all 0.4s ease",
                  }}
                >
                  <span style={{ fontSize: "2.5cqw" }}>
                    {received ? emoji : "⬜"}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, ui-monospace, monospace",
                      fontSize: "0.8cqw",
                      color: "#6b7280",
                      marginTop: "0.3cqh",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: "1cqw",
              color: "#24a66a",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            rwnd={beat >= 2 ? 6 : 4}
          </div>
          <div style={{ fontSize: "3cqw" }}>📬</div>
        </div>
      </main>
      <Takeaway
        text={copy.scenes[2].beats[Math.min(beat, 2)].title}
        label={copy.lane}
        lang={lang}
      />
    </>
  );
}

/* ─── Scene 4: Congestion Control (Hero) ─── */

function SceneFour({
  lang,
  beat,
  reducedMotion,
}: {
  lang: Lang;
  beat: number;
  reducedMotion: boolean;
}) {
  const copy = COPY[lang];
  const showLoss = showAt(beat, 1);
  const showAIMD = showAt(beat, 2);
  const showSteady = showAt(beat, 3);

  const drawDuration = reducedMotion ? "0s" : "0.8s";

  return (
    <>
      <Header sceneTitle={copy.scenes[3].title} copy={copy} lang={lang} />
      <main
        style={{
          position: "absolute",
          left: "5cqw",
          right: "5cqw",
          top: "24cqh",
          bottom: "16cqh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3cqw",
          alignItems: "center",
        }}
      >
        {/* Left: cwnd chart */}
        <div
          data-beat-layout-item="true"
          style={{
            position: "relative",
            background: "#fff",
            borderRadius: "1.4cqw",
            border: "0.16cqw solid #d7dde5",
            boxShadow: "0 0.6cqh 0 #dce3ec",
            padding: "2cqh 2cqw",
            height: "44cqh",
          }}
        >
          {/* Chart title */}
          <div
            style={{
              fontFamily: handFont(lang),
              fontSize: "1.6cqw",
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: "1cqh",
            }}
          >
            {lang === "zh" ? "cwnd（拥塞窗口）随时间变化 →" : "cwnd (congestion window) vs time →"}
          </div>

          <svg
            viewBox="0 0 400 260"
            style={{ width: "100%", height: "calc(100% - 4cqh)" }}
          >
            {/* Axes */}
            <line
              x1="30"
              y1="240"
              x2="390"
              y2="240"
              stroke="#cfd7e1"
              strokeWidth="2"
            />
            <line
              x1="30"
              y1="10"
              x2="30"
              y2="240"
              stroke="#cfd7e1"
              strokeWidth="2"
            />
            {/* Y label */}
            <text
              x="8"
              y="130"
              fill="#9ca3af"
              fontSize="14"
              fontFamily={lang === "zh" ? '"Ma Shan Zheng", cursive' : "Caveat, cursive"}
              fontWeight="700"
              transform="rotate(-90, 8, 130)"
            >
              cwnd
            </text>

            {/* Slow start: exponential curve from (30,230) to (150,40) */}
            <path
              d="M30 230 Q70 228 100 200 Q125 160 150 40"
              fill="none"
              stroke="#f6c945"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={showAt(beat, 0) ? 0 : 1}
              style={{ transition: `stroke-dashoffset ${drawDuration} ease-out` }}
            />
            {/* Slow start label */}
            {showAt(beat, 0) && (
              <text
                x="55"
                y="250"
                fill="#d97706"
                fontSize="16"
                fontFamily={lang === "zh" ? '"Ma Shan Zheng", cursive' : "Caveat, cursive"}
                fontWeight="700"
              >
                {lang === "zh" ? "慢启动" : "Slow Start"}
              </text>
            )}
            {/* Rocket at peak */}
            {showAt(beat, 0) && !showLoss && (
              <text x="142" y="35" fontSize="18">
                🚀
              </text>
            )}

            {/* Loss marker */}
            {showLoss && (
              <>
                <circle
                  cx="150"
                  cy="40"
                  r="12"
                  fill="none"
                  stroke="#d8514e"
                  strokeWidth="3"
                  opacity={0.8}
                >
                  {!reducedMotion && (
                    <>
                      <animate
                        attributeName="r"
                        values="8;18;8"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.2;0.8"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </>
                  )}
                </circle>
                <text x="135" y="30" fontSize="16">
                  💥
                </text>
                <text
                  x="160"
                  y="35"
                  fill="#d8514e"
                  fontSize="18"
                  fontFamily={lang === "zh" ? '"Ma Shan Zheng", cursive' : "Caveat, cursive"}
                  fontWeight="700"
                >
                  {lang === "zh" ? "丢包!" : "Loss!"}
                </text>
              </>
            )}

            {/* AIMD: drop from (150,40) to (150,135) then linear climb to (280,80) */}
            {showAIMD && (
              <>
                {/* Multiplicative Decrease — vertical drop */}
                <line
                  x1="150"
                  y1="40"
                  x2="150"
                  y2="135"
                  stroke="#d8514e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="200"
                  strokeDashoffset={showAIMD ? 0 : 200}
                  style={{
                    transition: `stroke-dashoffset 0.4s ease-in`,
                  }}
                />
                {/* Additive Increase — linear climb */}
                <line
                  x1="150"
                  y1="135"
                  x2="280"
                  y2="80"
                  stroke="#2779d8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="150"
                  strokeDashoffset={showAIMD ? 0 : 150}
                  style={{
                    transition: `stroke-dashoffset 0.6s ease-out 0.3s`,
                  }}
                />
                {/* MD label */}
                <text
                  x="155"
                  y="95"
                  fill="#d8514e"
                  fontSize="15"
                  fontFamily={lang === "zh" ? '"Ma Shan Zheng", cursive' : "Caveat, cursive"}
                  fontWeight="700"
                >
                  MD
                </text>
                {/* AI label */}
                <text
                  x="210"
                  y="118"
                  fill="#2779d8"
                  fontSize="15"
                  fontFamily={lang === "zh" ? '"Ma Shan Zheng", cursive' : "Caveat, cursive"}
                  fontWeight="700"
                >
                  AI
                </text>
              </>
            )}

            {/* Steady state: full sawtooth pattern */}
            {showSteady && (
              <>
                {/* Second cycle */}
                <line
                  x1="280"
                  y1="80"
                  x2="280"
                  y2="155"
                  stroke="#d8514e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="80"
                  strokeDashoffset={showSteady ? 0 : 80}
                  style={{ transition: `stroke-dashoffset 0.3s ease-in` }}
                />
                <line
                  x1="280"
                  y1="155"
                  x2="370"
                  y2="110"
                  stroke="#2779d8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  strokeDashoffset={showSteady ? 0 : 100}
                  style={{ transition: `stroke-dashoffset 0.5s ease-out 0.2s` }}
                />
                {/* Third cycle hint */}
                <line
                  x1="370"
                  y1="110"
                  x2="370"
                  y2="170"
                  stroke="#d8514e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={0.5}
                />
                {/* Loop arrow */}
                <text x="340" y="252" fontSize="14">
                  ♻️
                </text>
                <text
                  x="295"
                  y="252"
                  fill="#6b7280"
                  fontSize="15"
                  fontFamily={lang === "zh" ? '"Ma Shan Zheng", cursive' : "Caveat, cursive"}
                  fontWeight="700"
                >
                  AIMD
                </text>
              </>
            )}

            {/* Time arrow */}
            <polygon points="390,240 380,235 380,245" fill="#9ca3af" />
          </svg>
        </div>

        {/* Right: highway metaphor + annotation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2cqh",
          }}
        >
          {/* Highway visualization */}
          <div
            data-beat-layout-item="true"
            style={{
              background: "#fff",
              borderRadius: "1.4cqw",
              border: "0.16cqw solid #d7dde5",
              boxShadow: "0 0.6cqh 0 #dce3ec",
              padding: "2cqh 2cqw",
              height: "20cqh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Badge color="#7b61ff">
              {lang === "zh" ? "高速公路隐喻" : "Highway Metaphor"}
            </Badge>
            <div
              style={{
                marginTop: "1.5cqh",
                display: "flex",
                gap: "0.4cqw",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {(() => {
                const cars = ["🚗", "🚕", "🚙", "🚌", "🚐", "🚛"];
                // Beat 0: sparse (3 cars), Beat 1+: dense (6 cars), Beat 2+: moderate (4 cars)
                let count = 3;
                if (showLoss) count = 6;
                if (showAIMD) count = 4;
                if (showSteady) count = 5;
                return cars.slice(0, count).map((car, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "3.5cqw",
                      transition: "all 0.4s ease",
                      transform: showLoss && i === 2 ? "rotate(15deg)" : "none",
                    }}
                  >
                    {car}
                    {showLoss && i === 2 && (
                      <span style={{ position: "absolute" }}>💥</span>
                    )}
                  </span>
                ));
              })()}
            </div>
            {/* Road line */}
            <div
              style={{
                position: "absolute",
                bottom: "3cqh",
                left: "2cqw",
                right: "2cqw",
                height: "0.4cqh",
                background:
                  "repeating-linear-gradient(90deg, #374151 0, #374151 1.5cqw, transparent 1.5cqw, transparent 3cqw)",
                opacity: 0.3,
              }}
            />
          </div>

          {/* Key insight card */}
          <div
            data-beat-layout-item="true"
            style={{
              background: showAIMD ? "#fffbeb" : "#fff",
              borderRadius: "1.4cqw",
              border: `0.16cqw solid ${showAIMD ? "#f6c945" : "#d7dde5"}`,
              boxShadow: showAIMD
                ? "0 0.8cqh 0 rgba(246,201,69,0.3)"
                : "0 0.6cqh 0 #dce3ec",
              padding: "2.5cqh 2cqw",
              transition: "all 0.4s ease",
            }}
          >
            <div
              style={{
                fontFamily: handFont(lang),
                fontSize: "3.2cqw",
                fontWeight: 700,
                lineHeight: 1.2,
                background: showAIMD
                  ? "linear-gradient(transparent 58%, #ffe580 58%)"
                  : "none",
                transition: "all 0.4s ease",
              }}
            >
              {lang === "zh"
                ? "先试探极限，再优雅退让"
                : "Probe the limit, then gracefully retreat"}
            </div>
            <p
              style={{
                margin: "1.5cqh 0 0",
                fontSize: "1.25cqw",
                lineHeight: 1.45,
                color: "#4b5563",
                fontFamily: BODY,
              }}
            >
              {showSteady
                ? lang === "zh"
                  ? "AIMD = 加性增 + 乘性减。每条流公平分享带宽。"
                  : "AIMD = Additive Increase, Multiplicative Decrease. Every flow gets a fair share."
                : showAIMD
                  ? lang === "zh"
                    ? "cwnd 减半只需一瞬，爬回去要慢慢爬。"
                    : "Halving cwnd takes an instant. Climbing back takes patience."
                  : showLoss
                    ? lang === "zh"
                      ? "丢包不是失败，是信号。"
                      : "Packet loss isn't failure — it's a signal."
                    : lang === "zh"
                      ? "猛踩油门，试探管道容量。"
                      : "Floor it to probe the pipe's capacity."}
            </p>
          </div>
        </div>
      </main>
      <Takeaway
        text={copy.scenes[3].beats[Math.min(beat, 3)].title}
        label={copy.lane}
        lang={lang}
      />
    </>
  );
}

/* ─── Scene 5: Full Lifecycle ─── */

function SceneFive({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const showQuote = showAt(beat, 1);

  const milestones = [
    { emoji: "📡", label: lang === "zh" ? "握手" : "Handshake", color: "#4b8fe8" },
    { emoji: "🤝", label: lang === "zh" ? "建立" : "Established", color: "#24a66a" },
    { emoji: "📦", label: lang === "zh" ? "传输" : "Transfer", color: "#7b61ff" },
    { emoji: "🎢", label: lang === "zh" ? "拥塞控制" : "Congestion", color: "#f6c945" },
    { emoji: "👋", label: lang === "zh" ? "关闭" : "Close", color: "#d8514e" },
  ];

  const badges = [
    { emoji: "🔒", label: lang === "zh" ? "可靠" : "Reliable" },
    { emoji: "📋", label: lang === "zh" ? "有序" : "Ordered" },
    { emoji: "🪟", label: lang === "zh" ? "流量控制" : "Flow Ctrl" },
    { emoji: "🎢", label: lang === "zh" ? "拥塞控制" : "Congestion" },
    { emoji: "⚖️", label: lang === "zh" ? "公平" : "Fair" },
  ];

  return (
    <>
      <Header sceneTitle={copy.scenes[4].title} copy={copy} lang={lang} />
      <main
        style={{
          position: "absolute",
          left: "5cqw",
          right: "5cqw",
          top: "25cqh",
          bottom: "16cqh",
          display: "flex",
          flexDirection: "column",
          gap: "3cqh",
        }}
      >
        {/* Lifecycle timeline */}
        <div
          data-beat-layout-item="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5cqw",
            opacity: showQuote ? 0.5 : 1,
            transform: showQuote ? "scale(0.85)" : "scale(1)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {milestones.map((m, i) => (
            <React.Fragment key={m.label}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.8cqh",
                  opacity: showAt(beat, 0) ? 1 : 0,
                  transform: showAt(beat, 0)
                    ? "translateY(0)"
                    : "translateY(1.5cqh)",
                  transition: `all 0.4s ease ${i * 0.1}s`,
                }}
              >
                <div
                  style={{
                    fontSize: "4.5cqw",
                    lineHeight: 1,
                    filter: `drop-shadow(0 0.4cqh 0 ${m.color}40)`,
                  }}
                >
                  {m.emoji}
                </div>
                <Badge color={m.color}>{m.label}</Badge>
              </div>
              {i < milestones.length - 1 && (
                <div
                  style={{
                    fontSize: "2cqw",
                    color: "#cfd7e1",
                    opacity: showAt(beat, 0) ? 0.6 : 0,
                    transition: `opacity 0.3s ease ${i * 0.1 + 0.05}s`,
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Feature badges row */}
        <div
          data-beat-layout-item="true"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.2cqw",
            opacity: showQuote ? 0.4 : 1,
            transform: showQuote ? "scale(0.9)" : "scale(1)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          {badges.map((b, i) => (
            <div
              key={b.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5cqw",
                padding: "0.8cqh 1.4cqw",
                background: "#fff",
                borderRadius: "2cqw",
                border: "0.12cqw solid #e2e8f0",
                opacity: showAt(beat, 0) ? 1 : 0,
                transform: showAt(beat, 0) ? "translateY(0)" : "translateY(1cqh)",
                transition: `all 0.4s ease ${i * 0.08 + 0.3}s`,
                fontSize: "1.4cqw",
                fontFamily: handFont(lang),
                fontWeight: 700,
                color: "#334155",
              }}
            >
              <span style={{ fontSize: "1.8cqw" }}>{b.emoji}</span>
              {b.label}
            </div>
          ))}
        </div>

        {/* Final quote (beat 2) */}
        {showQuote && (
          <div
            data-beat-layout-item="true"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              opacity: showQuote ? 1 : 0,
              transform: showQuote ? "translateY(0)" : "translateY(2cqh)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              style={{
                fontFamily: handFont(lang),
                fontSize: "4.5cqw",
                fontWeight: 700,
                lineHeight: 1.2,
                maxWidth: "70cqw",
                background: "linear-gradient(transparent 58%, #ffe580 58%)",
              }}
            >
              {copy.finalTakeaway}
            </div>
            <div
              style={{
                marginTop: "2.5cqh",
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: "1cqw",
                color: "#9ca3af",
              }}
            >
              Doubao-Seed-Evolving · {lang === "zh" ? "工程讲解白板" : "Engineering Whiteboard"}
            </div>
          </div>
        )}
      </main>
      <Takeaway
        text={
          showQuote
            ? copy.finalTakeaway
            : copy.scenes[4].beats[Math.min(beat, 1)].title
        }
        label={copy.lane}
        lang={lang}
      />
    </>
  );
}

/* ─── Scene Router ─── */

function renderScene(
  scene: number,
  beat: number,
  lang: Lang,
  reducedMotion: boolean,
) {
  switch (scene) {
    case 1:
      return <SceneOne lang={lang} beat={beat} />;
    case 2:
      return <SceneTwo lang={lang} beat={beat} />;
    case 3:
      return <SceneThree lang={lang} beat={beat} reducedMotion={reducedMotion} />;
    case 4:
      return <SceneFour lang={lang} beat={beat} reducedMotion={reducedMotion} />;
    case 5:
      return <SceneFive lang={lang} beat={beat} />;
    default:
      return <SceneOne lang={lang} beat={0} />;
  }
}

/* ─── Main Component ─── */

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
}: TopicStageProps) {
  const settled = reducedMotion || isThumbnail;
  return (
    <div
      data-testid="tcp-congestion-control-stage"
      data-topic-id="tcp-congestion-control"
      data-settled={settled ? "true" : "false"}
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, rgba(75,143,232,0.06) 0.12cqw, transparent 0.12cqw), linear-gradient(rgba(75,143,232,0.05) 0.12cqh, transparent 0.12cqh), #fbfcff",
        backgroundSize: "4cqw 4cqh",
        color: "#20242a",
        fontFamily: BODY,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {settled && (
        <style data-topic-motion-reset="true">
          {`[data-topic-id="tcp-congestion-control"][data-settled="true"], [data-topic-id="tcp-congestion-control"][data-settled="true"] * { animation: none !important; transition: none !important; }`}
        </style>
      )}
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionMap={TRANSITION_MAP}
        reducedMotion={settled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) =>
          renderScene(sceneId, sceneBeat, language, settled)
        }
      />
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "tcp-congestion-control",
  styleId: "engineering-whiteboard-explainer",
  title: {
    en: "TCP Handshake & Congestion",
    zh: "TCP 拥塞控制",
  },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: TCP_TRANSITION_SCORE,
  evidence: {
    kind: "mixed",
    sources: TCP_CONGESTION_CONTROL_SOURCES,
    boundary: {
      en: "Simplified teaching model of classic TCP behavior: packet counts, receive-window values, loss causes, AIMD response, and fairness outcomes vary by algorithm, implementation, path, and traffic conditions.",
      zh: "经典 TCP 行为的简化教学模型：包数量、接收窗口数值、丢包原因、AIMD 响应和公平性结果会随算法、实现、路径与流量条件而变化。",
    },
    display: "envelope",
  },
});

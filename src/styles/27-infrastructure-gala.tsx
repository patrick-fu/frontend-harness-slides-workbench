import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Lang = "en" | "zh";
type DecoSceneKind = "marquee" | "mechanism" | "capacity" | "ceremony" | "skyline";

interface SceneCopy {
  kicker: string;
  title: string;
  subtitle: string;
  leftLabel: string;
  rightLabel: string;
  centerLabel: string;
  metric: string;
  metricLabel: string;
  slots: string[];
  beats: Array<{
    action: string;
    title: string;
    body: string;
  }>;
}

interface SceneData {
  kind: DecoSceneKind;
  en: SceneCopy;
  zh: SceneCopy;
}

const STYLE_ID = "machine-age-deco";
const SCENE_IDS = [1, 2, 3, 4, 5];
const brass = "#d6ad5b";
const dimBrass = "#8f6a34";
const ink = "#f6e8bf";
const lacquer = "#080708";
const oxblood = "#471115";
const jade = "#0e3c38";
const shadow = "rgba(0, 0, 0, 0.42)";

const transitionMap: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->3": "scale-fade",
  "3->4": "wipe",
  "4->5": "hard-cut",
};

const beatLayoutModes: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const scenes: Record<number, SceneData> = {
  1: {
    kind: "marquee",
    en: {
      kicker: "Opening Night",
      title: "Infrastructure Gala",
      subtitle: "The city enters through a brass-lit operating hall.",
      leftLabel: "Ingress",
      rightLabel: "Uptime",
      centerLabel: "Marquee",
      metric: "05",
      metricLabel: "District gates",
      slots: ["Power arrives first", "Transit follows the axis", "Guests see the system"],
      beats: [
        {
          action: "Raise the marquee",
          title: "Marquee",
          body: "A public entrance turns hidden infrastructure into ceremony.",
        },
        {
          action: "Light the gates",
          title: "Gates",
          body: "The first beat reserves the axis; the second lights the service doors.",
        },
        {
          action: "Reveal the hall",
          title: "Hall",
          body: "The whole operating floor is framed as the evening's host.",
        },
      ],
    },
    zh: {
      kicker: "开场夜",
      title: "基础设施晚会",
      subtitle: "城市从黄铜灯下的运行大厅入场。",
      leftLabel: "入口",
      rightLabel: "在线",
      centerLabel: "招牌",
      metric: "05",
      metricLabel: "城区门厅",
      slots: ["电力先抵达", "交通沿中轴推进", "来宾看见系统"],
      beats: [
        {
          action: "升起招牌",
          title: "招牌",
          body: "公共入口把隐形基础设施变成仪式。",
        },
        {
          action: "点亮门厅",
          title: "门厅",
          body: "第一拍保留中轴，第二拍点亮服务门。",
        },
        {
          action: "揭示大厅",
          title: "大厅",
          body: "整座运行楼层被框成当晚的主人。",
        },
      ],
    },
  },
  2: {
    kind: "mechanism",
    en: {
      kicker: "Backstage Engine",
      title: "The Mechanism Turns",
      subtitle: "Pump, switch, rail, and route click into a single dial.",
      leftLabel: "Switch",
      rightLabel: "Route",
      centerLabel: "Mechanism",
      metric: "12",
      metricLabel: "Synchronized drives",
      slots: ["Pressure balances", "Signals lock", "A route becomes visible"],
      beats: [
        {
          action: "Start the dial",
          title: "Dial",
          body: "The central mechanism aligns every subsystem to one cadence.",
        },
        {
          action: "Lock the couplers",
          title: "Couplers",
          body: "Each service lands on the brass ring without breaking symmetry.",
        },
        {
          action: "Confirm the route",
          title: "Route",
          body: "A moving city is reduced to a legible machine face.",
        },
      ],
    },
    zh: {
      kicker: "后台引擎",
      title: "机构开始转动",
      subtitle: "泵、闸、轨、路合进同一个仪表盘。",
      leftLabel: "闸机",
      rightLabel: "线路",
      centerLabel: "机构",
      metric: "12",
      metricLabel: "同步驱动",
      slots: ["压力归衡", "信号锁定", "线路显形"],
      beats: [
        {
          action: "启动仪表盘",
          title: "仪表",
          body: "中央机构把每个子系统校到同一节奏。",
        },
        {
          action: "扣合联轴器",
          title: "联轴",
          body: "每项服务都落在黄铜圆环上，不破坏对称。",
        },
        {
          action: "确认线路",
          title: "线路",
          body: "流动的城市被压成一张可读的机器面。",
        },
      ],
    },
  },
  3: {
    kind: "capacity",
    en: {
      kicker: "Main Floor",
      title: "Capacity Takes Its Seat",
      subtitle: "Load is no longer an emergency. It is a reserved table.",
      leftLabel: "Peak",
      rightLabel: "Reserve",
      centerLabel: "Capacity",
      metric: "4x",
      metricLabel: "Evening headroom",
      slots: ["North hall stays open", "South hall absorbs surge", "Center service holds"],
      beats: [
        {
          action: "Open the floor",
          title: "Floor",
          body: "Capacity is staged before demand arrives.",
        },
        {
          action: "Raise the towers",
          title: "Towers",
          body: "Reserved lanes carry the crowd without moving the frame.",
        },
        {
          action: "Hold the headroom",
          title: "Headroom",
          body: "The system keeps formal space around peak pressure.",
        },
      ],
    },
    zh: {
      kicker: "主会场",
      title: "容量入席",
      subtitle: "负载不再是事故，而是一张预留好的餐桌。",
      leftLabel: "峰值",
      rightLabel: "余量",
      centerLabel: "容量",
      metric: "4x",
      metricLabel: "晚间余量",
      slots: ["北厅保持开放", "南厅吸收峰涌", "中央服务稳住"],
      beats: [
        {
          action: "打开楼面",
          title: "楼面",
          body: "容量在需求到来前先完成布场。",
        },
        {
          action: "升起塔楼",
          title: "塔楼",
          body: "预留通道承接人潮，而版式不移动。",
        },
        {
          action: "保留余量",
          title: "余量",
          body: "系统在峰压周围保有正式空间。",
        },
      ],
    },
  },
  4: {
    kind: "ceremony",
    en: {
      kicker: "Ribbon Hour",
      title: "Operations Become Ceremony",
      subtitle: "The control room signs the guest book in polished brass.",
      leftLabel: "Witness",
      rightLabel: "Signoff",
      centerLabel: "Ceremony",
      metric: "21:00",
      metricLabel: "Public handover",
      slots: ["Ribbon crosses the axis", "Protocol receives applause", "The floor signs off"],
      beats: [
        {
          action: "Cross the ribbon",
          title: "Ribbon",
          body: "A service guarantee becomes a public ritual.",
        },
        {
          action: "Read the protocol",
          title: "Protocol",
          body: "Operational language is lifted into the house program.",
        },
        {
          action: "Seal the handover",
          title: "Seal",
          body: "The final mark confirms that ceremony and mechanism agree.",
        },
      ],
    },
    zh: {
      kicker: "剪彩时刻",
      title: "运行成为仪式",
      subtitle: "控制室用抛光黄铜在来宾簿上签名。",
      leftLabel: "见证",
      rightLabel: "签收",
      centerLabel: "仪式",
      metric: "21:00",
      metricLabel: "公开交接",
      slots: ["缎带穿过中轴", "协议收到掌声", "楼面完成签收"],
      beats: [
        {
          action: "拉过缎带",
          title: "缎带",
          body: "服务承诺成为公共仪式。",
        },
        {
          action: "宣读协议",
          title: "协议",
          body: "运行语言被抬进晚会节目单。",
        },
        {
          action: "盖下交接章",
          title: "封印",
          body: "最后的标记确认仪式与机构一致。",
        },
      ],
    },
  },
  5: {
    kind: "skyline",
    en: {
      kicker: "After Midnight",
      title: "The Skyline Keeps Working",
      subtitle: "When the gala exits, the illuminated grid remains on duty.",
      leftLabel: "North",
      rightLabel: "South",
      centerLabel: "Skyline",
      metric: "∞",
      metricLabel: "Public hours",
      slots: ["Stations stay lit", "Water keeps pressure", "The city sleeps above it"],
      beats: [
        {
          action: "Dim the hall",
          title: "Hall",
          body: "The formal evening ends without turning off the system.",
        },
        {
          action: "Raise the skyline",
          title: "Skyline",
          body: "Service becomes architecture after the guests leave.",
        },
        {
          action: "Hold the city",
          title: "Hold",
          body: "The final view is not spectacle. It is continuity.",
        },
      ],
    },
    zh: {
      kicker: "午夜之后",
      title: "天际线继续工作",
      subtitle: "晚会退场后，发光的网格仍然值班。",
      leftLabel: "北区",
      rightLabel: "南区",
      centerLabel: "天际线",
      metric: "∞",
      metricLabel: "公共时段",
      slots: ["车站保持明亮", "水压持续稳定", "城市在其上方入睡"],
      beats: [
        {
          action: "调暗大厅",
          title: "大厅",
          body: "正式夜晚结束，系统没有熄灯。",
        },
        {
          action: "升起天际线",
          title: "天际线",
          body: "来宾离开后，服务成为建筑。",
        },
        {
          action: "托住城市",
          title: "托举",
          body: "最后一眼不是奇观，而是连续性。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "style-27-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function copyFor(scene: number, language: Lang): SceneCopy {
  return scenes[scene]?.[language] ?? scenes[1][language];
}

function getBeatCount(scene: number): number {
  return scenes[scene]?.en.beats.length ?? 1;
}

function clampBeat(scene: number, beat: number): number {
  return Math.max(0, Math.min(beat, getBeatCount(scene) - 1));
}

function revealStyle(shown: boolean, quiet: boolean, delayMs = 0): CSSProperties {
  return {
    opacity: shown ? 1 : 0,
    visibility: shown ? "visible" : "hidden",
    transform: shown ? "translateY(0)" : "translateY(1.4cqh)",
    transition: quiet
      ? "none"
      : `opacity 520ms ease ${delayMs}ms, transform 680ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
  };
}

function rootStyle(quiet: boolean): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    containerType: "size",
    position: "relative",
    overflow: "hidden",
    color: ink,
    background:
      `linear-gradient(90deg, transparent 0 49.85%, ${dimBrass} 49.9% 50.1%, transparent 50.15%), ` +
      `radial-gradient(circle at 50% 112%, rgba(214, 173, 91, 0.18), transparent 36%), ` +
      `linear-gradient(180deg, #12090b 0%, ${lacquer} 54%, #050405 100%)`,
    fontFamily:
      '"Barlow Condensed", "Arial Narrow", "Noto Sans SC", sans-serif',
    transition: quiet ? "none" : "background 500ms ease",
  };
}

function Backdrop() {
  const sideRail: CSSProperties = {
    position: "absolute",
    top: "8cqh",
    bottom: "8cqh",
    width: "7cqw",
    borderTop: `0.18cqw solid ${brass}`,
    borderBottom: `0.18cqw solid ${brass}`,
    opacity: 0.72,
  };
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: "0" }}>
      <div
        style={{
          position: "absolute",
          left: "4cqw",
          ...sideRail,
          borderLeft: `0.18cqw solid ${brass}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "4cqw",
          ...sideRail,
          borderRight: `0.18cqw solid ${brass}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "14cqw",
          right: "14cqw",
          top: "7cqh",
          height: "0.22cqh",
          background: brass,
          boxShadow: `0 70cqh 0 ${brass}`,
          opacity: 0.72,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "36cqw",
          right: "36cqw",
          bottom: "5cqh",
          height: "14cqh",
          clipPath: "polygon(0 100%, 16% 72%, 28% 72%, 42% 42%, 58% 42%, 72% 72%, 84% 72%, 100% 100%)",
          background: `linear-gradient(180deg, rgba(214, 173, 91, 0.2), rgba(214, 173, 91, 0.02))`,
          borderBottom: `0.28cqw solid ${brass}`,
        }}
      />
    </div>
  );
}

function DecoRules({ quiet }: { quiet: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "0",
        opacity: 0.62,
        transition: quiet ? "none" : "opacity 500ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "27cqw",
          right: "27cqw",
          top: "16cqh",
          height: "0.2cqh",
          background: brass,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "31cqw",
          right: "31cqw",
          top: "18.2cqh",
          height: "0.16cqh",
          background: dimBrass,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "31cqw",
          right: "31cqw",
          bottom: "18.2cqh",
          height: "0.16cqh",
          background: dimBrass,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "27cqw",
          right: "27cqw",
          bottom: "16cqh",
          height: "0.2cqh",
          background: brass,
        }}
      />
    </div>
  );
}

function Device({ kind, beat, quiet }: { kind: DecoSceneKind; beat: number; quiet: boolean }) {
  if (kind === "mechanism") return <Mechanism beat={beat} quiet={quiet} />;
  if (kind === "capacity") return <Capacity beat={beat} quiet={quiet} />;
  if (kind === "ceremony") return <Ceremony beat={beat} quiet={quiet} />;
  if (kind === "skyline") return <Skyline beat={beat} quiet={quiet} />;
  return <Marquee beat={beat} quiet={quiet} />;
}

function Marquee({ beat, quiet }: { beat: number; quiet: boolean }) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "relative",
        width: "34cqw",
        height: "25cqh",
        margin: "0 auto",
        ...revealStyle(beat >= 0, quiet),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0",
          border: `0.22cqw solid ${brass}`,
          background: `linear-gradient(180deg, rgba(71, 17, 21, 0.88), rgba(8, 7, 8, 0.7))`,
          boxShadow: `0 2cqh 4cqw ${shadow}`,
        }}
      />
      {[0, 1, 2, 3].map((step) => (
        <div
          key={step}
          style={{
            position: "absolute",
            left: `${7 + step * 4}cqw`,
            right: `${7 + step * 4}cqw`,
            bottom: `${3 + step * 3.2}cqh`,
            height: "0.28cqh",
            background: step % 2 === 0 ? brass : dimBrass,
            ...revealStyle(beat >= Math.min(step, 2), quiet, step * 90),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "15.7cqw",
          top: "3cqh",
          width: "2.6cqw",
          height: "15cqh",
          borderLeft: `0.16cqw solid ${brass}`,
          borderRight: `0.16cqw solid ${brass}`,
        }}
      />
    </div>
  );
}

function Mechanism({ beat, quiet }: { beat: number; quiet: boolean }) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "relative",
        width: "30cqw",
        height: "30cqw",
        maxHeight: "35cqh",
        margin: "0 auto",
        borderRadius: "50%",
        border: `0.26cqw solid ${brass}`,
        boxShadow: `inset 0 0 0 1.2cqw rgba(214, 173, 91, 0.12), 0 2cqh 4cqw ${shadow}`,
        background: `radial-gradient(circle, ${oxblood} 0 18%, rgba(214, 173, 91, 0.16) 19% 21%, transparent 22%)`,
        transform: quiet ? "none" : beat >= 1 ? "scale(1)" : "scale(0.96)",
        transition: quiet ? "none" : "transform 680ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {[0, 30, 60, 90, 120, 150].map((angle, index) => (
        <div
          key={angle}
          style={{
            position: "absolute",
            left: "49.5%",
            top: "7%",
            width: "0.18cqw",
            height: "86%",
            background: index % 2 === 0 ? brass : dimBrass,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "50% 50%",
            opacity: beat >= 1 ? 0.78 : 0.28,
            transition: quiet ? "none" : `opacity 420ms ease ${index * 45}ms`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: "29%",
          borderRadius: "50%",
          border: `0.22cqw solid ${brass}`,
          background: lacquer,
          opacity: beat >= 2 ? 1 : 0.72,
          transition: quiet ? "none" : "opacity 420ms ease",
        }}
      />
    </div>
  );
}

function Capacity({ beat, quiet }: { beat: number; quiet: boolean }) {
  const towers = [
    { left: "7cqw", height: "17cqh", bottom: "2cqh", shown: 0 },
    { left: "14cqw", height: "25cqh", bottom: "2cqh", shown: 1 },
    { left: "23cqw", height: "21cqh", bottom: "2cqh", shown: 2 },
  ];
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "relative",
        width: "36cqw",
        height: "32cqh",
        margin: "0 auto",
        borderBottom: `0.28cqw solid ${brass}`,
      }}
    >
      {towers.map((tower, index) => (
        <div
          key={tower.left}
          style={{
            position: "absolute",
            left: tower.left,
            bottom: tower.bottom,
            width: index === 1 ? "6cqw" : "5cqw",
            height: tower.height,
            border: `0.18cqw solid ${brass}`,
            background:
              index === 1
                ? `linear-gradient(180deg, ${jade}, rgba(14, 60, 56, 0.24))`
                : `linear-gradient(180deg, ${oxblood}, rgba(71, 17, 21, 0.28))`,
            boxShadow: `0 1.4cqh 3cqw ${shadow}`,
            ...revealStyle(beat >= tower.shown, quiet, index * 90),
          }}
        >
          {[0, 1, 2].map((bar) => (
            <div
              key={bar}
              style={{
                position: "absolute",
                left: "18%",
                right: "18%",
                top: `${22 + bar * 23}%`,
                height: "0.16cqh",
                background: brass,
                opacity: 0.76,
              }}
            />
          ))}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: "3cqw",
          right: "3cqw",
          top: "4cqh",
          height: "0.18cqh",
          background: dimBrass,
        }}
      />
    </div>
  );
}

function Ceremony({ beat, quiet }: { beat: number; quiet: boolean }) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "relative",
        width: "34cqw",
        height: "32cqh",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "2cqw",
          right: "2cqw",
          top: "13cqh",
          height: "2.4cqh",
          background: oxblood,
          borderTop: `0.18cqw solid ${brass}`,
          borderBottom: `0.18cqw solid ${brass}`,
          ...revealStyle(beat >= 0, quiet),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "13cqw",
          right: "13cqw",
          top: "5cqh",
          height: "20cqh",
          clipPath: "polygon(50% 0, 100% 58%, 72% 100%, 28% 100%, 0 58%)",
          background: brass,
          boxShadow: `0 2cqh 4cqw ${shadow}`,
          ...revealStyle(beat >= 1, quiet, 120),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "15.1cqw",
          top: "11.2cqh",
          width: "3.8cqw",
          height: "3.8cqw",
          borderRadius: "50%",
          background: lacquer,
          border: `0.16cqw solid ${brass}`,
          ...revealStyle(beat >= 2, quiet, 160),
        }}
      />
    </div>
  );
}

function Skyline({ beat, quiet }: { beat: number; quiet: boolean }) {
  const towers = [
    { left: "4cqw", width: "4.4cqw", height: "12cqh", delay: 0 },
    { left: "10cqw", width: "5cqw", height: "20cqh", delay: 80 },
    { left: "17cqw", width: "6cqw", height: "27cqh", delay: 140 },
    { left: "25cqw", width: "5cqw", height: "18cqh", delay: 200 },
  ];
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "relative",
        width: "36cqw",
        height: "34cqh",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "2cqw",
          right: "2cqw",
          bottom: "2cqh",
          height: "0.3cqh",
          background: brass,
        }}
      />
      {towers.map((tower, index) => (
        <div
          key={tower.left}
          style={{
            position: "absolute",
            left: tower.left,
            bottom: "2.2cqh",
            width: tower.width,
            height: tower.height,
            background: index === 2 ? brass : dimBrass,
            clipPath: "polygon(0 100%, 0 16%, 24% 16%, 24% 0, 76% 0, 76% 16%, 100% 16%, 100% 100%)",
            opacity: beat >= Math.min(index, 2) ? 1 : 0,
            transform: beat >= Math.min(index, 2) ? "translateY(0)" : "translateY(2cqh)",
            transition: quiet
              ? "none"
              : `opacity 520ms ease ${tower.delay}ms, transform 620ms cubic-bezier(0.16, 1, 0.3, 1) ${tower.delay}ms`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "8cqw",
          right: "8cqw",
          top: "2cqh",
          height: "15cqh",
          borderTop: `0.16cqw solid ${brass}`,
          borderRadius: "50% 50% 0 0",
          opacity: beat >= 2 ? 0.82 : 0.26,
          transition: quiet ? "none" : "opacity 520ms ease",
        }}
      />
    </div>
  );
}

function StatementSlots({
  copy,
  beat,
  quiet,
}: {
  copy: SceneCopy;
  beat: number;
  quiet: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.4cqw",
        width: "58cqw",
        minHeight: "12cqh",
        margin: "2.6cqh auto 0",
      }}
    >
      {copy.slots.map((slot, index) => (
        <div
          key={slot}
          style={{
            minHeight: "10.5cqh",
            padding: "1.5cqh 1.2cqw",
            borderTop: `0.16cqw solid ${index <= beat ? brass : dimBrass}`,
            borderBottom: `0.08cqw solid ${dimBrass}`,
            background: index <= beat ? "rgba(214, 173, 91, 0.08)" : "rgba(214, 173, 91, 0.03)",
            color: index <= beat ? ink : "rgba(246, 232, 191, 0.34)",
            fontSize: "1.65cqw",
            lineHeight: 1.02,
            textAlign: "center",
            textTransform: "uppercase",
            ...revealStyle(index <= beat, quiet, index * 80),
          }}
        >
          {slot}
        </div>
      ))}
    </div>
  );
}

function BeatMarkers({
  scene,
  beat,
  quiet,
  onNavigate,
}: {
  scene: number;
  beat: number;
  quiet: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const count = getBeatCount(scene);
  return (
    <div
      data-beat-layout-item="true"
      aria-label="Beat markers"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "0.7cqw",
        height: "5cqh",
        marginTop: "2cqh",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          data-beat-marker="true"
          aria-label={`Beat ${index + 1}`}
          onClick={() => onNavigate?.(scene, index)}
          style={{
            width: "2.2cqw",
            height: `${1.3 + index * 0.75}cqh`,
            padding: "0",
            border: "0",
            background: index <= beat ? brass : "rgba(214, 173, 91, 0.28)",
            boxShadow: index === beat ? `0 0 1.4cqw rgba(214, 173, 91, 0.42)` : "none",
            cursor: onNavigate ? "pointer" : "default",
            transition: quiet ? "none" : "height 260ms ease, background 260ms ease",
          }}
        />
      ))}
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
  quiet,
  onNavigate,
}: {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
  quiet: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const sceneData = scenes[scene] ?? scenes[1];
  const copy = copyFor(scene, language);
  const activeBeat = clampBeat(scene, beat);
  return (
    <section
      data-scene={scene}
      data-active={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "9cqh 10cqw 7cqh",
        boxSizing: "border-box",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <DecoRules quiet={quiet} />
      <div
        data-beat-layout-item="true"
        style={{
          position: "relative",
          zIndex: 1,
          color: brass,
          fontSize: "1.5cqw",
          lineHeight: 1,
          textTransform: "uppercase",
          ...revealStyle(activeBeat >= 0, quiet),
        }}
      >
        {copy.kicker}
      </div>
      <h1
        data-beat-layout-item="true"
        style={{
          position: "relative",
          zIndex: 1,
          margin: "2cqh auto 0",
          width: "74cqw",
          minHeight: "17cqh",
          color: ink,
          fontSize: language === "zh" ? "6.2cqw" : "7.2cqw",
          lineHeight: 0.86,
          fontWeight: 700,
          textTransform: "uppercase",
          textShadow: `0 1.4cqh 3cqw ${shadow}`,
          ...revealStyle(activeBeat >= 0, quiet, 60),
        }}
      >
        {copy.title}
      </h1>
      <p
        data-beat-layout-item="true"
        style={{
          position: "relative",
          zIndex: 1,
          width: "50cqw",
          minHeight: "6.4cqh",
          margin: "1.3cqh auto 2cqh",
          color: "rgba(246, 232, 191, 0.78)",
          fontSize: language === "zh" ? "1.8cqw" : "1.6cqw",
          lineHeight: 1.16,
          fontFamily: '"Noto Sans SC", "Barlow Condensed", sans-serif',
          ...revealStyle(activeBeat >= 1, quiet, 100),
        }}
      >
        {copy.subtitle}
      </p>
      <div
        data-beat-layout-item="true"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "18cqw 1fr 18cqw",
          alignItems: "center",
          gap: "1.6cqw",
          width: "78cqw",
          minHeight: "37cqh",
          margin: "0 auto",
        }}
      >
        <SidePlaque label={copy.leftLabel} value={copy.metric} active={activeBeat >= 1} quiet={quiet} />
        <div>
          <Device kind={sceneData.kind} beat={activeBeat} quiet={quiet} />
          <div
            style={{
              margin: "1.4cqh auto 0",
              color: brass,
              fontSize: "1.35cqw",
              textTransform: "uppercase",
              ...revealStyle(activeBeat >= 1, quiet, 80),
            }}
          >
            {copy.centerLabel}
          </div>
        </div>
        <SidePlaque label={copy.rightLabel} value={copy.metricLabel} active={activeBeat >= 2} quiet={quiet} />
      </div>
      <StatementSlots copy={copy} beat={activeBeat} quiet={quiet} />
      <BeatMarkers scene={scene} beat={activeBeat} quiet={quiet} onNavigate={onNavigate} />
    </section>
  );
}

function SidePlaque({
  label,
  value,
  active,
  quiet,
}: {
  label: string;
  value: string;
  active: boolean;
  quiet: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        minHeight: "22cqh",
        padding: "2.4cqh 1.4cqw",
        borderTop: `0.18cqw solid ${active ? brass : dimBrass}`,
        borderBottom: `0.18cqw solid ${active ? brass : dimBrass}`,
        background: active ? "rgba(214, 173, 91, 0.07)" : "rgba(214, 173, 91, 0.025)",
        color: active ? ink : "rgba(246, 232, 191, 0.38)",
        transition: quiet ? "none" : "color 380ms ease, background 380ms ease, border-color 380ms ease",
      }}
    >
      <div
        style={{
          color: active ? brass : dimBrass,
          fontSize: "1.35cqw",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: "4cqh",
          fontSize: "3cqw",
          lineHeight: 0.95,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ElevatorNav({
  scene,
  onNavigate,
}: {
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      aria-label="Stepped brass elevator"
      style={{
        position: "absolute",
        right: "4.7cqw",
        top: "24cqh",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "1.1cqh",
      }}
    >
      {SCENE_IDS.map((sceneId, index) => {
        const active = sceneId === scene;
        return (
          <button
            key={sceneId}
            type="button"
            aria-label={`Scene ${sceneId}`}
            onClick={() => onNavigate?.(sceneId, 0)}
            style={{
              width: `${3.2 + index * 0.72}cqw`,
              height: "4.3cqh",
              padding: "0",
              border: `0.14cqw solid ${active ? brass : dimBrass}`,
              background: active ? brass : "rgba(214, 173, 91, 0.08)",
              color: active ? lacquer : brass,
              fontFamily: "inherit",
              fontSize: "1.35cqw",
              fontWeight: 700,
              lineHeight: 1,
              textTransform: "uppercase",
              boxShadow: active ? `0 0 1.6cqw rgba(214, 173, 91, 0.38)` : "none",
              cursor: onNavigate ? "pointer" : "default",
            }}
          >
            {sceneId}
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  const zh = lang === "zh";
  return {
    id: STYLE_ID,
    band: "craft-cultural",
    name: zh ? "机器时代装饰派" : "Machine-Age Deco",
    theme: zh ? "基础设施晚会" : "The Infrastructure Gala",
    densityLabel: zh ? "仪式低密度" : "Ceremonial Low Density",
    heroScene: 1,
    colors: {
      bg: lacquer,
      ink,
      panel: oxblood,
    },
    typography: {
      header: "Barlow Condensed 700",
      body: "Noto Sans SC 400",
    },
    tags: ["deco", "ceremonial", "brass", "symmetric", "infrastructure"],
    fonts: ["Barlow Condensed", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = copyFor(sceneId, lang);
      return {
        id: sceneId,
        title: copy.title,
        beats: copy.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function InfrastructureGalaV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const quiet = reducedMotion || isThumbnail;
  const activeScene = scenes[scene] ? scene : 1;
  const activeBeat = clampBeat(activeScene, beat);

  return (
    <div style={rootStyle(quiet)} data-style-id={STYLE_ID} data-topic-origin="curated">
      <Backdrop />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="scale-fade"
        transitionMap={transitionMap}
        transitionDurationMs={720}
        reducedMotion={quiet}
        beatLayoutModes={beatLayoutModes}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            quiet={quiet}
            onNavigate={isActive ? onNavigate : undefined}
          />
        )}
      />
      {!isThumbnail && <ElevatorNav scene={activeScene} onNavigate={onNavigate} />}
    </div>
  );
}

export const infrastructureGalaTopic = defineStyleTopic({
  id: "infrastructure-gala",
  topic: {
    en: "Infrastructure Gala",
    zh: "基建庆典",
  },
  model: "GPT-5.5",
  component: InfrastructureGalaV2,
  getMetadata,
});

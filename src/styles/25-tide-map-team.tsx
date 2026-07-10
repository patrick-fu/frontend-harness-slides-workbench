import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  marker: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  beats: BeatCopy[];
}

type StyleVars = CSSProperties & Record<`--${string}`, string | number>;

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "wipe",
  "2->3": "slide-x",
  "3->4": "fade",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      marker: "Harbor",
      eyebrow: "Harbor",
      title: "Name the moorings",
      subtitle: "Before the tide moves, the team names what is anchored.",
      body: "Roles, waits, and departure windows sit in one calm view.",
      beats: [
        {
          id: 0,
          action: "Frame the harbor",
          title: "Mooring line",
          body: "Each boat gets a role, not a vague owner.",
        },
        {
          id: 1,
          action: "Load the boats",
          title: "Cargo check",
          body: "Open work is sorted by load, weight, and wait.",
        },
        {
          id: 2,
          action: "Mark the window",
          title: "Departure tide",
          body: "The first shared movement has a visible time.",
        },
      ],
    },
    zh: {
      marker: "港口",
      eyebrow: "港口",
      title: "先标出系泊点",
      subtitle: "潮水动之前，团队先说清什么还停在岸边。",
      body: "角色、等待和出发窗口，放在同一张安静的图里。",
      beats: [
        {
          id: 0,
          action: "定出港口",
          title: "系泊线",
          body: "每条船对应一个角色，不留模糊负责人。",
        },
        {
          id: 1,
          action: "装载任务",
          title: "载荷检查",
          body: "未完成工作按负载、重量和等待拆开。",
        },
        {
          id: 2,
          action: "标记窗口",
          title: "出发潮",
          body: "第一次共同移动，有可见的时间点。",
        },
      ],
    },
  },
  2: {
    en: {
      marker: "Current",
      eyebrow: "Current",
      title: "Read the pull",
      subtitle: "The map shows which work will drift without a handoff.",
      body: "Currents are not blockers; they are direction, force, and timing.",
      beats: [
        {
          id: 0,
          action: "Reveal the first current",
          title: "Dependency tide",
          body: "A late review pulls the whole lane sideways.",
        },
        {
          id: 1,
          action: "Add the counter-current",
          title: "Attention tide",
          body: "Support load moves against product intent.",
        },
        {
          id: 2,
          action: "Find the slack water",
          title: "Slack window",
          body: "A small calm gap becomes the planning moment.",
        },
      ],
    },
    zh: {
      marker: "水流",
      eyebrow: "水流",
      title: "读懂拉力",
      subtitle: "地图显示哪些工作会在交接缺口里漂走。",
      body: "水流不是阻塞，而是方向、力度和时机。",
      beats: [
        {
          id: 0,
          action: "显出第一道流",
          title: "依赖潮",
          body: "延迟评审会把整条航道横向拉偏。",
        },
        {
          id: 1,
          action: "加入逆流",
          title: "注意力潮",
          body: "支持负载与产品意图反向移动。",
        },
        {
          id: 2,
          action: "寻找缓水",
          title: "缓水窗",
          body: "一个小的平静缺口，成为计划时刻。",
        },
      ],
    },
  },
  3: {
    en: {
      marker: "Bridge",
      eyebrow: "Bridge",
      title: "Place the bridge",
      subtitle: "The crossing is made from small planks, not a heroic jump.",
      body: "A weekly sync becomes useful only when every plank has a use.",
      beats: [
        {
          id: 0,
          action: "Set the first span",
          title: "Shared plank",
          body: "One artifact carries context across the water.",
        },
        {
          id: 1,
          action: "Add the handrail",
          title: "Review rail",
          body: "Risks have a rail before they become urgent.",
        },
        {
          id: 2,
          action: "Open the crossing",
          title: "Walkable bridge",
          body: "The team can cross without calling a meeting.",
        },
      ],
    },
    zh: {
      marker: "桥",
      eyebrow: "桥",
      title: "把桥放对位置",
      subtitle: "过河靠一块块桥板，不靠英雄式跳跃。",
      body: "周会只有在每块桥板都有用途时才真正有用。",
      beats: [
        {
          id: 0,
          action: "放下第一跨",
          title: "共享桥板",
          body: "一个工件把上下文带过水面。",
        },
        {
          id: 1,
          action: "加上扶栏",
          title: "评审扶栏",
          body: "风险先有扶栏，再谈紧急处理。",
        },
        {
          id: 2,
          action: "打开通路",
          title: "可走的桥",
          body: "团队无需临时开会，也能顺利过桥。",
        },
      ],
    },
  },
  4: {
    en: {
      marker: "Crossing",
      eyebrow: "Calm crossing",
      title: "Move in slack water",
      subtitle: "The plan works when the crossing looks uneventful.",
      body: "Signals are quieter now because the team is moving with the tide.",
      beats: [
        {
          id: 0,
          action: "Hold the channel",
          title: "Quiet lane",
          body: "Each boat keeps enough room to correct.",
        },
        {
          id: 1,
          action: "Align the wake",
          title: "Shared wake",
          body: "Progress trails line up instead of colliding.",
        },
        {
          id: 2,
          action: "Reach the far bank",
          title: "Calm arrival",
          body: "The crossing ends with less noise than it began.",
        },
      ],
    },
    zh: {
      marker: "平渡",
      eyebrow: "平静过渡",
      title: "顺着缓水移动",
      subtitle: "计划有效时，过渡看起来并不惊险。",
      body: "信号变安静，是因为团队正在顺潮而行。",
      beats: [
        {
          id: 0,
          action: "守住航道",
          title: "安静航道",
          body: "每条船都有足够空间做修正。",
        },
        {
          id: 1,
          action: "对齐尾迹",
          title: "共享尾迹",
          body: "进度痕迹彼此对齐，而不是互相撞击。",
        },
        {
          id: 2,
          action: "抵达彼岸",
          title: "平稳抵达",
          body: "过渡结束时，比开始时更少噪声。",
        },
      ],
    },
  },
  5: {
    en: {
      marker: "Seal",
      eyebrow: "Seal",
      title: "Stamp the route",
      subtitle: "A quiet mark makes the crossing repeatable.",
      body: "The map is finished only when the team knows how to reuse it.",
      beats: [
        {
          id: 0,
          action: "Set the seal",
          title: "Team seal",
          body: "The route becomes a shared agreement.",
        },
        {
          id: 1,
          action: "Close the map",
          title: "Next tide",
          body: "The next crossing starts from a known harbor.",
        },
      ],
    },
    zh: {
      marker: "印",
      eyebrow: "印",
      title: "给路线落印",
      subtitle: "一个安静的印记，让这次过渡可以复用。",
      body: "团队知道如何再次使用它，这张图才算完成。",
      beats: [
        {
          id: 0,
          action: "盖下印记",
          title: "团队之印",
          body: "路线成为共同约定。",
        },
        {
          id: 1,
          action: "合上地图",
          title: "下一次潮",
          body: "下一次过渡，从已知港口开始。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "style-25-tide-map-team-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700&family=Shippori+Mincho:wght@500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(sceneId: SceneId, beat: number): number {
  const maxBeat = COPY[sceneId].en.beats.length - 1;
  return Math.max(0, Math.min(maxBeat, beat));
}

function getCopy(sceneId: SceneId, language: Language): SceneCopy {
  return COPY[sceneId][language];
}

export function getMetadata(lang: Language): StyleMetadata {
  const isZh = lang === "zh";
  return {
    id: "woodblock-floating-world",
    band: "craft-cultural",
    name: isZh ? "木版浮世" : "Woodblock Floating World",
    theme: isZh ? "团队潮汐图" : "Tide Map for a Team",
    densityLabel: isZh ? "中等叙事" : "Medium Narrative",
    heroScene: 3,
    colors: {
      bg: "#ecd7ae",
      ink: "#1d3548",
      panel: "#d6b36e",
    },
    typography: {
      header: "Shippori Mincho 700",
      body: "Noto Sans SC 400",
    },
    tags: [
      "woodblock",
      "ukiyo-e",
      "craft",
      "serene",
      "bilingual",
      "motion-beats",
    ],
    fonts: ["Shippori Mincho", "Noto Sans SC", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const sceneCopy = getCopy(sceneId, lang);
      return {
        id: sceneId,
        title: sceneCopy.marker,
        beats: sceneCopy.beats.map((beatCopy) => ({
          id: beatCopy.id,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  isStatic,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
  isStatic: boolean;
}) {
  const clampedBeat = clampBeat(sceneId, beat);
  const copy = getCopy(sceneId, language);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, clampedBeat, language],
    disabled: isStatic || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <article className="wbfw25Scene" data-scene={sceneId}>
      <div className="wbfw25Sky" aria-hidden="true" />
      <SceneArtwork sceneId={sceneId} beat={clampedBeat} language={language} />
      <div
        ref={ref}
        className={`wbfw25Copy wbfw25CopyScene${sceneId}`}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <p className="wbfw25Eyebrow" data-beat-layout-item="true">
          {copy.eyebrow}
        </p>
        <h1 className="wbfw25Title" data-beat-layout-item="true">
          {copy.title}
        </h1>
        <p className="wbfw25Subtitle" data-beat-layout-item="true">
          {copy.subtitle}
        </p>
        <p className="wbfw25Body" data-beat-layout-item="true">
          {copy.body}
        </p>
        <ol className="wbfw25BeatList" aria-label={copy.marker}>
          {copy.beats.slice(0, clampedBeat + 1).map((beatCopy) => (
            <li
              key={beatCopy.id}
              className="wbfw25BeatItem"
              data-beat-layout-item="true"
            >
              <span className="wbfw25BeatNumber">
                {String(beatCopy.id + 1).padStart(2, "0")}
              </span>
              <span className="wbfw25BeatText">
                <strong>{beatCopy.title}</strong>
                <span>{beatCopy.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <BeatMarkers total={copy.beats.length} beat={clampedBeat} />
    </article>
  );
}

function BeatMarkers({ total, beat }: { total: number; beat: number }) {
  return (
    <div className="wbfw25BeatMarkers" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className="wbfw25BeatMark"
          data-lit={index <= beat ? "true" : "false"}
        />
      ))}
    </div>
  );
}

function SealIndex({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const numerals = language === "zh" ? ["一", "二", "三", "四", "五"] : SCENE_IDS;
  return (
    <nav className="wbfw25SealIndex" aria-label={language === "zh" ? "场景" : "Scenes"}>
      {SCENE_IDS.map((sceneId, index) => {
        const sceneCopy = getCopy(sceneId, language);
        const isCurrent = sceneId === scene;
        const style = {
          "--seal-turn": `${index % 2 === 0 ? -2 : 2}deg`,
        } as StyleVars;
        return (
          <button
            key={sceneId}
            type="button"
            className="wbfw25SealButton"
            aria-label={sceneCopy.marker}
            aria-current={isCurrent ? "true" : undefined}
            onClick={() => onNavigate?.(sceneId, 0)}
            style={style}
          >
            <span>{numerals[index]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SceneArtwork({
  sceneId,
  beat,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
}) {
  if (sceneId === 1) return <HarborArt beat={beat} />;
  if (sceneId === 2) return <CurrentArt beat={beat} />;
  if (sceneId === 3) return <BridgeArt beat={beat} />;
  if (sceneId === 4) return <CrossingArt beat={beat} />;
  return <SealArt beat={beat} language={language} />;
}

function HarborArt({ beat }: { beat: number }) {
  return (
    <svg className="wbfw25Art" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
      <path className="wbfw25Ochre" d="M0 760 C270 650 455 690 676 612 C884 540 1018 512 1230 574 C1474 646 1654 595 1920 494 L1920 1080 L0 1080 Z" />
      <path className="wbfw25Water" d="M0 650 C250 616 352 648 560 612 C868 560 1028 594 1220 642 C1452 700 1648 664 1920 578 L1920 1080 L0 1080 Z" />
      <path className="wbfw25Green" d="M1324 300 C1512 246 1704 270 1920 236 L1920 500 C1722 514 1530 470 1372 520 C1268 554 1188 526 1180 456 C1172 382 1240 326 1324 300 Z" />
      <path className="wbfw25KeyLine" d="M0 650 C250 616 352 648 560 612 C868 560 1028 594 1220 642 C1452 700 1648 664 1920 578" />
      <g className="wbfw25InkLayer" data-visible="true">
        <path className="wbfw25Boat" d="M300 706 L470 678 L548 716 L420 760 Z" />
        <path className="wbfw25Boat" d="M950 710 L1096 682 L1176 716 L1048 754 Z" />
        <path className="wbfw25KeyLine" d="M326 706 L470 684 L546 716 M420 758 L300 706" />
        <path className="wbfw25KeyLine" d="M972 708 L1098 686 L1170 716 M1048 752 L950 710" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 1 ? "true" : "false"}>
        <path className="wbfw25Plank" d="M642 750 L812 718 L846 742 L674 780 Z" />
        <path className="wbfw25Plank" d="M742 792 L918 760 L956 786 L778 826 Z" />
        <path className="wbfw25KeyLine" d="M642 750 L812 718 L846 742 L674 780 Z M742 792 L918 760 L956 786 L778 826 Z" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 2 ? "true" : "false"}>
        <path className="wbfw25Vermilion" d="M1504 708 L1600 690 L1656 728 L1564 754 Z" />
        <path className="wbfw25KeyLine" d="M1504 708 L1600 690 L1656 728 L1564 754 Z" />
        <path className="wbfw25KeyLine" d="M138 612 C264 586 378 582 498 606" />
      </g>
    </svg>
  );
}

function CurrentArt({ beat }: { beat: number }) {
  return (
    <svg className="wbfw25Art" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
      <path className="wbfw25Ochre" d="M0 840 C316 762 560 746 836 792 C1096 836 1372 814 1920 680 L1920 1080 L0 1080 Z" />
      <path className="wbfw25Water" d="M-80 520 C266 424 528 546 808 486 C1112 420 1400 350 2000 430 L2000 774 C1456 666 1160 732 852 784 C544 836 286 728 -80 838 Z" />
      <path className="wbfw25KeyLine" d="M-80 520 C266 424 528 546 808 486 C1112 420 1400 350 2000 430" />
      <g className="wbfw25InkLayer" data-visible="true">
        <path className="wbfw25CurrentRibbon" d="M-30 596 C250 510 496 614 762 558 C1022 504 1280 446 1950 510" />
        <path className="wbfw25CurrentRibbonThin" d="M-24 672 C250 616 510 706 816 648 C1128 588 1360 548 1940 600" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 1 ? "true" : "false"}>
        <path className="wbfw25Green" d="M1170 238 C1306 210 1394 252 1464 350 C1342 402 1208 416 1098 356 C1028 318 1060 260 1170 238 Z" />
        <path className="wbfw25KeyLine" d="M1170 238 C1306 210 1394 252 1464 350 C1342 402 1208 416 1098 356 C1028 318 1060 260 1170 238 Z" />
        <path className="wbfw25CurrentRibbonThin" d="M152 452 C430 398 592 462 774 428 C916 402 1028 352 1162 318" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 2 ? "true" : "false"}>
        <circle className="wbfw25SealDot" cx="816" cy="604" r="30" />
        <circle className="wbfw25SealDot" cx="1048" cy="566" r="22" />
        <path className="wbfw25KeyLine" d="M760 636 C846 660 934 634 1010 594" />
      </g>
    </svg>
  );
}

function BridgeArt({ beat }: { beat: number }) {
  return (
    <svg className="wbfw25Art" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
      <path className="wbfw25Water" d="M0 590 C344 532 564 598 884 568 C1216 536 1504 464 1920 536 L1920 1080 L0 1080 Z" />
      <path className="wbfw25Ochre" d="M-40 846 C380 714 702 748 1022 810 C1300 864 1580 832 1960 718 L1960 1080 L-40 1080 Z" />
      <path className="wbfw25BridgeFill" d="M194 734 C572 380 1148 340 1632 656 L1578 716 C1108 446 622 486 252 790 Z" />
      <path className="wbfw25KeyLine" d="M194 734 C572 380 1148 340 1632 656 M252 790 C622 486 1108 446 1578 716" />
      <g className="wbfw25InkLayer" data-visible={beat >= 0 ? "true" : "false"}>
        <path className="wbfw25Plank" d="M586 576 L696 530 L742 564 L634 614 Z" />
        <path className="wbfw25Plank" d="M770 506 L884 482 L926 518 L814 548 Z" />
        <path className="wbfw25KeyLine" d="M586 576 L696 530 L742 564 L634 614 Z M770 506 L884 482 L926 518 L814 548 Z" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 1 ? "true" : "false"}>
        <path className="wbfw25Plank" d="M974 492 L1090 508 L1122 548 L1010 528 Z" />
        <path className="wbfw25Plank" d="M1190 552 L1306 602 L1326 646 L1210 594 Z" />
        <path className="wbfw25KeyLine" d="M974 492 L1090 508 L1122 548 L1010 528 Z M1190 552 L1306 602 L1326 646 L1210 594 Z" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 2 ? "true" : "false"}>
        <path className="wbfw25Vermilion" d="M1450 654 L1514 668 L1528 724 L1464 708 Z" />
        <path className="wbfw25KeyLine" d="M1450 654 L1514 668 L1528 724 L1464 708 Z" />
        <path className="wbfw25CurrentRibbonThin" d="M330 852 C660 744 1010 746 1370 846" />
      </g>
    </svg>
  );
}

function CrossingArt({ beat }: { beat: number }) {
  return (
    <svg className="wbfw25Art" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
      <path className="wbfw25Water" d="M0 474 C356 422 640 512 956 468 C1294 420 1608 394 1920 446 L1920 1080 L0 1080 Z" />
      <path className="wbfw25Green" d="M0 792 C220 732 380 720 562 760 C300 890 170 940 0 958 Z" />
      <path className="wbfw25Ochre" d="M1330 708 C1530 626 1716 610 1920 640 L1920 1080 L1190 1080 C1250 924 1250 794 1330 708 Z" />
      <path className="wbfw25KeyLine" d="M0 474 C356 422 640 512 956 468 C1294 420 1608 394 1920 446" />
      <g className="wbfw25InkLayer" data-visible="true">
        <path className="wbfw25Boat" d="M460 636 L620 610 L696 646 L548 692 Z" />
        <path className="wbfw25KeyLine" d="M460 636 L620 610 L696 646 L548 692 Z" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 1 ? "true" : "false"}>
        <path className="wbfw25Boat" d="M822 706 L992 676 L1076 716 L912 760 Z" />
        <path className="wbfw25KeyLine" d="M822 706 L992 676 L1076 716 L912 760 Z" />
        <path className="wbfw25CurrentRibbonThin" d="M516 720 C680 774 850 780 1024 736" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 2 ? "true" : "false"}>
        <path className="wbfw25Boat" d="M1198 610 L1372 582 L1458 620 L1290 668 Z" />
        <path className="wbfw25KeyLine" d="M1198 610 L1372 582 L1458 620 L1290 668 Z" />
        <path className="wbfw25CurrentRibbonThin" d="M900 820 C1112 762 1290 742 1490 778" />
      </g>
    </svg>
  );
}

function SealArt({ beat, language }: { beat: number; language: Language }) {
  const sealText = language === "zh" ? "潮" : "TIDE";
  return (
    <svg className="wbfw25Art" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
      <path className="wbfw25Water" d="M0 692 C280 640 512 680 776 650 C1048 618 1286 536 1920 608 L1920 1080 L0 1080 Z" />
      <path className="wbfw25Ochre" d="M0 840 C320 774 592 760 850 812 C1118 866 1414 860 1920 730 L1920 1080 L0 1080 Z" />
      <path className="wbfw25KeyLine" d="M224 720 C478 662 724 678 968 718 C1214 758 1440 736 1708 658" />
      <g className="wbfw25InkLayer" data-visible="true">
        <path className="wbfw25CurrentRibbonThin" d="M360 650 C586 600 808 626 1018 670" />
        <path className="wbfw25CurrentRibbonThin" d="M612 774 C872 720 1118 740 1370 800" />
      </g>
      <g className="wbfw25InkLayer" data-visible={beat >= 1 ? "true" : "false"}>
        <rect className="wbfw25SealLarge" x="1174" y="238" width="348" height="348" rx="0" />
        <path className="wbfw25SealCut" d="M1242 330 L1450 330 M1242 424 L1450 424 M1348 292 L1348 510" />
        <text className="wbfw25SealText" x="1348" y="468" textAnchor="middle">
          {sealText}
        </text>
      </g>
    </svg>
  );
}

const STYLE_CSS = `
.wbfw25Root {
  --wbfw25-paper: #ecd7ae;
  --wbfw25-paper-deep: #d6b36e;
  --wbfw25-ink: #1d3548;
  --wbfw25-ink-soft: #36566b;
  --wbfw25-vermilion: #b8422f;
  --wbfw25-ochre: #c89548;
  --wbfw25-malachite: #55745d;
  --wbfw25-cream: #f4e5c4;
  position: relative;
  width: 100%;
  height: 100%;
  container-type: size;
  overflow: hidden;
  background: var(--wbfw25-paper);
  color: var(--wbfw25-ink);
  font-family: "Noto Sans SC", "Avenir Next", system-ui, sans-serif;
}

.wbfw25Root * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.wbfw25Frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--wbfw25-paper);
}

.wbfw25Frame::before {
  content: "";
  position: absolute;
  inset: 2.4cqw 2.4cqw 2.4cqw 2.4cqw;
  border: 0.22cqw solid rgba(29, 53, 72, 0.84);
  pointer-events: none;
  z-index: 6;
}

.wbfw25Track {
  position: absolute;
  inset: 0;
}

.wbfw25Scene {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--wbfw25-paper);
}

.wbfw25Sky {
  position: absolute;
  inset: 0 0 auto 0;
  height: 42cqh;
  background: linear-gradient(180deg, #d7b787 0%, #e9d0a4 58%, rgba(236, 215, 174, 0) 100%);
  opacity: 0.86;
}

.wbfw25Art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.wbfw25Water {
  fill: #2c5a73;
}

.wbfw25Ochre {
  fill: var(--wbfw25-ochre);
}

.wbfw25Green {
  fill: var(--wbfw25-malachite);
}

.wbfw25Vermilion,
.wbfw25SealDot {
  fill: var(--wbfw25-vermilion);
}

.wbfw25Boat,
.wbfw25Plank,
.wbfw25BridgeFill {
  fill: var(--wbfw25-cream);
}

.wbfw25KeyLine,
.wbfw25CurrentRibbon,
.wbfw25CurrentRibbonThin,
.wbfw25SealCut {
  fill: none;
  stroke: var(--wbfw25-ink);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.wbfw25KeyLine {
  stroke-width: 5;
}

.wbfw25CurrentRibbon {
  stroke-width: 26;
  opacity: 0.72;
}

.wbfw25CurrentRibbonThin {
  stroke-width: 9;
  opacity: 0.82;
}

.wbfw25SealLarge {
  fill: var(--wbfw25-vermilion);
  stroke: var(--wbfw25-ink);
  stroke-width: 5;
}

.wbfw25SealCut {
  stroke: var(--wbfw25-cream);
  stroke-width: 15;
}

.wbfw25SealText {
  fill: var(--wbfw25-cream);
  font-family: "Shippori Mincho", "Noto Sans SC", serif;
  font-size: 4.4cqw;
  font-weight: 700;
}

.wbfw25InkLayer {
  opacity: 0;
  transform: translateY(2cqh);
  transition:
    opacity 640ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 640ms cubic-bezier(0.16, 1, 0.3, 1);
}

.wbfw25InkLayer[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
}

.wbfw25Copy {
  position: absolute;
  z-index: 4;
  display: grid;
  gap: 1.05cqh;
  width: 39cqw;
  color: var(--wbfw25-ink);
}

.wbfw25CopyScene1 {
  left: 7cqw;
  top: 11cqh;
}

.wbfw25CopyScene2 {
  right: 7cqw;
  top: 11cqh;
  width: 37cqw;
}

.wbfw25CopyScene3 {
  left: 9cqw;
  top: 9cqh;
  width: 38cqw;
}

.wbfw25CopyScene4 {
  right: 8cqw;
  top: 12cqh;
  width: 36cqw;
}

.wbfw25CopyScene5 {
  left: 8cqw;
  top: 12cqh;
  width: 40cqw;
}

.wbfw25Eyebrow {
  margin: 0;
  width: max-content;
  padding: 0.6cqh 0.8cqw;
  background: var(--wbfw25-vermilion);
  color: var(--wbfw25-cream);
  font-family: "Shippori Mincho", "Noto Sans SC", serif;
  font-size: 1.2cqw;
  line-height: 1;
  writing-mode: vertical-rl;
}

.wbfw25Title {
  margin: 0;
  max-width: 34cqw;
  font-family: "Shippori Mincho", "Noto Sans SC", serif;
  font-size: 4.7cqw;
  font-weight: 700;
  line-height: 0.94;
}

.wbfw25Subtitle,
.wbfw25Body {
  margin: 0;
  max-width: 35cqw;
  font-size: 1.36cqw;
  line-height: 1.42;
}

.wbfw25Subtitle {
  font-weight: 700;
}

.wbfw25Body {
  color: rgba(29, 53, 72, 0.82);
}

.wbfw25BeatList {
  display: grid;
  gap: 0.74cqh;
  margin: 1cqh 0 0;
  padding: 0;
  list-style: none;
}

.wbfw25BeatItem {
  display: grid;
  grid-template-columns: 3.1cqw 1fr;
  gap: 1cqw;
  align-items: start;
  padding-top: 0.8cqh;
  border-top: 0.18cqw solid rgba(29, 53, 72, 0.72);
  transform-origin: left center;
  animation: wbfw25InkSettle 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.wbfw25BeatNumber {
  color: var(--wbfw25-vermilion);
  font-family: "Shippori Mincho", "Noto Sans SC", serif;
  font-size: 1.15cqw;
  line-height: 1.15;
}

.wbfw25BeatText {
  display: grid;
  gap: 0.35cqh;
  font-size: 1.08cqw;
  line-height: 1.36;
}

.wbfw25BeatText strong {
  font-size: 1.12cqw;
  line-height: 1.1;
}

.wbfw25BeatMarkers {
  position: absolute;
  left: 5.4cqw;
  bottom: 5.6cqh;
  z-index: 5;
  display: flex;
  gap: 0.72cqw;
}

.wbfw25BeatMark {
  width: 1.05cqw;
  height: 1.05cqw;
  border: 0.16cqw solid var(--wbfw25-ink);
  transform: rotate(45deg);
  background: transparent;
}

.wbfw25BeatMark[data-lit="true"] {
  background: var(--wbfw25-vermilion);
}

.wbfw25SealIndex {
  position: absolute;
  right: 3.6cqw;
  top: 50%;
  z-index: 8;
  display: grid;
  gap: 1.1cqh;
  transform: translateY(-50%);
}

.wbfw25SealButton {
  width: 4.2cqw;
  height: 4.2cqw;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0.2cqw solid var(--wbfw25-ink);
  background: var(--wbfw25-vermilion);
  color: var(--wbfw25-cream);
  cursor: pointer;
  font-family: "Shippori Mincho", "Noto Sans SC", serif;
  font-size: 1.38cqw;
  font-weight: 700;
  line-height: 1;
  transform: rotate(var(--seal-turn));
  transition:
    transform 260ms ease,
    background-color 260ms ease;
}

.wbfw25SealButton:hover,
.wbfw25SealButton:focus-visible {
  background: #9f3328;
  outline: 0.2cqw solid var(--wbfw25-cream);
  outline-offset: 0.24cqw;
}

.wbfw25SealButton[aria-current="true"] {
  background: var(--wbfw25-ink);
  transform: rotate(var(--seal-turn)) scale(1.12);
}

.wbfw25Root[data-thumbnail="true"] .wbfw25SealIndex {
  display: none;
}

.wbfw25Root[data-static="true"] .wbfw25InkLayer,
.wbfw25Root[data-static="true"] .wbfw25BeatItem,
.wbfw25Root[data-static="true"] .wbfw25SealButton {
  transition: none;
  animation: none;
}

@keyframes wbfw25InkSettle {
  from {
    opacity: 0;
    transform: translateY(1.4cqh);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default function TideMapTeamV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const sceneId = toSceneId(scene);
  const effectiveReducedMotion = reducedMotion || isThumbnail;

  return (
    <div
      className="wbfw25Root"
      data-static={effectiveReducedMotion ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <style>{STYLE_CSS}</style>
      <div className="wbfw25Frame">
        <SpatialSceneTrack
          scene={sceneId}
          beat={clampBeat(sceneId, beat)}
          transitionKind="wipe"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={760}
          reducedMotion={effectiveReducedMotion}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className="wbfw25Track"
          renderScene={(renderedScene, renderedBeat, isActive) => {
            const renderedSceneId = toSceneId(renderedScene);
            return (
              <ScenePanel
                sceneId={renderedSceneId}
                beat={renderedBeat}
                language={language}
                isActive={isActive}
                isStatic={effectiveReducedMotion}
              />
            );
          }}
        />
        {!isThumbnail && (
          <SealIndex
            scene={sceneId}
            language={language}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}

export const tideMapTeamTopic = defineStyleTopic({
  id: "tide-map",
  topic: {
    en: "Tide Map",
    zh: "潮汐地图",
  },
  model: "GPT-5.5",
  component: TideMapTeamV2,
  getMetadata,
});

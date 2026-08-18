import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./diesel-streamliner-train.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Diesel Streamliner Era: Aerodynamics and Art Deco Locomotives",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#09090b",
      ink: "#f8fafc",
      panel: "#1c1917",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["trains", "art-deco", "engineering", "speed", "streamliner"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "Steam's Inertial Ceiling",
        beats: [
          {
            id: 0,
            action: "Confront reciprocating steam locomotive mass",
            title: "The Reciprocating Steam Limit",
            body: "Heavy cast-iron boilers, coal tenders, and pounding dynamic counterweights capped passenger train velocity below 80 mph.",
          },
        ],
      },
      {
        id: 2,
        title: "Wind Tunnel Shrouding",
        beats: [
          {
            id: 0,
            action: "Sculpt stainless steel bullet nose in aeronautic wind tunnel",
            title: "Aeronautic Bullet Shrouding",
            body: "Pioneering wind tunnel tests carved teardrop stainless steel shells, slashing aerodynamic atmospheric drag by 40%.",
          },
          {
            id: 1,
            action: "Eliminate unfaired underbody turbulence",
            title: "Skirted Bogie Airflow",
            body: "Full-length fluted side skirts directed underbody airflow smoothly past truck bogies and brake assemblies.",
          },
        ],
      },
      {
        id: 3,
        title: "Pioneer Zephyr 100 MPH Dash",
        beats: [
          {
            id: 0,
            action: "Break Denver-to-Chicago dawn-to-dusk speed record",
            title: "1,015 Miles in 13 Hours (112.5 MPH Peak)",
            body: "On May 26, 1934, the Burlington Zephyr dashed 1,015 nonstop miles from Denver to Chicago in 13 hours and 5 minutes.",
          },
        ],
      },
      {
        id: 4,
        title: "Winton Two-Stroke Diesel Heart",
        beats: [
          {
            id: 0,
            action: "Power lightweight two-stroke uniflow diesel engine",
            title: "600 HP Electro-Motive Traction",
            body: "Winton 8-201A uniflow two-stroke diesel engines cut power-to-weight ratios in half, feeding direct DC traction generators.",
          },
        ],
      },
      {
        id: 5,
        title: "Speed as a Modernist Monument",
        beats: [
          {
            id: 0,
            action: "Celebrate the Art Deco marriage of speed and sculpture",
            title: "The Silver Cathedral of Velocity",
            body: "Streamlined chrome was not merely transportation—it was the machine age's supreme sculpture of optimism and speed.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "柴油流线型机车：空气动力学与装饰艺术铁路革命",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#09090b",
      ink: "#f8fafc",
      panel: "#1c1917",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["铁路", "装饰艺术", "工程", "速度", "流线型"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "蒸汽机车速度瓶颈",
        beats: [
          {
            id: 0,
            action: "揭露传统笨重蒸汽机车的往复惯性死结",
            title: "笨重蒸汽锅炉的物理极限",
            body: "沉重的铸铁锅炉、煤水车与剧烈晃动的往复活塞连杆，将传统旅客列车速度死死压制在每小时 80 英里以内。",
          },
        ],
      },
      {
        id: 2,
        title: "风洞雕琢流线车头",
        beats: [
          {
            id: 0,
            action: "在航空风洞中雕琢不锈钢水滴形子弹头车体",
            title: "航空风洞雕琢子弹头",
            body: "先锋工业设计师在航空风洞中打磨出泪滴形不锈钢蒙皮车头，将列车高速空气阻力骤降 40%。",
          },
          {
            id: 1,
            action: "全包覆裙板消除转向架紊流",
            title: "全包覆流线型下沉裙板",
            body: "贯通车底的折面裙板将车下气流顺畅导流穿过转向架，彻底消除了底部剧烈的空气涡流滞阻。",
          },
        ],
      },
      {
        id: 3,
        title: "西风号百英里飞驰",
        beats: [
          {
            id: 0,
            action: "打破丹佛至芝加哥无停站狂飙纪录",
            title: "13小时狂飙1015英里 (极速112.5MPH)",
            body: "1934年5月26日，先锋西风号（Pioneer Zephyr）创下 1015 英里黎明至黄昏不间断狂飙神话，极速达 112.5 英里/小时。",
          },
        ],
      },
      {
        id: 4,
        title: "二冲程柴油电传心脏",
        beats: [
          {
            id: 0,
            action: "搭载轻量化温顿二冲程直流电传动引擎",
            title: "600马力两冲程柴油电传",
            body: "温顿 8-201A 两冲程单流扫气柴油机将推重比翻倍，通过直流牵引电动机输出源源不断的平滑动力。",
          },
        ],
      },
      {
        id: 5,
        title: "工业速度黄金时代",
        beats: [
          {
            id: 0,
            action: "总结装饰艺术与速度机械的巅峰融合",
            title: "银色钢铁与速度的圣殿",
            body: "闪耀的不锈钢流线型机车绝非单纯的交通工具，它是机器时代将速度、工程与工业乐观主义熔铸成的终极移动雕塑。",
          },
        ],
      },
    ],
  },
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
}: TopicStageProps) {
  const currentMetadata = metadata[language];

  return (
    <div className={styles.root}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="push-x"
        transitionMap={{
          "1->2": "push-x",
          "2->3": "push-x",
          "3->4": "slide-x",
          "4->5": "crossfade",
        }}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{
          2: "motion",
        }}
        renderScene={(sceneId, sceneBeat) => {
          const currentScene = currentMetadata.scenes.find(
            (s) => s.id === sceneId,
          );
          if (!currentScene) return null;
          const currentBeat =
            currentScene.beats[sceneBeat] || currentScene.beats[0];

          return (
            <div className={styles.track}>
              <header className={styles.decoArchHeader}>
                <span>
                  {language === "zh"
                    ? "装饰艺术 · 流线型时代"
                    : "MACHINE AGE DECO // STREAMLINER ERA"}
                </span>
                <span>CHEVRON 0{sceneId} // 112.5 MPH</span>
              </header>

              <div
                className={styles.monumentalBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.decoKicker}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  THE MONUMENT OF STAINLESS STEEL
                </div>
                <h1
                  className={styles.sceneTitle}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.sceneBody}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {currentBeat.body}
                </p>
              </div>

              <footer className={styles.decoFooter}>
                <span>BURLINGTON ZEPHYR // MAY 26, 1934</span>
                <span>CHICAGO CENTURY OF PROGRESS EXHIBITION</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "diesel-streamliner-train",
  styleId: "machine-age-deco",
  title: { en: "Diesel Streamliner Era", zh: "柴油流线型机车" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "push-x",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Dawn of the Streamliners (Burlington Route Historical Society)",
        url: "https://www.burlingtonroute.org/history/zephyrs/",
        supports:
          "1,015 mile dawn-to-dusk speed dash and Winton 201A two-stroke diesel traction.",
      },
    ],
  },
});

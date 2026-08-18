import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./deep-sea-cables-cut.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Undersea Cable Splicing: 4,000-Meter Deep Ocean Fiber Recovery",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#f7f4ec",
      ink: "#121212",
      panel: "#ffffff",
    },
    typography: {
      header: "Times New Roman 800",
      body: "Times New Roman 400",
    },
    tags: ["journalism", "broadsheet", "telecom", "subsea", "engineering"],
    fonts: ["Times New Roman", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "Seismic Abyssal Rupture",
        beats: [
          {
            id: 0,
            action: "Report subsea earthquake cable blackout",
            title: "Abyssal Turbidity Current Snap",
            body: "A submarine earthquake triggers a high-velocity sediment slide across the Luzon Strait, severing 8 trans-Pacific optical cables in seconds.",
          },
        ],
      },
      {
        id: 2,
        title: "Optical Time-Domain Sonar",
        beats: [
          {
            id: 0,
            action: "Pinpoint fracture fault via Rayleigh backscattering",
            title: "Coherent OTDR Distance Pinpoint",
            body: "Coastal stations shoot laser pulses down dark fiber cores, calculating the break location at 3,842.6 kilometers by backscatter loss.",
          },
          {
            id: 1,
            action: "Deploy autonomous deep grapple ROV",
            title: "Deep Grapple Deployment",
            body: "Specialized cable ship 'CS Responder' lowers heavy titanium grapnels 4,000 meters into total darkness to snag the severed arm.",
          },
        ],
      },
      {
        id: 3,
        title: "Shipboard Cleanroom Fusion",
        beats: [
          {
            id: 0,
            action: "Hoist severed fiber into cleanroom splicing bay",
            title: "Cleanroom Core Fusion Splicing",
            body: "Marine cable engineers cleave 192 glass hair cores, aligning 9-micron silica centers under microscopic electric arc fusion.",
          },
          {
            id: 1,
            action: "Seal joint inside berthing biconical joint housing",
            title: "High-Pressure Biconical Casing",
            body: "Polyethylene insulation and steel armor are hot-vulcanized to withstand 40 megapascals of corrosive hydrostatic pressure.",
          },
        ],
      },
      {
        id: 4,
        title: "Subsea Seabed Reburial",
        beats: [
          {
            id: 0,
            action: "Water-jet plow reburies cable beneath ocean floor sediment",
            title: "Hydro-Jet Seabed Trenching",
            body: "An underwater robotic plow shoots high-pressure water jets, entrenching the joint 2 meters beneath the silt against trawler anchors.",
          },
        ],
      },
      {
        id: 5,
        title: "400 Tbps Restored",
        beats: [
          {
            id: 0,
            action: "Broadcast return of transatlantic traffic",
            title: "Transoceanic Photons Flowing",
            body: "Coherent laser transceivers sync; 400 Terabits per second of global data reignite the digital pulse of modern civilization.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "跨洋海缆割接：4000米深海光纤紧急打捞与熔接纪实",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#f7f4ec",
      ink: "#121212",
      panel: "#ffffff",
    },
    typography: {
      header: "Times New Roman 800",
      body: "Times New Roman 400",
    },
    tags: ["大报头版", "新闻", "通信", "深海工程", "海缆"],
    fonts: ["Times New Roman", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "深海浊流瞬断",
        beats: [
          {
            id: 0,
            action: "报道海底地震引发的跨洋通信大中断",
            title: "海底浊流导致跨洋光缆瞬断",
            body: "吕宋海峡发生强烈海底地震引发高速泥沙浊流，瞬间扯断 8 条跨太平洋核心光缆，造成跨洋通信大面积中断。",
          },
        ],
      },
      {
        id: 2,
        title: "光时域雷达声呐定位",
        beats: [
          {
            id: 0,
            action: "通过瑞利散射精准测定断点公里数",
            title: "相干 OTDR 测距精准锁点",
            body: "沿海登陆站向暗光纤发射高能激光脉冲，依靠瑞利背向散射耗散时间，在数秒内锁定 3842.6 公里处的断裂坐标。",
          },
          {
            id: 1,
            action: "特种打捞船下放深海抓钩",
            title: "4000米深水重型抓钩下潜",
            body: "万吨级海缆工程船抵临风暴海域，向 4000 米黑暗深海下放钛合金重型抓斗，盲探钩取沉入海底的断裂海缆端头。",
          },
        ],
      },
      {
        id: 3,
        title: "船载无尘舱熔接",
        beats: [
          {
            id: 0,
            action: "将海缆吊入船载千级无尘舱熔接",
            title: "千级无尘舱电弧熔接",
            body: "海缆工程师在显微镜下精准切割 192 芯头发丝般细的玻璃光纤，以微秒电弧放电完成 9 微米纤芯的纳米级熔合。",
          },
          {
            id: 1,
            action: "套入双锥形高压密封接头盒",
            title: "40兆帕抗压密封接头盒",
            body: "聚乙烯绝缘层与高强钢丝铠装经高压热硫化注塑封死，确保其能抵御深海 40 兆帕的毁灭性静水腐蚀高压。",
          },
        ],
      },
      {
        id: 4,
        title: "海床高压水冲埋设",
        beats: [
          {
            id: 0,
            action: "水下遥控挖沟机将海缆深埋泥沙下",
            title: "水下射流机器人深水掩埋",
            body: "水下机器人喷射超高压水流冲开海床泥沙，将修复后的海缆接头深埋于海床 2 米以下，彻底规避渔船拖网风险。",
          },
        ],
      },
      {
        id: 5,
        title: "400Tbps 重获光明",
        beats: [
          {
            id: 0,
            action: "全波段相干光波重明，通报全球",
            title: "400 Tbps 跨洋光子重明",
            body: "相干激光收发机握手成功；每秒 400 兆兆比特的全球信息流跨越重洋，再度点亮了全球数字文明的脉动。",
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
          3: "motion",
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
              <header className={styles.nameplate}>
                <span className={styles.paperTitle}>
                  {language === "zh"
                    ? "全球海洋电信导报"
                    : "THE GLOBAL MARITIME DISPATCH"}
                </span>
                <span className={styles.editionDate}>
                  VOL. CXIV NO. 42 // EDITION 0{sceneId}
                </span>
              </header>

              <div
                className={styles.headlineBlock}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.kicker}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  SPECIAL MARITIME REPORT // SUBSEA ENGINEERING
                </div>
                <h1
                  className={styles.mainHeadline}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>

                <div
                  className={styles.columnsLayout}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <p className={`${styles.columnBody} ${styles.leadDropcap}`}>
                    {currentBeat.body}
                  </p>
                  <p className={styles.columnBody}>
                    Deep oceanic fiber splicing requires absolute cleanroom
                    purity amid high-seas pitch and roll. A single micro-bubble
                    induces catastrophic attenuation.
                  </p>
                  <p className={styles.columnBody}>
                    Hydrostatic test protocols subject the repaired joint
                    housing to continuous 40 MPa helium hermetic seal
                    verification before release.
                  </p>
                </div>
              </div>

              <footer className={styles.broadsheetFooter}>
                <span>PAGE A{sceneId} // SPECIAL REPORT</span>
                <span>WIRE SERVICE: ABYSSAL ENGINEERING BUREAU</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "deep-sea-cables-cut",
  styleId: "front-page-broadsheet",
  title: { en: "Undersea Cable Splicing", zh: "跨洋海缆割接" },
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
        title: "Submarine Cable Map & Fault Restoration Standards (ITU-T L.28)",
        url: "https://www.itu.int/rec/T-REC-L.28",
        supports:
          "Subsea optical cable repair procedures and hydrostatic joint reliability.",
      },
    ],
  },
});

import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./bespoke-perfume-pyramid.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Olfactory Architecture: The Tripartite Evaporation Pyramid",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#080808",
      ink: "#f5f5f0",
      panel: "#161616",
    },
    typography: {
      header: "Playfair Display 700",
      body: "Cormorant Garamond 400",
    },
    tags: ["perfumery", "luxury", "after-hours", "chemistry", "olfactory"],
    fonts: ["Playfair Display", "Cormorant Garamond", "serif"],
    scenes: [
      {
        id: 1,
        title: "Volatility Gradient",
        beats: [
          {
            id: 0,
            action: "Map molecular weights to evaporation velocities",
            title: "Physics of Molecular Volatility",
            body: "A bespoke fragrance is an unfolding temporal sculpture governed by vapor pressures and molecular weight differentials.",
          },
        ],
      },
      {
        id: 2,
        title: "Top Notes: Citrus & Aldehyde",
        beats: [
          {
            id: 0,
            action: "Release high-volatility terpenes and sparkling aldehydes",
            title: "The 15-Minute Luminous Opening",
            body: "Calabrian bergamot and aliphatic aldehydes explode instantly on skin contact, evaporating cleanly within fifteen minutes.",
          },
          {
            id: 1,
            action: "Create the ephemeral introductory illusion",
            title: "The First Olfactory Impression",
            body: "Top notes serve as an acoustic overture, introducing brightness before yielding the stage to denser floral molecules.",
          },
        ],
      },
      {
        id: 3,
        title: "Heart Notes: Damask Accord",
        beats: [
          {
            id: 0,
            action: "Reveal the four-hour heart of Damask rose and orris root",
            title: "The 4-Hour Harmonic Heart",
            body: "Centifolia rose, jasmine grandiflorum, and powdery orris root form the core melodic theme, sustaining projection for four full hours.",
          },
        ],
      },
      {
        id: 4,
        title: "Base Notes: Resin & Oud",
        beats: [
          {
            id: 0,
            action: "Anchor the structure with high-mass oud, amber, and musk",
            title: "24-Hour Heavy Molecular Anchor",
            body: "Low-volatility sesquiterpenes in aged Cambodian oud and ambergris bond with epidermal lipids, lingering on silk and skin for days.",
          },
        ],
      },
      {
        id: 5,
        title: "Nocturnal Sillage & Maturation",
        beats: [
          {
            id: 0,
            action: "Synthesize the lingering sillage after midnight",
            title: "The Midnight Sillage Aura",
            body: "Through six months of maceration in dark glass, hundreds of volatile essences marry into a seamless nocturnal identity.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "嗅觉金字塔：高级定制香水的三段式挥发建筑学",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#080808",
      ink: "#f5f5f0",
      panel: "#161616",
    },
    typography: {
      header: "Playfair Display 700",
      body: "Cormorant Garamond 400",
    },
    tags: ["调香", "奢华", "深夜", "化学", "嗅觉艺术"],
    fonts: ["Playfair Display", "Cormorant Garamond", "serif"],
    scenes: [
      {
        id: 1,
        title: "挥发速率物理分层",
        beats: [
          {
            id: 0,
            action: "根据分子量与饱和蒸气压建立嗅觉金字塔梯度",
            title: "分子挥发度的物理学分层",
            body: "高级定制香水是一座由挥发速率精确编织的时间雕塑，分子的饱和蒸气压决定了气味随时间渐次绽放的秩序。",
          },
        ],
      },
      {
        id: 2,
        title: "前调柑橘与醛类瞬态",
        beats: [
          {
            id: 0,
            action: "释放高挥发性单萜烯与闪烁的脂肪族醛",
            title: "15 分钟的耀眼开场奏鸣",
            body: "卡拉布里亚佛手柑与 C12 醛在接触皮肤瞬间爆发出清脆光芒，在最初的 15 分钟内快速挥发殆尽。",
          },
          {
            id: 1,
            action: "构建引人入胜的第一嗅觉印象",
            title: "第一印象的嗅觉序幕",
            body: "前调如同一场华丽歌剧的序曲，以极高的扩散力点亮空间，随后优雅退场并将舞台交由更厚重的中调分子。",
          },
        ],
      },
      {
        id: 3,
        title: "中调大马士革玫瑰骨架",
        beats: [
          {
            id: 0,
            action: "展现持续 4 小时的大马士革玫瑰与鸢尾根主调",
            title: "持续 4 小时的和声花香核心",
            body: "千叶玫瑰精油、格拉斯茉莉与贵重的鸢尾根酮构成香水的心脏骨架，在随后的四个小时内稳定释放圆润丰满的香气。",
          },
        ],
      },
      {
        id: 4,
        title: "后调龙涎香与沉香固着",
        beats: [
          {
            id: 0,
            action: "以大分子沉香木、龙涎香与天然麝香锁死挥发",
            title: "24 小时大分子固香基底",
            body: "重分子量倍半萜与老挝沉香同皮肤油脂紧密吸附，极低的挥发速率赋予了整支香水跨越昼夜的长效留香锚点。",
          },
        ],
      },
      {
        id: 5,
        title: "暗夜余韵与时间醇化",
        beats: [
          {
            id: 0,
            action: "总结暗夜中经数月陈化熟成的气味光环",
            title: "午夜专属的迷离余韵光环",
            body: "在深色避光玻璃瓶中历经六个月的浸渍陈化，数百种挥发性芳香分子完美熔融，在深夜散发出不可复制的私享气场。",
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
        transitionKind="crossfade"
        transitionMap={{
          "1->2": "crossfade",
          "2->3": "crossfade",
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
              <div className={styles.luxeHeader}>
                <span className={styles.goldBrand}>HAUTE PARFUMERIE // PRIVATE RESERVE</span>
                <span className={styles.extractRatio}>EXTRAIT DE PARFUM 32%</span>
              </div>

              <div
                className={styles.luxeCard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.goldSubtitle}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {language === "zh" ? "三段式嗅觉金字塔架构" : "THE OLFACTORY PYRAMID ARCHITECTURE"}
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

                <div
                  className={styles.tierGrid}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.tierCell}>
                    <div className={styles.tierName}>TOP NOTES</div>
                    <div className={styles.tierDesc}>Bergamot / C12 Aldehyde (0-15m)</div>
                  </div>
                  <div className={styles.tierCell}>
                    <div className={styles.tierName}>HEART NOTES</div>
                    <div className={styles.tierDesc}>Damask Rose / Orris (15m-4h)</div>
                  </div>
                  <div className={styles.tierCell}>
                    <div className={styles.tierName}>BASE NOTES</div>
                    <div className={styles.tierDesc}>Aged Oud / Ambergris (4h-24h+)</div>
                  </div>
                </div>
              </div>

              <div className={styles.luxeFooter}>
                <span>MACERATION PERIOD: 180 DAYS</span>
                <span>GRASSE, FRANCE // NOCTURNE BLEND</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "bespoke-perfume-pyramid",
  styleId: "after-hours-luxe",
  title: { en: "Bespoke Perfume Pyramid", zh: "高定香水金字塔" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "crossfade",
    "2->3": "crossfade",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "mixed",
    display: "envelope",
    sources: [
      {
        title: "Perfumery: Practice and Principles (Robert R. Calkin, J. Stephan Jellinek)",
        url: "https://www.wiley.com/en-us/Perfumery%3A+Practice+and+Principles-p-9780471589341",
        supports:
          "Evaporation curve physics, top/heart/base note classification, and maceration standards.",
      },
    ],
    boundary: {
      en: "Illustrates the olfactory pyramid concept and molecular volatility dynamics.",
      zh: "呈现高级定制香水的三段式挥发金字塔架构与分子挥发物理学原理。",
    },
  },
});

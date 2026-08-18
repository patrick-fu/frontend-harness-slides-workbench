import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./origami-crease-patterns.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Mountain and Valley: Geometry and Stiffness from Flat Paper",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#fdf6ec",
      ink: "#4a4036",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 700",
      body: "System-ui 400",
    },
    tags: ["origami", "geometry", "mathematics", "design", "pastel"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "The Flat Sheet",
        beats: [
          {
            id: 0,
            action: "Demonstrate zero bending stiffness of planar paper",
            title: "Planar Sheet Flexibility",
            body: "A flat sheet of cellulose lacks out-of-plane stiffness, bending helplessly under its own microscopic weight.",
          },
        ],
      },
      {
        id: 2,
        title: "Mountain and Valley Rules",
        beats: [
          {
            id: 0,
            action: "Define alternating mountain and valley crease lines",
            title: "Alternating Crease Geometries",
            body: "Red solid lines designate mountain folds (convex up); blue dashed lines mark valley folds (concave down).",
          },
          {
            id: 1,
            action: "State Maekawa's parity theorem",
            title: "Maekawa's Parity Theorem",
            body: "At any flat-foldable vertex, the number of mountain and valley folds differs by exactly 2: $|M - V| = 2$.",
          },
        ],
      },
      {
        id: 3,
        title: "The Miura-ori Grid",
        beats: [
          {
            id: 0,
            action: "Tile tessellated parallelogram facets",
            title: "Tessellated Parallelogram Tessellation",
            body: "Rigid parallelogram facets interlock into the Miura-ori pattern, converting planar flexure into a 3D structural truss.",
          },
          {
            id: 1,
            action: "Demonstrate negative Poisson's ratio expansion",
            title: "Auxetic Bi-Axial Deployment",
            body: "Pulling a single corner expands the entire sheet simultaneously in both dimensions with zero torsional jamming.",
          },
        ],
      },
      {
        id: 4,
        title: "Rigid Origami in Space",
        beats: [
          {
            id: 0,
            action: "Deploy solar panel arrays from compact cylindrical payloads",
            title: "Spacecraft Solar Array Packing",
            body: "Satellite solar panels fold into compact launch fairings, unfurling in orbit purely through mechanical hinge kinematics.",
          },
        ],
      },
      {
        id: 5,
        title: "Form from Flatness",
        beats: [
          {
            id: 0,
            action: "Affirm emergence of strength through folded pattern",
            title: "Structure Born of Gentle Folds",
            body: "Flatness is not weakness—a single deliberate fold transforms fragile paper into an architectural marvel.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "折痕山谷：一张薄纸如何通过折叠获得三维结构刚度",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#fdf6ec",
      ink: "#4a4036",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 700",
      body: "System-ui 400",
    },
    tags: ["折纸", "几何", "数学", "设计", "柔和粉彩"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "平面的刚度极限",
        beats: [
          {
            id: 0,
            action: "展示平整纸面在重力下的脆弱下垂",
            title: "平整平面的柔顺极限",
            body: "一张完全平整的纤维纸张缺乏面外抗弯刚度，在自身微小的重力作用下便会弯曲下垂。",
          },
        ],
      },
      {
        id: 2,
        title: "前川定理山谷交替",
        beats: [
          {
            id: 0,
            action: "定义山折与谷折几何线条",
            title: "山折与谷折线定义",
            body: "红色实线代表凸起的山折（Mountain），蓝色虚线代表凹陷的谷折（Valley）。",
          },
          {
            id: 1,
            action: "阐述前川定理奇偶性约束",
            title: "前川定理奇偶法则",
            body: "在任何可平坦折叠的单节点处，相交的山折与谷折数量之差恒等于 2：$|M - V| = 2$。",
          },
        ],
      },
      {
        id: 3,
        title: "三浦折叠连续律",
        beats: [
          {
            id: 0,
            action: "平铺平行四边形互锁网格",
            title: "平行四边形空间桁架",
            body: "刚性平行四边形面元规律排列为三浦折叠（Miura-ori），将二维纸面转变为坚固的三维结构桁架。",
          },
          {
            id: 1,
            action: "展示负泊松比双向同步展开",
            title: "拉胀双向自发展开",
            body: "仅仅对角轻拉一个角，整个三维阵列便会在两个正交维度同时展开，毫无机械卡滞。",
          },
        ],
      },
      {
        id: 4,
        title: "刚性折叠空间收纳",
        beats: [
          {
            id: 0,
            action: "展示卫星太阳翼紧凑火箭发射收纳",
            title: "航天太阳翼折叠封装",
            body: "空间站巨型太阳能电池翼在发射舱内折叠为紧凑圆柱体，入轨后完全依靠铰链运动学自动舒展。",
          },
        ],
      },
      {
        id: 5,
        title: "秩序带来力量",
        beats: [
          {
            id: 0,
            action: "总结折叠几何创造的优雅力量",
            title: "折痕即是结构力量",
            body: "平整绝非脆弱——一道经过深思熟虑的折痕，便能让柔软的纸张蜕变出承载万物的几何刚度。",
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
        transitionKind="fade"
        transitionMap={{
          "1->2": "fade",
          "2->3": "crossfade",
          "3->4": "slide-x",
          "4->5": "fade",
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
              <div
                className={styles.pastelPillCard}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.pillBadge}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  🌸 ORIGAMI GEOMETRY // 0{sceneId}
                </div>
                <h1
                  className={styles.sceneTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.sceneBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>

                <div
                  className={styles.creaseRow}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.creaseBox}>
                    <div className={styles.creaseLabel}>▲ MOUNTAIN (M)</div>
                    <p className={styles.creaseDesc}>
                      {language === "zh"
                        ? "凸起折痕向上隆起"
                        : "Convex upward ridge lines"}
                    </p>
                  </div>
                  <div className={styles.creaseBox}>
                    <div className={styles.creaseLabel}>▼ VALLEY (V)</div>
                    <p className={styles.creaseDesc}>
                      {language === "zh"
                        ? "凹陷折痕向下汇聚"
                        : "Concave downward valley lines"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "origami-crease-patterns",
  styleId: "soft-pastel-friendly",
  title: { en: "Mountain and Valley", zh: "折痕山谷" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "fade",
    "2->3": "crossfade",
    "3->4": "slide-x",
    "4->5": "fade",
  },
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Mathematical origami principles illustrated through folding diagrams.",
      zh: "折纸数学几何原理图解，展示从平整纸面到刚性结构的形态演进。",
    },
    display: "envelope",
  },
});

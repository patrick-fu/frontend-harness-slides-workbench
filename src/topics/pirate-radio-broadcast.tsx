import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./pirate-radio-broadcast.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Pirate Radio Broadcast: Guerrilla Transmitters and Open Airwaves",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#fdf6e2",
      ink: "#1e1b4b",
      panel: "#fef3c7",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["radio", "zine", "riso", "broadcast", "counterculture"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "Monopoly of the Airwaves",
        beats: [
          {
            id: 0,
            action: "Expose state radio frequency monopoly in 1960s Europe",
            title: "The Static Airwave Monopoly",
            body: "State broadcasting monopolies barred rock, jazz, and underground youth culture from AM radio dials, hoarding frequencies.",
          },
        ],
      },
      {
        id: 2,
        title: "Rusty Masts in International Waters",
        beats: [
          {
            id: 0,
            action: "Anchor decommissioned cargo ship outside 3-mile territorial limit",
            title: "Extraterritorial Ship Anchors",
            body: "Decommissioned fishing trawlers dropped anchor in international waters, mounting 50-meter lattice dipole antenna masts beyond state jurisdiction.",
          },
          {
            id: 1,
            action: "Power up 50kW tube RF transmitters",
            title: "50kW Thermionic Tube Power",
            body: "Diesel generator banks hummed below deck, pumping 50,000 watts of high-frequency RF power straight into saltwater ground planes.",
          },
        ],
      },
      {
        id: 3,
        title: "Signal Penetrating the Coast",
        beats: [
          {
            id: 0,
            action: "Broadcast soul and rock across 200 miles of coastline",
            title: "200 Miles of Unfiltered Sound",
            body: "At 199 meters medium wave, unlicensed signals penetrated coastal bedroom transistor receivers with roaring electric guitar riffs.",
          },
        ],
      },
      {
        id: 4,
        title: "Guerrilla Rooftop Antennas",
        beats: [
          {
            id: 0,
            action: "Deploy stealth FM dipole antennas on tower block rooftops",
            title: "Tower Block Rooftop Relays",
            body: "Urban pirate crews bolted microwave links to council estate elevator shafts, relaying live studio cassette decks across metropolitan skies.",
          },
        ],
      },
      {
        id: 5,
        title: "The Airwaves Belong to the People",
        beats: [
          {
            id: 0,
            action: "Celebrate the democratization of public broadcast spectrum",
            title: "The Ether Reclaimed Forever",
            body: "Solder, wire, and courage broke the state monopoly, proving the electromagnetic spectrum belongs to the human voice.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "海盗电台发射台：地下游击发射机与自由电波革命",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#fdf6e2",
      ink: "#1e1b4b",
      panel: "#fef3c7",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["电台", "孔版印刷", "海盗电台", "广播", "反叛文化"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "国家广播频段垄断",
        beats: [
          {
            id: 0,
            action: "揭露 1960 年代欧洲国家电台对青年文化的封锁",
            title: "僵死停滞的电波垄断",
            body: "国家公共广播垄断机构对摇滚乐、摩城音乐与地下文化实施严密频率封锁，青年一代无处发声。",
          },
        ],
      },
      {
        id: 2,
        title: "公海生锈货船天线",
        beats: [
          {
            id: 0,
            action: "退役货船抛锚于 3 海里领海之外避开管辖",
            title: "领海之外的孤胆抛锚",
            body: "退役渔船驶入不受国家法律管辖的公海海域，在摇晃的甲板上立起 50 米高的重型偶极发射天线天桅。",
          },
          {
            id: 1,
            action: "柴油发电机驱动 50kW 电子管功放",
            title: "50kW 电子管巨力轰鸣",
            body: "甲板下柴油发电机组全速轰鸣，向海水地线注入 50,000 瓦超高频射频能量，刺破海风阻隔。",
          },
        ],
      },
      {
        id: 3,
        title: "穿透海岸的重低音",
        beats: [
          {
            id: 0,
            action: "中波信号覆盖 200 英里海岸线收音机",
            title: "200 英里无遮挡重低音",
            body: "在中波 199 米波段，未获许可的自由信号穿透数百万沿海年轻人的半导体收音机，吉他失真轰鸣回荡夜空。",
          },
        ],
      },
      {
        id: 4,
        title: "楼顶游击微波中继",
        beats: [
          {
            id: 0,
            action: "城市高层电梯井架设隐形 FM 偶极天线",
            title: "高楼电梯井隐蔽中继",
            body: "城市游击电台团队将微波发射机伪装固定在高层公屋电梯井外侧，跨越警察侦测网直播地下磁带混音。",
          },
        ],
      },
      {
        id: 5,
        title: "电波终归自由",
        beats: [
          {
            id: 0,
            action: "宣告公共电磁频谱的彻底民主化",
            title: "电磁以太的永恒解放",
            body: "焊锡、铜线与无畏的勇气粉碎了官僚垄断，证明了电磁波从来不是特权的囚笼，而是属于每个人的自由之声。",
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
          "3->4": "push-x",
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
              <header className={styles.zineHeader}>
                <span>
                  {language === "zh"
                    ? "地下电波孔版印刷杂志"
                    : "PIRATE RADIO ZINE // ISSUE 04"}
                </span>
                <span>MW 199M // HIGH VOLTAGE</span>
              </header>

              <div
                className={styles.zineBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.frequencyStamp}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  TRANSMITTER STATUS: ON AIR // 50,000 WATTS
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

              <footer className={styles.zineFooter}>
                <span>PRINTED VIA 2-COLOR RISOGRAPH DRUM</span>
                <span>RADIO CAROLINE & GUERRILLA SPECTRAL ARCHIVE</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "pirate-radio-broadcast",
  styleId: "riso-print-zine",
  title: { en: "Pirate Radio Broadcast", zh: "海盗电台发射台" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "push-x",
    "3->4": "push-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title:
          "The Ship That Rocked the World: How Radio Caroline Defied the Law",
        url: "https://www.worldradiohistory.com/Archive-Books/Pirate-Radio.htm",
        supports:
          "Offshore broadcast engineering, 50kW transmitter power, and Marine Offences Act history.",
      },
    ],
  },
});

import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { TopicStageProps } from "../domain/topic";
import { makeTopicDefinition } from "./topic-fixture";
import { runTopicContract } from "./topic-contract";

const fixture = makeTopicDefinition({
  id: "contract-fixture",
  styleId: "fixture-style",
});
fixture.title = { en: "Contract Fixture", zh: "契约夹具" };
fixture.Stage = function TopicStage({
  scene,
  beat,
  reducedMotion,
}: TopicStageProps) {
  return (
    <SpatialSceneTrack
      scene={scene}
      beat={beat}
      transitionKind="hard-cut"
      reducedMotion={reducedMotion}
      renderScene={(sceneId) => <div>{sceneId}</div>}
    />
  );
};

runTopicContract(fixture);

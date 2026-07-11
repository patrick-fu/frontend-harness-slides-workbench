import { makeTopicDefinition } from "./topic-fixture";
import { runTopicContract } from "./topic-contract";

runTopicContract(
  makeTopicDefinition({ id: "contract-fixture", styleId: "fixture-style" }),
);

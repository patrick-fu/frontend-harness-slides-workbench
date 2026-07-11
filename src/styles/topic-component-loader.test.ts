import { describe, expect, it, vi } from "vitest";
import type { ComponentType } from "react";
import type { BespokeStyleProps } from "../types";
import {
  loadTopicComponent,
  prefetchAdjacentTopicComponents,
  type LoadableStyleRegistry,
  type TopicComponentLoader,
} from "./topic-component-loader";

const ComponentA: ComponentType<BespokeStyleProps> = () => null;
const ComponentB: ComponentType<BespokeStyleProps> = () => null;
const ComponentC: ComponentType<BespokeStyleProps> = () => null;

function loaderFor(
  component: ComponentType<BespokeStyleProps>,
): TopicComponentLoader {
  return vi.fn(async () => component);
}

function registry(
  loaders: TopicComponentLoader[],
): LoadableStyleRegistry {
  return [
    {
      id: "first-style",
      topics: [
        { id: "first", loadComponent: loaders[0] },
        { id: "second", loadComponent: loaders[1] },
      ],
    },
    {
      id: "second-style",
      topics: [{ id: "third", loadComponent: loaders[2] }],
    },
  ];
}

describe("loadTopicComponent", () => {
  it("shares one in-flight and completed request for the same Topic loader", async () => {
    const loader = loaderFor(ComponentA);

    const [first, second] = await Promise.all([
      loadTopicComponent(loader),
      loadTopicComponent(loader),
    ]);

    expect(first).toBe(ComponentA);
    expect(second).toBe(ComponentA);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("evicts a rejected request so a later explicit retry can load the Topic", async () => {
    const loader = vi
      .fn<TopicComponentLoader>()
      .mockRejectedValueOnce(new Error("chunk unavailable"))
      .mockResolvedValueOnce(ComponentA);

    await expect(loadTopicComponent(loader)).rejects.toThrow("chunk unavailable");
    await expect(loadTopicComponent(loader)).resolves.toBe(ComponentA);

    expect(loader).toHaveBeenCalledTimes(2);
  });
});

describe("prefetchAdjacentTopicComponents", () => {
  it("warms the next and previous Topics in navigation order, without loading the current Topic", async () => {
    const first = loaderFor(ComponentA);
    const second = loaderFor(ComponentB);
    const third = loaderFor(ComponentC);

    await prefetchAdjacentTopicComponents(
      registry([first, second, third]),
      "first-style",
      "second",
    );

    expect(second).not.toHaveBeenCalled();
    expect(third).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledTimes(1);
  });

  it("wraps at the catalog boundary and does not prefetch the current Topic twice", async () => {
    const only = loaderFor(ComponentA);

    await prefetchAdjacentTopicComponents(
      [{ id: "only-style", topics: [{ id: "only-topic", loadComponent: only }] }],
      "only-style",
      "only-topic",
    );

    expect(only).not.toHaveBeenCalled();
  });

  it("contains a prefetch failure so it does not create an unhandled Player error", async () => {
    const first = loaderFor(ComponentA);
    const unavailable = vi.fn<TopicComponentLoader>().mockRejectedValue(
      new Error("offline"),
    );
    const third = loaderFor(ComponentC);

    await expect(
      prefetchAdjacentTopicComponents(
        registry([first, unavailable, third]),
        "first-style",
        "first",
      ),
    ).resolves.toBeUndefined();

    expect(unavailable).toHaveBeenCalledTimes(1);
    expect(third).toHaveBeenCalledTimes(1);
  });
});

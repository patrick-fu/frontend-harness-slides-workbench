import { describe, expect, it, vi } from "vitest";
import { parsePublicationArgs, runPublicationCli } from "./cli.mjs";

const known = ["first-topic", "second-topic"];

describe("Publication CLI", () => {
  it("accepts repeatable Topic selectors in caller order", () => {
    expect(
      parsePublicationArgs(
        ["capture", "--topic", "second-topic", "--topic", "first-topic"],
        known,
      ),
    ).toEqual({
      command: "capture",
      all: false,
      topicIds: ["second-topic", "first-topic"],
    });
    expect(parsePublicationArgs(["capture", "--all"], known)).toEqual({
      command: "capture",
      all: true,
      topicIds: [],
    });
  });

  it.each([
    [[], "Usage:"],
    [["capture"], "requires --topic <id> or --all"],
    [["capture", "--topic"], "requires a Topic ID"],
    [["capture", "--topic", "missing"], 'Unknown Topic ID "missing"'],
    [["capture", "--topic", "first-topic", "--topic", "first-topic"], 'Duplicate Topic selector "first-topic"'],
    [["capture", "--all", "--topic", "first-topic"], "cannot combine --all with --topic"],
    [["capture", "--all", "--all"], "Duplicate --all selector"],
    [["capture", "--wat"], 'Unknown capture option "--wat"'],
    [["verify", "extra"], 'Command "verify" does not accept arguments'],
  ])("rejects invalid argv %#", (argv, message) => {
    expect(() => parsePublicationArgs(argv, known)).toThrow(message);
  });

  it("rejects selector-free capture before loading any adapter", async () => {
    const dependencies = {
      loadKnownTopicIds: vi.fn(),
      assertCurrentPublicationPlan: vi.fn(),
      capture: vi.fn(),
      manifest: vi.fn(),
      verify: vi.fn(),
      clean: vi.fn(),
    };

    await expect(runPublicationCli(["capture"], dependencies)).rejects.toThrow(
      "requires --topic <id> or --all",
    );
    expect(dependencies.loadKnownTopicIds).not.toHaveBeenCalled();
    expect(dependencies.assertCurrentPublicationPlan).not.toHaveBeenCalled();
    expect(dependencies.capture).not.toHaveBeenCalled();
  });

  it("rejects an unknown Topic before loading the current plan", async () => {
    const dependencies = {
      loadKnownTopicIds: vi.fn(async () => known),
      assertCurrentPublicationPlan: vi.fn(),
      capture: vi.fn(),
      manifest: vi.fn(),
      verify: vi.fn(),
      clean: vi.fn(),
    };

    await expect(
      runPublicationCli(["capture", "--topic", "missing"], dependencies),
    ).rejects.toThrow('Unknown Topic ID "missing"');
    expect(dependencies.assertCurrentPublicationPlan).not.toHaveBeenCalled();
    expect(dependencies.capture).not.toHaveBeenCalled();
  });

  it("validates known Topics before invoking the capture adapter", async () => {
    const dependencies = {
      loadKnownTopicIds: vi.fn(async () => known),
      assertCurrentPublicationPlan: vi.fn(async () => undefined),
      capture: vi.fn(async () => undefined),
      manifest: vi.fn(),
      verify: vi.fn(),
      clean: vi.fn(),
    };

    await runPublicationCli(
      ["capture", "--topic", "second-topic"],
      dependencies,
    );

    expect(dependencies.assertCurrentPublicationPlan).toHaveBeenCalledOnce();
    expect(dependencies.capture).toHaveBeenCalledWith({
      command: "capture",
      all: false,
      topicIds: ["second-topic"],
    });
    expect(dependencies.manifest).not.toHaveBeenCalled();
  });
});

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
      loadGeneratedSnapshot: vi.fn(),
      loadCurrentSnapshot: vi.fn(),
      assertFresh: vi.fn(),
      capture: vi.fn(),
      manifest: vi.fn(),
      verify: vi.fn(),
      clean: vi.fn(),
    };

    await expect(runPublicationCli(["capture"], dependencies)).rejects.toThrow(
      "requires --topic <id> or --all",
    );
    expect(dependencies.loadGeneratedSnapshot).not.toHaveBeenCalled();
    expect(dependencies.loadCurrentSnapshot).not.toHaveBeenCalled();
    expect(dependencies.capture).not.toHaveBeenCalled();
  });

  it("rejects an unknown Topic before loading the current plan", async () => {
    const generated = {
      targets: known.map((topicId) => ({ topicId })),
    };
    const dependencies = {
      loadGeneratedSnapshot: vi.fn(async () => generated),
      loadCurrentSnapshot: vi.fn(),
      assertFresh: vi.fn(),
      capture: vi.fn(),
      manifest: vi.fn(),
      verify: vi.fn(),
      clean: vi.fn(),
    };

    await expect(
      runPublicationCli(["capture", "--topic", "missing"], dependencies),
    ).rejects.toThrow('Unknown Topic ID "missing"');
    expect(dependencies.loadGeneratedSnapshot).toHaveBeenCalledOnce();
    expect(dependencies.loadCurrentSnapshot).not.toHaveBeenCalled();
    expect(dependencies.assertFresh).not.toHaveBeenCalled();
    expect(dependencies.capture).not.toHaveBeenCalled();
  });

  it("loads each Snapshot once, checks full freshness, and resolves selected targets in Plan order", async () => {
    const events = [];
    const generated = {
      manifest: [],
      stats: {},
      targets: [
        { topicId: "first-topic", previewFilename: "first.webp" },
        { topicId: "second-topic", previewFilename: "second.webp" },
        { topicId: "unrelated-topic", previewFilename: "unrelated.webp" },
      ],
      auditCases: {},
    };
    const current = structuredClone(generated);
    const dependencies = {
      loadGeneratedSnapshot: vi.fn(async () => {
        events.push("generated");
        return generated;
      }),
      loadCurrentSnapshot: vi.fn(async () => {
        events.push("current");
        return current;
      }),
      assertFresh: vi.fn(() => events.push("fresh")),
      capture: vi.fn(async () => events.push("capture")),
      manifest: vi.fn(),
      verify: vi.fn(),
      clean: vi.fn(),
    };

    await runPublicationCli(
      [
        "capture",
        "--topic",
        "second-topic",
        "--topic",
        "first-topic",
      ],
      dependencies,
    );

    expect(events).toEqual(["generated", "current", "fresh", "capture"]);
    expect(dependencies.loadGeneratedSnapshot).toHaveBeenCalledOnce();
    expect(dependencies.loadCurrentSnapshot).toHaveBeenCalledOnce();
    expect(dependencies.assertFresh).toHaveBeenCalledWith(current, generated);
    expect(dependencies.capture).toHaveBeenCalledWith({
      targets: current.targets.slice(0, 2),
      allTargets: current.targets,
      removeOrphans: false,
    });
    expect(dependencies.manifest).not.toHaveBeenCalled();
  });

  it("stops before capture when full-snapshot freshness fails", async () => {
    const generated = { targets: [{ topicId: "first-topic" }] };
    const current = structuredClone(generated);
    const dependencies = {
      loadGeneratedSnapshot: vi.fn(async () => generated),
      loadCurrentSnapshot: vi.fn(async () => current),
      assertFresh: vi.fn(() => {
        throw new Error("stale snapshot");
      }),
      capture: vi.fn(),
      manifest: vi.fn(),
      verify: vi.fn(),
      clean: vi.fn(),
    };

    await expect(
      runPublicationCli(
        ["capture", "--topic", "first-topic"],
        dependencies,
      ),
    ).rejects.toThrow("stale snapshot");

    expect(dependencies.capture).not.toHaveBeenCalled();
  });

  it("loads generated targets once and passes them to preview verification", async () => {
    const generated = {
      targets: [
        { topicId: "first-topic", previewFilename: "first.webp" },
        { topicId: "second-topic", previewFilename: "second.webp" },
      ],
    };
    const dependencies = {
      loadGeneratedSnapshot: vi.fn(async () => generated),
      loadCurrentSnapshot: vi.fn(),
      assertFresh: vi.fn(),
      capture: vi.fn(),
      manifest: vi.fn(),
      verify: vi.fn(async () => undefined),
      clean: vi.fn(),
    };

    await runPublicationCli(["verify"], dependencies);

    expect(dependencies.loadGeneratedSnapshot).toHaveBeenCalledOnce();
    expect(dependencies.verify).toHaveBeenCalledWith(generated.targets);
    expect(dependencies.loadCurrentSnapshot).not.toHaveBeenCalled();
    expect(dependencies.capture).not.toHaveBeenCalled();
  });
});

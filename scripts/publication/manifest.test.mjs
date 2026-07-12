// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import {
  createAtomicGeneratedWriter,
  createManifestPublication,
} from "./manifest.mjs";

const current = {
  manifest: [],
  stats: { styles: 1, topics: 1 },
  targets: [{ topicId: "first-topic" }],
  auditCases: {},
};

describe("Manifest Publication workflow", () => {
  it("loads once, validates source before rendering, and writes once", async () => {
    const events = [];
    const snapshot = {
      loadCurrent: vi.fn(async () => {
        events.push("load-current");
        return current;
      }),
      renderGenerated: vi.fn((value) => {
        events.push("render");
        return JSON.stringify(value);
      }),
    };
    const inventory = {
      validateSource: vi.fn(async () => {
        events.push("validate-source");
      }),
      validatePreviews: vi.fn(),
    };
    const writeGenerated = vi.fn(async () => {
      events.push("write");
    });
    const manifest = createManifestPublication({
      snapshot,
      inventory,
      writeGenerated,
      log: vi.fn(),
    });

    await manifest.generate();

    expect(events).toEqual([
      "load-current",
      "validate-source",
      "render",
      "write",
    ]);
    expect(snapshot.loadCurrent).toHaveBeenCalledOnce();
    expect(inventory.validateSource).toHaveBeenCalledWith(current.targets);
    expect(snapshot.renderGenerated).toHaveBeenCalledWith(current);
    expect(writeGenerated).toHaveBeenCalledOnce();
    expect(inventory.validatePreviews).not.toHaveBeenCalled();
  });

  it("does not render or write when source validation fails", async () => {
    const snapshot = {
      loadCurrent: vi.fn(async () => current),
      renderGenerated: vi.fn(),
    };
    const inventory = {
      validateSource: vi.fn(async () => {
        throw new Error("invalid source");
      }),
    };
    const writeGenerated = vi.fn();
    const manifest = createManifestPublication({
      snapshot,
      inventory,
      writeGenerated,
      log: vi.fn(),
    });

    await expect(manifest.generate()).rejects.toThrow("invalid source");
    expect(snapshot.loadCurrent).toHaveBeenCalledOnce();
    expect(snapshot.renderGenerated).not.toHaveBeenCalled();
    expect(writeGenerated).not.toHaveBeenCalled();
  });
});

describe("atomic generated writer", () => {
  it("writes a temporary artifact before atomically replacing the destination", async () => {
    const events = [];
    const writer = createAtomicGeneratedWriter({
      outputPath: "/repo/manifest.generated.ts",
      temporaryPath: "/repo/manifest.generated.ts.tmp",
      writeFile: vi.fn(async (...args) => events.push(["write", ...args])),
      rename: vi.fn(async (...args) => events.push(["rename", ...args])),
      remove: vi.fn(async (...args) => events.push(["remove", ...args])),
    });

    await writer("generated source");

    expect(events).toEqual([
      [
        "write",
        "/repo/manifest.generated.ts.tmp",
        "generated source",
        "utf8",
      ],
      [
        "rename",
        "/repo/manifest.generated.ts.tmp",
        "/repo/manifest.generated.ts",
      ],
    ]);
  });

  it.each(["write", "rename"])(
    "removes the temporary artifact after a %s failure",
    async (failure) => {
      const writeFile = vi.fn(async () => {
        if (failure === "write") throw new Error("write failed");
      });
      const rename = vi.fn(async () => {
        if (failure === "rename") throw new Error("rename failed");
      });
      const remove = vi.fn(async () => undefined);
      const writer = createAtomicGeneratedWriter({
        outputPath: "/repo/manifest.generated.ts",
        temporaryPath: "/repo/manifest.generated.ts.tmp",
        writeFile,
        rename,
        remove,
      });

      await expect(writer("generated source")).rejects.toThrow(
        `${failure} failed`,
      );
      expect(remove).toHaveBeenCalledWith(
        "/repo/manifest.generated.ts.tmp",
        { force: true },
      );
    },
  );
});

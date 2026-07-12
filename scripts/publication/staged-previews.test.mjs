import { describe, expect, it, vi } from "vitest";
import { publishStagedPreviews } from "./staged-previews.mjs";

describe("staged Publication previews", () => {
  it("inspects every artifact before committing any preview", async () => {
    const events = [];
    const artifacts = [
      { filename: "first.webp", path: "/stage/first.webp" },
      { filename: "second.webp", path: "/stage/second.webp" },
    ];
    const read = vi.fn(async (path) => Buffer.from(path));
    const inspect = vi.fn(({ filename, bytes }) => {
      events.push(`inspect:${filename}`);
      return { filename, bytes: bytes.length };
    });
    const commit = vi.fn(async ({ filename }) => {
      events.push(`commit:${filename}`);
    });

    const inspections = await publishStagedPreviews(artifacts, {
      read,
      inspect,
      commit,
    });

    expect(events).toEqual([
      "inspect:first.webp",
      "inspect:second.webp",
      "commit:first.webp",
      "commit:second.webp",
    ]);
    expect(inspections).toHaveLength(2);
  });

  it("commits nothing when any staged artifact fails inspection", async () => {
    const commit = vi.fn();

    await expect(
      publishStagedPreviews(
        [
          { filename: "valid.webp", path: "/stage/valid.webp" },
          { filename: "invalid.webp", path: "/stage/invalid.webp" },
        ],
        {
          read: vi.fn(async (path) => Buffer.from(path)),
          inspect: vi.fn(({ filename, bytes }) => {
            if (filename === "invalid.webp") throw new Error("invalid WebP");
            return { filename, bytes: bytes.length };
          }),
          commit,
        },
      ),
    ).rejects.toThrow("invalid WebP");

    expect(commit).not.toHaveBeenCalled();
  });
});

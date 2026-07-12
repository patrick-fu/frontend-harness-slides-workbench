// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { cleanShowcaseThumbnails } from "./clean.mjs";

describe("showcase thumbnail cleanup", () => {
  it("passes only expected filenames to the filesystem adapter", async () => {
    const expectedFilenames = ["first.webp", "second.webp"];
    const remove = vi.fn(async () => ["orphan.webp"]);
    const log = vi.fn();

    await expect(
      cleanShowcaseThumbnails(expectedFilenames, { remove, log }),
    ).resolves.toEqual(["orphan.webp"]);

    expect(remove).toHaveBeenCalledWith(expectedFilenames);
    expect(log).toHaveBeenCalledWith(
      "Removed 1 obsolete showcase WebPs.",
    );
  });
});

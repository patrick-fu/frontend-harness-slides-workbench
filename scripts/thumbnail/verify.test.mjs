// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { verifyShowcaseThumbnails } from "./verify.mjs";

describe("showcase thumbnail verification", () => {
  it("reports the centralized inventory count and byte summary", async () => {
    const targets = [{ topicId: "first-topic", previewFilename: "first.webp" }];
    const inventory = {
      validatePreviews: vi.fn(async () => ({ count: 1, bytes: 1536 })),
    };
    const log = vi.fn();

    await expect(
      verifyShowcaseThumbnails(targets, { inventory, log }),
    ).resolves.toEqual({ count: 1, bytes: 1536 });

    expect(inventory.validatePreviews).toHaveBeenCalledWith(targets);
    expect(log).toHaveBeenCalledWith(
      "Verified 1 Registry topic thumbnails (1.5 KiB).",
    );
  });
});

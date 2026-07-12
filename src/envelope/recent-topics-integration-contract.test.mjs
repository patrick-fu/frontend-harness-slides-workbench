// @vitest-environment node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Recent Topics integration contract", () => {
  it("keeps Workbench persistence behind semantic Recent Topics", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/envelope/WorkbenchEnvelope.tsx"),
      "utf8",
    );
    expect(source).toContain("createRecentTopics");
    expect(source).toContain("recentTopics.record(activeTopic.id)");
    expect(source).not.toMatch(/RECENT_TOPICS_KEY|localStorage\.(?:getItem|setItem)/);
  });

  it("passes Topic IDs to the Palette for render-time Catalog resolution", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/envelope/CommandPalette.tsx"),
      "utf8",
    );
    expect(source).toContain("recentTopicIds");
    expect(source).not.toMatch(/recent\.map\(\(key\)|byKey\.get\(key\)/);
  });
});

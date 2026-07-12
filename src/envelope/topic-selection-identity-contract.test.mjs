// @vitest-environment node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const envelopeRoot = resolve(process.cwd(), "src/envelope");

describe("Envelope Topic selection identity contract", () => {
  it.each([
    ["CatalogView.tsx", "onOpenTopic"],
    ["LibraryDrawer.tsx", "onSelectTopic"],
    ["CommandPalette.tsx", "onSelectTopic"],
    ["IdentityBadge.tsx", "onSelectTopic"],
  ])("%s selects by Topic ID without a Style compatibility callback", async (filename, callback) => {
    const source = await readFile(resolve(envelopeRoot, filename), "utf8");
    expect(source).toMatch(
      new RegExp(`${callback}\\??:\\s*\\(topicId: string\\) => void`),
    );
    expect(source).not.toMatch(
      new RegExp(
        `${callback}\\??:\\s*\\([^)]*style|${callback}\\([^)]*,`,
      ),
    );
  });

  it("uses Topic ID alone for Envelope render and DOM identity", async () => {
    const catalog = await readFile(resolve(envelopeRoot, "CatalogView.tsx"), "utf8");
    const palette = await readFile(
      resolve(envelopeRoot, "CommandPalette.tsx"),
      "utf8",
    );
    expect(catalog).toContain("data-topic-id={topic.topic.id}");
    expect(catalog).toContain("key={topic.topic.id}");
    expect(palette).toContain("id={result.topic.id}");
    expect(palette).toContain("key={result.topic.id}");
    expect(`${catalog}\n${palette}`).not.toMatch(
      /data-topic-key|\$\{[^}]*style\.id\}\/\$\{[^}]*topic(?:\.topic)?\.id\}/,
    );
  });

  it("keeps composite Recent values read-only inside legacy normalization", async () => {
    const recent = await readFile(
      resolve(envelopeRoot, "recent-topics.ts"),
      "utf8",
    );
    const workbench = await readFile(
      resolve(envelopeRoot, "WorkbenchEnvelope.tsx"),
      "utf8",
    );
    expect(recent).toContain("JSON.stringify(next)");
    expect(recent).not.toMatch(/JSON\.stringify\([^)]*style/);
    expect(workbench).not.toMatch(/localStorage|RECENT_TOPICS_KEY/);
  });
});

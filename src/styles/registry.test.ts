import { describe, expect, it } from "vitest";
import { findVersion, getNextVersion, STYLE_REGISTRY } from "./registry";

describe("STYLE_REGISTRY style 01 version", () => {
  it("keeps style 01 v1 and adds curated v2", () => {
    const style01 = STYLE_REGISTRY.find((entry) => entry.id === "01");

    expect(style01?.versions.map((version) => version.id)).toEqual(["v1", "v2"]);
  });

  it("does not expose removed extra style 01 versions", () => {
    const version = findVersion("01", "decision-art");

    expect(version).toBeNull();
  });

  it("keeps version-aware navigation order from style 01 v1 to style 01 v2", () => {
    const next = getNextVersion("01", "v1");

    expect(next.styleId).toBe("01");
    expect(next.versionId).toBe("v2");
  });
});

import { describe, expect, it } from "vitest";
import { findVersion, getNextVersion, STYLE_REGISTRY } from "./registry";

describe("STYLE_REGISTRY style 01 version", () => {
  it("keeps style 01 v1/v2 and adds curated v3", () => {
    const style01 = STYLE_REGISTRY.find((entry) => entry.id === "01");

    expect(style01?.versions.map((version) => version.id)).toEqual([
      "v1",
      "v2",
      "v3",
    ]);
  });

  it("does not expose removed extra style 01 versions", () => {
    const version = findVersion("01", "decision-art");

    expect(version).toBeNull();
  });

  it("keeps version-aware navigation order across style 01 v1 → v2 → v3", () => {
    const afterV1 = getNextVersion("01", "v1");
    expect(afterV1.styleId).toBe("01");
    expect(afterV1.versionId).toBe("v2");

    const afterV2 = getNextVersion("01", "v2");
    expect(afterV2.styleId).toBe("01");
    expect(afterV2.versionId).toBe("v3");
  });
});

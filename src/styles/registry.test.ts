import { describe, expect, it } from "vitest";
import {
  findVersion,
  getNextVersion,
  STYLE_REGISTRY,
} from "./registry";

describe("STYLE_REGISTRY style 01 protocol version", () => {
  it("keeps the legacy v1 and adds the explicit spatial-track version", () => {
    const style01 = STYLE_REGISTRY.find((entry) => entry.id === "01");

    expect(style01?.versions.map((version) => version.id)).toEqual([
      "v1",
      "spatial-track",
    ]);
  });

  it("finds the explicit style 01 version by stable id", () => {
    const version = findVersion("01", "spatial-track");

    expect(version?.styleId).toBe("01");
    expect(version?.versionId).toBe("spatial-track");
    expect(version?.topic).toBe("Quiet Launch");
  });

  it("keeps version-aware navigation order from v1 to the explicit version", () => {
    const next = getNextVersion("01", "v1");

    expect(next.styleId).toBe("01");
    expect(next.versionId).toBe("spatial-track");
  });
});

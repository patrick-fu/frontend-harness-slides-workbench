// @vitest-environment node

import { Buffer } from "node:buffer";
import { describe, expect, it } from "vitest";
import {
  createInMemoryPreviewInventoryAdapter,
  createPublicationInventory,
} from "./inventory.mjs";

function chunk(kind, payload, declaredSize = payload.length) {
  const header = Buffer.alloc(8);
  header.write(kind, 0, 4, "ascii");
  header.writeUInt32LE(declaredSize, 4);
  return Buffer.concat([
    header,
    payload,
    ...(payload.length % 2 === 1 ? [Buffer.alloc(1)] : []),
  ]);
}

function webp(...chunks) {
  const body = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.write("RIFF", 0, 4, "ascii");
  header.writeUInt32LE(body.length + 4, 4);
  header.write("WEBP", 8, 4, "ascii");
  return Buffer.concat([header, body]);
}

function vp8(width, height) {
  const payload = Buffer.alloc(10);
  payload.set([0x9d, 0x01, 0x2a], 3);
  payload.writeUInt16LE(width, 6);
  payload.writeUInt16LE(height, 8);
  return chunk("VP8 ", payload);
}

function vp8l(width, height, marker = 0x2f) {
  const payload = Buffer.alloc(5);
  const encodedWidth = width - 1;
  const encodedHeight = height - 1;
  payload[0] = marker;
  payload[1] = encodedWidth & 0xff;
  payload[2] =
    ((encodedWidth >> 8) & 0x3f) | ((encodedHeight & 0x03) << 6);
  payload[3] = (encodedHeight >> 2) & 0xff;
  payload[4] = (encodedHeight >> 10) & 0x0f;
  return chunk("VP8L", payload);
}

function vp8x(width, height) {
  const payload = Buffer.alloc(10);
  payload.writeUIntLE(width - 1, 4, 3);
  payload.writeUIntLE(height - 1, 7, 3);
  return chunk("VP8X", payload);
}

const targets = [
  { topicId: "first-topic", previewFilename: "first-topic.webp" },
  { topicId: "second-topic", previewFilename: "second-topic.webp" },
];

describe("Preview Publication Inventory", () => {
  it.each([
    ["VP8", vp8(1920, 1080)],
    ["VP8L", vp8l(1920, 1080)],
    ["VP8X", vp8x(1920, 1080)],
  ])("inspects a staged %s artifact independently", (format, imageChunk) => {
    const bytes = webp(imageChunk);
    const inventory = createPublicationInventory({});

    expect(
      inventory.inspectPreview({ filename: `${format}.webp`, bytes }),
    ).toEqual({
      filename: `${format}.webp`,
      width: 1920,
      height: 1080,
      bytes: bytes.length,
    });
  });

  it.each([
    ["bad-header.webp", Buffer.from("not-webp"), "not a WebP RIFF file"],
    [
      "truncated-riff.webp",
      (() => {
        const bytes = webp(vp8(1920, 1080));
        bytes.writeUInt32LE(bytes.length, 4);
        return bytes;
      })(),
      "truncated RIFF payload",
    ],
    [
      "truncated-chunk.webp",
      webp(chunk("JUNK", Buffer.alloc(2), 20)),
      "truncated WebP chunk",
    ],
    [
      "short-vp8.webp",
      webp(chunk("VP8 ", Buffer.alloc(9))),
      "undersized VP8 chunk",
    ],
    [
      "short-vp8x.webp",
      webp(chunk("VP8X", Buffer.alloc(9))),
      "undersized VP8X chunk",
    ],
    [
      "bad-vp8l.webp",
      webp(vp8l(1920, 1080, 0x00)),
      "invalid VP8L marker",
    ],
    [
      "no-image.webp",
      webp(chunk("EXIF", Buffer.from("meta"))),
      "WebP image chunk not found",
    ],
  ])("rejects malformed artifact %s", (filename, bytes, reason) => {
    const inventory = createPublicationInventory({});

    expect(() => inventory.inspectPreview({ filename, bytes })).toThrow(
      `${filename}: ${reason}`,
    );
  });

  it("rejects valid WebP dimensions other than 1920×1080", () => {
    const inventory = createPublicationInventory({});

    expect(() =>
      inventory.inspectPreview({
        filename: "small.webp",
        bytes: webp(vp8x(640, 480)),
      }),
    ).toThrow("small.webp: is 640×480, expected 1920×1080");
  });

  it("aggregates coverage and validity failures deterministically", async () => {
    const inventory = createPublicationInventory({
      openPreviews: createInMemoryPreviewInventoryAdapter({
        files: ["notes.txt", "orphan.webp", "second-topic.webp"],
        bytesByFilename: {
          "orphan.webp": webp(vp8(1920, 1080)),
          "second-topic.webp": webp(vp8x(640, 480)),
        },
      }),
    });

    await expect(inventory.validatePreviews(targets)).rejects.toThrow(
      [
        "Preview Publication inventory is invalid:",
        "Preview coverage:",
        "- Missing showcase WebPs: first-topic.webp",
        "- Orphan showcase WebPs: orphan.webp",
        "Preview validity:",
        "- second-topic.webp: is 640×480, expected 1920×1080",
      ].join("\n"),
    );
  });

  it("ignores non-WebP files and reports valid count and bytes", async () => {
    const first = webp(vp8(1920, 1080));
    const second = webp(vp8l(1920, 1080));
    const inventory = createPublicationInventory({
      openPreviews: createInMemoryPreviewInventoryAdapter({
        files: ["second-topic.webp", "README.md", "first-topic.webp"],
        bytesByFilename: {
          "first-topic.webp": first,
          "second-topic.webp": second,
        },
      }),
    });

    await expect(inventory.validatePreviews(targets)).resolves.toEqual({
      count: 2,
      bytes: first.length + second.length,
    });
  });
});

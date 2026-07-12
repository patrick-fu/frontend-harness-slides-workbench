import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { planCaptureSelection } from "./capture-selection.mjs";
import { publicationSnapshot } from "./snapshot.mjs";

export const PUBLICATION_USAGE = `Usage:
  npm run generate:catalog
  npm run verify:showcase-thumbnails
  npm run generate:showcase-thumbnails -- --topic <topic-id> [--topic <topic-id> ...]
  npm run generate:showcase-thumbnails -- --all
  npm run clean:showcase-thumbnails`;

const COMMANDS = new Set(["manifest", "verify", "capture", "clean"]);

export function parsePublicationArgs(argv, knownTopicIds) {
  const [command, ...args] = argv;
  if (!command || !COMMANDS.has(command)) {
    throw new Error(command ? `Unknown publication command "${command}".\n${PUBLICATION_USAGE}` : PUBLICATION_USAGE);
  }

  if (command !== "capture") {
    if (args.length > 0) {
      throw new Error(`Command "${command}" does not accept arguments.`);
    }
    return { command };
  }

  const topicIds = [];
  let all = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--all") {
      if (all) throw new Error("Duplicate --all selector.");
      all = true;
      continue;
    }
    if (argument === "--topic") {
      const topicId = args[index + 1];
      if (!topicId || topicId.startsWith("--")) {
        throw new Error("--topic requires a Topic ID.");
      }
      if (topicIds.includes(topicId)) {
        throw new Error(`Duplicate Topic selector "${topicId}".`);
      }
      topicIds.push(topicId);
      index += 1;
      continue;
    }
    throw new Error(`Unknown capture option "${argument}".`);
  }

  if (all && topicIds.length > 0) {
    throw new Error("Capture cannot combine --all with --topic.");
  }
  if (!all && topicIds.length === 0) {
    throw new Error(`Capture requires --topic <id> or --all.\n${PUBLICATION_USAGE}`);
  }

  if (knownTopicIds) {
    const known = new Set(knownTopicIds);
    for (const topicId of topicIds) {
      if (!known.has(topicId)) {
        throw new Error(`Unknown Topic ID "${topicId}".`);
      }
    }
  }

  return { command: "capture", all, topicIds };
}

export async function runPublicationCli(argv, dependencies) {
  const preliminary = parsePublicationArgs(argv);
  if (preliminary.command === "capture") {
    const generated = await dependencies.loadGeneratedSnapshot();
    const knownTopicIds = generated.targets.map((target) => target.topicId);
    const selection = parsePublicationArgs(argv, knownTopicIds);
    const current = await dependencies.loadCurrentSnapshot();
    dependencies.assertFresh(current, generated);
    const targets = planCaptureSelection(current.targets, selection);
    await dependencies.capture({
      targets,
    });
    return;
  }
  if (preliminary.command === "verify") {
    const generated = await dependencies.loadGeneratedSnapshot();
    await dependencies.verify(generated.targets);
    return;
  }
  if (preliminary.command === "clean") {
    const generated = await dependencies.loadGeneratedSnapshot();
    const current = await dependencies.loadCurrentSnapshot();
    dependencies.assertFresh(current, generated);
    await dependencies.clean(
      current.targets.map((target) => target.previewFilename),
    );
    return;
  }
  await dependencies[preliminary.command]();
}

const productionDependencies = {
  async loadGeneratedSnapshot() {
    return publicationSnapshot.loadGenerated();
  },
  async loadCurrentSnapshot() {
    return publicationSnapshot.loadCurrent();
  },
  assertFresh(current, generated) {
    publicationSnapshot.assertFresh(current, generated);
  },
  async capture(selection) {
    const { captureShowcaseThumbnails } = await import(
      "../thumbnail/generate.mjs"
    );
    await captureShowcaseThumbnails(selection);
  },
  async manifest() {
    const { publicationManifest } = await import("./manifest.mjs");
    await publicationManifest.generate();
  },
  async verify(targets) {
    const { verifyShowcaseThumbnails } = await import(
      "../thumbnail/verify.mjs"
    );
    await verifyShowcaseThumbnails(targets);
  },
  async clean(expectedFilenames) {
    const { cleanShowcaseThumbnails } = await import(
      "../thumbnail/clean.mjs"
    );
    await cleanShowcaseThumbnails(expectedFilenames);
  },
};

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  runPublicationCli(process.argv.slice(2), productionDependencies).catch(
    (error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    },
  );
}

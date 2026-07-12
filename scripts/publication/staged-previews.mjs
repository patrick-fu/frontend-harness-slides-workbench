export async function publishStagedPreviews(
  artifacts,
  { read, inspect, commit },
) {
  const inspected = [];
  for (const artifact of artifacts) {
    const bytes = await read(artifact.path);
    inspected.push({
      artifact,
      inspection: inspect({ filename: artifact.filename, bytes }),
    });
  }

  for (const result of inspected) {
    await commit(result.artifact);
  }

  return inspected.map((result) => result.inspection);
}

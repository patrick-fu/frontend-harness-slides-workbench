export function planCaptureSelection(allTargets, selection) {
  if (selection.all) {
    return { targets: allTargets, removeOrphans: true };
  }
  const selected = new Set(selection.topicIds);
  return {
    targets: allTargets.filter((target) => selected.has(target.topicId)),
    removeOrphans: false,
  };
}

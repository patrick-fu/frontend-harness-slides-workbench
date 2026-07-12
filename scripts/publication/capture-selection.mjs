export function planCaptureSelection(allTargets, selection) {
  if (selection.all) {
    return allTargets;
  }
  const selected = new Set(selection.topicIds);
  return allTargets.filter((target) => selected.has(target.topicId));
}

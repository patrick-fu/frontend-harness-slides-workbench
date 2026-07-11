/** Returns the committed Topic preview URL without a second identity map. */
export function getShowcaseThumbnail(
  topicId: string,
  baseUrl: string = import.meta.env.BASE_URL,
): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${base}showcase/${topicId}.webp`;
}

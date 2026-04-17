/** Оценка времени чтения по объёму текста (без разметки). */
export function estimateReadingMinutes(
  raw: string,
  wordsPerMinute = 200
): number {
  if (!raw?.trim()) return 1;
  const plain = raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

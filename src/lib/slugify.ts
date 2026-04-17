/** Транслитерация в латиницу для URL (как на бэкенде `_slugify_latin`) */
const RU_TO_LAT: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

export function slugifyLatin(text: string): string {
  const t = (text || '').toLowerCase().trim();
  if (!t) return '';
  let s = '';
  for (const ch of t) {
    s += RU_TO_LAT[ch] ?? ch;
  }
  s = s.replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 200);
  return s || 'post';
}

import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

const EXTRA_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'img',
  'figure',
  'figcaption',
  'iframe',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'div',
  'span',
  'del',
  'ins',
  'abbr',
];

function looksLikeHtml(s: string): boolean {
  const t = s.trim();
  if (!t.startsWith('<')) return false;
  return /<\/?[a-z][\s\S]*>/i.test(t);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Старые статьи: сплошной текст без разметки → абзацы */
function plainTextToHtml(text: string): string {
  const parts = text
    .trim()
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return '';
  return parts.map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`).join('\n');
}

const FALLBACK_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'blockquote', 'code', 'pre', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
];

export function sanitizeBlogHtml(dirty: string): string {
  const baseTags = sanitizeHtml.defaults?.allowedTags?.length
    ? sanitizeHtml.defaults.allowedTags
    : FALLBACK_TAGS;
  return sanitizeHtml(dirty, {
    allowedTags: [...new Set([...baseTags, ...EXTRA_TAGS])],
    allowedAttributes: {
      ...(sanitizeHtml.defaults?.allowedAttributes ?? {}),
      a: ['href', 'name', 'target', 'rel', 'class'],
      img: ['src', 'alt', 'title', 'width', 'height', 'class', 'loading'],
      iframe: [
        'src',
        'width',
        'height',
        'allowfullscreen',
        'allow',
        'loading',
        'title',
        'class',
        'referrerpolicy',
      ],
      th: ['colspan', 'rowspan', 'align'],
      td: ['colspan', 'rowspan', 'align'],
      div: ['class'],
      span: ['class'],
      code: ['class'],
      '*': ['class', 'id'],
    },
    allowedIframeHostnames: [
      'www.youtube.com',
      'youtube.com',
      'www.youtube-nocookie.com',
      'player.vimeo.com',
      'rutube.ru',
      'vk.com',
    ],
    allowedSchemesByTag: {
      iframe: ['https'],
      img: ['http', 'https'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

/**
 * Контент из админки: Markdown или HTML (из старых правок).
 * Плоский текст без # и < превращаем в абзацы.
 */
export function prepareBlogBodyHtml(raw: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';

  if (looksLikeHtml(trimmed)) {
    return sanitizeBlogHtml(trimmed);
  }

  // Поддержка "кастомных" заголовков из админки, когда автор пишет:
  //   #Заголовок#
  // вместо стандартного markdown:
  //   ## Заголовок
  const normalizeCustomHeadings = (input: string): string => {
    const lines = input.replace(/\r\n/g, '\n').split('\n');
    const out: string[] = [];
    for (const line of lines) {
      const t = line.trim();
      // Превращаем "#Title#" / "##Title##" / ... в заголовки markdown.
      // Уровень делаем на 1 больше, чтобы один "#...#" выглядел как H2.
      const m = t.match(/^(\#{1,6})(.+?)\1$/);
      if (m) {
        const leading = m[1].length;
        const inner = m[2].trim();
        const level = Math.min(6, leading + 1);
        out.push(`${'#'.repeat(level)} ${inner}`);
        continue;
      }

      // Поддержка заголовков без пробела после #: "#Title" -> "# Title"
      out.push(line.replace(/^(\s*#{1,6})(\S)/, '$1 $2'));
    }
    return out.join('\n');
  };

  const normalized = normalizeCustomHeadings(trimmed);

  const seemsMarkdown =
    /^#{1,6}\s/m.test(normalized) ||
    /^#{1,6}\S/m.test(normalized) ||
    /\*\*[^*]+\*\*/.test(trimmed) ||
    /^\s*[-*+]\s/m.test(normalized) ||
    /^\s*\d+\.\s/m.test(normalized) ||
    /\[.+\]\(.+\)/.test(normalized) ||
    /!\[/.test(normalized);

  if (!seemsMarkdown && !normalized.includes('<')) {
    return sanitizeBlogHtml(plainTextToHtml(normalized));
  }

  try {
    const html = marked.parse(normalized) as string;
    return sanitizeBlogHtml(html);
  } catch {
    const fallbackHtml = plainTextToHtml(normalized);
    return sanitizeBlogHtml(fallbackHtml);
  }
}

export function stripHtmlForDescription(html: string, maxLen = 160): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, Math.max(0, maxLen - 1))}…`;
}

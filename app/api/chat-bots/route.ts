import { API_URLS } from '@/lib/api';

// Серверный прокси, чтобы админка не упиралась в CORS при обращении из браузера.
// Админка дергает `/api/chat-bots`, а этот route уже ходит в реальную cloud-функцию.
const REMOTE_CHAT_BOTS_URL =
  process.env.CHAT_BOTS_REMOTE_URL || 'https://functions.yandexcloud.net/d4eg9ur6d6co5d1tm0rc';

function pickAuthToken(req: Request) {
  return req.headers.get('X-Auth-Token') || req.headers.get('x-auth-token') || '';
}

async function forward(req: Request) {
  const method = req.method.toUpperCase();
  const token = pickAuthToken(req);

  const url = new URL(REMOTE_CHAT_BOTS_URL);
  // Сохраняем query-string с /api/chat-bots
  url.search = new URL(req.url).search;

  // Для DELETE/PUT/POST прокидываем body (если он есть)
  let body: string | undefined = undefined;
  const contentType = req.headers.get('content-type') || '';
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await req.text();
      // Если тело пустое — не прокидываем
      if (!body) body = undefined;
    } catch {
      body = undefined;
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': contentType || 'application/json',
      ...(token ? { 'X-Auth-Token': token } : {}),
    },
    body,
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json',
      // Важно: уже мы отдаём клиенту с того же домена, поэтому CORS здесь не нужен.
    },
  });
}

export async function GET(req: Request) {
  try {
    return await forward(req);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: 'chat-bots proxy error', detail: msg, remote: REMOTE_CHAT_BOTS_URL }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: Request) {
  try {
    return await forward(req);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: 'chat-bots proxy error', detail: msg, remote: REMOTE_CHAT_BOTS_URL }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req: Request) {
  try {
    return await forward(req);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: 'chat-bots proxy error', detail: msg, remote: REMOTE_CHAT_BOTS_URL }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req: Request) {
  try {
    return await forward(req);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: 'chat-bots proxy error', detail: msg, remote: REMOTE_CHAT_BOTS_URL }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


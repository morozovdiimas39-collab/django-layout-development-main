export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  yclid?: string;
  gclid?: string;
  referrer?: string;
}

/** Одно касание в сквозной аналитике */
export interface Touchpoint extends UTMParams {
  at: string;
  path: string;
}

const JOURNEY_KEY = 'utm_touch_journey';
const MAX_TOUCHPOINTS = 25;

let _lastFp = '';
let _lastFpAt = 0;

function fingerprint(tp: Pick<Touchpoint, 'path' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'yclid' | 'gclid' | 'referrer'>) {
  return [tp.path, tp.utm_source, tp.utm_medium, tp.utm_campaign, tp.utm_term, tp.yclid, tp.gclid, tp.referrer].join('|');
}

/** Накопить касание (вызывается при смене страницы) */
export function recordTouchpoint() {
  if (typeof window === 'undefined') return;

  saveUTMToStorage();

  const fromUrl = getUTMParams();
  const storedRaw = localStorage.getItem('utm_params');
  let stored: UTMParams = {};
  if (storedRaw) {
    try { stored = JSON.parse(storedRaw); } catch { /* */ }
  }
  const merged: UTMParams = { ...stored, ...fromUrl };
  const refExt = document.referrer || '';
  const refPersist = localStorage.getItem('utm_referrer') || '';
  const referrer = refExt || refPersist || undefined;

  const path = window.location.pathname + window.location.search;

  const tp: Touchpoint = {
    at: new Date().toISOString(),
    path,
    utm_source: merged.utm_source,
    utm_medium: merged.utm_medium,
    utm_campaign: merged.utm_campaign,
    utm_content: merged.utm_content,
    utm_term: merged.utm_term,
    yclid: merged.yclid,
    gclid: merged.gclid,
    referrer,
  };

  const fp = fingerprint(tp);
  if (fp === _lastFp && Date.now() - _lastFpAt < 1500) return;
  _lastFp = fp;
  _lastFpAt = Date.now();

  let journey: Touchpoint[] = [];
  try {
    journey = JSON.parse(localStorage.getItem(JOURNEY_KEY) ?? '[]');
    if (!Array.isArray(journey)) journey = [];
  } catch {
    journey = [];
  }

  const last = journey[journey.length - 1];
  if (last && fingerprint(last) === fp) return;

  journey.push(tp);
  while (journey.length > MAX_TOUCHPOINTS) journey.shift();
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
}

export function getJourney(): Touchpoint[] {
  if (typeof window === 'undefined') return [];
  try {
    const j = JSON.parse(localStorage.getItem(JOURNEY_KEY) ?? '[]');
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid'];
  
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      utm[key as keyof UTMParams] = value;
    }
  });
  
  return utm;
}

export function saveUTMToStorage() {
  if (typeof window === 'undefined') return;

  const utm = getUTMParams();

  // Сохраняем referrer только при первом заходе (не перезаписываем)
  if (!localStorage.getItem('utm_referrer')) {
    const ref = document.referrer ?? '';
    if (ref) localStorage.setItem('utm_referrer', ref);
  }

  if (Object.keys(utm).length > 0) {
    localStorage.setItem('utm_params', JSON.stringify(utm));
    localStorage.setItem('utm_timestamp', Date.now().toString());
  }
}

export function getStoredUTM(): UTMParams {
  if (typeof window === 'undefined') return {};

  const stored = localStorage.getItem('utm_params');
  const timestamp = localStorage.getItem('utm_timestamp');
  const referrer = localStorage.getItem('utm_referrer') ?? '';

  let utm: UTMParams = {};

  if (stored && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (age > maxAge) {
      localStorage.removeItem('utm_params');
      localStorage.removeItem('utm_timestamp');
      localStorage.removeItem('utm_referrer');
      localStorage.removeItem(JOURNEY_KEY);
    } else {
      utm = JSON.parse(stored);
    }
  }

  if (referrer) utm.referrer = referrer;

  return utm;
}

export function getYandexClientID(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    
    try {
      const ym = (window as any).ym;
      if (ym) {
        ym(104854671, 'getClientID', (clientID: string) => {
          resolve(clientID);
        });
      } else {
        resolve(null);
      }
    } catch (e) {
      console.error('Failed to get Yandex Client ID:', e);
      resolve(null);
    }
  });
}
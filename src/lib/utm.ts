export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  yclid?: string;
  gclid?: string;
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
  
  if (Object.keys(utm).length > 0) {
    localStorage.setItem('utm_params', JSON.stringify(utm));
    localStorage.setItem('utm_timestamp', Date.now().toString());
  }
}

export function getStoredUTM(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem('utm_params');
  const timestamp = localStorage.getItem('utm_timestamp');
  
  if (!stored || !timestamp) return {};
  
  const age = Date.now() - parseInt(timestamp);
  const maxAge = 30 * 24 * 60 * 60 * 1000;
  
  if (age > maxAge) {
    localStorage.removeItem('utm_params');
    localStorage.removeItem('utm_timestamp');
    return {};
  }
  
  return JSON.parse(stored);
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
/**
 * Google reCAPTCHA v3 — невидимая капча, без кликов.
 * Ключ сайта задаётся в .env: VITE_RECAPTCHA_SITE_KEY
 */

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
const SCRIPT_URL = 'https://www.google.com/recaptcha/api.js?render=';

function loadScript(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    const id = 'recaptcha-v3-script';
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = SCRIPT_URL + key;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA script load failed'));
    document.head.appendChild(script);
  });
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Возвращает токен reCAPTCHA v3 для действия (например submit_form).
 * Если ключ не задан — возвращает пустую строку (бэкенд может не проверять).
 */
export async function getRecaptchaToken(action: string = 'submit_form'): Promise<string> {
  if (!SITE_KEY || typeof window === 'undefined') return '';
  try {
    await loadScript(SITE_KEY);
    return new Promise((resolve) => {
      window.grecaptcha?.ready?.(() => {
        window.grecaptcha
          ?.execute(SITE_KEY, { action })
          .then(resolve)
          .catch(() => resolve(''));
      });
      if (!window.grecaptcha) resolve('');
    });
  } catch {
    return '';
  }
}

export function isRecaptchaConfigured(): boolean {
  return Boolean(SITE_KEY);
}

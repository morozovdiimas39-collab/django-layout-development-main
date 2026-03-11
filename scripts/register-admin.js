/**
 * Регистрация нового админа (если забыли логин/пароль).
 * Вызов: node scripts/register-admin.js <логин> <пароль>
 * Пример: node scripts/register-admin.js admin myNewPassword123
 *
 * Внимание: бэкенд должен разрешать регистрацию (auth Cloud Function).
 * После регистрации входите в админку с этими логином и паролем.
 */

const AUTH_URL = 'https://functions.yandexcloud.net/d4eq5vh7oqlkrud2jm37';

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error('Использование: node scripts/register-admin.js <логин> <пароль>');
  console.error('Пример: node scripts/register-admin.js admin MySecurePass123');
  process.exit(1);
}

async function register() {
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      console.log('✅ Новый админ создан.');
      console.log('   Логин:', username);
      console.log('   Пароль: (тот, что вы ввели)');
      console.log('   Войдите на /admin с этими данными.');
      return;
    }

    if (res.status === 502 || res.status === 503) {
      console.error('❌ Сервер auth не ответил (Bad Gateway / Service Unavailable).');
      console.error('   Проверьте в Yandex Cloud: функция задеплоена, есть DATABASE_URL, нет ошибок в логах.');
      process.exit(1);
    }

    if (res.status === 409 || (data.error && data.error.includes('already exists'))) {
      console.error('❌ Такой логин уже занят. Выберите другой или сбросьте пароль в БД.');
      process.exit(1);
    }

    console.error('❌ Ошибка:', data.error || res.statusText || res.status);
    process.exit(1);
  } catch (e) {
    console.error('❌ Ошибка запроса:', e.message);
    process.exit(1);
  }
}

register();

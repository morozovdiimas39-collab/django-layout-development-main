/**
 * PM2: `npm run start` → Next читает PORT из .env.production (на сервере) или из окружения.
 * Обязательно на VPS: файл .env.production с PORT=<как в nginx proxy_pass>
 */
module.exports = {
  apps: [
    {
      name: 'kazbek-meretukov',
      cwd: __dirname,
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      max_memory_restart: '900M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

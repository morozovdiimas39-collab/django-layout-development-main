/**
 * PM2 на VPS: порт должен совпадать с proxy_pass в nginx (у AnyaGPT для kazbek часто 3497).
 * Запуск: из каталога деплоя после build — pm2 start ecosystem.config.cjs
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

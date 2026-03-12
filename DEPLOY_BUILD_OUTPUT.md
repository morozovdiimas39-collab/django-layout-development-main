# Next.js 14 — что создаётся при сборке (только пути и файлы)

После успешного `next build` в корне проекта появляется только одна новая директория: **`.next/`**. Всё остальное (в т.ч. `public/`) сборкой не создаётся.

---

## Корень: `.next/`

### Файлы в корне `.next/`
- `BUILD_ID` — один идентификатор сборки (строка)
- `build-manifest.json`
- `app-build-manifest.json`
- `package.json`
- `react-loadable-manifest.json`
- `trace` (бинарный)
- `types/` — директория с сгенерированными типами (при наличии)

### `.next/cache/`
Кэш webpack и прочее. Для запуска приложения не нужна. Содержит:
- `cache/webpack/client-production/*.pack`, `index.pack`, `*.pack.old`
- `cache/webpack/server-production/*.pack`, `index.pack`, `*.pack.old`
- `cache/webpack/edge-server-production/*.pack`, `index.pack`
- `cache/.tsbuildinfo`
- `cache/fetch-cache/*` (при наличии)

### `.next/static/`
Статика для браузера. Имена файлов с хешами, количество и имена меняются от сборки к сборке.
- `static/chunks/*.js` — основные JS-чанки (имена вида `[hash].js`, `webpack.js`, `main-app.js`, `app/[route]/page.js` и т.п.)
- `static/css/**/*.css` — сгенерированные CSS (имена с хешами)
- `static/media/**` — вынесенные ассеты (если есть)
- В dev-режиме ещё: `static/development/_buildManifest.js`, `static/development/_ssgManifest.js`, `static/chunks/polyfills.js`

### `.next/server/`
Серверная часть. Нужна для `next start`.
- `server/app/` — по одному каталогу/файлу на маршрут App Router (например `app/page.js`, `app/layout.js`, `app/admin/page.js`, `app/blog/[slug]/page.js`)
- `server/app-paths-manifest.json`
- `server/app-build-manifest.json` (если есть)
- `server/pages/` — скомпилированные страницы Pages Router (если используются)
- `server/pages-manifest.json`
- `server/middleware.js` — если есть middleware
- `server/middleware-build-manifest.js`
- `server/middleware-manifest.json`
- `server/middleware-react-loadable-manifest.js`
- `server/next-font-manifest.js` (и опционально `.json`)
- `server/server-reference-manifest.json` (и опционально `.js`)
- `server/interception-route-rewrite-manifest.js`
- `server/chunks/` — серверные чанки (имена с хешами)
- `server/vendor-chunks/*.js` — вынесенные вендорные чанки (имена пакетов, например `react.js`, `next.js`)

---

## Что сборка НЕ создаёт
- Отдельной папки «только статика» вне `.next/` нет — вся статика сборки внутри `.next/static/`.
- `out/` — не создаётся (нужен только при `output: 'export'` в next.config).
- `standalone/` — не создаётся (нужен только при `output: 'standalone'` в next.config).
- Папка `public/` не перезаписывается и не создаётся сборкой — это исходники репозитория.

---

## Конфиги проекта (уже в репо, сборка их не создаёт)

Файлы: `next.config.mjs`, `package.json`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.ts`, `postcss.config.cjs`, `eslint.config.js`, `vite.config.ts`. Переменные окружения: `.env.production` (при деплое подставлять свои значения или копировать файл).

### next.config.mjs (содержимое)
- `reactStrictMode: true`
- `transpilePackages: []`
- `productionBrowserSourceMaps: false`
- `poweredByHeader: false`
- `experimental.optimizePackageImports`: lucide-react, @radix-ui/react-accordion, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-select, @radix-ui/react-tabs
- `webpack`: алиас `@` → `src`, в production `moduleIds: 'deterministic'`
- Нет `output: 'standalone'`, нет `output: 'export'`

### package.json (важно для деплоя)
- `"type": "module"`
- Скрипты: `build` = `NODE_OPTIONS='--max-old-space-size=2048' next build`; `start` = `next start`
- Зависимости: только из блока `dependencies` (для production достаточно их; при сборке используются и devDependencies, поэтому на сервере обычно делают `npm ci` или `npm install` без флага production до сборки, потом для запуска нужны только `dependencies` + папка `.next`)

---

## Что должно быть на сервере

### Окружение
- **Node.js** — LTS, лучше 18.x или 20.x (проект проверялся на v20).
- **npm** — версия, идущая с Node (например 9.x / 10.x).

### Установка перед сборкой
- В каталоге проекта выполнить установку зависимостей из репо: **все** зависимости (и production, и dev), т.к. сборка использует TypeScript, ESLint, Tailwind и т.д. То есть установить по `package.json` и `package-lock.json` (если есть) — по сути то, что даёт `npm install` или `npm ci` в корне проекта.
- Файл окружения для продакшена: `.env.production` — должен быть на сервере (скопирован или создан), иначе Next при сборке/запуске подхватит не те переменные.

### После сборки для запуска
- Для **запуска** приложения (`next start`) нужны: установленные **production-зависимости** (блок `dependencies` из package.json), папка **`.next/`** целиком, папка **`public/`**, файлы **`next.config.mjs`**, **`package.json`**. То есть либо оставить полный `node_modules` после `npm install`, либо поставить только production (`npm ci --omit=dev` или `npm install --production`) — тогда для `next start` хватает этого и `.next`.

### Итог по шагам на сервере
1. Node 18+ (лучше 20).
2. Клонировать/скопировать репо в каталог деплоя.
3. Положить/подставить `.env.production`.
4. Установить зависимости: `npm ci` или `npm install` (без `--omit=dev` до сборки).
5. Сборка: `npm run build` (создаётся только `.next/`).
6. Запуск: `npm run start` или `next start` (порт по умолчанию 3000). Для продакшена процесс нужно держать запущенным (PM2, systemd, панель и т.п.).

---

## Итог для деплоя
- **Создаётся сборкой:** только дерево каталогов и файлов внутри **`.next/`** (включая `server/`, `static/`, манифесты, `BUILD_ID`, `cache/`, `types/` и т.д.).
- **Не создаётся сборкой:** `public/`, все конфиги в корне, исходный код. Их деплой берёт из репозитория или из своей конфигурации.

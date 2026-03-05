#!/usr/bin/env node
/**
 * Генерирует api-gateway-main-domain.yaml с подставленными BUCKET_NAME и SERVICE_ACCOUNT_ID.
 * Вызов: YC_BUCKET=xxx YC_SERVICE_ACCOUNT_KEY_JSON='{...}' node scripts/generate-api-gateway-spec.js
 * Результат: api-gateway-generated.yaml в корне репо.
 */
const fs = require('fs');
const path = require('path');

const bucket = process.env.YC_BUCKET || '';
let serviceAccountId = '';
try {
  const key = JSON.parse(process.env.YC_SERVICE_ACCOUNT_KEY_JSON || '{}');
  serviceAccountId = key.service_account_id || key.id || '';
} catch (_) {}

if (!bucket || !serviceAccountId) {
  console.error('Need YC_BUCKET and YC_SERVICE_ACCOUNT_KEY_JSON (with service_account_id or id)');
  process.exit(1);
}

const spec = `openapi: 3.0.0
info:
  title: Main domain
  version: 1.0.0
paths:
  /sitemap.xml:
    get:
      operationId: sitemap
      responses:
        "200":
          description: OK
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: d4e970s0n7por7g0cpc3
        tag: "$latest"
  /:
    get:
      operationId: index
      responses:
        "200":
          description: OK
      x-yc-apigateway-integration:
        type: object_storage
        bucket: "${bucket}"
        object: "index.html"
        error_object: "index.html"
        service_account_id: "${serviceAccountId}"
  /{path}:
    get:
      operationId: static
      parameters:
        - name: path
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
      x-yc-apigateway-integration:
        type: object_storage
        bucket: "${bucket}"
        object: "{path}"
        error_object: "index.html"
        service_account_id: "${serviceAccountId}"
`;

const outPath = path.join(__dirname, '..', 'api-gateway-generated.yaml');
fs.writeFileSync(outPath, spec, 'utf8');
console.log('Written', outPath);

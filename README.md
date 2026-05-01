# Docker EC Sample

Next.js + Hono + PostgreSQL で構築した、Docker起動可能なECサンプルです。
APM（New Relic）を導入済み。

## Services

- `web`: Next.js (`http://localhost:3001`)
- `api`: Hono API (`http://localhost:3000`)
- `db`: PostgreSQL (`localhost:5432`)

## Setup

1. `.env.example` をコピーして `.env` を作成
2. 起動

```bash
docker compose up --build
```

## DB initialization

別ターミナルで以下を実行:

```bash
docker compose exec api npm run prisma:generate
docker compose exec api npm run prisma:migrate
docker compose exec api npm run prisma:seed
```

## Public flow

1. `http://localhost:3001` で商品一覧を表示
2. カートに追加
3. チェックアウトでモック決済して注文作成

## Admin flow

- `http://localhost:3001/admin`
- Basic認証用の資格情報を入力してデータ読込
- 商品追加・注文一覧確認が可能

## API endpoints

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /admin/products` (Basic)
- `POST /admin/products` (Basic)
- `PUT /admin/products/:id` (Basic)
- `DELETE /admin/products/:id` (Basic)
- `GET /admin/orders` (Basic)
- `PATCH /admin/orders/:id/status` (Basic)

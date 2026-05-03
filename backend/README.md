# Lesson Plan API (Supabase + ChatGPT)

## 快速開始
1. 複製 `.env.example` 為 `.env`，填入 Supabase 與 OpenAI 專案資訊。
2. 在 Supabase SQL Editor 執行 `sql/supabase_init.sql`。
3. 安裝依賴與啟動：
   - `npm install`
   - `npm run dev`

## 必要環境變數
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`（預設 `gpt-4.1-mini`）

## API
- `POST /api/v1/lesson-plans/generate`（由 ChatGPT 生成教案 JSON）
- `GET /api/v1/lesson-plans/:id`
- `POST /api/v1/lesson-plans/:id/enhance`（由 ChatGPT 微調教案 JSON）

## 回傳欄位
- `lesson_plan`
- `quality_report`
- `language_check`

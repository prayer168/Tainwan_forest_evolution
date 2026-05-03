# Lesson Plan API (Supabase)

## 快速開始
1. 複製 `.env.example` 為 `.env`，填入 Supabase 專案資訊。
2. 在 Supabase SQL Editor 執行 `sql/supabase_init.sql`。
3. 安裝依賴與啟動：
   - `npm install`
   - `npm run dev`

## API
- `POST /api/v1/lesson-plans/generate`
- `GET /api/v1/lesson-plans/:id`
- `POST /api/v1/lesson-plans/:id/enhance`

## 回傳欄位
- `lesson_plan`
- `quality_report`
- `language_check`

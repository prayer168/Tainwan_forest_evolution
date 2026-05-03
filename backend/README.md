# Lesson Plan API (Supabase + ChatGPT Edge Function)

## 你說的重點：ChatGPT API Key 放在 Supabase
本專案已採用這個方式：
- API 伺服器 **不保存 OPENAI_API_KEY**。
- `OPENAI_API_KEY` 僅放在 **Supabase Secrets**。
- ChatGPT 呼叫只在 Supabase Edge Function `chatgpt-lesson-plan` 中執行。

## 先決條件（Windows）
在執行 `npm run dev` 前，請先安裝：
1. Node.js 20+（含 npm）
2. Git（選用）
3. Docker Desktop（若你想用 Docker 啟動）

安裝後請先確認：
- `node -v`
- `npm -v`

若出現「`npm` 不是內部或外部命令」代表 Node.js 尚未安裝或 PATH 未生效。

## 快速開始（本機）
1. 複製 `.env.example` 為 `.env`，填入 Supabase 專案資訊。
2. 在 Supabase SQL Editor 執行 `sql/supabase_init.sql`。
3. 安裝 Supabase CLI，登入並連線專案。
4. 設定 Supabase Secrets：
   - `supabase secrets set OPENAI_API_KEY=你的金鑰`
   - `supabase secrets set OPENAI_MODEL=gpt-4.1-mini`
5. 部署 Edge Function：
   - `supabase functions deploy chatgpt-lesson-plan`
6. 安裝依賴與啟動 API：
   - `npm install`
   - `npm run dev`

## Windows 常見誤用（你目前遇到的）
你在 `cmd` 直接輸入 `http://localhost:3000/health` 會報錯，因為那不是可執行命令。

請用以下任一方式：

### 方法 A：瀏覽器
直接在瀏覽器網址列輸入：
- `http://localhost:3000/`
- `http://localhost:3000/health`

### 方法 B：Windows CMD
- `curl http://localhost:3000/health`
- 或 `start http://localhost:3000/health`

### 方法 C：PowerShell
- `Invoke-RestMethod http://localhost:3000/health`

## 如果你現在 npm 無法使用（最快解）
改用 Docker：
1. 安裝 Docker Desktop
2. 準備好 `.env`
3. 執行：`docker compose up --build`
4. 驗證：`http://localhost:3000/health`

## 常見錯誤：ERR_CONNECTION_REFUSED
代表 API 沒有在你本機的 3000 port 運行，通常是：
- Node/npm 沒安裝（你目前截圖就是這個狀況）
- 沒執行 `npm run dev` 或容器沒啟動
- `.env` 缺失導致程序啟動即退出
- port 被其他程序占用

可用這些指令檢查：
- `where node`、`where npm`（Windows CMD）
- `netstat -ano | findstr :3000`（Windows CMD）
- `docker compose logs -f`

## API
- `POST /api/v1/lesson-plans/generate`（透過 Supabase Edge Function 生成）
- `GET /api/v1/lesson-plans/:id`
- `POST /api/v1/lesson-plans/:id/enhance`（透過 Supabase Edge Function 微調）

## 回傳欄位
- `lesson_plan`
- `quality_report`
- `language_check`

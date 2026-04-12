# 台灣森林演替互動儀表板

這是一個以純前端（HTML/CSS/JavaScript）製作的互動儀表板，提供「台灣森林演替」的教育展示。

## 功能

- 依海拔帶（低/中/高）調整演替速度。
- 依干擾強度（低/中/高）模擬先驅樹種回升幅度與恢復延遲。
- 透過滑桿查看 1–200 年演替過程。
- 自動播放演替動畫。
- 顯示林分組成折線圖與動態重點解讀。

## 啟動方式

```bash
python -m http.server 8000
```

開啟瀏覽器前往：

- <http://localhost:8000>

## 注意

- 模型參數為教學示意，非研究級預測。

## GitHub 上線（GitHub Pages）

本專案已包含 `.github/workflows/deploy-pages.yml`，推送到 `main` / `master` / `work` 分支後會自動部署。

### 一次性設定

1. 到 GitHub 專案頁面 → **Settings** → **Pages**。
2. 在 **Build and deployment** 中，將 **Source** 設為 **GitHub Actions**。
3. 推送最新 commit 後，等待 Actions workflow `Deploy static site to GitHub Pages` 完成。

完成後網址通常為：

- `https://<你的帳號>.github.io/<你的repo名稱>/`

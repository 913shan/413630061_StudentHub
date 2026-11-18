# 413630061_StudentHub

1. [GitHub 倉庫：413630061_StudentHub](https://github.com/913shan/413630061_StudentHub)
2. Postman 測試截圖
   - [findAll（200 OK）](screenshots/findAll/413630061.png)
   - [insertOne（200 OK）](screenshots/insertOne/413630061.png)

## 測試回應紀錄
   - [findAll：新增前 50 筆](docs/GET-新增前.json)
   - [insertOne：成功新增，sid 為 51](docs/POST-新增成功.json)
   - [findAll：新增後 51 筆](docs/GET-新增後.json)

已在本機 Postman 桌面版實際送出 GET 與 POST，皆為 HTTP 200，Test Results 各 3/3。POST 截圖使用未重複的 tkuxx9998，產生 sid "52"；先前 Newman 測試的 tkuxx9999 為 sid "51"。

## 專案結構

- `BackEndExample/`：老師的 Express、TypeScript、Mongoose 後端及連線修正。
- `FrontEndExample/`：老師的 React 前端，API 預設為 8890。
- `studentslist.csv`：老師提供的 50 筆學生資料。
- `postman/413630061_StudentHub.postman_collection.json`：可直接匯入 Postman。
- `compose.yaml`、`docker/init.js`：MongoDB 與後端的 Docker 設定。
- `legacy/`：之前的 SQLite 版本。

## Docker 啟動

可先安裝並開啟 Docker Desktop，再雙擊 `啟動作業.command`，它會自動產生本機密碼並啟動服務。

手動操作方式：複製根目錄 `.env.example` 為 `.env`，自行設定兩組本機資料庫密碼，再執行：

```sh
docker compose up -d
```

首次建立空白 volume 時會自動建立帳號並匯入 50 筆資料。後端 API 預設為 `http://localhost:8890`。本機 8877、8878 已被其他程式占用，因此使用 8890；若要跟老師使用相同埠，先確認 8877 可用，再把根目錄 `.env` 的 `API_PORT` 改成 8877，並同步調整 Postman 網址。

Docker Desktop 已安裝，MongoDB 與後端容器已實際啟動。使用 Newman 執行 Postman Collection：2 個請求均為 HTTP 200，6 項斷言全部通過；GET 50 筆 → POST sid "51" → GET 51 筆。[Docker 測試結果](docs/Docker測試結果.json)。

## 已完成的本機測試

以真正 MongoDB 8 啟用帳號驗證，匯入 CSV 後實測 GET 回傳 50 筆；POST 新增 `tkuxx9999` 回傳 HTTP 200、`sid: "51"` 與 `_id`；再 GET 得到 51 筆。重複新增回傳 HTTP 403。TypeScript 編譯通過。

Postman 匯入 `postman/413630061_StudentHub.postman_collection.json` 後按 Send 即可測試。上述帳號已在本機新增，再測新增請改用未使用的四碼座號。新資料庫第一次匯入後則可直接送出範例。

## 不使用 Docker 的啟動方式

依 [老師操作文件](docs/老師操作文件.md) 準備 MongoDB 帳號。將 `BackEndExample/.env.example` 複製為 `.env` 並填入自己的密碼，在 `BackEndExample` 執行 `npm ci`；回根目錄執行 `node scripts/init-db.cjs --auth`；最後在 `BackEndExample` 執行 `npm run compile` 與 `npm start`。

## 程式碼來源

課程原始碼與學生範例來自 [yyyxi18/115_StudentHub](https://github.com/yyyxi18/115_StudentHub)。保留課程架構，修正 MongoDB 認證資料庫、錯誤傳遞與日誌；加入匯入工具、Postman 測試與 Docker 設定。實際密碼、資料庫、runtime 和 node_modules 均不提交。

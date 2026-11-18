# 413630061 StudentHub 課程作業

依老師 [115_StudentHub](https://github.com/yyyxi18/115_StudentHub) 原始碼完成的 **Express / TypeScript / MongoDB 版本位於 [course/](course/)**。原有 SQLite 版本保留在根目錄。

## 課程版使用方式

1. 安裝 Node.js 22 與 MongoDB 8，依 [老師操作文件](course/README.md) 建立帳號與資料庫。若老師要求 Docker，請依該文件安裝 Docker Desktop 並啟動容器。
2. 複製 `course/BackEndExample/.env.example` 為 `.env`，填入自己的資料庫帳號及路徑；`DBAUTHSOURCE=studenthub`，`PORT=8890`，其他欄位參考老師文件。
3. 在 `course/BackEndExample` 執行 `npm ci`。
4. 回到 `course`，執行 `node scripts/init-db.cjs --auth` 匯入 CSV（已存在的帳號會略過）。
5. 在 `course/BackEndExample` 執行 `npm run compile`，再執行 `npm start`。
6. Postman 匯入 [課程版 Collection](course/StudentHub.postman_collection.json)，預設 `http://localhost:8890`。

## 實測結果

本機以真正 MongoDB 8、帳號驗證及課程 CSV 測試：GET 50 筆 → POST 新增 tkuxx9999，sid 為字串 "51" → GET 51 筆。重複新增回傳 HTTP 403。已通過 TypeScript 編譯。

回應紀錄：[新增前](course/GET-新增前.json)、[新增成功](course/POST-新增成功.json)、[新增後](course/GET-新增後.json)。這些是測試回應，資料不會隨 clone 自動出現在資料庫。

本機使用 8890 是因 8877、8878 已被占用。MongoDB 本次以本機程序執行，**未驗證 Docker 容器或 Compass 操作**。

## 修改與來源

保留老師原始前後端與 CSV，修正後端 authSource，使資料庫內建立的應用帳號可以驗證；修正連線失敗傳遞及避免記錄含密碼的 URI。移除套件中的舊 Node 19 依賴，新增一次性編譯命令與可重複執行的 CSV 匯入工具。老師文件中的帳密僅為公開練習範例，實際 `.env`、資料庫及 runtime 均未上傳。

---

## 原有 SQLite 版本說明

# 413630061_StudentHub

StudentHub 提供學生名單、新增表單，以及供 Postman 測試的兩支 JSON API。

## 本機啟動

安裝 Node.js 22.13 以上版本，從專案根目錄執行：

```sh
node server.mjs
```

瀏覽器開啟 `http://127.0.0.1:8877`。SQLite 資料庫會自動建立於 `data/students.sqlite`，初次啟動時名單為空。可使用 `PORT` 調整連接埠，或用 `STUDENTHUB_DB` 指定資料庫位置。

## Postman 測試

在 Postman 選 **Import**，匯入根目錄的 `413630061_StudentHub.postman_collection.json`。預設連線至 `http://127.0.0.1:8877`，可在 Collection 的 **Variables** 調整 `baseUrl`。

| 方法 | 路徑 | 成功回應 |
| --- | --- | --- |
| GET | `/api/v1/user/findAll` | `200 OK`，`body` 是學生陣列 |
| POST | `/api/v1/user/insertOne` | `200 OK`，`body` 含新增資料與 `sid` |

先按 **Send** 送出 `insertOne`，再送 `findAll`，即可在陣列看到新增資料。測試用名稱會在每次傳送時產生。截圖時保留方法、URL、HTTP 狀態及回應，並在 `insertOne` 顯示 **Body → raw → JSON**。

## 程式碼來源

前端、Node.js HTTP API、SQLite 儲存和 Postman Collection 在本倉庫獨立實作，使用者提供的作業截圖是路徑、欄位名稱和回應格式的參考。前端使用原生 HTML、CSS 與 JavaScript，後端使用 Node.js 內建模組。

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

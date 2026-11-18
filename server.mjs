import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath = process.env.STUDENTHUB_DB || 'data/students.sqlite';
if (databasePath !== ':memory:') mkdirSync(dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec(`CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY,
  userName TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  grade TEXT NOT NULL,
  "class" TEXT NOT NULL,
  Email TEXT NOT NULL
)`);
const list = db.prepare(`SELECT CAST(id AS TEXT) AS sid, userName, name,
  department, grade, "class", Email FROM students ORDER BY id`);
const insert = db.prepare(`INSERT INTO students (userName, name, department, grade, "class", Email)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(userName) DO NOTHING RETURNING CAST(id AS TEXT) AS sid`);
const fields = ['userName', 'name', 'department', 'grade', 'class', 'Email'];
const assets = new Map([
  ['/', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/style.css', ['style.css', 'text/css']],
]);

function json(res, code, message, body = null) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ code, message, body }));
}

async function addStudent(req, res) {
  if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
    return json(res, 415, '請使用 application/json');
  }
  let input;
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of req.iterator({ destroyOnReturn: false })) {
      size += chunk.length;
      if (size > 16384) {
        req.resume();
        return json(res, 413, '請求內容過大');
      }
      chunks.push(chunk);
    }
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return json(res, 400, 'JSON 格式錯誤');
  }

  if (!input || Array.isArray(input) || fields.some(field =>
    typeof input[field] !== 'string' || !input[field].trim() || input[field].trim().length > 254
  )) return json(res, 400, '六個學生欄位都必須填寫，且每個欄位最多 254 字元');

  const student = Object.fromEntries(fields.map(field => [field, input[field].trim()]));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.Email)) {
    return json(res, 400, '電子郵件格式錯誤');
  }
  const row = insert.get(...fields.map(field => student[field]));
  if (!row) return json(res, 409, '使用者名稱已存在');
  json(res, 200, '新增學生成功', { ...row, ...student });
}

createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (path === '/api/v1/user/findAll' && req.method === 'GET') {
      return json(res, 200, '查詢成功', list.all());
    }
    if (path === '/api/v1/user/insertOne' && req.method === 'POST') {
      return await addStudent(req, res);
    }
    const asset = assets.get(path);
    if (asset && req.method === 'GET') {
      const [file, type] = asset;
      const content = readFileSync(new URL('./public/' + file, import.meta.url));
      res.writeHead(200, { 'Content-Type': type + '; charset=utf-8' });
      return res.end(content);
    }
    json(res, 404, '找不到此路徑');
  } catch (error) {
    console.error(error);
    if (!res.headersSent) json(res, 500, '伺服器錯誤');
  }
}).listen(Number(process.env.PORT || 8877), '127.0.0.1', () => {
  console.log('StudentHub 已啟動');
});

#!/bin/bash
set -e
cd "$(dirname "$0")"
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
if ! command -v docker >/dev/null; then
 echo '請先安裝並開啟 Docker Desktop，再執行這個檔案。'
 read -r -p '按 Enter 關閉'
 exit 1
fi
if ! docker info >/dev/null 2>&1; then
 echo '請開啟 Docker Desktop，接受條款並等待 Engine running，再重試。'
 read -r -p '按 Enter 關閉'
 exit 1
fi
if [ ! -f .env ]; then
 umask 077
 printf 'MONGO_ROOT_PASSWORD=%s\nMONGO_APP_PASSWORD=%s\nAPI_PORT=8890\n' "$(openssl rand -hex 24)" "$(openssl rand -hex 24)" > .env
fi
docker compose up -d
echo '啟動中，首次安裝套件可能需要幾分鐘。'
for attempt in {1..120}; do
 if curl -fsS http://localhost:8890/api/v1/user/findAll >/dev/null; then
  echo 'API 已就緒：http://localhost:8890/api/v1/user/findAll'
  echo '請在 Postman 匯入 postman/413630061_StudentHub.postman_collection.json'
  read -r -p '按 Enter 關閉，容器會繼續執行'
  exit 0
 fi
 sleep 3
done
docker compose logs --tail 30 backend
read -r -p 'API 尚未就緒，按 Enter 關閉並將上方錯誤告知我'
exit 1

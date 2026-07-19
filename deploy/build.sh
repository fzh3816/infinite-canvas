#!/usr/bin/env bash
# prod 分支：构建 infinite-canvas 镜像并启动/重启容器
# 用法：bash deploy/build.sh [--pull]
#   --pull  部署前先 git pull origin prod
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "${1:-}" == "--pull" ]]; then
  echo "[deploy] git pull origin prod..."
  git pull origin prod
fi

if docker compose ps -q infinite-canvas 2>/dev/null | grep -q .; then
  echo "[deploy] 停止旧容器..."
  docker compose stop infinite-canvas
fi

echo "[deploy] 构建镜像..."
docker compose build

echo "[deploy] 启动容器..."
docker compose up -d

echo "[deploy] 清理悬空镜像..."
docker image prune -f

echo "[deploy] 状态："
docker compose ps

#!/usr/bin/env bash
set -e

trap 'kill 0' EXIT

echo "Starting backend (localhost:8000)..."
cd backend && php artisan serve &

echo "Starting frontend (localhost:5173)..."
cd frontend && npm run dev &

wait

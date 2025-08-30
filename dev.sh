#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR/backend"
npm run dev &
BACK_PID=$!

echo "Backend started (PID $BACK_PID) on http://localhost:3001"

cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONT_PID=$!

echo "Frontend started (PID $FRONT_PID) on http://localhost:5173"

declare -a PIDS=($BACK_PID $FRONT_PID)

cleanup() {
  echo "\nShutting down..."
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
}
trap cleanup EXIT INT TERM

wait

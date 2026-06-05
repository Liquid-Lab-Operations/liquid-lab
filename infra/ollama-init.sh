#!/bin/bash

# Liquid Lab — Ollama Model Initialization
# Puxar os 8 modelos em paralelo após Ollama estar pronto

set -e

OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
MODELS=(
  "mistral:7b"
  "neural-chat:7b"
  "orca-mini:3b"
  "phi:2.7b"
  "tinyllama:1.1b"
  "llama2:7b"
  "zephyr:7b"
  "dolphin-mixtral:8x7b"
)

echo "[$(date)] Starting Ollama model initialization..."
echo "URL: $OLLAMA_URL"

# Wait for Ollama to be ready
echo "[$(date)] Waiting for Ollama to be ready..."
for i in {1..30}; do
  if curl -s "$OLLAMA_URL/api/tags" > /dev/null 2>&1; then
    echo "[$(date)] Ollama is ready!"
    break
  fi
  echo "[$(date)] Attempt $i/30 - Waiting for Ollama..."
  sleep 10
done

# Pull models in parallel
echo "[$(date)] Pulling models in parallel..."
pids=()

for model in "${MODELS[@]}"; do
  echo "[$(date)] Starting: $model"
  (
    echo "[$(date)] [${model}] Pulling..."
    timeout 3600 ollama pull "$model" 2>&1 | sed "s/^/[${model}] /"
    echo "[$(date)] [${model}] Complete"
  ) &
  pids+=($!)
done

# Wait for all background jobs
echo "[$(date)] Waiting for all model pulls to complete..."
failed=0
for pid in "${pids[@]}"; do
  if ! wait $pid; then
    ((failed++))
  fi
done

echo "[$(date)] Model initialization complete (failed: $failed)"

# Verify models
echo "[$(date)] Verifying models..."
curl -s "$OLLAMA_URL/api/tags" | jq '.models[] | .name' || true

echo "[$(date)] Ollama initialization finished!"

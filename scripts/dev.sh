#!/usr/bin/env bash

declare -a check_ports=(3000 4200)
declare -A port_labels=(
  [3000]="Backend  (NestJS)  → http://localhost:3000"
  [4200]="Frontend (Angular) → http://localhost:4200"
)

pids_to_kill=()
occupied_lines=()

for port in "${check_ports[@]}"; do
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    for pid in $pids; do
      proc=$(ps -p "$pid" -o comm= 2>/dev/null || echo "?")
      occupied_lines+=("  Puerto $port — ${port_labels[$port]} — PID $pid ($proc)")
      pids_to_kill+=("$pid")
    done
  fi
done

if [[ ${#pids_to_kill[@]} -gt 0 ]]; then
  echo ""
  echo "AVISO: Los siguientes puertos ya están en uso:"
  echo ""
  for line in "${occupied_lines[@]}"; do
    echo "$line"
  done
  echo ""
  read -rp "¿Matar estos procesos y continuar arrancando? [s/N] " answer
  if [[ "$answer" =~ ^[sSyY]$ ]]; then
    echo ""
    for pid in "${pids_to_kill[@]}"; do
      if kill -9 "$pid" 2>/dev/null; then
        echo "  PID $pid eliminado."
      else
        echo "  No se pudo eliminar PID $pid (puede que ya haya terminado)."
      fi
    done
    echo ""
  else
    echo "Operación cancelada."
    exit 1
  fi
fi

npm run dev:backend & npm run dev:frontend

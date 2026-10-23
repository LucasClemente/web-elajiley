#!/usr/bin/env bash
# Publica dist/ en SiteGround por SSH.
# Uso:  npm run deploy            (web en construcción: noindex)
#       npm run deploy:lanzar     (indexable: PUBLIC_INDEXAR=true)
# Variables opcionales: SSH_KEY, SSH_HOST, SSH_USER, SSH_PORT, REMOTE_DIR
set -euo pipefail

if [[ "${1:-}" == "--lanzar" ]]; then export PUBLIC_INDEXAR=true; fi

SSH_KEY="${SSH_KEY:-$HOME/.ssh/elajiley_siteground}"
SSH_HOST="${SSH_HOST:-gtxm1028.siteground.biz}"
SSH_USER="${SSH_USER:-u3162-odk1oje8hcbg}"
SSH_PORT="${SSH_PORT:-18765}"
REMOTE_DIR="${REMOTE_DIR:-www/elajiley.com/public_html}"

ssh_() { ssh -i "$SSH_KEY" -p "$SSH_PORT" -o BatchMode=yes -o StrictHostKeyChecking=accept-new "$SSH_USER@$SSH_HOST" "$@"; }

cd "$(dirname "$0")/.."
echo "→ Compilando (PUBLIC_INDEXAR=${PUBLIC_INDEXAR:-false})"
npx astro build

echo "→ Subiendo a $SSH_HOST:$REMOTE_DIR"
tar -C dist -czf - . | ssh_ "set -e
  DEST=\"\$HOME/$REMOTE_DIR\"
  NUEVO=\"\$HOME/.elajiley-nuevo\"
  rm -rf \"\$NUEVO\" && mkdir -p \"\$NUEVO\" \"\$DEST\"
  tar -xzf - -C \"\$NUEVO\"
  # Sincroniza conservando lo que gestiona SiteGround (.well-known para SSL).
  if command -v rsync >/dev/null; then
    rsync -a --delete --exclude '.well-known' \"\$NUEVO\"/ \"\$DEST\"/
  else
    find \"\$DEST\" -mindepth 1 -maxdepth 1 ! -name '.well-known' -exec rm -rf {} +
    cp -a \"\$NUEVO\"/. \"\$DEST\"/
  fi
  rm -rf \"\$NUEVO\"
  echo \"Publicado: \$(find \"\$DEST\" -name index.html | wc -l) páginas\""
echo "✓ Listo: https://elajiley.com/"

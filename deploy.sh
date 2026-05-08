#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="${REPO_URL:-https://github.com/Jsua3/Despliegue_05_2026.git}"
APP_DIR="${APP_DIR:-/home/ubuntu/Despliegue_05_2026}"
FALLBACK_PUBLIC_IP="18.230.85.195"

log() {
  printf '\n==> %s\n' "$1"
}

detect_public_ip() {
  local token
  token="$(curl -fsS --max-time 2 -X PUT \
    -H "X-aws-ec2-metadata-token-ttl-seconds: 60" \
    "http://169.254.169.254/latest/api/token" 2>/dev/null || true)"

  if [ -n "$token" ]; then
    curl -fsS --max-time 2 \
      -H "X-aws-ec2-metadata-token: $token" \
      "http://169.254.169.254/latest/meta-data/public-ipv4" 2>/dev/null || true
    return
  fi

  curl -fsS --max-time 2 "http://169.254.169.254/latest/meta-data/public-ipv4" 2>/dev/null || true
}

ensure_swap() {
  if swapon --show | grep -q '/swapfile'; then
    log "Swap ya existe"
    return
  fi

  log "Creando swap de 2GB"
  sudo swapoff /swapfile 2>/dev/null || true
  sudo rm -f /swapfile
  sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile

  if ! grep -q '^/swapfile ' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
  fi
}

install_docker() {
  log "Instalando dependencias base"
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl git gnupg

  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    log "Docker ya esta instalado"
  else
    log "Instalando Docker Engine"
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo rm -f /etc/apt/keyrings/docker.gpg
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    . /etc/os-release
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
      | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  fi

  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER" || true
}

sync_repo() {
  if [ -d "$APP_DIR/.git" ]; then
    log "Actualizando repositorio en $APP_DIR"
    cd "$APP_DIR"
    git fetch --all --prune
    local default_branch
    default_branch="$(git remote show origin | awk '/HEAD branch/ {print $NF}')"
    default_branch="${default_branch:-main}"
    git checkout "$default_branch" || git checkout -B "$default_branch" "origin/$default_branch"
    git reset --hard "origin/$default_branch"
  else
    log "Clonando repositorio en $APP_DIR"
    sudo mkdir -p "$(dirname "$APP_DIR")"
    sudo chown -R "$USER:$USER" "$(dirname "$APP_DIR")"
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
  fi
}

write_env() {
  local public_ip
  public_ip="${PUBLIC_IP:-$(detect_public_ip)}"
  public_ip="${public_ip:-$FALLBACK_PUBLIC_IP}"

  log "Creando .env de despliegue"
  cat > "$APP_DIR/.env" <<ENV
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-root2026}
MYSQL_DATABASE=${MYSQL_DATABASE:-parcial_db}
MYSQL_USER=${MYSQL_USER:-parcial_user}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-parcial2026}
POSTGRES_DB=${POSTGRES_DB:-parcial_audit}
POSTGRES_USER=${POSTGRES_USER:-audit_user}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-audit2026}
JWT_SECRET=${JWT_SECRET:-ParcialJwtSecretProduccion2026MuySeguro!!}
CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS:-http://localhost,http://${public_ip}}
SEED_ENABLED=${SEED_ENABLED:-true}
ENV
}

compose_up() {
  cd "$APP_DIR"
  log "Reconstruyendo contenedores"
  sudo docker compose down --remove-orphans
  sudo docker compose up -d --build
}

show_status() {
  cd "$APP_DIR"
  log "Estado de servicios"
  sudo docker compose ps

  log "Logs backend"
  sudo docker compose logs --tail=120 backend || true

  log "Logs frontend"
  sudo docker compose logs --tail=80 frontend || true

  log "Logs mysql"
  sudo docker compose logs --tail=80 mysql || true

  log "Logs postgres"
  sudo docker compose logs --tail=80 postgres || true
}

smoke_tests() {
  log "Esperando backend para pruebas rapidas"
  for _ in $(seq 1 30); do
    if curl -fsS http://localhost:8080/api/catalogos >/dev/null 2>&1; then
      break
    fi
    sleep 4
  done

  log "curl -i http://localhost"
  curl -i --max-time 15 http://localhost || true

  log "curl -i http://localhost:8080/api/catalogos"
  curl -i --max-time 15 http://localhost:8080/api/catalogos || true

  log "curl -i http://localhost/api/catalogos"
  curl -i --max-time 15 http://localhost/api/catalogos || true

  log "curl -i http://localhost/api/db/health"
  curl -i --max-time 15 http://localhost/api/db/health || true
}

main() {
  ensure_swap
  install_docker
  sync_repo
  write_env
  chmod +x "$APP_DIR/deploy.sh" || true
  compose_up
  show_status
  smoke_tests
  log "Despliegue terminado"
}

main "$@"

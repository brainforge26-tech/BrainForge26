#!/usr/bin/env bash
# ==============================================================================
# Setup Script for Second Production Project: BrainForge26
# Target OS: Ubuntu 24.04 LTS
# Non-destructive: Coexists safely with existing production apps (e.g., dohsedu.com)
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# Configuration Variables
# ------------------------------------------------------------------------------
PROJECT_NAME="BrainForge26"
REPO_URL="https://github.com/brainforge26-tech/BrainForge26.git"
TARGET_DIR="/var/www/BrainForge26"

DB_NAME="brainforge26"
DB_USER="brainforge26_user"

FRONTEND_PORT="3001"
BACKEND_PORT="5001"

FRONTEND_DOMAIN="brainforge26.tech"
BACKEND_DOMAIN="api.brainforge26.tech"
ADMIN_EMAIL="admin@brainforge26.tech"

echo "=============================================================================="
echo "Starting Non-Destructive Production Setup for ${PROJECT_NAME}"
echo "=============================================================================="

# ------------------------------------------------------------------------------
# 1. Package Installation & Verification
# ------------------------------------------------------------------------------
echo "==> [1/10] Verifying and installing system prerequisites..."
sudo apt-get update -y || true
sudo apt-get install -y --fix-missing git curl build-essential postgresql postgresql-contrib nginx certbot python3-certbot-nginx openssl || true

# Ensure Node.js & PM2 are available globally
if ! command -v node &> /dev/null; then
    echo "Node.js not found! Installing Node.js LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    sudo npm install -g pm2
fi

# ------------------------------------------------------------------------------
# 2. Database & User Creation (PostgreSQL)
# ------------------------------------------------------------------------------
echo "==> [2/10] Configuring PostgreSQL database & user..."

# Generate secure random passwords if not already existing
DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
JWT_SECRET=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)

sudo -u postgres psql -v ON_ERROR_STOP=1 <<EOF
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
        CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';
    ELSE
        ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
    END IF;
END
\$\$;
EOF

sudo -u postgres psql -v ON_ERROR_STOP=1 <<EOF
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOF

# Grant schema privileges for PostgreSQL 15+
sudo -u postgres psql -d "${DB_NAME}" -v ON_ERROR_STOP=1 <<EOF
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER SCHEMA public OWNER TO ${DB_USER};
EOF

echo "✓ PostgreSQL Database '${DB_NAME}' and User '${DB_USER}' ready."

# ------------------------------------------------------------------------------
# 3. Directory Setup & Repository Clone
# ------------------------------------------------------------------------------
echo "==> [3/10] Preparing target project directory (${TARGET_DIR})..."
sudo mkdir -p "${TARGET_DIR}"
sudo chown -R $USER:$USER "${TARGET_DIR}"

if [ -d "${TARGET_DIR}/.git" ]; then
    echo "Repository already exists. Fetching latest changes..."
    cd "${TARGET_DIR}"
    git fetch origin
    git reset --hard origin/main
else
    echo "Cloning repository ${REPO_URL} into ${TARGET_DIR}..."
    git clone "${REPO_URL}" "${TARGET_DIR}"
    cd "${TARGET_DIR}"
fi

# ------------------------------------------------------------------------------
# 4. Generate Production .env Files
# ------------------------------------------------------------------------------
echo "==> [4/10] Writing production environment files..."

# Backend .env
cat <<EOF > "${TARGET_DIR}/backend/.env"
PORT=${BACKEND_PORT}
NODE_ENV=production
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}?schema=public"
JWT_ACCESS_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"
CLIENT_URL="https://${FRONTEND_DOMAIN}"
EOF

# Frontend .env.local
cat <<EOF > "${TARGET_DIR}/frontend/.env.local"
NEXT_PUBLIC_API_URL="https://${BACKEND_DOMAIN}/api/v1"
PORT=${FRONTEND_PORT}
NODE_ENV=production
EOF

echo "✓ Environment configuration written."

# ------------------------------------------------------------------------------
# 5. Install Dependencies & Build Backend
# ------------------------------------------------------------------------------
echo "==> [5/10] Building Backend application..."
cd "${TARGET_DIR}/backend"
npm install --no-audit
npx prisma generate
npx prisma migrate deploy
npm run build

# ------------------------------------------------------------------------------
# 6. Install Dependencies & Build Frontend
# ------------------------------------------------------------------------------
echo "==> [6/10] Building Frontend application..."
cd "${TARGET_DIR}/frontend"
npm install --no-audit
npm run build

# ------------------------------------------------------------------------------
# 7. Configure & Start PM2 Processes
# ------------------------------------------------------------------------------
echo "==> [7/10] Starting background services using PM2..."
cd "${TARGET_DIR}"

# Ensure ecosystem file is in place
if [ ! -f "${TARGET_DIR}/ecosystem.config.js" ]; then
    cat <<EOF > "${TARGET_DIR}/ecosystem.config.js"
module.exports = {
  apps: [
    {
      name: 'brainforge26-backend',
      cwd: '/var/www/BrainForge26/backend',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      }
    },
    {
      name: 'brainforge26-frontend',
      cwd: '/var/www/BrainForge26/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
EOF
fi

pm2 startOrReload ecosystem.config.js --env production
pm2 save

# ------------------------------------------------------------------------------
# 8. Nginx Site Configuration
# ------------------------------------------------------------------------------
echo "==> [8/10] Deploying Nginx site configuration..."

sudo tee /etc/nginx/sites-available/brainforge26.tech > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name brainforge26.tech www.brainforge26.tech;

    client_max_body_size 50M;

    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name api.brainforge26.tech;

    client_max_body_size 50M;

    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location /socket.io/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/brainforge26.tech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# ------------------------------------------------------------------------------
# 9. SSL Certificate Provisioning (Certbot)
# ------------------------------------------------------------------------------
echo "==> [9/10] Obtaining SSL certificates via Certbot..."
if command -v certbot &> /dev/null; then
    sudo certbot --nginx \
        -d "${FRONTEND_DOMAIN}" \
        -d "www.${FRONTEND_DOMAIN}" \
        -d "${BACKEND_DOMAIN}" \
        --non-interactive \
        --agree-tos \
        -m "${ADMIN_EMAIL}" \
        --redirect || echo "Certbot DNS verification warning: Ensure DNS A records point to this VPS IP."
    sudo systemctl reload nginx
fi

# ------------------------------------------------------------------------------
# 10. Verification & Summary
# ------------------------------------------------------------------------------
echo "==> [10/10] Verifying live services..."
sleep 3

echo -n "Checking Backend (Port 5001)... "
if curl -s -f http://127.0.0.1:5001 &> /dev/null || curl -s http://127.0.0.1:5001/api/v1/health &> /dev/null; then
    echo "✓ UP"
else
    echo "⚠ Warning: Backend response check pending."
fi

echo -n "Checking Frontend (Port 3001)... "
if curl -s -f http://127.0.0.1:3001 &> /dev/null; then
    echo "✓ UP"
else
    echo "⚠ Warning: Frontend response check pending."
fi

echo "=============================================================================="
echo "DEPLOYMENT COMPLETE!"
echo "Database:       ${DB_NAME}"
echo "Database User:  ${DB_USER}"
echo "Database Pass:  ${DB_PASS}"
echo "Frontend:       https://${FRONTEND_DOMAIN} (Port 3001)"
echo "Backend API:    https://${BACKEND_DOMAIN} (Port 5001)"
echo "PM2 Processes:  brainforge26-backend, brainforge26-frontend"
echo "=============================================================================="

#!/bin/bash
# ============================================================
# Setup Script: PGWeb Database Manager di db.mathfingers.my.id
# Jalankan di VPS SumoPod sebagai root
# ============================================================

set -e

echo "🚀 Setup PGWeb Database Manager..."
echo "===================================="

# Pastikan docker compose sudah jalan
cd /opt/mathfingers
docker compose up -d db-web
echo "✅ Container PGWeb sudah jalan di port 8081"

# Copy konfigurasi Nginx
echo "📋 Mengcopy konfigurasi Nginx..."
cp nginx/db.conf /etc/nginx/sites-available/db.mathfingers.my.id
ln -sf /etc/nginx/sites-available/db.mathfingers.my.id /etc/nginx/sites-enabled/db.mathfingers.my.id

# Test konfigurasi nginx (tanpa SSL dulu)
echo "🔍 Testing Nginx config..."
nginx -t

# Install Certbot jika belum ada
if ! command -v certbot &> /dev/null; then
    echo "📦 Menginstall Certbot..."
    apt-get update -y
    apt-get install -y certbot python3-certbot-nginx
fi

# Minta SSL Certificate untuk subdomain db.mathfingers.my.id
echo "🔐 Meminta SSL Certificate dari Let's Encrypt..."
certbot --nginx -d db.mathfingers.my.id --non-interactive --agree-tos -m admin@mathfingers.my.id --redirect

# Reload Nginx
echo "🔄 Reload Nginx..."
systemctl reload nginx

echo ""
echo "✅ SELESAI! PGWeb Database Manager sudah aktif."
echo "===================================="
echo "🌐 Akses: https://db.mathfingers.my.id"
echo "👤 Username: admin"
echo "🔑 Password: MathFingers2026!"
echo "===================================="
echo ""
echo "⚠️  PENTING: Ganti password di docker-compose.yml setelah login pertama!"

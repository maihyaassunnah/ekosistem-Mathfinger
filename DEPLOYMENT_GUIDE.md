# 🚀 Panduan Lengkap Deploy Ekosistem Mathfingers (GitHub, VPS Self-Hosted & Custom Domain)

Panduan ini memandu Anda langkah demi langkah untuk:
1. **Mengunggah (Push) Source Code ke GitHub**.
2. **Setting DNS Custom Domain (Pointing ke IP VPS)**.
3. **Deploy di VPS Self-Hosted** menggunakan **Docker Compose + Nginx + SSL Gratis (Certbot)** atau menggunakan **Dokploy / Coolify**.

---

## 📌 DAFTAR ISI
- [Langkah 1: Inisialisasi & Push ke GitHub](#langkah-1-push-ke-github)
- [Langkah 2: Setting DNS Custom Domain](#langkah-2-setting-dns-custom-domain)
- [Langkah 3: Persiapan VPS (Ubuntu 22.04 / 24.04 LTS)](#langkah-3-persiapan-vps)
- [Langkah 4: Deploy Aplikasi di VPS (Pilihan Metode)](#langkah-4-deploy-di-vps)
  - [Metode A: Docker Compose + Nginx + Certbot SSL (Sangat Direkomendasikan)](#metode-a-docker-compose--nginx--ssl)
  - [Metode B: Coolify / Dokploy (PaaS 1-Click UI)](#metode-b-coolify--dokploy-1-click)
  - [Metode C: PM2 + NodeJS Native](#metode-c-pm2--nodejs-native)
- [Langkah 5: Verifikasi & Auto-Update](#langkah-5-verifikasi--auto-update)

---

## 1️⃣ Langkah 1: Push ke GitHub

Buka terminal di komputer Anda (pada folder proyek ini):

```bash
# 1. Inisialisasi Git
git init

# 2. Tambahkan semua file
git add .

# 3. Commit perdana
git commit -m "feat: complete Ekosistem Mathfingers MVP with CMS, QR Scanner, Leger, Rapor, and Super Admin"

# 4. Ubah branch ke main
git branch -M main

# 5. Hubungkan ke repository GitHub Anda (Ganti dengan URL repo GitHub Anda)
git remote add origin https://github.com/USERNAME/ekosistem-mathfingers.git

# 6. Push ke GitHub
git push -u origin main
```

*(Pastikan Anda telah membuat repository baru di [github.com/new](https://github.com/new) terlebih dahulu)*.

---

## 2️⃣ Langkah 2: Setting DNS Custom Domain

Masuk ke panel domain Anda (Cloudflare, Niagahoster, Domainesia, Rumahweb, Namecheap, dll.):

Tambahkan **DNS Record** tipe `A`:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` *(atau domainanda.com)* | `IP_PUBLIC_VPS_ANDA` (Contoh: `103.187.12.34`) | Auto / 300 |
| **A** | `www` | `IP_PUBLIC_VPS_ANDA` (Contoh: `103.187.12.34`) | Auto / 300 |

> **Tips Cloudflare**: Jika menggunakan Cloudflare, aktifkan Proxy (Cloudflare Orange Cloud) untuk proteksi DDoS dan SSL otomatis instan.

---

## 3️⃣ Langkah 3: Persiapan VPS (Ubuntu 22.04 / 24.04 LTS)

Login ke VPS Anda via SSH:
```bash
ssh root@IP_VPS_ANDA
```

Update package sistem:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw
```

Buka port firewall yang diperlukan:
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 4️⃣ Langkah 4: Deploy di VPS

### 🟢 Metode A: Docker Compose + Nginx + SSL (Paling Stabil & Portabel)

#### 1. Install Docker & Docker Compose di VPS:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### 2. Clone Repository dari GitHub ke VPS:
```bash
cd /var/www
git clone https://github.com/USERNAME/ekosistem-mathfingers.git
cd ekosistem-mathfingers
```

#### 3. Buat file `.env`:
```bash
cp .env.example .env
nano .env
```
*Isi `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` dengan domain Anda (contoh: `https://domainanda.com`).*

#### 4. Jalankan Aplikasi dengan Docker Compose:
```bash
docker compose up -d --build
```

#### 5. Install Nginx & Certbot SSL:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

#### 6. Konfigurasi Nginx Reverse Proxy:
Buat file konfigurasi:
```bash
sudo nano /etc/nginx/sites-available/mathfingers
```
Isi dengan:
```nginx
server {
    server_name domainanda.com www.domainanda.com;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/mathfingers /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Pasang Sertifikat SSL Gratis (HTTPS):
```bash
sudo certbot --nginx -d domainanda.com -d www.domainanda.com
```
*Selesai! Website Anda sekarang sudah live di `https://domainanda.com` dengan SSL gembok hijau aktif otomatis.*

---

### 🟣 Metode B: Coolify / Dokploy (Self-Hosted PaaS 1-Click UI)

Jika Anda ingin panel web modern seperti Vercel tetapi di VPS milik sendiri:

1. Install **Coolify** di VPS:
   ```bash
   curl -fsSL https://cdn.coolify.io/install.sh | bash
   ```
2. Buka dashboard Coolify di `http://IP_VPS:8000`.
3. Hubungkan akun GitHub Anda.
4. Pilih repository `ekosistem-mathfingers`.
5. Masukkan Custom Domain Anda (`domainanda.com`).
6. Klik **Deploy**! Coolify akan mengurus build Docker, SSL, database Postgres, dan reverse proxy secara otomatis 100%.

---

## 5️⃣ Langkah 5: Cara Update Website di Masa Depan

Setiap kali Anda selesai mengedit kode di laptop:
```bash
# Di Komputer Lokal:
git add .
git commit -m "update: fitur baru"
git push
```

```bash
# Di VPS:
cd /var/www/ekosistem-mathfingers
git pull origin main
docker compose up -d --build
```
*(Atau jika menggunakan Coolify, deploy akan terpicu otomatis setiap kali Anda push ke GitHub).*

param(
    [string]$CommitMessage = "deploy: update live production build"
)

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " 🚀 Mathfingers Production Auto-Deploy" -ForegroundColor Cyan
Write-Host "    Target: https://mathfingers.my.id (43.173.12.46)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# 1. Check git status
$status = git status --porcelain
if ($status) {
    Write-Host "📦 Menyimpan perubahan lokal ke git..." -ForegroundColor Yellow
    git add .
    git commit -m "$CommitMessage"
} else {
    Write-Host "ℹ️  Tidak ada perubahan lokal baru yang belum di-commit." -ForegroundColor DarkGray
}

# 2. Push ke GitHub
Write-Host "⬆️  Pushing ke GitHub repository (branch: main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Gagal push ke GitHub. Deployment dihentikan." -ForegroundColor Red
    exit 1
}

# 3. Jalankan pull dan rebuild di VPS via SSH
Write-Host "🌐 Mengupdate container Docker di VPS (43.173.12.46)..." -ForegroundColor Yellow
$remoteCmd = "cd /var/www/ekosistem-Mathfinger && git pull origin main && docker compose up -d --build"

ssh -o StrictHostKeyChecking=no -o ConnectTimeout=15 ubuntu@43.173.12.46 $remoteCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=====================================================" -ForegroundColor Green
    Write-Host " ✅ DEPLOYMENT BERHASIL!" -ForegroundColor Green
    Write-Host " 🌐 Silakan cek: https://mathfingers.my.id" -ForegroundColor Green
    Write-Host "=====================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️ Koneksi SSH selesai atau memerlukan login." -ForegroundColor Yellow
    Write-Host "Jika diminta password, pastikan public key Anda sudah terpasang di VPS." -ForegroundColor Yellow
}

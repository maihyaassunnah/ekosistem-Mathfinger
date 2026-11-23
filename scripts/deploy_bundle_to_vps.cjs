const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function deploy() {
  console.log('📦 Step 1: Creating git bundle locally...');
  const bundlePath = path.join(__dirname, '..', 'update.bundle');
  if (fs.existsSync(bundlePath)) fs.unlinkSync(bundlePath);
  execSync('git bundle create update.bundle 178b04f..HEAD HEAD', { stdio: 'inherit' });
  console.log('✅ Bundle created successfully.');

  console.log('🚀 Step 2: Connecting to VPS via SSH...');
  const conn = new Client();

  conn.on('ready', () => {
    console.log('✅ Connected to VPS.');
    conn.sftp((err, sftp) => {
      if (err) throw err;
      console.log('📤 Step 3: Uploading bundle to VPS /tmp/update.bundle...');
      sftp.fastPut(bundlePath, '/tmp/update.bundle', (err) => {
        if (err) throw err;
        console.log('✅ Bundle uploaded.');

        console.log('🔄 Step 4: Pulling bundle into /var/www/ekosistem-Mathfinger and rebuilding docker app...');
        const cmd = 'cd /var/www/ekosistem-Mathfinger && git fetch /tmp/update.bundle HEAD && git merge FETCH_HEAD && docker compose build app && docker compose up -d app && docker compose ps';

        conn.exec(cmd, (err, stream) => {
          if (err) throw err;
          stream.on('close', (code) => {
            console.log(`🏁 Deployment completed with code ${code}`);
            if (fs.existsSync(bundlePath)) fs.unlinkSync(bundlePath);
            conn.end();
            process.exit(code || 0);
          });
          stream.on('data', (d) => process.stdout.write(d.toString()));
          stream.stderr.on('data', (d) => process.stderr.write(d.toString()));
        });
      });
    });
  });

  conn.on('error', (err) => {
    console.error('❌ SSH Connection error:', err.message);
    process.exit(1);
  });

  conn.connect({
    host: '43.173.12.46',
    port: 22,
    username: 'ubuntu',
    password: process.env.VPS_PASSWORD || '3rE-4Vv-2yv-UuE',
    readyTimeout: 30000,
  });
}

deploy().catch(console.error);

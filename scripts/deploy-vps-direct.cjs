require('dotenv').config();
const { Client } = require('ssh2');

const host = process.env.VPS_HOST || '43.173.12.46';
const username = process.env.VPS_USER || 'ubuntu';
const password = process.env.VPS_PASSWORD || '';

console.log(`🚀 [VPS DEPLOY] Connecting to ${username}@${host}...`);

const conn = new Client();

conn.on('ready', () => {
  console.log('✅ Connected to VPS via SSH.');
  const cmd = 'cd /var/www/ekosistem-Mathfinger && git pull origin main && docker compose build app && docker compose up -d app && docker compose ps';
  console.log(`Executing: ${cmd}`);

  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('❌ Exec error:', err);
      conn.end();
      return;
    }
    stream.on('close', (code, signal) => {
      console.log(`🏁 Command completed with code ${code}`);
      conn.end();
      process.exit(code || 0);
    });
    stream.on('data', (data) => {
      process.stdout.write(data.toString());
    });
    stream.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
});

conn.on('error', (err) => {
  console.error('❌ SSH connection error:', err.message);
  process.exit(1);
});

conn.connect({
  host,
  port: 22,
  username,
  password,
  readyTimeout: 30000,
});


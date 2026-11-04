const net = require('net');
const { Client } = require('ssh2');

const host = process.env.VPS_HOST || '43.173.12.46';
const username = process.env.VPS_USER || 'ubuntu';
const password = process.env.VPS_PASSWORD || '';

const sshClient = new Client();

function startTunnel() {
  sshClient.on('ready', () => {
    console.log('✅ SSH Connection established to VPS ' + host);

    const server = net.createServer((sock) => {
      sshClient.forwardOut('127.0.0.1', sock.remotePort, '127.0.0.1', 5432, (err, stream) => {
        if (err) {
          console.error('ForwardOut error:', err.message);
          sock.destroy();
          return;
        }
        sock.pipe(stream);
        stream.pipe(sock);
      });
    });

    server.listen(5432, '127.0.0.1', () => {
      console.log('🚀 DB Tunnel aktif: localhost:5432 -> VPS:5432');
    });

    server.on('error', (err) => {
      console.error('Server error:', err.message);
    });
  }).on('error', (err) => {
    console.error('SSH error:', err.message);
  }).connect({
    host,
    port: 22,
    username,
    password,
    keepaliveInterval: 15000,
    readyTimeout: 10000,
  });
}

startTunnel();


require('dotenv').config();
const net = require('net');
const { Client } = require('ssh2');

const host = process.env.VPS_HOST || '43.173.12.46';
const username = process.env.VPS_USER || 'ubuntu';
const password = process.env.VPS_PASSWORD || '';

let sshClient = null;
let isConnected = false;
let isReconnecting = false;

function connectSSH() {
  if (isReconnecting) return;
  isReconnecting = true;

  if (sshClient) {
    try {
      sshClient.removeAllListeners();
      sshClient.end();
    } catch (_) {}
  }

  sshClient = new Client();

  sshClient.on('ready', () => {
    isConnected = true;
    isReconnecting = false;
    console.log(`✅ [${new Date().toLocaleTimeString()}] SSH connection established to VPS ${host}`);
  });

  sshClient.on('close', () => {
    isConnected = false;
    console.log(`⚠️ [${new Date().toLocaleTimeString()}] SSH connection closed. Reconnecting in 3s...`);
    scheduleReconnect();
  });

  sshClient.on('error', (err) => {
    isConnected = false;
    console.error(`❌ [${new Date().toLocaleTimeString()}] SSH error: ${err.message}. Reconnecting in 3s...`);
    scheduleReconnect();
  });

  try {
    sshClient.connect({
      host,
      port: 22,
      username,
      password,
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
      readyTimeout: 15000,
    });
  } catch (err) {
    console.error(`❌ Connect exception: ${err.message}`);
    scheduleReconnect();
  }
}

let reconnectTimeout = null;

function scheduleReconnect() {
  if (reconnectTimeout) return;
  isConnected = false;
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    isReconnecting = false;
    connectSSH();
  }, 3000);
}

// Create single persistent local TCP proxy server
const server = net.createServer((sock) => {
  if (!isConnected || !sshClient) {
    console.warn(`[Tunnel] Connection received but SSH is not connected. Closing socket.`);
    sock.destroy();
    return;
  }

  try {
    sshClient.forwardOut('127.0.0.1', sock.remotePort, '127.0.0.1', 5432, (err, stream) => {
      if (err) {
        console.error('[Tunnel] ForwardOut error:', err.message);
        sock.destroy();
        return;
      }

      sock.pipe(stream);
      stream.pipe(sock);

      stream.on('error', (err) => {
        sock.destroy();
      });

      sock.on('error', (err) => {
        stream.destroy();
      });
    });
  } catch (err) {
    console.error('[Tunnel] forwardOut call failed:', err.message);
    sock.destroy();
  }
});

server.on('error', (err) => {
  console.error('[Server] Local server error:', err.message);
});

server.listen(5432, '127.0.0.1', () => {
  console.log('🚀 DB Tunnel aktif: localhost:5432 -> VPS:5432');
  connectSSH();
});

// Guard against process crash
process.on('uncaughtException', (err) => {
  console.error('[Tunnel UncaughtException]', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Tunnel UnhandledRejection]', reason);
});

import http from 'http';
import app from './app';
import config from './config/env';

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`[server] ${config.serviceName} démarré sur le port ${config.port} (${config.env})`);
});

export default server;

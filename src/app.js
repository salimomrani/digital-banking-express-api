const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const config = require('./config/env');

const app = express();

const corsOptions = {
  origin: config.allowedOrigins
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: config.serviceName, timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Erreur interne du serveur',
    details: config.env === 'development' ? err.message : undefined
  });
});

module.exports = app;

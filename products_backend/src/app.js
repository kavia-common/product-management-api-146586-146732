const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Serve OpenAPI JSON for integration
app.get('/openapi.json', (req, res) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      { url: `${protocol}://${fullHost}` },
    ],
  };
  res.json(dynamicSpec);
});

// Themed Swagger UI
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };

  const uiOptions = {
    customSiteTitle: 'Products API - Ocean Professional',
    customCss: `
      :root {
        --ocean-blue: #2563EB;
        --ocean-amber: #F59E0B;
        --ocean-bg: #f9fafb;
        --ocean-surface: #ffffff;
        --ocean-text: #111827;
      }
      body { background: var(--ocean-bg); }
      .topbar { background: linear-gradient(90deg, rgba(37,99,235,0.10), rgba(249,250,251,1)); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      .topbar-wrapper .link span { color: var(--ocean-text) !important; }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background: var(--ocean-amber) !important; }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: var(--ocean-blue) !important; }
      .swagger-ui .info .title { color: var(--ocean-text); }
      .swagger-ui .scheme-container { background: var(--ocean-surface); border-radius: 8px; }
      .swagger-ui .opblock { border-radius: 8px; }
      .swagger-ui .btn, .swagger-ui select { border-radius: 8px !important; }
    `,
  };

  swaggerUi.setup(dynamicSpec, uiOptions)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;

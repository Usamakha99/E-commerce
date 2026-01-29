import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;
const API_TARGET = process.env.API_TARGET || 'http://127.0.0.1:5000';
const FTP_API_TARGET = process.env.FTP_API_TARGET || 'https://test.vcloudtech.net';

app.set('trust proxy', true);

// Proxy FTP API requests through this server (avoids CORS issues)
app.use(
  '/ftp-api',
  createProxyMiddleware({
    target: FTP_API_TARGET,
    changeOrigin: true,
    secure: true, // For HTTPS
    // Rewrite /ftp-api/* to /api/*
    // Use req.originalUrl to get full path including /ftp-api
    pathRewrite: (path, req) => {
      // req.originalUrl = /ftp-api/auth/login
      // path = /auth/login (stripped by Express)
      // We need /api/auth/login
      const newPath = '/api' + path;
      console.log(`[FTP Proxy] ${req.method} ${req.originalUrl}`);
      console.log(`[FTP Proxy] Rewriting: ${path} -> ${newPath}`);
      return newPath;
    },
    logLevel: process.env.PROXY_LOG_LEVEL || 'info',
    onProxyReq: (proxyReq, req, res) => {
      // Modify the proxy request path directly
      const originalPath = req.path; // /auth/login
      proxyReq.path = '/api' + originalPath; // /api/auth/login
      console.log(`[FTP Proxy] Final proxy path: ${proxyReq.path}`);
      console.log(`[FTP Proxy] Target URL: ${FTP_API_TARGET}${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[FTP Proxy] Response: ${proxyRes.statusCode} for ${req.originalUrl}`);
    },
    onError: (err, req, res) => {
      console.error('[FTP Proxy Error]', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Proxy error', message: err.message });
      }
    },
  })
);

// Proxy API + uploads through this server (avoids browser CORS / Private Network Access issues)
app.use(
  '/api',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    ws: true,
    // Express mount strips "/api" from req.url, add it back for the backend.
    pathRewrite: (path) => `/api${path}`,
    logLevel: process.env.PROXY_LOG_LEVEL || 'warn',
  })
);

app.use(
  '/uploads',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    // Express mount strips "/uploads" from req.url, add it back for the backend.
    pathRewrite: (path) => `/uploads${path}`,
    logLevel: process.env.PROXY_LOG_LEVEL || 'warn',
  })
);

// Serve static files from dist folder (production build)
app.use(express.static(join(__dirname, 'dist')));

// Handle React Router - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📦 Serving files from: ${join(__dirname, 'dist')}`);
});


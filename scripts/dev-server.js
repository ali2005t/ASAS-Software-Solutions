const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const seedProductCosts = require('../api/seed-product-costs.js');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;
const CONTENT_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

function sendNotFound(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
}

const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, 'http://localhost');
    const requestPath = decodeURIComponent(requestUrl.pathname);

    if (requestPath.replace(/\/$/, '') === '/api/seed-product-costs') {
        response.status = (statusCode) => {
            response.statusCode = statusCode;
            return response;
        };
        response.json = (data) => {
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(data));
        };
        try {
            await seedProductCosts(request, response);
        } catch (error) {
            console.error('Local API error:', error);
            if (!response.headersSent) response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            if (!response.writableEnded) response.end(JSON.stringify({ error: 'Local API error.' }));
        }
        return;
    }

    // Never serve private API source files from the static development server.
    if (requestPath.startsWith('/api/')) {
        sendNotFound(response);
        return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end();
        return;
    }

    const relativePath = requestPath === '/' ? '/index.html' : requestPath;
    const filePath = path.resolve(ROOT, `.${relativePath}`);
    if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
        response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, contents) => {
        if (error) {
            sendNotFound(response);
            return;
        }
        response.writeHead(200, { 'Content-Type': CONTENT_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
        response.end(request.method === 'HEAD' ? undefined : contents);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`ASAS local development server: http://localhost:${PORT}`);
});

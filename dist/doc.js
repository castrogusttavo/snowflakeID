"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const url_1 = require("url");
function handleDocsRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    if (!req.url || !req.headers.host) {
        res.writeHead(400);
        res.end('Bad request');
        return;
    }
    const url = new url_1.URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    try {
        switch (pathname) {
            case '/':
            case '/docs':
                // Serve a página HTML com Scalar
                const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>UUIDv8 API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        body {
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
    <script
        id="api-reference"
        data-url="/openapi.yaml"
        data-configuration='{"theme":"purple","layout":"modern","showSidebar":true}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end(htmlContent);
                break;
            case '/openapi.yaml':
                // Serve o arquivo OpenAPI spec
                try {
                    const openApiPath = path.join(__dirname, 'openapi.yaml');
                    const openApiContent = fs.readFileSync(openApiPath, 'utf8');
                    res.setHeader('Content-Type', 'application/x-yaml');
                    res.writeHead(200);
                    res.end(openApiContent);
                }
                catch (error) {
                    console.error('Error reading OpenAPI file:', error);
                    res.writeHead(404);
                    res.end('OpenAPI specification not found');
                }
                break;
            case '/openapi.json':
                // Serve a versão JSON da spec (opcional)
                try {
                    const openApiPath = path.join(__dirname, 'openapi.yaml');
                    const yaml = require('js-yaml');
                    const openApiContent = fs.readFileSync(openApiPath, 'utf8');
                    const openApiJson = yaml.load(openApiContent);
                    res.setHeader('Content-Type', 'application/json');
                    res.writeHead(200);
                    res.end(JSON.stringify(openApiJson, null, 2));
                }
                catch (error) {
                    console.error('Error converting YAML to JSON:', error);
                    res.writeHead(404);
                    res.end('OpenAPI specification not found');
                }
                break;
            default:
                res.writeHead(404);
                res.end('Not Found');
        }
    }
    catch (error) {
        console.error('Error handling request:', error);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}
const DOCS_PORT = process.env["DOCS_PORT"] ? parseInt(process.env["DOCS_PORT"]) : 3001;
const docsServer = http.createServer(handleDocsRequest);
docsServer.listen(DOCS_PORT, () => {
    console.log(`Documentation server is running on port ${DOCS_PORT}`);
    console.log(`Visit http://localhost:${DOCS_PORT}/docs to view the API documentation`);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing documentation server');
    docsServer.close(() => {
        console.log('Documentation server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing documentation server');
    docsServer.close(() => {
        console.log('Documentation server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=doc.js.map
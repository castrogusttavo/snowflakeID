import * as http from 'http';
import { URL } from 'url';

import { UUIDv8 } from './types/uuid.type'
import { APIDocumentation } from './types/apiDocumentation.type'
import { APIResponse } from './types/apiResponse.type'

import {UUID} from "./class/uuid.class";
import {Snowflake} from './class/snowflake.class'

const snowflakeGenerator = new Snowflake(1, 1);
// @ts-ignore
import openApiSpec from '../openapi.yaml';

function serveScalarDocs(res: http.ServerResponse): void {
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
        data-url="/openapi.json"
        data-configuration='{"theme":"purple","layout":"modern","showSidebar":true,"searchHotKey":"k"}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(htmlContent);
}

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (!req.url || !req.headers.host) {
        res.writeHead(400);
        res.end(JSON.stringify({error: 'Bad request'}));
        return;
    }

    const url = new URL(req.url, `https://${req.headers.host}`);
    const path = url.pathname;

    try {
        switch (path) {
            case '/':
                res.setHeader('Content-Type', 'application/json');
                const documentation: APIDocumentation = {
                    message: 'Welcome to the UUIDv8 API',
                    version: '1.0.0',
                    endpoints: {
                        "/uuid/v8": "Generates UUID v8 (GET/POST)",
                        "/snowflake": "Generates Snowflake ID (GET)",
                        "/batch/uuid/v8": "Generates multiple UUID v8 (GET/POST)",
                        "/batch/snowflake": "Generates multiple Snowflake IDs (GET)",
                        "/docs": "API Documentation (Scalar UI)",
                        "/openapi.json": "OpenAPI Specification (JSON)"
                    },
                    examples: {
                        "UUID v8": "GET /uuid/v8",
                        "UUID v8 with custom data": "POST /uuid/v8 with {\"data\": \"my-data\"}",
                        "Snowflake ID": "GET /snowflake",
                        "Batch UUID v8": "GET /batch/uuid/v8?count=5",
                        "Batch Snowflake": "GET /batch/snowflake?count=3",
                        "Documentation": "GET /docs"
                    }
                };

                res.writeHead(200);
                res.end(JSON.stringify(documentation, null, 2));
                break;

            case '/docs':
                serveScalarDocs(res);
                break;

            case '/openapi.json':
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(openApiSpec, null, 2));
                break;

            case '/uuid/v8':
                res.setHeader('Content-Type', 'application/json');
                if (req.method === 'GET') {
                    const id = UUID.generate('www.example.com');
                    const response: APIResponse = {
                        id: id,
                        type: 'uuid v8',
                        timestamp: new Date().toISOString()
                    };

                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                } else if (req.method === 'POST') {
                    let body = '';
                    req.on('data', (chunk: Buffer) => {
                        body += chunk.toString();
                    });

                    req.on('end', () => {
                        try {
                            const data: UUIDv8 = JSON.parse(body);
                            const customData = data.data || null;
                            const id = UUID.generate(customData);

                            const response: APIResponse = {
                                id: id,
                                type: 'uuid v8',
                                customData: customData,
                                timestamp: new Date().toISOString()
                            };

                            res.writeHead(200);
                            res.end(JSON.stringify(response));
                        } catch (error) {
                            const errorResponse: APIResponse = {
                                type: 'error',
                                error: error instanceof Error ? error.message : 'Unknown error',
                                timestamp: new Date().toISOString()
                            };

                            res.writeHead(400);
                            res.end(JSON.stringify(errorResponse));
                        }
                    });
                } else {
                    const errorResponse: APIResponse = {
                        type: 'error',
                        error: 'Method not allowed',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(405);
                    res.end(JSON.stringify(errorResponse));
                }
                break;

            case '/snowflake':
                res.setHeader('Content-Type', 'application/json');
                if (req.method === 'GET') {
                    const id = snowflakeGenerator.generate();
                    const response: APIResponse = {
                        id: id,
                        type: 'snowflake',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                } else {
                    const errorResponse: APIResponse = {
                        type: 'error',
                        error: 'Method not allowed',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(405);
                    res.end(JSON.stringify(errorResponse));
                }
                break;

            case '/batch/uuid/v8':
                res.setHeader('Content-Type', 'application/json');
                const uuidCountParam = url.searchParams.get('count');
                const uuidCount = uuidCountParam ? parseInt(uuidCountParam) : 1;

                if (uuidCount > 100) {
                    const errorResponse: APIResponse = {
                        type: 'error',
                        error: 'Max id generation is 100',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(400);
                    res.end(JSON.stringify(errorResponse));
                    break;
                }

                const uuids: string[] = [];
                for (let i = 0; i < uuidCount; i++) {
                    uuids.push(UUID.generate());
                }

                const uuidBatchResponse: APIResponse = {
                    ids: uuids,
                    count: uuids.length,
                    type: 'uuid v8',
                    timestamp: new Date().toISOString()
                };

                res.writeHead(200);
                res.end(JSON.stringify(uuidBatchResponse));
                break;

            case '/batch/snowflake':
                res.setHeader('Content-Type', 'application/json');
                const snowflakeCountParam = url.searchParams.get('count');
                const snowflakeCount = snowflakeCountParam ? parseInt(snowflakeCountParam) : 1;

                if (snowflakeCount > 100) {
                    const errorResponse: APIResponse = {
                        type: 'error',
                        error: 'Max id generation is 100',
                        timestamp: new Date().toISOString()
                    };

                    res.writeHead(400);
                    res.end(JSON.stringify(errorResponse));
                    break;
                }

                const snowflakes: string[] = [];
                for (let i = 0; i < snowflakeCount; i++) {
                    snowflakes.push(snowflakeGenerator.generate());
                }

                const snowflakeBatchResponse: APIResponse = {
                    ids: snowflakes,
                    count: snowflakes.length,
                    type: 'snowflake',
                    timestamp: new Date().toISOString()
                };

                res.writeHead(200);
                res.end(JSON.stringify(snowflakeBatchResponse));
                break;

            default:
                res.setHeader('Content-Type', 'application/json');
                const notFoundResponse: APIResponse = {
                    type: 'error',
                    error: 'Not found',
                    timestamp: new Date().toISOString()
                };

                res.writeHead(404);
                res.end(JSON.stringify(notFoundResponse));
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        const serverErrorResponse: APIResponse = {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        };
        res.writeHead(500);
        res.end(JSON.stringify(serverErrorResponse));
    }
}

const PORT = process.env["PORT"] ? parseInt(process.env["PORT"]) : 3000;
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at: http://localhost:${PORT}/docs`);
    console.log(`OpenAPI Spec (JSON): http://localhost:${PORT}/openapi.json`);
    console.log(`API Info: http://localhost:${PORT}/`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

/*
*   ____________________
*  |,---------------.  |\
*  ||  *#**#*#****  |= | |
*  || /*         *\ || | |
*  || |--[@]^[@]--| || | |
*  || \   _____   / || | |
*  ||  \  \___/  / _o| | | __
*  |`----------------' |/ /~/
*   ~~~~~~~~~~~~~~~~~~~  / /
*                        ~~
*/
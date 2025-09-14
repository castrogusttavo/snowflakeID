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
const url_1 = require("url");
const uuid_class_1 = require("./class/uuid.class");
const snowflake_class_1 = require("./class/snowflake.class");
const snowflakeGenerator = new snowflake_class_1.Snowflake(1, 1);
// OpenAPI Specification inline (para garantir que sempre funcione)
const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "UUIDv8 and Snowflake ID Generator API",
        description: "API para geração de UUIDs versão 8 e Snowflake IDs",
        version: "1.0.0"
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Servidor de desenvolvimento"
        }
    ],
    paths: {
        "/": {
            get: {
                summary: "Documentação da API",
                description: "Retorna informações sobre a API e seus endpoints",
                tags: ["Documentation"],
                responses: {
                    "200": {
                        description: "Documentação da API",
                        content: {
                            "application/json": {
                                schema: { type: "object" }
                            }
                        }
                    }
                }
            }
        },
        "/uuid/v8": {
            get: {
                summary: "Gerar UUID v8",
                description: "Gera um UUID versão 8 com dados padrão",
                tags: ["UUID v8"],
                responses: {
                    "200": {
                        description: "UUID v8 gerado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        type: { type: "string" },
                                        timestamp: { type: "string", format: "date-time" }
                                    }
                                },
                                example: {
                                    id: "018f4b4c-1234-8abc-9def-123456789abc",
                                    type: "uuid v8",
                                    timestamp: "2024-03-15T10:30:00.000Z"
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: "Gerar UUID v8 com dados customizados",
                description: "Gera um UUID versão 8 com dados customizados",
                tags: ["UUID v8"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "UUID v8 gerado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        type: { type: "string" },
                                        customData: { type: "string" },
                                        timestamp: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/snowflake": {
            get: {
                summary: "Gerar Snowflake ID",
                description: "Gera um Snowflake ID único baseado em timestamp",
                tags: ["Snowflake"],
                responses: {
                    "200": {
                        description: "Snowflake ID gerado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        type: { type: "string" },
                                        timestamp: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/batch/uuid/v8": {
            get: {
                summary: "Gerar múltiplos UUID v8",
                description: "Gera múltiplos UUIDs versão 8 (máximo 100)",
                tags: ["UUID v8", "Batch"],
                parameters: [
                    {
                        name: "count",
                        in: "query",
                        description: "Número de UUIDs (1-100)",
                        schema: { type: "integer", minimum: 1, maximum: 100 }
                    }
                ],
                responses: {
                    "200": {
                        description: "UUIDs gerados com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ids: { type: "array", items: { type: "string" } },
                                        count: { type: "integer" },
                                        type: { type: "string" },
                                        timestamp: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/batch/snowflake": {
            get: {
                summary: "Gerar múltiplos Snowflake IDs",
                description: "Gera múltiplos Snowflake IDs (máximo 100)",
                tags: ["Snowflake", "Batch"],
                parameters: [
                    {
                        name: "count",
                        in: "query",
                        description: "Número de Snowflake IDs (1-100)",
                        schema: { type: "integer", minimum: 1, maximum: 100 }
                    }
                ],
                responses: {
                    "200": {
                        description: "Snowflake IDs gerados com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ids: { type: "array", items: { type: "string" } },
                                        count: { type: "integer" },
                                        type: { type: "string" },
                                        timestamp: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    tags: [
        { name: "Documentation", description: "Endpoints de documentação da API" },
        { name: "UUID v8", description: "Operações relacionadas a UUIDs versão 8" },
        { name: "Snowflake", description: "Operações relacionadas a Snowflake IDs" },
        { name: "Batch", description: "Operações em lote" }
    ]
};
function serveScalarDocs(res) {
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
function handleRequest(req, res) {
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
        res.end(JSON.stringify({ error: 'Bad request' }));
        return;
    }
    const url = new url_1.URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    try {
        switch (path) {
            case '/':
                res.setHeader('Content-Type', 'application/json');
                const documentation = {
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
                    const id = uuid_class_1.UUID.generate('www.example.com');
                    const response = {
                        id: id,
                        type: 'uuid v8',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                }
                else if (req.method === 'POST') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            const customData = data.data || null;
                            const id = uuid_class_1.UUID.generate(customData);
                            const response = {
                                id: id,
                                type: 'uuid v8',
                                customData: customData,
                                timestamp: new Date().toISOString()
                            };
                            res.writeHead(200);
                            res.end(JSON.stringify(response));
                        }
                        catch (error) {
                            const errorResponse = {
                                type: 'error',
                                error: error instanceof Error ? error.message : 'Unknown error',
                                timestamp: new Date().toISOString()
                            };
                            res.writeHead(400);
                            res.end(JSON.stringify(errorResponse));
                        }
                    });
                }
                else {
                    const errorResponse = {
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
                    const response = {
                        id: id,
                        type: 'snowflake',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                }
                else {
                    const errorResponse = {
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
                    const errorResponse = {
                        type: 'error',
                        error: 'Max id generation is 100',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(400);
                    res.end(JSON.stringify(errorResponse));
                    break;
                }
                const uuids = [];
                for (let i = 0; i < uuidCount; i++) {
                    uuids.push(uuid_class_1.UUID.generate());
                }
                const uuidBatchResponse = {
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
                    const errorResponse = {
                        type: 'error',
                        error: 'Max id generation is 100',
                        timestamp: new Date().toISOString()
                    };
                    res.writeHead(400);
                    res.end(JSON.stringify(errorResponse));
                    break;
                }
                const snowflakes = [];
                for (let i = 0; i < snowflakeCount; i++) {
                    snowflakes.push(snowflakeGenerator.generate());
                }
                const snowflakeBatchResponse = {
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
                const notFoundResponse = {
                    type: 'error',
                    error: 'Not found',
                    timestamp: new Date().toISOString()
                };
                res.writeHead(404);
                res.end(JSON.stringify(notFoundResponse));
        }
    }
    catch (error) {
        res.setHeader('Content-Type', 'application/json');
        const serverErrorResponse = {
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
//# sourceMappingURL=index.js.map
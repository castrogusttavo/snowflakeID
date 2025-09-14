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
exports.UUID = void 0;
const crypto = __importStar(require("crypto"));
class UUID {
    static generate(customData = null) {
        let dataBuffer;
        if (!customData) {
            dataBuffer = crypto.randomBytes(16);
        }
        else if (typeof customData === 'string') {
            dataBuffer = Buffer.from(customData, 'utf8');
        }
        else {
            dataBuffer = customData;
        }
        if (dataBuffer.length > 16) {
            dataBuffer = dataBuffer.subarray(0, 16);
        }
        else if (dataBuffer.length < 16) {
            const padding = Buffer.alloc(16 - dataBuffer.length);
            dataBuffer = Buffer.concat([dataBuffer, padding]);
        }
        const bytes = Array.from(dataBuffer);
        // 4 bits version
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        // 2 bits variant
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
        return [
            hex.slice(0, 8),
            hex.slice(8, 12),
            hex.slice(12, 16),
            hex.slice(16, 20),
            hex.slice(20, 32)
        ].join('-');
    }
}
exports.UUID = UUID;
//# sourceMappingURL=uuid.class.js.map
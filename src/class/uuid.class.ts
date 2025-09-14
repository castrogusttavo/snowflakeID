import * as crypto from "crypto";

export class UUID {
    static generate(customData: string | Buffer | null = null): string {
        let dataBuffer: Buffer

        if (!customData) {
            dataBuffer = crypto.randomBytes(16)
        } else if (typeof customData === 'string') {
            dataBuffer = Buffer.from(customData, 'utf8')
        } else {
            dataBuffer = customData
        }

        if (dataBuffer.length > 16) {
            dataBuffer = dataBuffer.subarray(0, 16)
        } else if (dataBuffer.length < 16) {
            const padding = Buffer.alloc(16 - dataBuffer.length)
            dataBuffer = Buffer.concat([dataBuffer, padding])
        }

        const bytes: number[] = Array.from(dataBuffer)

        // 4 bits version
        bytes[6]! = (bytes[6]! & 0x0f) | 0x40

        // 2 bits variant
        bytes[8]! = (bytes[8]! & 0x3f) | 0x80

        const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('')

        return [
            hex.slice(0, 8),
            hex.slice(8, 12),
            hex.slice(12,16),
            hex.slice(16,20),
            hex.slice(20,32)
        ].join('-')
    }
}

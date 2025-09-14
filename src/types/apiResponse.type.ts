export interface APIResponse {
    id?: string
    ids?: string[]
    type: string
    timestamp: string
    customData?: string | Buffer | null
    count?: number
    error?: string
}
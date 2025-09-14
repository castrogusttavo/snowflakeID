export interface APIDocumentation {
    message: string
    version: string
    endpoints: Record<string, string>
    examples: Record<string, string>
}
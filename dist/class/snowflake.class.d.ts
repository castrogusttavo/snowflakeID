export declare class Snowflake {
    private readonly machineID;
    private readonly datacenterID;
    private sequence;
    private lastTimestamp;
    private readonly epoch;
    private static readonly MACHINE_ID_BITS;
    private static readonly DATACENTER_ID_BITS;
    private static readonly SEQUENCE_BITS;
    private static readonly MAX_MACHINE_ID;
    private static readonly MAX_DATACENTER_ID;
    private static readonly MAX_SEQUENCE;
    constructor(machineID?: number, datacenterID?: number);
    generate(): string;
    private waitNextMillis;
    static parse(snowflakeID: string): {
        timestamp: number;
        datacenterID: number;
        machineID: number;
        sequence: number;
        date: Date;
    };
    static isValid(snowflakeID: string): boolean;
    getConfig(): {
        machineID: number;
        datacenterID: number;
        epoch: number;
    };
}
//# sourceMappingURL=snowflake.class.d.ts.map
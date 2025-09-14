export class Snowflake {
    private readonly machineID: number
    private readonly datacenterID: number
    private sequence: number
    private lastTimestamp: number
    private readonly epoch: number

    private static readonly MACHINE_ID_BITS = 10
    private static readonly DATACENTER_ID_BITS = 5
    private static readonly SEQUENCE_BITS = 12

    private static readonly MAX_MACHINE_ID = (1 << Snowflake.MACHINE_ID_BITS) - 1
    private static readonly MAX_DATACENTER_ID = (1 << Snowflake.DATACENTER_ID_BITS) - 1
    private static readonly MAX_SEQUENCE = (1 << Snowflake.SEQUENCE_BITS) - 1

    constructor(machineID: number = 1, datacenterID: number = 1) {
        if (machineID > Snowflake.MAX_MACHINE_ID || machineID < 0) {
            throw new Error(`Machine ID cannot be greater than ${Snowflake.MAX_MACHINE_ID} or less than 0`)
        }

        if (datacenterID > Snowflake.MAX_DATACENTER_ID || datacenterID < 0) {
            throw new Error(`Datacenter ID cannot be greater than ${Snowflake.MAX_DATACENTER_ID} or less than 0`)
        }

        this.machineID = machineID
        this.datacenterID = datacenterID
        this.sequence = 0
        this.lastTimestamp = -1

        // january 1st 2020
        this.epoch = 1577836800000
    }

    generate(): string {
        let timestamp = Date.now()

        if (timestamp < this.lastTimestamp) {
            throw new Error('Timestamp cannot be less than the last timestamp')
        }

        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1) & Snowflake.MAX_SEQUENCE // 12 bits

            if (this.sequence === 0) {
                timestamp = this.waitNextMillis(this.lastTimestamp)
            }
        } else {
            this.sequence = 0
        }

        this.lastTimestamp = timestamp

        const timestampDiff = BigInt(timestamp - this.epoch)
        const datcenterIDBig = BigInt(this.datacenterID)
        const machineIDBig = BigInt(this.machineID)
        const sequenceBig = BigInt(this.sequence)

        const id = (timestampDiff << 22n) |
            (datcenterIDBig << 17n) |
            (machineIDBig << 12n) |
            sequenceBig;

        return id.toString()
    }

    private waitNextMillis(lastTimestamp: number): number {
        let timestamp = Date.now()
        while (timestamp <= lastTimestamp) {
            timestamp = Date.now()
        }
        return timestamp
    }

    static parse(snowflakeID: string): {
        timestamp: number
        datacenterID: number
        machineID: number
        sequence: number
        date: Date
    } {
        const id = BigInt(snowflakeID);
        const epoch = BigInt(1577836800000);

        const timestamp = Number((id >> 22n) + epoch);
        const datacenterID = Number((id >> 17n) & 0x1fn);
        const machineID = Number((id >> 12n) & 0x3ffn);
        const sequence = Number(id & 0xfffn);

        return {
            timestamp,
            datacenterID,
            machineID,
            sequence,
            date: new Date(timestamp)
        };
    }

    static isValid(snowflakeID: string): boolean {
        try {
            const { timestamp, datacenterID, machineID, sequence } = Snowflake.parse(snowflakeID);
            return timestamp > 0 && datacenterID >= 0 && machineID >= 0 && sequence >= 0;
        } catch (error) {
            return false;
        }
    }

    getConfig(): {
        machineID: number
        datacenterID: number
        epoch: number
    } {
        return {
            machineID: this.machineID,
            datacenterID: this.datacenterID,
            epoch: this.epoch
        }
    }
}

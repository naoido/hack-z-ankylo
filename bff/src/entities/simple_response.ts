export class Success {
    readonly message: string;

    constructor(data: Partial<Success>) {
        this.message = data.message || "";
    }
}

export class Error {
    readonly message: string;
    readonly stackTrace: string | null;

    constructor(data: { message: string | null, stack_trace: string | null }) {
        this.message = data.message || "error";
        this.stackTrace = data.stack_trace || null;
    }
}
export class TerminalExecutor {
    readonly execute: Function;
    constructor(executor: Function) {
        this.execute = executor;
    }
}

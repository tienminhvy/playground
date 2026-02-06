import { Terminal } from "@xterm/xterm";
import { TerminalExecutor } from "./terminal-executor";

export class TerminalCommand {
  private name: string;
  private description: string;
  private executor: TerminalExecutor;
  private postExecutor: TerminalExecutor = new TerminalExecutor(() => {});

  constructor(name: string, description: string, executor: Function = (() => {})) {
    this.name = name;
    this.description = description;
    this.executor = new TerminalExecutor(executor);
  }
  
  public get label() : string {
    return this.name;
  }
  
  public get detail() : string {
    return this.description;
  }

  public execute() : void {
    this.executor.execute();
    this.postExecutor.execute();
  }

  public setPostExecutor(postExecutor: TerminalExecutor) : void {
    this.postExecutor = postExecutor;
  }
}

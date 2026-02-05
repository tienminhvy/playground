export class TerminalCommand {
  private name: string;
  private description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
  
  public get label() : string {
    return this.name;
  }
  
  public get detail() : string {
    return this.description;
  }
}

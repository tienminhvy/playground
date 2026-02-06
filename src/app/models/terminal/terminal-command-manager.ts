import { Terminal } from "@xterm/xterm";
import { TerminalCommand } from "./terminal-command"
import { TerminalExecutor } from "./terminal-executor";

export class TerminalCommandManager {
  private static readonly SHELL_NAME: string = "vysh";
  
  private static readonly REGISTERED_COMMANDS: Map<string, TerminalCommand> = new Map<string, TerminalCommand>();
  
  private static terminal: Terminal;
  private static asciiArt: string = "";
  private static inited: boolean = false;
  
  private static postExecutor: TerminalExecutor;

  private static HOSTNAME: string = "tienminhvy.com";
  private static USERNAME: string = "guest";

  private static ANSI = {
    bold: '\x1b[1m',
    reset: '\x1b[0m',
    red: '\x1b[38;5;203m',
    green: '\x1b[38;5;120m',
    yellow: '\x1b[38;5;227m',
    blue: '\x1b[38;5;117m',
  };

  public static readonly PROMPT: string = `[${this.ANSI.yellow}${this.USERNAME}${this.ANSI.reset}` 
    + `@${this.ANSI.blue}${this.HOSTNAME}${this.ANSI.reset} ${this.ANSI.blue}~${this.ANSI.reset}] ` 
    + `${this.ANSI.blue}~${this.ANSI.reset} $ `;

  private static registerCommands() : void {
    if (this.inited) return;
    
    this.registerCommand(new TerminalCommand("help", "print this help information table", () => {
      if (!this.terminal) return;
      this.terminal.writeln(`${this.SHELL_NAME}: Available commands:`);
      this.registeredCommands.forEach((command: TerminalCommand) => {
        this.terminal.writeln(`${this.ANSI.bold}${command.label}${this.ANSI.reset} - ${command.detail}`)
      });
    }));

    this.registerCommand(new TerminalCommand("clear", "clean this terminal's content", () => {
      if (!this.terminal) return;
      this.terminal.clear();
    }));

    this.registerCommand(new TerminalCommand("welcome", "print the welcome message", () => {
      if (!this.terminal) return;
      this.printWelcomeMessage();
    }));

    this.inited = true;
  }

  private static getWritableLink(text: string, url: string): string {
    const OSC = '\x1b]8;;';
    const ST = '\x1b\\';
    
    // Pattern: OSC 8 ;; URL ST text OSC 8 ;; ST
    return `${this.ANSI.reset}${OSC}${url}${ST}${text}${OSC}${ST}${this.ANSI.reset}`;
  }

  private static printWelcomeMessage(): void {
    // --- Usage ---
    this.terminal.writeln('');
    this.terminal.writeln(`    ${this.ANSI.green}${this.ANSI.bold}Welcome to my personal homepage${this.ANSI.reset}`);
    this.terminal.writeln('');

    for (const line of this.asciiArt.split("\n")) {
      this.terminal.writeln(line);
    }

    this.terminal.writeln('');
    this.terminal.writeln(`    ${this.ANSI.bold}Personal Information:${this.ANSI.reset}`);
    this.terminal.writeln('    Email: ' + this.getWritableLink("me[at]tienminhvy.com", "mailto:me@tienminhvy.com"));
    this.terminal.writeln(`    ${this.ANSI.blue}${this.ANSI.bold}LinkedIn${this.ANSI.reset}: ` + this.getWritableLink("me@LinkedIn", "https://www.linkedin.com/in/tienminhvy/"));
    this.terminal.writeln(`    ${this.ANSI.green}${this.ANSI.bold}GitHub${this.ANSI.reset}: ` + this.getWritableLink("me@GitHub", "https://github.com/tienminhvy/"));
    this.terminal.writeln('    Blog: ' + this.getWritableLink("tienminhvy.id.vn", "https://tienminhvy.id.vn/"));
    this.terminal.writeln('    Tutorial blog (Legacy): ' + this.getWritableLink("legacy.tienminhvy.com", "https://legacy.tienminhvy.com/chia-se/"));
    this.terminal.writeln('');

    this.terminal.writeln('');
    this.terminal.writeln(`    For a list of available commands, try typing \`${this.ANSI.green}help${this.ANSI.reset}\`. This website source code is hosted at ` + 
      this.getWritableLink("https://github.com/tienminhvy/playground", "https://github.com/tienminhvy/playground"));
    this.terminal.writeln('');
  }

  public static setup(terminal: Terminal, asciiArt: string = ""): void {
    this.setTerminal(terminal);
    
    this.asciiArt = asciiArt || "";
    this.postExecutor = new TerminalExecutor(() => {
      this.printPrompt();
    });

    this.registerCommands();
    
    this.printPrompt("welcome\r\n")
    this.REGISTERED_COMMANDS.get("welcome")?.execute();
  }

  public static registerCommand(command: TerminalCommand): void {
    command.setPostExecutor(this.postExecutor);
    this.REGISTERED_COMMANDS.set(command.label, command);
  }

  public static get registeredCommands() : Array<TerminalCommand> {
    return Array.from(this.REGISTERED_COMMANDS.values());
  }

  public static isCommandRegistered(commandName: string): boolean {
    return this.REGISTERED_COMMANDS.has(commandName);
  }

  public static executeCommand(commandName: string): void {
    const command = (commandName || "").trim().toLowerCase();
    if (!this.isCommandRegistered(commandName)) throw new TypeError(`Command \`${commandName}\` not found.`);
    this.REGISTERED_COMMANDS.get(command)?.execute();
  }
  
  public static setTerminal(terminal: Terminal) : void {
    this.terminal = terminal;
  }

  public static setAsciiArt(asciiArt: string) : void {
    this.asciiArt = asciiArt;
  }

  public static printPrompt(message: string = "") : void {
    this.terminal.write(this.PROMPT + message || "");
  }

  public static printResult(message: string) : void {
    this.terminal.write(`${this.SHELL_NAME}: ${message}`);
  }
}

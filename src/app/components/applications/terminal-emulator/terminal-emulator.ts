import { AfterViewInit, Component, ElementRef, input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { WindowWrapper } from '../window-wrapper/window-wrapper';
import { TerminalCommand } from '../../../models/terminal-command';

@Component({
  selector: 'app-terminal-emulator',
  imports: [WindowWrapper],
  templateUrl: './terminal-emulator.html',
  styleUrl: "./terminal-emulator.css",
  encapsulation: ViewEncapsulation.None
})
export class TerminalEmulator implements AfterViewInit {
  private terminal: Terminal = new Terminal({
    rows: 40, 
  });
  private fitAddon: FitAddon = new FitAddon();
  private shellName: string = "vysh";
  private availableCommands: Array<TerminalCommand> = [
    new TerminalCommand("help", "print this help information table"),
    new TerminalCommand("clear", "clean this terminal's content"),
    new TerminalCommand("welcome", "print the welcome message")
  ];
  readonly asciiArt = input<string>("");

  private hostName: string = "tienminhvy.com";
  private username: string = "guest";

  private ANSI = {
    bold: '\x1b[1m',
    reset: '\x1b[0m',
    red: '\x1b[38;5;203m',
    green: '\x1b[38;5;120m',
    yellow: '\x1b[38;5;227m',
    blue: '\x1b[38;5;117m',
  };
  
  @ViewChild("emulator", { static: false }) 
  private divElm!: ElementRef;
  
  constructor() {
  }

  private getVisibleLength(str: string): number {
    const ansiRegex = /\x1b\[[0-9;]*[a-zA-Z]/g;
    return str.replace(ansiRegex, '').length;
  }

  private loadTerminal(): void {
    this.terminal.loadAddon(this.fitAddon);
    this.fitAddon.fit();

    this.terminal.open(this.divElm.nativeElement);

    const PROMPT = `[${this.ANSI.yellow}${this.username}${this.ANSI.reset}@${this.ANSI.blue}${this.hostName}${this.ANSI.reset} ${this.ANSI.blue}~${this.ANSI.reset}] ${this.ANSI.blue}~${this.ANSI.reset} $ `;

    this.terminal.writeln('\r\n' + PROMPT + "welcome");
    this.displayWelcome();
    this.terminal.write('\r\n' + PROMPT);
    
    let commandBuffer = '';
    this.terminal.onData(e => {
      const actualCursorXPos = this.terminal.buffer.active.cursorX - this.getVisibleLength(PROMPT);
      switch (e) {
        case '\r': // Enter
          this.terminal.write('\r\n');
          this.processCommand(commandBuffer);
          commandBuffer = '';
          this.terminal.write(PROMPT);
          break;

        case '\u007F': // Backspace
          if (commandBuffer.length > 0 && this.terminal.buffer.active.cursorX > this.getVisibleLength(PROMPT)) {
            commandBuffer = commandBuffer.slice(0, -1);
            this.terminal.write('\b \b');
          }
          break;

        case '\u001b[A': // Up Arrow
        case '\u001b[B': // Down Arrow
          break;

        case '\u001b[C': // Right Arrow
          if (commandBuffer.length > 0 && actualCursorXPos < commandBuffer.length) {
            this.terminal.write(e);
          }
          break;

        case '\u001b[D': // Left Arrow
          if (commandBuffer.length > 0 && actualCursorXPos > 0) {
            this.terminal.write(e);
          }
          break;

        default: // Handle typing
          if (e >= " " && e <= "~") {
            commandBuffer += e;
            this.terminal.write(e);
          }
      }
    });
  }

  private displayWelcome(): void {
    // --- Usage ---
    this.terminal.writeln('');
    this.terminal.writeln(`    ${this.ANSI.green}${this.ANSI.bold}Welcome to my personal homepage${this.ANSI.reset}`);
    this.terminal.writeln('');

    for (const line of this.asciiArt().split("\n")) {
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

  private getWritableLink(text: string, url: string): string {
    const OSC = '\x1b]8;;';
    const ST = '\x1b\\';
    
    // Pattern: OSC 8 ;; URL ST text OSC 8 ;; ST
    return `${this.ANSI.reset}${OSC}${url}${ST}${text}${OSC}${ST}${this.ANSI.reset}`;
  }

  private processCommand(cmd: string): void {
    const command = cmd.trim().toLowerCase();
    if (command === 'help') {
      this.terminal.writeln(`${this.shellName}: Available commands:`);
      this.availableCommands.forEach((command: TerminalCommand) => {
        this.terminal.writeln(`${this.ANSI.bold}${command.label}${this.ANSI.reset} - ${command.detail}`)
      });
    } else if (command === 'clear') {
      this.terminal.clear();
    } else if (command === "welcome") {
      this.displayWelcome();
    } else if (command !== '') {
      this.terminal.writeln(`${this.shellName}: command not found: ${command}`);
    }
  }
  
  ngAfterViewInit(): void {
    this.loadTerminal();

    // Handle window resize
    window.addEventListener('resize', () => {
        this.fitAddon.fit();
    });

    setTimeout(() => {
      this.fitAddon.fit();
    }, 200);
  }
}

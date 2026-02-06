import { AfterViewInit, Component, ElementRef, input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { WindowWrapper } from '../window-wrapper/window-wrapper';
import { TerminalCommand } from '../../../models/terminal/terminal-command';
import { TerminalCommandManager } from '../../../models/terminal/terminal-command-manager';

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
    cursorBlink: true,
  });
  private fitAddon: FitAddon = new FitAddon();
  readonly asciiArt = input<string>("");
  
  @ViewChild("emulator", { static: false }) 
  private divElm!: ElementRef;
  
  constructor() {
    if (!window.LOGGED_IN_TIME) {
      window.LOGGED_IN_TIME = new Date();
    }
  }

  private getVisibleLength(str: string): number {
    const ansiRegex = /\x1b\[[0-9;]*[a-zA-Z]/g;
    return str.replace(ansiRegex, '').length;
  }

  private loadTerminal(): void {
    this.terminal.loadAddon(this.fitAddon);
    this.fitAddon.fit();

    this.terminal.open(this.divElm.nativeElement);
    TerminalCommandManager.setup(this.terminal, this.asciiArt());
    const PROMPT = TerminalCommandManager.PROMPT;
    
    let commandBuffer = '';
    this.terminal.onData(e => {
      const actualCursorXPos = this.terminal.buffer.active.cursorX - this.getVisibleLength(PROMPT);
      switch (e) {
        case '\r': // Enter
          this.terminal.write('\r\n');
          this.processCommand(commandBuffer);
          commandBuffer = '';
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

  private processCommand(cmd: string): void {
    const command = cmd.trim().toLowerCase();

    if (!command) {
      TerminalCommandManager.printPrompt();
      return;
    }
    if (!TerminalCommandManager.isCommandRegistered(command)) {
      TerminalCommandManager.printResult(`command not found: ${command}\r\n`);
      TerminalCommandManager.printPrompt();
      return;
    }

    TerminalCommandManager.executeCommand(command);
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

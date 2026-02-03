import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';

@Component({
  selector: 'app-terminal-emulator',
  imports: [],
  templateUrl: './terminal-emulator.html',
  styleUrl: "./terminal-emulator.css",
  encapsulation: ViewEncapsulation.None
})
export class TerminalEmulator implements AfterViewInit {
  private terminal: Terminal = new Terminal();
  private fitAddon: FitAddon = new FitAddon();
  
  @ViewChild("emulator", { static: false }) 
  private divElm!: ElementRef;
  
  constructor() {
  }

  ngAfterViewInit(): void {
    this.terminal.loadAddon(this.fitAddon);
    this.fitAddon.fit();

    this.terminal.open(this.divElm.nativeElement);

    this.terminal.writeln('\x1b[1;32mWelcome to xterm.js!\x1b[0m');
    this.terminal.write('\r\n$ ');

    this.terminal.onData(e => {
        if (e === '\r') { // Enter key
            this.terminal.write('\r\n$ ');
        } else if (e === '\u007F') { // Backspace (DEL)
            // Do not handle backspace in this simple example without buffer logic
            // But generally, you'd send a backspace char
            this.terminal.write('\b \b');
        } else {
            this.terminal.write(e);
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        this.fitAddon.fit();
    });
  }
}

import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { RouterOutlet } from '@angular/router';
import { TerminalEmulator } from './components/applications/terminal-emulator/terminal-emulator';
import { AsciiArts } from './constants/ascii-arts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TerminalEmulator, NgOptimizedImage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('landing-page');
  ventiAsciiArt = AsciiArts.VENTI_2;
  catAsciiArt = AsciiArts.CAT_1;
}

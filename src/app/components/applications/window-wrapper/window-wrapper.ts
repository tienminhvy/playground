import { AfterViewInit, Component, input } from '@angular/core';

@Component({
  selector: 'app-window-wrapper',
  templateUrl: './window-wrapper.html',
  styleUrl: './window-wrapper.css',
})
export class WindowWrapper {
  readonly size = input<string>("medium");
}

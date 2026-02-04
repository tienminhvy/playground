import { AfterViewInit, Component, input } from '@angular/core';
import { IconComponent } from "../../icon-component/icon-component";
import { mdiDockWindow, mdiWindowClose, mdiWindowMinimize } from '@mdi/js';

@Component({
  selector: 'app-window-wrapper',
  templateUrl: './window-wrapper.html',
  styleUrl: './window-wrapper.css',
  imports: [IconComponent],
})
export class WindowWrapper {
  readonly size = input<string>("medium");
  mdiWindowMinimize: string = mdiWindowMinimize;
  mdiDockWindow: string = mdiDockWindow;
  mdiWindowClose: string = mdiWindowClose;
}

import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'icon',
  imports: [],
  templateUrl: './icon-component.html',
  styleUrl: './icon-component.css',
})
export class IconComponent {
  @Input('path') data: string = 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z';
}

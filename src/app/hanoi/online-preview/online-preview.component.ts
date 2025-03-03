import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-online-preview',
  standalone: false,

  templateUrl: './online-preview.component.html',
  styleUrl: './online-preview.component.css'
})
export class OnlinePreviewComponent {
  @Input()
  stack1: number[] = [];
  @Input()
  stack2: number[] = [];
  @Input()
  stack3: number[] = [];
}

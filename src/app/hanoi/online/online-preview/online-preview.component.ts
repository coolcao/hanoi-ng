import { Component, Input } from '@angular/core';

@Component({
  selector: 'hanoi-online-preview',
  standalone: false,

  templateUrl: './online-preview.component.html',
  styleUrl: './online-preview.component.css'
})
export class HanoiOnlinePreviewComponent {
  @Input()
  stack1: number[] = [];
  @Input()
  stack2: number[] = [];
  @Input()
  stack3: number[] = [];
}

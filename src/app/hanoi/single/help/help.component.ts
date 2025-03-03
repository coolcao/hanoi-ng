import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: false,

  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  @Output()
  onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}

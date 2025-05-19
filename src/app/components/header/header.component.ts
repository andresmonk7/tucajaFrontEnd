import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() pageTitle: string = 'Título por Defecto';
  @Input() mainButtonText: string = 'Acción';
  @Input() showMainButton: boolean = true;
  @Output() mainButtonClick = new EventEmitter<void>();

  constructor() { }

  onMainButtonClick(): void {
    console.log(`Botón "${this.mainButtonText}" clickeado en el header.`);
    this.mainButtonClick.emit();
  }
}

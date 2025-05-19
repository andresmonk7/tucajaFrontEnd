import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './StatCard.component.html',
  styleUrl: './StatCard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {

  title = input<string>('');
  value = input<string>('');
}

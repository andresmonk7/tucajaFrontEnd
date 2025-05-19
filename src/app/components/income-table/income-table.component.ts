import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-income-table',
  imports: [NgIf],
  templateUrl: './income-table.component.html',
  styleUrl: './income-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeTableComponent {
  incomes = input<any[]>([]);
}

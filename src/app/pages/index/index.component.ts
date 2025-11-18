import { Component } from '@angular/core';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [DashboardComponent],
  template: `<app-dashboard></app-dashboard>`,
  styles: []
})
export class IndexComponent {}


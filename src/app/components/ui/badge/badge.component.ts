import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../../../lib/utils';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="badgeClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'outline' = 'default';

  get badgeClass(): string {
    return cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      {
        'border-transparent bg-primary text-primary-foreground hover:bg-primary/80': this.variant === 'default',
        'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80': this.variant === 'secondary',
        'text-foreground': this.variant === 'outline'
      }
    );
  }
}


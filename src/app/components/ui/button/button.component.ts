import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../../../lib/utils';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClass"
      [type]="type"
      [disabled]="disabled"
      [attr.aria-disabled]="disabled"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: 'default' | 'outline' | 'ghost' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  get buttonClass(): string {
    return cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-primary text-primary-foreground hover:bg-primary/90': this.variant === 'default',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground': this.variant === 'outline',
        'hover:bg-accent hover:text-accent-foreground': this.variant === 'ghost',
        'h-9 px-4 py-2': this.size === 'md',
        'h-8 rounded-md px-3 text-xs': this.size === 'sm',
        'h-10 px-8': this.size === 'lg'
      }
    );
  }
}


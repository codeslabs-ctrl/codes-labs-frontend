import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#0C1018]">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4 text-white">404</h1>
        <p class="text-xl text-[#B0BEC5] mb-4">Oops! Page not found</p>
        <a routerLink="/" class="text-[#00C6FF] hover:text-[#2979FF] underline">
          Return to Home
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}


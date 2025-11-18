import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactFormComponent, RouterModule, LucideAngularModule],
  template: `
    <!-- Header Navigation -->
    <nav class="bg-gradient-to-r from-cyan-50/90 via-cyan-100/90 to-cyan-50/90 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-md border-b border-cyan-200/50 dark:border-cyan-800/50 sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <a routerLink="/" class="flex items-center space-x-4 group cursor-pointer">
            <div class="relative">
              <div class="absolute inset-0 bg-cyan-400/20 rounded-xl blur-lg group-hover:bg-cyan-400/30 transition-all duration-300"></div>
              <img
                src="assets/logo.webp"
                alt="Codes-Labs Logo"
                class="h-14 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span class="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-500 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent group-hover:from-cyan-700 group-hover:to-cyan-600 dark:group-hover:from-cyan-300 dark:group-hover:to-cyan-200 transition-all duration-300">
              Codes-Labs
            </span>
          </a>
          <div class="hidden md:flex items-center space-x-6">
            <a routerLink="/" class="text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 font-medium transition-colors">Inicio</a>
            <a routerLink="/" fragment="proyectos" class="text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 font-medium transition-colors">Proyectos</a>
            <a routerLink="/" fragment="identidad" class="text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 font-medium transition-colors">Nosotros</a>
            <a routerLink="/contacto" class="text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 font-medium transition-colors">Contacto</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contact Content -->
    <div class="min-h-screen bg-gradient-hero py-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Contáctanos
          </h1>
          <p class="text-xl text-white/80 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Estamos aquí para ayudarte a transformarlo en realidad.
          </p>
        </div>
        
        <div class="flex justify-center">
          <app-contact-form></app-contact-form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContactComponent {}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    LucideAngularModule
  ],
  template: `
    <div class="min-h-screen bg-background p-6">
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Header -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Quiénes Somos
              </h1>
              <p class="text-muted-foreground text-lg mt-2">
                Conoce más sobre CodesLabs y nuestra visión tecnológica
              </p>
            </div>
            <a routerLink="/">
              <app-button [variant]="'outline'" class="shadow-glow-primary">
                <lucide-icon name="arrow-left" class="mr-2 h-4 w-4"></lucide-icon>
                Volver al Dashboard
              </app-button>
            </a>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- About Us -->
            <app-card class="lg:col-span-3 bg-gradient-card border-border/50">
              <app-card-header>
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <lucide-icon name="users" class="h-6 w-6 text-primary"></lucide-icon>
                  </div>
                  <app-card-title class="text-xl">CodesLabs</app-card-title>
                </div>
              </app-card-header>
              <app-card-content>
                <p class="text-muted-foreground leading-relaxed text-lg">
                  Somos una empresa líder en desarrollo de proyectos tecnológicos apoyados con inteligencia artificial, 
                  especializada en impulsar negocios de cualquier tipo hacia la transformación digital. Combinamos la 
                  innovación tecnológica más avanzada con estrategias de negocio inteligentes para crear soluciones 
                  que revolucionan industrias y generan valor real para nuestros clientes.
                </p>
              </app-card-content>
            </app-card>

            <!-- Misión -->
            <app-card class="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300">
              <app-card-header>
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-accent/10 rounded-lg">
                    <lucide-icon name="target" class="h-6 w-6 text-accent"></lucide-icon>
                  </div>
                  <app-card-title class="text-xl">Misión</app-card-title>
                </div>
              </app-card-header>
              <app-card-content>
                <p class="text-muted-foreground leading-relaxed">
                  Desarrollar soluciones tecnológicas innovadoras potenciadas por inteligencia artificial que 
                  transformen la manera en que las empresas operan, optimizan procesos y toman decisiones, 
                  proporcionando herramientas que impulsen su crecimiento y competitividad en el mercado global.
                </p>
              </app-card-content>
            </app-card>

            <!-- Visión -->
            <app-card class="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300">
              <app-card-header>
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <lucide-icon name="lightbulb" class="h-6 w-6 text-primary"></lucide-icon>
                  </div>
                  <app-card-title class="text-xl">Visión</app-card-title>
                </div>
              </app-card-header>
              <app-card-content>
                <p class="text-muted-foreground leading-relaxed">
                  Ser la empresa de referencia mundial en desarrollo de proyectos con IA, reconocida por nuestra 
                  capacidad de crear tecnologías disruptivas que redefinan industrias completas y establezcan 
                  nuevos estándares de innovación y excelencia tecnológica.
                </p>
              </app-card-content>
            </app-card>

            <!-- Valores -->
            <app-card class="bg-gradient-card border-border/50 hover:border-accent/50 transition-all duration-300">
              <app-card-header>
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-accent/10 rounded-lg">
                    <lucide-icon name="shield" class="h-6 w-6 text-accent"></lucide-icon>
                  </div>
                  <app-card-title class="text-xl">Valores</app-card-title>
                </div>
              </app-card-header>
              <app-card-content>
                <div class="space-y-2">
                  <div class="text-sm">
                    <span class="text-primary font-medium">• Innovación:</span>
                    <span class="text-muted-foreground"> Constante búsqueda de soluciones revolucionarias</span>
                  </div>
                  <div class="text-sm">
                    <span class="text-primary font-medium">• Excelencia:</span>
                    <span class="text-muted-foreground"> Máxima calidad en cada proyecto</span>
                  </div>
                  <div class="text-sm">
                    <span class="text-primary font-medium">• Colaboración:</span>
                    <span class="text-muted-foreground"> Trabajo en equipo y sinergia</span>
                  </div>
                  <div class="text-sm">
                    <span class="text-primary font-medium">• Impacto:</span>
                    <span class="text-muted-foreground"> Resultados que transforman negocios</span>
                  </div>
                </div>
              </app-card-content>
            </app-card>
          </div>

          <!-- Additional Company Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-card class="bg-gradient-card border-border/50">
              <app-card-header>
                <app-card-title class="text-lg">Nuestro Enfoque</app-card-title>
              </app-card-header>
              <app-card-content>
                <p class="text-muted-foreground leading-relaxed">
                  Utilizamos las últimas tecnologías de inteligencia artificial, machine learning y deep learning 
                  para crear soluciones personalizadas que se adapten perfectamente a las necesidades específicas 
                  de cada cliente, sin importar su industria o tamaño.
                </p>
              </app-card-content>
            </app-card>

            <app-card class="bg-gradient-card border-border/50">
              <app-card-header>
                <app-card-title class="text-lg">¿Por Qué Elegirnos?</app-card-title>
              </app-card-header>
              <app-card-content>
                <p class="text-muted-foreground leading-relaxed">
                  Nuestro equipo multidisciplinario combina experiencia técnica avanzada con profundo conocimiento 
                  de negocio, garantizando soluciones que no solo son tecnológicamente superiores, sino también 
                  estratégicamente alineadas con los objetivos empresariales.
                </p>
              </app-card-content>
            </app-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AboutComponent {}


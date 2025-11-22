import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    BadgeComponent
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isLoading = true;
  error: string | null = null;
  
  // Agrupar detalles por tipo
  featureDetails: any[] = [];
  technologyDetails: any[] = [];
  securityDetails: any[] = [];
  benefitDetails: any[] = [];
  otherDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
    } else {
      this.error = 'ID de proyecto no válido';
      this.isLoading = false;
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.getProjectById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.project = response.data;
          // Debug: Verificar que los detalles se carguen
          console.log('Proyecto cargado:', this.project);
          console.log('Tecnologías:', this.project.technologies);
          console.log('Detalles del proyecto:', this.project.details);
          console.log('Cantidad de detalles:', this.project.details?.length || 0);
          // Organizar detalles por tipo
          this.organizeDetails();
          console.log('Detalles organizados - Features:', this.featureDetails.length);
          console.log('Detalles organizados - Technologies:', this.technologyDetails.length);
          console.log('Detalles organizados - Security:', this.securityDetails.length);
          console.log('Detalles organizados - Benefits:', this.benefitDetails.length);
          console.log('Detalles organizados - Other:', this.otherDetails.length);
        } else {
          this.error = 'Proyecto no encontrado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar proyecto:', error);
        this.error = 'Error al cargar el proyecto. Por favor, intenta más tarde.';
        this.isLoading = false;
      }
    });
  }

  getStats(project: Project): { key: string; value: string }[] {
    return Object.entries(project.stats).map(([key, value]) => ({
      key: key.replace('_', ' '),
      value
    }));
  }

  getIconName(iconName: string): string {
    return iconName;
  }

  /**
   * Organiza los detalles del proyecto por tipo para mejor visualización
   */
  organizeDetails(): void {
    if (!this.project?.details) {
      console.warn('No hay detalles en el proyecto');
      return;
    }

    // Resetear arrays
    this.featureDetails = [];
    this.technologyDetails = [];
    this.securityDetails = [];
    this.benefitDetails = [];
    this.otherDetails = [];

    this.project.details.forEach(detail => {
      if (!detail || !detail.projectDetail) {
        console.warn('Detalle inválido:', detail);
        return;
      }

      const content = detail.projectDetail.toLowerCase();
      
      if (content.includes('## tecnologías') || content.includes('tecnologías frontend') || content.includes('tecnologías backend') || content.includes('tecnologías utilizadas')) {
        this.technologyDetails.push(detail);
      } else if (content.includes('## seguridad')) {
        this.securityDetails.push(detail);
      } else if (content.includes('## beneficios') || content.includes('beneficios del sistema')) {
        this.benefitDetails.push(detail);
      } else if (content.includes('## gestión') || content.includes('## control') || content.includes('## sistema') || 
                 content.includes('## historial') || content.includes('## informes') || content.includes('## características') ||
                 content.includes('## roles') || content.includes('## pacientes') || content.includes('## consultas') ||
                 content.includes('## médicos') || content.includes('## financiero')) {
        this.featureDetails.push(detail);
      } else {
        this.otherDetails.push(detail);
      }
    });

    // Si no se organizó nada, poner todo en otherDetails como fallback
    if (this.featureDetails.length === 0 && this.technologyDetails.length === 0 && 
        this.securityDetails.length === 0 && this.benefitDetails.length === 0 && 
        this.otherDetails.length === 0 && this.project.details.length > 0) {
      console.warn('No se pudo organizar ningún detalle, usando fallback');
      this.otherDetails = [...this.project.details];
    }
  }

  /**
   * Convierte markdown básico a HTML de forma segura
   * Soporta: ## títulos, **negrita**, listas con -, y saltos de línea
   */
  markdownToHtml(markdown: string): SafeHtml {
    if (!markdown) return this.sanitizer.bypassSecurityTrustHtml('');
    
    // Función para escapar HTML (solo para texto plano)
    const escapeHtml = (text: string): string => {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };
    
    // Función para procesar negrita en un texto
    const processBold = (text: string): string => {
      if (!text) return '';
      
      // Dividir el texto en partes: texto normal y **texto**
      const parts: string[] = [];
      let lastIndex = 0;
      const boldRegex = /\*\*(.+?)\*\*/g;
      let match;
      
      while ((match = boldRegex.exec(text)) !== null) {
        // Agregar texto antes del match (escapado)
        if (match.index > lastIndex) {
          const beforeText = text.substring(lastIndex, match.index);
          if (beforeText) {
            parts.push(escapeHtml(beforeText));
          }
        }
        // Agregar el HTML de negrita (contenido escapado)
        const boldContent = escapeHtml(match[1]);
        parts.push(`<strong class="font-semibold text-foreground">${boldContent}</strong>`);
        lastIndex = match.index + match[0].length;
      }
      
      // Agregar texto restante (escapado)
      if (lastIndex < text.length) {
        const remainingText = text.substring(lastIndex);
        if (remainingText) {
          parts.push(escapeHtml(remainingText));
        }
      }
      
      // Si no hubo matches, escapar todo el texto
      return parts.length > 0 ? parts.join('') : escapeHtml(text);
    };
    
    // Dividir en líneas (preservar líneas vacías para detectar bloques)
    const lines = markdown.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const originalLine = lines[i];
      const line = originalLine.trim();
      
      // Si la línea está vacía, cerrar lista si está abierta
      if (!line) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        continue;
      }
      
      // Procesar títulos ## Título
      if (line.startsWith('## ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const title = line.substring(3).trim();
        if (title) {
          processedLines.push(`<h3 class="text-xl font-bold text-foreground mb-4 mt-6 first:mt-0">${escapeHtml(title)}</h3>`);
        }
        continue;
      }
      
      // Procesar listas con - item (debe empezar con - y espacio)
      if (line.startsWith('- ')) {
        const listItem = line.substring(2).trim();
        
        if (!inList) {
          processedLines.push('<ul class="list-disc space-y-2 mb-4 ml-6">');
          inList = true;
        }
        
        // Procesar negrita en el item
        const processedItem = processBold(listItem);
        processedLines.push(`<li class="text-muted-foreground">${processedItem}</li>`);
        continue;
      }
      
      // Si llegamos aquí, es texto normal (no es título ni lista)
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      
      // Procesar negrita en texto normal
      const processedLine = processBold(line);
      
      // Convertir a párrafo solo si no está vacío
      if (processedLine.trim()) {
        processedLines.push(`<p class="mb-3 text-muted-foreground leading-relaxed">${processedLine}</p>`);
      }
    }
    
    // Cerrar lista si está abierta al final
    if (inList) {
      processedLines.push('</ul>');
    }
    
    const html = processedLines.join('');
    
    // Retornar como SafeHtml
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}


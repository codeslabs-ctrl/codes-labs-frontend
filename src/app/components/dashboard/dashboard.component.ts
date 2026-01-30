import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../ui/button/button.component';
import { CardComponent, CardContentComponent } from '../ui/card/card.component';
import { BadgeComponent } from '../ui/badge/badge.component';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { CompanyValue } from '../../models/company-value.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    BadgeComponent,
    LucideAngularModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  companyValues: CompanyValue[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    console.log('🔄 Iniciando carga de datos...');

    // Cargar proyectos y valores de empresa en paralelo
    let projectsLoaded = false;
    let companyValuesLoaded = false;

    const checkComplete = () => {
      if (projectsLoaded && companyValuesLoaded) {
        this.isLoading = false;
        console.log('✅ Carga de datos completada');
      }
    };

    // Cargar proyectos
    this.apiService.getProjects().subscribe({
      next: (response) => {
        console.log('📦 Respuesta de proyectos:', response);
        if (response.success && response.data) {
          this.projects = response.data;
          console.log(`✅ ${this.projects.length} proyectos cargados`);
          
          // Debug: Verificar campos nuevos en el primer proyecto
          if (this.projects.length > 0) {
            console.log('🔍 Primer proyecto recibido:', {
              id: this.projects[0].id,
              title: this.projects[0].title,
              whatIs: this.projects[0].whatIs,
              forWho: this.projects[0].forWho,
              whatSolved: this.projects[0].whatSolved,
              result: this.projects[0].result,
              hasWhatIs: !!this.projects[0].whatIs,
              hasForWho: !!this.projects[0].forWho,
              hasWhatSolved: !!this.projects[0].whatSolved,
              hasResult: !!this.projects[0].result
            });
          }
        } else {
          console.warn('⚠️ Respuesta de proyectos sin datos:', response);
          this.projects = [];
        }
        projectsLoaded = true;
        checkComplete();
      },
      error: (error) => {
        console.error('❌ Error al cargar proyectos:', error);
        const errorMsg = error.message || 'Error al cargar los proyectos. Por favor, intenta más tarde.';
        
        // Mensaje más específico para errores de conexión
        if (errorMsg.includes('No se pudo conectar') || errorMsg.includes('conectar con el servidor')) {
          this.error = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3002';
        } else {
          this.error = errorMsg;
        }
        
        this.projects = [];
        projectsLoaded = true;
        checkComplete();
      }
    });

    // Cargar valores de empresa
    this.apiService.getCompanyValues().subscribe({
      next: (response) => {
        console.log('🏢 Respuesta de valores de empresa:', response);
        if (response.success && response.data) {
          this.companyValues = response.data;
          console.log(`✅ ${this.companyValues.length} valores de empresa cargados`);
        } else {
          console.warn('⚠️ Respuesta de valores sin datos:', response);
          this.companyValues = [];
        }
        companyValuesLoaded = true;
        checkComplete();
      },
      error: (error) => {
        console.error('❌ Error al cargar valores de la empresa:', error);
        // No mostramos error aquí para no interrumpir la visualización
        this.companyValues = [];
        companyValuesLoaded = true;
        checkComplete();
      }
    });
  }

  loadCompanyValues(): void {
    // Este método ya no se usa, pero lo mantenemos por compatibilidad
    // La carga ahora se hace en paralelo en loadData()
  }

  getStats(project: Project): { key: string; value: string }[] {
    return Object.entries(project.stats).map(([key, value]) => ({
      key: key.replace('_', ' '),
      value
    }));
  }
}


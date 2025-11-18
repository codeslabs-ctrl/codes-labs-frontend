import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
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
          // Debug: Verificar que las tecnologías se carguen
          console.log('Proyecto cargado:', this.project);
          console.log('Tecnologías:', this.project.technologies);
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
}


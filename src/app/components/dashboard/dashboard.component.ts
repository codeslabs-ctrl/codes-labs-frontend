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

    // Cargar proyectos
    this.apiService.getProjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.projects = response.data;
        }
        this.loadCompanyValues();
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.error = 'Error al cargar los proyectos. Por favor, intenta más tarde.';
        this.isLoading = false;
      }
    });
  }

  loadCompanyValues(): void {
    this.apiService.getCompanyValues().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.companyValues = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar valores de la empresa:', error);
        // No mostramos error aquí para no interrumpir la visualización
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
}


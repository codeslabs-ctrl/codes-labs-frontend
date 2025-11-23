import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.model';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    BadgeComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Búsqueda y filtrado
  searchTerm = '';
  filterCategory = '';
  categories: string[] = [];
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  get totalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.itemsPerPage);
  }
  get paginatedProjects(): Project[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProjects.slice(start, end);
  }
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProjects.length);
  }

  constructor(
    private apiService: ApiService,
    public authService: AuthService, // Público para usar en template
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.getProjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Cargar todos los proyectos (incluyendo inactivos para admin)
          this.projects = response.data;
          // Extraer categorías únicas
          this.categories = [...new Set(this.projects.map(p => p.category).filter(c => c))];
          this.applyFilters();
        } else {
          this.error = 'Error al cargar los proyectos';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.error = 'Error al cargar los proyectos. Por favor, intenta más tarde.';
        this.isLoading = false;
      }
    });
  }

  // Filtrado y búsqueda
  applyFilters(): void {
    let filtered = [...this.projects];

    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.technologies.some(t => t.toLowerCase().includes(search))
      );
    }

    // Filtrar por categoría
    if (this.filterCategory) {
      filtered = filtered.filter(p => p.category === this.filterCategory);
    }

    this.filteredProjects = filtered;
    // Resetear a la primera página cuando se aplican filtros
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterCategory = '';
    this.applyFilters();
  }

  // Crear nuevo proyecto
  createProject(): void {
    this.router.navigate(['/admin/projects/new']);
  }

  // Editar proyecto
  editProject(project: Project): void {
    this.router.navigate(['/admin/projects', project.id, 'edit']);
  }

  // Eliminar proyecto
  deleteProject(project: Project): void {
    if (!confirm(`¿Estás seguro de eliminar el proyecto "${project.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.apiService.deleteProject(project.id).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Proyecto eliminado exitosamente');
          this.loadProjects();
        }
      },
      error: (error) => {
        console.error('Error al eliminar proyecto:', error);
        alert('Error al eliminar el proyecto');
      }
    });
  }

  // Gestionar detalles del proyecto
  manageDetails(project: Project): void {
    this.router.navigate(['/admin/projects', project.id, 'details']);
  }

  // Paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll al inicio de la tabla
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5; // Mostrar máximo 5 números de página
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);
    
    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}

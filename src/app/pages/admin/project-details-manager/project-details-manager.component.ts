import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { Project, ProjectDetail } from '../../../models/project.model';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../../../components/ui/card/card.component';
import { BadgeComponent } from '../../../components/ui/badge/badge.component';

@Component({
  selector: 'app-project-details-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    BadgeComponent
  ],
  templateUrl: './project-details-manager.component.html',
  styleUrls: ['./project-details-manager.component.css']
})
export class ProjectDetailsManagerComponent implements OnInit {
  @Input() projectId: string = '';
  @Input() projectTitle: string = '';
  @Output() closed = new EventEmitter<void>();

  currentProjectDetails: ProjectDetail[] = [];
  isLoading = true;
  detailForm: FormGroup;
  editingDetailId: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.detailForm = this.fb.group({
      projectDetail: ['', [Validators.required]],
      displayOrder: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    // Obtener ID de la ruta si no se pasa como input
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId && !this.projectId) {
      this.projectId = routeId;
      // Cargar información del proyecto
      this.apiService.getProjectById(this.projectId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.projectTitle = response.data.title;
            this.loadDetails();
          }
        },
        error: (error) => {
          console.error('Error al cargar proyecto:', error);
          this.router.navigate(['/admin']);
        }
      });
    } else if (this.projectId) {
      this.loadDetails();
    }
  }

  loadDetails(): void {
    this.isLoading = true;
    this.apiService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentProjectDetails = response.data.details || [];
          this.currentProjectDetails.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles:', error);
        this.isLoading = false;
      }
    });
  }

  createDetail(): void {
    this.editingDetailId = null;
    this.detailForm.reset({
      displayOrder: this.currentProjectDetails.length,
      isActive: true
    });
  }

  editDetail(detail: ProjectDetail): void {
    this.editingDetailId = detail.id;
    this.detailForm.patchValue({
      projectDetail: detail.projectDetail,
      displayOrder: detail.displayOrder,
      isActive: detail.isActive !== false
    });
  }

  saveDetail(): void {
    if (this.detailForm.invalid || !this.projectId) {
      this.detailForm.markAllAsTouched();
      return;
    }

    const formValue = this.detailForm.value;

    if (this.editingDetailId) {
      // Actualizar detalle existente
      this.apiService.updateProjectDetail(this.editingDetailId, formValue).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Detalle actualizado exitosamente');
            this.loadDetails();
            this.detailForm.reset({
              displayOrder: 0,
              isActive: true
            });
            this.editingDetailId = null;
          }
        },
        error: (error) => {
          console.error('Error al actualizar detalle:', error);
          alert('Error al actualizar el detalle');
        }
      });
    } else {
      // Crear nuevo detalle
      this.apiService.createProjectDetail(this.projectId, formValue).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Detalle creado exitosamente');
            this.loadDetails();
            this.detailForm.reset({
              displayOrder: 0,
              isActive: true
            });
          }
        },
        error: (error) => {
          console.error('Error al crear detalle:', error);
          alert('Error al crear el detalle');
        }
      });
    }
  }

  deleteDetail(detail: ProjectDetail): void {
    if (!confirm(`¿Estás seguro de eliminar este detalle?`)) {
      return;
    }

    this.apiService.deleteProjectDetail(detail.id).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Detalle eliminado exitosamente');
          this.loadDetails();
        }
      },
      error: (error) => {
        console.error('Error al eliminar detalle:', error);
        alert('Error al eliminar el detalle');
      }
    });
  }

  close(): void {
    this.closed.emit();
    this.router.navigate(['/admin']);
  }
}


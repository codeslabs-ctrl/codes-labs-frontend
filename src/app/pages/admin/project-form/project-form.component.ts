import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { Project } from '../../../models/project.model';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../../../components/ui/card/card.component';

@Component({
  selector: 'app-project-form',
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
    CardTitleComponent
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  @Input() project: Project | null = null;
  @Output() saved = new EventEmitter<Project>();
  @Output() cancelled = new EventEmitter<void>();

  projectForm: FormGroup;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required, Validators.maxLength(100)]],
      iconName: ['sparkles', [Validators.required]],
      displayOrder: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      stats: this.fb.array([]),
      technologies: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Obtener ID de la ruta
    const projectId = this.route.snapshot.paramMap.get('id');
    
    if (projectId && projectId !== 'new') {
      // Cargar proyecto para editar
      this.apiService.getProjectById(projectId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.project = response.data;
            this.loadProject(this.project);
          }
        },
        error: (error) => {
          console.error('Error al cargar proyecto:', error);
          this.router.navigate(['/admin']);
        }
      });
    } else if (this.project) {
      // Si se pasa como input
      this.loadProject(this.project);
    }
  }

  get statsFormArray(): FormArray<FormGroup> {
    return this.projectForm.get('stats') as FormArray<FormGroup>;
  }

  get technologiesFormArray(): FormArray<FormControl> {
    return this.projectForm.get('technologies') as FormArray<FormControl>;
  }

  loadProject(project: Project): void {
    // Convertir stats a FormArray
    this.statsFormArray.clear();
    if (project.stats) {
      Object.entries(project.stats).forEach(([key, value]) => {
        const statGroup = this.fb.group({
          key: [key, Validators.required],
          value: [value, Validators.required]
        });
        this.statsFormArray.push(statGroup);
      });
    }

    // Convertir technologies a FormArray
    this.technologiesFormArray.clear();
    if (project.technologies) {
      project.technologies.forEach(tech => {
        this.technologiesFormArray.push(this.fb.control(tech, Validators.required));
      });
    }

    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      category: project.category,
      iconName: project.iconName,
      displayOrder: project.displayOrder || 0,
      isActive: project.isActive !== false
    });
  }

  addStat(): void {
    const statGroup = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.statsFormArray.push(statGroup);
  }

  removeStat(index: number): void {
    this.statsFormArray.removeAt(index);
  }

  addTechnology(): void {
    const techControl = this.fb.control('', Validators.required);
    this.technologiesFormArray.push(techControl);
  }

  removeTechnology(index: number): void {
    this.technologiesFormArray.removeAt(index);
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.projectForm.value;

    // Convertir FormArray de stats a objeto
    const stats: { [key: string]: string } = {};
    this.statsFormArray.controls.forEach(control => {
      const key = control.get('key')?.value;
      const value = control.get('value')?.value;
      if (key && value) {
        stats[key] = value;
      }
    });

    // Convertir FormArray de technologies a array
    const technologies = this.technologiesFormArray.controls
      .map(control => control.value)
      .filter(tech => tech && tech.trim() !== '');

    const projectData = {
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      iconName: formValue.iconName,
      displayOrder: formValue.displayOrder,
      isActive: formValue.isActive,
      stats: Object.keys(stats).length > 0 ? stats : undefined,
      technologies: technologies.length > 0 ? technologies : undefined
    };

    if (this.project?.id) {
      // Actualizar proyecto existente
      this.apiService.updateProject(this.project.id, projectData).subscribe({
        next: (response) => {
          if (response.success) {
            this.saved.emit(response.data);
            this.router.navigate(['/admin']);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error al actualizar proyecto:', error);
          alert('Error al actualizar el proyecto');
          this.isSubmitting = false;
        }
      });
    } else {
      // Crear nuevo proyecto
      this.apiService.createProject(projectData).subscribe({
        next: (response) => {
          if (response.success) {
            this.saved.emit(response.data);
            this.router.navigate(['/admin']);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error al crear proyecto:', error);
          alert('Error al crear el proyecto');
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/admin']);
  }
}


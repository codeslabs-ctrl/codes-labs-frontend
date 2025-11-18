import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { QuillModule } from 'ngx-quill';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    QuillModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitted = false;
  isSubmitting = false;
  errorMessage = '';
  
  quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  quillStyles = {
    height: '200px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.contactForm = this.fb.group({
      nombreContacto: ['', [Validators.required, Validators.minLength(2)]],
      nombreEmpresa: ['', [Validators.required, Validators.minLength(2)]],
      emailContacto: ['', [Validators.required, Validators.email]],
      telefonoContacto: ['', [Validators.required, Validators.pattern(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)]],
      comentarios: ['']
    });
  }

  ngOnInit() {
    // El editor Quill se inicializará automáticamente
  }

  get nombreContacto() {
    return this.contactForm.get('nombreContacto');
  }

  get nombreEmpresa() {
    return this.contactForm.get('nombreEmpresa');
  }

  get emailContacto() {
    return this.contactForm.get('emailContacto');
  }

  get telefonoContacto() {
    return this.contactForm.get('telefonoContacto');
  }

  get comentarios() {
    return this.contactForm.get('comentarios');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const formData = {
        nombreContacto: this.contactForm.value.nombreContacto,
        nombreEmpresa: this.contactForm.value.nombreEmpresa,
        emailContacto: this.contactForm.value.emailContacto,
        telefonoContacto: this.contactForm.value.telefonoContacto,
        comentarios: this.contactForm.value.comentarios || ''
      };

      this.apiService.sendContact(formData).subscribe({
        next: (result) => {
          this.isSubmitting = false;
          if (result.success) {
            this.isSubmitted = true;
            // Resetear formulario después de 5 segundos
            setTimeout(() => {
              this.contactForm.reset();
              this.isSubmitted = false;
            }, 5000);
          } else {
            this.errorMessage = result.message;
          }
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          this.isSubmitting = false;
          this.errorMessage = error.message || 'Error al enviar el mensaje. Por favor, intenta nuevamente más tarde.';
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}


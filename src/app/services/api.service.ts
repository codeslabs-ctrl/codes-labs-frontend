import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, TimeoutError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Project, ProjectResponse, SingleProjectResponse } from '../models/project.model';
import { CompanyValue, CompanyValueResponse, SingleCompanyValueResponse } from '../models/company-value.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Projects
  getProjects(): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.apiUrl}/projects`)
      .pipe(
        timeout(10000), // Timeout de 10 segundos
        retry(1), // Reintentar 1 vez en caso de error
        catchError((err) => this.handleError(err))
      );
  }

  getProjectById(id: string): Observable<SingleProjectResponse> {
    return this.http.get<SingleProjectResponse>(`${this.apiUrl}/projects/${id}`)
      .pipe(
        retry(2),
        catchError((err) => this.handleError(err))
      );
  }

  createProject(projectData: {
    title: string;
    description: string;
    category: string;
    iconName: string;
    displayOrder?: number;
    isActive?: boolean;
    stats?: { [key: string]: string };
    technologies?: string[];
  }): Observable<SingleProjectResponse> {
    return this.http.post<SingleProjectResponse>(`${this.apiUrl}/projects`, projectData)
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  updateProject(id: string, projectData: {
    title?: string;
    description?: string;
    category?: string;
    iconName?: string;
    displayOrder?: number;
    isActive?: boolean;
    stats?: { [key: string]: string };
    technologies?: string[];
  }): Observable<SingleProjectResponse> {
    return this.http.put<SingleProjectResponse>(`${this.apiUrl}/projects/${id}`, projectData)
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  deleteProject(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/projects/${id}`)
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  // Project Details
  createProjectDetail(projectId: string, detailData: {
    projectDetail: string;
    displayOrder?: number;
    isActive?: boolean;
  }): Observable<{ success: boolean; data: any; message: string }> {
    return this.http.post<{ success: boolean; data: any; message: string }>(
      `${this.apiUrl}/projects/${projectId}/details`,
      detailData
    ).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  updateProjectDetail(detailId: string, detailData: {
    projectDetail?: string;
    displayOrder?: number;
    isActive?: boolean;
  }): Observable<{ success: boolean; data: any; message: string }> {
    return this.http.put<{ success: boolean; data: any; message: string }>(
      `${this.apiUrl}/projects/details/${detailId}`,
      detailData
    ).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  deleteProjectDetail(detailId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/projects/details/${detailId}`
    ).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  updateAllProjectDetails(projectId: string, details: any[]): Observable<{ success: boolean; data: any[]; message: string }> {
    return this.http.put<{ success: boolean; data: any[]; message: string }>(
      `${this.apiUrl}/projects/${projectId}/details`,
      { details }
    ).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  // Company Values
  getCompanyValues(): Observable<CompanyValueResponse> {
    return this.http.get<CompanyValueResponse>(`${this.apiUrl}/company-values`)
      .pipe(
        timeout(10000), // Timeout de 10 segundos
        retry(1), // Reintentar 1 vez en caso de error
        catchError((err) => this.handleError(err))
      );
  }

  getCompanyValueById(id: string): Observable<SingleCompanyValueResponse> {
    return this.http.get<SingleCompanyValueResponse>(`${this.apiUrl}/company-values/${id}`)
      .pipe(
        retry(2),
        catchError((err) => this.handleError(err))
      );
  }

  // Contact Form
  sendContact(formData: {
    nombreContacto: string;
    nombreEmpresa: string;
    emailContacto: string;
    telefonoContacto: string;
    comentarios?: string;
  }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/contact/send`,
      formData
    ).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  // Error Handler
  private handleError(error: HttpErrorResponse | TimeoutError | Error): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error instanceof TimeoutError) {
      // Error de timeout
      errorMessage = 'La solicitud tardó demasiado tiempo. Por favor, verifica tu conexión e intenta nuevamente.';
      console.error('API Timeout Error:', error);
    } else if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        // Error de conexión (backend no disponible, CORS, etc.) - sin exponer URLs al usuario
        errorMessage = 'No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.';
        console.error('API Connection Error:', {
          url: error.url,
          status: error.status,
          statusText: error.statusText,
          message: error.message
        });
      } else if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error de conexión: ${error.error.message}`;
        console.error('API Client Error:', error.error);
      } else {
        // Error del lado del servidor
        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
        console.error('API Server Error:', errorMessage, error);
      }
    } else {
      console.error('API Unknown Error:', error);
    }
    
    return throwError(() => new Error(errorMessage));
  }
}


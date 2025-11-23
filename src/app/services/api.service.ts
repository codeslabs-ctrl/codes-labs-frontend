import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
        retry(2), // Reintentar 2 veces en caso de error
        catchError(this.handleError)
      );
  }

  getProjectById(id: string): Observable<SingleProjectResponse> {
    return this.http.get<SingleProjectResponse>(`${this.apiUrl}/projects/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
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
        catchError(this.handleError)
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
        catchError(this.handleError)
      );
  }

  deleteProject(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/projects/${id}`)
      .pipe(
        catchError(this.handleError)
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
      catchError(this.handleError)
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
      catchError(this.handleError)
    );
  }

  deleteProjectDetail(detailId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/projects/details/${detailId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateAllProjectDetails(projectId: string, details: any[]): Observable<{ success: boolean; data: any[]; message: string }> {
    return this.http.put<{ success: boolean; data: any[]; message: string }>(
      `${this.apiUrl}/projects/${projectId}/details`,
      { details }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Company Values
  getCompanyValues(): Observable<CompanyValueResponse> {
    return this.http.get<CompanyValueResponse>(`${this.apiUrl}/company-values`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getCompanyValueById(id: string): Observable<SingleCompanyValueResponse> {
    return this.http.get<SingleCompanyValueResponse>(`${this.apiUrl}/company-values/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
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
      catchError(this.handleError)
    );
  }

  // Error Handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}


import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { ProjectFormComponent } from './pages/admin/project-form/project-form.component';
import { ProjectDetailsManagerComponent } from './pages/admin/project-details-manager/project-details-manager.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'proyectos/:id', component: ProjectDetailComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'admin/projects/new', component: ProjectFormComponent, canActivate: [adminGuard] },
  { path: 'admin/projects/:id/edit', component: ProjectFormComponent, canActivate: [adminGuard] },
  { path: 'admin/projects/:id/details', component: ProjectDetailsManagerComponent, canActivate: [adminGuard] },
  { path: '**', component: NotFoundComponent }
];


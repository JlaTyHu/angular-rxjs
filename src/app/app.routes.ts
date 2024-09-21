import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent)
  },
  {
    path: 'course/:id',
    loadComponent: () =>
      import('./pages/course/course.component').then((m) => m.CourseComponent)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { staffGuard } from './core/guards/staff.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/registro/registro').then((m) => m.RegistroComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/layout/layout').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent)
      },
      {
        path: 'items',
        loadComponent: () => import('./pages/items/item-list/item-list').then((m) => m.ItemListComponent)
      },
      {
        path: 'items/nuevo',
        canActivate: [staffGuard],
        loadComponent: () => import('./pages/items/item-create/item-create').then((m) => m.ItemCreateComponent)
      },
      {
        path: 'items/:id',
        loadComponent: () => import('./pages/items/item-detail/item-detail').then((m) => m.ItemDetailComponent)
      },
      {
        path: 'staff',
        loadComponent: () => import('./pages/staff/staff').then((m) => m.StaffComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

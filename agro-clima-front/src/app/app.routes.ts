
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routesRegistry = [
  { path: 'equipamentos', label: 'Equipamento', icon: 'construction' },
  { path: 'solos', label: 'Solo', icon: 'potted_plant' },
  { path: 'terrenos',     label: 'Area Agricola',     icon: 'map'          },
  { path: 'operacional',  label: 'Janela Operacional', icon: 'window' },
];

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'equipamentos',
    canActivate: [authGuard],
    loadComponent: () => import('../equipamento/equipment-list.component')
      .then(m => m.EquipmentListComponent)
  },
  {
    path: 'terrenos',
    canActivate: [authGuard],
    loadComponent: () => import('../area_agricola/area-list.component')
      .then(m => m.AreaAgricolaListComponent)
  },
  {
    path: 'operacional',
    canActivate: [authGuard],
    loadComponent: () => import('../janela_operacional/janela-operacional-page.component')
      .then(m => m.JanelaOperacionalPageComponent)
  },
    {
    path: 'solos',
    canActivate: [authGuard],
    loadComponent: () => import('../solo/solo-list.component')
      .then(m => m.SoloListComponent)
  },
  { path: '', redirectTo: 'equipamentos', pathMatch: 'full' },
  { path: '**', redirectTo: 'equipamentos' },
];

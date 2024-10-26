import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Импортируем AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  { 
    path: 'survey-builder', 
    loadChildren: () => import('./components/survey-builder/survey-builder.module').then(m => m.SurveyBuilderModule),
    canActivate: [AuthGuard] // Защищаем маршрут Survey Builder
  },
  { 
    path: 'survey-details/:id', 
    loadChildren: () => import('./components/survey-details/survey-details.module').then(m => m.SurveyDetailsModule),
    canActivate: [AuthGuard]  // Защищаем маршрут Survey Details
  },
  { 
    path: 'register', 
    loadChildren: () => import('./components/user-registr/user-registr.module').then(m => m.UserRegistrModule) 
  },
  { 
    path: 'login', 
    loadChildren: () => import('./components/user-login/user-login.module').then(m => m.UserLoginModule) 
  },
  { 
    path: 'user/:id/:username', 
    canActivate: [AuthGuard],  
    loadChildren: () => import('./components/user-page/user-page.module').then(m => m.UserPageModule) 
  },
  { 
    path: 'admin/:id/:username', 
    canActivate: [AuthGuard],  
    loadChildren: () => import('./components/admin-page/admin-page.module').then(m => m.AdminPageModule) 
  },
  { 
    path: 'edit-survey/:id', 
    loadChildren: () => import('./components/edit-survey/edit-survey.module').then(m => m.EditSurveyModule),
    canActivate: [AuthGuard]  
  },
  { 
    path: 'survey-results/:id', 
    loadChildren: () => import('./components/survey-results/survey-results.component.module').then(m => m.SurveyResultsModule),
    canActivate: [AuthGuard]  
  },
  { 
    path: 'search', 
    loadChildren: () => import('./components/search/search.module').then(m => m.SearchModule) 
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

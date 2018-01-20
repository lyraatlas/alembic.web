import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from './guards/index';
import { OverviewComponent } from './dashboard/overview/overview.component';

export const AppRoutes: Routes = [
  // This is the default route, which if a user is logged in and goes to 'home' which is basically an emtpy
  // path, we'll automatically redirect to dashboard/overview
  {
      path: '',
      redirectTo: 'dashboard/overview',
      pathMatch: 'full',
      canActivate: [AuthGuard],
  },
  { path: '', component: AdminLayoutComponent, 
    children: [{
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      }],
     canActivate: [AuthGuard] },
  { path: 'login', component: AuthLayoutComponent, 
     children: [{
         path: '',
         loadChildren: './authentication/authentication.module#AuthenticationModule'
       }]},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';


export const AppRoutes: Routes = [
	// This is the default route, which if a user is logged in and goes to 'home' which is basically an emtpy
	// path, we'll automatically redirect to dashboard/overview
	{
		path: '',
		redirectTo: 'dashboard/home',
		pathMatch: 'full',
		canActivate: [AuthGuard],
	},
	{
		path: '',
		component: AdminLayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: './dashboard/dashboard.module#DashboardModule'
			},
			{
				path: 'settings',
				loadChildren: './settings/settings.module#SettingsModule'
			},
			{
				path: 'bucket-board',
				loadChildren: './bucket-board/bucket-list.module#BucketListModule'
			},
			{
				path: 'search-results',
				loadChildren: './search-results/search-results.module#SearchResultsModule'
			},
		],
		canActivate: [AuthGuard]
	},
	{
		path: '',
		component: AuthLayoutComponent,
		children: [{
			path: 'auth',
			loadChildren: './authentication/authentication.module#AuthenticationModule'
		}]
	},
	// otherwise redirect to home
	{ path: '**', redirectTo: 'auth' }
];

@NgModule({
	// To enable tracing: imports: [RouterModule.forRoot(AppRoutes, { enableTracing: true })],
	imports: [RouterModule.forRoot(AppRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { ErrorEventBus } from '../event-buses';
import { CommentEventBus } from '../event-buses/comment.event-bus';
import { SearchBarEventBus } from '../event-buses/search-bar.event-bus';
import { AlertService, AuthenticationService, LikeableServiceMixin, SupplierService, UserService } from '../services';
import { BucketItemService } from '../services/bucket-item.service';
import { BucketService } from '../services/bucket.service';
import { NotificationService } from '../services/notification.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AlertComponent } from './directives/alert/alert.component';
import { AuthGuard } from './guards';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { NavigatorModule } from './shared/navigator/navigator.module';
import { SharedModule } from './shared/shared.module';
import { SidebarModule } from './sidebar/sidebar.module';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpModule,
		SidebarModule,
		NavbarModule,
		NavigatorModule,
		FooterModule,
		AuthenticationModule,
		DashboardModule,
		NgxSmartModalModule.forRoot(),
		FontAwesomeModule,
		SharedModule
	],
	declarations: [
		AppComponent,
		AdminLayoutComponent,
		AuthLayoutComponent,
		AlertComponent,
	],
	providers: [
		AlertService,
		UserService,
		BucketService,
		AuthenticationService,
		AuthGuard,
		BaseRequestOptions,
		SupplierService,
		ErrorEventBus,
		NotificationService,
		NgxSmartModalService,
		LikeableServiceMixin,
		BucketItemService,
		CommentEventBus,
		SearchBarEventBus
	],
	bootstrap: [AppComponent]
})

export class AppModule { }

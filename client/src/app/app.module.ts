import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { ErrorEventBus, ProductImageEventBus } from '../event-buses/';
import { BucketService } from '../services/bucket.service';
import { AlertService, AuthenticationService, ProductService, SupplierService, UserService } from '../services/index';
import { NotificationService } from '../services/notification.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AlertComponent } from './directives/alert/alert.component';
import { AuthGuard } from './guards/index';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { BucketSummaryComponent } from './shared/bucket-summary/bucket-summary.component';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { NavigatorModule } from './shared/navigator/navigator.module';
import { SidebarModule } from './sidebar/sidebar.module';



@NgModule({
    imports:      [
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
        FontAwesomeModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        AlertComponent,
        BucketSummaryComponent,
    ],
    providers: [
        AlertService,
        UserService,
        BucketService,
        AuthenticationService,
        AuthGuard,
        BaseRequestOptions,
        ProductService,
        SupplierService,
        ErrorEventBus,
        ProductImageEventBus,
        NotificationService,
        NgxSmartModalService
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }

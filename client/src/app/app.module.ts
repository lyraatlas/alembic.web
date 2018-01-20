import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent }   from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/index';
import { AlertService, AuthenticationService, ProductService, SupplierService, OrderService } from '../services/index';
import { AlertComponent } from './directives/alert/alert.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ErrorEventBus, ProductImageEventBus, OrderItemEventBus } from '../event-buses/';
import { WooCommerceService } from '../services/woocommerce.service';
import { NotificationService } from '../services/notification.service';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        AuthenticationModule,
        DashboardModule,
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        AlertComponent,
    ],
    providers: [
        AlertService,
        AuthenticationService,
        AuthGuard,
        BaseRequestOptions,
        ProductService,
        SupplierService,
        ErrorEventBus,
        OrderService,
        ProductImageEventBus,
        WooCommerceService,
        OrderItemEventBus,
        NotificationService
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }

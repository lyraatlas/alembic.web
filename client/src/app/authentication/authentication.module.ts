import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { AuthenticationRoutes } from './authentication.routing';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { NavbarModule } from '../shared/navbar/navbar.module';
import { FooterModule } from '../shared/footer/footer.module';
import { NavigatorModule } from '../shared/navigator/navigator.module';
import { RegisterComponent } from './register/register.component';
import { UserService } from '../../services';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthenticationRoutes),
        FormsModule,
        NavbarModule,
        NavigatorModule,
        FooterModule,
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
    ]
})

export class AuthenticationModule {}

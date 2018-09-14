import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterModule } from '../shared/footer/footer.module';
import { NavbarModule } from '../shared/navbar/navbar.module';
import { NavigatorModule } from '../shared/navigator/navigator.module';
import { AuthenticationRoutes } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
    imports: [
		CommonModule,
		FontAwesomeModule,
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

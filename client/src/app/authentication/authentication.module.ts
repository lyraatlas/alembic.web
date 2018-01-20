import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { AuthenticationRoutes } from './authentication.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthenticationRoutes),
        FormsModule
    ],
    declarations: [LoginComponent]
})

export class AuthenticationModule {}

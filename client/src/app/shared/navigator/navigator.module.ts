import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavigatorComponent } from './navigator.component';

@NgModule({
    imports: [ RouterModule, CommonModule, FontAwesomeModule ],
    declarations: [ NavigatorComponent ],
    exports: [ NavigatorComponent ]
})

export class NavigatorModule {
   
}

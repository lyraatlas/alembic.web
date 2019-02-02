import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { NavigatorComponent } from './navigator.component';

@NgModule({
	imports: [RouterModule, FormsModule, CommonModule, FontAwesomeModule],
	declarations: [NavigatorComponent, SearchBarComponent],
	exports: [NavigatorComponent, SearchBarComponent]
})

export class NavigatorModule {

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigatorComponent } from './navigator.component';
import { Component, OnInit } from '@angular/core';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ NavigatorComponent ],
    exports: [ NavigatorComponent ]
})

export class NavigatorModule {
   
}

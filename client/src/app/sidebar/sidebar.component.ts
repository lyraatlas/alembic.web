import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';

declare var $:any;
//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
    hasParameters?: boolean;
    parameters?: any;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/dashboard',
        title: 'Dashboard',
        type: 'sub',
        icontype: 'ti-stats-up',
        children: [
            {path: 'overview', title: 'Overview', ab:'Ov'}
        ]
    },{
        path: '/dashboard/products',
        title: 'Products',
        type: 'sub',
        icontype: 'ti-package',
        children: [
            {
                path: 'list', 
                title: 'Product Templates', 
                ab:'PT',
                hasParameters: true,
                parameters: { isTemplate: true }
            },
            {
                path: 'list', 
                title: 'Supplier Products', 
                ab:'SP',
                hasParameters: true,
                parameters: { isTemplate: false }
            }
        ]
    },{
        path: '/dashboard/suppliers',
        title: 'Suppliers',
        type: 'sub',
        icontype: 'ti-user',
        children: [
            {path: 'list', title: 'Suppliers', ab:'S'}
        ]
    },{
        path: '/dashboard/orders',
        title: 'Orders',
        type: 'sub',
        icontype: 'ti-receipt',
        children: [
            {path: 'list', title: 'Orders', ab:'O'}
        ]
    },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: any[];
    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

    ngOnInit() {
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        this.menuItems = ROUTES.filter(menuItem => menuItem);

        isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows){
           // if we are on windows OS we activate the perfectScrollbar function
           $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
           $('html').addClass('perfect-scrollbar-on');
       } else {
           $('html').addClass('perfect-scrollbar-off');
       }
    }
    ngAfterViewInit(){
        var $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();

        var collapseId = $sidebarParent.siblings('a').attr("href");

        $(collapseId).collapse("show");
    }
}

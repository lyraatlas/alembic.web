import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CONST } from '../../../constants';
import { AuthenticationService, SupplierService } from '../../../services';
import { INotification, ISupplier } from '../../../models';
import { NotificationService } from '../../../services/notification.service';
import * as enums from '../../../enumerations';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/zip";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/first";

var misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {

    private listTitles: any[];
    public location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    public notifications: Array<INotification>;
    public email: string;
    public unreadNotifications: boolean = false;

    @ViewChild("navbar-cmp") button;

    constructor(location: Location,
        private router: Router,
        private renderer: Renderer,
        private element: ElementRef,
        private authenticationService: AuthenticationService,
        private notificationService: NotificationService,
        private supplierService: SupplierService,
    ) {

        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    ngOnInit() {
        console.log(`Here's the email for menu: ${JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)).email}`)
        if(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)){
            console.log(`Here's the email for menu: ${JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)).email}`)
            this.email = JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)).email;
        }

        this.getNotifications(true);

        this.listTitles = ROUTES.filter(listTitle => listTitle);

        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            var $btn = $(this);

            if (misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    }

    view(notification: INotification) {
        // Here we need to navigate to the appropriate place based on the notification.
    }

    getNotifications(startPolling: boolean): any {

        let notificationQuery: INotification = {
            isSystem: true,
        };

        this.notificationService.query(notificationQuery).subscribe(notifications => {
            this.notifications = this.setupVirtualsForNotifications(notifications);
        });

        if (startPolling) {
            // Then we setup a polling interval.  Which will make sure we check our notifications at a reasonable time. 5000 => 5 seconds.
            // We're going to poll every minute. 
            Observable.interval(60000).subscribe(poll => {
                this.notificationService.query(notificationQuery).subscribe(notifications => {
                    this.notifications = this.setupVirtualsForNotifications(notifications);
                });
            });
        }
    }

    setupVirtualsForNotifications(notifications: Array<INotification>): Array<INotification> {
        // notifications.forEach(notification => {
        //     // We want to show our unread notification symbol.
        //     if (!notification.isRead) {
        //         this.unreadNotifications = true;
        //     }

        //     switch (+notification.type) {
        //         case enums.NotificationType.OrderAccepted_Core:
        //             Observable.zip(
        //                 this.orderService.get<IOrder>(notification.orderAcceptedNotification.order as string),
        //                 this.supplierService.get<ISupplier>(notification.orderAcceptedNotification.acceptedBy as string)
        //             ).subscribe((value: [IOrder, ISupplier]) => {
        //                 notification['relatedToText'] = `Order Code: ${value[0].code}`;
        //                 notification['action'] = `was accepted`;
        //                 notification['byText'] = `by: ${value[1].name}`;
        //                 notification.isActionCompleted

        //                 notification['class'] = 'label label-success';
        //                 notification['message'] = `Order Code: ${value[0].code} was accepted `;

        //             });
        //             break;
        //         case enums.NotificationType.OrderRejected_Core:
        //             Observable.zip(
        //                 this.orderService.get<IOrder>(notification.orderRejectedNotification.order as string),
        //                 this.supplierService.get<ISupplier>(notification.orderRejectedNotification.rejectedBy as string)
        //             ).subscribe((value: [IOrder, ISupplier]) => {
        //                 notification['relatedToText'] = `Order Code: ${value[0].code}`;
        //                 notification['action'] = `was rejected`;
        //                 notification['byText'] = `by: ${value[1].name}`;

        //                 notification['message'] = `Order Code: ${value[0].code} was rejected by: ${value[1].name}`;
        //                 notification['class'] = 'label label-danger'
        //             });
        //             break;
        //         default:
        //             break;
        //     }
        // });

        return notifications;
    }

    showNotifications() {
        Observable.interval(5000).first((value: number, index: number, source: Observable<number>) => {
            // Here we're going to mark these notifications as read after some period of time. 
            return true;
        }).subscribe(x => {
            if ($('#li-notification-ddl').hasClass('open')) {
                let updates = Array<Observable<INotification>>();
                this.notifications.forEach(notification => {
                    // We're only going to update the ones that are not read.
                    if(!notification.isRead){
                        notification.isRead = true;
                        updates.push(this.notificationService.update(notification, notification._id));
                        console.log('were pushing a notificaiton to be updated, and marked as read.' )
                    }
                });
                // While you might be thinking we can just set the array that's returned here to the value of our array that we're using 'notifications' we can't because this array
                // will only contain notifications that we updated, and not all the notifications.
                if(updates.length > 0){
                    Observable.zip(updates).subscribe((allUpdatedNotifications)=>{
                        this.getNotifications(false);
                    });
                }
            }
            else{

            }
        });
    }

    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    }

    sidebarOpen() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    }

    sidebarClose() {
        var body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }

    sidebarToggle() {
        // var toggleButton = this.toggleButton;
        // var body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible == false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    getPath() {
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }
}

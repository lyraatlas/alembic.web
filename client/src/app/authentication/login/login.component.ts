import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services';
import { AlertService } from '../../../services';
import { AlertType } from '../../../enumerations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IUser } from '../../../models/index';
declare var $: any;
declare const FB:any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    user: IUser;
    loading = false;
    returnUrl: string;
    test: Date = new Date();
    toggleButton;
    sidebarVisible: boolean;
    nativeElement: Node;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private element: ElementRef) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.checkFullPageBackgroundImage();

        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        this.user = {
            email: '',
            password: '',
        }

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }

    login(model: IUser, isValid: boolean) {
        if(isValid){
            console.log(model, isValid);
            this.loading = true;
            this.authenticationService.loginLocal(model.email, model.password)
                .subscribe(
                data => {
                    if(this.returnUrl && this.returnUrl.length > 3){
                        this.router.navigate([this.returnUrl]);
                    }
                    this.router.navigate(['dashboard/home']);
                },
                error => {
                    this.alertService.send({text : error, alertType : AlertType.danger}, false);
                    this.loading = false;
                }); 
        }
    }

    public loginWithFacebook(){
        this.loading = true;
        this.authenticationService.loginFacebook()
            .then((userResponse) =>{
                console.log(`About to navigate the user after facebook login`)
                if(this.returnUrl && this.returnUrl.length > 3){
                    this.router.navigate([this.returnUrl]);
                }
                this.router.navigate(['dashboard/home']);
            })
            .catch((error) =>{
                this.alertService.send({text : error, alertType : AlertType.danger}, false);
                this.loading = false;
            });

        // .subscribe(
        // data => {
        //     if(this.returnUrl && this.returnUrl.length > 3){
        //         this.router.navigate([this.returnUrl]);
        //     }
        //     this.router.navigate(['dashboard/home']);
        // },
        // error => {
        //     this.alertService.send({text : error, notificationType : AlertType.danger}, false);
        //     this.loading = false;
        // }); 
    }

    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };
}
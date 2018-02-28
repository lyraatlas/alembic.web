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
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    user: IUser;
    loading = false;
    returnUrl: string;
    test: Date = new Date();
    toggleButton;
    sidebarVisible: boolean;
    nativeElement: Node;
    public password2: string = '';

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

        this.user = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        }
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
                    this.alertService.send({text : error, notificationType : AlertType.danger}, false);
                    this.loading = false;
                }); 
        }
    }

    registerUser(model: IUser, isValid: boolean) {
        if(isValid){
            console.log(model, isValid);
            this.loading = true;
            this.authenticationService.registerLocal(model)
                .subscribe(
                data => {
                    this.authenticationService.loginLocal(model.email,model.password)
                        .subscribe(response =>{
                            if(this.returnUrl && this.returnUrl.length > 3){
                                this.router.navigate([this.returnUrl]);
                            }
                            this.router.navigate(['dashboard/home']);
                        });
                },
                error => {
                    this.alertService.send({text : error, notificationType : AlertType.danger}, false);
                    this.loading = false;
                }); 
        }
    }

    public isPasswordValid(): boolean{
        if(this.user.password.length === 0 || this.password2.length === 0){
          //this.showWarning = true;
          //this.warningMessage = "You must enter a new password in both fields."
          return false;
        }
    
        // Now first we need to compare the 2 passwords.
        if(this.user.password !== this.password2){
          //this.showWarning = true;
          //this.warningMessage = "The two passwords don't match."
          return false;
        }
    
        // Now first we need to compare the 2 passwords.
        if(this.user.password.length < 6){
          //this.showWarning = true;
          //this.warningMessage = "Password must be 6 characters."
          return false;
        }
        //this.showWarning = false;
        return true;
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
                this.alertService.send({text : error, notificationType : AlertType.danger}, false);
                this.loading = false;
            });
    }
}
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserService } from '../../../services';
import { AlertService } from '../../../services';
import { AlertType, NotificationType } from '../../../enumerations';
import { FormBuilder, FormGroup, Validators, FormControl, Form, NgForm } from '@angular/forms';
import { IUser, ITokenPayload } from '../../../models';
import { CONST } from '../../../constants';
import { ErrorEventBus } from '../../../event-buses';
declare var $: any;
declare const FB: any;

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
    public user: IUser  = {};
    public loading = false;
    public isOath = false;
    public passwordNewValue: string;
    public password2Value: string;
    public existingEmail: string;
    public showPasswordWarning: boolean = false;
    public passwordWarningMessage: string = '';

    @ViewChild('passwordForm') passwordForm: NgForm;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private element: ElementRef,
        private errorEventBus: ErrorEventBus
    ) {
    }

    ngOnInit() {
        // go grab this user.
        const decodedToken: ITokenPayload = JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION))  as ITokenPayload;
        this.userService.get<IUser>(decodedToken.userId).subscribe(user => {
            console.dir(user);
            this.user = user;
            this.existingEmail = user.email;
            this.isOath = user.facebookAuth ? true : false;
        }, error => {
            this.errorEventBus.throw(error);
        });
    }

    updateUserPassword(isValid: boolean){
        if(this.isPasswordValid()){
            this.userService.updateUserPassword(this.user._id, this.user.password,this.passwordNewValue).subscribe((user) => {
                this.user = user;
                this.user.password = '';
                this.passwordNewValue = '';
                this.password2Value = '';
                this.passwordForm.form.markAsPristine();
                this.alertService.send({alertType: AlertType.success,text: "Password Updated Successfully" });
            }, error => {
                this.passwordForm.form.markAsPristine();
                this.errorEventBus.throw(error);
            });
        }
    }

    public isPasswordValid(): boolean{
        if(this.user.password.length === 0 || this.password2Value.length === 0){
          this.showPasswordWarning = true;
          this.passwordWarningMessage = "You must enter a new password in both fields."
          return false;
        }
    
        // Now first we need to compare the 2 passwords.
        if(this.passwordNewValue !== this.password2Value){
          this.showPasswordWarning = true;
          this.passwordWarningMessage = "The two passwords don't match."
          return false;
        }
    
        // Now first we need to compare the 2 passwords.
        if(this.passwordNewValue.length < 6){
          this.showPasswordWarning = true;
          this.passwordWarningMessage = "Password must be 6 characters."
          return false;
        }
        this.showPasswordWarning = false;
        return true;
      }

    saveUser(isValid: boolean) {
        if (isValid) {
            this.userService.update<IUser>(this.user, this.user._id).subscribe((user) => {
                this.user = user;
                this.existingEmail = user.email;
                this.alertService.send({text:"Saved Successfully", alertType: AlertType.success });
            }, error => {
                this.errorEventBus.throw(error);
            });
        }
    }
}
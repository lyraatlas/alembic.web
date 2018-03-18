import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserService } from '../../../services';
import { AlertService } from '../../../services';
import { AlertType } from '../../../enumerations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IUser, ITokenPayload } from '../../../models/index';
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
    public passwordNewValue: string;
    public password2Value: string;
    public currentEmail: string;

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
            this.user = user;
            this.currentEmail = user.email;
        }, error => {
            this.errorEventBus.throw(error);
        });
    }

    saveUser(isValid: boolean) {
        if (isValid) {
            this.userService.update<IUser>(this.user, this.user.id).subscribe((user) => {
                this.user = user;
                this.currentEmail = user.email;
            }, error => {
                this.errorEventBus.throw(error);
            });
        }
    }
}
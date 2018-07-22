import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';
import { CONST } from '../../../constants';
import { AlertType } from '../../../enumerations';
import { ITokenPayload } from '../../../models/token-payload.interface';
import { AlertService } from '../../../services';
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router, private alertService: AlertService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('Hitting can Activate Guard');
        if (localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) {
            let token: ITokenPayload = JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION));

            if(this.isTokenStilValid(token)){
                return true;
            }

            this.alertService.send({text: "Token expired", alertType: AlertType.danger}, true);
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
 
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    public isAdmin(token:ITokenPayload): boolean{
        return token && token.roles && token.roles.indexOf('admin') >= 0;
    }

    public isUser(token:ITokenPayload): boolean{
        return token && token.roles && token.roles.indexOf('user') >= 0;
    }

    public isTokenStilValid(token:ITokenPayload): boolean{
        return moment(token.expiresAt, CONST.MOMENT_DATE_FORMAT).isAfter(moment())
    }
}
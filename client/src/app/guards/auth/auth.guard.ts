import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CONST } from '../../../constants';
import { AlertService } from '../../../services/index';
import { AlertType } from '../../../enumerations';
import { ITokenPayload } from '../../../models/token-payload.interface';
import * as moment from 'moment';
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

            this.alertService.send({text: "Token expired", notificationType: AlertType.danger}, true);
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
 
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
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
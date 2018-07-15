import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AppError } from '../classes/app-error.class';
import { IMessage } from '../classes/message.interface';
import { AlertType } from '../enumerations';

@Injectable()
export class AlertService {
    public messages$ = new Subject<IMessage>();
    private keepAfterNavigationChange = false;
 
    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.messages$.next();
                }
            }
        });
    }
 
    send(message: IMessage, showAfterNavigationChange = false) {
        this.keepAfterNavigationChange = showAfterNavigationChange;
        this.messages$.next(message);
    }

    throw(error: AppError, showAfterNavigationChange = true){
        this.keepAfterNavigationChange = showAfterNavigationChange;
        this.messages$.next({ text: `${error.message} : ${error.description}`, alertType: AlertType.danger});
    }
}
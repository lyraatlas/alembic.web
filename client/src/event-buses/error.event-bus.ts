import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppError } from '../classes/app-error.class';
import { AlertService } from '../services/index';

@Injectable()
export class ErrorEventBus {
    private errorTriggerSource = new Subject<AppError>();
    public errorTrigger$ = this.errorTriggerSource.asObservable();

    constructor(private alertService: AlertService){}

    throw(error: AppError) {
        this.errorTriggerSource.next(error);
        this.alertService.throw(error,true);
        console.log(error);
    }
}
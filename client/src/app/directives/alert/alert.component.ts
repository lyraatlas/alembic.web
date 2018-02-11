import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/';
import { IMessage } from '../../../classes/message.interface';
import { AlertType } from '../../../enumerations';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.scss'],
})

export class AlertComponent {

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.messages$.subscribe(message => {
            if (message) {
                $.notify({
                    icon: this.calculateIcon(message),
                    message: message.text
                }, {
                        type: AlertType[message.notificationType],
                        delay: this.calculateTimerDelay(message),
                        timer: this.calculateTimerDelay(message),
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });
            }
        });
    }

    calculateTimerDelay(message: IMessage): number{
        if (message && message.notificationType) {
            switch (+message.notificationType) {
                case AlertType.danger:
                    return 5000;
                case AlertType.info:
                    return 1000;
                case AlertType.warning:
                    return 5000;
                case AlertType.success:
                    return 1000;
                default:
                    return 1000;
            }
        }
    }

    calculateIcon(message: IMessage) {
        if (message && message.notificationType) {
            switch (+message.notificationType) {
                case AlertType.danger:
                    return "ti-alert";
                case AlertType.info:
                    return "ti-info";
                case AlertType.warning:
                    return "ti-bell";
                case AlertType.success:
                    return "ti-check";
                default:
                    break;
            }
        }
        return '';
    }
}
import { Component } from '@angular/core';
import { IMessage } from '../../../classes/message.interface';
import { AlertType } from '../../../enumerations';
import { AlertService } from '../../../services';

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
                        type: AlertType[message.alertType],
                        delay: this.calculateTimerDelay(message),
                        timer: this.calculateTimerDelay(message),
                        placement: {
                            from: 'top',
                            align: 'center'
                        },
                        z_index: 1500,
                    });
            }
        });
    }

    calculateTimerDelay(message: IMessage): number{
        if (message && message.alertType) {
            switch (+message.alertType) {
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
        if (message && message.alertType) {
            switch (+message.alertType) {
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

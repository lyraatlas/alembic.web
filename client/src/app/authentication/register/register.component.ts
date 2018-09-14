import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AlertType } from '../../../enumerations';
import { IUser } from '../../../models';
import { AlertService, AuthenticationService } from '../../../services';
declare var $: any;
declare const FB: any;

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	public user: IUser;
	public loading = false;
	public returnUrl: string;
	public test: Date = new Date();
	public toggleButton;
	public sidebarVisible: boolean;
	public nativeElement: Node;
	public password2: string = '';
	public showPasswordWarning: boolean = false;
	public passwordWarningMessage: string = '';

	public faUser = faUser;

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
		if (isValid) {
			console.log(model, isValid);
			this.loading = true;
			this.authenticationService.loginLocal(model.email, model.password)
				.subscribe(
					data => {
						if (this.returnUrl && this.returnUrl.length > 3) {
							this.router.navigate([this.returnUrl]);
						}
						this.router.navigate(['dashboard/home']);
					},
					error => {
						this.alertService.send({ text: error, alertType: AlertType.danger }, false);
						this.loading = false;
					});
		}
	}

	registerUser(isValid: boolean) {
		if (isValid && this.isPasswordValid()) {
			this.loading = true;
			this.authenticationService.registerLocal(this.user)
				.subscribe(
					data => {
						this.authenticationService.loginLocal(this.user.email, this.user.password)
							.subscribe(response => {
								if (this.returnUrl && this.returnUrl.length > 3) {
									this.router.navigate([this.returnUrl]);
								}
								this.router.navigate(['dashboard/home']);
							});
					},
					error => {
						this.alertService.send({ text: error, alertType: AlertType.danger }, false);
						this.loading = false;
					});
		}
	}

	public isPasswordValid(): boolean {
		if (this.user.password.length === 0 || this.password2.length === 0) {
			this.showPasswordWarning = true;
			this.passwordWarningMessage = "You must enter a new password in both fields."
			return false;
		}

		// Now first we need to compare the 2 passwords.
		if (this.user.password !== this.password2) {
			this.showPasswordWarning = true;
			this.passwordWarningMessage = "The two passwords don't match."
			return false;
		}

		// Now first we need to compare the 2 passwords.
		if (this.user.password.length < 6) {
			this.showPasswordWarning = true;
			this.passwordWarningMessage = "Password must be 6 characters."
			return false;
		}
		this.showPasswordWarning = false;
		return true;
	}

	public loginWithFacebook() {
		this.loading = true;
		this.authenticationService.loginFacebook()
			.then((userResponse) => {
				console.log(`About to navigate the user after facebook login`)
				if (this.returnUrl && this.returnUrl.length > 3) {
					this.router.navigate([this.returnUrl]);
				}
				this.router.navigate(['dashboard/home']);
			})
			.catch((error) => {
				this.alertService.send({ text: error, alertType: AlertType.danger }, false);
				this.loading = false;
			});
	}
}
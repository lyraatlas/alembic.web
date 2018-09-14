import { Component } from '@angular/core';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
    moduleId: module.id,
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent{
	public faFacebookF = faFacebookF;
	public faInstagram = faInstagram;
	public faTwitter = faTwitter;
    test : Date = new Date();
}

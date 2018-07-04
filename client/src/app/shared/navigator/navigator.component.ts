import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST } from '../../../constants';
import { AuthenticationService } from '../../../services';
declare var $: any;
@Component({
  selector: 'navigator-cmp',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit, AfterViewInit {

  public email: string;
  private mr_nav;
  private mr_fixedAt;
  private mr_navOuterHeight;
  private mr_navScrolled = false;
  private mr_navFixed = false;
  private mr_outOfSight = false;
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) {
      console.log(`Here's the email for menu: ${JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)).email}`)
      this.email = JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)).email;
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    // Mobile Menu

    $('.mobile-toggle').click(function () {
      $('.nav-bar').toggleClass('nav-open');
      $('.mobile-toggle').toggleClass('active');
    });

    $('.menu li').click(function (e) {
      if (!e) e = window.event;
      e.stopPropagation();
      if ($('.menu li').find('ul').length) {
        $('.menu li').toggleClass('toggle-sub');
      } else {
        $('.menu li').parents('.toggle-sub').removeClass('toggle-sub');
      }
    });

    $('.menu li a').click(function () {
      if ($('.menu li a').hasClass('inner-link')) {
        $('.menu li a').closest('.nav-bar').removeClass('nav-open');
      }
    });

    $('.module.widget-handle').click(function () {
      $('.module.widget-handle').toggleClass('toggle-widget-handle');
    });

    window.addEventListener("scroll", this.updateNav, false);
  }

  public updateNav() {

    this.mr_nav = $('.nav-container nav:first') || 0;

    // I'm keeping this at 150 for now.  If the menu is a specific height then there's a scolling bug where it's
    // weird and jittery when the page is just slightly larger than the window.  When there's a very small amount of scrolling to do.
    if (window.pageYOffset <= 150) {
      if (this.mr_navFixed) {
        this.mr_navFixed = false;
        this.mr_nav.removeClass('fixed');
      }
      if (this.mr_outOfSight) {
        this.mr_outOfSight = false;
        this.mr_nav.removeClass('outOfSight');
      }
      if (this.mr_navScrolled) {
        this.mr_navScrolled = false;
        this.mr_nav.removeClass('scrolled');
      }
    }
    else {
      if (!this.mr_navScrolled) {
        this.mr_navScrolled = true;
        this.mr_nav.addClass('scrolled');
      }
      if (!this.mr_navFixed) {
        this.mr_nav.addClass('fixed');
        this.mr_navFixed = true;
      }
      if (!this.mr_outOfSight) {
        this.mr_nav.addClass('outOfSight');
        this.mr_outOfSight = true;
      }
    }
  }
}

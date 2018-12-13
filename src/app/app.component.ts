import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { filter } from 'rxjs/operators';
import { setTheme } from 'ngx-bootstrap/utils';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked{
  navbarOpen = false;
  logged: boolean;
  currentUrl: string;
  baseHref: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public userService: UserService,
    private  platformLocation: PlatformLocation
  ) {
    setTheme('bs4');
  }

  ngOnInit(): void {
    this.baseHref = this.platformLocation.getBaseHrefFromDOM();
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
     .subscribe((event: NavigationEnd) => {
       this.currentUrl = this.router.url;
     });
  }

  ngAfterViewChecked() {
    this.logged = this.userService.logged;
    this.cdRef.detectChanges();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}

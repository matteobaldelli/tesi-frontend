import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked{
  navbarOpen = false;
  logged: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    public userService: UserService,
  ) {
    setTheme('bs4');
  }

  ngAfterViewChecked() {
    this.logged = this.userService.logged;
    this.cdRef.detectChanges();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}

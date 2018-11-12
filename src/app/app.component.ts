import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navbarOpen = false;

  constructor(
    public userService: UserService
  ) {
    setTheme('bs4');
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}

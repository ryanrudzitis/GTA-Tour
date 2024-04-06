import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.signOut();
  }

  closeSidebar(): void {
    const drawer = document.querySelector('#my-drawer-3') as HTMLInputElement;
    console.log(drawer);
    if (drawer) {
      drawer.checked = false;
    }
  }


}

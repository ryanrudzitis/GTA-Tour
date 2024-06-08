import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { Subscription } from 'rxjs';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuOpen = false;
  profilePic: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;

  constructor(
    public authService: AuthService,
    public firebaseService: FirebaseService
  ) {}

  async ngOnInit(): Promise<void> {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      const userId = user?.uid as string;
      const userInfo = await this.firebaseService.getUserInfo(userId);
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.profilePic = userInfo.profilePic;
      console.log('user id', userId);
      // this.profilePic = await this.firebaseService.getProfilePic(userId);
    });
  }

  logout(): void {
    this.authService.signOut();
  }

  closeSidebar(): void {
    const drawer = document.querySelector('#my-drawer-3') as HTMLInputElement;
    if (drawer) {
      drawer.checked = false;
    }
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { FlagService } from '../flag.service';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { getAuth, User } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  firstName: string | null = null;
  lastName: string | null = null;
  email: string | null = null;
  country: string | null = null;
  bio: string | null = null;
  sponsor: string | null = null;
  showEdit = false;
  @ViewChild('info', { static: false }) infoDiv: any;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    public flagService: FlagService
  ) {}

  matches: any[] = [];
  showSpinner = true;

  async ngOnInit(): Promise<void> {
    const auth = getAuth();

    auth.onAuthStateChanged(async (user) => {
      this.authService.currentUser = user;
      await this.getUserData();
      this.matches = await this.firebaseService.getMatchesForUser(
        this.authService.currentUser?.uid as string
      );
      console.log('these are matches in profile', this.matches);
      this.showSpinner = false;
    });
  }

  async getUserData(): Promise<void> {
    const userInfo = await this.firebaseService.getUserInfo(
      this.authService.currentUser?.uid as string
    );
    if (userInfo) {
      this.firstName = userInfo['firstName'];
      this.lastName = userInfo['lastName'];
      this.email = userInfo['email'];
      this.country = userInfo['country'];
      this.bio = userInfo['bio'];
      this.sponsor = userInfo['sponsor'];
    }
  }

  showEditForm(): void {
    console.log('show edit form here');
    console.log('show edit form', this.infoDiv);
  }

  closeEditForm(): void {
    this.showEdit = false;
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
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
  private subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  matches: any[] = [];

  async ngOnInit(): Promise<void> {
    const auth = getAuth();

    auth.onAuthStateChanged(async (user) => {
      this.authService.currentUser = user;
      await this.getUserData();
      this.matches = await this.firebaseService.getMatchesForPlayer(
        this.authService.currentUser?.uid as string
      );
      console.log('these are matches in profile', this.matches);
      
    });
  }

  async getUserData(): Promise<void> {
    const user = this.authService.currentUser;
    const uid = user?.uid;
    const db = getFirestore();
    const userDoc = doc(db, 'users' as string, uid as string);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      const data = docSnap.data();
      this.firstName = data?.['firstName'];
      this.lastName = data?.['lastName'];
    } else {
      console.log('No user data found!');
    }
  }
}

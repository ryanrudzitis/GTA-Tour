import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { FlagService } from '../flag.service';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { getAuth, User } from 'firebase/auth';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  firstName: string | null = null;
  lastName: string | null = null;
  userId: string | null = null;
  playerId: string | null = null;
  profilePic: string | null = null;
  email: string | null = null;
  country: string | null = null;
  bio: string | null = null;
  sponsor: string | null = null;
  showEdit = false;
  matches: any[] = [];
  showSpinner = true;
  showEditSpinner = false;
  countries = this.flagService.getCountries();
  @ViewChild('info', { static: false }) infoDiv: ElementRef | undefined;
  @ViewChild('formDiv', { static: false }) formDiv: ElementRef | undefined;

  profileForm = new FormGroup({
    country: new FormControl('', [Validators.required]),
    bio: new FormControl('Testing', [Validators.required]),
    sponsor: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    public flagService: FlagService,
  ) {}

  async ngOnInit(): Promise<void> {
    const auth = getAuth();

    auth.onAuthStateChanged(async (user) => {
      this.authService.currentUser = user;
      this.userId = user?.uid!;
      await this.getUserData();
      console.log("Profile pic", this.profilePic);
      this.matches = await this.firebaseService.getMatchesForUser(
        this.authService.currentUser?.uid as string
      );
      this.showSpinner = false;
      this.profileForm = new FormGroup({
        country: new FormControl(this.country, [Validators.required]),
        bio: new FormControl(this.bio),
        sponsor: new FormControl(this.sponsor),
      });
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
      this.playerId = userInfo['id'];
      this.profilePic = userInfo['profilePic'];
    }
  }

  showEditForm(): void {
    console.log('show edit form here');
    this.showEdit = true;
  }

  async closeEditForm(): Promise<void> {
    if (!this.profileForm.valid) {
      return;
    }
    console.log('form', this.profileForm.value);
    this.showEditSpinner = true;
    await this.firebaseService
      .updateUserInfo(
        this.authService.currentUser?.uid as string,
        this.profileForm.value
      )
      .then(async () => {
        console.log('user info updated');
        this.showEdit = false;
        this.showEditSpinner = false;
        await this.getUserData();
      })
      .catch((error) => {
        console.log('error updating user info', error);
      });
  }

  async changeProfilePic(): Promise<void> {
    console.log('change profile pic');
  }

  onSubmit(): void {}
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Functions, getFunctions, httpsCallable, httpsCallableFromURL } from "firebase/functions";
import {
  getAuth,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
  UserCredential,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;

  constructor(private router: Router) {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      console.log('User state changed:', user);
      this.currentUser = user;
    });
  }

  async signUp(userData: any): Promise<void> {
    const auth = getAuth();
    const db = getFirestore();
    const { email, password, firstName, lastName, country, accessCode } = userData;

    if (!await this.checkAccessCode(accessCode)) {
      throw Error('Invalid access code');
    } 
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        this.currentUser = userCredential.user;
        console.log('User signed up:', this.currentUser);
        await setDoc(doc(db, 'users', this.currentUser.uid), {
          firstName,
          lastName,
          email,
          country,
          wins: 0,
          losses: 0,
          points: 0,
          role: 'normal',
          bio: '',
          sponsor: '',
        })
          .then(() => {
            this.router.navigate(['/profile']);
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
  }

  async checkAccessCode(accessCode: string): Promise<boolean> {
    const functions = getFunctions();
    const verifyAccessCode = httpsCallable(functions, 'verifyAccessCode');
    return verifyAccessCode({ code: accessCode }).then((result) => {
      return true;
    }).catch((error) => {
      console.error('Error calling function:', error);
      return false;
    });
  }

  async signIn(email: string, password: string): Promise<any> {
    const auth = getAuth();
    return setPersistence(auth, browserLocalPersistence).then(async () => {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          this.currentUser = userCredential.user;
          console.log('User signed in:', this.currentUser);
          this.router.navigate(['/profile']);
          return userCredential;
        })
        .catch((error) => {
          console.error('Error signing in here:', error);
          throw error;
        });
    });
  }

  async signOut(): Promise<void> {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        console.log('User signed out');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;
  // currentUser$: Observable<User | null>;

  constructor(private router: Router) {
    const auth = getAuth();
      auth.onAuthStateChanged((user) => {
        this.currentUser = user;
      });
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    const auth = getAuth();
    const db = getFirestore();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        this.currentUser = userCredential.user;
        console.log('User signed up:', this.currentUser);
        await setDoc(doc(db, 'users', this.currentUser.uid), {
          firstName,
          lastName,
          email,
          wins: 0,
          losses: 0,
          points: 0,
          role: 'normal',
        })
          .then(() => {
            this.router.navigate(['/profile']);
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // Signed in
        this.currentUser = userCredential.user;
        console.log('User signed in:', this.currentUser);
        this.router.navigate(['/profile']);
        return userCredential;
      }
    );
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

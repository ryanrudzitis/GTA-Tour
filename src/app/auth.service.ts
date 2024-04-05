import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;

  constructor( private router: Router) {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      console.log('User state changed', user);
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
        })
          .then(() => {
            console.log('Document successfully written!');
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
}

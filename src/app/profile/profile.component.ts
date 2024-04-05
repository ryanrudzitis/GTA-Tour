import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { doc, getDoc, getFirestore } from '@firebase/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {

    await this.getUserData();
  }

  async getUserData(): Promise<void> {
    const user = this.authService.currentUser;
    const uid = user?.uid;
    const db = getFirestore();
    const userDoc = doc(db, 'users' as string, uid as string);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      console.log('No such document!');
    }


  }
}

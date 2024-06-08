import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrl: './profile-pic.component.css'
})
export class ProfilePicComponent {
  @Input() pic: string | null = null;
  @Input() firstName: string | null = null;
  @Input() lastName: string | null = null;

}

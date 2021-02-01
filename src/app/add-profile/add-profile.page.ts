import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Profile } from '../../models/profile.interface';

// firebase imports
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.page.html',
  styleUrls: ['./add-profile.page.scss'],
})
export class AddProfilePage implements OnInit {

  ID: string;
  user = {} as Profile;
  userRef: AngularFireList<Profile>;

  constructor(
    private afAuth: AngularFireAuth,
    private route: Router,
    public toast: ToastController,
    private db: AngularFireDatabase
  ) { 
    this.afAuth.authState.subscribe((data => {
      this.ID = data.uid;
      this.userRef = this.db.list('/users/');
    }))
  }

  ngOnInit() {
  }

  async makeProfile(user: Profile) {
    try {
      const result = await this.userRef.push({
        displayName: this.user.displayName,
        vaccinated: this.user.vaccinated,
        sick: this.user.sick,
        ID: this.ID 
      }
      );
      if (result) {
          this.route.navigateByUrl('/landing');
      }
    } catch (e) {
      const toastie = await this.toast.create({
        message: 'Fill in all areas with valid responses.',
        duration: 3000
      });
      return await toastie.present();
    }
  }

}

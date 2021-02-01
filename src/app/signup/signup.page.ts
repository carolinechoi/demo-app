import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// firebase imports
import * as firebase from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, LoadingController } from '@ionic/angular';

import { User } from '../../models/user.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    private route: Router,
    public toast: ToastController,
    public loader: LoadingController
  ) { }

  ngOnInit() {
  }

  async signup(user) {
    console.log('starting auth process');
    const loading = await this.loader.create({
      keyboardClose: true,
      spinner: 'dots'
    });
    await loading.present();
    console.log('starting auth');
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
      if (result) {
          loading.dismiss();
          this.route.navigateByUrl('/add-profile');
      }
    } catch (e) {
      loading.dismiss();
      const toastie = await this.toast.create ({
        color: 'primary',
        message: `Let's try again: ` + `${e}`.substr(7),
        duration: 3000
      });
      return await toastie.present();
    }
  }

}

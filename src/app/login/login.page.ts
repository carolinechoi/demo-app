import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// firebase imports
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { ToastController, LoadingController } from '@ionic/angular';

import { User } from '../../models/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    private route: Router,
    public toast: ToastController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  async login(user: User) {
    const loading = await this.loadingController.create({
      keyboardClose: true,
      spinner: 'dots'
    });
    await loading.present();
    console.log('starting auth');
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        loading.dismiss();
        this.route.navigateByUrl('/landing');
      }
    } catch (e) {
      loading.dismiss();
      const toastie = await this.toast.create ({
        message: 'Sorry, try again.',
        duration: 3000
      });
      return await toastie.present();
    }
  }

}

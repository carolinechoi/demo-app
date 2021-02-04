import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase imports
import firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

// Observables
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  displayName: string;
  vaccinated: boolean;
  sick: boolean;
  ID: string;
  current: Array<{displayName: string; vaccinated: boolean; sick: boolean}> = [];
  currentUser: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private route: Router,
    public alert: AlertController,
    public loadingController: LoadingController
  ) { 
    this.enter();
  }

  async enter() {
    const loading = await this.loadingController.create({
      keyboardClose: true,
      spinner: 'dots'
    });
    await loading.present();
    await this.afAuth.authState.subscribe(data => {
      this.currentUser = data.uid;
      console.log(this.currentUser);
      const self = this;
      const userRef = firebase.database().ref('users/');
      const refUser = userRef.orderByChild('ID').equalTo(this.currentUser);
      refUser.once('value').then(function(snap2) {
        snap2.forEach(function (childSnap2) {
          const displayName = childSnap2.child('displayName').val();
          const sick = childSnap2.child('sick').val();
          const vaccinated = childSnap2.child('vaccinated').val();
          self.current.push({
            displayName: displayName,
            sick: sick,
            vaccinated: vaccinated
          });
        });
      });
    });
    await loading.dismiss();
  }

  ngOnInit() {
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
//import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  lamp1: boolean = true;
  lamp2: boolean = false;

  constructor(private afAuth: AngularFireAuth, private toast: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: `Welcome to IoT App, ${data.email}`,
          duration: 3000
        }).present();
      }
      else {
        this.toast.create({
          message: `Could not find authentication details.`,
          duration: 3000
        }).present();
    
        this.navCtrl.popToRoot();
      }
    })
  }

  logout() {
    console.log('1');
    this.afAuth.auth.signOut()
    .then(() => {
      this.navCtrl.popToRoot();
    
    });
    
    
    
  }
}

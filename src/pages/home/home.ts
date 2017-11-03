import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Client, connect, MqttClient } from 'mqtt';
import { MQTTService } from '../../core/mqtt.service'
import { LoggerService } from '../../core/logger.service';
//import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  lamp1: boolean = true;
  lamp2: boolean = false;

  public isConnected: boolean = false;

  public sensor: any = {};
  public esp8266: any = {};

  public relay: any = {};

  constructor(private afAuth: AngularFireAuth, private toast: ToastController,
    public navCtrl: NavController, public navParams: NavParams, public mqtt: MQTTService,
    public logger: LoggerService, public platform: Platform) {

    this.platform.pause.subscribe(() => {

      this.logger.log(`Receive event: pause`);
      this.mqtt.disconnect();
    });

    this.platform.resume.subscribe(() => {

      this.logger.log(`Receive event: resume`);
      this.mqtt.connect();
    });

    this.connect();
  }

  UpdateLampOne(lamponeStatus: boolean) {
    if (lamponeStatus) {
      this.mqtt.publish('LampOne', "On");
    }
    else {
      this.mqtt.publish('LampOne', "Off");
    }
  }

  UpdateLampTwo(lamptwoStatus: boolean) {
    if (lamptwoStatus) {
      this.mqtt.publish('LampTwo', "On");
    }
    else {
      this.mqtt.publish('LampTwo', "Off");
    }
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

  connect() {

    this.mqtt.connect(err => {
      if (err) return;

      this.logger.log(`connect: MQTT connected`);

      this.isConnected = true;

      this.mqtt.subscribe('Lamp1', (topic: string, SwitchStatus: string) => {
        this.logger.log(`Lamp1 Status: ` + SwitchStatus);
        if (SwitchStatus === "On") {
          this.lamp1 = true;
        }
        else {
          this.lamp1 = false;
        }
      });

      this.mqtt.subscribe('Lamp2', (topic: string, SwitchStatus: string) => {
        this.logger.log(`Lamp2 Status: ` + SwitchStatus);
        if (SwitchStatus === "On") {
          this.lamp2 = true;
        }
        else {
          this.lamp2 = false;
        }
      });
    });
  }

  disconnect() {

    this.mqtt.disconnect(err => {
      if (err) return;

      this.logger.log(`disconnect: MQTT disconnect`);

      this.isConnected = false;
    });
  }
}

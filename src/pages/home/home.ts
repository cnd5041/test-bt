import { Component } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public unpairedDevices: any;
  public pairedDevices: any;
  public gettingDevices: boolean;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
  }

  ionViewDidLoad() {
    console.log('Home Page Loaded');

    this.platform.ready().then(() => {

      this.bluetoothSerial.enable();

      this.bluetoothSerial.isEnabled().then(value => {
        console.log('isEnabled', value);
      }, (err) => {
        console.log('isEnabled error', err);
      });

      this.bluetoothSerial.available().then(value => {
        console.log('available', value);
      }, (err) => {
        console.log('available error', err);
      });

      // this.bluetoothSerial.setDeviceDiscoveredListener()
      //   .subscribe((device) => {
      //     console.log('setDeviceDiscoveredListener', device);
      //   }, (err) => {
      //     console.log('setDeviceDiscoveredListener error', err);
      //   });

    });

  }


  startScanning() {
    console.log('start scanning...');
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;

    // this.bluetoothSerial.setDeviceDiscoveredListener()
    //   .subscribe((device) => {
    //     console.log('setDeviceDiscoveredListener', device);
    //   }, (err) => {
    //     console.log('setDeviceDiscoveredListener error', err);
    //   });

    this.bluetoothSerial.discoverUnpaired().then((success) => {
      console.log('discoverUnpaired success', success);

      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {
        console.log('paired element', element);
      });
    }, (err) => {
      console.log('discoverUnpaired error', err);
      this.gettingDevices = false;
    })

    this.bluetoothSerial.list().then((success) => {
      console.log('bluetoothSerial.list', success);
      this.pairedDevices = success;
    }, (err) => {
      console.log('bluetoothSerial.list error', err);
    })
  }

  success = (data) => alert(data);
  fail = (error) => alert(error);

  selectDevice(address: any) {

    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();

  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alert.present();
  }


}

import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";

@Injectable()
export class ErrorService {
  constructor(private toastCtrl: ToastController) {}

  public handleError(error: Error) {
    let toast = this.toastCtrl.create({
      message: error.message,
      duration: 6000,
      position: 'bottom',
      showCloseButton: true
    });
    toast.present();
    console.warn(error.message);
  }
}

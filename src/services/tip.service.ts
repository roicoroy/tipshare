import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {TipLog} from "../models/tiplog.model";

@Injectable()
export class TipService {

  constructor(public storage: Storage) {}

  public get() {
    return this.storage.get('tips');
  }

  public save(tips: Array<TipLog>) {
    this.storage.set('tips', tips);
  }

}

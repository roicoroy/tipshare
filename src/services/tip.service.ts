import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {TipLog} from "../models/tiplog.model";
import {classToPlain} from "class-transformer";

@Injectable()
export class TipService {

  constructor(public storage: Storage) {}

  public get() {
    return this.storage.get('tips');
  }

  public save(tipLog: Array<TipLog>) {
    this.storage.set('tips', classToPlain(tipLog));
  }

}

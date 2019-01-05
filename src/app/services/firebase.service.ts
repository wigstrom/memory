import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList
} from "@angular/fire/database";
import { Observable } from "rxjs";
import { Connection } from "../interfaces/connection";
import { TopList } from "../interfaces/top-list";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  public connection$: Observable<Connection>;
  public topList$: AngularFireList<TopList>;
  public company$: any;

  constructor(private af: AngularFireDatabase) {
    this.connection$ = this.af.object<Connection>("connected").valueChanges();
    this.topList$ = this.af.list<TopList>("highscores");
    this.company$ = this.af.object("company");
  }

  saveName(name) {
    console.log(name);
    this.company$.set(name);
  }

  editName(name) {
    console.log(name);
    this.company$.update(name);
  }

  pushHighScore(highscore: TopList) {
    this.topList$.push(highscore);
  }
}

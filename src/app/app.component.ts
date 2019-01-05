import { Component, OnInit } from "@angular/core";
import { Monkey } from "./interfaces/monkey";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { take } from "rxjs/operators";
import { FirebaseService } from "./services/firebase.service";
import { Connection } from "./interfaces/connection";
import { TopList } from "./interfaces/top-list";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  public monkeys: Monkey[] = [];
  public clickCount = 0;
  public twoOpen = 0;
  public startTime: number;
  public totalTime: number;

  private comparisonActive = false;

  private firstSelect: Monkey;
  private secondSelect: Monkey;

  public menu = true;
  public gameWon = false;
  public gameOverString = "Ett klick ifrån nytt rekord!";

  public preHighscore: number;

  public company$: any;
  public highscores$: any;

  constructor(public afService: FirebaseService) {
    this.company$ = this.afService.company$.valueChanges();
    this.highscores$ = this.afService.topList$.valueChanges();
    this.highscores$ = this.afService.topList$.valueChanges().subscribe(
      next => console.log(next),
      err => console.error(err),
      () => console.log("complete"),
    );
  }

  ngOnInit(): void {
    const m1 = this.addDogs();
    const m2 = this.addDogs();
    this.monkeys = this.monkeys.concat(m1, m2);
    this.monkeys = this.shuffle(this.monkeys);

    const hs = localStorage.getItem("highscoreHard");
    if (hs === null) this.preHighscore = null;
    else this.preHighscore = parseInt(hs, 10);
  }

  saveName(comp) {
    this.afService.saveName(comp);
  }

  pushHighscore() {
    const score: TopList = {
      date: new Date(),
      name: "Simon",
      score: this.clickCount
    };
    this.afService.pushHighScore(score);
  }

  editName(comp) {
    this.afService.saveName(comp);
  }

  cardClick(card: Monkey): void {
    if (!card.matched && !card.isFlipped && !this.comparisonActive) {
      card.isFlipped = !card.isFlipped;
    } else {
      return;
    }
    this.clickCount++;
    this.twoOpen++;
    if (this.twoOpen === 1) this.firstSelect = card;
    if (this.twoOpen === 2) {
      this.comparisonActive = true;
      this.secondSelect = card;
      if (this.checkMatch()) {
        this.firstSelect.matched = true;
        this.secondSelect.matched = true;
      }
      if (this.hasWon()) {
        this.win();
      }
    }

    if (this.twoOpen > 1) {
      this.twoOpen = 0;
      setTimeout(() => this.closeAllCards(), 1000);
    }
  }

  private checkMatch(): boolean {
    if (this.firstSelect.monkeyId === this.secondSelect.monkeyId) return true;
    return false;
  }

  private hasWon(): boolean {
    let win = true;
    this.monkeys.forEach(m => {
      if (!m.matched) win = false;
    });
    return win;
  }

  private win(): void {
    const endTime = Math.round(new Date().getTime() / 1000);
    this.totalTime = endTime - this.startTime;
    console.log("Score: " + (this.totalTime + this.clickCount));
    console.log(
      "Poäng: " + Math.round((50 * 100) / this.totalTime + this.clickCount)
    );
    this.gameWon = true;
    this.menu = true;
    if (this.preHighscore !== null) {
      if (this.clickCount < this.preHighscore) {
        localStorage.setItem("highscoreHard", this.clickCount.toString());
        this.gameOverString = "Nytt highscore!";
        this.preHighscore = this.clickCount;
        return;
      }
      if (this.clickCount === this.preHighscore) {
        this.gameOverString = "Ett klick ifrån nytt rekord!";
        return;
      }
      if (this.clickCount > this.preHighscore) {
        this.gameOverString = "Övning ger färdighet, eller?";
        return;
      }
    }
    localStorage.setItem("highscoreHard", this.clickCount.toString());
    this.preHighscore = this.clickCount;
    this.gameOverString = "Bra grejer, nytt highscore sparat";
    this.pushHighscore();
  }

  public startGame() {
    this.startTime = Math.round(new Date().getTime() / 1000);
    this.totalTime = 0;
    this.clickCount = 0;
    this.menu = false;
  }

  public secondsToMin(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    let seconds = totalSeconds - hours * 3600 - minutes * 60;

    // round seconds
    seconds = Math.round(seconds * 100) / 100;

    let result = hours < 10 ? "0" + hours : hours;
    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
  }

  private closeAllCards() {
    this.comparisonActive = false;
    this.monkeys.map(m => {
      if (!m.matched) {
        m.isFlipped = false;
        return m;
      }
    });
  }

  public restart() {
    this.closeAllCards();
    this.startTime = Math.round(new Date().getTime() / 1000);
    this.totalTime = 0;
    this.clickCount = 0;
    this.firstSelect = undefined;
    this.secondSelect = undefined;
    this.monkeys = [];
    this.ngOnInit();
    this.menu = false;
  }

  public shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  private addMonkeys(): Monkey[] {
    const monkeys: Monkey[] = [];

    monkeys.push({
      monkeyId: 1,
      monkeyImageSource: "assets/monkey1.jpeg",
      isFlipped: false,
      matched: false
    });
    monkeys.push({
      monkeyId: 2,
      monkeyImageSource: "assets/monkey2.jpeg",
      isFlipped: false,
      matched: false
    });
    // monkeys.push({
    //   monkeyId: 3,
    //   monkeyImageSource: "assets/monkey3.jpeg",
    //   isFlipped: false,
    //   matched: false
    // });
    // monkeys.push({
    //   monkeyId: 4,
    //   monkeyImageSource: "assets/monkey4.jpeg",
    //   isFlipped: false,
    //   matched: false
    // });
    // monkeys.push({
    //   monkeyId: 5,
    //   monkeyImageSource: "assets/monkey5.jpeg",
    //   isFlipped: false,
    //   matched: false
    // });
    // monkeys.push({
    //   monkeyId: 6,
    //   monkeyImageSource: "assets/monkey6.jpeg",
    //   isFlipped: false,
    //   matched: false
    // });

    return monkeys;
  }

  private addDogs(): Monkey[] {
    const monkeys: Monkey[] = [];

    monkeys.push({
      monkeyId: 1,
      monkeyImageSource: "assets/hund1.jpg",
      isFlipped: false,
      matched: false
    });
    monkeys.push({
      monkeyId: 2,
      monkeyImageSource: "assets/hund2.jpg",
      isFlipped: false,
      matched: false
    });
    monkeys.push({
      monkeyId: 3,
      monkeyImageSource: "assets/hund3.jpg",
      isFlipped: false,
      matched: false
    });
    monkeys.push({
      monkeyId: 4,
      monkeyImageSource: "assets/hund4.jpg",
      isFlipped: false,
      matched: false
    });
    monkeys.push({
      monkeyId: 5,
      monkeyImageSource: "assets/hund5.jpg",
      isFlipped: false,
      matched: false
    });
    // monkeys.push({
    //   monkeyId: 6,
    //   monkeyImageSource: "assets/hund6.jpg",
    //   isFlipped: false,
    //   matched: false
    // });
    // monkeys.push({
    //   monkeyId: 7,
    //   monkeyImageSource: "assets/monkey1.jpeg",
    //   isFlipped: false,
    //   matched: false
    // });
    // monkeys.push({
    //   monkeyId: 8,
    //   monkeyImageSource: "assets/monkey2.jpeg",
    //   isFlipped: false,
    //   matched: false
    // });
    // monkeys.push({
    //   monkeyId: 9,
    //   monkeyImageSource: "assets/monkey3.jpeg",
    //   isFlipped: false,
    //   matched: false
    // });

    return monkeys;
  }
}

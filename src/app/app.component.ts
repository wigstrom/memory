import { Component, OnInit } from "@angular/core";
import { Monkey } from "./interfaces/monkey";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  public monkeys: Monkey[] = [];
  public clickCount = 0;
  public twoOpen = 0;

  private comparisonActive = false;

  private firstSelect: Monkey;
  private secondSelect: Monkey;

  public menu = true;
  public gameWon = false;
  public gameOverString = "Ett klick ifrån nytt rekord!";

  public preHighscore: number;

  ngOnInit(): void {
    const m1 = this.addDogs();
    const m2 = this.addDogs();
    this.monkeys = this.monkeys.concat(m1, m2);
    this.monkeys = this.shuffle(this.monkeys);

    const hs = localStorage.getItem("highscore");
    if (hs === null) this.preHighscore = null;
    else this.preHighscore = parseInt(hs, 10);
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
    this.gameWon = true;
    this.menu = true;
    if (this.preHighscore !== null) {
      if (this.clickCount < this.preHighscore) {
        localStorage.setItem("highscore", this.clickCount.toString());
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
    localStorage.setItem("highscore", this.clickCount.toString());
    this.preHighscore = this.clickCount;
    this.gameOverString = "Bra grejer, nytt highscore sparat";
  }

  public startGame() {
    this.menu = false;
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
    monkeys.push({
      monkeyId: 6,
      monkeyImageSource: "assets/hund6.jpg",
      isFlipped: false,
      matched: false
    });

    return monkeys;
  }
}

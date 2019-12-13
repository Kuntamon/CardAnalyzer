var fs = require("fs");

const SUITS = ["♥", "♦", "♣", "♠"];
const FACES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "j",
  "q",
  "k",
  "a"
];


class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}

class Hand {
  constructor(deck) {
    this.cards = [];
    while (this.cards.length < 5) {
      this.cards.push(deck.pop());
    }
  }

  show() {
    return Array.from(this.cards.map(card => `${card.value}${card.suit}`)).join(" ");
  }

  analyze() {
    let cards = this.show()
      .split(" ")
      .filter(x => x !== "joker");
    let jokers = this.show().split(" ").length - cards.length;

    let faces = cards.map(card => FACES.indexOf(card.slice(0, -1)));
    let suits = cards.map(card => SUITS.indexOf(card.slice(-1)));

    if (
      cards.some((card, i, self) => i !== self.indexOf(card)) ||
      faces.some(face => face === -1) ||
      suits.some(suit => suit === -1)
    )
      return "invalid";

    let flush = suits.every(suit => suit === suits[0]);
    let groups = FACES.map((_, i) => faces.filter(j => i === j).length).sort(
      (x, y) => y - x
    );
    let shifted = faces.map(x => (x + 1) % 13);
    let distance = Math.min(
      Math.max(...faces) - Math.min(...faces),
      Math.max(...shifted) - Math.min(...shifted)
    );
    let straight = groups[0] === 1 && distance < 5;
    groups[0] += jokers;

    if (groups[0] === 5) return "five-of-a-kind";
    else if (straight && flush) return "straight-flush";
    else if (groups[0] === 4) return "four-of-a-kind";
    else if (groups[0] === 3 && groups[1] === 2) return "full-house";
    else if (flush) return "flush";
    else if (straight) return "straight";
    else if (groups[0] === 3) return "three-of-a-kind";
    else if (groups[0] === 2 && groups[1] === 2) return "two-pair";
    else if (groups[0] === 2) return "one-pair";
    else return "high-card";
  }
}

class Deck {
  constructor() {
    this.deck = [];
  }

  createDeck(suits, values) {
    for (let suit of suits) {
      for (let value of values) {
        this.deck.push(new Card(suit, value));
      }
    }
    return this.deck;
  }

  // fischer-nates shuffle
  shuffle() {
    let counter = this.deck.length,temp,i;

    while (counter) {
      i = Math.floor(Math.random() * counter--);
      temp = this.deck[counter];
      this.deck[counter] = this.deck[i];
      this.deck[i] = temp;
    }
    return this.deck;
  }
  deal() {
    let hand0 = new Hand(this.deck);
    let hand1 = new Hand(this.deck);
    let hand2 = new Hand(this.deck);

    return { hand0, hand1, hand2 };
  }
}

function runTable() {
  let deck = new Deck();
  deck.createDeck(SUITS, FACES);
  deck.shuffle();
  const hands = deck.deal();

  let data = `Cards: ${hands.hand0.show()} ${hands.hand0.analyze()}\n\n`;
  data = data + `Cards: ${hands.hand1.show()} ${hands.hand1.analyze()}\n\n`;
  data = data + `Cards: ${hands.hand2.show()} ${hands.hand2.analyze()}`;

  fs.writeFileSync("analysis.txt", data);
}

runTable();


import { Component } from '@angular/core';
import {NetworkService} from "../../../../services/network.service";
import {Subscription} from "rxjs";
import {NetworkIndicatorComponent} from "../../indicators/network-indicator/network-indicator.component";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {NgClass, NgForOf, NgIf} from "@angular/common";

interface Card {
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-network-lost',
  standalone: true,
  imports: [
    NetworkIndicatorComponent,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './network-lost.component.html',
  styleUrl: './network-lost.component.css'
})
export class NetworkLostComponent {
  isOnline$ = NetworkService.getConnectionStatus();
  private subscription: Subscription = new Subscription();
  cards: Card[] = [];
  selectedCards: Card[] = [];
  gameWon: boolean = false;

  private symbols = ['A', 'A', '1', '1', '#', '#', '@', '@']; // Пары символов для пароля

  constructor() {}

  ngOnInit(): void {
    this.subscription.add(
        this.isOnline$.subscribe(status => {
          console.log('NetworkLostComponent: Network status:', status ? 'Online' : 'Offline');
        })
    );
    this.resetGame();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resetGame(): void {
    this.gameWon = false;
    this.selectedCards = [];
    this.cards = this.symbols
        .map(symbol => ({ symbol, isFlipped: false, isMatched: false }))
        .sort(() => Math.random() - 0.5); // Перемешиваем
  }

  flipCard(card: Card): void {
    if (this.selectedCards.length >= 2 || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch(): void {
    const [card1, card2] = this.selectedCards;
    if (card1.symbol === card2.symbol) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.selectedCards = [];
      this.checkWin();
    } else {
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.selectedCards = [];
      }, 1000);
    }
  }

  checkWin(): void {
    if (this.cards.every(card => card.isMatched)) {
      this.gameWon = true;
    }
  }

  protected readonly ThemeColors = ThemeColors;
}

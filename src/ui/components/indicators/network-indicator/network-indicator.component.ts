import { Component } from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {NetworkService} from "../../../../services/network.service";
import {AsyncPipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-network-indicator',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe
  ],
  templateUrl: './network-indicator.component.html',
  styleUrl: './network-indicator.component.css'
})
export class NetworkIndicatorComponent {
  isOnline$ = NetworkService.getConnectionStatus();
  isOnline: boolean = navigator.onLine; // Начальное значение
  private subscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    NetworkService.initialize();
    this.subscription.add(
        this.isOnline$.subscribe(status => {
          this.isOnline = status;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    NetworkService.destroy();
  }

  getTooltip(): string {
    return this.isOnline ? 'Подключено' : 'Нет соединения';
  }
}

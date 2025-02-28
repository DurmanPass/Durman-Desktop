import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {StartPageComponent} from "../ui/pages/start-page/start-page.component";
import {WindowService} from "../services/window.service";
import {WINDOWS_LABELS} from "../shared/enums/windows-labels.enum";
import {PasswordGeneratePageComponent} from "../ui/pages/password-generate-page/password-generate-page.component";
import {VaultPageComponent} from "../ui/pages/vault-page/vault-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [CommonModule, RouterOutlet, StartPageComponent, PasswordGeneratePageComponent, VaultPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  windowLabel: string = '';
  async ngOnInit(): Promise<void> {
    this.windowLabel = await WindowService.getWindowLabel();
  }

  protected readonly WINDOWS_LABELS = WINDOWS_LABELS;
}

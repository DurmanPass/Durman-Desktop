import { Component } from '@angular/core';
import {VersionService} from "../../../../services/version/version.service";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {AsyncPipe, NgIf} from "@angular/common";
import {UpdateStatus} from "../../../../interfaces/data/update/update-status.interface";
import {UpdateService} from "../../../../services/version/update.service";

@Component({
  selector: 'app-app-version',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './app-version.component.html',
  styleUrl: './app-version.component.css'
})
export class AppVersionComponent {
  version$ = this.versionService.getAppVersion();
  updateStatus: UpdateStatus | null = null;
  isChecking = false;
  constructor(private versionService: VersionService, private updateService: UpdateService) {}

  ngOnInit(): void {
    this.version$.subscribe(version => {
      console.log('AppVersionComponent: Current version:', version);
    });
    this.checkForUpdates();
  }

  checkForUpdates(): void {
    this.isChecking = true;
    this.updateService.checkForUpdates().subscribe(status => {
      this.updateStatus = status;
      this.isChecking = false;
      if (status.available) {
        console.log(`Update available: v${status.version}`);
      }
    });
  }

  installUpdate(): void {
    if (this.updateStatus?.available) {
      this.isChecking = true;
      this.updateService.installUpdate().subscribe(success => {
        this.isChecking = false;
        if (success) {
          console.log('Update installed successfully');
        }
      });
    }
  }

  protected readonly ThemeColors = ThemeColors;
}

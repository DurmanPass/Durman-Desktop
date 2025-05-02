import { Component } from '@angular/core';
import {VersionService} from "../../../../services/version/version.service";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {UpdateStatus} from "../../../../interfaces/data/update/update-status.interface";
import {UpdateService} from "../../../../services/version/update.service";
import {CategoryModalComponent} from "../../modals/category-modal/category-modal.component";
import {ModalBaseComponent} from "../../modals/modal-base/modal-base.component";
import {VersionModalComponent} from "../../modals/version-modal/version-modal.component";

@Component({
  selector: 'app-app-version',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgClass,
    CategoryModalComponent,
    ModalBaseComponent,
    VersionModalComponent
  ],
  templateUrl: './app-version.component.html',
  styleUrl: './app-version.component.css'
})
export class AppVersionComponent {
  version$ = this.versionService.getAppVersion();
  updateStatus: UpdateStatus | null = null;
  isChecking = false;
  isMajorOrMinorUpdate = false;

  modalsControls = {
    versionModal: {
      isModalOpen: false
    }
  }

  constructor(
      private versionService: VersionService,
      private updateService: UpdateService
  ) {}

  ngOnInit(): void {
    this.version$.subscribe(version => {
      console.log('AppVersionComponent: Current version:', version);
    });
    this.checkForUpdates();
  }

  checkForUpdates(): void {
    this.isChecking = true;
    this.updateService.checkForUpdates().subscribe({
      next: (status) => {
        this.updateStatus = status;
        this.isChecking = false;
        if (status.available) {
          console.log(`Update available: v${status.version}`);
          this.version$.subscribe(currentVersion => {
            this.isMajorOrMinorUpdate = this.compareVersions(currentVersion, status.version);
            if (this.isMajorOrMinorUpdate) {
              this.openVersionModal();
            }
          });
        }
      },
      error: (error) => {
        console.error('Failed to check for updates:', error);
        this.isChecking = false;
      }
    });
  }

  compareVersions(currentVersion: string, newVersion: string): boolean {
    const currentParts = currentVersion.split('.').map(Number);
    const newParts = newVersion.split('.').map(Number);

    // Проверяем мажорную или минорную версию
    if (currentParts[0] < newParts[0] || currentParts[1] < newParts[1]) {
      return true; // Мажорное или минорное обновление
    }
    return false; // Патч-обновление
  }

  openVersionModal() {
    this.modalsControls.versionModal.isModalOpen = true;
  }

  closeVersionModal(){
    if (!this.isMajorOrMinorUpdate) {
      this.modalsControls.versionModal.isModalOpen = false;
    }
  }

  protected readonly ThemeColors = ThemeColors;
}

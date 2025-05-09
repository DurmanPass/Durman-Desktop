import {Component, Input, Output} from '@angular/core';
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {SidebarTabs} from "../../../shared/const/components/sidebar/sidebar.tabs";
import {SidebarTab} from "../../../interfaces/components/sidebar/sidebarTabs.interface";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {ModalBaseComponent} from "../../components/modals/modal-base/modal-base.component";
import {
    PasswordDetailsModalComponent
} from "../../components/modals/password-details-modal/password-details-modal.component";
import {HelpModalComponent} from "../../components/modals/help-modal/help-modal.component";
import {StoreService} from "../../../services/vault/store.service";
import {StoreKeys} from "../../../shared/const/vault/store.keys";
import {ToastService} from "../../../services/notification/toast.service";
import {PasswordService} from "../../../services/routes/password/password.service";
import {PasswordManagerService} from "../../../services/password/password-manager.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NetworkIndicatorComponent} from "../../components/indicators/network-indicator/network-indicator.component";
import {AppVersionComponent} from "../../components/version/app-version/app-version.component";
import {ProfileService} from "../../../services/routes/profile/profile.service";
import {ProfileLocalService} from "../../../services/profile/profile-local.service";
import {SettingsService} from "../../../services/routes/settings/settings.service";
import {SettingsLocalService} from "../../../services/settings/app-settings.service";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {WindowService} from "../../../services/window.service";

@Component({
  selector: 'app-vault-page',
  standalone: true,
    imports: [
        NgIf,
        NgComponentOutlet,
        NgForOf,
        HeaderDescriptionComponent,
        ModalBaseComponent,
        PasswordDetailsModalComponent,
        HelpModalComponent,
        NetworkIndicatorComponent,
        AppVersionComponent,
        HttpClientModule,
        SolidButtonComponent
    ],
  templateUrl: './vault-page.component.html',
  styleUrl: './vault-page.component.css'
})
export class VaultPageComponent {
  isSidebarClosed = false;

  tabs = SidebarTabs;
  selectedTab: SidebarTab | null = this.tabs[0]; // По умолчанию первый таб

    modalsControls = {
        help: {
            isModalOpen: false
        }
    }

    constructor(private http: HttpClient) {
    }

    private profileService = new ProfileService(this.http);
    private profileLocalService = new ProfileLocalService(this.profileService);

    protected settingsService = new SettingsService(this.http);
    protected settingsLocalService = new SettingsLocalService(this.settingsService);

    closeHelpModal(){
        this.modalsControls.help.isModalOpen = false;
    }


    openHelpModal(){
        this.modalsControls.help.isModalOpen = true;
    }
  selectTab(tab: SidebarTab) {
    this.selectedTab = tab;
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

    async ngOnInit() {
        await this.profileLocalService.syncProfile();
        await this.settingsLocalService.syncSettings();
        deleteOverflowWindow();
    }


  protected readonly ThemeColors = ThemeColors;
    protected readonly WindowService = WindowService;
}

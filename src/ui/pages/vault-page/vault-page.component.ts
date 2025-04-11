import { Component } from '@angular/core';
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
        HelpModalComponent
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
        deleteOverflowWindow();
        // const userId = await StoreService.get(StoreKeys.USER_ID);
        // ToastService.success(userId?.toString());
        // console.log('User ID:', userId);
    }


  protected readonly ThemeColors = ThemeColors;
}

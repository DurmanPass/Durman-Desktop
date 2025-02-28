import { Component } from '@angular/core';
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {SidebarTabs} from "../../../shared/const/components/sidebar/sidebar.tabs";
import {SidebarTab} from "../../../interfaces/components/sidebar/sidebarTabs.interface";

@Component({
  selector: 'app-vault-page',
  standalone: true,
  imports: [
    NgIf,
    NgComponentOutlet,
    NgForOf
  ],
  templateUrl: './vault-page.component.html',
  styleUrl: './vault-page.component.css'
})
export class VaultPageComponent {
  isSidebarClosed = false;

  tabs = SidebarTabs;
  selectedTab: SidebarTab | null = this.tabs[0]; // По умолчанию первый таб

  selectTab(tab: SidebarTab) {
    this.selectedTab = tab;
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  ngOnInit(){
    deleteOverflowWindow();
  }


  protected readonly ThemeColors = ThemeColors;
}

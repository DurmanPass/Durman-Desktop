import {SidebarTab} from "../../../../interfaces/components/sidebar/sidebarTabs.interface";
import {
    HomeTabContentComponent
} from "../../../../ui/pages/vault-page/tabs-content/home-tab-content/home-tab-content.component";
import {
    PasswordTabContentComponent
} from "../../../../ui/pages/vault-page/tabs-content/password-tab-content/password-tab-content.component";
import {
    SettingsTabContentComponent
} from "../../../../ui/pages/vault-page/tabs-content/settings-tab-content/settings-tab-content.component";
import {
    AccountTabContentComponent
} from "../../../../ui/pages/vault-page/tabs-content/account-tab-content/account-tab-content.component";

export const SidebarTabs: SidebarTab[] = [
    { id: "tab1", title: "Главная", content: HomeTabContentComponent },
    { id: "tab2", title: "Пароли", content: PasswordTabContentComponent },
    { id: "tab3", title: "Настройки", content: SettingsTabContentComponent },
    { id: "tab4", title: "Аккаунт", content: AccountTabContentComponent },
];
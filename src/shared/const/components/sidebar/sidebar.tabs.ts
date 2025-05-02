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
import {
    ReportsTabContentComponent
} from "../../../../ui/pages/vault-page/tabs-content/reports-tab-content/reports-tab-content.component";
import {
    ImportTabContentComponent
} from "../../../../ui/pages/vault-page/tabs-content/import-tab-content/import-tab-content.component";

export const SidebarTabs: SidebarTab[] = [
    { id: "home", title: "Главная", content: HomeTabContentComponent },
    { id: "password", title: "Пароли", content: PasswordTabContentComponent },
    { id: "report", title: "Отчёты", content: ReportsTabContentComponent },
    { id: "import", title: "Импорт", content: ImportTabContentComponent },
    { id: "settings", title: "Настройки", content: SettingsTabContentComponent },
    { id: "account", title: "Аккаунт", content: AccountTabContentComponent },
];
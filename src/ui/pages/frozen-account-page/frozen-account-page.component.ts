import {Component, EventEmitter, Output} from '@angular/core';
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {NgIf} from "@angular/common";
import {ValidateService} from "../../../services/validate.service";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {WindowService} from "../../../services/window.service";

@Component({
  selector: 'app-frozen-account-page',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    SolidButtonComponent,
    InputComponent,
    NgIf
  ],
  templateUrl: './frozen-account-page.component.html',
  styleUrl: './frozen-account-page.component.css'
})
export class FrozenAccountPageComponent {
  @Output() unlock = new EventEmitter<string>();
  masterPassword: string = '';
  isValidMasterPassword: boolean = false;

  ngOnInit(){
    deleteOverflowWindow();
  }

  onUnlock(): void {
    this.unlock.emit(this.masterPassword);
  }

  onMasterPasswordChange(password: string){
    this.masterPassword = password;
    if(ValidateService.validatePassword(this.masterPassword).isValid){
      this.isValidMasterPassword = true;
      return;
    }
    this.isValidMasterPassword = false;
  }

  protected readonly ThemeColors = ThemeColors;
  protected readonly WindowService = WindowService;
}

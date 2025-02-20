import { Component } from '@angular/core';
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {NgOptimizedImage, NgStyle} from "@angular/common";
import {ButtonSizes} from "../../../shared/const/components/sizes/buttonsSizes";
import {ButtonsColors} from "../../../shared/const/colors/buttons/buttonsColors";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {setRandomAnimation} from "../../../utils/animations/logo-animations.utils";
import {SocialLinks} from "../../../shared/const/inks/social.links";

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    SolidButtonComponent,
    NgOptimizedImage,
    NgStyle
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent {
  logoAnimation: string = '';

  ngOnInit(){
    deleteOverflowWindow();
    this.logoAnimation = setRandomAnimation();
  }
  protected readonly ThemeColors = ThemeColors;
  protected readonly SocialLinks = SocialLinks;
}

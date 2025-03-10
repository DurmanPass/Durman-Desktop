import { Component } from '@angular/core';
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";

@Component({
  selector: 'app-account-tab-content',
  standalone: true,
  imports: [
    HeaderDescriptionComponent
  ],
  templateUrl: './account-tab-content.component.html',
  styleUrl: './account-tab-content.component.css'
})
export class AccountTabContentComponent {

}

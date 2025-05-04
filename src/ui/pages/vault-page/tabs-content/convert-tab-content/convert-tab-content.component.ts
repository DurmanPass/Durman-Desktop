import { Component } from '@angular/core';
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";

@Component({
  selector: 'app-convert-tab-content',
  standalone: true,
  imports: [
    HeaderDescriptionComponent
  ],
  templateUrl: './convert-tab-content.component.html',
  styleUrl: './convert-tab-content.component.css'
})
export class ConvertTabContentComponent {

}

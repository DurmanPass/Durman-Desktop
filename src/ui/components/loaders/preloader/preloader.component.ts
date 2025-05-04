import { Component } from '@angular/core';
import {deleteMarginWindow, deleteOverflowWindow} from "../../../../utils/overflow.utils";
import {SpinnerComponent} from "../spinner/spinner.component";

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [
    SpinnerComponent
  ],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.css'
})
export class PreloaderComponent {
  ngOnInit(){
    deleteOverflowWindow();
    deleteMarginWindow();
  }
}

import { Component } from '@angular/core';
import {VersionService} from "../../../../services/version/version.service";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-app-version',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './app-version.component.html',
  styleUrl: './app-version.component.css'
})
export class AppVersionComponent {
  version$ = this.versionService.getAppVersion();
  constructor(private versionService: VersionService) {}

  ngOnInit(): void {
    this.version$.subscribe(version => {
      console.log('AppVersionComponent: Current version:', version);
    });
  }

  protected readonly ThemeColors = ThemeColors;
}

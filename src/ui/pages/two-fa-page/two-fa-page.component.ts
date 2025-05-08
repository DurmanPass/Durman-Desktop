import {Component, Input} from '@angular/core';
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {NgIf} from "@angular/common";
import {RoundButtonComponent} from "../../components/buttons/round-button/round-button.component";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {TextLinkComponent} from "../../components/links/text-link/text-link.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TwoFAService} from "../../../services/routes/twoFA/twoFA.service";

@Component({
  selector: 'app-two-fa-page',
  standalone: true,
    imports: [
        HeaderDescriptionComponent,
        InputComponent,
        NgIf,
        RoundButtonComponent,
        SolidButtonComponent,
        TextLinkComponent,
        HttpClientModule
    ],
  templateUrl: './two-fa-page.component.html',
  styleUrl: './two-fa-page.component.css'
})
export class TwoFaPageComponent {
    @Input() userID: string = '';
    @Input() masterPassword: string = '';
    twoFAcode: string = '';

    constructor(private http: HttpClient) {
    }

    private twoFaService = new TwoFAService(this.http);

    onTwoFaCodeChange(value: string){
        this.twoFAcode = value;
    }

    async onVerifyTwoFA(){
        await this.twoFaService.verify2FA(this.userID, this.twoFAcode, this.masterPassword);
    }
}

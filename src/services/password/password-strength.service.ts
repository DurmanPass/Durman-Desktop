import { Injectable } from '@angular/core';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

@Injectable({
    providedIn: 'root',
})
export class PasswordStrengthService {
    constructor() {
        this.configureZxcvbn();
    }

    private configureZxcvbn(): void {
        const options = {
            translations: zxcvbnEnPackage.translations,
            graphs: zxcvbnCommonPackage.adjacencyGraphs,
            dictionary: {
                ...zxcvbnCommonPackage.dictionary,
                ...zxcvbnEnPackage.dictionary,
            },
        };

        zxcvbnOptions.setOptions(options);
    }

    evaluatePassword(password: string) {
        return zxcvbn(password);
    }

    getPasswordScore(password: string): number {
        return this.evaluatePassword(password).score;
    }

    getPasswordFeedback(password: string) {
        return this.evaluatePassword(password).feedback;
    }
}

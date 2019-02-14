import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';

@Injectable({ providedIn: 'root' })
export class SocialSharingService {
    constructor(
        private socialSharing: SocialSharing
    ) { }

    public share(message?: string, subject?: string, file?: string | string[], url?: string) {
        this.socialSharing.share(message, subject, file, url);
    }
}

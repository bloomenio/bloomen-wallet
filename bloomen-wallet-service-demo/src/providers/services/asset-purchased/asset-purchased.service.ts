import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class EventEmiterAssetPurchased {

    private event: Subject<any>;

    constructor() {
        this.event = new Subject<any>();
    }

    public emitEvent() {
        this.event.next();
    }

    public getEvent() {
        return this.event.asObservable();
    }


}

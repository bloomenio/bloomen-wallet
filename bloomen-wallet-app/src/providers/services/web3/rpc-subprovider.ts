import * as Subprovider from 'web3-provider-engine/subproviders/subprovider';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as createPayload from 'web3-provider-engine/util/create-payload.js';

import * as fromSelectors from '@stores/application-data/application-data.selectors';

// Services
import { Logger } from '@services/logger/logger.service';

// Environment
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { map, share } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';

const log = new Logger('RpcSubprovider');

@Injectable()
export class RpcSubprovider extends Subprovider {
    private _errorStateObserver: BehaviorSubject<boolean>;
    private _targetUrl;
    private _targetSecret;

    constructor(
            private httpClient: HttpClient,
            private store: Store<ApplicationDataStateModel> ) {
        super();
        this._errorStateObserver = new BehaviorSubject(true);
        this.store.select(fromSelectors.getRpc).subscribe((rpc) => {
            if (rpc) {
                this._targetUrl = rpc;
                this._errorStateObserver.next(false);
            }
        });

        this.store.select(fromSelectors.getSecret).subscribe((secret) => {
                this._targetSecret = secret || '';
                this._errorStateObserver.next(false);
        });
    }

    public handleRequest(payload: any, next: any, end: any) {

        if (this._errorStateObserver.getValue()) {
           end('Rpc Error state:true');
           log.debug('Error state or not initialized');
           return;
        }

        const newPayload = createPayload(payload);

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if ((this._targetSecret) && ( this._targetSecret !== '')) {
            headers['Authorization'] = `Bearer ${this._targetSecret}`;
        }

        if ( newPayload.method !== 'eth_subscribe' ) {
            this.httpClient.post(this._targetUrl, newPayload, {
                headers,
            }).pipe(
                map((body: any) =>  body),
            ).subscribe(
                value => {
                    end(null, value.result);
                },
                error => {
                    this._errorStateObserver.next(true);
                    log.error('Rpc Error', error);
                    end('Rpc Error');
                }
            );
        }
    }

    public setErrorState( newState: boolean) {
        this._errorStateObserver.next(newState);
    }

    public getErrorState() {
        return this._errorStateObserver.getValue();
    }

    public errorStateObserver(): Observable<boolean> {
        return this._errorStateObserver.asObservable().pipe(
          share()
        );
    }
}

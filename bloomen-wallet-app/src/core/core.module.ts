import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import { environment } from '@env/environment';

import { RouteReusableStrategy } from './router/route-reusable-strategy';
import { CustomSerializer } from './router/custom-serializer';

import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpService } from './http/http.service';
import { HttpCacheService } from './http/http-cache.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RpcSubprovider } from '@services/web3/rpc-subprovider';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { BloomenContract, PrepaidCardManagerContract, ERC223Contract, MovementHistoryContract,
  AssetsContract, DevicesContract, BurnHistoryContract } from '@services/web3/contracts';

import { reducers, metaReducers } from './core.state';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    RouterModule,
    TranslateModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    environment.production ? [] : StoreDevtoolsModule.instrument({
      name: 'BloomeApp'
    }),
  ],
  providers: [
    Web3Service,
    RpcSubprovider,
    {
      provide: TransactionService,
      useClass: TransactionService,
      deps: [Web3Service]
    },
    HttpCacheService,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    { provide: HttpClient, useClass: HttpService },
    { provide: RouteReuseStrategy, useClass: RouteReusableStrategy },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    BloomenContract,
    PrepaidCardManagerContract,
    ERC223Contract,
    MovementHistoryContract,
    AssetsContract,
    DevicesContract,
    BurnHistoryContract
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    // Import guard
    if (parentModule) {
      throw new Error(
        `${parentModule} has already been loaded. Import Core module in the AppModule only.`
      );
    }
  }
}

export * from '@services/web3/contracts';

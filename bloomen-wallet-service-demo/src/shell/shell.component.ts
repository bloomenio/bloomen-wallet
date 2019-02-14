import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromSelectors from '@stores/application-data/application-data.selectors';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';

import { BloButtonsHostDirective } from '@directives/shell-dapp-options.directive';
import { BloBackButtonHostDirective } from '@directives/shell-back-button.directive';

import { BackButtonShellComponent } from '@components/back-button-shell/back-button-shell.component';

import { Router, NavigationEnd, ActivatedRoute, Route } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Logger } from '@services/logger/logger.service';

import { TransactionService, Transaction } from '@services/web3/transactions/transaction.service';
import { Subscription } from 'rxjs';
import { ObservableMedia } from '@angular/flex-layout';


const log = new Logger('blo-shell');

@Component({
  selector: 'blo-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  public imgToolbar: string;
  public isLoading = false;
  private transactionSubscription: Subscription;

  @ViewChild(BloButtonsHostDirective) public bloButtons: BloButtonsHostDirective;
  @ViewChild(BloBackButtonHostDirective) public bloBackButton: BloBackButtonHostDirective;

  constructor(
    private titleService: Title,
    private store: Store<ApplicationDataStateModel>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private media: ObservableMedia,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService
  ) {
  }

  public ngOnDestroy() {
    this.unregister();
  }

  public ngOnInit() {
    this.register();
    this.store.select(fromSelectors.getTheme).subscribe((theme) => {
      this._themeChanges(theme);
    });

    this.findChildRoute(this.activatedRoute).data.subscribe(event => {
      this.loadAuxiliarOptions(event);
      this.loadBackButton(event);
    });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe((event) => {
      this.loadAuxiliarOptions(event);
      this.loadBackButton(event);
    });
  }

  private findChildRoute(route): Route {
    if (route.firstChild === null) {
      return route;
    } else {
      return this.findChildRoute(route.firstChild);
    }
  }

  private loadBackButton(event) {
    this.bloBackButton.viewContainerRef.clear();
    if (event.shellOptions && event.shellOptions.hasBackButton) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(BackButtonShellComponent);
      this.bloBackButton.viewContainerRef.createComponent(componentFactory);
    }
  }

  private loadAuxiliarOptions(event) {
    this.bloButtons.viewContainerRef.clear();
    if (event.shellOptions && event.shellOptions.auxiliarOptionsComponent) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(event.shellOptions.auxiliarOptionsComponent);
      this.bloButtons.viewContainerRef.createComponent(componentFactory);
    }
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  private _themeChanges(theme) {
    switch (theme) {
      // case THEMES['BLOOMEN']:
      //   this.imgToolbar = 'logo_bloomen';
      //   break;
      // case THEMES['ANT1-DAPP']:
      //   this.imgToolbar = 'logo_ant1';
      //   break;
      // case THEMES['DEMO-DAPP']:
      //   this.imgToolbar = 'logo_demo';
      //   break;
      default:
        this.imgToolbar = 'logo_bloomen';
    }
  }

  private register() {

    this.transactionSubscription = this.transactionService
      .getTransactions().subscribe((transactions: Transaction[]) => {
        this.isLoading = transactions.length > 0;
      });
  }
  private unregister() {
    this.transactionSubscription.unsubscribe();
    this.transactionSubscription = null;
  }
}

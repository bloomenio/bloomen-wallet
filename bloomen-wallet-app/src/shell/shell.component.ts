import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromSelectors from '@stores/application-data/application-data.selectors';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';

import { BloButtonsHostDirective } from '@directives/shell-dapp-options.directive';
import { BloBackButtonHostDirective } from '@directives/shell-back-button.directive';

import { BackButtonShellComponent } from '@components/back-button-shell/back-button-shell.component';

import { Router, NavigationEnd, ActivatedRoute, Route } from '@angular/router';
import { filter, map, mergeMap, delay } from 'rxjs/operators';
import { Logger } from '@services/logger/logger.service';

import { TransactionService, Transaction } from '@services/web3/transactions/transaction.service';
import { Subscription, Observable } from 'rxjs';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';


const log = new Logger('blo-shell');

@Component({
  selector: 'blo-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  public imgToolbar: string;
  public isLoading: boolean;
  public isLoadingCamera$: Observable<boolean>;
  private transactionSubscription: Subscription;
  private isLoadingCameraSubscription: Subscription;



  @ViewChild(BloButtonsHostDirective, {static: true}) public bloButtons: BloButtonsHostDirective;
  @ViewChild(BloBackButtonHostDirective, {static: true}) public bloBackButton: BloBackButtonHostDirective;

  constructor(
    private titleService: Title,
    private store: Store<ApplicationDataStateModel>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private barCodeScannerService: BarCodeScannerService
  ) {
  }

  public ngOnDestroy() {
    this.unregister();
  }

  public ngOnInit() {
    this.isLoading = false;
    this.isLoadingCamera$ = this.barCodeScannerService.isLoading();
    this.register();

    this.store.select(fromSelectors.getTheme).pipe(
      map((theme) => {
        if (theme) {
          return theme.endsWith('theme-dark') ? 'logo_bloomen_white' : 'logo_bloomen_black';
        }
      }),
      delay(0)).subscribe((iconName) => {
        this.imgToolbar = iconName;
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

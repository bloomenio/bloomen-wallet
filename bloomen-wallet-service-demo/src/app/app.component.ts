import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { I18nService } from '@services/i18n/i18n.service';
import { Logger } from '@services/logger/logger.service';

import { Store, select } from '@ngrx/store';

import * as fromSelectors from '@stores/application-data/application-data.selectors';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';

import { PreloadImages } from '@services/preload-images/preload-images.service';

const log = new Logger('App');

@Component({
  selector: 'blo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public theme$: Observable<string>;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private i18nService: I18nService,
    private store: Store<ApplicationDataStateModel>,
    private preloadImages: PreloadImages
  ) { }

  public ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    this.theme$ = this.store.pipe(select(fromSelectors.getTheme));

    // Setup translations
    this.i18nService.init(
      environment.defaultLanguage,
      environment.supportedLanguages
    );

    const onNavigationEnd = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });

    // Preload Images

    // Videos
    this.preloadImages.preload('assets/videos/ConnectedOffice.png');
    this.preloadImages.preload('assets/videos/hololens.png');
    this.preloadImages.preload('assets/videos/smartretail.png');
    this.preloadImages.preload('assets/videos/symbiote.png');
    this.preloadImages.preload('assets/videos/wearlumb.png');

    // Mobility
    this.preloadImages.preload('assets/mobility/img_background_green_car.png');
    this.preloadImages.preload('assets/mobility/img_background_motorcycle.png');
    this.preloadImages.preload('assets/mobility/img_background_scooter.png');
    this.preloadImages.preload('assets/mobility/img_background_yellow_car.png');
    this.preloadImages.preload('assets/mobility/img_detail_green_car.png');
    this.preloadImages.preload('assets/mobility/img_detail_motorcycle.png');
    this.preloadImages.preload('assets/mobility/img_detail_scooter.png');
    this.preloadImages.preload('assets/mobility/img_detail_yellow_car.png');

    // Smart office
    this.preloadImages.preload('assets/smart-office/img_background_printer.png');
    this.preloadImages.preload('assets/smart-office/img_background_reserve_desk.png');
    this.preloadImages.preload('assets/smart-office/img_background_reserve_meeting_room.png');
    this.preloadImages.preload('assets/smart-office/img_detail_printer.png');
    this.preloadImages.preload('assets/smart-office/img_detail_reserve_desk.png');
    this.preloadImages.preload('assets/smart-office/img_detail_reserve_meeting_room.png');

    // Cards
    this.preloadImages.preload('assets/cards/bloomen_card_0.png');
    this.preloadImages.preload('assets/cards/bloomen_card_1.png');
    this.preloadImages.preload('assets/cards/bloomen_card_2.png');
    this.preloadImages.preload('assets/cards/bloomen_card_3.png');
    this.preloadImages.preload('assets/cards/bloomen_card_4.png');
    this.preloadImages.preload('assets/cards/bloomen_card_5.png');
    this.preloadImages.preload('assets/cards/bloomen_card_6.png');
    this.preloadImages.preload('assets/cards/bloomen_card_7.png');
    this.preloadImages.preload('assets/cards/bloomen_card_8.png');
    this.preloadImages.preload('assets/cards/bloomen_card_9.png');
    this.preloadImages.preload('assets/cards/bloomen_card_10.png');
    this.preloadImages.preload('assets/cards/bloomen_card_11.png');
    this.preloadImages.preload('assets/cards/bloomen_card_12.png');
    this.preloadImages.preload('assets/cards/bloomen_card_13.png');
    this.preloadImages.preload('assets/cards/bloomen_card_14.png');
    this.preloadImages.preload('assets/cards/bloomen_card_15.png');
    this.preloadImages.preload('assets/cards/bloomen_card_16.png');
    this.preloadImages.preload('assets/cards/bloomen_card_17.png');
    this.preloadImages.preload('assets/cards/bloomen_card_18.png');
    this.preloadImages.preload('assets/cards/bloomen_card_19.png');
  }
}

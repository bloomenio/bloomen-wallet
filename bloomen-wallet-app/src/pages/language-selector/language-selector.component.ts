import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { I18nService } from '@services/i18n/i18n.service';

import { Store } from '@ngrx/store';
import * as fromSelectors from '@stores/application-data/application-data.selectors';
import * as fromActions from '@stores/application-data/application-data.actions';

@Component({
  selector: 'blo-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  private isFirstRun: Boolean;

  constructor(
    private i18nService: I18nService,
    private router: Router,
    private store: Store<any>
  ) { }

  public ngOnInit() {
    this.store.select(fromSelectors.getIsFirstRun).subscribe(isFirstRun => {
      this.isFirstRun = isFirstRun;
    });
  }


  public setLanguage(language: string) {
    this.store.dispatch(new fromActions.ChangeLanguage({ language }));
    if (this.isFirstRun) {
      this.router.navigate(['tutorial']);
    } else {
      this.router.navigate(['home']);
    }
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  /**
   * track by for ngFor.
   * @param index index on the array;
   */
  public trackByFn(index: number) {
    return index;
  }
}

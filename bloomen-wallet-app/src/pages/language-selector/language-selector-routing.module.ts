import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { LanguageSelectorComponent } from './language-selector.component';

const routes: Routes = [
  {
    path: '',
    component: LanguageSelectorComponent,
    data: { title: extract('Language selector') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LanguageSelectorRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { BloomenCardsComponent } from './bloomen-cards.component';


const routes: Routes = [
  {
    path: '',
    component: BloomenCardsComponent,
    data: {
      title: extract('Bloomen Cards'),
      shellOptions: {
        hasBackButton: true
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BloomenCardsRoutingModule { }

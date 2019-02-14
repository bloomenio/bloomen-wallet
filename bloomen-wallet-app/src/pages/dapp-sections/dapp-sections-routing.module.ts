import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { DappSectionsComponent } from './dapp-sections.component';

import { DappOptionsShellComponent } from '@components/dapp-options-shell/dapp-options-shell.component';

const routes: Routes = [
  {
    path: '',
    component: DappSectionsComponent,
    data: {
      title: extract('Dapp'),
      shellOptions: {
        hasBackButton: false,
        auxiliarOptionsComponent: DappOptionsShellComponent
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DappSectionsRoutingModule { }

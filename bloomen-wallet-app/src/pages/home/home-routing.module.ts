import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { HomeComponent } from './home.component';
import { Shell } from '@shell/shell.service';
import { HomeGuardRouteService } from '@services/home-guard-route/home-guard-route.service';
import { HomeOptionsShellComponent } from '@components/home-options-shell/home-options-shell.component';


const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
      path: 'home',
      component: HomeComponent,
      data: {
        title: extract('Home'),
        shellOptions: {
          hasBackButton: false,
          auxiliarOptionsComponent: HomeOptionsShellComponent
        }
      },
      canActivate: [HomeGuardRouteService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }

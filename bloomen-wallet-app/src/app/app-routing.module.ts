import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@shell/shell.service';

const routes: Routes = [
  {
    path: 'tutorial',
    loadChildren: 'pages/tutorial/tutorial.module#TutorialModule'
  },
  {
    path: 'language-selector',
    loadChildren:
      'pages/language-selector/language-selector.module#LanguageSelectorModule'
  },
  {
    path: 'restore-account/:address',
    loadChildren: 'pages/restore-account/restore-account.module#RestoreAccountModule'
  },
  Shell.childRoutes([
    {
      path: 'dapp/:address',
      loadChildren: 'pages/dapp-sections/dapp-sections.module#DappSectionsModule'
    },
    {
      path: 'dapp/:address/send-cash',
      loadChildren: 'pages/send-cash/send-cash.module#SendCashModule',
    },
    {
      path: 'dapp/:address/notifications/:assetId',
      loadChildren: 'pages/notification-detail/notification-detail.module#NotificationDetailModule'
    }
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true
    })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'bloomen-cards',
      loadChildren: 'pages/bloomen-cards/bloomen-cards.module#BloomenCardsModule'
    },
    {
      path: 'videos',
      loadChildren: 'pages/videos/videos.module#VideosModule'
    },
    {
      path: 'videos/video-player/:videoId',
      loadChildren: 'pages/video-player/video-player.module#VideoPlayerModule'
    },
    {
      path: 'mobility',
      loadChildren: 'pages/mobility/mobility.module#MobilityModule'
    },
    {
      path: 'mobility/mobility-exchange/:mobilityId',
      loadChildren: 'pages/mobility-exchange/mobility-exchange.module#MobilityExchangeModule'
    },
    {
      path: 'smart-office',
      loadChildren: 'pages/smart-office/smart-office.module#SmartOfficeModule'
    },
    {
      path: 'smart-office/smart-office-exchange/:smartOfficeId',
      loadChildren: 'pages/smart-office-exchange/smart-office-exchange.module#SmartOfficeExchangeModule'
    },
    {
      path: 'balance-dashboard',
      loadChildren: 'pages/balance-dashboard/balance-dashboard.module#BalanceDashboardModule'
    },
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

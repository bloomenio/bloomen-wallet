// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { WizardModule } from '@components/wizard/wizard.module';
import { TutorialRoutingModule } from './tutorial-routing.module';

// Components
import { TutorialComponent } from './tutorial.component';

/**
 * Module to import and export all the components for the tutorial page.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    TutorialRoutingModule,
    WizardModule
  ],
  declarations: [TutorialComponent]
})
export class TutorialModule {}

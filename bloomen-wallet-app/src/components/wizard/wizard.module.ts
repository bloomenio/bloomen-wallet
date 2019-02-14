// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';

// Components
import { WizardComponent } from './wizard.component';

/**
 * Module to import and export all the components for the wizzard component.
 */
@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    TranslateModule,
    FlexLayoutModule
  ],
  declarations: [WizardComponent],
  exports: [WizardComponent]
})
export class WizardModule {}

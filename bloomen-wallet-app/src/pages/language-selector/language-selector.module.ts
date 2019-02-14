// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';
import { LanguageSelectorRoutingModule } from './language-selector-routing.module';

// Components
import { LanguageSelectorComponent } from './language-selector.component';

/**
 * Module to import and export all the components for the language-selector page.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    LanguageSelectorRoutingModule
  ],
  declarations: [LanguageSelectorComponent]
})
export class LanguageSelectorModule {}

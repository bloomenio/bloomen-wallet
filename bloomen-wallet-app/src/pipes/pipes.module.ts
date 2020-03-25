import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyDecimalsPipe } from './apply-decimals.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ApplyDecimalsPipe],
    exports: [ApplyDecimalsPipe]
})
export class PipesModule { }

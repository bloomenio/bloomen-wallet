// Basic
import { Component, OnInit } from '@angular/core';
import { Logger } from '@services/logger/logger.service';

const log = new Logger('wizard.component');

/**
 * Wizard component
 */
@Component({
  selector: 'blo-wizard',
  templateUrl: 'wizard.component.html',
  styleUrls: ['wizard.component.scss']
})
export class WizardComponent implements OnInit {

  public steps: number;
  public step: number;
  public range: number[];
  public isLastStep: boolean;

  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor() { }

  public ngOnInit() {
    this.step = 0;
    this.steps = 6;
    this.range = new Array(this.steps);
    this.isLastStep = this._isLastStep();
  }

  public nextSlide() {
    if (this.step < this.steps - 1) {
      this.step++;
      this.isLastStep = this._isLastStep();
    }
  }

  public previousSlide() {
    if (this.step > 0) {
      this.step--;
      this.isLastStep = this._isLastStep();
    }
  }

  public getBullet(index: number): string {
    const path = 'url(assets/icons/img_bullet_slide_STATE.png)';
    return index === this.step
      ? path.replace('STATE', 'selected')
      : path.replace('STATE', 'default');
  }

  public navegateToStep(index) {
    this.step = index;
    this.isLastStep = this._isLastStep();
  }

  private _isLastStep(): boolean {
    return this.step === this.steps - 1;
  }

  /**
   * track by for ngFor.
   * @param index index on the array;
   */
  public trackByFn(index: number) {
    return index;
  }
}

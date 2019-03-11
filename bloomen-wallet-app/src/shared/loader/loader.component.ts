import { Component, Input } from '@angular/core';

@Component({
  selector: 'blo-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  public lottieConfig: Object;
  public lottieConfigCamera: Object;
  private anim: any;
  private animationSpeed = 1;
  @Input() public isLoading: boolean;
  @Input() public isLoadingCamera: boolean;
  @Input() public size = 1;
  @Input() public message: string;

  constructor() {
    this.lottieConfig = {
      path: 'assets/animation/animationData.json',
      renderer: 'svg',
      autoplay: true,
      loop: true
    }
    this.lottieConfigCamera = {
      path: 'assets/animation/loadingCamera.json',
      renderer: 'svg',
      autoplay: true,
      loop: true
    }
  }

  public handleAnimation(anim: any) {
    this.anim = anim;
  }

  public stop() {
    this.anim.stop();
  }

  public play() {
    this.anim.play();
  }

  public pause() {
    this.anim.pause();
  }

  public setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }
}

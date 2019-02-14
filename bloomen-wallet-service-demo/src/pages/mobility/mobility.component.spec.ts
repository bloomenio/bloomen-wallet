import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/index';
import { MaterialModule } from '@app/material.module';
import { MobilityComponent } from './mobility.component';

describe('HomeComponent', () => {
  let component: MobilityComponent;
  let fixture: ComponentFixture<MobilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
        CoreModule,
        SharedModule,
        HttpClientTestingModule
      ],
      declarations: [MobilityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

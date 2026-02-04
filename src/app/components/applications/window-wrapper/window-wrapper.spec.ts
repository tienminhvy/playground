import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowWrapper } from './window-wrapper';

describe('WindowWrapper', () => {
  let component: WindowWrapper;
  let fixture: ComponentFixture<WindowWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

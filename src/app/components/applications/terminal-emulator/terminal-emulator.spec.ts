import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalEmulator } from './terminal-emulator';

describe('TerminalEmulator', () => {
  let component: TerminalEmulator;
  let fixture: ComponentFixture<TerminalEmulator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalEmulator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalEmulator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

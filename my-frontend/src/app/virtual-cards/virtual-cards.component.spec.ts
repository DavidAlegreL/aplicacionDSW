import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualCardsComponent } from './virtual-cards.component';

describe('VirtualCardsComponent', () => {
  let component: VirtualCardsComponent;
  let fixture: ComponentFixture<VirtualCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevlistComponent } from './devlist.component';

describe('DevlistComponent', () => {
  let component: DevlistComponent;
  let fixture: ComponentFixture<DevlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

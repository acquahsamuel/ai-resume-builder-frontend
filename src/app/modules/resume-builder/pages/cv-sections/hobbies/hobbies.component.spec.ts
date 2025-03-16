import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbiesComponent } from './hobbies.component';

describe('HobbiesComponent', () => {
  let component: HobbiesComponent;
  let fixture: ComponentFixture<HobbiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HobbiesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(HobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

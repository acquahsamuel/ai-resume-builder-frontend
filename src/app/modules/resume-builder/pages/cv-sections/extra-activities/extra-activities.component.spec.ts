import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraActivitiesComponent } from './extra-activities.component';

describe('ExtraActivitiesComponent', () => {
  let component: ExtraActivitiesComponent;
  let fixture: ComponentFixture<ExtraActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ExtraActivitiesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ExtraActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

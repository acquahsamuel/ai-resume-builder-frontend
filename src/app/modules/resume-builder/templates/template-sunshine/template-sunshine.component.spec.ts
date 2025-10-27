import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSunshineComponent } from './template-sunshine.component';

describe('TemplateSunshineComponent', () => {
  let component: TemplateSunshineComponent;
  let fixture: ComponentFixture<TemplateSunshineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplateSunshineComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateSunshineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

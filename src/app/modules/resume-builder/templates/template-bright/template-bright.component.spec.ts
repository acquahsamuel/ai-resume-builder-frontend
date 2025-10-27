import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBrightComponent } from './template-bright.component';

describe('TemplateBrightComponent', () => {
  let component: TemplateBrightComponent;
  let fixture: ComponentFixture<TemplateBrightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplateBrightComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateBrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

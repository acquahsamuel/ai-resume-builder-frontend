import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateUptownComponent } from './template-uptown.component';

describe('TemplateUptownComponent', () => {
  let component: TemplateUptownComponent;
  let fixture: ComponentFixture<TemplateUptownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TemplateUptownComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateUptownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

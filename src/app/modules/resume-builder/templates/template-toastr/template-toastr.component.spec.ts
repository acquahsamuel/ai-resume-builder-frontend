import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateToastrComponent } from './template-toastr.component';

describe('TemplateToastrComponent', () => {
  let component: TemplateToastrComponent;
  let fixture: ComponentFixture<TemplateToastrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TemplateToastrComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateToastrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

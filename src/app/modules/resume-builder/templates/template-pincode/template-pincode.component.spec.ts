import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePincodeComponent } from './template-pincode.component';

describe('TemplatePincodeComponent', () => {
  let component: TemplatePincodeComponent;
  let fixture: ComponentFixture<TemplatePincodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplatePincodeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplatePincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

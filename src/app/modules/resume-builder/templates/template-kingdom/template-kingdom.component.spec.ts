import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateKingdomComponent } from './template-kingdom.component';

describe('TemplateKingdomComponent', () => {
  let component: TemplateKingdomComponent;
  let fixture: ComponentFixture<TemplateKingdomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplateKingdomComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateKingdomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

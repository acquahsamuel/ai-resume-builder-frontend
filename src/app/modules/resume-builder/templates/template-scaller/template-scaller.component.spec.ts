import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateScallerComponent } from './template-scaller.component';

describe('TemplateScallerComponent', () => {
  let component: TemplateScallerComponent;
  let fixture: ComponentFixture<TemplateScallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplateScallerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateScallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

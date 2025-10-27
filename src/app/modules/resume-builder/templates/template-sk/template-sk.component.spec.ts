import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSkComponent } from './template-sk.component';

describe('TemplateSkComponent', () => {
  let component: TemplateSkComponent;
  let fixture: ComponentFixture<TemplateSkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TemplateSkComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TemplateSkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
